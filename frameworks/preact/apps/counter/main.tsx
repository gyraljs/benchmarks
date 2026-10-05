import { render } from 'preact';
import { useState } from 'preact/hooks';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button id="dec" type="button" onClick={() => setCount((c) => c - 1)}>
        -
      </button>
      <output id="count">{count}</output>
      <button id="inc" type="button" onClick={() => setCount((c) => c + 1)}>
        +
      </button>
    </>
  );
}

render(<Counter />, document.getElementById('app') as HTMLElement);
