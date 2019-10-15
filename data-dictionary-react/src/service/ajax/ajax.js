import axios from 'axios'
import { message } from 'antd'


export default function ajax(url, data = {}, type = "get") {

    return new Promise((resolve, reject) => {
        let promise;
        if (type === "get") {
            promise = axios.get(url, { params: data });
        } else {
            promise = axios.post(url, data);
        }
        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            message.error("请求出错" + error.message);
        })
    });



}