import { useState } from 'react';
import { createRoot } from 'react-dom/client';

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

createRoot(document.getElementById('app') as HTMLElement).render(<Counter />);
