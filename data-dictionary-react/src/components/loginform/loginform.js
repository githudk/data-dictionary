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
    //将登陆按钮置灰
    this.props.form.validateFields();
  }

  //登陆
  handleSubmit = e => {
    const history = this.props.history;
    e.preventDefault();
    this.props.form.validateFields(async(err, values) => {
      const {username, password} = values;
      //登陆表单数据验证通过
      if (!err) {
        const data = await reqLogin(username, password);
        if(data.status === 1){
          message.success(data.msg);
          memoryUtils.loginStatus = 1;//将登陆状态记录在内存
          storageUtils.loginSuccess();//将登陆状态持久化到浏览器缓存中
          history.replace("/");//跳转到应用界面
        }else if(data.status === 0){//登陆失败
          message.error(data.msg);
        }
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // 焦点时，才显示错误提示.
    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>

        <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>

        <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
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