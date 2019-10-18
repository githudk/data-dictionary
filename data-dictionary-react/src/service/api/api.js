import ajax from '../ajax/ajax.js'

export const reqLogin = (username,password) => ajax('/admin/login',{username,password},'get');

export const reqAddDB = (data) => ajax('/admin/adddb',data,'post');

export const reqGetAllDBList = () => ajax('/admin/getalldblist',{},'post');

export const reqGetAllTable = (id) => ajax('/admin/getalltable',{id},'post');