import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import memoryUtils from './utils/memoryUtils.js'
import storageUtils from './utils/storageUtils.js'

const user = storageUtils.getUser();
memoryUtils.user = user;

ReactDOM.render(<App />, document.getElementById('root'));
