
/*
 * @fileOverview  EPG 模板导航
 * @version 1.0
 * @author hehy
 */

(function(window){
	// map 对象 ，
	function Map(){
		this.container = new Object();

		// strToObj  把 传入的 str 字符串 转换成 map
		this.strToObj = function(str){
			if(str){
				str = str.split(",");
				if(str.length > 0){
					for(var i = 0, j = str.length; i < j; i++){
						if(str[i].indexOf("=") > 0){
							var tempKey = str[i].substring(0,str[i].indexOf("="));
							var tempValue = str[i].substring(str[i].indexOf("=") + 1);
							this.put(tempKey,tempValue);
						}
					}
				}
			}
		};


		this.getLastNavigationUrl = function(str){
			var navUrlArray = str.split(',');
			var url = "";
			if(navUrlArray.length > 0) {
				url = navUrlArray.pop();
				var navUrlStr = navUrlArray.join(",");
				BackObj.setCookie("navBack", navUrlStr);
				if(url && url.indexOf("=") > 1){
					url = url.substring(url.indexOf("=") + 1);
				}
				return url;
			}
		};

	}

	Map.prototype.put = function(key, value){
		this.container[key] = value;
	}

	Map.prototype.get = function(key){
		return this.container[key];
	}
	Map.prototype.remove = function(key) {
		delete this.container[key];
	}
	Map.prototype.size = function(){
		var count = 0;
		for(var key in this.container){
			if (this.container.hasOwnProperty(key)) count++;
		}
		return count;
	}
	Map.prototype.keySet = function() {
		var keyset = new Array();
		var count = 0;
		for (var key in this.container) {
			if (this.container.hasOwnProperty(key)) {
				if (key == 'extend') {
					continue;
				}
				keyset[count] = key;
				count++;
			}
		}
		return keyset;
	}

	// toString()  方法 ， 把 map 中的元素格式化成字符串返回
	Map.prototype.toString = function(){
		var str = "";
		for(var i = 0,keys = this.keySet(), j = keys.length; i < j; i++ ){
			str = str + keys[i] + "=" + this.container[keys[i]];
			if(i + 1 < j){
				str = str + ",";
			}
		}
		return str;
	}


	// BackObj 对象， 提供外部调用的方法
	var BackObj = {
		setCookie:function(key,val){
		    var Days = 7;
		    var exp = new Date();
		    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		    document.cookie = key + "=" + escape(val) + ";expires=" + exp.toGMTString();
		},

		getCookie:function(key) {
		    var arr=null;
		    if(document.cookie!=null && document.cookie.length>0)
		       arr=document.cookie.match(new RegExp("(^| )"+key+"=([^;]*)(;|$)"));
		    if (arr != null)
		        return unescape(arr[2]);
		    return null;
		},


		getNewMap:function(){
			//var backObj = new Map();
			return new Map();
		},



		 /**
		 * @function addNavigationUrl
		 * @param {string} url 地址
		 * @description 导航地址压入数组
		 * @example XEpg.Util.addNavigationUrl("test.htm?a=cc&b=kk");
		 */
		 addNavigationUrl:function(key,url){
			 var tempUrl = this.getCookie("navBack");
			 var backObj = this.getNewMap();
			 if(tempUrl){
				 backObj.strToObj(tempUrl);
			 }

			 var temp = url.split("?");
			 url = temp[0];
			 if(temp.length > 1){
				 url += "?" + encodeURI(temp[1]);
			 }
			backObj.put(key,url);
			this.setCookie("navBack",backObj.toString());
		},
		

	     /**
		 * @function gotoBackNavigationUrl
		 * @description 跳回前一导航页面
		 * @example XEpg.Util.gotoBackNavigationUrl();
		 */
		gotoBackNavigationUrl:function(key){
			var str = this.getCookie("navBack");

			var url = "";
			if(str){
				var backObj = this.getNewMap();
				backObj.strToObj(str);
				if(key){		// 传入 key 就根据 key 来查找
					url = backObj.get(key);
				}else {			// 不传入 key 的情况下默认返回当前页面的上一级页面
					url = backObj.getLastNavigationUrl(str);
				}
				if(url){
					window.location.href = url;
				}
			}
		}
  };

	//如果Epg类没有创建
	if(!(typeof(window["XEpg"])=="object" && window["XEpg"]!=null)){
		window["XEpg"]={};
	}

	//赋值让外部调用
	window["XEpg"].Navigation = BackObj;

})(window);