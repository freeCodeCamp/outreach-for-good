import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import { browserHistory} from 'react-router';
import RTRouter from './router';
//import {getAllUsers} from './actions/userActions'; // named import, shorter syntax

import configureStore from './store/configure-store';
import {Provider} from 'react-redux';
import './styles/styles.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
//import '../node_modules/toastr/build/toastr.min.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { attachGlobalErrorHandler } from './utils/error';

attachGlobalErrorHandler();

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = configureStore();
//console.log(store.getState());

// Future improvement, inject into Head on serve during initial render
//store.dispatch(getAllUsers());
const {getState} = store;

render(
  <Provider store={store}>
    <RTRouter
      history={browserHistory}
      getState={getState}
    />
  </Provider>,
  document.getElementById('app')
);
