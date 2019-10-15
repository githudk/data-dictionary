import React, { Component } from 'react'
import { Form, Icon, Input, Button, message} from 'antd';
import { reqLogin } from '../../service/api/api.js' 
import memoryUtils from '../../utils/memoryUtils.js'
import storageUtils from '../../utils/storageUtils.js'

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class LoginForm extends Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    const history = this.props.history;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const {username, password} = values;
      //验证成功
      if (!err) {
        //const response = await reqLogin(username, password);
        //const result = response.data;
        var result = {
          status : 0,
          msg: "用户名或密码错误"
        };
        if(username==="admin" && password === "123456"){
          result = {
            status : 1  
          }
        }
        if(result.status === 1){
          message.success("登陆成功");
          memoryUtils.user = {
            id : "admin"
          };
          storageUtils.saveUser({
            id : "admin"
          });
          history.replace("/");
        }else if(result.status === 0){
          message.error(result.msg);
        }
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            登陆
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default Form.create({ name: 'horizontal_login' })(LoginForm);