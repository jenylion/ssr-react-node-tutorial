import ReactDOMServer from 'react-dom/server'
import App from './App.jsx';
export default function render() {
  return ReactDOMServer.renderToString(<App />);
}
