import React, { Component } from 'react'
import { Layout, Tree, Icon, Button, Descriptions } from 'antd';
import './admin.less'
import Dblist from '../../components/dblist/dblist.js'
import Tablelist from '../../components/tablelist/tablelist.js'
import CTable from '../../components/table/table.js'
import TopNav from '../../components/topnav/topnav.js'
import memoryUtils from '../../utils/memoryUtils.js'
import storageUtils from '../../utils/storageUtils.js'
import { Redirect } from 'react-router-dom'
import logo from '../../components/img/logo.png'

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
                    <Header style={{ backgroundColor: '#aae7ff', padding: "0px" }}>
                        <div className='logo'>
                            <img className='img' src={logo} alt='logo' />
                            <h1 className='h1'>数据字典</h1>
                        </div>
                        <div className='logoutbt'>
                            <Button onClick={this.logout}>退出</Button>
                        </div>
                        <div className='dblist'>
                            <Dblist></Dblist>
                        </div>

                    </Header>
                    <Layout>
                        <Sider style={{ backgroundColor: '#fff' }}>
                            {/*<TopNav></TopNav>*/}
                            <Tablelist></Tablelist>
                        </Sider>
                        <Content style={{ backgroundColor: '#fff' }}>
                            <div className="tableinfo">
                                <div className="tablename">
                                    <h5 className="tablenameh5">{"b2b_goods"}</h5>
                                </div>
                                <div className="tabledescription">
                                    <h5 className="tabledescriptionh5">{"b2b_goods"}</h5>
                                </div>
                            </div>
                            <div className="tablecontainer">
                                <CTable></CTable>
                            </div>
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
