/**
 * Created by 潘超 on 2016/12/16.Edit by HT on2017/09/05
 */

(function() {
	window.$$ = {};
	$$.analyzeXMLString = function(xml) {
		var xmlDoc = null; // 创建空的XML DOM对象
		// 根据不同浏览器进行创建
		if(window.DOMParser) { // 其他浏览器
			// 创建XML字符串解析器
			var parser = new DOMParser();
			// 通过解析器解析具体XML字符串
			xmlDoc = parser.parseFromString(xml, "text/xml");
		} else { // IE浏览器
			// 通过IE浏览器创建XML DOM对象
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			// 关闭异步加载
			xmlDoc.async = false;
			// 加载具体的XML字符串
			xmlDoc.loadXML(xml);
		}
		return xmlDoc; //返回XML DOM对象
	};

	$$.XMLToString = function(xmlObject) {
		// for IE
		if(window.ActiveXObject) {
			return xmlObject.xml;
		}
		// for other browsers
		else {
			return(new XMLSerializer()).serializeToString(xmlObject);
		}
	};
	$$.find = function(xmlDom, selector) {
		return xmlDom.getElementsByTagName(selector)[0].innerHTML;
	};

	$$.findInnerHTML = function(ser, firstString, lastString) {
		return ser.substring((ser.indexOf(firstString) + firstString.length), ser.indexOf(lastString))
	};
	var param = XEpg.My.parseUrl();
	if(param.RST != undefined) {
		var rst = decodeURIComponent(param.RST);
		var BACK_ARG = decodeURIComponent(param.BACK_ARG);
		// var BACKXML = $$.analyzeXMLString(BACK_ARG);
		// document.getElementById('divContent').innerHTML = location.href;
	}
	var programID = param.programID; //节目集编码;
	var backUrl = param.backUrl; //返回路径
	if(backUrl.indexOf('|') > -1) {
		if(param.RST) {
			backUrl = backUrl.replace(/\|/g, '?');
		}
	}
	if(backUrl.indexOf('$') > -1) {
		backUrl = backUrl.replace(/\$/g, '&');
	}
	var categoryCode = param.categoryCode;
	var contentCode = param.contentCode; //节目编码
	var actor = decodeURIComponent(param.actor); //演员
	var state = param.isOrder;//Y已订购N未订购
	var seriesCache = []; //剧集缓存
	var mediaType = param.isMovie; //媒体类型
	var STBTYPE = ''; //机顶盒类型
	var epgdomain = ''; //播放地址截串
	var playTimeNum = param.playTime;
	var orderType = param.orderType;
	var mediaName = param.mediaName;
	var ppvOrderMoney = param.ppvOrderMoney;
	var orderUrl = '';
	var g_poster=param.poster||'';

	if(param.isOrder == undefined) {
		state = 'Y';
	}

	if(param.RST) {
		// var RSTXML = $$.analyzeXMLString(rst);
		var RST_CODE = $$.findInnerHTML(rst, '<RST_CODE>', '</RST_CODE>');
		if(RST_CODE == 0) {
			state = 'Y';
		} else {
			state = 'N';
		}
	} else {
		if(param.isOrder) {
			state = param.isOrder;
		}else {
			state = 'Y';
		}
	}

	var orderTime = null,
		playTimes = 0;
	try {
		STBTYPE = Authentication.CTCGetConfig("STBType");
		epgdomain = Authentication.CTCGetConfig("EPGDomain");
	} catch(e) {

	}
	var mp = null;

	var hideMeidaInfosTimer = null;

	/**
	 * @param $ : 选择器选取元素封装
	 * @type {Function}
	 */
	window.$ = HTMLElement.prototype.$ = function(selector) {
		var elems = (this == window ? document : this).querySelectorAll(selector);
		if(!elems) {
			return null;
		} else if(elems.length == 1) {
			return elems[0];
		} else {
			return elems;
		}
	};

	/**
	 * 如果bind方法无效，重写bind方法
	 *
	 */

	if(!Function.prototype.bind) {
		Function.prototype.bind = function(obj) {
			//this-->当前调用bind方法的函数对象fun
			//将当前函数对象保存为一个局部变量
			var fun = this; //calcSal(base,bonus,other)
			var args = //将类数组对象转为普通数组
				Array.prototype.slice.call(arguments, 1);
			//仅获取除obj参数外的剩余参数：[1:8000]
			//闭包封装了：fun,obj,args
			return function( /*后续参数列表*/ ) {
				//每次调用fun时，都用obj
				fun.apply(obj, args.concat(
					Array.prototype.slice.call(arguments)
				));
			}
		}
	}

	var SetVideoPlay = function() {
		this.id = programID; //媒体code
		this.iptv_flag = XEpg.Util.getCookie('iptv_flag'); //平台信息
		this.btnRow = 2; //按钮区域行
		this.getMpTimer = null; //获取MP对象的定时器序号
		// this.hideMeidaInfosTimer = null;//隐藏块进退定时器
		this.listenrWardOrRewind = null; //监听快进快退时间更新定时器
		this.hideVolumeTimer = null; //隐藏音量滚动定时器序号
		this.state = 0; //状态码：0：正常播放，1 ：暂停 ，2：快进，3：快退
		this.speed = 1; //速度
		this.nowVolume = 0; //当前音量
		this.addNum = 5; //每次增加音量
		this.MAXVOLUME = 100; //最大音量
		this.muteFlag = 0; //是否静音的状态
		this.WIDTH = 0; //滚动条长度
		this.HEIGHT = 0; //绿色音量高度
		this.POINTTOP = 0; //音量圆按钮TOP值
		this.gotoUrl = ''; //上下集跳转链接
		this.typeStr = ''; //虚拟键状态类型
		this.mediaName = decodeURIComponent(mediaName); //媒体名称
		this.currentSeries = 1; //当前剧集
		this.setTo = 0; //当前播放的第几集

		this.endPlayTime = 0; //结束播放时的时间
		this.byTime = param.playTime; //断点续播的时间

		this.backTime = 5; //倒计时最大值5秒
		this.zoneCode = '8FB4A57B0DC043BC89D859A9C1CF6BDF';

		this.wardImg = '../image/icon-x' + this.speed + '.png';
		this.rewindImg = '../image/icon-x' + this.speed + '-a.png';

		this.ppvOrderMoney = 0;
		this.prodCodeArray = ["4KHY", "4KHY"]; //产品ID

		this.authCodeArray = ["4KHYBJ"]; //包季ID

		this.authPPVArray = ['4KHYPPV3', '4KHYPPV5', '4KHYPPV8']; //单品ID
		this.buCodeArray = ["YKYSBY", "YKYSBY"]; //业务ID
		this.look_at_over = false;

		this.updateDateTimer = null;

	};
	
	/***************************基础信息功能区*********************************/

	/**
	 * 初始化返回界面推荐信息
	 * @private
	 */
	SetVideoPlay.prototype._initBackContentList = function() {
		var self = this;
		if(state == 'N') {
			XEpg.My.init({
				'currentAreaId': 'orderBox'
			});
		} else {
			XEpg.My.init({
				'currentAreaId': 'playBtn'
			});
		}
		// $('#mediaInfo').style.display = 'block';
		// $('#mediaName').innerHTML = '../data/getContentList.jsp?categoryCode=' + categoryCode + '&firstIndex=0&maxResult=3';
		XEpg.Util.ajaxGet('../data/getContentList.jsp?categoryCode=' + categoryCode + '&firstIndex=0&maxResult=3', function(data) {
			var data = XEpg.Util.parseJSON(data);
			data = data.getContentListResp.contentInfos;
			var html = '';
			for(var i = 0; i < data.length; i++) {
				var list = data[i];
				html += '<div class="item" id="hotList_' + i + '" style="left:' + (158 * i) + 'px;" ' +
					'title="' + SP.getDetailUrl(list['programType'], list.code, categoryCode, list.elementType) + '">' +
					'<div class="pic"><img src="' + list.poster + '" /></div>' +
					'<div class="txt" id="hotList_' + i + '_move">' +
					'<span id="hotList_' + i + '_txt" style="width:400px;">' + list.name + '</span><span id="hotList_' + i + '_copy"></span>' +
					'</div>' +
					'</div>';
			}
			$('#hotList').innerHTML = html;
			this._initActorList();
		}.bind(this));
		this._initButton();
		this.updateDate();
		if(STBTYPE == 'EC2106V1B_pub') {
			$('#down-icon').style.top = '190px';
		}
		if(STBTYPE == 'EC2106V1B_pub' || STBTYPE == 'B860A') { // 华为2106用 onkeypress 事件，来处理遥控器按键
			document.onkeypress = this.keypress.bind(this);
		} else {
			document.onkeydown = this.keypress.bind(this);
		}

	};
	/**
	 * 初始化演员列表
	 * @private
	 */
	SetVideoPlay.prototype._initActorList = function() {
		var actorHtml = '';
		var actorList = actor.indexOf(' ') > -1 ? actor.split(' ') :
			actor.indexOf(',') > -1 ? actor.split(',') :
			actor.indexOf('，') > -1 ? actor.split('，') : actor.split(' ');
		for(var j = 0; j < actorList.length; j++) {
			var initTop = 51 * (j - 1);
			if(initTop < 0) {
				initTop = -51;
			}
			var top = 117 + (initTop) + 'px';
			actorHtml += '<div class="item" style="top:' + top + '"><div class="txt">' + actorList[j] + '</div></div>';
		}
		$('#performerList').innerHTML = actorHtml;
	};

	/**
	 * 初始化返回界面按钮信息
	 */
	SetVideoPlay.prototype._initButton = function(callBack) {
		if(mediaType == 'movie') {
			$('#playBtn').innerHTML = '<div class="item" id="playBtn_0"  title="over">' +
				'<div class="txt">结束观看</div>' +
				'</div>' +
				'<div class="item" id="playBtn_1" style="top:72px;" title="play">' +
				'<div class="txt">继续观看</div>' +
				'</div>';
			this.btnRow = 2;
			this.setTo = 0;
			callBack && callBack();
			this.focusChange(this.btnRow);
			XEpg.My.pageLoadShowFocus();
			this.createIframeAddPlay();
		} else if(mediaType = 'series') {
			XEpg.Util.ajaxGet('../data/getSeriesSubsetList.jsp?seriesCode=' + contentCode + '&firstIndex=0&maxResult=-1', function(data) {
				var html = '';
				var data = XEpg.Util.parseJSON(data);
				var result = data.getContentListResp;
				data = result.contentInfos;
				seriesCache = data;
				for(var i = 0; i < data.length; i++) {
					if(programID == data[i]['programID']) {
						this.setTo = i + 1;
						if(state == 'N'){
							//当前更新到第一集时
							html += '<div class="item" id="playBtn_0"  title="over">' +
								'<div class="txt">结束观看</div>' +
								'</div>' +
								'<div class="item" id="playBtn_1" style="top:72px;" title="play">' +
								'<div class="txt">继续观看</div>' +
								'</div>';
							this.btnRow = 2;
							clearInterval(orderTime);
							orderTime = null;
							break;
						}
						if(this.setTo == 1 && result.recordSize > 1) { //当前为第一集并且总集数大于1时
							html += '<div class="item" id="playBtn_0"  title="over">' +
								'<div class="txt">结束观看</div>' +
								'</div>' +
								'<div class="item" id="playBtn_1" style="top:72px;" title="play">' +
								'<div class="txt">继续观看</div>' +
								'</div>' +
								'<div class="item" id="playBtn_2" style="top:144px;" title="next" programid="' + data[i + 1]['programID'] + '">' +
								'<div class="txt">下一集</div>' +
								'</div>';
							this.btnRow = 3;
							break;
						} else if(this.setTo > 1 && this.setTo < result.recordSize) {
							//当前大于第一集，且小于总更新集数时
							html += '<div class="item" id="playBtn_0" title="prev" programid="' + data[i - 1]['programID'] + '">' +
								'<div class="txt">上一集</div>' +
								'</div>' +
								'<div class="item" id="playBtn_1" style="top:72px;" title="over">' +
								'<div class="txt">结束观看</div>' +
								'</div>' +
								'<div class="item" id="playBtn_2" style="top:144px;" title="play">' +
								'<div class="txt">继续观看</div>' +
								'</div>' +
								'<div class="item" id="playBtn_3" style="top:216px;" title="next" programid="' + data[i + 1]['programID'] + '">' +
								'<div class="txt">下一集</div>' +
								'</div>';
							this.btnRow = 4;
							break;
						} else if(this.setTo > 1 && this.setTo == result.recordSize) {
							//播放到最后一集时
							html += '<div class="item" id="playBtn_0" title="prev" programid="' + data[i - 1]['programID'] + '">' +
								'<div class="txt">上一集</div>' +
								'</div>' +
								'<div class="item" id="playBtn_1" style="top:72px;" title="over">' +
								'<div class="txt">结束观看</div>' +
								'</div>' +
								'<div class="item" id="playBtn_2" style="top:144px;" title="play">' +
								'<div class="txt">继续观看</div>' +
								'</div>';
							this.btnRow = 3;
							break;
						} else if(this.setTo == 1 && this.setTo == result.recordSize) {
							//当前更新到第一集时
							html += '<div class="item" id="playBtn_0"  title="over">' +
								'<div class="txt">结束观看</div>' +
								'</div>' +
								'<div class="item" id="playBtn_1" style="top:72px;" title="play">' +
								'<div class="txt">继续观看</div>' +
								'</div>';
							this.btnRow = 2;
							break;
						}
					}
				}

				$('#playBtn').innerHTML = html;
				this.createIframeAddPlay();
				callBack && callBack();
				this.focusChange(this.btnRow);
				XEpg.My.pageLoadShowFocus();
			}.bind(this));
		}
	};
	/**
	 * 设置播放结束的按钮信息
	 */
	SetVideoPlay.prototype.setPlayEndButton = function() {
		if(mediaType == 'movie') {
			$('#playBtn').innerHTML = '<div class="item" id="playBtn_0"  title="over">' +
				'<div class="txt">确定</div>' +
				'</div>';
			$('#backPageUrl').innerHTML = '秒后返回详情页';
			this.autoGotoPage('Y');
			this.refrechFocus();
		} else {
			for(var i = 0; i < seriesCache.length; i++) {
				if(programID == seriesCache[i]['programID']) {
					this.currentSeries = i + 1;
					if(this.currentSeries == seriesCache.length && seriesCache.length > 1) { //如果当前是最后一集
						$('#playBtn').innerHTML = '<div class="item" id="playBtn_0" title="prev" programid="' + seriesCache[i - 1]['programID'] + '">' +
							'<div class="txt">上一集</div>' +
							'</div>' +
							'<div class="item" id="playBtn_1" style="top:72px;" title="over">' +
							'<div class="txt">结束观看</div>' +
							'</div>';
						$('#time').style.top = '315px';
						$('#backPageUrl').innerHTML = '秒后返回详情页';
						this.autoGotoPage('Y');
						this.refrechFocus();
						break;
					} else if(this.currentSeries == 1 && seriesCache.length > 1) { //如果当前是第一集
						$('#playBtn').innerHTML =
							'<div class="item" id="playBtn_0" title="over">' +
							'<div class="txt">结束观看</div>' +
							'</div>' +
							'<div class="item" id="playBtn_1" style="top:72px;" title="next" programid="' + seriesCache[i + 1]['programID'] + '">' +
							'<div class="txt">下一集</div>' +
							'</div>';
						$('#backPageUrl').innerHTML = '秒后跳转到下一集';
						$('#time').style.top = '315px';
						this.id = seriesCache[i + 1]['programID'];
						this.mediaName = seriesCache[i + 1]['name'];
						this.autoGotoPage('N');
						this.refrechFocus();
						break;
					} else if(this.currentSeries == 1 && seriesCache.length == 1) {
						$('#playBtn').innerHTML = '<div class="item" id="playBtn_0"  title="over">' +
							'<div class="txt">结束观看</div>' +
							'</div>';
						$('#backPageUrl').innerHTML = '秒后返回详情页';
						this.refrechFocus();
						this.autoGotoPage('Y');
						break;
					} else if(this.currentSeries > 1 && this.currentSeries < seriesCache.length) { //如果当前大于第一集小于最后一集
						$('#playBtn').innerHTML = '<div class="item" id="playBtn_0" title="prev" programid="' + seriesCache[i - 1]['programID'] + '">' +
							'<div class="txt">上一集</div>' +
							'</div>' +
							'<div class="item" id="playBtn_1" style="top:72px;" title="over">' +
							'<div class="txt">结束观看</div>' +
							'</div>' +
							'<div class="item" id="playBtn_2" style="top:144px;" title="next" programid="' + seriesCache[i + 1]['programID'] + '">' +
							'<div class="txt">下一集</div>' +
							'</div>';
						$('#time').style.top = '385px';
						$('#backPageUrl').innerHTML = '秒后跳转到下一集';
						this.id = seriesCache[i + 1]['programID'];
						this.mediaName = seriesCache[i + 1]['name'];
						this.autoGotoPage('N');
						this.refrechFocus();
						break;
					}
					break;
				}
			}
		}
		$('#time').style.display = 'block';
	};
	SetVideoPlay.prototype.refrechFocus = function() {
		XEpg.area('playBtn').clearObj();
		XEpg.My.currentAreaId = 'playBtn';
		XEpg.My.onFocusById('playBtn_0');
	};
	/**
	 * 自动跳转页面
	 */
	SetVideoPlay.prototype.autoGotoPage = function(isExit) {
		this.backTime--;
		$('#backTime').innerHTML = this.backTime;
		if(this.backTime > 0) {
			setTimeout(this.autoGotoPage.bind(this, isExit), 1000);
		} else {
			this.togglePage(isExit);
		}
	};
	/**
	 * 跳转地址
	 * @param isExit 是否退出到详情页 Y：是 N：不是
	 */
	SetVideoPlay.prototype.togglePage = function(isExit) {
		var isLook = decodeURIComponent(backUrl).indexOf('w-look') > -1 ? ('&contentCode=' + contentCode) : '';
		if(isExit == 'Y') {
			this.gotoUrl = decodeURIComponent(backUrl);
			var arg = '&endPlay=' + this.endPlayTime +
				'&mediaName=' + this.mediaName +
				'&mediaCode=' + programID +
				'&setTo=' + this.setTo +
				'&isMovie=' + mediaType + isLook;
			var url = encodeURIComponent(this.gotoUrl);
			XEpg.Util.gotoPage(decodeURIComponent(url));

		} else if(isExit == 'N') {
			this.gotoUrl = '../page/4kgarden_play.html?' +
				'programID=' + this.id +
				'&contentCode=' + contentCode +
				'&mediaName=' + encodeURIComponent(this.mediaName) +
				'&playTime=0' +
				'&isMovie=' + mediaType +
				'&categoryCode=' + categoryCode +
				'&actor=' + encodeURIComponent(actor) +
				'&poster='+encodeURIComponent(g_poster)+
				'&backUrl=' + encodeURIComponent(backUrl);
				
			XEpg.Util.gotoPage(this.gotoUrl);
		}

	};
	/**
	 * 显示快进退面板
	 */
	SetVideoPlay.prototype.showMediaInfo = function(callBack) {
		$('#mediaInfo').style.display = 'block';
		callBack && callBack();
	};
	/**
	 * 隐藏快进退面板
	 */
	SetVideoPlay.prototype.hideMediaInfos = function(callBack) {
		// $('#mediaInfo').style.display = 'none';
		if($('#order_box').style.display == 'block'){
			XEpg.My.currentAreaId = 'orderBox';
			XEpg.My.onFocusById('orderBox_0');
			if(self.look_at_over == false) {
				mp.resume();
			}
			self.state = 0;
			self.speed = 1;
			self.orderSetInterval();
			
		}else{
			hideMeidaInfosTimer = setTimeout(function() {
				$('#mediaInfo').style.display = 'none';
				$('#cs-info').style.height = "127px";
				$('#cs-info').style.top = "593px";
				XEpg.My.currentAreaId = 'playBtn';
				XEpg.My.onFocusById('playBtn_0');
				$('#inputTime').style.display = 'none';
				if($('#mediaInfo').style.display == 'none') {
					clearTimeout(hideMeidaInfosTimer);
					hideMeidaInfosTimer = null;
				}
			}, 3000);
		}
		
		callBack && callBack();
	};
	SetVideoPlay.prototype.inputTimePlay = function() {

		var time_hour, time_min, time_second;
		var time_hourArr = [];
		var time_minArr = [];
		var time_secondArr = [];
		var time = mp.getCurrentPlayTime();

		clearTimeout(hideMeidaInfosTimer);
		hideMeidaInfosTimer = null;
		$('#cs-info').style.height = "226px";
		$('#cs-info').style.top = "494px";
		XEpg.My.currentAreaId = 'btn_area';
		XEpg.My.onFocusById('btn_area_1');
		$('#inputTime').style.display = 'block';

		$('#time_area0_0').innerHTML = '';
		$('#time_area0_1').innerHTML = '';
		$('#time_area1_0').innerHTML = '';
		$('#time_area1_1').innerHTML = '';
		$('#time_area2_0').innerHTML = '';
		$('#time_area2_1').innerHTML = '';

		time_hour = Math.floor(time / 3600);
		time_min = Math.floor(time % 3600 / 60);
		time_second = time % 3600 % 60;
		if(time_hour > 0) {
			if(time_hour < 10) {
				time_hourArr[0] = 0;
				time_hourArr[1] = time_hour;
			} else if(time_hour >= 10) {
				time_hourArr = (time_hour + '').split('');
			}

		} else if(time_hour <= 0) {
			time_hourArr[0] = 0;
			time_hourArr[1] = 0;
		}

		if(time_min > 0) {
			if(time_min < 10) {
				time_minArr[0] = 0;
				time_minArr[1] = time_min;
			} else if(time_min >= 10) {
				time_minArr = (time_min + '').split('');
			}

		} else if(time_min <= 0) {
			time_minArr[0] = 0;
			time_minArr[1] = 0;
		}

		if(time_second > 0) {
			if(time_second < 10) {
				time_secondArr[0] = 0;
				time_secondArr[1] = time_second
			} else if(time_second >= 10) {
				time_secondArr = (time_second + '').split('');
			}

		} else if(time_second <= 0) {
			time_secondArr[0] = 0;
			time_secondArr[1] = 0;
		}
		for(var i = 0; i < time_hourArr.length; i++) {
			$('#time_area0_' + i).innerHTML = time_hourArr[i];
		}
		for(var j = 0; j < time_minArr.length; j++) {
			$('#time_area1_' + j).innerHTML = time_minArr[j];
		}
		for(var l = 0; l < time_secondArr.length; l++) {
			$('#time_area2_' + l).innerHTML = time_secondArr[l];
		}

	};
	SetVideoPlay.prototype.inputNum = function(num) {
		XEpg.$(XEpg.My.currentId).html(num);
	};

	/**
	 * 显示返回界面
	 */
	SetVideoPlay.prototype.showExitPanel = function(callBack) {
		$('#bgImage').style.display = 'block';
		$('#backPage').style.display = 'block';
		$('#mediaInfo').style.display = 'none';

		try {
			this.pause();
			this.endPlayTime = mp.getCurrentPlayTime();
		} catch(e) {}
		$('#videoName').innerHTML = this.mediaName;
		XEpg.My.currentAreaId = 'playBtn';
		XEpg.My.onFocusById('playBtn_0');
		callBack && callBack();
	};
	/**
	 * 隐藏返回界面，恢复播放
	 */
	SetVideoPlay.prototype.hideExitPanel = function(callBack) {
		$('#bgImage').style.display = 'none';
		$('#backPage').style.display = 'none';
		$('#mediaInfo').style.display = 'none';
		try {
			this.play();
		} catch(e) {}
		callBack && callBack();
	};
	/**
	 * 隐藏音量界面
	 */
	SetVideoPlay.prototype.hideVolume = function() {
		$('#volumeBox').style.display = 'none';
		if($('#volumeBox').style.display == 'none') {
			if(this.hideVolumeTimer != null) {
				clearTimeout(this.hideVolumeTimer);
			}
		}
	};
	SetVideoPlay.prototype.updateDate = function() {
		var time = new Date();
		var currentHours = time.getHours();
		var currentMinutes = time.getMinutes();
		currentHours = currentHours >= 10 ? currentHours : "0" + currentHours;
		currentMinutes = currentMinutes >= 10 ? currentMinutes : "0" + currentMinutes;

		var currentTime = currentHours + ":" + currentMinutes;
		$("#date").innerHTML = currentTime;

		this.updateDateTimer = setTimeout(this.updateDate.bind(this), 1000 * 60);
	};

	SetVideoPlay.prototype.PROD_STATE = function() {
		var self = this;
		if(state == 'Y') {
			$('#order_box').style.display = 'none';
		} else {
			$('#order_box').style.display = 'block';
			self.ORDER_MASK();
			self.orderSetInterval();
		}
	};
	SetVideoPlay.prototype.ORDER_MASK = function() {
		var self = this;
		var htmlDom = '';
		var row = 0;
		var isMovie = param.isMovie;
		var type = isMovie == 'series' ? '30天' : '48小时';
		self.ppvOrderMoney = ppvOrderMoney;
		if(orderType == '0') {
			htmlDom += '<div class="txt cs-txt01">' + '「4K花园」产品包：' +
				'<span>18</span>元/月（原价25元/月）</div>' +
				'<div style="position:absolute;left:251px;top:335px;width:786px;border-bottom:1px solid #504e4e;"></div>' +
				'<div class="txt cs-txt01" style="top:362px;">' + '「4K花园」产品包：' + '<span>48</span>元/季（折合16元/月）推荐</div>' +
				'<div style="position:absolute;left:251px;top:428px;width:786px;border-bottom:1px solid #504e4e;"></div>' +
				'<div class="cs-orderBtn">' +
				'<div class="item" id="order_0" title="3">' +
				'<div class="icon icon-a"></div>' +
				'<div class="txt">订购</div>' +
				'</div>' +
				'<div class="item" id="order_1" title="0" style="top:92px;">' +
				'<div class="icon icon-a"></div>' +
				'<div class="txt">订购</div>' +
				'</div>' +
				'</div>';
			row = 2;
		} else if(orderType == '2') {
			htmlDom += '<div class="txt cs-txt01" style="top:362px;">' + '单片：' +
				'<span>' + self.ppvOrderMoney + '</span>元/' + type + '</div>' +
				'<div style="position:absolute;left:251px;top:428px;width:786px;border-bottom:1px solid #504e4e;"></div>' +
				'<div class="cs-orderBtn">' +
				'<div class="item" id="order_0" title="2" style="top:92px;">' +
				'<div class="icon icon-a"></div>' +
				'<div class="txt">订购</div>' +
				'</div>' +
				'</div>';
			row = 1;
		} else if(orderType == '3') {
			htmlDom += '<div class="txt cs-txt01">包月：<span>15</span>元/月（原价29元/月）推荐</div>' +
				'<div style="position:absolute;left:251px;top:335px;width:786px;border-bottom:1px solid #504e4e;"></div>' +
				'<div class="txt cs-txt01" style="top:362px;">包季：<span>78</span>元/季</div>' +
				'<div style="position:absolute;left:251px;top:428px;width:786px;border-bottom:1px solid #504e4e;"></div>' +
				'<div class="txt cs-txt01" style="top:456px;">包年：<span>289</span>元/年</div>' +
				'<div style="position:absolute;left:251px;top:518px;width:786px;border-bottom:1px solid #504e4e;"></div>' +
				'<div class="cs-orderBtn">' +
				'<div class="item" id="order_0" title="3">' +
				'<div class="icon icon-a"></div>' +
				'<div class="txt">订购</div>' +
				'</div>' +
				'<div class="item" id="order_1" title="0" style="top:92px;">' +
				'<div class="icon icon-a"></div>' +
				'<div class="txt">订购</div>' +
				'</div>' +
				'<div class="item" id="order_2" title="3" style="top:184px;">' +
				'<div class="icon icon-a"></div>' +
				'<div class="txt">订购</div>' +
				'</div>' +
				'</div>';
			row = 3;

		} else if(orderType == '4') {
			htmlDom += '<div class="txt cs-txt01">单片：<span>' + self.ppvOrderMoney + '</span>元/' + type + '</div>' +
				'<div style="position:absolute;left:251px;top:335px;width:786px;border-bottom:1px solid #504e4e;"></div>' +
				'<div class="txt cs-txt01" style="top:362px;">包月：<span>15</span>元/月（原价29元/月）推荐</div>' +
				'<div style="position:absolute;left:251px;top:428px;width:786px;border-bottom:1px solid #504e4e;"></div>' +
				'<div class="txt cs-txt01" style="top:456px;">包季：<span>78</span>元/季</div>' +
				'<div style="position:absolute;left:251px;top:518px;width:786px;border-bottom:1px solid #504e4e;"></div>' +
				'<div class="txt cs-txt01" style="top:550px;">包年：<span>289</span>元/年</div>' +
				'<div style="position:absolute;left:251px;top:608px;width:786px;border-bottom:1px solid #504e4e;"></div>' +
				'<div class="cs-orderBtn">' +
				'<div class="item" id="order_0" title="2">' +
				'<div class="icon icon-a"></div>' +
				'<div class="txt">订购</div>' +
				'</div>' +
				'<div class="item" id="order_1" title="3" style="top:92px;">' +
				'<div class="icon icon-a"></div>' +
				'<div class="txt">订购</div>' +
				'</div>' +
				'<div class="item" id="order_2" title="0" style="top:184px;">' +
				'<div class="icon icon-a"></div>' +
				'<div class="txt">订购</div>' +
				'</div>' +
				'<div class="item" id="order_3" title="3" style="top:276px;">' +
				'<div class="icon icon-a"></div>' +
				'<div class="txt">订购</div>' +
				'</div>' +
				'</div>';
			row = 4;

		}
		$('#order').innerHTML = htmlDom;
		XEpg.area('order').setRow(row).setColumn(1).subClick({
			'func': function() {
				self.orderFunction();
			}
		}).subFocus({
			'func': function() {
				$('#' + XEpg.My.currentId).style.background = 'url(../image/cs-orderBtn-focus.png) no-repeat';
				$('#' + XEpg.My.currentId + ' .icon-a').style.background = 'url(../image/cs-iconBuy02.png) no-repeat';
				$('#' + XEpg.My.currentId + ' .txt').style.color = '#7f3616';
			}
		}).subBlur({
			'func': function() {
				$('#' + XEpg.My.currentId).style.background = 'url(../image/cs-orderBtn.png) no-repeat';
				$('#' + XEpg.My.currentId + ' .icon-a').style.background = 'url(../image/cs-iconBuy.png) no-repeat';
				$('#' + XEpg.My.currentId + ' .txt').style.color = '#dbdde1';
			}
		}).run();
	};

	SetVideoPlay.prototype.orderFunction = function() {
		var self = this;
		var title = document.getElementById(XEpg.My.currentId).title;
		var isMovie = param.isMovie;
		var args = location.href.substring(location.href.indexOf('?') + 1);
		if(args.indexOf('RST') > -1) {
			args = args.substring(args.indexOf('&') + 1);
		}
		XEpg.Util.setCookie('playArgs', args);
		var backUrl = window.location.href.indexOf("?") > -1 ? window.location.href.substring(0, window.location.href.indexOf("?")) : window.location.href;
		var ppvType = (isMovie == 'series' ? '02' : '01');
		if(title == "0" || title == "3") {
			orderUrl = SP.ORDER_URL;
			orderUrl = orderUrl + "SP_ORDER_ID=" + SP.getOrderId() + "&USER_ID=" + SP.UserID + "&SP_ID=" + SP.ID;
			orderUrl = orderUrl + "&SP_PWD=" + MD5(SP.PWD) + "&BUSI_ID=" + self.buCodeArray[0] + "&PROD_ID=" + (title == '0' ? self.authCodeArray[0] : self.prodCodeArray[0]);
			orderUrl = orderUrl + "&PROD_NUM=1" + "&PPV_TYPE=" + ppvType + "&BACK_URL=" + encodeURIComponent(backUrl);
			if(orderType=='3'){
				if(XEpg.My.currentId=='order_0'){
					addlog.sendLogOrder(29,15);
				}else if(XEpg.My.currentId=='order_1'){
					addlog.sendLogOrder(78,78);
				}else if(XEpg.My.currentId=='order_2'){
					addlog.sendLogOrder(289,289);
				}
			}else{
				if(XEpg.My.currentId=='order_1'){
					addlog.sendLogOrder(29,15);
				}else if(XEpg.My.currentId=='order_2'){
					addlog.sendLogOrder(78,78);
				}else if(XEpg.My.currentId=='order_3'){
					addlog.sendLogOrder(289,289);
				}
			}
			
			if(args.indexOf('RST') == -1) {
				XEpg.Util.gotoPage(orderUrl);
			}
			
		} else if(title == "2") {
			orderUrl = SP.ORDERPPV_URL;
			orderUrl = orderUrl + "SP_ORDER_ID=" + SP.getOrderId() + "&USER_ID=" + SP.UserID + "&SP_ID=" + SP.ID;
			orderUrl = orderUrl + "&SP_PWD=" + MD5(SP.PWD) + "&BUSI_ID=" + self.buCodeArray[0] + "&PROD_ID=" + ("4KHYPPV" + self.ppvOrderMoney);
			orderUrl = orderUrl + "&PPV_CODE=" + contentCode + "&PPV_NAME=" + encodeURIComponent(mediaName);
			orderUrl = orderUrl + "&PROD_NUM=1" + "&PPV_TYPE=" + ppvType + "&BACK_URL=" + encodeURIComponent(backUrl);
			addlog.sendLogOrder(ppvOrderMoney,ppvOrderMoney);
			if(args.indexOf('RST') == -1) {
				XEpg.Util.gotoPage(orderUrl);
			}
			
		}
	};

	/*************************播放功能区*********************************/

	/**
	 * 创建iframe标签添加播放
	 */
	SetVideoPlay.prototype.createIframeAddPlay = function() {
		var self = this;
		var last = epgdomain.lastIndexOf("/");
		var host = epgdomain.substr(0, last);
		var playUrl = this.iptv_flag == 'hw' ? epgdomain.split("/EPG")[0] +
			"/EPG/MediaService/SmallScreen.jsp?ContentID=" + this.id +
			"&Left=0&Top=0&Width=1280&Height=720&CycleFlag=0&ReturnURL=" + encodeURIComponent(location, href) :
			host + '/MediaService/SmallScreen?ContentID=' + this.id +
			'&Left=0&Top=0&Width=1280&Height=720&CycleFlag=0&GetCntFlag=0&Type=cp&ReturnURL=' + encodeURIComponent(location.href);

		var ifr = '<iframe id="videoPlay" name="videoPlay" ' +
			'style="width:1280px;height:720px;border:none;position: absolute;background: transparent; top: 0px;left: 0px; display: block;" ' +
			'width="100%" height="100%" frameborder="0" ' +
			'src="' + playUrl + '" allowtransparency="true">' +
			'</iframe>';

		$("#addPlay").innerHTML = ifr;
		if(mp == null) {
			this.getMpTimer = setTimeout(function() {
				self.getMpObject();
				self.initMediaPlay();
				self.initPlayDiv();
				// if (STBTYPE.indexOf('6108') > -1) {
				//    mp.playByTime(1, parseInt(playTimeNum), 1);
				// } else {
				//    self.playByTime(playTimeNum);
				// }
				if(mp != null) {
					clearTimeout(this.getMpTimer);
					this.getMpTimer = null;
				}

			}, 1000);
		} else {
			clearTimeout(this.getMpTimer)
			this.getMpTimer = null;
		}

	};
	/**
	 * 获取mp对象
	 */
	SetVideoPlay.prototype.getMpObject = function() {
		var self = this;
		var iframe = $("#videoPlay");
		var iframeContent = (iframe.contentWindow || iframe.contentDocument);
		if(iframe) {
			if(this.iptv_flag == "hw") {
				try {
					mp = iframeContent.mp; // 华为获取Mediaplayer 对象
				} catch(e) {}
			} else {
				try {
					mp = iframeContent.mymediaplayer; // 中兴获取Mediaplayer 对象sss
				} catch(e) {}

			}
			if(playTimeNum >= (mp.getMediaDuration() - 3)) {
				this.playByTime(0);
			} else {
				this.playByTime(playTimeNum);
			}
			if(state == 'N') {
				self.PROD_STATE();
			}

		}

	};

	/**
	 * 初始化mp对象的方法
	 * @returns mp
	 */
	SetVideoPlay.prototype.initMediaPlay = function() {
		try {
			mp.setMuteFlag(0); //是否静音
			mp.setCycleFlag(1); //0循环播放   1单次播放
			mp.setAllowTrickmodeFlag(0); //设置是否允许trick操作。 0:允许 1：不允许
			mp.setNativeUIFlag(0); //播放器是否显示缺省的Native UI，  0:不允许 1：允许
			mp.setAudioTrackUIFlag(0); //设置音轨的本地UI显示标志 0:不允许 1：允许
			mp.setMuteUIFlag(0); //设置静音的本地UI显示标志 0:不允许 1：允许
			mp.setAudioVolumeUIFlag(0); //设置音量调节本地UI的显示标志 0:不允许 1：允许
			mp.setAudioTrackUIFlag(0);
			mp.setProgressBarUIFlag(0);
			mp.setVideoDisplayMode(0); //设置为全屏
			mp.refreshVideoDisplay(); //调整视频显示，需要上面两函数配合
		} catch(e) {}

		return mp;
	};

	/**
	 * 初始化开始播放时间，总时间
	 */
	SetVideoPlay.prototype.initPlayDiv = function() {
		$('#playtime').innerHTML = this.getPlayTime();
		$('#endtime').innerHTML = this.getEndtime();
		$('#mediaName').innerHTML = this.mediaName;
	};
	/**
	 * 根据时长播放
	 */
	SetVideoPlay.prototype.playByTime = function(time) {
		if(parseInt(time) > 0) {
			mp.playByTime(1, parseInt(time), 1);
			mp.setVideoDisplayMode(1);
			mp.refreshVideoDisplay();
			this.initPlayDiv();
			this.getCurrentPlayTime(mp.getCurrentPlayTime(), mp.getMediaDuration());
		}
	};
	/**
	 * 设置当前播放时间
	 * @param currentPlayTime 当前播放事件
	 * @param endTime 总时长
	 */
	SetVideoPlay.prototype.getCurrentPlayTime = function(currentPlayTime, endTime) {
		this.WIDTH = parseInt(getComputedStyle($('#scroll')).width);
		var width = Math.ceil((this.WIDTH * currentPlayTime) / endTime);
		$('#mediaBar').style.width = (width + 7) + 'px';
		if(width > 1020) {
			width = 1020;
		}
		$('#mediaPoint').style.left = width + 'px';
	};
	/**
	 * 控制暂停或者播放
	 */
	SetVideoPlay.prototype.play = function(callback) {
		$('#playBigPic').src = '../image/cs-stop.png';
		$('#playSamllPic').src = '../image/cs-icon-stop.png';
		$('#bigPic').style.display = 'block';
		try {
			mp.resume();
		} catch(e) {}
		this.state = 0;
		this.speed = 1;
		this.initPlayDiv();
		this.getCurrentPlayTime(mp.getCurrentPlayTime(), mp.getMediaDuration());
		this.hideMediaInfos();
		$('#x-num').style.display = 'none';
		callback && callback()

	};
	SetVideoPlay.prototype.pause = function() {
		$('#playBigPic').src = '../image/cs-iconPlay.png';
		$('#playSamllPic').src = '../image/cs-icon-play02.png';
		$('#bigPic').style.display = 'block';
		try {
			mp.pause();
		} catch(e) {}
		this.state = 1;
		this.speed = 1;
		this.initPlayDiv();
		this.getCurrentPlayTime(mp.getCurrentPlayTime(), mp.getMediaDuration());
		if($('#backPage').style.display == 'none') {
			this.showMediaInfo();
			this.inputTimePlay();
		} else {
			XEpg.My.currentAreaId = 'playBtn';
			XEpg.My.onFocusById('playBtn_0');
		}
	};
	SetVideoPlay.prototype.addWardAndRewindImg = function(speed) {
		if(this.state == 2) {
			this.wardImg = '../image/icon-x' + speed + '.png';
			$('#x-num-img').src = this.wardImg;
		} else if(this.state == 3) {
			this.rewindImg = '../image/icon-x' + speed + '-a.png';
			$('#x-num-img').src = this.rewindImg;
		} else if(this.state == 1) {

		}

	};
	/**
	 * 快进功能
	 * @param speed 快进速度
	 */
	SetVideoPlay.prototype.fastForwardFun = function(speed) {
		if(hideMeidaInfosTimer != null) {
			clearTimeout(hideMeidaInfosTimer);
			hideMeidaInfosTimer = null;
		}
		this.showMediaInfo(); //显示快进退面板
		$('#bigPic').style.display = 'none';
		$('#playBigPic').src = '../image/cs-on.png';
		$('#playSamllPic').src = '../image/cs-icon-on.png';
		$('#x-num').style.display = 'block';
		mp.fastForward(speed);
		this.state = 2;
		this.addWardAndRewindImg(speed);
		this.goUtility();
	};
	/**
	 * 快退功能
	 * @param speed 快退速度
	 */
	SetVideoPlay.prototype.fastRewindFun = function(speed) {
		if(hideMeidaInfosTimer != null) {
			clearTimeout(hideMeidaInfosTimer);
			hideMeidaInfosTimer = null;
		}
		this.showMediaInfo(); //显示快进退面板
		$('#bigPic').style.display = 'none';
		$('#playBigPic').src = '../image/cs-rewind.png';
		$('#playSamllPic').src = '../image/cs-icon-rewind.png';
		$('#x-num').style.display = 'block';
		mp.fastRewind(-speed);
		this.state = 3;
		this.addWardAndRewindImg(speed);
	};

	/**
	 * 快进调用
	 */
	SetVideoPlay.prototype.fastForward = function() {
		if(this.state != 3) { //正常播放状态下，快进
			this.speed = this.speed < 64 ? this.speed * 2 : 2;
			this.updateCurrentPlayTime(); //更新时间
			this.fastForwardFun(this.speed); //开始快进
		} else if(this.state == 3) { //若是在快退时，恢复播放
			this.play(); //恢复播放
			this.hideMediaInfos(); //隐藏快进退面板
			this.updateCurrentPlayTime(); //更新时间
		}
	};

	/**
	 * 快退调用
	 */
	SetVideoPlay.prototype.fastRewind = function() {
		if(this.state != 2) { //正常播放状态下，快退
			this.speed = this.speed < 64 ? this.speed * 2 : 2;
			this.updateCurrentPlayTime(); //更新时间
			this.fastRewindFun(this.speed); //开始快退
		} else if(this.state == 2) {
			this.play(); //恢复播放
			this.hideMediaInfos(); //隐藏快进退面板
			this.updateCurrentPlayTime(); //更新时间
		}
	};
	/**
	 * 更新播放时间
	 */
	SetVideoPlay.prototype.updateCurrentPlayTime = function() {
		if(this.speed > 1) {
			this.listenrWardOrRewind = setInterval(function() {
				this.getCurrentPlayTime(mp.getCurrentPlayTime(), mp.getMediaDuration());
				this.initPlayDiv();
			}.bind(this), 1000);
		} else {
			clearInterval(this.listenrWardOrRewind);
			this.listenrWardOrRewind = null;
		}
	};
	/**
	 * 获取当前播放时间
	 * @returns 返回当前播放时间
	 */
	SetVideoPlay.prototype.getPlayTime = function() {
		if(this.byTime && this.byTime > mp.getCurrentPlayTime()) {
			return this.convertTime(this.byTime);
		} else {
			return this.convertTime(mp.getCurrentPlayTime());
		}

	};
	/**
	 * 获取总时长
	 * return 返回总时长
	 */
	SetVideoPlay.prototype.getEndtime = function() {
		return this.convertTime(mp.getMediaDuration());
	};
	/**
	 * 音量加减的公用设置
	 */
	SetVideoPlay.prototype.volumeCommFun = function(type) {
		if(this.hideVolumeTimer != null) clearTimeout(this.hideVolumeTimer);
		$('#volumeBox').style.display = 'block';
		this.nowVolume = mp.getVolume();
		type == 0 && (this.nowVolume = this.nowVolume < 100 ? this.nowVolume + this.addNum : 100);
		type == 1 && (this.nowVolume = this.nowVolume > 0 ? this.nowVolume - this.addNum : 0);

		mp.setVolume(this.nowVolume);

		this.HEIGHT = (this.nowVolume * 136) / this.MAXVOLUME;
		this.POINTTOP = this.POINTTOP > 164 ? 164 : (136 - this.HEIGHT + 36);
		$('#changeVolume').style.height = this.HEIGHT + 'px';
		$('#volumePoint').style.top = this.POINTTOP + 'px';
		this.hideVolumeTimer = setTimeout(this.hideVolume.bind(this), 2000);
	};
	/**
	 * 音量加
	 */
	SetVideoPlay.prototype.volumeUp = function() {
		this.volumeCommFun(0);
	};
	/**
	 * 音量减
	 */
	SetVideoPlay.prototype.volumeDown = function() {
		this.volumeCommFun(1);
	};
	/**
	 * 上下集切换
	 */
	SetVideoPlay.prototype.nextOrPrevMedia = function(type) {
		if(mediaType == 'series') {
			for(var i = 0; i < seriesCache.length; i++) {
				if(programID == seriesCache[i]['programID']) {
					if(type == 'next') {
						if(i + 1 < seriesCache.length) {
							this.id = seriesCache[i + 1]['programID'];
							this.mediaName = seriesCache[i + 1]['name'];
							break;
						}
					} else if(type == 'prev') {
						if(i + 1 > 1) {
							this.id = seriesCache[i - 1]['programID'];
							this.mediaName = seriesCache[i - 1]['name'];
							break;
						}
					}
				}
			}
			this.gotoUrl = window.location.href.indexOf('?') ? window.location.href.split('?')[0] : window.location.href;
			this.gotoUrl += '?programID=' + this.id +
				'&contentCode=' + contentCode +
				'&mediaName=' + encodeURIComponent(this.mediaName) +
				'&playTime=0' +
				'&isMovie=' + mediaType +
				'&categoryCode=' + categoryCode +
				'&actor=' + encodeURIComponent(actor) +
				'&poster='+encodeURIComponent(g_poster)+
				'&backUrl=' + encodeURIComponent(backUrl);
			this.destoryMP(function() {
				XEpg.Util.gotoPage(this.gotoUrl);
			}.bind(this));
		}
	};
	/**
	 * 是否静音
	 */
	SetVideoPlay.prototype.setMuteFlag = function() {
		this.muteFlag = mp.getMuteFlag();
		if(this.muteFlag == 1) {
			mp.setMuteFlag(0);
		} else {
			mp.setMuteFlag(1);

		}
	};
	/**
	 * 生成虚拟键获取状态执行方法
	 * @returns {number}
	 */
	SetVideoPlay.prototype.goUtility = function() {
		var self = this;
		eval("eventJson = " + Utility.getEvent());
		this.typeStr = eventJson.type;
		this.endPlayTime = mp.getCurrentPlayTime();
		switch(this.typeStr) {
			case "EVENT_MEDIA_ERROR":
				this.destoryMP(function() {
					this.gotoUrl = window.location.href + '&playTime=' + (this.byTime > this.endPlayTime ? this.byTime : this.endPlayTime);
					XEpg.Util.gotoPage(this.gotoUrl);
				}.bind(this));
			case "EVENT_MEDIA_END":
				self.addPlayVod(function() {
					self.showExitPanel(function() {
						self.destoryMP(function() {
							self.setPlayEndButton();
						}.bind(this));
					}.bind(this));
				})
				break;
			case "EVENT_MEDIA_BEGINING":
				break;
			default:
				return 1;
		}
		return 1;
	};
	/**
	 * 释放终端
	 * @param callBack
	 */
	SetVideoPlay.prototype.destoryMP = function(callBack) {
		try {
			mp.stop();
			mp.releaseMediaPlayer(mp.getNativePlayerInstanceID());
			var ifr = $('#videoPlay');
			ifr.parentNode.removeChild(ifr);
		} catch(e) {}
		callBack && callBack();
	};
	/**
	 * 格式化时间
	 * @param time
	 * @returns {string}
	 */
	SetVideoPlay.prototype.convertTime = function(time) {
		var time_second, time_min, time_hour;
		if(time == null) {
			time = mp.getMediaDuration();
		}

		time = parseInt(time, 10);
		time_hour = Math.floor(time / 3600);
		time_min = Math.floor(time % 3600 / 60);
		time_second = time % 3600 % 60;
		if(!isNaN(time_hour)) {
			time_hour = time_hour < 10 ? '0' + time_hour : time_hour;
		} else {
			time_hour = '00';
		}
		if(!isNaN(time_min)) {
			time_min = time_min < 10 ? '0' + time_min : time_min;
		} else {
			time_min = '00';
		}
		if(!isNaN(time_second)) {
			time_second = time_second < 10 ? '0' + time_second : time_second;
		} else {
			time_second = '00';
		}
		return time_hour + ':' + time_min + ':' + time_second;
	};

	SetVideoPlay.prototype.addPlayVod = function(callBack) {
		var type = mediaType == 'movie' ? 0 : 1;
		addlog.addVodTimeLog(contentCode,this.mediaName,type,this.id)
		var vodUrl = '../data/addPlayRecord.jsp?zoneCode=' + this.zoneCode +
			'&userID=' + SP.UserID +
			'&programCode=' + contentCode +
			'&programName=' + encodeURIComponent(this.mediaName) +
			'&seriesCode=' + this.id +
			'&seriesFlag=' + type +
			'&playTime=' + parseInt(this.endPlayTime) +
			'&totalPlayTime=' + parseInt(mp.getMediaDuration()) +
			'&poster=' + g_poster +
			'&setNo=' + parseInt(this.setTo);
		XEpg.Util.ajaxGet(vodUrl, function(data) {
			var data = XEpg.Util.parseJSON(data);
			callBack && callBack();
		}.bind(this))
	}
	var addlog={
		addVodTimeLog:function(codelog,namelog,logtype,seriesCode){
			if(SP.UserID){
	          var stb = "";
	          try {
	             if (typeof(Authentication) != "undefined") {
	                stb = Authentication.CTCGetConfig("STBType");
	             }
	          } catch (e) {
	          }
	          var epgPlatformType = SP.iptv_flag == 'hw' ? '0' :'1';
	          var seriesCodelog='';
	          var seriesNamelog='';
	          if(logtype=='1'){
	          	seriesCodelog=seriesCode;
	          	seriesNamelog =namelog;
	          }else{
	          	seriesCodelog=codelog;
	          	seriesNamelog =namelog;
	          }
	          var reportUrl = "../data/addVodTimeLog.jsp?" +
	             "userID=" + SP.UserID +
	             "&stb=" + stb +
	             "&cpID=" + 1007 +
	             "&resolution=1" +
	             "&contentCode=" + seriesCodelog + 
				 "&contentName=" + encodeURIComponent(namelog) + 
				 "&startTime=" + g_starttime + 
				 "&endTime=" + getTime() + 
				 "&seriesCode=" + codelog +
				 "&seriesName=" + encodeURIComponent(seriesNamelog) +
				 "&productCode=" + "4KHY" +
				 "&productName=" + encodeURIComponent("4K花园") + 
				 "&type=" + logtype + 
	             "&epgPlatformType=" + epgPlatformType;
	          XEpg.Util.ajaxGet(reportUrl);
	       }
		},
		//发送日志
	    sendLogOrder:function(origPrice,price){
	    	if(SP.UserID){
	          var stb = "";
	          try {
	             if (typeof(Authentication) != "undefined") {
	                stb = Authentication.CTCGetConfig("STBType");
	             }
	          } catch (e) {
	          }
	          
	          var epgPlatformType = SP.iptv_flag == 'hw' ? '0' :'1';
	          var reportUrl = "../data/addOrderLog.jsp?" +
	             "userID=" + SP.UserID +
	             "&stb=" + stb +
	             "&action=1" +
	             "&price=" + price + 
	             "&origPrice=" + origPrice + 
	             "&productCode=" + "4KHY" +
	             "&productName=" + encodeURIComponent("4K花园") +
	             "&cpID=1007"
	             "&resolution=1" +
	             "&epgPlatformType=" + epgPlatformType;
	          XEpg.Util.ajaxGet(reportUrl);
	       }
	    }
	};
	/**
	 * 焦点改变
	 * @param row 区域行
	 */
	SetVideoPlay.prototype.focusChange = function(row) {
		var self = this;
		XEpg.area('playBtn').setRow(row).setColumn(1)
			.right({
				'area': {
					'id': 'hotList'
				}
			})
			.subClick({
				'func': function() {
					var title = $('#' + XEpg.$(XEpg.My.currentId).id).title;
					if(title == 'over') {
						this.endPlayTime = mp.getCurrentPlayTime();
						this.addPlayVod(function() {
							this.destoryMP();
							this.togglePage('Y');
						}.bind(this));
					} else if(title == 'play') {
						this.hideExitPanel();
					} else if(title == 'prev') {
						self.addPlayVod(function() {
							self.nextOrPrevMedia('prev')
						});
						//this.nextOrPrevMedia('prev');
					} else if(title == 'next') {
						self.addPlayVod(function() {
							self.nextOrPrevMedia('next')
						});
						//this.nextOrPrevMedia('next');
					}
				}.bind(this)
			})
			.run();

		XEpg.area('hotList').setRow(1).setColumn(3)
			.left({
				'area': {
					'id': 'playBtn'
				}
			})
			.subClick({
				'func': function() {
					this.destoryMP(function() {
						var title = $('#' + XEpg.$(XEpg.My.currentId).id).title;
						XEpg.Util.gotoPage(title);
					}.bind(this))
				}.bind(this)
			})
			.subFocus([{
				'func': function() {

				}
			}, {
				'class': 'item item_focus'
			}])
			.run();

		XEpg.area('time_area0').setRow(1).setColumn(2)
			.left({
				'area': {
					'id': 'btn_area'
				}
			})
			.right({
				'area': {
					'id': 'time_area1'
				}
			})
			.subFocus([{
				'class': 'item item_focus'
			}, {
				'func': function() {
					this.inputNum();
				}.bind(this)
			}])
			.run();

		XEpg.area('time_area1').setRow(1).setColumn(2)
			.left({
				'func': function() {
					XEpg.My.currentAreaId = 'time_area0';
					XEpg.My.onFocusById('time_area0_1');
				}
			})
			.right({
				'area': {
					'id': 'time_area2'
				}
			})
			.subFocus([{
				'class': 'item item_focus'
			}, {
				'func': function() {
					this.inputNum();
				}.bind(this)
			}])
			.run();

		XEpg.area('time_area2').setRow(1).setColumn(2)
			.left({
				'func': function() {
					XEpg.My.currentAreaId = 'time_area1';
					XEpg.My.onFocusById('time_area1_1');
				}
			})
			.right({
				'area': {
					'id': 'btn_area'
				}
			})
			.subFocus([{
				'class': 'item item_focus'
			}, {
				'func': function() {
					this.inputNum();
				}.bind(this)
			}])
			.run();

		XEpg.area('btn_area').setRow(1).setColumn(2)
			.left({
				'func': function() {
					XEpg.My.currentAreaId = 'time_area2';
					XEpg.My.onFocusById('time_area2_1');
				}
			})
			.right({
				'area': {
					'id': 'time_area0'
				}
			})
			.subClick({
				'func': function() {
					var index = XEpg.My.getIdIndex(XEpg.My.currentId);
					if(index == 0) {
						var hour1 = $('#time_area0_0').innerHTML;
						var hour2 = $('#time_area0_1').innerHTML;
						var min1 = $('#time_area1_0').innerHTML;
						var min2 = $('#time_area1_1').innerHTML;
						var second1 = $('#time_area2_0').innerHTML;
						var second2 = $('#time_area2_1').innerHTML;
						hour1 = (hour1 == "" ? '0' : hour1);
						hour2 = (hour2 == "" ? '0' : hour2);
						min1 = (min1 == "" ? '0' : min1);
						min2 = (min2 == "" ? '0' : min2);
						second1 = (second1 == "" ? '0' : second1);
						second2 = (second2 == "" ? '0' : second2);
						var playTime = parseInt(hour1 + hour2) * 3600 + parseInt(min1 + min2) * 60 + parseInt(second1 + second2);
						if(playTime > mp.getMediaDuration()) {
							playTime = mp.getMediaDuration() - 30;
						}
						this.playByTime(playTime);
						setTimeout(function() {
							this.initPlayDiv();
							this.getCurrentPlayTime(mp.getCurrentPlayTime(), mp.getMediaDuration());
						}.bind(this), 1000)
						this.play();

					} else if(index == 1) {
						this.play();
					}
				}.bind(this)
			})
			.run();

		XEpg.area('orderBox').setRow(1).setColumn(1)
			.subClick({
				'func': function() {
					$('#order').style.display = 'block';
					mp.pause();
					self.state = 1;
					self.speed = 1;
					clearInterval(orderTime);
					orderTime = null;
					XEpg.My.currentAreaId = 'order';
					XEpg.My.onFocusById('order_0');
					$('#order_0').style.background = 'url(../image/cs-orderBtn-focus.png) no-repeat';
					$('#order_0 .icon-a').style.background = 'url(../image/cs-iconBuy02.png) no-repeat';
					$('#order_0 .txt').style.color = '#7f3616';
				}
			})
			.run();
	};
	SetVideoPlay.prototype.orderSetInterval = function() {
		var self = this;
		orderTime = setInterval(function() {
			try {
				playTimes = mp.getCurrentPlayTime();
			} catch(e) {

			}

			if(playTimes >= 360&&$('#backPage').style.display=='none') {
				$('#order').style.display = 'block';
				XEpg.My.currentAreaId = 'order';
				XEpg.My.onFocusById('order_0');
				$('#order_0').style.background = 'url(../image/cs-orderBtn-focus.png) no-repeat';
				$('#order_0 .icon-a').style.background = 'url(../image/cs-iconBuy02.png) no-repeat';
				$('#order_0 .txt').style.color = '#7f3616';
				mp.pause();
				self.state = 1;
				self.speed = 1;
				clearInterval(orderTime);
				orderTime = null;
				self.look_at_over = true;
			}
		}, 10000);
	};

	SetVideoPlay.prototype.keypress = function(event) {
		var self = this;
		var display = $('#backPage').style.display;
		var orderDis = $('#order').style.display;
		var orderBox = $('#order_box').style.display;
		var val = event.which ? event.which : event.keyCode;
		event.returnValue = false; //阻止默认返回到上一页
		if(mp != null) {
			clearTimeout(this.getMpTimer);
			this.getMpTimer = null;
			switch(val) {
				case 8:
					if(orderDis == 'block') {
						$('#order').style.display = 'none';
						XEpg.My.currentAreaId = 'orderBox';
						XEpg.My.onFocusById('orderBox_0');
						if(self.look_at_over == false) {
							mp.resume();
						}
						self.state = 0;
						self.speed = 1;
						self.orderSetInterval();
					} else {
						if(display == 'none') {
							this.showExitPanel();
						}
					}
					break;
				case 259:
					if(display == 'none') this.volumeUp();
					break; //音量加
				case 260:
					if(display == 'none') this.volumeDown();
					break; //音量减
				case 261:
					this.setMuteFlag();
					break; //静音
				case 33:
					if(display == 'none') {
						self.addPlayVod(function() {
							self.nextOrPrevMedia('prev')
						});
					}
					break; //上一集
				case 34:
					if(display == 'none') {
						self.addPlayVod(function() {
							self.nextOrPrevMedia('next');
						});
					}
					break; //下一集
				case 37:
					if(display == 'block') {
						XEpg.Nav.key_left_opt();
					} else {
						if(orderDis == 'block') {
							XEpg.Nav.key_left_opt();
						} else {
							if(state == 'Y') {
								if($('#inputTime').style.display != 'block') {
									this.fastRewind();
								} else {
									XEpg.Nav.key_left_opt();
								}
							}

						}
					}
					break;
				case 38:
					if(display == 'block' || orderDis == 'block') XEpg.Nav.key_up_opt();
					break;
				case 39:
					if(display == 'block') {
						XEpg.Nav.key_right_opt();
					} else {
						if(orderDis == 'block') {
							XEpg.Nav.key_right_opt();
						} else {
							if(state == 'Y') {
								if($('#inputTime').style.display != 'block') {
									this.fastForward();
								} else {
									XEpg.Nav.key_right_opt();
								}
							}
						}
					}
					break;
				case 40:
					if(display == 'block' || orderDis == 'block') XEpg.Nav.key_down_opt();
					break;
				case 272:
					self.addPlayVod(function() {
						self.destoryMP();
					});
					break;
				case 264:
					if(state == 'Y') {
						if(display == 'none') this.fastForward();
					}
					break;
				case 265:
					if(state == 'Y') {
						if(display == 'none') this.fastRewind();
					}
					break;
				case 263:
				case 13:
					if(display == 'block') {
						XEpg.Nav.key_ok_event();
					} else {
						if(state == 'N') {
							XEpg.Nav.key_ok_event();
						} else {
							if($('#inputTime').style.display != 'block') {
								if(this.state != 0) {
									this.play();
								} else {
									this.pause();
								}
							} else {
								XEpg.Nav.key_ok_event();
							}
						}
					}
					break;
				case 48:
				case 49:
				case 50:
				case 51:
				case 52:
				case 53:
				case 54:
				case 56:
				case 57:
					this.inputNum(val - 48);
				case 768:
					this.goUtility();
					break;
				default:
					break;
			}
			return 0;
		} else {
			this.getMpObject();
		}
	};
	var g_price=0;
	var g_authResult=1;
	var authAll = {
		proAuthDD : function(){
			if(g_price > 15){
				g_price=Math.ceil(g_price/10);
				authAll.proAuthBJ();
			}else{
				authAll.proAuthBJ();
			}
		},
		proAuthBNY : function(){
			var m_proID = '4KHY';
			XEpg.Util.ajaxGet('../data/prodCheck.jsp?USER_ID='+SP.UserID+'&SP_ID=HQHY&SP_PWD=12345678&BUSI_ID=YKYSBY&PROD_ID=' + m_proID ,function(data){
				eval('var result1=' + data);
	            var PROD_STATE_PPV = result1.PROD_STATE;
	            if (PROD_STATE_PPV == 'Y') {
	            	g_authResult = 0;
	                state='Y';
					var initLoad = new SetVideoPlay();
					initLoad._initBackContentList();
	            } else if (PROD_STATE_PPV == 'N') {
	                g_authResult = 1;
	               authAll.proAuthDDonce();
	            }
			});
		},
		proAuthBJ : function(){
			var m_proID = '4KHYBJ';
			XEpg.Util.ajaxGet('../data/prodCheck.jsp?USER_ID='+SP.UserID+'&SP_ID=HQHY&SP_PWD=12345678&BUSI_ID=YKYSBY&PROD_ID=' + m_proID ,function(data){
				eval('var result1=' + data);
	            var PROD_STATE_PPV = result1.PROD_STATE;
	            if (PROD_STATE_PPV == 'Y') {
	            	g_authResult = 0;
	                state='Y';
					var initLoad = new SetVideoPlay();
					initLoad._initBackContentList();
	            } else if (PROD_STATE_PPV == 'N') {
	            	g_authResult = 1;
	                authAll.proAuthBNY();
	            }
	            
			});
		},
		proAuthDDonce : function(){
			var m_proID = '4KHYPPV3';
			if(g_price == 3){
				m_proID = '4KHYPPV3';
			}else if(g_price == 5){
				m_proID = '4KHYPPV5';
			}else{
				m_proID = '4KHYPPV8';
			}
			XEpg.Util.ajaxGet('../data/PPVprodCheck.jsp?USER_ID='+SP.UserID+'&SP_ID=HQHY&SP_PWD=12345678&BUSI_ID=YKYSBY&PROD_ID=' + m_proID+'&PPV_CODE='+contentCode ,function(data){
				eval('var result1=' + data);
	            var PROD_STATE_PPV = result1.PROD_STATE;
	            if (PROD_STATE_PPV == 'Y') {
	            	g_authResult = 0;
	                state='Y';
	            } else if (PROD_STATE_PPV == 'N') {
	                g_authResult = 1;
	                state='N';
	                if(playTimeNum>360){
	                	playTimeNum=0;
	                }
	            }
	            var initLoad = new SetVideoPlay();
				initLoad._initBackContentList();
			});
		}
		
	};
	 function getTime() {
        var date1 = new Date();
        var year = date1.getFullYear();
        var month = date1.getMonth() + 1;
        month = month >= 10 ? month : "0" + month;
        var currentDate = date1.getDate();
        currentDate = currentDate >= 10 ? currentDate : "0" + currentDate;
        var hours = date1.getHours();
        hours = hours >= 10 ? hours : "0" + hours;
        var minutes = date1.getMinutes();
        minutes = minutes >= 10 ? minutes : "0" + minutes;
        var seconds = date1.getSeconds();
        seconds = seconds >= 10 ? seconds : "0" + seconds;
        var beginOrEndTime = "" + year + month + currentDate + hours + minutes + seconds;
        return beginOrEndTime;
    }
	var g_starttime=getTime();
	window.addEventListener('load', function() {
		g_price=ppvOrderMoney;
		if(orderType=='4'){
			g_price=g_price*10;
		}
		if(state=='N'){
			authAll.proAuthDD();

		}else{
			var initLoad = new SetVideoPlay();
			initLoad._initBackContentList();
		}
		
	}, false);
})();