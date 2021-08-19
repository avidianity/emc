import './shims';
import './boot';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './Views/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import './Styles/global.css';
import { DEVELOPMENT, PRODUCTION } from './constants';

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);

if (DEVELOPMENT) {
	serviceWorkerRegistration.unregister();
} else if (PRODUCTION) {
	serviceWorkerRegistration.register();
}

reportWebVitals();
