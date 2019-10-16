import ajax from '../ajax/ajax.js'

export const reqLogin = (username,password) => ajax('/admin/login',{username,password},'post');

export const reqAddDB = (data) => ajax('/admin/adddb',data,'post');