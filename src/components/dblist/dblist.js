import React, { Component } from 'react'
import { Select, Icon, Divider, Modal, Button  } from 'antd';
import dblistjson from './dblist.json'
import DBform from '../dbform/dbform.js'
const { dblist2 } = dblistjson;
const { Option } = Select;
let index = 0;

export default class dblist extends Component {

    state = {
        items: dblist2,
        loading: false,
        visible: false,
    };

    addItem = () => {
        this.showModal();
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    };

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
                            <Divider style={{ margin: '4px 0' }} />
                            <div
                                style={{ padding: '4px 8px', cursor: 'pointer' }}
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