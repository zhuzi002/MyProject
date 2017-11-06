
var listPage = {
	//渲染内容父ID,总页数,当前页需要显示的个数，当前页的真实数据,当前页码,请求最后一页数据的函数:请求上一页数据
	listUp : function(fId,totalP,currPLen,realPLen,pageIndex,menuSelect,getUpPage){
		//fId,totalP,currPLen,realPLen,pageIndex,getUpPage,
		var currId = XEpg.My.currentId;
		//当前下标
		var index = parseInt(currId.substring(currId.indexOf('_') + 1) , 10);
		var halfRealLen = currPLen / 2;			//获取一行数量
		//向上
		if( totalP == 1 ){						//如果只有一页数据
			if( realPLen <= halfRealLen ){		//一页的数据只有一行的情况
				if(index == 0){
					XEpg.My.currentId = menuSelect;
				}else{
					XEpg.My.currentId = fId + (index - 1);
				}
			} else {									//有两行的情况
				if( index < halfRealLen ){				//当前currentId如果是第一行
					if( $(fId + (index + halfRealLen) ) ){		//如果有DOM元素
						XEpg.My.currentId = fId + (index + halfRealLen);
					} else {
						XEpg.My.currentId = fId + (realPLen - 1);	//到最后一个
					}
				} else {						//当前currentId 大于6
					XEpg.My.currentId = fId + (index - halfRealLen);
				}
			}
			$(currId).className = 'item';
			$(XEpg.My.currentId).className = 'item item_focus';
		} else {		//多页
			if( index < halfRealLen ){		//当前currentId如果是第二行
				//分页
				getUpPage && getUpPage();
			} else {						//当前currentId如果是第二行
				XEpg.My.currentId = fId + (index - halfRealLen);
				$(currId).className = 'item';
				$(XEpg.My.currentId).className = 'item item_focus';
			}
		}
		//文字滚动
		XEpg.$(currId).effectHandle(XEpg.My.currentId);
	},
	
	listDown:function(fId,totalP,currPLen,realPLen,pageIndex,getDownPage){
			
		var currId = XEpg.My.currentId;
		var index = parseInt(currId.substring(currId.indexOf('_') + 1) , 10);
		var halfRealLen = currPLen / 2;			//获取一行数量
		//只有一页数据
		if( totalP == 1 ){					
			if( realPLen <= halfRealLen ){			//只有一行的情况
				XEpg.My.currentId = fId + (index + 1);
				if(!$(XEpg.My.currentId)){
					XEpg.My.currentId = fId + 0;
				}
			} else {				//两行
				if( index < halfRealLen ){	//第一行
					if( $(fId + (index + halfRealLen) ) ){		//如果有DOM元素
						XEpg.My.currentId = fId + (index + halfRealLen);
					} else {
						XEpg.My.currentId = fId + (realPLen - 1);
					}
				} else {			//当前currentId在第二行
					XEpg.My.currentId = fId + (index - halfRealLen);
				}
			}
			$(currId).className = 'item';
			$(XEpg.My.currentId).className = 'item item_focus';
			
		} else {	//多页数据
			
			if( index >= halfRealLen || realPLen <= halfRealLen ){	//当前currentId如果是第二行
				//分页
				getDownPage && getDownPage();
			} else {						//当前currentId如果是第二行
				
				if( $(fId + (index + halfRealLen) ) ){		//如果有DOM元素
						XEpg.My.currentId = fId + (index + halfRealLen);
				} else {
					XEpg.My.currentId = fId + (realPLen - 1);
				}
				$(currId).className = 'item';
				$(XEpg.My.currentId).className = 'item item_focus';
			}
			
		}
		//文字滚动
		XEpg.$(currId).effectHandle(XEpg.My.currentId);
	},
	
	listRight:function(fId,totalP,currPLen,realPLen,pageIndex,getRightPage){
		var currId = XEpg.My.currentId;
		var index = parseInt(currId.substring(currId.indexOf('_') + 1) , 10);
		var halfRealLen = currPLen / 2;			//获取一行数量
		if(totalP == 1){  //总页数为1
			if(index == (realPLen - 1)){  //当前页最后一个
				XEpg.My.currentId = fId + 0;
			}else{
				XEpg.My.currentId = fId + (index + 1);
			}
			$(currId).className = 'item';
			$(XEpg.My.currentId).className = 'item item_focus';
		}else{
			if(index == (realPLen - 1)){
				getRightPage && getRightPage();
			}else{
				XEpg.My.currentId = fId + (index + 1);
				$(currId).className = 'item';
				$(XEpg.My.currentId).className = 'item item_focus';
			}
		}
		//文字滚动
		XEpg.$(currId).effectHandle(XEpg.My.currentId);
	},
	
	listLeft:function(fId,currPLen,menuSelect){
		var currId = XEpg.My.currentId;
		var index = parseInt(currId.substring(currId.indexOf('_') + 1) , 10);
		var halfRealLen = currPLen / 2;			//获取一行数量

		if(index == 0 || index == halfRealLen){
			XEpg.My.currentId = menuSelect
		}else{
			XEpg.My.currentId = fId + (index - 1);
		}
		$(currId).className = 'item';
		$(XEpg.My.currentId).className = 'item item_focus';
		//文字滚动
		XEpg.$(currId).effectHandle(XEpg.My.currentId);
	}
};