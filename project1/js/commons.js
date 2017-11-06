/**
 * HZ杭州融合平台抽象通用逻辑(基于common.js)
 * XEpg.SP
 * XEpg.SP.LOGGER
 */
;(function( window , XEpg , undefined ){

//获取当前页面的Url地址
//var params = XEpg.My.parseUrl();			

//Xepg工具对象引用
var fn = XEpg.Util;

//统计日志的页面标识(名称),页面id.每个页面是唯一的值( cms(index), detail, detail_variety, list, prod )
var pageId = '';
var pageMatch = location.href.match(/^http[^&?]+\/page\/([a-zA-Z\/]+)\.html/);
if (pageMatch) {
    pageId = pageMatch[1].replace('/default', '').replace('/', '_');
};

/**
 *统计日志 Product 参数( 发送日志的参数 ):内部使用
 *调用 SP.buildProduct创建Product对象
 * @param code:产品编码
 * @param exCode:产品外部编码
 * @param name:产品名称
 * @param conType:产品类型
 * @param type:资费方式
 * @param price:价格
 * @constructor
 */
var Product = function(code, exCode, name, conType, type, price) {
    this.code = '' + code;		
    this.exCode = '' + exCode;
    this.name = '' + name;
    this.conType = '' + conType;
    this.type = type;
    this.price = price;
};


/**
 * 
 */
var SP = XEpg.SP = {
	
	//统计日志的页面标识( 名称 )
	PAGE_ID: pageId,
	
	//跳转页面地址
	INDEX_PAGES : 'index.html',		
	LIST_PAGES : 'list.html',
	DETAIL_PAGES : 'detail.html',
	
	
	/**
	 * 页面元素内容类型 (内容:content, 栏目：category, 专区：special)
	 */
	CONTENT : 'content',
	CATEGORY : 'category',
	SPECIAL : 'special',
	
	/**
	 * 产品包 (可覆盖)
	 * CP编码
	 * CP名称
	 */
	cpCode : 'HQHY',		
	cpName : '环球合一',
	
 	 /**
     * 构建产品包对象
     * @param code {String} 内部code
     * @param exCode {String} 外部code
     * @param name {String} 名字
     * @param conType {String} 产品包类型
     * @param type {Number} 交费类型 0: ppv 1:包月、2:包年、3:包季度
     * @param price {Number} 价格
     * @returns {Product}
     */
    buildProduct: function(code, exCode, name, conType, type, price) {
        return new Product(code, exCode, name, conType, type, price);
    },
	
	// 获取页面类型，统计日志用( 发送日志的参数 )
    getPageType: function () {
        var pageType = this.PAGE_ID.replace(/_\w+$/g, '');
        var pageIds = {
            'index': 'special',		//首页推荐位
            'list': 'category',		//列表页
            'detail': 'content',	//详情页
            'prod': 'product'		//订购页
        }
        return pageIds[pageType] || pageType;
    },
    // 获取页面url参数
   /* getParam: function () {
        return params;
    },*/
    
    /**
     * 获取导航栏目列表
     * @param params {Object} .eg {code: 1282}
     * @param callback {Function} 回调函数
     */
    getTagsData: function (params, callback) {
        var url = '../../ajax/getInterface.jsp?action=getTagsData' + this.serializeParams(params,true);
        fn.ajaxGet(url, function (res) {
            var data = XEpg.Util.parseJSON(res);
            if (data.result && callback) {
                callback(data.result);
            }
        });
    },
    
    /**
     * 获取分页内容列表
     * @param {Object} params
     * @param {Function} callback  回调函数
     */
    getIndexData: function (params, callback) {
        var url = '../../ajax/getInterface.jsp?action=getIndexData' + this.serializeParams(params,true);
        fn.ajaxGet(url, function (res) {
            var data = XEpg.Util.parseJSON(res);
            var count = data.sizetotal;			//总记录数
            var pages = data.pagetotal || 1;	//当前列表总页数
            if (data.result && callback) {
                callback(data.result,count,pages);
            }
        });
    },
    
    /**
     * 获取内容详情
     * @param {Object} params
     * @param {Function} callback  回调函数
     */
    getDetailData: function (params, callback) {
        var url = '../../ajax/getInterface.jsp?action=getDetailData' + this.serializeParams(params,true);
        fn.ajaxGet(url, function (res) {
            var data = XEpg.Util.parseJSON(res);
           	var detail = null;
            if (data.result && data.result.length === 1) {
                detail = data.result[0];
            }
             callback && callback(detail);
        });
    },
    
    /**
     * 请求参数对象序列化为url地址
     * @example	&pageindex=1&pagesize=8
     * @param {Object} params
     * @param  params :参数标识，确定url前缀使用 ? 还是 &(不传默认为 ? )
     */
    serializeParams : function ( params , flag ){
    	var values = '',value = '', mark = '&';
    	if( params && (Object.prototype.toString.call(params) === '[object Object]')  ){
    		flag ? mark = '&' : mark = '?';   
    		for(var param in params ){
    			var value = params[param];
    			values += (mark + param + '=' + value);
    			if( mark !== '&' ){
    				mark = '&';	
    			}
    		}
    	}
    	return values;
    },
    /**
     * 替换函数
     * @param {Object} str:带有 {} 特殊字符的字符串
     * @param {Object} obj : JSON对象 
     */
	substitute : function (str, obj){
		if (!(Object.prototype.toString.call(str) === '[object String]')) {
		    return '';
		}
		if(!(Object.prototype.toString.call(obj) === '[object Object]' && 'isPrototypeOf' in obj)) {
	    	return str;
		}
		return str.replace(/\{([^{}]+)\}/g,function(match,key,originalText){
			var value = obj[key];
			return ( value !== undefined ) ? '' + value : '';
		})
	},
	
	/**
	 *保存当前焦点页面信息放入cookie
	 * @param {Object} key : 页面名称
	 * @param {Object} params ：url传递的对象参数
	 */
	saveCurrentPageInfo : function(key, params){
		var url = window.location.href;
	    if( url.indexOf("?") > 0 ){
	        url = url.split("?")[0];
	    }
	    var values = this.serializeParams(params);
	    url = url + values;
	    BackObj.addNavigationUrl(key,url);
	},
	
	/**
	 * 无缝滚动文字效果
	 */
	moveEle : null,
	txtEle : null,
	scrollTimer : null,		//定时器引用
	textFID : 'grid',		//自定义获取当前文本元素的父元素，可覆盖
	valueTime : 20,			//自定义定时器时间，默认为20毫秒，可覆盖
	textScroll : function(){ //滚动文字父元素
		if( $(XEpg.My.currentId) ){
			$(XEpg.My.currentId).className = 'item item_focus';
			var index = parseInt(XEpg.My.currentId.substring(5) , 10);
	        SP.moveEle = $(SP.textFID + '_' + index + '_move');		//获取当前文本元素的父元素
	        SP.txtEle = $(SP.textFID  + '_' + index + '_txt');		//获取当前文本元素
	        //如果元素的实际宽度大于元素的固定宽度，则进行文字滚动
			if( SP.moveEle.scrollWidth > SP.moveEle.offsetWidth ){
				$(SP.textFID + '_' + index + '_copy').innerHTML =  '　' + SP.txtEle.innerHTML;
		        SP.startScroll();//父元素向左循环移动(设置父元素scrollleft)
		    }
		}
	},
	startScroll : function(){
		//如果移动的尺寸大于等于内容实际尺寸，就从0开始循环
		if(SP.moveEle.scrollLeft >= SP.txtEle.offsetWidth + 21.5){
           SP.moveEle.scrollLeft = 0;
        }else {
          	SP.moveEle.scrollLeft++;
        }
      	SP.scrollTimer = setTimeout(arguments.callee, SP.valueTime);
	},
	//清除文字滚动
	clearTextStyle : function(){
		if( $(XEpg.My.currentId) ){
			clearTimeout(SP.scrollTimer);			//清除定时器
			$(XEpg.My.currentId).className = 'item';
			var index = parseInt(XEpg.My.currentId.substring(5) , 10);
	        var copyEle = $(SP.textFID + '_' + index + '_copy');
	        if(copyEle){
	        	copyEle.innerHTML = '';			    //清空复制的滚动文字
	        }
	        if(SP.moveEle){
	        	SP.moveEle.scrollLeft = 0;	        //清空scrollLeft
	        }
       }
	}
};

 /**
 * event对象
 * @param name {String} eg view, exit, play, collect, order
 * @param prop {Object} eg {p_id: '', p_type: ''}
 * @constructor
 */
var Event = function (name, prop) {
    var t = new Date();
    prop.t = +t;
    prop.t_zone = -t.getTimezoneOffset() / 60;
    this.name = name;
    this.prop = prop;
};


/**
 * 日志收集器
 * @type {{init: SP.LOGGER.init, log: SP.LOGGER.log, push: SP.LOGGER.push, flush: SP.LOGGER.flush}}
 */
var LOGGER = SP.LOGGER = {
    version: 1.1, // 日志规范v1.0
    
    ns: "__ks", // 命名空间
    
    //产品参数
	prodList : [
        {code:'HQHYKDP', exCode: 'exHQHYKDP',category: 'movie', name:"环球影院包月", price:"18", type:1, unit: '月', describe:"原价25元/月，上线7折超值优惠，震撼蓝光级影片随心享！（活动至2016年8月31日）"},
        {code:'HQHYRJ', exCode: 'exHQHYRJ',category: 'drama', name:"环球剧场包月", price:"15",type:1, unit: '月',original:"20", describe:"原价20元/月，上线优惠7.5折，更多精彩内容即将上线。"},
        {code:'MGTV', exCode: 'exMGTV',category: 'variety', name:"芒果TV", price:"15",type:1, unit: '月',describe:"原价20元/月，上线优惠7.5折，更多精彩内容即将上线。"},
        {code:'ADM', exCoce: 'exADM',category: 'comic', name:"爱动漫", price:"15",type:1, unit: '月',describe:"原价20元/月，上线优惠7.5折，更多精彩内容即将上线。"},
        {code:'MGTV2', exCode: 'exMGTV2',category: 'variety', name:"芒果TV2", price:"50",type:3, unit: '季度',describe:"原价60元/月，上线优惠7.5折，更多精彩内容即将上线。"}
    ],
    
    //eleDatas: {}元素数据
    /**
     * 加载统计脚本
     * @param url {String} sdk地址
     * @param reportUrl {String} 日志收集地址
     * @param siteId {String} 站点标识，由云平台生成
     * @param pageType {String} 页面各类
     */
    init: function (url, reportUrl, siteId, userId,callback) {
        var w = window;
        var n = this.ns;
        w['_KLDTECDataStatistic'] = n;
        w[n] = {};
        w[n]._img = reportUrl;
        w[n]._sid = siteId; //
        w[n]._uid = userId;
        w[n].$app_version = this.version;
        if (!w[n]._t) {
          	var script = document.createElement('script');
			if(script.readyState){ // IE
 				script.onreadystatechange = function(){
           			if(script.readyState == 'loaded' || script.readyState == 'complete'){
             			script.onreadystatechange = null;	//删除事件句柄，防止多次调用
               			callback && callback();
           			}
           		}
   			}else{				// FF, Chrome, Opera, ...
   				script.onload = function(){
       				callback &&	callback();
    			}
   			}
			script.src = url;
			document.getElementsByTagName('body')[0].appendChild(script);
            w[n]._t = 1 * new Date();
        }
        this.inited = true;
    },
    
    /**
     * 根据下标获取当前产品对象
     * @param {Number} index
     */
    getCurProd : function ( index ) {
       //var prodIdx = fn.Store.get(SP.KEY.CUR_PROD_IDX);
       if( typeof index === 'number' ){
       		var prod = this.prodList[index];
       		return SP.buildProduct(prod['code'], prod['exCode'], prod['name'], prod['category'], prod['type'], prod['price']);
       }
	},
    /**
     * 发送日志到服务器
     * @param event {String} 事件名
     * @param data {Object} 事件属性
     * @param callback {Function} 回调方法
     */
    log: function (event, data, callback) {
        var logger = window[this.ns];
        //logger && logger.log(event, data, callback);
        if( logger && logger.log ){
        	logger.log(event, data, callback);
        }
    },
    /**
     * 将日志放入缓存
     * @param event {String} 事件名
     * @param data {Object} 事件属性
     */
    push: function (event, data) {
        var logger = window[this.ns];
        if( logger && logger.push ){
        	logger.push(event, data);
        }
    },
    /**
     * 将缓存区日志发送到服务器
     * @param callback {Function} 回调方法
     */
    flush: function (callback) {
        var logger = window[this.ns];
        if( logger && logger.flush ){
        	logger.flush(callback);
        }
    },
    /**
     * 构造页面访问事件
     * @param pgId {String} 页面 id
     * @param pgType {String} 页面类型
     * @param pgName {String} 页面名称
     * @param loadingTime {Number} 加载时间
     * @param product {Product} 产品包
     * @returns {Event}
     */
    buildPageViewEvent: function (pgId, pgType, pgName, loadingTime, product) {
        //var self = this;
        return new Event('view', {
        	p_id: ''+pgId,						//页面标识: cms, detail, detail_variety, list, prod
            p_type: ''+pgType,					//页面种类: special, category, content, product
            p_name: ''+pgName,					//环球影院
            p_referer: document.referrer,		//访问来源：页面上级来源: http://*******
            p_url: location.href,				//访问页面链接http://*******
            t_loading: loadingTime,				//加载时间单位毫秒：330
            pkg_code: product['code'],			//产品编码332    ()
            pkg_exCode: product['exCode'],		//产品外部编码344 ()
            pkg_name: product['name'],			//产品名称环球影院
            pkg_con_type: product['conType'],	//产品类型:comic:动漫，movie:电影，variety:综艺，drama:剧集，game:游戏，finance:财经，life:生活，opera:戏曲, education:教育，military:军事，polymerization:聚合
            pkg_type: product['type']			//资费方式:0:ppv, 1:包月，2:包年，3：包季度  ()
        });
    },
    
   
    
    /**
     *
     * 构造页面退出事件
     * @param pgId {String} 页面 id
     * @param pgType {String} 页面类型
     * @param pgName {String} 页面名称
     * @param t_duration {Number} 页面停留时间
     * @param product {Product} 产品包
     * @returns {Event}
     */
    buildPageExitEvent: function (pgId, pgType, pgName, t_duration, product) {
        return new Event('exit', {
        	p_id: ''+pgId,
            p_type: ''+pgType,
            p_name: ''+pgName,
            p_referer: document.referrer,
            p_url: location.href,
            t_duration: t_duration,
            pkg_code: product['code'],
            pkg_exCode: product['exCode'],
            pkg_name: product['name'],
            pkg_con_type: product['conType'],
            pkg_type: product['type']
        });
    },
    
  
    /**
     * 播放事件
     * @param id
     * @param name
     * @param type
     * @param cpName
     * @param tDuration
     * @param seriesId
     * @param seriesName
     * @param product {Product} 产品包
     * @returns {Event}
     * 
     */
    buildPlayEvent: function (id, name, type, cpName, tDuration, seriesId, seriesName, product) {
        return new Event('play', {
            con_id: '' + id,	//内容编码:123
            con_name: ''+name,	//内容名称:魔兽世界
            con_type: ''+type,	//内容类型(电影、电视剧、综艺、剧场)
            cp_name: ''+cpName,	//CP名称(内容类型)
            t_duration: tDuration,	//停留时间:单位毫秒： 45000
            con_series_id: '' + seriesId,	//剧头内容编码
            con_series_name: ''+seriesName, //剧头内容名称
            pkg_code: product['code'],		//产品编码
            pkg_exCode: product['exCode'],	//产品外部编码
            pkg_name: product['name'],		//产品名称
            pkg_con_type: product['conType'],	//产品类型
            pkg_type: product['type']		//资费方式
        });
    },
    /**
     * 元素点击事件
     * @param pgId
     * @param pgType
     * @param pgName
     * @param data
     * @param parId {String} 父栏目id, 当点击二级栏目时需要
     * @param product {Product} 产品包
     * @returns {Event}
     */
    buildEleClickEvent: function (pgId, pgType, pgName, data, parId, product) {
        return new Event('click', {
        	p_id: ''+pgId,			//页面id
            p_type: ''+pgType,		//页面类型
            p_name: ''+pgName,		//页面标题
            p_url: location.href,	//页面地址
            ele_codes: ''+data['code'], //页面元素内容code
            ele_type: ''+data['type'],	//页面元素内容类型
            ele_name: ''+data['name'],	//页面元素内容名称
            ele_pos: data['_pos'],		//页面元素次序
            cate_parId: ''+ parId || null,	//父栏目id,1621（二级栏目点击时上报）
            pkg_code: product['code'],		//产品编码
            pkg_exCode: product['exCode'],	//产品外部编码
            pkg_name: product['name'],		//产品名称
            pkg_con_type: product['conType'],	//产品类型
            pkg_type: product['type']			//资费方式
        });
    },
    /**
     * 订购事件
     * @param seriesId
     * @param seriesName
     * @param type
     * @param cpName
     * @param product {Product} 产品包
     * @param ordType
     * @returns {Event}
     */
    buildOrderEvent: function (type, cpName,seriesId, seriesName, product, ordType) {
        return new Event('order', {
            con_type: ''+type,				//内容类型(电影、电视剧、综艺、剧场)
            cp_name: ''+cpName,				//CP名称
            con_series_id: '' + seriesId,	//剧头内容编码
            con_series_name: ''+seriesName,	//剧头内容名称
            pkg_code: product['code'],		//产品编码
            pkg_exCode: product['exCode'],	//产品外部编码
            pkg_name: product['name'],		//产品名称
            pkg_con_type: product['conType'],	//产品名称
            pkg_type: product['type'],		//资费方式
            ord_type: ordType,				//订单类型
            ord_price: product['price']		//现价
        });
    },
    /**
     * 收藏
     * @param type
     * @param cpName
     * @param seriesId
     * @param seriesName
     * @param product {Product} 产品包
     * @returns {Event}
     */
    buildCollectEvent: function (type, cpName, seriesId, seriesName, product) {
        return new Event('collect', {
            con_type: '' + type,				//内容类型：电影、电视剧、综艺、剧场
            cp_name: '' + cpName,				//CP名称(内容类型)
            con_series_id: '' + seriesId,		//剧头内容编码3214
            con_series_name: '' + seriesName,	//剧头内容名称:北上广不相信眼泪（连续剧）、魔兽世界（电影）、快乐大本营（综艺）
            pkg_code: product['code'],		
            pkg_exCode: product['exCode'],	
            pkg_name: product['name'],		
            pkg_con_type: product['conType'],
            pkg_type: product['type']
        });
    },
   
   /**************************************************************************************/
   //TODO
    /**
     * 初始化SDK,并发送构造页面访问事件
     * @param {Number} index:产品参数数组索引
     * @param {Number} sRequ:页面开始渲染之前的时间
     * @param {Number} userId:用户Id
     * @returns {Number} 页面渲染完成时间
     */
    sendPageView : function( index , sRequ , userId ){
    	if( typeof index === 'number' ){
	    	//初始化SDK logger： sdk脚本地址,日志收集器地址,站点标识,请联系云平台管理员生成站点code,用户标识
			this.init('../js/s.js','http://139.196.210.25:8011/s.gif','',userId,function(){
				var curProd = SP.LOGGER.getCurProd( index );		//获取产品类的参数对象
				//alert('构造页面访问时间' + (  (+new Date()) - sRequ ) + '毫秒');
				//构造页面访问事件
				var viewEvent = SP.LOGGER.buildPageViewEvent(SP.PAGE_ID, SP.getPageType(), document.title,(( +new Date()) - sRequ) ,curProd);
				SP.LOGGER.log(viewEvent.name, viewEvent.prop, function(){});
			});
		}
    },
    
    /**
     * 页面退出：回车或跳转 (数据上报)
     * @param {Number} index:产品参数数组索引
     * @param {Object} sRequ : 页面开始渲染之前的时间
     */
	sendExitEvent : function ( index, sRequ ){
		if( typeof index === 'number' ){
			var curProd = this.getCurProd( index );
			//alert('页面退出时间' + (  (+new Date()) - sRequ ) + '毫秒');
			var exitEvent = this.buildPageExitEvent(SP.PAGE_ID, SP.getPageType(), document.title, (( +new Date()) - sRequ)  ,curProd);
			this.log(exitEvent.name, exitEvent.prop, function(){});	//log
		}
	},
	/**
	 * 用户在某个元素上点了ok按键  (数据上报)
	 * @param {Number} index:产品参数数组索引
	 * @param {String} typeName:页面元素内容类型
	 * @param {Object} objData:当前请求返回的数据对象
	 * @param {String} key(title):传入的obj对象的属性
	 */
	clickEleEvent : function(index , typeName , objData , key){
		var item,data,parentid = null;
		if( typeof index !== 'number' ) return;
		if( !objData || !objData[key] ) return;
		
		item = objData[key];
		if( 'parentid' in objData ){
			parentid = item.parentid;
		}
		data = {'code' : item['id'],'name' : item['name'],'_pos' : 1};
		data['type'] = typeName;
		var curProd = this.getCurProd( index );
		//var viewEvent = SP.LOGGER.buildPageExitEvent(SP.PAGE_ID, SP.getPageType(), document.title, (( +new Date()) - sRequ)  ,curProd);
		//页面id,页面类型,页面标题,页面元素内容code,页面元素内容类型,页面元素内容名称,页面元素次序,
		//父栏目id,1621（二级栏目点击时上报）,产品编码,产品外部编码,产品名称,产品类型,资费方式
		var clickEvent = this.buildEleClickEvent(SP.PAGE_ID,SP.getPageType(),document.title,data,parentid,curProd);
		//alert('页面点击OK事件' + clickEvent);
		console.log(clickEvent); 
		this.log(clickEvent.name, clickEvent.prop, function(){});	//log
			
	},
	
	/**
	 * 用户在某个元素上点了ok按键 MG  (数据上报)
	 * @param {Object} index
	 * @param {Object} data
	 * @param {Object} parId
	 */
	clickEleEventMG : function(index , data, parId){
		if( typeof index !== 'number' ) return;
		var curProd = this.getCurProd( index );
		var clickEvent = this.buildEleClickEvent(SP.PAGE_ID,SP.getPageType(),document.title,data,parId,curProd);
		this.log(clickEvent.name, clickEvent.prop, function(){});	//log
	},
	
	/**
	 * 播放事件
	 * @param {Number} index: 产品参数数组索引
	 * @param {Number} id:内容编码
	 * @param {String} name:内容名称
	 * @param {String} type:内容类型
	 * @param {String} tDuration:停留时间
	 * @param {Number} seriesId:句头内容编码
	 * @param {String} seriesName:句头内容名称
	 */
	playEleEvent : function(index , id, name, type, tDuration, seriesId, seriesName){
		if( typeof index !== 'number' ) return;
		var curProd = this.getCurProd( index );
		var playEv = this.buildPlayEvent(id,name,type,SP.cpName,tDuration,seriesId,seriesName,curProd);
		this.log(playEv.name, playEv.prop, function(){});	//log
	},
	
	/**
	 * 用户点击收藏按钮( 数据上报 )
	 * @param {Number} index:产品参数数组索引
	 * @param {Number} type:内容类型(电影、电视剧...)
	 * @param {Number} seriesId:句头内容编码
	 * @param {String} seriesName:剧头内容名称 (北上广不相信眼泪（连续剧）、魔兽世界（电影）、快乐大本营（综艺）)
	 */
	collectEvent : function(index, type, seriesId, seriesName){
		if( typeof index !== 'number' ) return;
		var curProd = this.getCurProd( index );
		var collectEv = this.buildEleClickEvent(type,SP.cpName,seriesId,seriesName,curProd);
		this.log(collectEv.name, collectEv.prop, function(){});
	},
	
	/**
	 * 订单
	 * @param {Number} index	：产品参数数组索引
	 * @param {String} type		：内容类型(电影、电视剧...)
	 * @param {Number} seriesId ：句头内容编码
	 * @param {Object} seriesName ：剧头内容名称 (北上广不相信眼泪（连续剧）、魔兽世界（电影）、快乐大本营（综艺）)
	 * @param {Object} ordType：现价
	 */
	orderEvent : function(index, type, seriesId, seriesName, ordType){
		if( typeof index === 'number' ){
			var curProd = this.getCurProd( index );
			var orderEv = this.buildOrderEvent(type,SP.cpName,seriesId,seriesName,curProd,ordType);
			this.log(orderEv.name, orderEv.prop, function(){});
		}
	}
};

/*
 * @fileOverview  EPG 模板导航
 * @version 1.0
 * @author hehy
 */
function Map(){
	this.container = new Object();
	this.strToObj = function(str){	// strToObj  把 传入的 str 字符串 转换成 map
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
};

Map.prototype.put = function(key, value){
	this.container[key] = value;
};

Map.prototype.get = function(key){
	return this.container[key];
};
Map.prototype.remove = function(key) {
	delete this.container[key];
};
Map.prototype.size = function(){
	var count = 0;
	for(var key in this.container){
		if (this.container.hasOwnProperty(key)) count++;
	}
	return count;
};
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
};
// 把map中的元素格式化成字符串返回
Map.prototype.toString = function(){
	var str = "";
	for(var i = 0,keys = this.keySet(), j = keys.length; i < j; i++ ){
		str = str + keys[i] + "=" + this.container[keys[i]];
		if(i + 1 < j){
			str = str + ",";
		}
	}
	return str;
};

/**
 * BackObj对象， 提供外部调用的方法
 */
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
	       arr = document.cookie.match(new RegExp("(^| )"+key+"=([^;]*)(;|$)"));
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

//如果EXpg对象没有创建
if( !( typeof(window["XEpg"]) == "object" && window["XEpg"] != null ) ){
	window["XEpg"] = {};
}


//挂载对象
window["XEpg"].Navigation = BackObj;

/**
 * 获取元素对象
 * @param {String} str
 */
function getEleById( str ){
	return document.getElementById(str);
};


//挂载window属性
window.$ = getEleById;


/* END */
})(window,XEpg);
