import ajax from '../ajax/ajax.js'

export const reqLogin = (username,password) => ajax('/login',{username,password},'post');

export const reqAddDB = (data) => ajax('/adddb',data,'post');