import React, { Component } from 'react'
import { Layout, Tree, Icon, Button } from 'antd';
import './admin.less'
import Dblist from '../../components/dblist/dblist.js'
import Tablelist from '../../components/tablelist/tablelist.js'
import CTable from '../../components/table/table.js'
import TopNav from '../../components/topnav/topnav.js'
import memoryUtils from '../../utils/memoryUtils.js'
import storageUtils from '../../utils/storageUtils.js'
import { Redirect } from 'react-router-dom'

const { Header, Footer, Sider, Content } = Layout;

export default class Admin extends Component {

    logout = () => {
        storageUtils.logout();
        memoryUtils.loginStatus = 0;
        this.props.history.replace("/");
    }

    render() {
        //内存中获取登陆状态，1：表示已经登陆，0：表示未登陆
        const loginStatus = memoryUtils.loginStatus;
        if (loginStatus === 0) {
            return <Redirect to="/login"></Redirect>
        }
        return (
            <div className='admin'>
                <Layout style={{ height: "100%" }}>
                    <Header style={{ backgroundColor: '#aae7ff' }}>
                        <div className='dblist'>
                            <Dblist></Dblist>
                        </div>
                        <div className='logoutbt'>
                            <Button onClick={this.logout}>退出</Button>
                        </div>
                    </Header>
                    <Layout>
                        <Sider style={{ backgroundColor: '#eee' }}>
                            <TopNav></TopNav>
                            <Tablelist></Tablelist>
                        </Sider>
                        <Content style={{ backgroundColor: '#fff' }}>
                            <CTable></CTable>
                        </Content>
                    </Layout>
                    {/* <Footer style={{ backgroundColor: '#aaa' }}>
                        <div className='footer'>数据字典</div>
                    </Footer> */}
                </Layout>
            </div>
        )
    }
}
