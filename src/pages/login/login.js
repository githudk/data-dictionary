import React, { Component } from 'react'
import LoginForm from '../../components/loginform/loginform.js'
import './login.less'
import logo from './logo.png'

export default class Login extends Component {


    render() {
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
