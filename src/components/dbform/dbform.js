import React, { Component } from 'react'
import { Form, Input, Select,Button } from 'antd';
const { Option } = Select;


class DBForm extends Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    // compareToFirstPassword = (rule, value, callback) => {
    //     const { form } = this.props;
    //     if (value && value !== form.getFieldValue('password')) {
    //         callback('Two passwords that you enter is inconsistent!');
    //     } else {
    //         callback();
    //     }
    // };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    handleWebsiteChange = value => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    };
    handleSelectChange = value => {
        console.log(value);
        this.props.form.setFieldsValue({
            note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
        });
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
        return (
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
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create({ name: 'DBForm' })(DBForm);
