import React, { Component } from 'react'
import { Form, Input, Select, Icon, Divider, Modal, Button, message } from 'antd';
import dblistjson from './dblist.json'
import { reqAddDB } from '../../service/api/api.js'
const { dblist2 } = dblistjson;
const { Option } = Select;

class DBlist extends Component {

    state = {
        items: dblist2,
        loading: false,
        visible: false,
        confirmDirty: false,
        autoCompleteResult: [],
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
    handleOk = (e) => {
        this.setState({ loading: true });
        this.handleSubmit(e);
    };

    //取消
    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                const data = await reqAddDB(values);
                if (data.status === 1) {
                    message.success(data.msg);
                    this.setState({ loading: false,visible: false });
                } else{
                    message.error(data.msg);
                    this.setState({ loading: false});
                }
                //console.log('Received values of form: ', values);
            }else{
                this.setState({ loading: false});
            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 4,
                    offset: 18,
                },
                sm: {
                    span: 4,
                    offset: 18,
                },
            },
        };
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
                            <div style={{ padding: '3px 8px 4px 8px', cursor: 'pointer', backgroundColor: '#e6faff' }}
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
                    footer={[]}
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

                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>

                        <Form.Item label="用户名">
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名' }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="密码" hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [
                                    { required: true, message: '请输入密码!' },
                                    { validator: this.validateToNextPassword },
                                ],
                            })(<Input.Password />)}
                        </Form.Item>

                        <Form.Item label="数据库地址">
                            {getFieldDecorator('dbadrr', {
                                rules: [{ required: true, message: '请输入数据库地址!', whitespace: true }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="端口">
                            {getFieldDecorator('dbport', {
                                rules: [{ required: true, message: '请输入数据库端口!', whitespace: true }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="数据库名称" >
                            {getFieldDecorator('dbname', {
                                rules: [{ required: true, message: '请输入数据库名称!', whitespace: true }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="数据库类型">
                            {getFieldDecorator('dbtype', {
                                rules: [{ required: true, message: '请选择数据库类型!' }],
                            })(
                                <Select
                                    placeholder="Oracle / MySQL / SQL Server"
                                    onChange={this.handleSelectChange}
                                >
                                    <Option value="Oracle">Oracle</Option>
                                    <Option value="MySQL">MySQL</Option>
                                    <Option value="SQL Server">QL Server</Option>
                                </Select>,
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )

    }
}

export default Form.create({ name: 'DBlist' })(DBlist);