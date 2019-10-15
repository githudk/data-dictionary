import React, { Component } from 'react'
import { Layout, Tree, Icon } from 'antd';
import './admin.less'
import Dblist from '../../components/dblist/dblist.js'
import Tablelist from '../../components/tablelist/tablelist.js'
import CTable from '../../components/table/table.js'
import TopNav from '../../components/topnav/topnav.js'
import memoryUtils from '../../utils/memoryUtils.js'
import {Redirect} from 'react-router-dom'

const { Header, Footer, Sider, Content } = Layout;

const { TreeNode } = Tree;

export default class Admin extends Component {


    render() {
        const user = memoryUtils.user;
        if(!user || !user.id){
            return <Redirect to="/login"></Redirect>
        }
        return (
            <div className='admin'>
                <Layout style={{ height: "100%" }}>
                    <Header style={{ backgroundColor: '#aae7ff' }}>
                        <div className='dblist'>
                            <Dblist></Dblist>
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
