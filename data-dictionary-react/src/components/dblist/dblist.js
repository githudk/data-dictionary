import React, { Component } from 'react'
import { Form, Input, Select, Icon, Divider, Modal, Button, message, Popconfirm } from 'antd';
import memoryUtils from '../../utils/memoryUtils.js'
import storageUtils from '../../utils/storageUtils.js'
import { reqSaveDB, reqGetDBList, reqDeleteDB } from '../../service/api/api.js'
const { Option } = Select;

class DBlist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            DBlist: [],//数据源列表
            loading: false,//提交中
            visible: false,//显示-隐藏新增表单
            editloading: false,//修改中
            deleteloading: false,//删除中
            editvisible: false, //显示-隐藏编辑表单
            currentDB: "",//当下使用的数据源ID
            editcurrentDB: "" //当下编辑的数据源ID
        };
    }


    //初始化_当组件渲染结束，执行数据加载
    async componentDidMount() {
        const DBlistdata = await reqGetDBList();//远程调用，请求数据源连接数据
        //console.log(data);
        const DBlist = JSON.parse(JSON.stringify(DBlistdata));
        //console.log(DBlist);
        var currentDB = memoryUtils.currentDB;
        //console.log(currentDB);
        if (DBlist.length > 0) {//如果请求到数据
            var t = false;
            for(var i=0;i<DBlist.length;i++){//遍历数据源，判断缓存中的旧记录（数据源）是否属于当下的数据源列表
                if(currentDB === DBlist[0].id){
                    t = true;
                    break;
                }
            }
            if (!t) {//如果本地缓存无效
                currentDB = DBlist[0].id;//将请求到的第一条数据作为当下选中的连接数据
            }
            const { loadTables } = this.props;
            loadTables(currentDB);
            storageUtils.setCurrentDB(currentDB);
            memoryUtils.currentDBlist = DBlist;
            memoryUtils.currentDB = currentDB;
        } else {//若没有请求到数据（还没有添加过数据）
            storageUtils.setCurrentDB("-1");//将缓存标志设置成初始状态
            memoryUtils.currentDB = "-1";//将临时记忆设置成初始状态
            currentDB = "选择或添加数据源"//界面输入框将显示这句话
        }

        //刷新界面
        this.setState({
            DBlist: DBlist,
            currentDB: currentDB,
            editcurrentDB: currentDB
        });
    }
    //数据源变更触发的事件
    handleSelectChange = value => {
        //console.log(value);
        storageUtils.setCurrentDB(value);
        memoryUtils.currentDB = value;
        const { loadTables } = this.props;
        loadTables(memoryUtils.currentDB);
        //console.log(loadTables);
        this.setState({
            currentDB: value,
            editcurrentDB: value
        });
    };




    //********************************新增逻辑-开始**************************************** */



    //点击新增按钮_触发弹窗
    addItem = () => {
        this.showModal();
    };

    //弹出表单对话窗
    showModal = () => {
        this.setState({
            visible: true,
        });
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

    //新增保存
    handleOk = (e) => {
        this.setState({ loading: true });
        this.handleSubmit(e);
    };

    //退出新增
    handleCancel = () => {
        //若返回出错信息，或者正常消息返回，则允许退出新增
        if (memoryUtils.error || !this.state.loading) {
            memoryUtils.error = false;//使用完错误状态信息，需要重置为false
            this.setState({
                visible: false,
                loading: false
            });
        }

    };

    //提交数据到后台新增保存
    handleSubmit = e => {
        e.preventDefault();
        //数据校验
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {//如果校验通过，执行提交保存
                message.info("开始测试数据源连接，并保存...",10);
                const result = await reqSaveDB(values);//请求后台进行保存
                //console.log(result);
                if (result.status === 1) {//保存成功
                    //message.destroy();
                    message.success(result.msg,10);//界面提示成功消息
                    storageUtils.setCurrentDB(result.data.id);//将新增的链接设置为当下选中的链接，保存到缓存中
                    memoryUtils.currentDB = result.data.id;//将新增的链接设置为当下选中的链接，保存到内存中
                    memoryUtils.currentDBlist = [...this.state.DBlist, result.data];
                    const { loadTables } = this.props;
                    loadTables(memoryUtils.currentDB);
                    this.setState({//渲染界面
                        DBlist: [...this.state.DBlist, result.data],
                        loading: false,
                        visible: false,
                        currentDB: result.data.id
                    });

                } else {//保存失败
                    message.warn(result.msg,10);//提示失败信息
                    this.setState({ loading: false });
                }
            } else {//校验字段有误
                this.setState({ loading: false });
            }
        });
    };



    //********************************新增逻辑-结束**************************************** */
    //********************************编辑逻辑-开始**************************************** */



    //编辑按钮_触发编辑弹窗
    editItem = () => {
        this.showEditModal();
    };

    //弹出编辑表单对话窗_默认对当下使用的数据源进行编辑
    showEditModal = () => {
        const { currentDB } = this.state;
        var form = this.props.form;
        form.setFieldsValue({ id: currentDB });//选中当下正在使用的数据源
        this.filldata(currentDB);//根据数据源ID，填充表单数据
        this.setState({
            editvisible: true,
            editcurrentDB: currentDB
        });
    }

    //编辑保存
    handleEdit = (e) => {
        this.setState({ editloading: true });
        this.handleEditSubmit(e);
    };

    //退出编辑
    handleEditCancel = () => {
        //若返回出错信息，或者正常消息返回，则允许退出新增
        if (memoryUtils.error || (!this.state.editloading && !this.state.deleteloading)) {
            memoryUtils.error = false;//使用完错误状态信息，需要重置为false
            this.setState({
                editvisible: false,
                editloading: false,
                deleteloading: false
            });
        }
    };

    //待编辑数据源列表变更触发的事件
    handleEditSelectChange = value => {
        this.filldata(value);//填充表单内容
        this.setState({
            editcurrentDB: value
        });
        //加载表格数据
        //......todo
    };
    //填充表单
    filldata = (currentDB) => {
        var form = this.props.form;
        var { DBlist } = this.state;
        var currentEditDBitem = {};
        for (var i = 0; i < DBlist.length; i++) {
            if (DBlist[i].id === currentDB) {
                currentEditDBitem = DBlist[i];
                break;
            }
        }
        form.setFieldsValue({ dbtype: currentEditDBitem.dbtype });
        form.setFieldsValue({ username: currentEditDBitem.username });
        form.setFieldsValue({ password: currentEditDBitem.password });
        form.setFieldsValue({ dbadrr: currentEditDBitem.dbadrr });
        form.setFieldsValue({ dbport: currentEditDBitem.dbport });
        form.setFieldsValue({ dbname: currentEditDBitem.dbname });
    }


    //编辑提交
    handleEditSubmit = (e) => {
        e.preventDefault();
        //数据校验
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {//如果校验通过，执行提交保存
                message.info("开始测试数据源连接，并保存...",10);
                const result = await reqSaveDB(values);//请求后台进行保存
                //console.log(result);
                if (result.status === 1) {//保存成功
                    //message.destroy();
                    message.success(result.msg,10);//界面提示成功消息
                    //storageUtils.setCurrentDB(result.data.id);//将新增的链接设置为当下选中的链接，保存到缓存中
                    //memoryUtils.currentDB = result.data.id;//将新增的链接设置为当下选中的链接，保存到内存中
                    var { DBlist } = this.state;
                    var newDBlist = DBlist.map(function (item) {
                        if (item.id = result.data.id) {
                            return result.data;
                        } else {
                            return item;
                        }
                    });
                    memoryUtils.currentDBlist = newDBlist;
                    //const { loadTables } = this.props;
                    //loadTables(memoryUtils.currentDB);
                    this.setState({//渲染界面
                        DBlist: newDBlist,
                        editloading: false,
                        editvisible: false,
                        editcurrentDB: result.data.id
                    });

                } else {//保存失败
                    message.warn(result.msg,10);//提示失败信息
                    this.setState({ editloading: false });
                }
            } else {//校验字段有误
                this.setState({ editloading: false });
            }
        });
    }


    //********************************编辑逻辑-结束**************************************** */
    //********************************删除逻辑-开始**************************************** */


    //删除确认后触发
    handleDelete = () => {
        this.setState({ deleteloading: true });
        this.handleDeleteSubmit();
    }
    //删除提交
    handleDeleteSubmit = async () => {
        var { editcurrentDB, currentDB } = this.state;
        const result = await reqDeleteDB(editcurrentDB);//请求后台进行保存
        if (result.status === 1) {
            message.success(result.msg,10);
            var { DBlist } = this.state;
            var index = -1;
            for (var i = 0; i < DBlist.length; i++) {
                if (DBlist[i].id === editcurrentDB) {
                    index = i;
                    continue;
                }
            }
            if (index !== -1) {
                DBlist.splice(index, 1);
            }

            console.log(DBlist);
            memoryUtils.currentDBlist = DBlist;
            if (!DBlist || DBlist.length === 0) {//当最后一个数据源被删除后，清空并初始化整个应用
                storageUtils.setCurrentDB("-1");//将缓存标志设置成初始状态
                memoryUtils.currentDB = "-1";//将临时记忆设置成初始状态
                var { empty } = this.props;
                empty();//清空和初始化admin组件
                this.setState({//清空和初始化当下组件
                    DBlist: [],
                    deleteloading: false,
                    editvisible: false,
                    currentDB: "选择或添加数据源",
                    editcurrentDB: ''
                });

            } else if (editcurrentDB === currentDB) {//当被删除的数据源正好是目前正在用的数据源时，触发数据源变更。
                storageUtils.setCurrentDB(DBlist[0].id);//更新状态
                memoryUtils.currentDB = DBlist[0].id;//更新状态
                this.setState({//渲染界面
                    DBlist: DBlist,
                    deleteloading: false,
                    editvisible: false,
                    currentDB: DBlist[0].id,
                    editcurrentDB: DBlist[0].id
                });
                this.handleSelectChange(DBlist[0].id);
            } else {
                storageUtils.setCurrentDB(currentDB);//更新状态
                memoryUtils.currentDB = currentDB;//更新状态
                this.setState({//渲染界面
                    DBlist: DBlist,
                    deleteloading: false,
                    editvisible: false,
                    editcurrentDB: currentDB
                });
            }

        } else {
            message.warn(result.msg,10);
            this.setState({ deleteloading: false });
        }
    }



    //********************************删除逻辑-结束**************************************** */





    render() {
        const { getFieldDecorator } = this.props.form;

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
        const { DBlist, visible, loading, editvisible, deleteloading, editloading } = this.state;

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
                    {DBlist.map(item => (
                        <Option key={item.id}>
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
                    onCancel={this.handleEditCancel}
                    footer={[
                        <Button key="back" onClick={this.handleEditCancel}>
                            取消
                        </Button>,
                        <Popconfirm
                            title="确认要删除这个数据源？"
                            cancelText="取消"
                            okText="确认"
                            onConfirm={this.handleDelete}
                            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                        >
                            <Button key="submit" type="danger" loading={deleteloading} >
                                删除
                            </Button>
                        </Popconfirm>,
                        <Button key="submit" type="primary" loading={editloading} onClick={this.handleEdit}>
                            保存
                        </Button>,
                    ]}
                >
                    {/* 数据源选择列表 */}


                    <Form {...formItemLayout} onSubmit={this.handleEditSubmit}>

                        <Form.Item label="选择数据源">
                            {getFieldDecorator('id', {
                                rules: [],
                            })(
                                <Select
                                    value={this.state.editcurrentDB}
                                    onChange={this.handleEditSelectChange}
                                    placeholder="选择数据源"
                                >
                                    {DBlist.map(item => (
                                        <Option key={item.id}>
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