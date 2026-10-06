# JS self time by module (median of 7, ms, CPU 4x)

## create 1,000 rows

| | app | gyral core | effect | lit | native DOM | gc | program | other |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| gyral | 1.1 | 0.4 | 0.0 | 14.4 | 55.9 | 11.9 | 266.7 | 0.0 |
| lit | 0.7 | 0.0 | 0.0 | 18.3 | 52.3 | 13.8 | 259.0 | 0.0 |

Top self time, gyral:

- 25.66 ms importNode :0 [native DOM]
- 14.97 ms insertBefore :0 [native DOM]
- 5.61 ms setAttribute :0 [native DOM]
- 3.94 ms u lit-html/lit-html-RMLDE0lA.js:124 [lit]
- 3.20 ms nextNode :0 [native DOM]
- 2.53 ms createTextNode :0 [native DOM]
- 1.46 ms createComment :0 [native DOM]
- 1.08 ms $ lit-html/lit-html-RMLDE0lA.js:172 [lit]
- 1.08 ms holds :14 [native DOM]
- 0.75 ms _ lit-html/lit-html-RMLDE0lA.js:169 [lit]
- 0.73 ms _$AI lit-html/lit-html-RMLDE0lA.js:211 [lit]
- 0.73 ms _$AI lit-html/lit-html-RMLDE0lA.js:160 [lit]

Top self time, lit:

- 23.49 ms importNode :0 [native DOM]
- 13.04 ms insertBefore :0 [native DOM]
- 5.18 ms addEventListener :0 [native DOM]
- 4.42 ms u lit-html/lit-html-RMLDE0lA.js:124 [lit]
- 3.42 ms nextNode :0 [native DOM]
- 2.70 ms createTextNode :0 [native DOM]
- 1.72 ms p lit-html/lit-html-RMLDE0lA.js:137 [lit]
- 1.37 ms setAttribute :0 [native DOM]
- 1.37 ms _$AI lit-html/lit-html-RMLDE0lA.js:246 [lit]
- 1.32 ms createComment :0 [native DOM]
- 1.03 ms _ lit-html/lit-html-RMLDE0lA.js:169 [lit]
- 1.02 ms $ lit-html/lit-html-RMLDE0lA.js:172 [lit]

## update every 10th row

| | app | gyral core | effect | lit | native DOM | gc | program | other |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| gyral | 0.4 | 0.9 | 0.0 | 5.2 | 0.9 | 0.0 | 112.6 | 0.0 |
| lit | 0.4 | 0.0 | 0.0 | 5.2 | 0.8 | 0.0 | 92.9 | 0.0 |

Top self time, gyral:

- 1.31 ms p lit-html/lit-html-RMLDE0lA.js:137 [lit]
- 0.88 ms _ lit-html/lit-html-RMLDE0lA.js:169 [lit]
- 0.85 ms _$AI lit-html/lit-html-RMLDE0lA.js:211 [lit]
- 0.44 ms S lit-html/lit-html-RMLDE0lA.js:108 [lit]
- 0.44 ms _$AI lit-html/lit-html-RMLDE0lA.js:160 [lit]
- 0.43 ms indentedRow table/main-DGZe2A1o.js:10 [app]
- 0.43 ms $ lit-html/lit-html-RMLDE0lA.js:172 [lit]
- 0.42 ms update directives/repeat-CRifemuh.js:33 [lit]
- 0.00 ms listener :7995 [native DOM]
- 0.00 ms handleIntent dist/intent-BOB2fk7Q.js:115 [gyral core]
- 0.00 ms Update table/main-DGZe2A1o.js:71 [app]
- 0.00 ms get dist/intent-BOB2fk7Q.js:108 [gyral core]

Top self time, lit:

- 1.14 ms _ lit-html/lit-html-RMLDE0lA.js:169 [lit]
- 0.77 ms p lit-html/lit-html-RMLDE0lA.js:137 [lit]
- 0.76 ms _$AI lit-html/lit-html-RMLDE0lA.js:160 [lit]
- 0.39 ms S lit-html/lit-html-RMLDE0lA.js:108 [lit]
- 0.39 ms _$AI lit-html/lit-html-RMLDE0lA.js:246 [lit]
- 0.38 ms evaluate :305 [native DOM]
- 0.38 ms dt directives/repeat-CRifemuh.js:19 [lit]
- 0.00 ms _$EM reactive-element/reactive-element-Bv7rsefd.js:212 [lit]
- 0.00 ms update directives/repeat-CRifemuh.js:33 [lit]
- 0.00 ms (anonymous) :1 [native DOM]
- 0.00 ms (anonymous) :0 [native DOM]
- 0.00 ms indentedRow table/main-CSNeCSlc.js:12 [app]

## select row

| | app | gyral core | effect | lit | native DOM | gc | program | other |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| gyral | 0.5 | 1.1 | 0.0 | 4.3 | 0.5 | 0.0 | 22.3 | 0.0 |
| lit | 0.4 | 0.0 | 0.0 | 4.2 | 0.9 | 0.0 | 18.1 | 0.0 |

Top self time, gyral:

- 0.55 ms S lit-html/lit-html-RMLDE0lA.js:108 [lit]
- 0.55 ms p lit-html/lit-html-RMLDE0lA.js:137 [lit]
- 0.54 ms $ lit-html/lit-html-RMLDE0lA.js:172 [lit]
- 0.53 ms findIntentElement dist/intent-BOB2fk7Q.js:76 [gyral core]
- 0.53 ms indentedRow table/main-DGZe2A1o.js:10 [app]
- 0.53 ms _$AI lit-html/lit-html-RMLDE0lA.js:211 [lit]
- 0.53 ms c lit-html/lit-html-RMLDE0lA.js:16 [lit]
- 0.00 ms Element.#deliver dist/define-BkEB3Dv2.js:64 [gyral core]
- 0.00 ms update directives/repeat-CRifemuh.js:33 [lit]
- 0.00 ms performUpdate reactive-element/reactive-element-Bv7rsefd.js:186 [lit]
- 0.00 ms (anonymous) :0 [native DOM]
- 0.00 ms defaultTrigger dist/intent-BOB2fk7Q.js:36 [gyral core]

Top self time, lit:

- 0.87 ms _$AI lit-html/lit-html-RMLDE0lA.js:246 [lit]
- 0.48 ms S lit-html/lit-html-RMLDE0lA.js:108 [lit]
- 0.45 ms _$AI lit-html/lit-html-RMLDE0lA.js:160 [lit]
- 0.45 ms $ lit-html/lit-html-RMLDE0lA.js:172 [lit]
- 0.45 ms (anonymous) :0 [native DOM]
- 0.44 ms evaluate :305 [native DOM]
- 0.44 ms indentedRow table/main-CSNeCSlc.js:12 [app]
- 0.44 ms p lit-html/lit-html-RMLDE0lA.js:137 [lit]
- 0.44 ms _$AI lit-html/lit-html-RMLDE0lA.js:211 [lit]
- 0.00 ms set reactive-element/reactive-element-Bv7rsefd.js:63 [lit]
- 0.00 ms performUpdate reactive-element/reactive-element-Bv7rsefd.js:186 [lit]
- 0.00 ms dt directives/repeat-CRifemuh.js:19 [lit]

## swap rows

| | app | gyral core | effect | lit | native DOM | gc | program | other |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| gyral | 0.5 | 0.9 | 0.0 | 3.6 | 2.4 | 0.0 | 60.7 | 0.0 |
| lit | 0.8 | 0.0 | 0.0 | 4.1 | 2.1 | 0.0 | 52.5 | 0.0 |

Top self time, gyral:

- 1.47 ms rowAt :9 [native DOM]
- 0.90 ms S lit-html/lit-html-RMLDE0lA.js:108 [lit]
- 0.49 ms p lit-html/lit-html-RMLDE0lA.js:137 [lit]
- 0.47 ms $ lit-html/lit-html-RMLDE0lA.js:172 [lit]
- 0.46 ms c lit-html/lit-html-RMLDE0lA.js:16 [lit]
- 0.45 ms evaluate :305 [native DOM]
- 0.45 ms indentedRow table/main-DGZe2A1o.js:10 [app]
- 0.00 ms defaultTrigger dist/intent-BOB2fk7Q.js:36 [gyral core]
- 0.00 ms valueOf dist/intent-BOB2fk7Q.js:82 [gyral core]
- 0.00 ms view table/main-DGZe2A1o.js:95 [app]
- 0.00 ms r lit-html/directive-helpers-B0WjmYWh.js:7 [lit]
- 0.00 ms readIntent dist/intent-BOB2fk7Q.js:86 [gyral core]

Top self time, lit:

- 0.84 ms rowAt :9 [native DOM]
- 0.42 ms _$AI lit-html/lit-html-RMLDE0lA.js:246 [lit]
- 0.41 ms p lit-html/lit-html-RMLDE0lA.js:137 [lit]
- 0.41 ms _$AI lit-html/lit-html-RMLDE0lA.js:160 [lit]
- 0.41 ms $ lit-html/lit-html-RMLDE0lA.js:172 [lit]
- 0.41 ms S lit-html/lit-html-RMLDE0lA.js:108 [lit]
- 0.41 ms evaluate :305 [native DOM]
- 0.41 ms indentedRow table/main-CSNeCSlc.js:12 [app]
- 0.40 ms dt directives/repeat-CRifemuh.js:19 [lit]
- 0.40 ms parseEvaluationResultValue :106 [native DOM]
- 0.00 ms set reactive-element/reactive-element-Bv7rsefd.js:63 [lit]
- 0.00 ms update directives/repeat-CRifemuh.js:33 [lit]

