import React, { Component } from 'react'
import { Table, Input, Button, Icon } from 'antd';
import Highlighter from 'react-highlight-words';

const data = [
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
  {
    key: '1',
    columnname: 'goodname',
    columncomment: "描述",
    datatype: 'char',
    datalen:20
  },
];

class CTable extends Component {
  state = {
    searchText: '',
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });
  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const columns = [
      {
        title: '字段名',
        dataIndex: 'columnname',
        key: 'columnname',
        width: '20%',
        align: "center",
        sorter: (a, b) => a.columnname.length - b.columnname.length,
        ...this.getColumnSearchProps('columnname'),
      },
      {
        title: '字段描述',
        dataIndex: 'columncomment',
        key: 'columncomment',
        width: '20%',
        ...this.getColumnSearchProps('columncomment'),
      },
      {
        title: '存储类型',
        dataIndex: 'datatype',
        key: 'datatype',
        width: '20%',
        align: "center",
        ...this.getColumnSearchProps('datatype'),
      },
      {
        title: '存储长度',
        dataIndex: 'datalen',
        key: 'datalen',
        width: '20%',
        align: "center",
        ...this.getColumnSearchProps('datalen'),
      },
    ];
    return <Table style={{height:"90%"}} bordered pagination={{ pageSize: 500 }} scroll={{ y: 600 }} scrollToFirstRowOnChange={true} columns={columns} dataSource={data} />;
  }
}

export default CTable;