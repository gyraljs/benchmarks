import { render } from 'preact';

render(<p id="hello">Hello</p>, document.getElementById('app') as HTMLElement);
