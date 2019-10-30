import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import LoginForm from '../../components/loginform/loginform.js'
import './login.less'
import logo from '../../components/img/logo.png'
import storageUtils from '../../utils/storageUtils';
import memoryUtils from '../../utils/memoryUtils';
export default class Login extends Component {


    render() {
        const loginStatus = storageUtils.getLoginStatus();
        memoryUtils.loginStatus = loginStatus;
        if (memoryUtils.loginStatus === '1') {
            return <Redirect to="/"></Redirect>
        }
        return (

            <div className='login'>
                <div className='header'>
                    <img className='img' src={logo} alt='logo' />
                    <h1 className='h1'>数据字典</h1>
                </div>

                <div className='loginform'>
                    <LoginForm history = {this.props.history}></LoginForm>
                </div>

            </div>
        )
    }
}
