import { createRoot } from 'react-dom/client';
import { Provider } from 'rxdb-hooks';
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { RxDatabase } from 'rxdb';
import initialize from './db/initialize';
import App from './App';

const Root = () => {
	const [db, setDb] = useState();

	useEffect(() => {
		initialize().then(setDb);
	}, []);

	return (
		<Provider db={db}>
			<App />
		</Provider>
	);
};


// Render the Root component to start the React app
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<Root />);
