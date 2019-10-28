import ajax from '../ajax/ajax.js'

//登陆请求
export const reqLogin = (username, password) => ajax('/admin/login', { username, password }, 'get');
//添加数据源
export const reqSaveDB = (newDataSource) => ajax('/datasource/savedb', newDataSource, 'post');
//获取数据源列表
export const reqGetDBList = () => ajax('/datasource/getdblist', {}, 'get');
//根据数据源ID获取表
export const reqGetTables = (currentDB) => ajax('/dictionary/gettables', { currentDB }, 'get');
//根据数据源ID获取表
export const reqGetTablesBytext = (currentDB, text) => ajax('/dictionary/gettablesbytext', { currentDB, text }, 'get');
//根据数据源ID和表名获取字段
export const reqGetColumns = (currentDB, tablename) => ajax('/dictionary/getcolumns', { currentDB, tablename }, 'get');
//添加数据源
export const reqDeleteDB = (currentDB) => ajax('/datasource/delete', { currentDB }, 'get');