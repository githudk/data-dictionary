import React, { Component } from 'react'
import { BrowserRouter, Route, Switch ,Redirect} from 'react-router-dom'
import Login from './pages/login/login.js'
import Admin from './pages/admin/admin.js'
export default class App extends Component {


    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}

