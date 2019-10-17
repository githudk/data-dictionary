

/**
 * 浏览器本地持久化数据
 */
export default{


    loginSuccess(){
        localStorage.setItem("login_status",1);
    },

    getLoginStatus(){
        return localStorage.getItem("login_status") ? localStorage.getItem("login_status") : 0 ;
    },

    logout(){
        localStorage.removeItem("login_status");
    },

    setCurrentDB(value){
        localStorage.setItem("currentDB",value);
    },

    getCurrentDB(){
        return localStorage.getItem("currentDB") ? localStorage.getItem("currentDB") : "-1" ;
    },


}