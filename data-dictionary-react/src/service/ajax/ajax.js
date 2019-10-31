import axios from 'axios'
import { message } from 'antd'
import memoryUtils from '../../utils/memoryUtils.js'

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
        }).catch((error) => {
            memoryUtils.error = true;
            console.log(error.message);
            message.error("真不巧，出错了[＞﹏＜]",10);
        })
    });



}