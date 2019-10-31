import React, { Component } from 'react';
import { Layout, Icon, Button, Table, Input, Tooltip, List, message, Spin } from 'antd';
import './admin.less';
import Dblist from '../../components/dblist/dblist.js';
import memoryUtils from '../../utils/memoryUtils.js';
import storageUtils from '../../utils/storageUtils.js';
import { Redirect } from 'react-router-dom';
import logo from '../../components/img/logo.png';
import Highlighter from 'react-highlight-words';
import InfiniteScroll from 'react-infinite-scroller';
import { reqGetTables, reqGetColumns, reqGetTablesBytext } from '../../service/api/api.js';
const { Search } = Input;
const { Header, Sider, Content } = Layout;
export default class Admin extends Component {

    //全局状态信息
    state = {
        columnSearchText: '',//列搜索关键词
        tableSearchText: '',//表名搜索关键词
        columnsdata: [],//字段数据
        tablesdata: [],//表格数据
        tablename: '',//当下查看的表的注释
        tablecode: '',//当下查看的表
        tablesloading: false,//表格数据加载中
        columnsloading: false,//字段数据加载中
        collapsed: false,//左侧是否收起
        collapsedicon: 'left',//收起按钮样式
        currentDB: "",      //当下选中的数据源
        columnscache: {}    //数据缓存
    }


    //当删除完最后一个数据源时，对整个Admin组件进行初始化
    empty = () => {
        this.setState({
            columnSearchText: '',//列搜索关键词
            tableSearchText: '',//表名搜索关键词
            columnsdata: [],//字段数据
            tablesdata: [],//表格数据
            tablename: '',//当下查看的表的注释
            tablecode: '',//当下查看的表
            tablesloading: false,//表格数据加载中
            columnsloading: false,//字段数据加载中
            currentDB: "-1",      //当下选中的数据源
            columnscache: {}    //数据缓存
        });
    }

    //从指定数据源加载表
    loadTables = async (currentDB) => {
        if (currentDB === "-1") {
            return
        }
        this.setState({
            tablesloading: true
        });
        const tablesdata = await reqGetTables(currentDB);
        if (tablesdata.length === 0) {
            message.warn("在当下数据源中一张表都没找到！ㄟ( ▔, ▔ )ㄏ", 10);
        }
        this.setState({
            tablesdata: tablesdata,
            tablesloading: false,
            currentDB: currentDB
        });
    }

    //从指定数据源的指定表加载字段
    loadColumns = async (currentDB, tablename) => {
        if (currentDB === "-1" || !tablename) {
            message.warn("数据源或表名未指定！ (+_+)? ", 10);
            return
        }
        //若缓存中存在该数据源中的该表字段信息，则直接使用，不再请求后台。
        //若缓存中不存在该数据源中的该表字段信息，则请求后台加载数据，并将数据加入缓存。
        var { columnscache } = this.state;//缓存
        if (!(currentDB + tablename in columnscache)) {//若缓存中没有找到，则向后台请求数据
            this.setState({
                columnsloading: true
            });
            //调用后台接口，将请求到的数据加入缓存。
            columnscache[currentDB + tablename] = await reqGetColumns(currentDB, tablename);
        }
        //从缓存拿数据，进行界面展示
        const columnsdata = columnscache[currentDB + tablename];
        if (columnsdata && columnsdata.length > 0) {
            this.setState({
                columnsdata: columnsdata,
                columnsloading: false
            });
        } else {
            message.warn("没有找到该表的字段信息！ ㄟ( ▔, ▔ )ㄏ", 10);
        }
    }


    //退出登陆
    logout = () => {
        storageUtils.logout();
        memoryUtils.loginStatus = 0;
        this.props.history.replace("/");
    }

    //列内关键词搜索，并将关键词高亮
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={"快速查找"}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    搜索
            </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    重置
            </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.columnSearchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });


    //执行列内关键词寻找
    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };


    //重置某列的搜索条件
    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };


    //点击某行时，执行该方法
    onClickRow = (record, index) => {

    }

    //切换左侧栏收起或展开状态
    collapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            collapsedicon: this.state.collapsedicon === 'left' ? 'right' : "left"
        })
    }

    //选中左侧列表时，右侧显示该选中项的详细内容
    detail = (tablecode, tablename) => {
        if (!this.state.collapsed) {
            this.loadColumns(this.state.currentDB, tablecode);
            this.setState({
                tablename: tablename,
                tablecode: tablecode
            })
        }

    }

    //点击搜索框时，若左侧栏是收起状态，则将左侧栏展开
    onSearchText = () => {
        if (this.state.collapsed) {
            this.collapsed();
        }
    }
    //全局模糊查询表名或字段
    search = async (value) => {
        this.onSearchText();
        var currentDB = !this.state.currentDB ? memoryUtils.currentDB : this.state.currentDB;
        if (currentDB === "-1") {//没有数据源
            message.warn("请先添加数据源哦，亲", 10);
            return
        }
        if (!value || value === '') {//关键词为空时，查询所有内容
            this.loadTables(currentDB);
            return
        }
        this.setState({
            tablesloading: true
        });
        const tablesdata = await reqGetTablesBytext(currentDB, value);//根据关键词查找
        if (tablesdata.length > 0) {//若找到数据就刷新左侧列表
            this.setState({
                tablesdata: tablesdata,
                tablesloading: false,
                tableSearchText: value,
                columnSearchText: value
            });
        } else {//没有找到内容，则消息提示
            message.warn("没有查询到你要找的内容 ╮（╯＿╰）╭", 10);
            this.setState({
                tablesloading: false
            });
        }
    }
    //搜索框中内容改变时，实时改变关键词内容，并将其高亮。
    onSearchTextChange = (e) => {
        //console.log();
        this.setState({
            tableSearchText: e.target.value,
            columnSearchText: e.target.value
        });
    }

    render() {
        const columns = [
            {
                title: '字段名',
                dataIndex: 'columnname',
                key: 'columnname',
                width: '20%',
                align: "center",
                sorter: (a, b) => a.columnname.localeCompare(b.columnname, 'zh-CN'),
                ...this.getColumnSearchProps('columnname'),
            },
            {
                title: '字段描述',
                dataIndex: 'columncomment',
                key: 'columncomment',
                width: '40%',
                align: "center",
                ...this.getColumnSearchProps('columncomment'),
            },
            {
                title: '存储类型',
                dataIndex: 'datatype',
                key: 'datatype',
                width: '20%',
                align: "center",
            },
            {
                title: '存储长度',
                dataIndex: 'datalen',
                key: 'datalen',

                align: "center",
            },
        ];
        //内存中获取登陆状态，1：表示已经登陆，0：表示未登陆
        const loginStatus = memoryUtils.loginStatus;
        if (loginStatus === 0) {//若没有登录，则转到登录界面进行登录
            return <Redirect to="/login"></Redirect>
        }
        const { collapsed } = this.state;
        return (
            <div className='admin'>
                <Layout style={{ height: "100%" }}>
                    {/* 头部开始 */}
                    <Header style={{ padding: "0px", height: "60px" }}>
                        <div className='header'>
                            <div className='logo'>
                                <img className='img' src={logo} alt='logo' />
                                <h1 className='h1'>数据字典</h1>
                            </div>
                            <div className='logoutbt'>
                                <Button onClick={this.logout}>退出</Button>
                            </div>
                            <div className='dblist'>
                                <Dblist loadTables={this.loadTables} empty={this.empty}></Dblist>
                            </div>
                        </div>
                    </Header>
                    {/* 头部结束 */}

                    {/* 主体部分开始 */}
                    <Layout>

                        {/* 左侧侧边列表-开始 */}
                        <Sider collapsedWidth={70} collapsed={collapsed} width={300} style={{ boxShadow: "5px 10px 6px #eee", backgroundColor: '#fff' }}>
                            <div className="search">
                                <Search
                                    onClick={this.onSearchText}
                                    onChange={e => { this.onSearchTextChange(e) }}
                                    placeholder="搜索字段或表"
                                    onSearch={value => { this.search(value) }}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            <div className="collapsed" onClick={this.collapsed} >
                                <Icon style={{ margin: "0px auto", color: "#000" }} type={"double-" + this.state.collapsedicon} />
                            </div>
                            {this.state.tablesloading ? (<Spin className="tableloading-container" />) : ""}
                            <InfiniteScroll
                                className="tablelistscroll tablelist_scroll"
                                initialLoad={false}
                                pageStart={0}
                                useWindow={false}
                                loadMore={() => { }}
                            >
                                <List
                                    size="small"
                                    /* loading={this.state.tablesloading} */
                                    split={false}
                                    dataSource={this.state.tablesdata}
                                    renderItem={item => (
                                        <List.Item
                                            className="listitem"
                                            key={item.tablename}
                                        >
                                            <Tooltip placement="rightTop" title={item.tablename}>
                                                <Highlighter
                                                    className="listitemmeta"
                                                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                                                    searchWords={[this.state.tableSearchText]}
                                                    autoEscape
                                                    textToHighlight={item.tablecode}
                                                    onClick={() => { this.detail(item.tablecode, item.tablename) }}
                                                >
                                                </Highlighter>
                                            </Tooltip>
                                        </List.Item>
                                    )}
                                >

                                </List>

                                {/* <BackTop target={}></BackTop> */}
                            </InfiniteScroll>

                        </Sider>
                        {/* 左侧侧边列表-结束 */}

                        {/* 表格开始 */}
                        <Content style={{ backgroundColor: "#f4f4f4", padding: "0px 15px" }}>
                            <div className="tableinfo">
                                <Highlighter
                                    className="tableinfotext"
                                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                                    searchWords={[this.state.tableSearchText]}
                                    autoEscape
                                    textToHighlight={this.state.tablecode ? this.state.tablename + " (" + this.state.tablecode + ")" : "..."}
                                >
                                </Highlighter>
                                {/* <h1 className="tableinfotext">{this.state.tablecode ? this.state.tablename + " (" + this.state.tablecode + ")" : "..."}</h1> */}
                            </div>
                            <Table
                                className="table"
                                loading={this.state.columnsloading}
                                size="small"
                                bordered
                                scroll={{ y: "calc(100vh - 180px)" }}
                                pagination={false}
                                columns={columns}
                                dataSource={this.state.columnsdata}
                                onRow={this.onClickRow}
                            />
                        </Content>
                        {/* 表格结束 */}

                    </Layout>
                    {/*  主体部分结束  */}
                </Layout>
            </div >
        )
    }
}
