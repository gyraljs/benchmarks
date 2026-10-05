import { matches } from '@bench/shared/search';
import { expect, test, type Page } from '@playwright/test';

// One behavioural spec for every implementation. Locators pierce open shadow roots, so the
// same selectors work for Lit and Gyral (shadow DOM) and the others (light DOM).
const FRAMEWORKS = [
  'gyral',
  'gyral-noeffect',
  'gyral-twotrack',
  'lit',
  'react',
  'preact',
  'vue',
  'svelte',
  'solid',
] as const;

const open = async (page: Page, fw: string, app: string) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto(`/${fw}/${app}/`);
  return errors;
};

for (const fw of FRAMEWORKS) {
  test.describe(fw, () => {
    test('floor renders', async ({ page }) => {
      const errors = await open(page, fw, 'floor');
      await expect(page.locator('#hello')).toHaveText('Hello');
      expect(errors).toEqual([]);
    });

    test('counter counts', async ({ page }) => {
      const errors = await open(page, fw, 'counter');
      const inc = page.locator('#inc');
      await inc.click();
      await inc.click();
      await inc.click();
      await page.locator('#dec').click();
      await expect(page.locator('#count')).toHaveText('2');
      expect(errors).toEqual([]);
    });

    test('todo adds, toggles, filters and removes', async ({ page }) => {
      const errors = await open(page, fw, 'todo');
      const input = page.locator('#new-todo');
      const items = page.locator('#todo-list li');
      for (const title of ['alpha', 'beta', 'gamma']) {
        await input.fill(title);
        await input.press('Enter');
        await expect(input).toHaveValue('');
      }
      await input.fill('   ');
      await input.press('Enter');
      await expect(items).toHaveCount(3);

      await items.nth(1).locator('.toggle').check();
      await expect(items.nth(1)).toHaveClass(/completed/);
      await expect(page.locator('#remaining')).toHaveText('2 left');

      await page.locator('[data-filter="active"]').click();
      await expect(items.locator('.title')).toHaveText(['alpha', 'gamma']);
      await expect(page.locator('[data-filter="active"]')).toHaveAttribute('aria-pressed', 'true');
      await page.locator('[data-filter="completed"]').click();
      await expect(items.locator('.title')).toHaveText(['beta']);
      await page.locator('[data-filter="all"]').click();
      await expect(items).toHaveCount(3);

      await items.nth(0).locator('.destroy').click();
      await expect(items.locator('.title')).toHaveText(['beta', 'gamma']);
      await expect(page.locator('#remaining')).toHaveText('1 left');
      expect(errors).toEqual([]);
    });

    test('search shows only the latest query', async ({ page }) => {
      const errors = await open(page, fw, 'search');
      const q = page.locator('#q');
      // 'a' is sent (300 ms latency), then 'app' (100 ms) answers first: the stale 'a'
      // answer arrives later and must be ignored.
      await q.pressSequentially('a');
      await page.waitForTimeout(220);
      await q.pressSequentially('pp');
      const expected = matches('app');
      await expect(page.locator('#status')).toHaveText(`${expected.length} results`);
      await page.waitForTimeout(500);
      await expect(page.locator('#results li')).toHaveText(expected);
      await expect(page.locator('#status')).toHaveText(`${expected.length} results`);

      await q.fill('');
      await expect(page.locator('#results li')).toHaveCount(0);
      expect(errors).toEqual([]);
    });

    test('form validates and submits', async ({ page }) => {
      const errors = await open(page, fw, 'form');
      await expect(page.locator('.error')).toHaveCount(0);
      await page.locator('#submit').click();
      await expect(page.locator('.error')).toHaveCount(4);
      await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#success')).toHaveCount(0);

      await page.locator('#email').fill('ada@example.com');
      await expect(page.locator('#email-error')).toHaveCount(0);
      await page.locator('#password').fill('short');
      await expect(page.locator('#password-error')).toBeVisible();
      await page.locator('#password').fill('analytical1');
      await page.locator('#confirm').fill('analytical1');
      await page.locator('#terms').check();
      await expect(page.locator('.error')).toHaveCount(0);

      await page.locator('#submit').click();
      await expect(page.locator('#success')).toHaveText('Welcome, ada@example.com!');
      expect(errors).toEqual([]);
    });

    test('table operations', async ({ page }) => {
      const errors = await open(page, fw, 'table');
      const rows = page.locator('#tbody tr');
      const ids = async () => rows.locator('.col-id').allTextContents();

      await page.locator('#run').click();
      await expect(rows).toHaveCount(1000);
      const first = await ids();

      await page.locator('#update').click();
      await expect(rows.nth(0).locator('.lbl')).toHaveText(/ !!!\s*$/);
      await expect(rows.nth(10).locator('.lbl')).toHaveText(/ !!!\s*$/);
      await expect(rows.nth(1).locator('.lbl')).not.toHaveText(/ !!!\s*$/);

      await rows.nth(2).locator('.lbl').click();
      await expect(rows.nth(2)).toHaveClass(/danger/);
      await expect(page.locator('#tbody tr.danger')).toHaveCount(1);

      await page.locator('#swaprows').click();
      await expect(rows.nth(1).locator('.col-id')).toHaveText(first[998] ?? '');
      await expect(rows.nth(998).locator('.col-id')).toHaveText(first[1] ?? '');

      await rows.nth(0).locator('.remove').click();
      await expect(rows).toHaveCount(999);
      await expect(rows.nth(0).locator('.col-id')).toHaveText(first[998] ?? '');

      await page.locator('#add').click();
      await expect(rows).toHaveCount(1999);

      await page.locator('#run').click();
      await expect(rows).toHaveCount(1000);
      const replaced = await ids();
      expect(replaced[0]).not.toBe(first[0]);

      await page.locator('#clear').click();
      await expect(rows).toHaveCount(0);
      await page.locator('#runlots').click();
      await expect(rows).toHaveCount(10000);
      expect(errors).toEqual([]);
    });
  });
}
