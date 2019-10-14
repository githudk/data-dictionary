import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import './topnav.less'

const { SubMenu } = Menu;

class TopNav extends Component {

  state = {
    current: 'mail',
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <Menu style={{ height: 54,backgroundColor: '#fff' }} onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
        <Menu.Item key="mail">
          <Icon type="mail" />
          <span className='navtext'>表</span>
        </Menu.Item>
        <Menu.Item key="app">
          <Icon type="appstore" />
          <span className='navtext'>索引</span>
        </Menu.Item>
      </Menu>
    );
  }
}

export default TopNav;