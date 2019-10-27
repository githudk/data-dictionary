import React, { Component } from 'react'
import { Form, Input, Select, Icon, Divider, Modal, Button, message } from 'antd';
import memoryUtils from '../../utils/memoryUtils.js'
import storageUtils from '../../utils/storageUtils.js'
import { reqSaveDB, reqGetDBList } from '../../service/api/api.js'
const { Option } = Select;

class DBlist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading: false,
            visible: false,
            editvisible: false,
            //confirmDirty: false,
            autoCompleteResult: [],
            currentDB: "",
            editurrentDB: "",
            //loadTables: this.props.loadTables
        };
    }


    //当组件渲染结束，执行数据加载
    async componentDidMount() {
        const data = await reqGetDBList();//远程调用，请求数据源连接数据
        //console.log(data);
        const items = JSON.parse(JSON.stringify(data));
        //console.log(items);
        var currentDB = memoryUtils.currentDB;
        //console.log(currentDB);
        if (items.length > 0) {//如果请求到数据
            memoryUtils.currentDBdata = items;
            if (currentDB === "-1") {//如果本地没有缓存上次的记录
                currentDB = items[0].id;//将请求到的第一条数据作为当下选中的连接数据
                storageUtils.setCurrentDB(items[0].id);//保存到本地缓存中
            }
        } else {//若没有请求到数据（还没有添加过数据）
            storageUtils.setCurrentDB("-1");//将缓存标志设置成初始状态
            memoryUtils.currentDB = "-1";//将临时记忆设置成初始状态
            currentDB = "选择或添加数据源"//界面输入框将显示这句话
        }
        const { loadTables } = this.props;
        loadTables(currentDB);
        //刷新界面
        this.setState({
            items: items,
            currentDB: currentDB
        });
    }

    //新增
    addItem = () => {
        this.showModal();
    };
    //编辑
    editItem = () => {
        this.showEditModal();
    };
    //弹出表单对话窗
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    showEditModal = () => {
        this.setState({
            editvisible: true,
        });
    }

    //保存按钮
    handleOk = (e) => {
        this.setState({ loading: true });
        this.handleSubmit(e);
    };

    //取消
    handleCancel = () => {
        this.setState({ visible: false });
    };

    //提交数据到后台保存
    handleSubmit = e => {
        e.preventDefault();
        //数据校验
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {//如果校验通过，执行提交保存
                message.info("开始测试数据源连接，并保存...");
                const result = await reqSaveDB(values);//请求后台进行保存
                //console.log(result);
                if (result.status === 1) {//保存成功
                    //message.destroy();
                    message.success(result.msg);//界面提示成功消息
                    storageUtils.setCurrentDB(result.data.id);//将新增的链接设置为当下选中的链接，保存到缓存中
                    memoryUtils.currentDB = result.data.id;//将新增的链接设置为当下选中的链接，保存到内存中
                    memoryUtils.currentDBdata = [...this.state.items, result.data];
                    const { loadTables } = this.props;
                    loadTables(memoryUtils.currentDB);
                    this.setState({//渲染界面
                        items: [...this.state.items, result.data],
                        loading: false,
                        visible: false,
                        currentDB: result.data.id
                    });

                } else {//保存失败
                    message.error(result.msg);//提示失败信息
                    this.setState({ loading: false });
                }
            } else {//校验字段有误
                this.setState({ loading: false });
            }
        });
    };

    // handleConfirmBlur = e => {
    //     const { value } = e.target;
    //     this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    // };

    //数据源变更触发的事件
    handleSelectChange = value => {
        //console.log(value);
        storageUtils.setCurrentDB(value);
        memoryUtils.currentDB = value;
        const { loadTables } = this.props;
        loadTables(memoryUtils.currentDB);
        //console.log(loadTables);
        this.setState({
            currentDB: value
        });
        //加载表格数据
        //......todo
    };

    //联动，当数据源类型改变时，为端口赋默认值
    handleDBTypeSelectChange = value => {
        var form = this.props.form;
        if (value === "oracle") {
            form.setFieldsValue({ dbport: "1521" });
        }
        if (value === "mysql") {
            form.setFieldsValue({ dbport: "3306" });
        }
        if (value === "sqlserver") {
            form.setFieldsValue({ dbport: "1433" });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        //const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const { items, visible, editvisible, loading } = this.state;

        //校验IP地址的正则表达式
        var ipRegExp = new RegExp("^(([0-9]|[1-8][0-9]|9[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-8][0-9]|9[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");
        //校验端口正则表达式
        var portRegExp = new RegExp("^([0-9]|[1-9]\\d|[1-9]\\d{2}|[1-9]\\d{3}|[1-5]\\d{4}|6[0-4]\\d{3}|65[0-4]\\d{2}|655[0-2]\\d|6553[0-5])$");
        return (
            <div>

                {/* 数据源选择列表 */}
                <Select
                    value={this.state.currentDB}
                    onChange={this.handleSelectChange}
                    style={{ width: 300 }}
                    placeholder="选择或添加数据源"
                    dropdownRender={menu => (
                        <div>
                            {menu}
                            {/* 分割线 */}
                            <Divider style={{ margin: '0px 0' }} />
                            {/* 新增按钮 */}
                            <div style={{ float: "left", width: "50%", padding: '0px 70px', backgroundColor: "#e6faff" }}
                                onMouseDown={e => e.preventDefault()}

                            >
                                <Icon style={{ cursor: "pointer" }} onClick={this.addItem} type="plus" />

                            </div>
                            {/* 编辑按钮 */}
                            <div style={{ float: "left", width: "50%", padding: '0px 70px', backgroundColor: "#e6faff" }}
                                onMouseDown={e => e.preventDefault()}

                            >
                                <Icon style={{ cursor: "pointer" }} onClick={this.editItem} type="edit" />
                            </div>
                        </div>
                    )}
                >
                    {items.map(item => (
                        <Option key={item.id} value={item.dbtype + "-" + item.dbadrr + "-" + item.dbport + "-" + item.username + "-" + item.dbname}>
                            {item.dbtype + "：" + item.dbadrr + ":" + item.dbport + "/" + item.dbname}
                        </Option>
                    ))}

                </Select>

                {/* 弹窗-新增 */}
                <Modal
                    visible={visible}
                    title="添加数据源"
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
                        <Form.Item label="数据源类型">
                            {getFieldDecorator('dbtype', {
                                rules: [{ required: true, message: '请选择数据源类型!' }],
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
                                rules: [{ max: 100, required: true, message: '要求：非空，长度小于100' }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="密码" hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [
                                    { max: 100, required: true, message: '要求：非空，长度小于100' },
                                    { validator: this.validateToNextPassword },
                                ],
                            })(<Input.Password />)}
                        </Form.Item>

                        <Form.Item label="ip地址">
                            {getFieldDecorator('dbadrr', {
                                rules: [{
                                    pattern: ipRegExp,
                                    required: true, message: '请输入有效的数据源ip地址!', whitespace: true
                                }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="端口">
                            {getFieldDecorator('dbport', {
                                rules: [{
                                    pattern: portRegExp,
                                    required: true, message: '请输入有效的数据源端口!', whitespace: true
                                }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="实例名" >
                            {getFieldDecorator('dbname', {
                                rules: [{ max: 100, required: true, message: '要求：非空，长度小于100', whitespace: true }],
                            })(<Input />)}
                        </Form.Item>
                    </Form>
                </Modal>



                {/* 弹窗-编辑 */}
                <Modal
                    visible={editvisible}
                    title="编辑数据源"
                    onCancel={this.handleCancel}

                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="danger" loading={loading} onClick={this.handleDelete}>
                            删除
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleEdit}>
                            保存
                        </Button>,
                    ]}
                >
                    {/* 数据源选择列表 */}


                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>

                        <Form.Item label="选择数据源">
                            {getFieldDecorator('db', {
                                rules: [],
                            })(
                                <Select
                                    value={this.state.editcurrentDB}
                                    onChange={this.handleEditSelectChange}

                                    placeholder="选择数据源"

                                >
                                    {items.map(item => (
                                        <Option key={item.id} value={item.dbtype + "：" + item.dbadrr + ":" + item.dbport + "/" + item.dbname}>
                                            {item.dbtype + "：" + item.dbadrr + ":" + item.dbport + "/" + item.dbname}
                                        </Option>
                                    ))}

                                </Select>
                            )}
                        </Form.Item>



                        <Form.Item label="数据源类型">
                            {getFieldDecorator('dbtype', {
                                rules: [{ required: true, message: '请选择数据源类型!' }],
                            })(
                                <Select
                                    disabled={true}
                                    
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
                                rules: [{ max: 100, required: true, message: '要求：非空，长度小于100' }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="密码" hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [
                                    { max: 100, required: true, message: '要求：非空，长度小于100' },
                                    { validator: this.validateToNextPassword },
                                ],
                            })(<Input.Password />)}
                        </Form.Item>

                        <Form.Item label="ip地址">
                            {getFieldDecorator('dbadrr', {
                                rules: [{
                                    pattern: ipRegExp,
                                    required: true, message: '请输入有效的ip地址!', whitespace: true
                                }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="端口">
                            {getFieldDecorator('dbport', {
                                rules: [{
                                    pattern: portRegExp,
                                    required: true, message: '端口范围：1-65535', whitespace: true
                                }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="实例名" >
                            {getFieldDecorator('dbname', {
                                rules: [{ max: 100, required: true, message: '要求：非空，长度小于100', whitespace: true }],
                            })(<Input />)}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )

    }
}

export default Form.create({ name: 'DBlist' })(DBlist);