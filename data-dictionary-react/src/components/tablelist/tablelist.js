import React, { Component } from 'react'
import { List, message, Avatar, Spin, Button } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { reqGetAllTable } from '../../service/api/api.js'
import './tablelist.less'
export default class Tablelist extends Component {
    state = {
        data: [{id:"b2b_goods",tablecode:"b2b_goods",tablename:"商品表"},{id:"b2b_goods",tablecode:"b2b_goods",tablename:"商品表"}],
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
    detail(){
        console.log("ddd");
    }
    render() {

        return (
            <div className="listcontainer">
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                >
                    <List
                        split={true}
                        
                        dataSource={this.state.data}
                        renderItem={item => (
                            <List.Item
                                onClick = {this.detail}
                                key={item.id}
                            >
                                <List.Item.Meta
                                    style={{cursor:"pointer"}}
                                    title={item.tablecode}
                                    description={item.tablename}
                                />
                            </List.Item>
                        )}
                    >
                        {this.state.loading && this.state.hasMore && (
                            <div className="demo-loading-container">
                                <Spin />
                            </div>
                        )}
                    </List>
                </InfiniteScroll>
            </div>
        )
    }
}