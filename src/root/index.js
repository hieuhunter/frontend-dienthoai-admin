import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import 'styles/globals.scss';
import { Provider } from 'react-redux';
import configureStore from './store';
import history from 'common/utils/history';
import accessControl from './accessControl';
import RootRouter from './router';

const store = configureStore();
accessControl.checkRoute(store, history, history.location.pathname);

const Root = () => {
	useEffect(() => {
		const unlisten = history.listen((location, action) => {
			accessControl.checkRoute(store, history, location.pathname);
			window.scrollTo(0, 0);
		});
		return () => {
			unlisten();
		};
	});

	return (
		<Provider store={store}>
			<Router history={history}>{renderRoutes(RootRouter)}</Router>
		</Provider>
	);
};

export default Root;
