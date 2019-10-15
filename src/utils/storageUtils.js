

/**
 * 浏览器本地持久化数据
 */
export default{


    saveUser(user){
        localStorage.setItem("admin_user",JSON.stringify(user));
    },

    getUser(){
        return JSON.parse(localStorage.getItem("admin_user") || '{}') ;
    },

    removeUser(){
        localStorage.removeItem("admin_user");
    }
}