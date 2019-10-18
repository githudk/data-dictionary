import React, { Component } from 'react'
import { Form, Input, Select, Icon, Divider, Modal, Button, message } from 'antd';
import dblistjson from './dblist.json'
import memoryUtils from '../../utils/memoryUtils.js'
import storageUtils from '../../utils/storageUtils.js'
import { reqAddDB, reqGetAllDBList } from '../../service/api/api.js'
const { data } = dblistjson;
const { Option } = Select;

class DBlist extends Component {

    state = {
        items: [],
        loading: false,
        visible: false,
        confirmDirty: false,
        autoCompleteResult: [],
        currentDB: ""
    };

    async componentDidMount() {
        const data = await reqGetAllDBList();
        //console.log(data);
        const items = JSON.parse(JSON.stringify(data));
        console.log(items);
        var currentDB = memoryUtils.currentDB;
        console.log(currentDB);
        if(items.length > 0 ){
            if(currentDB === "-1"){
                currentDB = items[0].id;
                storageUtils.setCurrentDB(items[0].id);
            }
        }else{
            storageUtils.setCurrentDB("-1");
            memoryUtils.currentDB = "-1";
            currentDB = "选择或添加数据库"
        }
        console.log(currentDB);
        this.setState({
            items: items,
            currentDB: currentDB
        });
    }

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

    //提交数据及逻辑判断
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                const result = await reqAddDB(values);
                console.log(result);
                if (result.status === 1) {
                    message.success(result.msg);
                    // var items = [];
                    // if(this.state.items.length === 0){
                    //     items=[result.data];
                    // }else{
                    //     items = [...this.state.items, result.data];
                    // }
                    storageUtils.setCurrentDB(result.data.id);
                    memoryUtils.currentDB = result.data.id;
                    this.setState({
                        items: [...this.state.items, result.data],
                        loading: false,
                        visible: false,
                        currentDB : result.data.id
                    });

                } else {
                    message.error(result.msg);
                    this.setState({ loading: false });
                }
                //console.log('Received values of form: ', values);
            } else {
                this.setState({ loading: false });
            }
        });
    };

    handleConfirmBlur = e => {

        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    //数据源变更触发的事件
    handleSelectChange = value =>{
        //console.log(value);
        storageUtils.setCurrentDB(value);
        memoryUtils.currentDB = value;
        this.setState({
            currentDB: value
        });
    };

    handleDBTypeSelectChange = value =>{
        var form = this.props.form;
        if(value === "oracle"){
            form.setFieldsValue({dbport:"1521"});
        }
        if(value === "mysql"){
            form.setFieldsValue({dbport:"3066"});
        }
        if(value === "sqlserver"){
            form.setFieldsValue({dbport:"1433"});
        }
    }

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
        //jdbc:oracle:thin:@127.0.0.1:1521:orcl
        //jdbc:sqlserver://localhost:1433;databaseName=dbtest
        //jdbc:mysql://127.0.0.1:3306/test
        return (
            <div>
                <Select
                    value={this.state.currentDB}
                    onChange={this.handleSelectChange}
                    style={{ width: 300 }}
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
                        <Option key={item.id}>
                            {item.dbtype + "：" + item.dbadrr + ":" + item.dbport + "/" + item.dbname}
                        </Option>
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
                    <Form.Item label="数据库类型">
                            {getFieldDecorator('dbtype', {
                                rules: [{ required: true, message: '请选择数据库类型!' }],
                            })(
                                <Select
                                    placeholder="Oracle / MySQL / SQL Server"
                                    onChange={this.handleDBTypeSelectChange}
                                >
                                    <Option value="oracle">Oracle</Option>
                                    <Option value="mysql">MySQL</Option>
                                    <Option value="sqlserver">SQL Server</Option>
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item label="用户">
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

                        <Form.Item label="数据库名" >
                            {getFieldDecorator('dbname', {
                                rules: [{ required: true, message: '请输入数据库名称!', whitespace: true }],
                            })(<Input />)}
                        </Form.Item>

                        
                    </Form>
                </Modal>
            </div>
        )

    }
}

export default Form.create({ name: 'DBlist' })(DBlist);