import ajax from '../ajax/ajax.js'

//登陆请求
export const reqLogin = (username, password) => ajax('/admin/login', { username, password }, 'get');
//添加数据源
export const reqSaveDB = (newDataSource) => ajax('/admin/savedb', newDataSource, 'post');
//获取数据源列表
export const reqGetDBList = () => ajax('/admin/getdblist', {}, 'post');
//根据数据源ID获取表
export const reqGetTables = (currentDB) => ajax('/admin/gettables', { currentDB }, 'post');
//根据数据源ID和表名获取字段
export const reqGetColumns = (currentDB, tableName) => ajax('/admin/getcolumns', { currentDB, tableName }, 'post');