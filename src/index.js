var Vue = require('vue');
var VueRouter = require('vue-router');
window.$ = require('jquery-ajax');
var routerConfig = require('./config/router.config.js');
var httpCodeConfig = require('./config/http_code.config.js');

/**
	APIDEBUG:true,所有ajax请求后台的接口会代理到api文件夹对应json文件,并模拟数据返回
	e.g: 请求地址为'/user/login'的会代理为请求'./api/user.login.json'.
*/
var APIDEBUG = true;

//路由
Vue.use(VueRouter);
window.Router = new VueRouter();
Router.map(routerConfig.map)
.alias(routerConfig.alias)
.redirect(routerConfig.redirect)
.start({
	data:function(){
		return {
			root:{
				title:'测试站点'
			}
		}
	}
},'html');

//统一请求入口,需要考虑请求失败的。。
window.Net = {
	get:function(url,data,cb){
		if(typeof data == 'function'){cb = data;data = {};}
		APIDEBUG && (url = './api/'+url.substring(1).replace(/\//g,'.')+'.json');
		$.get(url,data,function(rs){
			var prev = httpCodeConfig[rs.status];
			if(prev){
				prev.do && prev.do(rs);
				prev.next && cb && cb(rs);
			}else{
				cb && cb(rs);
			}
		})
	},
	post:function(url,data,cb){
		if(typeof data == 'function'){cb = data;data = {};}
		APIDEBUG && (url = './api/'+url.substring(1).replace(/\//g,'.')+'.json');
		$.post(url,data,function(rs){
			var prev = httpCodeConfig[rs.status];
			if(prev){
				prev.do && prev.do(rs);
				prev.next && cb && cb(rs);
			}else{
				cb && cb(rs);
			}
		})
	},
	ajax:function(option){
		if(option.type.toLowerCase() == 'get'){
			Net.get(option.url,option.data,option.success,option.fail);
		}else if(option.type.toLowerCase() == 'post'){
			Net.post(option.url,option.data,option.success,option.fail);
		}else{
			$.ajax(option);
		}
	}
}