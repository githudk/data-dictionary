import React, { Component } from 'react';
import { Layout, Icon, Button, Table, Input, Tooltip, List, message, Spin } from 'antd';
import './admin.less';
import Dblist from '../../components/dblist/dblist.js';
import memoryUtils from '../../utils/memoryUtils.js';
import storageUtils from '../../utils/storageUtils.js';
import { Redirect } from 'react-router-dom';
import logo from '../../components/img/logo.png';
import Highlighter from 'react-highlight-words';
import { getcolumnsdata, gettablesdata } from '../../components/simulateddata/simulateddata.js';
import InfiniteScroll from 'react-infinite-scroller';
import { reqGetAllTable } from '../../service/api/api.js';
const { Search } = Input;
const { Header, Sider, Content } = Layout;
export default class Admin extends Component {

    state = {
        searchText: '',//列内搜索条件
        columnsdata: [],
        tablesdata: [],
        tablesloading: false,
        tableshasMore: false,
        columnsloading: false,
        columnshasMore: false,
    }


    componentDidMount() {
        const columnsdata = getcolumnsdata();
        const tablesdata = gettablesdata();
        this.setState({
            columnsdata: columnsdata,
            tablesdata: tablesdata
        });
    }

    //退出登陆
    logout = () => {
        storageUtils.logout();
        memoryUtils.loginStatus = 0;
        this.props.history.replace("/");
    }

    //列内关键词搜索
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
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
                searchWords={[this.state.searchText]}
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


    fetchData = async callback => {
        const data = await reqGetAllTable();
        //
    };

    handleInfiniteOnLoad = () => {
        let { tablesdata } = this.state;
        this.setState({
            tablesloading: true,
        });
        if (tablesdata.length > 14) {
            message.warning('Infinite List loaded all');
            this.setState({
                tableshasMore: false,
                tablesloading: false,
            });
            return;
        }
        this.fetchData(res => {
            tablesdata = tablesdata.concat(res.results);
            this.setState({
                tablesdata,
                tablesloading: false,
            });
        });
    };
    detail() {
        console.log("ddd");
    }
    render() {
        const columns = [
            {
                title: '字段名',
                dataIndex: 'columnname',
                key: 'columnname',
                width: '20%',
                align: "center",
                sorter: (a, b) => a.columnname.length - b.columnname.length,
                ...this.getColumnSearchProps('columnname'),
            },
            {
                title: '字段描述',
                dataIndex: 'columncomment',
                key: 'columncomment',
                width: '20%',
                align: "center",
                ...this.getColumnSearchProps('columncomment'),
            },
            {
                title: '存储类型',
                dataIndex: 'datatype',
                key: 'datatype',
                width: '20%',
                align: "center",
                ...this.getColumnSearchProps('datatype'),
            },
            {
                title: '存储长度',
                dataIndex: 'datalen',
                key: 'datalen',
                width: '20%',
                align: "center",
                ...this.getColumnSearchProps('datalen'),
            },
        ];
        //内存中获取登陆状态，1：表示已经登陆，0：表示未登陆
        const loginStatus = memoryUtils.loginStatus;
        if (loginStatus === 0) {
            return <Redirect to="/login"></Redirect>
        }
        return (
            <div className='admin'>
                <Layout style={{ height: "100%" }}>
                    {/* 头部开始 */}
                    <Header style={{ height: "110px", padding: "0px" }}>
                        <div className='header'>
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

                        </div>
                        <div className='header_b'>
                            <div className="search">
                                <Search
                                    placeholder="搜索字段或表"
                                    onSearch={value => console.log(value)}
                                    style={{ width: "180px" }}
                                />
                            </div>
                            <div className="tableinfo">
                                <h5 className="tableinfotext">{"b2b_goods(商品表)"}</h5>
                            </div>
                        </div>
                    </Header>
                    {/* 头部结束 */}

                    {/* 主体部分开始 */}
                    <Layout>

                        {/* 左侧侧边列表-开始 */}
                        <Sider style={{ backgroundColor: '#f4f4f4' }}>
                            <InfiniteScroll
                                className="tablelistscroll"
                                initialLoad={false}
                                pageStart={0}
                                loadMore={this.handleInfiniteOnLoad}
                                hasMore={!this.state.tablesloading && this.state.tableshasMore}
                                useWindow={false}
                            >
                                <List
                                    split={false}
                                    dataSource={this.state.tablesdata}
                                    renderItem={item => (
                                        <List.Item
                                            style={{ height: 30 }}
                                            onClick={this.detail}
                                            key={item.id}
                                        >
                                            <Tooltip placement="rightTop" title="商品表">
                                                <List.Item.Meta
                                                    style={{ height: 20, cursor: "pointer" }}
                                                    title={item.tablecode}
                                                />
                                            </Tooltip>

                                        </List.Item>
                                    )}
                                >
                                    {this.state.tablesloading && this.state.tableshasMore && (
                                        <div className="loading-container">
                                            <Spin />
                                        </div>
                                    )}
                                </List>
                                {/* <BackTop target={}></BackTop> */}
                            </InfiniteScroll>
                        </Sider>
                        {/* 左侧侧边列表-结束 */}

                        {/* 表格开始 */}
                        <Content style={{ backgroundColor: "#f4f4f4", padding: "0px 15px" }}>
                            <Table
                                loading={this.state.columnsloading}
                                useFixedHeader={true}
                                size="small"
                                bordered
                                scroll={{ y: "calc(100vh - 160px)" }}
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
            </div>
        )
    }
}
