import React, { Component } from 'react'
import { List, message, Avatar, Spin, Button, Input, Tooltip, BackTop, Layout } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { reqGetAllTable } from '../../service/api/api.js'
import './tablelist.less'
const { Search } = Input;
const { Header, Footer, Sider, Content } = Layout;
export default class Tablelist extends Component {
    state = {
        data: [

            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },
            { id: "b2b_goods", tablecode: "b2b_goods", tablename: "商品表" },

        ],
        loading: false,
        hasMore: true,
    };

    componentDidMount() {
        this.fetchData(res => {
            this.setState({
                data: res.results,
            });
        });
    }

    fetchData = async callback => {
        const data = await reqGetAllTable();
        //
    };

    handleInfiniteOnLoad = () => {
        let { data } = this.state;
        this.setState({
            loading: true,
        });
        if (data.length > 14) {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetchData(res => {
            data = data.concat(res.results);
            this.setState({
                data,
                loading: false,
            });
        });
    };
    detail() {
        console.log("ddd");
    }
    render() {

        return (
    
                <InfiniteScroll
                    className="scroll"
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                >
                    <List
                        split={false}
                        dataSource={this.state.data}
                        renderItem={item => (
                            <List.Item
                                style={{ height: 30 }}
                                onClick={this.detail}
                                key={item.id}
                            >
                                <Tooltip placement="rightTop" title="prompt text">
                                    <List.Item.Meta
                                        style={{ height: 20, cursor: "pointer" }}
                                        title={item.tablecode}
                                    />
                                </Tooltip>

                            </List.Item>
                        )}
                    >
                        {this.state.loading && this.state.hasMore && (
                            <div className="loading-container">
                                <Spin />
                            </div>
                        )}
                    </List>
                    {/* <BackTop target={}></BackTop> */}
                </InfiniteScroll>
        )
    }
}