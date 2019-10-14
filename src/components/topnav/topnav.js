import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import './topnav.less'

const { SubMenu } = Menu;

class TopNav extends Component {

  state = {
    current: 'database',
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
        <Menu.Item key="database">
        <Icon type="database" />
          <span className='navtext'>表</span>
        </Menu.Item>
        <Menu.Item key="filter">
        <Icon type="filter" />
          <span className='navtext'>索引</span>
        </Menu.Item>
      </Menu>
    );
  }
}

export default TopNav;