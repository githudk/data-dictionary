import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import memoryUtils from './utils/memoryUtils.js'
import storageUtils from './utils/storageUtils.js'

const loginStatus = storageUtils.getLoginStatus();
memoryUtils.loginStatus = loginStatus ? loginStatus : 0;

ReactDOM.render(<App />, document.getElementById('root'));
