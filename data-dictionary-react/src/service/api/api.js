import ajax from '../ajax/ajax.js'

export const reqLogin = (username,password) => ajax('/admin/login',{username,password},'get');

export const reqAddDB = (data) => ajax('/adddb',data,'post');