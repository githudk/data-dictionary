import React, { Component } from 'react'
import { Select, Icon, Divider, Modal, Button  } from 'antd';
import dblistjson from './dblist.json'
import DBform from '../dbform/dbform.js'
const { dblist2 } = dblistjson;
const { Option } = Select;

export default class DBlist extends Component {

    state = {
        items: dblist2,
        loading: false,
        visible: false,
    };

    //新增
    addItem = () => {
        this.showModal();
    };
    //弹出表单对话窗
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    //保存按钮
    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    };

    //取消
    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const { items, visible, loading } = this.state;
        return (
            <div>
                <Select
                    style={{ width: 220 }}
                    placeholder="选择或添加数据库"
                    dropdownRender={menu => (
                        <div>
                            {menu}
                            <Divider style={{ margin: '0px 0' }} />
                            <div style={{ padding: '3px 8px 4px 8px', cursor: 'pointer',  backgroundColor: '#e6faff' }}
                                onMouseDown={e => e.preventDefault()}
                                onClick={this.addItem}
                            >
                                <Icon type="plus" /> 添加数据库连接
                            </div>
                        </div>
                    )}
                >
                    {items.map(item => (
                        <Option key={item.dbname}>{"(" + item.dbtype + ")" + item.dbname}</Option>
                    ))}
                </Select>
                <Modal
                    visible={visible}
                    title="连接数据库"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            保存
                        </Button>,
                    ]}
                >
                    <DBform></DBform>
                </Modal>
            </div>
        )

    }
}