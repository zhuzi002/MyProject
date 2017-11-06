 /**
 * @fileOverview 区域封装类
 * @author suzy
 * @version 2.0
 */

/**
 * @description 区域类数组，放外面，兼容有些盒子不兼容，取不到内部变量
 * @public
 * @type object
 */
var AreaArrayObj={};
;(function(window){
	
	/**
	 * @class EleClass
	 * @constructor
	 * @param {string} id 区域ID
	 * @author suzy
	 * @description 区域类,支持链式写法，如：XEpg.area("nav1").setColumn(5).setRow(1);
	 * @example new AreaClass("testDiv");
	 * @since version 2.0
	 */	
	function AreaClass(id){
		this.areaId=id;
		this.column=1;
		this.row=1;
		this.startIndex=0;
		
		//事件变量
		this.upEventObj=null; //[{"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},{"id":""},{"func":""}]
		this.downEventObj=null;
		this.leftEventObj=null;
		this.rightEventObj=null;
		
		this.subClickEventObj=null; //子元素点击
		this.subFocusEventObj=[{"class":"item item_focus"}]; //子元素显示焦点
		this.subBlurEventObj=[{"class":"item"}]; //子元素失去焦点
		this.subScrollTextEventObj=null; //子元素文字滚动
		this.subUpEventObj=null; //[{"id":""},{"func":test}]
		this.subDownEventObj=null;
		this.subLeftEventObj=null;
		this.subRightEventObj=null;
		
		this.upTarget=null; //[{"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},{"id":""},{"func":""}]
		this.downTarget=null; //[{"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},{"id":""},{"func":""}]
	  this.leftTarget=null; //[{"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},{"id":""},{"func":""}]
		this.rightTarget=null; //[{"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},{"id":""},{"func":""}]
		
		this.selectId=null; //已选择ID
		
		/**
		 * @function setSelectId
		 * @param {string} selectId 选中ID
		 * @return {object} AreaClass对象
		 * @description 预设选中ID
		 * @example XEpg.area("nav1").setSelectId("nav1_1");
		 */
		this.setSelectId = function(selectId){
			this.selectId=selectId;
			return this;
		};
		
		/**
		 * @function setColumn
		 * @param {number} column 设置列
		 * @return {object} AreaClass对象
		 * @description 设置显示区域一行多少列
		 * @example XEpg.area("nav1").setColumn(5);
		 */
		this.setColumn = function(column){
			this.column = parseInt(column,10);
			return this;
		};
		
		/**
		 * @function setRow
		 * @param {number} row 设置行
		 * @return {object} AreaClass对象
		 * @description 设置显示区域多少行
		 * @example XEpg.area("nav1").setRow(3);
		 */
		this.setRow = function(row){
			this.row=parseInt(row,10);
			return this;
		};
		
		
		/**
		 * @function setStartIndex
		 * @param {number} startIndex 设置起始下标
		 * @return {object} AreaClass对象
		 * @description 设置起始下标
		 * @example XEpg.area("nav1").setStartIndex(3);
		 */
		this.setStartIndex = function(startIndex){
			this.startIndex = startIndex;
			return this;
		};
		
				
		/**
		 * @function up
		 * @param {object} 对象 如:{"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},多个传数组[{"id":"nav4_0"},{"func":testFunc}]
		 * @return {object} AreaClass对象
		 * @description 区域边界上键执行操作绑定，可以去区域，某元素，执行方法，按先后顺序执行
		 * @example XEpg.area("nav1").up({"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}}); //区域跳转,id为区域ID，indexs 为当前区域顶部下标，对应目标区域的底部下标，isMemory为true为记忆，默认为不记忆
		 * @example XEpg.area("nav1").up({"id":"nav4_0"}); //ID跳转，区域跳某元素ID
		 * @example XEpg.area("nav1").up([{"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},{"func":testFunc}]); //先执行区域后执行方法，数组参数，多个推荐使用
		 * @example XEpg.area("nav1").up({"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},{"func":testFunc}); //先执行方法后元素导航,多参数
		 */
		this.up=function(){
		  this.upEventObj=XEpg.Util.argumentsToArray(arguments);
			return this;
		};
		
		/**
		 * @function down
		 * @param {object} 对象 如:{"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},多个传数组[{"id":"nav4_0"},{"func":testFunc}]
		 * @return {object} AreaClass对象
		 * @description 区域边界下键执行操作绑定，可以去区域，某元素，执行方法，按先后顺序执行
		 * @example XEpg.area("nav1").down({"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}}); //区域跳转,id为区域ID，indexs 为当前区域底部下标，对应目标区域的顶部下标，isMemory为true为记忆，默认为不记忆
		 * @example XEpg.area("nav1").down({"id":"nav4_0"}); //ID跳转，区域跳某元素ID
		 * @example XEpg.area("nav1").down([{"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},{"func":testFunc}]); //先执行区域后执行方法，数组参数，多个推荐使用
		 * @example XEpg.area("nav1").down({"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},{"func":testFunc}); //先执行方法后元素导航,多参数
		 */
		this.down=function(){
		  this.downEventObj=XEpg.Util.argumentsToArray(arguments);
			return this;
		};
		
		/**
		 * @function left
		 * @param {object} 对象 如:{"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},多个传数组[{"id":"nav4_0"},{"func":testFunc}]
		 * @return {object} AreaClass对象
		 * @description 区域边界左键执行操作绑定，可以去区域，某元素，执行方法，按先后顺序执行
		 * @example XEpg.area("nav1").left({"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}}); //区域跳转,id为区域ID，indexs 为当前区域左部下标，对应目标区域的右部下标，isMemory为true为记忆，默认为不记忆
		 * @example XEpg.area("nav1").left({"id":"nav4_0"}); //ID跳转，区域跳某元素ID
		 * @example XEpg.area("nav1").left([{"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},{"func":testFunc}]); //先执行区域后执行方法，数组参数，多个推荐使用
		 * @example XEpg.area("nav1").left({"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},{"func":testFunc}); //先执行方法后元素导航,多参数
		 */
		this.left=function(){
		  this.leftEventObj=XEpg.Util.argumentsToArray(arguments);
			return this;
		};
		
		/**
		 * @function right
		 * @param {object} 对象 如:{"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},多个传数组[{"id":"nav4_0"},{"func":testFunc}]
		 * @return {object} AreaClass对象
		 * @description 区域边界右键执行操作绑定，可以去区域，某元素，执行方法，按先后顺序执行
		 * @example XEpg.area("nav1").right({"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}}); //区域跳转,id为区域ID，indexs 为当前区域右部下标，对应目标区域的左部下标，isMemory为true为记忆，默认为不记忆
		 * @example XEpg.area("nav1").right({"id":"nav4_0"}); //ID跳转，区域跳某元素ID
		 * @example XEpg.area("nav1").right([{"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},{"func":testFunc}]); //先执行区域后执行方法，数组参数，多个推荐使用
		 * @example XEpg.area("nav1").right({"area":{"id":"nav2","indexs":[0,0,0,1,1],"isMemory":true}},{"func":testFunc}); //先执行方法后元素导航,多参数
		 */
		this.right=function(){
		  this.rightEventObj=XEpg.Util.argumentsToArray(arguments);
			return this;
		};
		
		/**
		 * @function subClick
		 * @param {object} 对象 如:{"func":testFunc}多个用逗号隔开如：{"func":testFunc},{"url":"test.htm"},{"titleUrl":""},多个传数组[{"func":testFunc},{"url":"test.htm"},{"titleUrl":""}]
		 * @return {object} AreaClass对象
		 * @description 子元素点击执行操作绑定，可以在按点击触发一个方法，则设置func;也可以跳转url，则设置url,如果要使用title里的url进行跳转，则设置"titleUrl":"";如果是既要触发方法也要执行url跳转，则2个都设置，放前面的先执行
		 * @example XEpg.area("nav1").subClick({"url":"test.htm"});  //点击页面跳转
		 * @example XEpg.area("nav1").subClick({"titleUrl":""});  //点击根据元素title里值页面跳转
		 * @example XEpg.area("nav1").subClick([{"func":testFunc},{"url":"test.htm"}]);  //先执行方法后页面跳转，数组参数，多个推荐使用
		 * @example XEpg.area("nav1").subClick({"func":testFunc},{"url":"test.htm"});  //先执行方法后页面跳转，多参数
		 * @example XEpg.area("nav1").subClick({"func":testFunc,"url":"test.htm"});  //先执行方法后页面跳转，对象参数，不推荐使用，低级盒端不兼容先后执行顺序
		 */
		this.subClick=function(){
		  this.subClickEventObj=XEpg.Util.argumentsToArray(arguments);
			return this;
		};
		
		/**
		 * @function subFocus
		 * @param {object}  对象 如:{"class":"item_select"},多个用逗号隔开如：{"func":testFunc},{"class":"item_focus"},{"style":"left:70px"},多个传数组[{"func":testFunc},{"class":"item_focus"},{"style":"left:70px"}]
		 * @return {object} AreaClass对象
		 * @description 元素焦点显示绑定，可以在焦点显示时触发一个方法，则设置func;也可以改变className，则设置class;也可以改变style,则设置style；如果是既要触发方法也要改变calss，则2个都设置，放前面的先执行
		 * @example XEpg.area("nav1").subFocus({"class":"item item_focus"}); //元素焦点展示，改变class
		 * @example XEpg.area("nav1").subFocus({"style":"left:70px"});  //元素焦点展示，改变style
		 * @example XEpg.area("nav1").subFocus([{"func":testFunc},{"class":"item item_focus"}]);  //先执行方法后改变class，数组参数，多个推荐使用
		 * @example XEpg.area("nav1").subFocus({"func":testFunc},{"class":"item item_focus"});  //先执行方法后改变class，多参数
		 * @example XEpg.area("nav1").subFocus({"func":testFunc,"class":"item item_focus"});    //先执行方法后改变class，对象参数，不推荐使用，低级盒端不兼容先后执行顺序 
		 */
		this.subFocus=function(setObj){
		  this.subFocusEventObj=XEpg.Util.argumentsToArray(arguments);
			return this;
		};
		
		/**
		 * @function subBlur
		 * @param {object}  对象 如:{"class":"item_select"},多个用逗号隔开如：{"func":testFunc},{"class":"item"},{"style":"left:70px"},多个传数组[{"func":testFunc},{"class":"item_select"},{"style":"left:70px"}]
		 * @return {object} AreaClass对象
		 * @description 元素失去焦点显示绑定，可以在失去焦点时触发一个方法，则设置func;也可以改变className，则设置class;也可以改变style,则设置style；如果是既要触发方法也要改变calss，则2个都设置，放前面的先执行
		 * @example XEpg.area("nav1").subBlur({"class":"item"}); //元素焦点展示，改变class
		 * @example XEpg.area("nav1").subBlur({"style":"left:70px"});  //元素焦点展示，改变style
		 * @example XEpg.area("nav1").subBlur([{"func":testFunc},{"class":"item"}]);  //先执行方法后改变class，数组参数，多个推荐使用
		 * @example XEpg.area("nav1").subBlur({"func":testFunc},{"class":"item"});  //先执行方法后改变class，多参数
		 * @example XEpg.area("nav1").subBlur({"func":testFunc,"class":"item"});    //先执行方法后改变class，对象参数，不推荐使用，低级盒端不兼容先后执行顺序 
		 */
		this.subBlur=function(setObj){
		  this.subBlurEventObj=XEpg.Util.argumentsToArray(arguments);
			return this;
		};
		
		/**
		 * @function subScrollText
		 * @param {object} setObj 对象 如:{"enTextLen":28,"enSingleWidth":12}
		 * @return {object} AreaClass对象
		 * @description 设置文字滚动,按英文字符算，一个中文算2个英文字符,enTextLen显示区域所能显示的英文字符总长度，超过则隐藏，enSingleWidth文字大小fontSize/2,moveSpacing移动间隔，不传默认为2，越大动的幅度越大;timeSpacing时间间隔，不填默认为150ms，越短速度越快
		 * @example XEpg.area("nav1").subScrollText({"enTextLen":28,"enSingleWidth":12});  //简单文字滚动赋值
		 * @example XEpg.area("nav1").subScrollText({"enTextLen":28,"enSingleWidth":12,"moveSpacing":2,"timeSpacing":150});   //文字滚动赋值,自己控制速度与间隔
		 */
		this.subScrollText=function(setObj){
		  this.subScrollTextEventObj=setObj;
			return this;
		};
		
		/**
		 * @function subUp
		 * @param {object} 对象 如:{"func":testFunc}多个用逗号隔开如：{"id":""},{"func":testFunc},多个传数组[{"id":""},{"func":testFunc}]
		 * @return {object} AreaClass对象
		 * @description 区域内部元素上键执行操作绑定，可以在按上键触发一个方法，则设置func;由于内部导航会自动计算，id里面的值不用赋，默认如果没传id对象，是会在执行完内部导航后，执行方法，设置func在ID对象在前面，则是执行完方法，后执行导航
		 * @example XEpg.area("nav1").subUp({"func":testFunc}); //执行完导航后执行方法
		 * @example XEpg.area("nav1").subUp([{"func":testFunc},{"id":""}]); //先执行方法后元素导航，数组参数，多个推荐使用
		 * @example XEpg.area("nav1").subUp({"func":testFunc},{"id":""}); //先执行方法后元素导航,多参数
		 */
		this.subUp=function(){
		  this.subUpEventObj=XEpg.Util.argumentsToArray(arguments);
			return this;
		};
		
		/**
		 * @function subDown
		 * @param {object} 对象 如:{"func":testFunc}多个用逗号隔开如：{"id":""},{"func":testFunc},多个传数组[{"id":""},{"func":testFunc}]
		 * @return {object} AreaClass对象
		 * @description 区域内部元素下键执行操作绑定，可以在按下键触发一个方法，则设置func;由于内部导航会自动计算，id里面的值不用赋，默认如果没传id对象，是会在执行完内部导航后，执行方法，设置func在ID对象在前面，则是执行完方法，后执行导航
		 * @example XEpg.area("nav1").subDown({"func":testFunc}); //执行完导航后执行方法
		 * @example XEpg.area("nav1").subDown([{"func":testFunc},{"id":""}]); //先执行方法后元素导航，数组参数，多个推荐使用
		 * @example XEpg.area("nav1").subDown({"func":testFunc},{"id":""}); //先执行方法后元素导航,多参数
		 */
		this.subDown=function(){
		  this.subDownEventObj=XEpg.Util.argumentsToArray(arguments);
			return this;
		};
		
		/**
		 * @function subLeft
		 * @param {object} 对象 如:{"func":testFunc}多个用逗号隔开如：{"id":""},{"func":testFunc},多个传数组[{"id":""},{"func":testFunc}]
		 * @return {object} AreaClass对象
		 * @description 区域内部元素左键执行操作绑定，可以在按左键触发一个方法，则设置func;由于内部导航会自动计算，id里面的值不用赋，默认如果没传id对象，是会在执行完内部导航后，执行方法，设置func在ID对象在前面，则是执行完方法，后执行导航
		 * @example XEpg.area("nav1").subLeft({"func":testFunc}); //执行完导航后执行方法
		 * @example XEpg.area("nav1").subLeft([{"func":testFunc},{"id":""}]); //先执行方法后元素导航，数组参数，多个推荐使用
		 * @example XEpg.area("nav1").subLeft({"func":testFunc},{"id":""}); //先执行方法后元素导航,多参数
		 */
		this.subLeft=function(){
		  this.subLeftEventObj=XEpg.Util.argumentsToArray(arguments);
			return this;
		};
		
		/**
		 * @function subRight
		 * @param {object} 对象 如:{"func":testFunc}多个用逗号隔开如：{"id":""},{"func":testFunc},多个传数组[{"id":""},{"func":testFunc}]
		 * @return {object} AreaClass对象
		 * @description 区域内部元素右键执行操作绑定，可以在按右键触发一个方法，则设置func;由于内部导航会自动计算，id里面的值不用赋，默认如果没传id对象，是会在执行完内部导航后，执行方法，设置func在ID对象在前面，则是执行完方法，后执行导航
		 * @example XEpg.area("nav1").subRight({"func":testFunc}); //执行完导航后执行方法
		 * @example XEpg.area("nav1").subRight([{"func":testFunc},{"id":""}]); //先执行方法后元素导航，数组参数，多个推荐使用
		 * @example XEpg.area("nav1").subRight({"func":testFunc},{"id":""}); //先执行方法后元素导航,多参数
		 */
		this.subRight=function(){
		  this.subRightEventObj=XEpg.Util.argumentsToArray(arguments);
			return this;
		};
		
		
	  /**
		 * @function getSelectId
		 * @return {string} 已选中ID
		 * @description 获取选中ID,区域selectId不是focusId
		 * @example var selectId = XEpg.area("nav1").getSelectId(); 
		 */
		this.getSelectId = function(){
			return this.selectId;
		};
		
		/**
		 * @function getColumn
		 * @return {number} 列
		 * @description 获取可见区域一行多少列
		 * @example var column = XEpg.area("nav1").getColumn(); 
		 */
		this.getColumn = function(){
			return this.column;
		};
		
		/**
		 * @function getRow
		 * @return {number} 列
		 * @description 获取可见区域多少行
		 * @example var row = XEpg.area("nav1").getRow(); 
		 */
		this.getRow = function(){
			return this.row;
		};

    /**
		 * @function run
		 * @description 执行生效,区域绑定完，最后必须.run() 才会生成元素绑定，否则不生效
		 * @example XEpg.area("nav1").run(); 
		 */
		this.run = function(){	
		  //行
			for(var i=0;i<this.row;i++){
				//列
				for(var j=0;j<this.column;j++){					
				  window["XEpg"].$(this.areaId+"_"+(this.startIndex+i*this.column+j)).click(this.subClickEventObj).up(this.getUpObj(i,j)).down(this.getDownObj(i,j)).left(this.getLeftObj(i,j)).right(this.getRightObj(i,j)).focus(this.subFocusEventObj).blur(this.subBlurEventObj).scrollText(this.subScrollTextEventObj);					
				}					  
			}
		}
		
		/**
		 * @function getSubEleNavObj
		 * @param {number} index 下标
		 * @return {string} 目标元素对象
		 * @description 根据下标获取子元素对象
		 * @example var obj = XEpg.area("nav1").getSubEleNavObj(2); 
		 */
		this.getSubEleNavObj = function(index){
			return {"id":this.areaId+"_"+(this.startIndex+index)};
		};
		
		/**
		 * @function getSubNavArray
		 * @param {object} navObj 子导航对象，如{"id":"nav2_1"}
		 * @param {object} inSubObj 需处理导航对象,如{"area":{"func":testFunc,"id":""}}
		 * @return {object} 合成导航数组,如{"area":{"func":testFunc,"id":"nav2_1"}}
		 * @description 根据子导航对象与需处理导航对象获取导航数组，对{"area":{"id",""}}进行内部导航对象替换
		 * @example var arr = XEpg.area("nav1").getSubNavArray(navObj,inSubObj); 
		 */
		this.getSubNavArray=function(navObj,inSubObj){
			var subNavArray = [];
			if(inSubObj!=null && inSubObj.length>0){
				for(var i=0,len=inSubObj.length;i<len;i++){
					//有ID属性，则进行替换
					if(typeof(inSubObj[i])=="object" && inSubObj[i]!=null && typeof(inSubObj[i]["id"])=="string"){
						subNavArray.push(navObj);
					}else{
						subNavArray.push(inSubObj[i]);
					}
				}
			}else{
				subNavArray.push(navObj);
			}
			return subNavArray;
		};
		
		/**
		 * @function getUpObj
		 * @param {number} i 行下标，从0开始
		 * @param {number} j 列下标，从0开始
		 * @return {object} 子元素上键执行方法
		 * @description 根据行，列下标，获取上键执行对象
		 * @example var obj = XEpg.area("nav1").getUpObj(0,1); 
		 */
		this.getUpObj = function(i,j){
			var tempObj = null;
			if(i==0){
				if(typeof(this.upEventObj)=="object" && this.upEventObj!=null){
					tempObj = {"func":window["XEpg"].area(this.areaId).onOutUp};
			  }
			}else{
	    	var navObj=this.getSubEleNavObj(j+(i-1)*this.column);
	    	tempObj=this.getSubNavArray(navObj,this.subUpEventObj);	 
	    }  
		  return tempObj;
		};
		
		/**
		 * @function getDownObj
		 * @param {number} i 行下标，从0开始
		 * @param {number} j 列下标，从0开始
		 * @return {object} 子元素下键执行方法
		 * @description 根据行，列下标，获取下键执行对象
		 * @example var obj = XEpg.area("nav1").getDownObj(0,1); 
		 */
		this.getDownObj = function(i,j){
			var tempObj = null;
				if(i+1==this.row){
					if(typeof(this.downEventObj)=="object" && this.downEventObj!=null){
						tempObj = {"func":window["XEpg"].area(this.areaId).onOutDown};
				  }
				}else{
		    	var navObj=this.getSubEleNavObj(j+(i+1)*this.column);
					tempObj=this.getSubNavArray(navObj,this.subDownEventObj);	
		    }			   
		  return tempObj;
		};
		
		/**
		 * @function getLeftObj
		 * @param {number} i 行下标，从0开始
		 * @param {number} j 列下标，从0开始
		 * @return {object} 子元素左键执行方法
		 * @description 根据行，列下标，获取左键执行对象
		 * @example var obj = XEpg.area("nav1").getLeftObj(0,1); 
		 */
		this.getLeftObj = function(i,j){
			var tempObj = null;
			if(j==0){
				if(typeof(this.leftEventObj)=="object" && this.leftEventObj!=null){
					tempObj = {"func":window["XEpg"].area(this.areaId).onOutLeft};
			  }
			}else{
	    	var navObj=this.getSubEleNavObj(i*this.column+j-1);
    		tempObj=this.getSubNavArray(navObj,this.subLeftEventObj);
	    }			   
		  return tempObj;
		};
		
		/**
		 * @function getRightObj
		 * @param {number} i 行下标，从0开始
		 * @param {number} j 列下标，从0开始
		 * @return {object} 子元素右键执行方法
		 * @description 根据行，列下标，获取右键执行对象
		 * @example var obj = XEpg.area("nav1").getRightObj(0,1); 
		 */
		this.getRightObj = function(i,j){
			var tempObj = null;
			if(j+1==this.column){
				if(typeof(this.rightEventObj)=="object" && this.rightEventObj!=null){
					tempObj = {"func":window["XEpg"].area(this.areaId).onOutRight};
			  }
			}else{
	    	var navObj=this.getSubEleNavObj(i*this.column+j+1);
    		//如果有方法,则在元素改变后执行方法
				tempObj=this.getSubNavArray(navObj,this.subRightEventObj);
	    }			
		  return tempObj;
		};
		
		/**
		 * @function onOutHandle
		 * @param {object} positionObj 方位对象，上下左右
		 * @param {object} targetObj 目标对象
		 * @param {string} positionStr 方位字符串"top","down","left","right"
		 * @description 区域边界执行处理
		 * @example XEpg.area("nav1").onOutHandle(positionObj,targetObj,"top"); 
		 */
		this.onOutHandle = function(positionObj,targetObj,positionStr){
			var handleObj=positionObj;
			//如果有targetObj优先处理
			if(targetObj!=null){
				handleObj=targetObj;
			}
			
			//执行处理
			if(typeof(handleObj)=="object" && handleObj!=null && handleObj.length>0){
				this.eventObjHandle(handleObj,positionStr);
			}
			
			//执行完清理掉
			if(targetObj!=null){
				targetObj=null;
			}
		};
		
		/**
		 * @function eventObjHandle
		 * @param {object} eventObjs 事件对象，如：func,area,id
		 * @param {string} positionStr 方位字符串"top","down","left","right"
		 * @description 区域边界执行处理
		 * @example XEpg.area("nav1").eventObjHandle(eventObjs,"top"); 
		 */
		this.eventObjHandle=function(eventObjs,positionStr){
			if(typeof(eventObjs)!="object" && eventObjs==null && eventObjs.length<1)
			  return;
      for(var tempIndex in eventObjs){
      	 var tempObj = eventObjs[tempIndex];
					for(var item in tempObj){
						var itemObj = tempObj[item];
						if(item!="titleUrl" && (itemObj==null || itemObj==""))
							continue;
						switch(item){
							
							case "func":
								if(typeof(itemObj)=="function")
									itemObj();
								break;
							case "id":
								if(itemObj.indexOf(",")>-1){
									var strs = itemObj.split(",");
									var len = strs.length;
									for(var i=0;i<len;i++){
										var isOpt = XEpg.$(XEpg.My.currentId).effectHandle(strs[i]);
										if(isOpt){
											window["XEpg"].My.currentAreaId = null;
											break;
										}
									}
								}else{
									XEpg.$(XEpg.My.currentId).effectHandle(itemObj);
									window["XEpg"].My.currentAreaId = null;
								}
								break;
							case "area":
							  if(typeof(itemObj)=="object" && itemObj!=null){
                    this.areaHandle(itemObj,positionStr);
							  }
								break;					
						}
					}
		  }
		};
		
		/**
		 * @function areaHandle
		 * @param {object} itemObj 区域对象，如{"area":{"func":testFunc,"id":"nav2_1"}}
		 * @param {string} positionStr 方位字符串"top","down","left","right"
		 * @description 区域对象处理
		 * @example XEpg.area("nav1").areaHandle(itemObj,"top"); 
		 */
		this.areaHandle=function(itemObj,positionStr){
				var areaId = "",toIndex=0,fromIndex=this.getAreaIndexByCurrentId();
		  	//必须有目标ID
		  	if(typeof(itemObj["id"])=="string"){
		  		areaId=itemObj.id;
			  	if(typeof(itemObj["indexs"])=="object" && itemObj["indexs"]!=null && itemObj["indexs"].length>0){
			  		if(positionStr=="left" || positionStr=="right"){
			  		  fromIndex = Math.floor(fromIndex/this.column);
			  		}else{
			  			fromIndex = fromIndex%this.column;
			  		}
            toIndex = itemObj.indexs[fromIndex];
			  	}
			  	var toId = this.getTargetAreaEleId(areaId,toIndex,itemObj.indexs,fromIndex);
  				//元素存在
					if(toId!=null && window["XEpg"].$(toId).isActive()){
						 window["XEpg"].My.currentAreaId = areaId;
						 window["XEpg"].My.onFocusById(toId);
						 if(itemObj.isMemory){
						 	 XEpg.area(areaId).memoryHandle(positionStr,this.areaId,fromIndex);
						 }
					}
				}
		};
		
		
		/**
		 * @function memoryHandle
		 * @param {string} positionStr 方位字符串"top","down","left","right"
		 * @param {string} toAreaId 目标区域ID
		 * @param {number} toIndex 目标区域对应下标
		 * @description 区域记忆处理
		 * @example XEpg.area("nav1").memoryHandle("top","nav2",0); 
		 */
		this.memoryHandle=function(positionStr,toAreaId,toIndex){
			var handleObj = null;
			var indexsLen = 0;
			switch(positionStr){
				case "top":
					 this.downTarget = this.downEventObj;
					 handleObj=this.downTarget;
					 indexsLen=this.column;
					 break;
			  case "down":
					 this.upTarget = this.upEventObj;
					 handleObj=this.upTarget;
					 indexsLen=this.column;
					 break;
				case "left":
					 this.rightTarget = this.rightEventObj;
					 handleObj=this.rightTarget;
					 indexsLen=this.row;
					 break;
				case "right":
					 this.leftTarget = this.leftEventObj;
					 handleObj=this.leftTarget;
					 indexsLen=this.row;
					 break;
			}
			//有对象进行处理
			if(handleObj!=null && typeof(handleObj)=="object" && XEpg.Util.isArray(handleObj)){
				 var isAreaObj=false;
				 for(var i=0,len=handleObj.length;i<len;i++){
				 	  if(typeof(handleObj[i])=="object" && typeof(handleObj[i])!=null && typeof(handleObj[i]["area"])=="object" && typeof(handleObj[i]["area"])!=null){
				 	  	isAreaObj=true;
				 	  	//有数组
							if(typeof(handleObj[i]["area"]["indexs"])=="object" && typeof(handleObj[i]["area"]["indexs"])!=null && handleObj[i]["area"]["indexs"].length>0){
								for(var j=0,len=handleObj[i]["area"]["indexs"].length;j<len;j++){
									handleObj[i]["area"]["indexs"][j]=toIndex;
								}
							}else{
								//防止边界多个值，返回只有一个可以返回
								handleObj[i]["area"]["indexs"]=[];
								for(var j=0;j<indexsLen;j++){
									handleObj[i]["area"]["indexs"].push(toIndex);
								}
							}
							handleObj[i]["area"]["id"]=toAreaId;
				 	  }
				 }
				 if(!isAreaObj){
				 	handleObj.push({"area":{"id":toAreaId,"indexs":[toIndex]}});
				 }
			}
			
		};
		
		/**
		 * @function onOutUp
		 * @return {object} AreaClass对象
		 * @description 执行上边界值处理方法
		 * @example XEpg.area("nav1").onOutUp();
		 */
		this.onOutUp=function(){
			//对this为window进行处理
			if(typeof(this.onOutUp)!="function")
				return window["XEpg"].area(window["XEpg"].My.currentAreaId).onOutUp();
			this.onOutHandle(this.upEventObj,this.upTarget,"top");		
			return this;
		};
		
		/**
		 * @function onOutDown
		 * @return {object} AreaClass对象
		 * @description 执行下边界值处理方法
		 * @example XEpg.area("nav1").onOutDown();
		 */
		this.onOutDown=function(){
			if(typeof(this.onOutDown)!="function")
				return window["XEpg"].area(window["XEpg"].My.currentAreaId).onOutDown();
			this.onOutHandle(this.downEventObj,this.downTarget,"down");	
			return this;
		};
		
		/**
		 * @function onOutLeft
		 * @return {object} AreaClass对象
		 * @description 执行左边界值处理方法
		 * @example XEpg.area("nav1").onOutLeft();
		 */
		this.onOutLeft=function(){
			if(typeof(this.onOutLeft)!="function")
				return window["XEpg"].area(window["XEpg"].My.currentAreaId).onOutLeft();
			this.onOutHandle(this.leftEventObj,this.leftTarget,"left");		
			return this;
		};
		
		/**
		 * @function onOutRight
		 * @return {object} AreaClass对象
		 * @description 执行右边界值处理方法
		 * @example XEpg.area("nav1").onOutRight();
		 */
		this.onOutRight=function(){
			if(typeof(this.onOutRight)!="function")
				return window["XEpg"].area(window["XEpg"].My.currentAreaId).onOutRight();
			this.onOutHandle(this.rightEventObj,this.rightTarget,"right");		
			return this;
		};
		
		/**
		 * @function setSelectedId
		 * @param {string} id 选中ID
		 * @description 设置已选中ID,并显示选中效果
		 * @example XEpg.area("nav1").setSelectedId("nav1_0"); 
		 */
		this.setSelectedId=function(id){
			if(this.selectId!=null){
				if(id == this.selectId){
					return;
				}
				if(typeof(window["XEpg"].$(this.selectId).blurEventObj)=="object" && window["XEpg"].$(this.selectId).blurEventObj!=null){
					//start:fix by qsf
					var obj = window["XEpg"].$(this.selectId).blurEventObj;
					var len = obj.length;
					if(len) {
						for(var i=0; i<len; i++) {
							if(obj[i] && obj[i]["class"]) {
								obj[i]["class"] = "item";
							}
						}
					}
					//end:fix by qsf
					//window["XEpg"].$(this.selectId).blurEventObj["class"]="item";
				}else{
					window["XEpg"].$(this.selectId).blurEventObj={"class":"item"};
				}
				window["XEpg"].$(this.selectId).onBlur();
			}
			this.selectId = id;
			if(typeof(window["XEpg"].$(id).blurEventObj)=="object" && window["XEpg"].$(id).blurEventObj!=null){
				//start:fix by qsf
				var obj = window["XEpg"].$(id).blurEventObj;
				var len = obj.length;
				if(len) {
					var newObj = [];
					for(var i=0; i<len; i++) {
						if(obj[i] && obj[i]["class"]) {
							newObj.push({"class":"item item_select"});
						} else {
							newObj.push(obj[i]);
						}
					}
					window["XEpg"].$(id).blurEventObj = newObj;
				}
				//end:fix by qsf
				window["XEpg"].$(id).blurEventObj["class"]="item item_select";
			}else{
				window["XEpg"].$(id).blurEventObj={"class":"item item_select"};
			}
		};
		
		/**
		 * @function getTargetAreaEleId
		 * @param {string} areaId 目标区域ID
		 * @param {number} index 目标区域下标
		 * @param {object} fromIndexArr 起始区域下标数组
		 * @param {number} fromIndex 起始区域下标
		 * @return {string} 目标区域元素id
		 * @description 获取目标区域元素id
		 * @example XEpg.area("nav1").getTargetAreaEleId("nav2",1,[0,0,1,1],3); 
		 */
		this.getTargetAreaEleId = function(areaId,index,fromIndexArr,fromIndex){
			var toId = window["XEpg"].area(areaId).getEleIdByIndex(index);
			if(toId!=null && window["XEpg"].$(toId).isActive()){
				return toId;
			}else if(fromIndex<1){
				return null;
			}else{
				fromIndex--;
			  return this.getTargetAreaEleId(areaId,fromIndexArr[fromIndex],fromIndexArr,fromIndex);				
			}
		};
		

		/**
		 * @function getEleIdByIndex
		 * @param {number} areaIndex 目标区域下标
		 * @return {string} 目标区域元素id
		 * @description 根据目标下标获取目标区域元素id
		 * @example XEpg.area("nav1").getEleIdByIndex(1); 
		 */
		this.getEleIdByIndex=function(areaIndex){
			if(areaIndex<0)
			  areaIndex = 0;
			return this.areaId+"_"+(this.startIndex+areaIndex);
		};
		
		/**
		 * @function getAreaIndexByCurrentId
		 * @return {number} 当前元素下标
		 * @description 获取该区域当前元素下标
		 * @example XEpg.area("nav1").getAreaIndexByCurrentId(); 
		 */
		this.getAreaIndexByCurrentId=function(){
			var index = window["XEpg"].My.getIdIndex();
			var tempIndex = index-this.startIndex;
			//防止出现负数下标
			if(tempIndex<0){
				 tempIndex = 0;
			}
			return tempIndex;
		};
		
		/**
		 * @function setIdStartIndexRefreshArea
		 * @param {number} startIndex 区域起始下标
		 * @return {object} AreaClass对象
		 * @description 设置Id起始下标，刷新区域
		 * @example XEpg.area("nav1").setIdStartIndexRefreshArea();
		 */
		this.setIdStartIndexRefreshArea=function(startIndex){
			//先清理原有区域元素绑定，再设置新的元素绑定
			this.clearObj();
      if(typeof(startIndex)=="number"){
      	this.startIndex = startIndex;
      }
			this.run();
			return this;
		};
				
		/**
		 * @function clearObj
		 * @param {number} startIndex 区域起始下标，不传用默认
		 * @param {number} count 清理个数，不传用默认用行乘以列
		 * @description 清理对象,传参则按传参下标开始删除，不传则用默认
		 * @example XEpg.area("nav1").clearObj();
		 */
		this.clearObj=function(startIndex,count){
			//add by qsf
			startIndex || (startIndex = this.startIndex);
			//end
			var total = this.column*this.row;
			var tempStartIndex = this.startIndex;
			  if(typeof(startIndex)=="number"){
				tempStartIndex = startIndex;
			  }
			  if(typeof(count)=="number"){
				total = count;
			  }
			for(var i=0;i<total;i++){
				XEpg.$(this.areaId+"_"+(tempStartIndex+i)).clearObj();
			}
		};
				
		/**
		 * @function deleteObj
		 * @param {number} startIndex 区域起始下标，不传用默认
		 * @param {boolean} notDelArea 是否删除区域，默认不删除
		 * @description 删除对象,传参则按传参下标开始删除，不传则用默认
		 * @example XEpg.area("nav1").deleteObj();
		 */
		this.deleteObj=function(startIndex,notDelArea){
			//删除区域里的元素
      var total = this.column*this.row;
      var tempStartIndex = this.startIndex;
      if(typeof(startIndex)=="number"){
      	tempStartIndex = startIndex;
      }
			for(var i=0;i<total;i++){
				XEpg.$(this.areaId+"_"+(tempStartIndex+i)).deleteObj();
			}
			//清理区域
			if(!notDelArea){
			  AreaArrayObj[this.areaId]=null;
			}
		};			
						
	};

	
		//获取Area对象
	function getAreaObj(id){
		if(!(typeof(AreaArrayObj[id])=="object" && AreaArrayObj[id]!=null)){
			AreaArrayObj[id]= new AreaClass(id);
		}
		return AreaArrayObj[id];
	}
	
	//如果Epg类没有创建
	if(!(typeof(window["XEpg"])=="object" && window["XEpg"]!=null)){
		window["XEpg"]={};
	}
	
	window["XEpg"].Area = AreaClass;
	window["XEpg"].area = getAreaObj;

})(window);
/**
 * @fileOverview 页面元素选取封装类
 * @author suzy
 * @version 2.0
 */

/**
 * @description 选取类数组，放外面，兼容有些盒子不兼容，取不到内部变量
 * @public
 * @type object
 */
var EleArrayObj = {};
;
(function (window) {
    /**
     * @class EleClass
     * @constructor
     * @param {string} id 元素ID
     * @author suzy
     * @description 元素选取类,支持链式写法
     * @example new EleClass("testDiv");
     * @since version 2.0
     */
    function EleClass(id) {
        this.id = id;
        this.obj = null;

        //事件变量
        this.scrollTextEventObj = null;
        this.upEventObj = null;
        this.downEventObj = null;
        this.leftEventObj = null;
        this.rightEventObj = null;
        this.clickEventObj = null;
        this.focusEventObj = [{"class": "item item_focus"}];
        this.blurEventObj = [{"class": "item"}];
        this._init();
        ///**
        // * @function getObj
        // * @return {object} 元素dom对象
        // * @description 获取元素dom对象
        //* @example XEpg.$("testDiv").getObj();  等于 document.getElementById("testDiv")
        // */
        //this.getObj=function(){
        //	if(this.obj==null)
        //	  this.obj=document.getElementById(this.id);
        //	return this.obj;
        //};


        /**
         * @function clearObj
         * @return {object} EleClass对象
         * @description 清理Ele缓存dom内容，在html内容被替换后，需要clearObj，否则元素选取操作还是原来的html而不是最新的
         * @example XEpg.$("testDiv").clearObj();
         */
        this.clearObj = function () {
            if (this.obj != null) {
                //有文字滚动，则清理文字对象
                if (this.scrollTextEventObj != null) {
                    window["XEpg"].$(this.id + "_txt").clearObj();
                }
                this.obj = null;
            }
            return this;
        };


        /**
         * @function deleteObj
         * @param {object} locationObj 对象如：{"direction":"left","val":20}，当移除改DOM，需要对父节点位置进行删减控制，则传入参数，否则不传
         * @description 删除dom对象与EleClass对象,在Ele对象不再使用，需要释放Ele缓存资源执行
         * @example XEpg.$("testDiv").deleteObj(); //移除ELE对象与html元素
         * @example XEpg.$("testDiv").deleteObj({"direction":"left","val":20}); //移除ELE对象与html元素，且需要更改父容器
         */
        this.deleteObj = function (locationObj) {
            if (this.getObj() != null) {
                //有文字滚动，则清理文字对象
                if (this.scrollTextEventObj != null) {
                    window["XEpg"].$(this.id + "_txt").deleteObj();
                }
                var parentObj = this.obj.parentNode;
                if (typeof(parentObj) == "object" && parentObj != null && typeof(parentObj.removeChild) == "function") {
                    parentObj.removeChild(this.obj);
                    //处理父容器复位
                    if (typeof(locationObj) == "object" && locationObj != null) {
                        var val = parentObj.style[locationObj.direction];
                        if (val == null) {
                            val = 0;
                        } else {
                            val = parseInt(val.replace("px"), 10);
                        }
                        val -= locationObj.val;
                        parentObj.style[locationObj.direction] = val + "px";
                    }
                }
            }
            EleArrayObj[this.id] = null;
        };


        /**
         * @function show
         * @return {object} EleClass对象
         * @description Dom元素显示
         * @example XEpg.$("testDiv").show();
         */
        this.show = function () {
            if (typeof(this.getObj()) == "object" && this.obj != null && this.obj.style.display != "block") {
                this.obj.style.display = "block";
            }
            return this;
        };

        /**
         * @function hide
         * @return {object} EleClass对象
         * @description Dom元素隐藏
         * @example XEpg.$("testDiv").hide();
         */
        this.hide = function () {
            if (typeof(this.getObj()) == "object" && this.obj != null && this.obj.style.display != "none") {
                this.obj.style.display = "none";
            }
            return this;
        };


        /**
         * @function html
         * @param {string|不传} val 要写入的html|不传
         * @return {object|string} EleClass对象|html字符串
         * @description Dom元素html写入|读取，如果有值传入则写入，反之则读取
         * @example XEpg.$("testDiv").html("test");  //写入html
         * @example XEpg.$("testDiv").html();  //读取html
         */
        this.html = function (val) {
            if (typeof(val) != "undefined") {
                if (typeof(this.getObj()) == "object" && this.obj != null)
                    this.obj.innerHTML = val;
                return this;
            } else {
                if (typeof(this.getObj()) == "object" && this.obj != null)
                    return this.obj.innerHTML;
                else
                    return "";
            }
        };


        /**
         * @function addHtml
         * @param {string} val 要累加写入的html
         * @param {boolean} isbefore 是否前面累加
         * @return {object} EleClass对象
         * @description Dom元素html累加写入，如果isbefore为true则前面累加，默认为内容后累加
         * @example XEpg.$("testDiv").addHtml("test");  //html默认追加最后面
         * @example XEpg.$("testDiv").addHtml("test",true);  //html追加最前面
         */
        this.addHtml = function (val, isbefore) {
            if (typeof(val) != "undefined" && typeof(this.getObj()) == "object" && this.obj != null) {
                if (isbefore)
                    this.obj.innerHTML = val + this.obj.innerHTML;
                else
                    this.obj.innerHTML = this.obj.innerHTML + val;
            }
            return this;
        };

        /**
         * @function value
         * @param {string|不传} val 要写入的值|不传
         * @return {object|string} EleClass对象|元素值
         * @description Dom元素值写入|读取，如果有值传入则写入，反之则读取
         * @example (new EleClass("testInput")).value("test");  //写入值
         * @example (new EleClass("testInput")).value(); //读取值
         */
        this.value = function (val) {
            if (typeof(val) != "undefined") {
                if (typeof(this.getObj()) == "object" && this.obj != null)
                    this.obj.value = val;
                return this;
            } else {
                if (typeof(this.getObj()) == "object" && this.obj != null)
                    return this.obj.value;
                else
                    return "";
            }
        };

        /**
         * @function addValue
         * @param {string} val 要累加写入的值
         * @param {boolean} isbefore 是否前面累加
         * @return {object} EleClass对象
         * @description Dom元素值累加写入，如果isbefore为true则前面累加，默认为内容后累加
         * @example (new EleClass("testInput")).addValue("test");   //值默认追加最后面
         * @example (new EleClass("testInput")).addValue("test",true); //值追加最前面
         */
        this.addValue = function (val, isbefore) {
            if (typeof(val) != "undefined" && typeof(this.getObj()) == "object" && this.obj != null) {
                if (isbefore)
                    this.obj.value = val + this.obj.value;
                else
                    this.obj.value += val;
            }
            return this;
        };

        /**
         * @function style
         * @param {string|不传} val 要替换style|不传
         * @return {object|string} EleClass对象|style字符串
         * @description Dom元素style写入|读取，如果有值传入则写入，反之则读取
         * @example XEpg.$("testDiv").style("left:720px;top:10px");  //写入样式值
         * @example XEpg.$("testDiv").style();  //读取样式值
         */
        this.style = function (val) {
            if (typeof(val) != "undefined") {
                if (typeof(this.getObj()) == "object" && this.obj != null)
                    this.obj.style.cssText = val;
                return this;
            } else {
                if (typeof(this.getObj()) == "object" && this.obj != null)
                    return this.obj.style.cssText;
                else
                    return "";
            }
        };

        /**
         * @function addStyle
         * @param {string} val 要累加写入的样式
         * @return {object} EleClass对象
         * @description Dom元素样式累加写入
         * @example XEpg.$("testDiv").addStyle("left:720px");
         */
        this.addStyle = function (val) {
            if (typeof(val) != "undefined" && typeof(this.getObj()) == "object" && this.obj != null) {
                this.obj.style.cssText += " " + val;
            }
            return this;
        };

        /**
         * @function removeStyle
         * @param {string} val 要移除的样式
         * @return {object} EleClass对象
         * @description Dom元素样式移除
         * @example XEpg.$("testDiv").removeStyle("left:720px");
         */
        this.removeStyle = function (val) {
            if (typeof(val) != "undefined" && typeof(this.getObj()) == "object" && this.obj != null) {
                this.obj.style.cssText = this.obj.style.cssText.replace(val, "");
            }
            return this;
        };

        /**
         * @function className
         * @param {string|不传} val 要替换样式名|不传
         * @return {object|string} EleClass对象|className字符串
         * @description Dom元素className写入|读取，如果有值传入则写入，反之则读取
         * @example XEpg.$("testDiv").className("item item_select");   //写入class值
         * @example XEpg.$("testDiv").className();   //读取class值
         */
        this.className = function (val) {
            if (typeof(val) != "undefined") {
                if (typeof(this.getObj()) == "object" && this.obj != null)
                    this.obj.className = val;
                return this;
            } else {
                if (typeof(this.getObj()) == "object" && this.obj != null)
                    return this.obj.className;
                else
                    return "";
            }
        };

        /**
         * @function addClassName
         * @param {string} val 要累加写入的ClassName
         * @return {object} EleClass对象
         * @description Dom元素ClassName累加写入
         * @example XEpg.$("testDiv").addClassName("item_select");
         */
        this.addClassName = function (val) {
            if (typeof(val) != "undefined" && typeof(this.getObj()) == "object" && this.obj != null && this.obj.className.indexOf(val) < 0)
                this.obj.className += " " + val;
            return this;
        };

        /**
         * @function removeClassName
         * @param {string} val 要移除的className
         * @return {object} EleClass对象
         * @description Dom元素className移除
         * @example XEpg.$("testDiv").removeClassName("item_select");
         */
        this.removeClassName = function (val) {
            if (typeof(val) != "undefined" && typeof(this.getObj()) == "object" && this.obj != null) {
                this.obj.className = this.obj.className.replace(val, "");
            }
            return this;
        };

        ///**
        // * @function attr
        // * @param {string} key 属性名
        // * @param {string|不传} val 要替换属性值|不传
        // * @return {object|string} EleClass对象|属性值字符串
        // * @description Dom元素属性写入|读取，如果val有值传入则写入，反之则读取
        // * @example XEpg.$("testDiv").attr("title","testName"); //元素属性写入值
        // * @example XEpg.$("testDiv").attr("title"); //读取元素属性值
        // */
        //this.attr=function(key,val){
        //	if(typeof(val)!="undefined"){
        //		if(typeof(this.getObj())=="object" && this.obj!=null && typeof(key)!="undefined"){
        //			if(typeof(this.obj.getAttribute)=="function")
        //			 this.obj.setAttribute(key,val);
        //			else
        //			 this.obj[key]=val;
        //		}
        //		return this;
        //	}else{
        //		if(typeof(this.getObj())=="object" && this.obj!=null && typeof(key)!="undefined"){
        //			if(typeof(this.obj.getAttribute)=="function"){
        //				var attrVal = this.obj.getAttribute(key);
        //				if(typeof(attrVal)=="undefined"){
        //					 attrVal = this.obj[key];
        //				}
        //				return attrVal;
        //			}else{
        //				return this.obj[key];
        //
        //			}
        //		}else{
        //			return "";
        //		}
        //	}
        //};

        /**
         * @function styleAttr
         * @param {string} key 属性名
         * @param {string|不传} val 要替换style属性值|不传
         * @return {object|string} EleClass对象|style属性值字符串
         * @description Dom元素style属性写入|读取，如果val有值传入则写入，反之则读取
         * @example XEpg.$("testDiv").styleAttr("left","90px");  //样式属性写入值
         * @example  XEpg.$("testDiv").styleAttr("left");  //样式属性读取值
         */
        this.styleAttr = function (key, val) {
            if (typeof(val) != "undefined") {
                if (typeof(this.getObj()) == "object" && this.obj != null && typeof(key) != "undefined")
                    this.obj.style[key] = val;
                return this;
            } else {
                if (typeof(this.getObj()) == "object" && this.obj != null && typeof(key) != "undefined")
                    return this.obj.style[key];
                else
                    return "";
            }
        };

        /**
         * @function styleAttrNumber
         * @param {string} key 属性名
         * @param {number|不传} val 要替换style数值|不传
         * @param {string} unit 单位,px或%等，默认不传为px
         * @return {object|number} EleClass对象|style数值
         * @description Dom元素style属性数值写入|读取，如果val有值传入则写入，反之则读取
         * @example XEpg.$("testDiv").styleAttrNumber("left","90");   //样式属性数字写入值
         * @example XEpg.$("testDiv").styleAttrNumber("left");   //样式属性数字读取值
         * @example XEpg.$("testDiv").styleAttrNumber("left","90","%"); //样式属性带单位数字写入值
         */
        this.styleAttrNumber = function (key, val, unit) {
            var units = "px";
            if (typeof(unit) != "undefined")
                units = unit
            if (typeof(val) != "undefined") {
                return this.styleAttr(key, val + "px");
            } else {
                var temp = this.styleAttr(key);
                if (temp != null && temp != "") {
                    temp = temp.replace(units, "");
                    if (temp.length > 0) {
                        return parseInt(temp, 10);
                    }
                }
                return 0;
            }
        };

        /**
         * @function removeStyleAttr
         * @param {string} keys 要移除的style属性名
         * @return {object} EleClass对象
         * @description Dom元素style属性移除,支持单个与多个,多个用,逗号隔开
         * @example XEpg.$("testDiv").removeStyleAttr("left"); //移除样式属性
         * @example XEpg.$("testDiv").removeStyleAttr(["left","top"]); //移除多个样式属性
         */
        this.removeStyleAttr = function (keys) {
            if (this.isActive()) {
                for (var i = 0, len = arguments.length; i < len; i++) {
                    this.obj.style[arguments[i]] = "";
                    //兼容置空属性不能移除属性
                    if (typeof(this.obj.style.removeProperty) == "function") {
                        this.obj.style.removeProperty(arguments[i]);
                    }
                }
            }
            return this;
        };

        /**
         * @function isActive
         * @return {boolean} 是否活跃
         * @description Dom元素是否活跃，该元素必须存在，并可见才算活跃
         * @example XEpg.$("testDiv").isActive();
         */
        this.isActive = function () {
            if (typeof(this.getObj()) == "object" && this.obj != null && this.obj.style.display != "none") {
                return true;
            }
            return false;
        };

        /**
         * @function scrollText
         * @param {object} setObj 对象如:{"enTextLen":28,"enSingleWidth":12}
         * @return {object} EleClass对象
         * @description 设置文字滚动,按英文字符算，一个中文算2个英文字符,enTextLen显示区域所能显示的英文字符总长度，超过则隐藏，enSingleWidth文字大小fontSize/2,moveSpacing移动间隔，不传默认为2，越大动的幅度越大;timeSpacing时间间隔，不填默认为150ms，越短速度越快
         * @example XEpg.$("testDiv").scrollText({"enTextLen":28,"enSingleWidth":12});  //简单文字滚动赋值
         * @example XEpg.$("testDiv").scrollText({"enTextLen":28,"enSingleWidth":12,"moveSpacing":2,"timeSpacing":150});   //文字滚动赋值,自己控制速度与间隔
         */
        this.scrollText = function (setObj) {
            if (typeof(setObj) == "object" && setObj != null) {
                this.scrollTextEventObj = setObj;
            }
            return this;
        };


        /**
         * @function up
         * @param {object} 对象 如:{"id":"nav4_0"}多个用逗号隔开如：{"id":"nav4_0"},{"func":testFunc},多个传数组[{"id":"nav4_0"},{"func":testFunc}]
         * @return {object} EleClass对象
         * @description 元素上键执行操作绑定，可以在按上键触发一个方法，则设置func;也可以移到某个元素，则设置id;如果是既要触发方法也要执行id移动，则2个都设置，放前面的先执行，比如先写func，则是先执行方法;多个id使用逗号隔开，从左边起，如果第一个不存在，则跳转执行第二个
         * @example XEpg.$("testDiv").up({"id":"nav4_0"}); //元素导航
         * @example XEpg.$("testDiv").up([{"func":testFunc},{"id":"nav4_0"}]); //先执行方法后元素导航，数组参数，多个推荐使用
         * @example XEpg.$("testDiv").up({"func":testFunc},{"id":"nav4_0"}); //先执行方法后元素导航,多参数
         * @example XEpg.$("testDiv").up({"func":testFunc,"id":"nav4_0"}); //先执行方法后元素导航，对象参数，不推荐使用，低级盒端不兼容先后执行顺序
         */
        this.up = function () {
            this.upEventObj = XEpg.Util.argumentsToArray(arguments);
            return this;
        };

        /**
         * @function down
         * @param {object} 对象 如:{"id":"nav4_0"}多个用逗号隔开如：{"id":"nav4_0"},{"func":testFunc},多个传数组[{"id":"nav4_0"},{"func":testFunc}]
         * @return {object} EleClass对象
         * @description 元素下键执行操作绑定，可以在按下键触发一个方法，则设置func;也可以移到某个元素，则设置id;如果是既要触发方法也要执行id移动，则2个都设置，放前面的先执行，比如先写id，则是先执行移到某个元素;多个id使用逗号隔开，从左边起，如果第一个不存在，则跳转执行第二个
         * @example XEpg.$("testDiv").down({"id":"nav4_0"}); //元素导航
         * @example XEpg.$("testDiv").down([{"func":testFunc},{"id":"nav4_0"}]); //先执行方法后元素导航，数组参数，多个推荐使用
         * @example XEpg.$("testDiv").down({"func":testFunc},{"id":"nav4_0"}); //先执行方法后元素导航,多参数
         * @example XEpg.$("testDiv").down({"func":testFunc,"id":"nav4_0"}); //先执行方法后元素导航，对象参数，不推荐使用，低级盒端不兼容先后执行顺序
         */
        this.down = function () {
            this.downEventObj = XEpg.Util.argumentsToArray(arguments);
            return this;
        };

        /**
         * @function left
         * @param {object} 对象 如:{"id":"nav4_0"}多个用逗号隔开如：{"id":"nav4_0"},{"func":testFunc},多个传数组[{"id":"nav4_0"},{"func":testFunc}]
         * @return {object} EleClass对象
         * @description 元素左键执行操作绑定，可以在按左键触发一个方法，则设置func;也可以移到某个元素，则设置id;如果是既要触发方法也要执行id移动，则2个都设置，放前面的先执行，比如先写func，则是先执行方法;多个id使用逗号隔开，从左边起，如果第一个不存在，则跳转执行第二个
         * @example XEpg.$("testDiv").left({"id":"nav4_0"}); //元素导航
         * @example XEpg.$("testDiv").left([{"func":testFunc},{"id":"nav4_0"}]); //先执行方法后元素导航，数组参数，多个推荐使用
         * @example XEpg.$("testDiv").left({"func":testFunc},{"id":"nav4_0"}); //先执行方法后元素导航,多参数
         * @example XEpg.$("testDiv").left({"func":testFunc,"id":"nav4_0"}); //先执行方法后元素导航，对象参数，不推荐使用，低级盒端不兼容先后执行顺序
         */
        this.left = function () {
            this.leftEventObj = XEpg.Util.argumentsToArray(arguments);
            return this;
        };

        /**
         * @function right
         * @param {object} 对象 如:{"id":"nav4_0"}多个用逗号隔开如：{"id":"nav4_0"},{"func":testFunc},多个传数组[{"id":"nav4_0"},{"func":testFunc}]
         * @return {object} EleClass对象
         * @description 元素右键执行操作绑定，可以在按右键触发一个方法，则设置func;也可以移到某个元素，则设置id;如果是既要触发方法也要执行id移动，则2个都设置，放前面的先执行，比如先写id，则是先执行移到某个元素;多个id使用逗号隔开，从左边起，如果第一个不存在，则跳转执行第二个
         * @example XEpg.$("testDiv").right({"id":"nav4_0"}); //元素导航
         * @example XEpg.$("testDiv").right([{"func":testFunc},{"id":"nav4_0"}]); //先执行方法后元素导航，数组参数，多个推荐使用
         * @example XEpg.$("testDiv").right({"func":testFunc},{"id":"nav4_0"}); //先执行方法后元素导航,多参数
         * @example XEpg.$("testDiv").right({"func":testFunc,"id":"nav4_0"}); //先执行方法后元素导航，对象参数，不推荐使用，低级盒端不兼容先后执行顺序
         */
        this.right = function () {
            this.rightEventObj = XEpg.Util.argumentsToArray(arguments);
            return this;
        };

        /**
         * @function click
         * @param {object} 对象 如:{"func":testFunc}多个用逗号隔开如：{"func":testFunc},{"url":"test.htm"},{"titleUrl":""},多个传数组[{"func":testFunc},{"url":"test.htm"},{"titleUrl":""}]
         * @return {object} EleClass对象
         * @description 元素点击执行操作绑定，可以在按点击触发一个方法，则设置func;也可以跳转url，则设置url,如果要使用title里的url进行跳转，则设置"titleUrl":"";如果是既要触发方法也要执行url跳转，则2个都设置，放前面的先执行
         * @example XEpg.$("testDiv").click({"url":"test.htm"});  //点击页面跳转
         * @example XEpg.$("testDiv").click({"titleUrl":""});  //点击根据元素title里值页面跳转
         * @example XEpg.$("testDiv").click([{"func":testFunc},{"url":"test.htm"}]);  //先执行方法后页面跳转，数组参数，多个推荐使用
         * @example XEpg.$("testDiv").click({"func":testFunc},{"url":"test.htm"});  //先执行方法后页面跳转，多参数
         * @example XEpg.$("testDiv").click({"func":testFunc,"url":"test.htm"});  //先执行方法后页面跳转，对象参数，不推荐使用，低级盒端不兼容先后执行顺序
         */
        this.click = function () {
            this.clickEventObj = XEpg.Util.argumentsToArray(arguments);
            return this;
        };

        /**
         * @function focus
         * @param {object}  对象 如:{"class":"item_select"},多个用逗号隔开如：{"func":testFunc},{"class":"item_focus"},{"style":"left:70px"},多个传数组[{"func":testFunc},{"class":"item_select"},{"style":"left:70px"}]
         * @return {object} EleClass对象
         * @description 元素焦点显示绑定，可以在焦点显示时触发一个方法，则设置func;也可以改变className，则设置class;也可以改变style,则设置style；如果是既要触发方法也要改变calss，则2个都设置，放前面的先执行
         * @example XEpg.$("testDiv").focus({"class":"item item_focus"}); //元素焦点展示，改变class
         * @example XEpg.$("testDiv").focus({"style":"left:70px"});  //元素焦点展示，改变style
         * @example XEpg.$("testDiv").focus([{"func":testFunc},{"class":"item item_focus"}]);  //先执行方法后改变class，数组参数，多个推荐使用
         * @example XEpg.$("testDiv").focus({"func":testFunc},{"class":"item item_focus"});  //先执行方法后改变class，多参数
         * @example XEpg.$("testDiv").focus({"func":testFunc,"class":"item item_focus"});    //先执行方法后改变class，对象参数，不推荐使用，低级盒端不兼容先后执行顺序
         */
        this.focus = function () {
            this.focusEventObj = XEpg.Util.argumentsToArray(arguments);
            return this;
        };

        /**
         * @function blur
         * @param {object} 对象 如:{"class":"item"},多个用逗号隔开如：{"func":testFunc},{"class":"item"},{"style":"left:70px"},多个传数组[{"func":testFunc},{"class":"item"},{"style":"left:70px"}]
         * @return {object} EleClass对象
         * @description 元素失去焦点显示绑定，可以在失去焦点时触发一个方法，则设置func;也可以改变className，则设置class;也可以改变style,则设置style；如果是既要触发方法也要改变calss，则2个都设置，放前面的先执行
         * @example XEpg.$("testDiv").blur({"class":"item"}); //元素焦点展示，改变class
         * @example XEpg.$("testDiv").blur({"style":"left:70px"});  //元素焦点展示，改变style
         * @example XEpg.$("testDiv").blur([{"func":testFunc},{"class":"item"}]);  //先执行方法后改变class，数组参数，多个推荐使用
         * @example XEpg.$("testDiv").blur({"func":testFunc},{"class":"item"});  //先执行方法后改变class，多参数
         * @example XEpg.$("testDiv").blur({"func":testFunc,"class":"item"});    //先执行方法后改变class，对象参数，不推荐使用，低级盒端不兼容先后执行顺序
         */
        this.blur = function () {
            this.blurEventObj = XEpg.Util.argumentsToArray(arguments);
            return this;
        };

        /**
         * @function onScrollText
         * @return {object} EleClass对象
         * @description 执行文字滚动
         * @example XEpg.$("testDiv").onScrollText();
         */
        this.onScrollText = function () {
            if (this.scrollTextEventObj == null)
                return this;
            var textId = this.id + "_txt";
            var obj = XEpg.$(textId);
            if (typeof(obj.getObj()) == "object" && obj.obj != null) {
                obj.scrollText(this.scrollTextEventObj);
            }
            return this;
        };

        /**
         * @function onUp
         * @return {object} EleClass对象
         * @description 执行上事件
         * @example XEpg.$("testDiv").onUp();
         */
        this.onUp = function () {
            if (this.upEventObj != null) {
                this.eventObjHandle(this.upEventObj);
            }
            return this;
        };

        /**
         * @function onDown
         * @return {object} EleClass对象
         * @description 执行下事件
         * @example XEpg.$("testDiv").onDown();
         */
        this.onDown = function () {
            if (this.downEventObj != null) {
                this.eventObjHandle(this.downEventObj);
            }
            return this;
        };

        /**
         * @function onLeft
         * @return {object} EleClass对象
         * @description 执行左事件
         * @example XEpg.$("testDiv").onLeft();
         */
        this.onLeft = function () {
            if (this.leftEventObj != null) {
                this.eventObjHandle(this.leftEventObj);
            }
            return this;
        };

        /**
         * @function onRight
         * @return {object} EleClass对象
         * @description 执行右事件
         * @example XEpg.$("testDiv").onRight();
         */
        this.onRight = function () {
            if (this.rightEventObj != null) {
                this.eventObjHandle(this.rightEventObj);
            }
            return this;
        };

        /**
         * @function onClick
         * @return {object} EleClass对象
         * @description 执行点击事件
         * @example XEpg.$("testDiv").onClick();
         */
        this.onClick = function () {
            if (this.clickEventObj != null) {
                this.eventObjHandle(this.clickEventObj);
            }
            return this;
        };

        /**
         * @function onFocus
         * @return {object} EleClass对象
         * @description 执行焦点显示事件
         * @example XEpg.$("testDiv").onFocus();
         */
        this.onFocus = function () {
            if (this.focusEventObj != null) {
                window["XEpg"].My.previousId = window["XEpg"].My.currentId;
                window["XEpg"].My.currentId = this.id;
                this.eventObjHandle(this.focusEventObj);
                if (this.scrollTextEventObj != null)
                    window["XEpg"].$(this.id + "_txt").sonScrollText(this.scrollTextEventObj);
            }
            return this;
        };

        /**
         * @function onBlur
         * @return {object} EleClass对象
         * @description 执行失去焦点事件
         * @example XEpg.$("testDiv").onBlur();
         */
        this.onBlur = function () {
            if (this.blurEventObj != null) {
                this.eventObjHandle(this.blurEventObj);
                if (this.scrollTextEventObj != null && typeof(window["scrollText_" + this.id + "_txt"]) == "object" && window["scrollText_" + this.id + "_txt"] != null) {
                    window["scrollText_" + this.id + "_txt"].revert();
                }
            }
            return this;
        };

        /**
         * @function eventObjHandle
         * @param {object} eventObj 对象 如：{"func":testFunc,"class":"item item_select","style":"left:70px","url":"test.htm","titleUrl":"","id":"testDiv4"}
         * @description 事件对象执行，统一处理绑定的，上下左右，点击，焦点显示，失去焦点的事件执行
         * @example XEpg.$("testDiv").eventObjHandle({"func":testFunc,"class":"item item_select"});
         */
        this.eventObjHandle = function (eventObjs) {
            if (typeof(eventObjs) != "object" && eventObjs == null && eventObjs.length < 1)
                return;
            for (var tempIndex in eventObjs) {
                var tempObj = eventObjs[tempIndex];
                for (var item in tempObj) {
                    var itemObj = tempObj[item];
                    if (item != "titleUrl" && (itemObj == null || itemObj == ""))
                        continue;
                    switch (item) {
                        case "func":
                            if (typeof(itemObj) == "function")
                                itemObj(this.titleJson || this.titleStr);
                            break;
                        case "id":
                            if (itemObj.indexOf(",") > -1) {
                                var strs = itemObj.split(",");
                                var len = strs.length;
                                for (var i = 0; i < len; i++) {
                                    var isOpt = this.effectHandle(strs[i]);
                                    if (isOpt)
                                        break;
                                }
                            } else {
                                this.effectHandle(itemObj);
                            }
                            break;
                        case "url":
                            if (itemObj != null && typeof(itemObj) == "string" && itemObj.length > 0) {
                                this.gotoPage(itemObj);
                            }
                            break;
                        case "titleUrl":
                            if (this.isActive()) {
                                var titleStr = this.attr("title");
                                //判断标题必须有值才能跳转
                                if (titleStr != null && typeof(titleStr) == "string" && titleStr.length > 0) {
                                    this.gotoPage(titleStr);
                                }
                            }
                            break;
                        case "class":
                            if (this.isActive())
                                this.obj.className = itemObj;
                            break;
                        case "addClass":
                            if (this.isActive())
                                this.addClassName(itemObj);
                            break;
                        case "removeClass":
                            if (this.isActive())
                                this.removeClassName(itemObj);
                            break;
                        case "style":
                            if (this.isActive())
                                this.obj.style.cssText = itemObj;
                            break;
                    }
                }
            }
        };

        /**
         * @function effectHandle
         * @param {string} elementId 特效处理id
         * @return {object} EleClass对象
         * @description 元素特效处理，主要场景，处理元素焦点移动，显示下一个元素特效
         * @example XEpg.$("testDiv").effectHandle("testDiv4");
         */
        this.effectHandle = function (elementId) {
            var isObj = false;
            var nextObj = document.getElementById(elementId);
            if (typeof(nextObj) == "object" && nextObj != null && nextObj.style.display != "none") {
                this.onBlur();
                window["XEpg"].$(elementId).onFocus();
                isObj = true;
            }
            return isObj;
        };

        /**
         * @function gotoPage
         * @param {string} url 跳转地址
         * @return {object} EleClass对象
         * @description 页面跳转
         * @example XEpg.$("testDiv").gotoPage("test.htm");
         */
        this.gotoPage = function (url) {
            window["XEpg"].My.gotoPage(url);
        };

    }

    EleClass.prototype = {
        _init: function () {
            this.titleStr = this.attr("title");
            if (this.titleStr && this.titleStr.indexOf("{") == 0) {
                this.titleJson = XEpg.Util.parseJSON(this.titleStr);
            }
        },
        /**
         * @function attr
         * @param {string} key 属性名
         * @param {string|不传} val 要替换属性值|不传
         * @return {object|string} EleClass对象|属性值字符串
         * @description Dom元素属性写入|读取，如果val有值传入则写入，反之则读取
         * @example XEpg.$("testDiv").attr("title","testName"); //元素属性写入值
         * @example XEpg.$("testDiv").attr("title"); //读取元素属性值
         */
        attr: function (key, val) {
            if (typeof(val) != "undefined") {
                if (typeof(this.getObj()) == "object" && this.obj != null && typeof(key) != "undefined") {
                    if (typeof(this.obj.getAttribute) == "function")
                        this.obj.setAttribute(key, val);
                    else
                        this.obj[key] = val;
                }
                return this;
            } else {
                if (typeof(this.getObj()) == "object" && this.obj != null && typeof(key) != "undefined") {
                    if (typeof(this.obj.getAttribute) == "function") {
                        var attrVal = this.obj.getAttribute(key);
                        if (typeof(attrVal) == "undefined") {
                            attrVal = this.obj[key];
                        }
                        return attrVal;
                    } else {
                        return this.obj[key];

                    }
                } else {
                    return "";
                }
            }
        },
        /**
         * @function getObj
         * @return {object} 元素dom对象
         * @description 获取元素dom对象
         * @example XEpg.$("testDiv").getObj();  等于 document.getElementById("testDiv")
         */
        getObj: function () {
            if (this.obj == null)
                this.obj = document.getElementById(this.id);
            return this.obj;
        }
    }
    /**
     * @function getEleObj
     * @param {string} id 元素id
     * @return {object} EleClass对象
     * @description 获取元素选取对象
     * @example XEpg.$("testDiv").effectHandle("testDiv4");
     */
    function getEleObj(id) {
        if (!(typeof(EleArrayObj[id]) == "object" && EleArrayObj[id] != null)) {
            EleArrayObj[id] = new EleClass(id);
        }
        return EleArrayObj[id];
    }

    //如果Epg类没有创建
    if (!(typeof(window["XEpg"]) == "object" && window["XEpg"] != null)) {
        window["XEpg"] = {};
    }

    //赋值让外部调用
    window["XEpg"].Ele = EleClass;
    window["XEpg"].$ = getEleObj;


    /**
     * @class MyClass
     * @constructor
     * @author suzy
     * @description 个性定制配置类 主要定制与页面相关的焦点元素，页面跳转，页面返回等方法，供前端页面灵活改写拓展;
     * @example MyClass;
     * @since version 2.0
     */
    var MyClass = {
        previousId: null,//前一个ID
        currentId: null, //页面当前ID
        currentAreaId: null, //当前区域ID
        historyId: null, //页面历史ID
        pageMark: null,  //页面标识
        backType: 2, //1 使用默认的浏览器history.back()返回，2 采用压入栈方式，从栈里获取网页地址
        historyObj: null, //历史记录参数对象
        isQuitSaveCooke: true, //是否离开保持cookie，默认保存
        titleUrlObj: {"titleUrl": ""}, //title Url 对象


        /**
         * @function init
         * @param {object} initObj  初始化对象如:{"currentId":"area1_0","isQuitSaveCooke":false,"pageMark":"pageHome","currentAreaId":"area1","backType":1}
         * @description 页面个性化设置绑定，currentId:当前显示焦点id，则设置class;isQuitSaveCooke:是否页面离开保存cookie，不传默认保存;pageMark:页面标识backType为1，唯一存储读取cookie标识;currentAreaId:当前区域id,如果没设置currentId,则默认显示区域第1个;backType:返回类型，默认为1使用浏览器返回方式;
         * @example XEpg.My.init({"currentId":"area1_0"}); //设置起始元素
         * @example XEpg.My.init({"currentAreaId":"area1"}); //设置起始区域，不带currentId，默认取该区域第1个
         * @example XEpg.My.init({"currentAreaId":"area1","currentId":"area1_3"});  //设置起始区域，与起始元素
         */
        init: function (initObj) {
            for (var item in initObj) {
                var itemValue = initObj[item];
                if (itemValue == null || itemValue == "")
                    continue;
                switch (item) {
                    case "currentId":
                        this.currentId = itemValue;
                        break;
                    case "isQuitSaveCooke":
                        this.isQuitSaveCooke = itemValue;
                        break;
                    case "pageMark":
                        this.pageMark = itemValue;
                        break;
                    case "currentAreaId":
                        this.currentAreaId = itemValue;
                        break;
                    case "backType":
                        this.backType = itemValue;
                        break;
                }
            }
            //如果只传区域ID，没有传currentId，则默认当前为区域0，第一个元素焦点
            if (this.currentId == null && this.currentAreaId != null) {
                this.currentId = this.currentAreaId + "_0";
            }
            this.getHistory();
        },


        /**
         * @function getIdIndex
         * @param {string|不传} id 元素id
         * @return {number} 数字下标
         * @description 获取元素id数字下标，主要针对area1_0,area1_1这样有规律的id，如果不传，则默认对this.currentId进行转换
         * @example XEpg.My.getIdIndex("area1_0");
         */
        getIdIndex: function (pid) {
            var id = this.currentId;
            if (typeof(pid) != "undefined") {
                id = pid;
            }
            if (typeof(id) != "undefined" && id != null) {
                return parseInt(id.substring(id.lastIndexOf("_") + 1), 10);
            }
            return 0;
        },


        /**
         * @function getHistory
         * @description 获取页面历史对象，从cookie里获取，前面从该页面离开，所存储的信息
         * @example XEpg.My.getHistory();
         */
        getHistory: function () {
            /*var url = null;
            if (this.backType == 1 && this.pageMark != null) {
                url = window["XEpg"].Util.getCookie(this.pageMark); //获取当前页cookie存储参数
            }
            var tempObj = window["XEpg"].Util.getUrlParameterObj(url);
            this.historyObj = tempObj;
            if (tempObj != null && typeof(tempObj.historyId) != "undefined") {
                this.historyId = tempObj.historyId;
                if (this.backType == 1 && this.pageMark != null)
                    window["XEpg"].Util.delCookie(this.pageMark); //使用cookie数据后，开始删除
            }*/
        },

        /**
         * @function setHistory
         * @description 设置页面历史对象
         * @example XEpg.My.setHistory();
         */
        setHistory: function () {
            if (this.backType == 2 && typeof(window["XEpg"].Util.addNavigationUrl) == "function") {
                window["XEpg"].Util.addNavigationUrl(this.pageQuitSetHistoryUrl());
            } else { //记录参数
                window["XEpg"].Util.setCookie(this.pageMark, this.pageQuitSetHistoryParameter());
            }
        },

        /**
         * @function onFocusById
         * @param {string} id 要显示焦点元素id
         * @return {object} XEpg.My
         * @description 按所给id显示焦点，现有焦点blur，失去焦点
         * @example XEpg.My.onFocusById("area1_0");
         */
        onFocusById: function (id) {
            window["XEpg"].$(this.currentId).onBlur();
            window["XEpg"].$(id).onFocus();
            return this;
        },

        /**
         * @function pageLoadShowFocus
         * @description 页面加载完显示焦点
         * @example XEpg.My.pageLoadShowFocus();
         */
        pageLoadShowFocus: function () {
            if (this.historyId != null && window["XEpg"].$(this.historyId).isActive()) {
                this.onFocusById(this.historyId);
                this.historyId = null; //只执行一次
            } else {
                window["XEpg"].$(this.currentId).onFocus();
            }
        },

        /**
         * @function gotoPage
         * @param {string} urlStr 地址
         * @description 页面跳转
         * @example XEpg.My.gotoPage("test.htm");
         */
        gotoPage: function (urlStr) {
            var temp = urlStr.split("?");
            var url = temp[0];
            if (temp.length > 1)
                url += "?" + encodeURI(temp[1]);
            if (this.isQuitSaveCooke) {
                this.setHistory();
            }
            window.location.href = url;
        },


        /**
         * @function backPage
         * @description 页面返回
         * @example XEpg.My.backPage();
         */
        backPage: function () {
            //如果是记录URL,且有gotoBackNavigationUrl 方法,则调用该方法
            if (this.backType == 2 && typeof(window["XEpg"].Util.gotoBackNavigationUrl) == "function") {
                window["XEpg"].Util.gotoBackNavigationUrl();
            } else {
                history.back();
            }
        },


        /**
         * @function pageQuitSetHistoryUrl
         * @return {string} url完整字符串
         * @description 设置页面跳转需要保存的URL,请根据实际情况对需要保存的地址参数进行改写
         * @example XEpg.My.pageQuitSetHistoryUrl();
         * @example 改写 XEpg.My.pageQuitSetHistoryUrl=function(){return window.location.href+"pageIndex=3";};
         */
        pageQuitSetHistoryUrl: function () {
            var url = window.location.href;
            if (this.historyObj != null && typeof(this.historyObj.pageIndex) != "undefined" && this.historyObj.pageIndex > 0)
                url = window["XEpg"].Util.replaceUrlParams(url, "pageIndex", this.historyObj.pageIndex);
            return window["XEpg"].Util.replaceUrlParams(url, "historyId", this.currentId);
        },


        /**
         * @function pageQuitSetHistoryUrl
         * @return {string} url参数字符串，?后的参数内容
         * @description 设置页面跳转需要保存记录的参数,请根据实际情况对需要保存的参数进行改写，不同参数采用&分隔，与URL ？后面参数形式一样
         * @example XEpg.My.pageQuitSetHistoryUrl();
         * @example 改写 XEpg.My.pageQuitSetHistoryParameter=function(){var para = "historyId="+this.currentId;para +="&test=mytest";return para;};
         */
        pageQuitSetHistoryParameter: function () {
            var para = "historyId=" + this.currentId;
            if (this.historyObj != null && typeof(this.historyObj.pageIndex) != "undefined" && this.historyObj.pageIndex > 0)
                para += "&pageIndex=" + this.historyObj.pageIndex;
            return para;
        },
        // 解析 Url 中的参数  返回并封装成对象,当传入参数url时处理的是参数url，不传参数 处理的是 当前浏览器中的url.
        parseUrl: function (e) {
            var t, n, r, i, o, a = {};
            e = e ? e.replace(/[^\?]*\?/, "") : window.location.search.substring(1);
            var l = e.split("&");
            for (i = 0, o = l.length; o > i; i++) t = l[i], n = t.indexOf("="), -1 !== n && (r = t.substr(n + 1), r = decodeURIComponent(r), a[t.substr(0, n)] = r);
            return a
        }
    };

    //赋值让外部调用
    window["XEpg"].My = MyClass;

    /**
     * @class ScrollText
     * @constructor
     * @author suzy
     * @description 文字滚动类,该类属于EleClass拓展子类，一般只是框架内部调用，实际基本不会调用
     * @example ScrollText;
     * @since version 2.0
     */
    function ScrollText() {
        this.scrollId = ""; //文字区域ID
        this.enTextLen = 0;  //显示英文字符长度,能正常展示文字个数，1个中文代表2
        this.enSingleWidth = 10; //单个字体宽度,等于样式里的font-size/2
        this.moveSpacing = 2;   //移动间隔
        this.timeDelayScroll = 0; //延时滚动
        this.timeSpacing = 150; //滚动时间间隔
        this.directionScroll = -1;  //方向 -1 左移  1 右移
        this.setTimeScrollTextObj = null; //定时器对象
        this.setIntervalScrollTextObj = null;  //定时器对象
        this.eleObj = null; //对象
        this.realityObj = null;
        this.textEllipsisSplit = "$$"; //如果需要展示带省略号，焦点移上，整个文字滚动，例子: title="默认显示省略号焦点移上全部...$$默认显示省略号焦点移上显示全部"中间用$$分割

        /**
         * @function init
         * @param {object} EleClass对象
         * @param {object} {"enTextLen":28,"enSingleWidth":12} 对象
         * @description 文字滚动,按英文字符算，一个中文算2个英文字符,enTextLen显示区域所能显示的英文字符总长度，超过则隐藏，enSingleWidth文字大小fontSize/2,moveSpacing移动间隔，不传默认为2，timeSpacing时间间隔，不填默认为150ms
         * @example (new ScrollText()).init(XEpg.$("testDiv"),{"enTextLen":28,"enSingleWidth":12});  //简单文字滚动赋值
         * @example  (new ScrollText()).init(XEpg.$("testDiv"),{"enTextLen":28,"enSingleWidth":12,"moveSpacing":2,"timeSpacing":150});   //文字滚动赋值,自己控制速度与间隔
         */
        this.init = function (eleObj, initObj) {
            if (typeof(initObj) == "object" && initObj != null) {
                this.eleObj = eleObj;
                this.scrollId = eleObj.id;
                window["scrollText_" + this.scrollId] = this;
                for (var item in initObj) {
                    var itemObj = initObj[item];
                    if (itemObj == null || itemObj == "")
                        continue;
                    switch (item) {
                        case "enTextLen":
                            this.enTextLen = itemObj;
                            break;
                        case "enSingleWidth":
                            this.enSingleWidth = itemObj;
                            break;
                        case "moveSpacing":
                            this.moveSpacing = itemObj;
                            break;
                        case "timeSpacing":
                            this.timeSpacing = itemObj;
                            break;
                    }
                }

                if (this.scrollId.length > 0) {
                    //元素存在，再进行滚动
                    if (this.eleObj != null) {
                        this.realityObj = this.eleObj.getObj();
                        if (this.eleObj.attr("title") != null && this.eleObj.attr("title").indexOf(this.textEllipsisSplit) > -1) {
                            this.eleObj.html(this.eleObj.attr("title").split(this.textEllipsisSplit)[1]);
                        }
                        this.timeDelay();
                    }
                }
            }
        };


        /**
         * @function getStrRealLen
         * @param {string} str 字符串
         * @return {number} 字符串长度
         * @description 获取字符串真实长度,中文字符算2长度
         * @example (new ScrollText()).getStrRealLen("en中文");
         */
        this.getStrRealLen = function (str) {
            if (str == null)
                return 0;
            var len = 0;
            var strLen = str.length;
            for (var i = 0; i < strLen; i++) {
                a = str.charAt(i);
                len++;
                if (escape(a).length > 4) {//中文字符的长度经编码之后大于4
                    len++;
                }
            }
            return len;
        };


        /**
         * @function timeDelay
         * @description 定时延迟执行
         * @example (new ScrollText()).timeDelay();
         */
        this.timeDelay = function () {
            if (this.setTimeScrollTextObj != null) {
                clearTimeout(this.setTimeScrollTextObj);
            }
            this.scrollTextLen = this.getStrRealLen(this.eleObj.html());
            if (this.scrollTextLen > this.enTextLen) {
                this.scrollWidth = (this.scrollTextLen - this.enTextLen) * this.enSingleWidth;
                if (this.timeDelayScroll > 0)
                    this.setTimeScrollTextObj = setTimeout("scrollText_" + this.scrollId + ".scrollText()", this.timeDelayScroll);
                else
                    this.scrollText();
            }
        };


        /**
         * @function scrollText
         * @description 滚动文字处理
         * @example (new ScrollText()).scrollText();
         */
        this.scrollText = function () {
            if (this.setIntervalScrollTextObj)
                clearInterval(this.setIntervalScrollTextObj);
            this.setIntervalScrollTextObj = setInterval("scrollText_" + this.scrollId + ".moveScrollText()", this.timeSpacing);
        },


        /**
         * @function moveScrollText
         * @description 移动滚动文字区域
         * @example (new ScrollText()).moveScrollText();
         */
            this.moveScrollText = function () {
                var left = this.eleObj.styleAttr("left");
                if (left == null || left.length < 1)
                    left = 0;
                left = parseInt(left, 10);
                if (left < -(this.scrollWidth + 10)) {
                    this.directionScroll = 1;
                } else if (left > 3) {
                    this.directionScroll = -1;
                }
                var scrollMoveLeft = left + (this.directionScroll * this.moveSpacing);
                this.eleObj.styleAttr("left", scrollMoveLeft + "px");
            };

        /**
         * @function revert
         * @description 位置还原
         * @example (new ScrollText()).revert();
         */
        this.revert = function () {
            if (this.setIntervalScrollTextObj)
                clearInterval(this.setIntervalScrollTextObj);
            if (this.eleObj != null) {
                if (this.eleObj.attr("title") != null && this.eleObj.attr("title").indexOf(this.textEllipsisSplit) > -1) {
                    this.eleObj.html(this.eleObj.attr("title").split(this.textEllipsisSplit)[0]);
                }
                this.eleObj.styleAttr("left", "0px");
            }
            delete this.eleObj.sonScrollTextObj;
            delete window["scrollText_" + this.scrollId];
        };
    };

    //子节点文字滚动
    /**
     * @function sonScrollText
     * @param {string} setObj ScrollText初始化对象如：{"enTextLen":28,"enSingleWidth":12}
     * @return {object} EleClass对象
     * @description 实例化绑定sonScrollText
     * @example XEpg.$("testDiv").sonScrollText({"enTextLen":28,"enSingleWidth":12});
     */
    EleClass.prototype.sonScrollText = function (setObj) {
        if (!(typeof(this.sonScrollTextObj) == "object" && this.sonScrollTextObj != null)) {
            this.sonScrollTextObj = new ScrollText();
            this.sonScrollTextObj.init(this, setObj);
        }
        return this;
    };


})(window);
 /**
 * @fileOverview grid区域类
 * @author suzy
 * @version 2.0
 */
var GridArrayObj={};
var loadGridId="";
;(function(window){
	function GridClass(id){
		this.gridId=id;
		this.pageIndex=1;
		this.pageSize=1;
		this.pageTotal=0;
		this.column=1;
		this.row=1;
		this.totalCount=0;
		this.datas=[];
		this.dataIndex=0;
		this.isUserSetDatas=false;
				
		this.pageUrlFormatStr=null;
		this.dataBranchArray=null;
		this.pageTotalBranchArray=null;
		this.countBranchArray=null;
		this.requestType="ajax";
		this.itemFormatStr=null;
		this.itemAttributeArray=null;
		this.isDataReserve=true; //如果数据储备，会自动请求下一页数据备用
		
		
		this.startLeft=0;
		this.leftItemGap=0;
		this.startTop=0;
		this.topItemGap=0;
		this.scrollOrientation=3; //滚动方向，默认3 1横向horizonta , 2竖vertical , 3不滚动 整体替换
		this.showStartTop=0; //显示区域顶部起始位置
		this.showMaxTop=0; //显示区域顶部最大位置
		this.showStartLeft=0; //显示区域左边起始位置
		this.showMaxLeft=0; //显示区域左边最大位置
		

		this.loadNavCallBack=null;
		this.startIndex=0;
		this.focusIndex=0;
		this.loadEndShowFocus=false; //加载结束显示焦点
		this.isGotoPaging=false; //是否分页跳转
		
		this.isLoadDataItem=true; //是否需要加载数据
		this.requestDataPageIndex=1; //数据请求分页
		this.pageNumberFormatStr="{0}/{1}";
		this.timeLazyLoadImgObj=null; //懒加载定时对象
		this.lazyLoadImgTime=0; //懒加载时间
		this.isPageHandle=false; //是否页面处理
		
    //pageIndex={0}&pageSize={1}&callback={2} 第1个为当前页，第2个填充每页条数，第3个为回调方法(jsonp有，ajax没有)
    //分页格式化设置{"pageUrlFormatStr":"","dataBranchArray":["obj"],"pageTotalBranchArray":["pageTotal"],"countBranchArray":["total"],"requestType":"jsonp"} //requestType分为jsonp,ajax,默认ajax
		this.setPageUrlFormat=function(pageUrlObj){
			if(typeof(pageUrlObj)=="object" && pageUrlObj!=null){
				if(typeof(pageUrlObj.pageUrlFormatStr)=="string"){
					this.pageUrlFormatStr=pageUrlObj.pageUrlFormatStr;
				}
				if(typeof(pageUrlObj.dataBranchArray)=="object" && pageUrlObj.dataBranchArray!=null){
					this.dataBranchArray=pageUrlObj.dataBranchArray;
				}
				if(typeof(pageUrlObj.pageTotalBranchArray)=="object" && pageUrlObj.pageTotalBranchArray!=null){
					this.pageTotalBranchArray=pageUrlObj.pageTotalBranchArray;
				}
				if(typeof(pageUrlObj.countBranchArray)=="object" && pageUrlObj.countBranchArray!=null){
					this.countBranchArray=pageUrlObj.countBranchArray;
				}
				if(typeof(pageUrlObj.requestType)=="string"){
					this.requestType=pageUrlObj.requestType;
				}			
			}
			return this;
		};
		
		 //元素格式化设置 itemAttributeArray 要替换id，使用"id",要算左值，使用"left",要算上值，使用"top", 必须在item留一个{dataIndex} 来记录数据下标
		this.setItemFormat=function(itemFormatStr,itemAttributeArray){
			if(typeof(itemFormatStr)=="string"){
				this.itemFormatStr=itemFormatStr;
			}
			if(typeof(itemAttributeArray)=="object" && itemAttributeArray!=null){
				this.itemAttributeArray=itemAttributeArray;
			}
			return this;
		};
		
		//设置加载结束是否显示焦点
		this.setLoadEndShowFocus=function(isShowFocus){
			this.loadEndShowFocus=isShowFocus;
		};
		
		//设置一行多少列
		this.setColumn = function(column){
			if(typeof(column)=="number"){
				this.column = parseInt(column,10);
			}
			return this;
		};
		
		//设置显示区域多少行
		this.setRow = function(row){
			if(typeof(row)=="number"){
				this.row=parseInt(row,10);
			}
			return this;
		};
		
		
		//设置左位置
		this.setLeftPosition = function(startLeft,leftItemGap){
			if(typeof(startLeft)=="number"){
				this.startLeft=startLeft;
			}
			if(typeof(leftItemGap)=="number"){
				this.leftItemGap=leftItemGap;
			}
			return this;
		};
		
		//设置顶位置
		this.setTopPosition = function(startTop,topItemGap){
			if(typeof(startTop)=="number"){
				this.startTop=startTop;
			}
			if(typeof(topItemGap)=="number"){
				this.topItemGap=topItemGap;
			}
			return this;
		};
		
		//设置滚动方向 1横向，2纵向
		this.setScrollOri=function(scrollOri){
			if(typeof(scrollOri)=="number"){
				this.scrollOrientation=parseInt(scrollOri,10);
			}
			return this;
		}
		
		//设置页面
		this.setPageIndex = function(pageIndex){
			if(typeof(pageIndex)=="number"){
				this.pageIndex=parseInt(pageIndex,10);
			}
			return this;
		};
		
		//设置导航加载回调
		this.setLoadNavCallBack = function(loadNavCallBack){
			if(typeof(loadNavCallBack)=="function"){
				this.loadNavCallBack = loadNavCallBack;
			}
			return this;
		};
		
		//设置页面显示字符串,默认为 {0}/{1}
		this.setPageNumberStr = function(str){
			this.pageNumberFormatStr = str;
			return this;
		};
		
		//设置是否数据缓存
		this.setIsDataReserve = function(isDataReserve){
			if(typeof(isDataReserve)=="boolean"){
				this.isDataReserve = isDataReserve;
			}
			return this;
		};
		
		//设置数据数组
		this.setDatas = function(datas){
			if(typeof(datas)=="object" && datas.length>0){
				this.datas = datas;
				this.isUserSetDatas=true;
				loadGridId = this.gridId;
			}
			return this;
		};
		
		//设置懒加载时长
		this.setLazyLoadImgTime = function(lazyLoadImgTime){
			if(typeof(lazyLoadImgTime)=="number"){
				this.lazyLoadImgTime=lazyLoadImgTime;
			}
			return this;
		};
		
		//绑定
		this.bind=function(){
			this.pageSize = this.column*this.row;
			this.showStartTop=this.startTop; 
		  this.showMaxTop=this.startTop+(this.row-1)*this.topItemGap;
		  this.showStartLeft=this.startLeft; 
		  this.showMaxLeft=this.startLeft+(this.column-1)*this.leftItemGap;
		  //绑定就有值，表示datas手动赋值，不用再次请求,自动换算出总条数与总页数
		  if(this.datas.length>0){
		  	this.totalCount=this.datas.length;
      	this.pageTotal= Math.ceil(this.totalCount/this.pageSize);
		  }
		  return this;
		};
		
		//加载数据
		this.onLoad=function(pageIndex,pageUrlFormatStr){
			if(typeof(pageIndex)=="number"){
				this.pageIndex=pageIndex;
				this.requestDataPageIndex=pageIndex; 
			}
			if(typeof(pageUrlFormatStr)=="string"){
				//如果有地址更改，则需要重新请求数据，清理datas
				if(this.pageUrlFormatStr!=pageUrlFormatStr){
					this.datas=[];
					this.pageUrlFormatStr=pageUrlFormatStr;
				}
			}
			 //清理原有的绑定与数据
			 this.startIndex = (pageIndex-1)*this.pageSize;
			 if(this.startIndex <0){
			 	this.startIndex =0;
			 }
			 XEpg.area(this.gridId).setIdStartIndexRefreshArea(this.startIndex);
			 XEpg.$(this.gridId).html("");
			 this.startTop=this.showStartTop;
			 this.startLeft=this.showStartLeft;  
			 
			this.loadData(this.pageIndex); //加载数据
			//如果不是从第一页开始加载，需要预先加载前一页数据
			if(this.isDataReserve && this.pageIndex>1){
				setTimeout("XEpg.grid('"+this.gridId+"').dataReserve("+this.pageIndex+","+(this.pageIndex+1)+")",400);
			}
		};
		
		
		//加载数据
		this.loadData=function(loadPageIndex){
			//如果不是数字，不加载
			if(typeof(loadPageIndex)!="number")
			  return;
			 
			 this.isLoadDataItem=true; //需要加载数据
       var tempArr = this.getPageData(loadPageIndex);
       //有数据直接执行
	  	 if(tempArr.length > 0){
          this.loadInitData(tempArr);
	  	 }
		};
		
		//加载初始化数据
		this.loadInitData=function(dataArr){
			if(this.isLoadDataItem){
			 	this.isLoadDataItem=false; //执行完后，置空
			 	this.initData(dataArr);
			 	this.loadPages();
			}
		};
		
		//加载分页信息
		this.loadPages=function(){
			//分页信息展示
			if(XEpg.$(this.gridId+"_pageNumber").isActive()){
				 var str = this.stringFormat(this.pageNumberFormatStr,[this.pageIndex,this.pageTotal]);
				 XEpg.$(this.gridId+"_pageNumber").html(str);
			}
			
			 
			//显示上页箭头
			var preObj = XEpg.$(this.gridId+"_prePage").getObj();
			if(typeof(preObj)=="object" && preObj!=null){
					if(this.pageIndex>1){
						 XEpg.$(this.gridId+"_prePage").show();
					}else{
						XEpg.$(this.gridId+"_prePage").hide();
					}
		  }
		  
		  //显示下页箭头
		  var nextObj = XEpg.$(this.gridId+"_nextPage").getObj();
		  if(typeof(nextObj)=="object" && nextObj!=null){
					if(this.pageIndex<this.pageTotal){
						 XEpg.$(this.gridId+"_nextPage").show();
					}else{
						XEpg.$(this.gridId+"_nextPage").hide();
					}
		  }
		};
		
		//获取相应页面数据
		this.getPageData=function(loadPageIndex){
	 	  var tempArr=[];
	 	  var startIndex = (loadPageIndex-1)*this.pageSize;
	 	  //如果元素存在
	 	  if(!this.isExistArrayItem(this.datas,startIndex)){
	 	  	this.requestData(loadPageIndex);
	 	  }else{
	 	  	this.requestDataPageIndex = loadPageIndex; //请求数据页更新，解决分页数据未请求，加载错乱
		 	  var len = startIndex+this.pageSize;
	 	  	if(len>this.datas.length){
	 	  		 len = this.datas.length; 
	 	    }
	 	  	tempArr=this.datas.slice(startIndex,len);
	 	  }
	 	  if(this.isDataReserve){
		 	  setTimeout("XEpg.grid('"+this.gridId+"').dataReserve("+loadPageIndex+","+this.pageIndex+")",300);
		 	}
	 	  this.pageIndex = loadPageIndex; //赋值更改
	 	  return tempArr;
	 };
	 
	 this.dataReserve=function(pageIndex,currentPageIndex){
	 	  //如果是window则，跳到相应对象里去
		 	if(typeof(this.dataReserve)!="function"){
				 window["XEpg"].grid(loadGridId).dataReserve(pageIndex,currentPageIndex);
				 return;
			}
	 	 var tempPageIndex = 0;
	 	 //往前翻页
	 	 if(pageIndex<currentPageIndex){
	 	 	  tempPageIndex = pageIndex-1;	 	 	  
	 	 }else{
	 	 	  tempPageIndex = pageIndex+1;
	   }
	   var dataStartIndex = (tempPageIndex-1)*this.pageSize;
	    //清理末尾不使用数据
		  if(pageIndex<currentPageIndex){
		   	if(pageIndex+1<=this.pageTotal){
			   	 var starIndex = (pageIndex+1)*this.pageSize;
			   	 var len = this.datas.length-starIndex;
			   	 //存在则删除
			   	 if(this.isExistArrayItem(this.datas,starIndex)){
			   	 	if(!this.isUserSetDatas){
				   	 this.datas.splice(starIndex,len);
				    }
				   	 //滚动需要清理以前加载
				   	 if(this.scrollOrientation==3){
 								XEpg.area(this.gridId).clearObj(starIndex);
					   }else{
					   	 XEpg.area(this.gridId).deleteObj(starIndex,true);
					   	 var starDelIndex = (pageIndex-1)*this.pageSize;
					   	 if(starDelIndex<0)
					   	   starDelIndex = 0;
					   	 XEpg.area(this.gridId).clearObj(starDelIndex,len); //元素有清理后，必须重新装载obj
					   }
				   }
				}
		   }else if(pageIndex-3>=0){
		   	   //清理最前不使用数据
			   	 var starIndex =(pageIndex-3)*this.pageSize;
			   	 var end = starIndex+this.pageSize;
			   	 //存在则删除
			   	 if(this.isExistArrayItem(this.datas,starIndex)){
			   	 	   if(!this.isUserSetDatas){
				   	 		 var tempArr=[];
						   	 for(var i=end,len=this.datas.length;i<len;i++){
						   	 	 tempArr[i]=this.datas[i];
						   	 }
							   this.datas=tempArr;
						   }
					   	  //滚动需要清理以前加载
					   	 if(this.scrollOrientation==3){
					   	 	 XEpg.area(this.gridId).clearObj(starIndex);
					   	 }else{
						   	 XEpg.area(this.gridId).deleteObj(starIndex,true);
						   	 XEpg.area(this.gridId).clearObj(end,this.datas.length-end); //元素有清理后，必须重新装载obj
						   }
			   	 }
		   }
		   //数据不存在，再进行数据请求
		   if(tempPageIndex>0 && tempPageIndex<=this.pageTotal && !this.isExistArrayItem(this.datas,dataStartIndex)){
			   this.requestData(tempPageIndex);
			 }else if(this.isUserSetDatas && this.scrollOrientation!=3){
			 	  this.requestDataPageIndex = tempPageIndex;
			 	  var len = dataStartIndex+this.pageSize;
		 	  	if(len>this.datas.length){
		 	  		 len = this.datas.length; 
		 	    }
		 	  	var tempArr=this.datas.slice(dataStartIndex,len);
		 	  	this.isLoadDataItem = true;
	  	 	  this.loadInitData(tempArr);
			 }
	 };
	 
	 	 //增加数组元素
	 this.addDataItem=function(pageIndex,dataArr){
	 	 //数组赋值
	   var starIndex = (pageIndex-1)*this.pageSize;
	   for(var i=0,len=dataArr.length;i<len;i++){
	   	 this.datas[starIndex+i] = dataArr[i];
	   }
	 }
	 
	 //是否存在数组元素
	 this.isExistArrayItem=function(arr,index){
		  if(typeof(arr[index])!="undefined" && arr[index]!=null){
		  	return true;
		  }else{
		  	return false;
		  }
	  };
		

		//请求数据
		this.requestData=function(pageIndex){
			loadGridId = this.gridId; //记录请求grid
			this.requestDataPageIndex = pageIndex;
			var requestUrl = "";
			if(this.requestType=="jsonp"){
				requestUrl = this.stringFormat(this.pageUrlFormatStr,[pageIndex,this.pageSize,"XEpg.grid('"+this.gridId+"').requestDataCallBack"]);
				XEpg.Util.createJsonp("jsonpRequestData",requestUrl);
			}else{
				requestUrl = this.stringFormat(this.pageUrlFormatStr,[pageIndex,this.pageSize]);
				//同步获取数据
				var tempDatas=XEpg.Util.ajaxGet(requestUrl);
				this.requestDataCallBack(tempDatas);
				//异步获取数据
				//XEpg.Util.ajaxGet(requestUrl,XEpg.grid(this.gridId).requestDataCallBack);
			}
		};
		
		//数据请求回调
		this.requestDataCallBack=function(dataObj){
			if(this.requestType=="jsonp"){
				 XEpg.Util.deleteJsonp("jsonpRequestData");
			}
			var obj = dataObj;
			if(typeof(dataObj)=="string"){
				try{
					eval("obj="+dataObj);
				}catch(e){
					obj=null;
				}
			}
			if(typeof(obj)=="object" && obj !=null){
					if(typeof(this.dataHandle)=="function"){
						 this.dataHandle(obj);
					}else{
						 window["XEpg"].grid(loadGridId).dataHandle(obj);
					}
			}
		};
		
		//数据处理
		this.dataHandle=function(obj){
				this.setPageValue(obj);
				this.setAddDatas(obj);
		};
		
		//设置页面值
		this.setPageValue=function(dataObj){
			//总页数赋值,只赋一次值
      if(this.pageTotalBranchArray!=null && this.pageTotal==0 && this.pageTotalBranchArray.length>0){
      	this.pageTotal=parseInt(this.getBrachArrayValue(dataObj,this.pageTotalBranchArray));      	
      }
      //总条数赋值,只赋一次值
      if(this.countBranchArray!=null && this.totalCount==0 && this.countBranchArray.length>0){
      	this.totalCount=parseInt(this.getBrachArrayValue(dataObj,this.countBranchArray));
      	//假如没有总页数，自己换算
      	if(this.pageTotal==0 && this.totalCount>0){
      		this.pageTotal= Math.ceil(this.totalCount/this.pageSize);
      	}      	
      }
      
		};
		
		//设置数据值
		this.setAddDatas=function(dataObj){
			var tempObj= dataObj;
			if(this.dataBranchArray!=null  && this.dataBranchArray.length>0){
			  tempObj=this.getBrachArrayValue(dataObj,this.dataBranchArray);
			} 
			//如果对象不存在，则不处理
			if(!(typeof(tempObj)=="object" && tempObj!=null && tempObj.length>0)){
				return;
			}

      //增加数组数据
	    this.addDataItem(this.requestDataPageIndex,tempObj);
	     //如果有需要加载数据，且没加载，是异步执行，则继续加载
	  	 if(this.isLoadDataItem){
	        this.loadInitData(tempObj);
	  	 }else if(this.scrollOrientation!=3){
	  	 	  this.isLoadDataItem = true;
	  	 	  this.loadInitData(tempObj);
	  	 }
		}
		
		
		//区域边界改写
		this.areaOut=function(tempStartIndex){
		  if(this.scrollOrientation==1){
		  	for(var i=0;i<this.row;i++){
		  	  var leftIndex = tempStartIndex+i*this.column;
		  	  var rightIndex = leftIndex+this.column-1;
		  	  XEpg.$(this.gridId+"_"+leftIndex).left({"func":XEpg.grid(this.gridId).timePreviousPage});
		  	  XEpg.$(this.gridId+"_"+rightIndex).right({"func":XEpg.grid(this.gridId).timeNextPage});
		    }
			}else{
				for(var i=0;i<this.column;i++){
		  	  var topIndex = tempStartIndex+i;
		  	  var downIndex = topIndex+(this.column*(this.row-1));
		  	  XEpg.$(this.gridId+"_"+topIndex).up({"func":XEpg.grid(this.gridId).timePreviousPage});
		  	  XEpg.$(this.gridId+"_"+downIndex).down({"func":XEpg.grid(this.gridId).timeNextPage});
		    }
			}
			//非整体换，移动焦点，去滚动
			if(this.scrollOrientation!=3){				
				var tempFocusStr = XEpg.Util.objectToStr(XEpg.area(this.gridId).subFocusEventObj);
				//没有设置移动方法
				if(tempFocusStr.indexOf("moveItem")==-1){		
					XEpg.area(this.gridId).subFocusEventObj.push({"func":XEpg.grid(this.gridId).moveItem});
				}				
			}
			
		}
		
				
		//初始化数据
		this.initData=function(dataObj){
			var tempObj= dataObj;
			this.startIndex = (this.pageIndex-1)*this.pageSize; //起始下标赋值
			var tempStartIndex = (this.requestDataPageIndex-1)*this.pageSize; //起始下标赋值
			var clearCount = this.pageSize;
			if(this.scrollOrientation!=3){
				clearCount=this.datas.length;
		  }

			//如果元素不存在，加载列表
	 		if(XEpg.$(this.gridId+"_"+tempStartIndex).clearObj().getObj()==null){
		 		this.loadDataList(tempObj);
		 		 XEpg.area(this.gridId).setIdStartIndexRefreshArea(tempStartIndex);
		 		 if(this.scrollOrientation!=3){
					 //清理起始下标
					 var tempIndex = (this.pageIndex-2)*this.pageSize; //起始下标赋值
					 if(tempIndex<0)
					   tempIndex =0;
					  XEpg.area(this.gridId).clearObj(tempIndex,clearCount); //内容重新加载后，必须重新装载obj
					}
				 //边界改写
				 this.areaOut(tempStartIndex);
		 	}
 		 if(this.scrollOrientation!=3){
		 	 XEpg.area(this.gridId).setStartIndex(this.startIndex); //加载完，重新赋值，防止滚动加载，把起始id变成下一页起始位置
		 }
		 //如果超出最大值，则用最大值
		 if(this.focusIndex>(this.datas.length-1)){
		   this.focusIndex = this.datas.length-1;
		 }else if(this.focusIndex<0){
		 	 this.focusIndex=0;
		 }
		  //加载结束显示焦点
		 if(this.isGotoPaging){
		 	 this.loadFocusItem();
		 	 this.isGotoPaging=false;
		 	 if(this.scrollOrientation!=3){
			 	 this.moveItem() //滚动
			 }
		 }		 
      //如果有回调函数，加载完执行回调
			if(typeof(this.loadNavCallBack)=="function" && this.pageIndex==this.requestDataPageIndex){
			 		this.loadNavCallBack(this.gridId+"_"+this.focusIndex);
			} 
			
			
			//如果当前页，且需要懒加载图片
			if(this.lazyLoadImgTime>0){
			  if(this.timeLazyLoadImgObj!=null){
			  	clearTimeout(this.timeLazyLoadImgObj);
			  }
			  this.timeLazyLoadImgObj = setTimeout("XEpg.grid('"+this.gridId+"').lazyLoadImg("+this.pageIndex+","+this.requestDataPageIndex+")",this.lazyLoadImgTime); //700mS后加载
			}
			
		};
		
		//图片懒加载
    this.lazyLoadImg=function(pageIndex,requestPageIndex){
    	if(typeof(this.lazyLoadImg)!="function")
				return window["XEpg"].grid(loadGridId).lazyLoadImg();
		  var startIndex = (pageIndex-1)*this.pageSize; //起始下标赋值
		  var len = startIndex+this.pageSize;
 	  	this.lazyLoadImgHandle(startIndex,len);
			
			//有滚动，加载离开图片页，防止太快，图片未加载
			if(this.scrollOrientation==3){
				return;
			}
			var preStartIndex = startIndex;
			//上页翻
			if(pageIndex>requestPageIndex){
				if(pageIndex-1>=0){
					preStartIndex -= this.pageSize;
				}
			}else{ //下页翻
				if(pageIndex+1<=this.pageTotal){
					preStartIndex += this.pageSize;
				}else{//边界反转
					preStartIndex -= this.pageSize;
				}
			}
			
			if(preStartIndex!=startIndex){
				len = preStartIndex+this.pageSize;
				this.lazyLoadImgHandle(preStartIndex,len);
			}
		};
		
		this.lazyLoadImgHandle=function(startIndex,len){
			if(startIndex<0){
				startIndex =0;
			}
			//不需要懒加载，或已经加载过，直接跳出
		  if(XEpg.$(this.gridId+"_"+startIndex+"_img").clearObj().attr("src")==XEpg.$(this.gridId+"_"+startIndex+"_img").attr("title") || XEpg.$(this.gridId+"_"+startIndex+"_img").attr("title").indexOf(".")==-1){
		  	return;
		  }

 	  	if(len>this.totalCount){
 	  		 len = this.totalCount; 
 	    }
 	    for(var i=startIndex;i<len;i++){
				 	XEpg.$(this.gridId+"_"+i+"_img").clearObj().attr("src",XEpg.$(this.gridId+"_"+i+"_img").attr("title"));
			}
		};
		
		//加载焦点显示
		this.loadFocusItem = function(){
			 XEpg.My.onFocusById(this.gridId+"_"+this.focusIndex); 
		};
		
		//元素滑动
		this.moveItem = function(){
			if(typeof(this.moveItem)!="function")
				return window["XEpg"].grid(loadGridId).moveItem();
			//滚动
			if(this.scrollOrientation==1){
				this.moveItemHorizonta();
			}else if(this.scrollOrientation==2){
				this.moveItemVertical();
			}
		};
		
		//元素横向滑动
		this.moveItemHorizonta = function(){
			var currentValue=XEpg.$(XEpg.My.currentId).styleAttrNumber("left");			
			//如果在可视区域里，不滚动
			if(currentValue>=this.showStartLeft && currentValue<=this.showMaxLeft){
				return;
			}
			var addLeftItemGap = 0;
			//需要加，下移
			if(currentValue<this.startTop){
				 addLeftItemGap = this.leftItemGap;
			}else{
				 addLeftItemGap = -this.leftItemGap;
			}
			var startItemIndex = (this.pageIndex-2)*this.pageSize;
			//元素不存在
			if(XEpg.$(this.gridId+"_"+startItemIndex).getObj()==null){
				startItemIndex = (this.pageIndex-1)*this.pageSize;
			}
			var endItemIndex = (this.pageIndex+1)*this.pageSize-1;
			if(endItemIndex>=this.totalCount){
				endItemIndex=this.totalCount-1;
			}
			//元素不存在
			if(XEpg.$(this.gridId+"_"+endItemIndex).getObj()==null){
				endItemIndex = this.pageIndex*this.pageSize;
			}
			for(var i=startItemIndex;i<=endItemIndex;i++){
				XEpg.$(this.gridId+"_"+i).styleAttrNumber("left",XEpg.$(this.gridId+"_"+i).styleAttrNumber("left")+addLeftItemGap);   
			}
			this.startLeft += addLeftItemGap; //移动后，需要值跟进			
		};
		
		//纵向元素滑动
		this.moveItemVertical = function(){
			var currentValue=XEpg.$(XEpg.My.currentId).styleAttrNumber("top");
			//如果在可视区域里，不滚动
			if(currentValue>=this.showStartTop && currentValue<=this.showMaxTop){
				return;
			}
			var addTopItemGap = 0;
			//需要加，下移
			if(currentValue<this.showStartTop){
				 addTopItemGap = this.topItemGap;
			}else{
				 addTopItemGap = -this.topItemGap;
			}
			var startItemIndex = (this.pageIndex-2)*this.pageSize;
			//元素不存在
			if(XEpg.$(this.gridId+"_"+startItemIndex).getObj()==null){
				startItemIndex = (this.pageIndex-1)*this.pageSize;
			}
			var endItemIndex = (this.pageIndex+1)*this.pageSize-1; //this.datas.length-1;
			if(endItemIndex>=this.totalCount){
				endItemIndex=this.totalCount-1;
			}
			//元素不存在
			if(XEpg.$(this.gridId+"_"+endItemIndex).getObj()==null){
				endItemIndex = this.pageIndex*this.pageSize;
			}
			this.startTop += addTopItemGap; //新位置
		
			for(var i=startItemIndex;i<=endItemIndex;i++){
				var tempTop = this.startTop+Math.floor(i/this.column)*this.topItemGap;
				XEpg.$(this.gridId+"_"+i).styleAttrNumber("top",tempTop);
			}

		};
		
	
		//加载数据列表
		this.loadDataList=function(dataObj){
			 if(typeof(dataObj)=="object" && dataObj!=null && dataObj.length>0 ){
			 	 var strs="";
			 	 var tempStartIndex = (this.requestDataPageIndex-1)*this.pageSize;
			 	 for(var i=0,len=dataObj.length;i<len;i++){
			 	 	 var tempIndex = tempStartIndex+i;
			 	   var leftVal = 0;
			 	   var topVal = 0;
			 	   var topIndex = i;
			 	   if(this.scrollOrientation!=3){
			 	   	  topIndex = tempIndex;
			 	   }
			 	   //如果纵向，需要计算
			 	   if(this.scrollOrientation==1){
			 	   	 leftVal = this.startLeft+tempIndex*this.leftItemGap;
			 	     topVal = this.startTop;
			 	   }else{
			 	   		leftVal = this.startLeft+(i%this.column)*this.leftItemGap;
			 	      topVal = this.startTop+Math.floor(topIndex/this.column)*this.topItemGap;
			 	   }
			 	 	 strs += this.getDataItemStr(dataObj[i],tempIndex,leftVal,topVal,tempIndex); 
			 	 }
			 	 if(this.scrollOrientation==3){
			 	 		XEpg.$(this.gridId).html(strs);
			 	 }else{
			 	 	  XEpg.$(this.gridId).addHtml(strs);
			 	 }
			 }
		};
		
		//加载数据元素
		this.loadDataItem=function(leftVal,topVal){
			 if(this.dataIndex<this.datas.length){
			 	 var idStr = this.itemIds[this.itemIdIndex];
			 	 //横向，单个添加
			 	 if(this.scrollOrientation==1){
				 	 //删除原页面节点
				 	 XEpg.$(idStr).deleteObj();
			     var i = XEpg.My.getIdIndex(idStr);
				 	 var itemStr = this.getDataItemStr(this.datas[this.dataIndex],i,leftVal,topVal,this.dataIndex);	
				 	 XEpg.$(this.gridId).addHtml(itemStr);				 	 
				 }else if(this.scrollOrientation==2){ 
				 	 var len = this.column;
				 	 if(this.dataIndex+this.column >this.datas.length){
				 	 	 len = this.datas.length-this.dataIndex;
				   }
				   var idIndex = XEpg.My.getIdIndex(idStr);
				   var strs="";
				   //纵向，一排加载
				   for(var i=0;i<len;i++){
				   	 var idIndex = idIndex+i;
				   	 var tempId = this.gridId+"_"+idIndex;
				   	 XEpg.$(tempId).deleteObj();
				   	 strs += this.getDataItemStr(this.datas[this.dataIndex+i],idIndex,leftVal+i*this.leftItemGap,topVal,this.dataIndex+i); 
				   }
				   XEpg.$(this.gridId).html(strs);
				 }
				 this.navClear(); //绑定清理
				 this.loadDataItemNavInit(this.dataIndex);
				 //执行滚动，需要在元素填充后再滚动
				 if(typeof(this.directionScroll)=="function"){
				 		this.directionScroll(true);
				 }
			 }
		};
				
		//加载元素重新初始化
		this.loadDataItemNavInit=function(dataIndex){
				 //横向，单个添加
			 	 if(this.scrollOrientation==1){
						this.loadDataItemNavInitHorizontal(dataIndex);
			 	 }else if(this.scrollOrientation==2){ //竖向多个填充
			 	 	 this.loadDataItemNavInitVertical(dataIndex);
			 	 }
		};
		
		
		//获取数据元素加载字符串
		this.getDataItemStr = function(dataObj,i,leftVal,topVal,dataIndex){
			if(this.datas.length>0 && i<this.datas.length){
				var attrArray=this.getAttributeArrayValue(dataObj,this.itemAttributeArray,i,leftVal,topVal,dataIndex);
				//如果有数据，则替换好后返回用户
				if(attrArray.length>0 && this.itemFormatStr!=null){
					return this.stringFormat(this.itemFormatStr,attrArray);
				}
			}
			return "";
		}
		
		//获取分支数据
		this.getBrachArrayValue=function(dataObj,branchArray){
			if(branchArray!=null && branchArray.length>0){
      	var tempObj = dataObj;
      	for(var i=0,len=branchArray.length;i<len;i++){
      		//分支数组是有层级的，所以需要循环替换
      		tempObj = tempObj[branchArray[i]];
      	}
      	return  tempObj;    	
      }
      return null;
		};
		
		//获取属性数据
		this.getAttributeArrayValue=function(dataObj,attributeArray,i,leftVal,topVal,dataIndex){
      var attrArray=[];
			if(typeof(dataObj)=="object" && dataObj!=null && attributeArray!=null && attributeArray.length>0){
      	for(var j=0,len=attributeArray.length;j<len;j++){
      		var attrKey=attributeArray[j];
      		if(attrKey=="id"){
	      		attrArray.push(this.gridId+"_"+i);
	      	}else if(attrKey=="left"){
	      		attrArray.push(leftVal);
	      	}else if(attrKey=="top"){
	      		attrArray.push(topVal);
	      	}else if(attrKey=="dataIndex"){
	      		attrArray.push(dataIndex);
	      	}else{
	      		attrArray.push(dataObj[attrKey]);
	      	}
      	}   	
      }
      return attrArray;
		};
	  
				
		//获取数据下标
		this.getDataIndex = function(pid){
			var dataIndex =  XEpg.$(pid).attr("dataIndex");
			if(dataIndex!=null && dataIndex!=""){
	  		dataIndex = parseInt(dataIndex);
	  	}else{
	  		dataIndex = -1;
	  	}
	  	return dataIndex;
		}
		
		
		//字符串格式化
		this.stringFormat=function(formatStr,parametersArray) {
	      if(typeof(formatStr)=="string" && typeof(parametersArray)=="object" && parametersArray!=null &&  parametersArray.length > 0){
		       for (var i = 0,len=parametersArray.length; i < len; i++) {
		           var re = new RegExp('\\{' + i + '\\}','gm');
		           formatStr = formatStr.replace(re,parametersArray[i]);
		       }
		       return formatStr;
	      }else{
	      	return null;
	      }
     };
     
     //延时上页
     this.timePreviousPage=function(){
     	if(typeof(this.timePreviousPage)!="function")
				return window["XEpg"].grid(loadGridId).timePreviousPage();
     	 //延时调用上页，防止过快，跳页问题
     	 if(!this.isPageHandle){
     	 	this.isPageHandle=true;	
     	 	setTimeout('window["XEpg"].grid(loadGridId).previousPage()',400);
     	 }
     };
     
     //延时下页
     this.timeNextPage=function(){
     	 if(typeof(this.timePreviousPage)!="function")
				return window["XEpg"].grid(loadGridId).timeNextPage();
     	 //延时调用下页，防止过快，跳页问题
     	 if(!this.isPageHandle){
     	 	this.isPageHandle=true;
     	 	setTimeout('window["XEpg"].grid(loadGridId).nextPage()',400);
     	 }
     };
     
     
     //上页
    this.previousPage=function(){
    	if(typeof(this.previousPage)!="function")
				return window["XEpg"].grid(loadGridId).previousPage();
    	if(!this.isGotoPaging && this.pageIndex-1>0){
    		//this.pageIndex--;
    		this.focusIndex=XEpg.My.getIdIndex();
    		if(this.scrollOrientation==1){
	    		this.focusIndex -= 1;
	    	}else{
	    		this.focusIndex -= this.column;
	    	}
	    	this.isGotoPaging=true;
	    	if(this.lazyLoadImgTime>0 && this.timeLazyLoadImgObj!=null){
			  	clearTimeout(this.timeLazyLoadImgObj);
			  }
    		this.loadData(this.pageIndex-1);
    	}
    	this.isPageHandle=false;	
    };
    
    //下页
    this.nextPage=function(){
    	if(typeof(this.nextPage)!="function")
				return window["XEpg"].grid(loadGridId).nextPage();
     	if(!this.isGotoPaging && this.pageIndex+1<=this.pageTotal){
    		//this.pageIndex++;
    		this.focusIndex=XEpg.My.getIdIndex();
    		if(this.scrollOrientation==1){
	    		this.focusIndex += 1;
	    	}else{
	    		this.focusIndex += this.column;
	    	}
	    	this.isGotoPaging=true;
	    	if(this.lazyLoadImgTime>0 && this.timeLazyLoadImgObj!=null){
			  	clearTimeout(this.timeLazyLoadImgObj);
			  }
    		this.loadData(this.pageIndex+1);
    	}
    	this.isPageHandle=false;	   	
    };
		
		//删除
		this.deleteObj=function(){
			GridArrayObj[this.gridId]=null;
		};						
						
	};

	
	//获取grid对象
	function getGridObj(id){
		if(!(typeof(GridArrayObj[id])=="object" && GridArrayObj[id]!=null)){
			GridArrayObj[id]= new GridClass(id);
		}
		return GridArrayObj[id];
	}
	
	//如果Epg类没有创建
	if(!(typeof(window["XEpg"])=="object" && window["XEpg"]!=null)){
		window["XEpg"]={};
	}
	
	window["XEpg"].Grid = GridClass;
	window["XEpg"].grid = getGridObj;

})(window);
/**
 * @fileOverview 导航类
 * @author suzy
 * @version 2.0
 */

;(function(window){
	 /**
		* @class NavObj
		* @constructor
		* @author suzy
		* @description 导航类
		* @example UtilObj;
		* @since version 2.0
		*/
	var NavObj = {
		isOnkeypress:false,
		isOnkeydown:false,

		/**
		 * @function keyBind
		 * @description 键值绑定
		 * @example XEpg.Nav.keyBind();
		 */
		keyBind:function() {
				window.document.onkeydown = window["XEpg"].Nav.onkeydownKeyEvent;
			  window.document.onkeypress = window["XEpg"].Nav.onkeypressKeyEvent;
		},
		

		/**
		 * @function onkeypressKeyEvent
		 * @param {object} event 按键事件
		 * @description 按键按下松开处理
		 * @example window.document.onkeypress = window["XEpg"].Nav.onkeypressKeyEvent;
		 */
		onkeypressKeyEvent:function(event) {
			var obj = window["XEpg"].Nav;
			//如果执行了onkeypress则不再执行onkeydown
			if(obj.isOnkeydown){
				obj.isOnkeydown = false; //用过一次后，需要还原
			  return;
			}if(!obj.isOnkeypress){
			  obj.isOnkeypress=true;
			}
			var keyCode = event.which ? event.which: event.keyCode;
			obj.keyHandle(keyCode);
			if(keyCode==340) //禁止华数ipanel盒子自动返回
				return 0;  //兼容ipannel 返回
		},
		
		/**
		 * @function onkeydownKeyEvent
		 * @param {object} event 按键事件
		 * @description 按键按下处理
		 * @example window.document.onkeydown = window["XEpg"].Nav.onkeydownKeyEvent;
		 */
		onkeydownKeyEvent:function(event) {
			var obj = window["XEpg"].Nav;
			//如果执行了onkeypress则不再执行onkeydown
			if(obj.isOnkeypress){
			 obj.isOnkeypress=false; //用过一次后，需要还原，防止烽火盒子确定键只发一个
			 return;
			}if(!obj.isOnkeydown){
			  obj.isOnkeydown=true;
			}
			var keyCode = event.which ? event.which: event.keyCode;
			obj.keyHandle(keyCode);
			if(keyCode==1 || keyCode==2 || keyCode==3 || keyCode==4 || keyCode==340) //禁止华数ipanel盒子自动返回,上，下，左,右执行
				return 0;  //兼容ipannel 返回
		},
		
		/**
		 * @function keyHandle
		 * @param {number} keyCode 按键键值
		 * @description 键值处理
		 * @example  XEpg.Nav.keyHandle(37);
		 */
		keyHandle:function(keyCode){
			var KEY_BACK=8,KEY_OK=13,KEY_LEFT=37,KEY_UP=38,KEY_RIGHT=39,KEY_DOWN=40,KEY_PAGEUP=33,KEY_PAGEDOWN=34,KEY_0=48,KEY_1=49,KEY_2=50,KEY_3=51,KEY_4=52,KEY_5=53,KEY_6=54,KEY_7=55,KEY_8=56,KEY_9=57,KEY_VOLUP=259,KEY_VOLDOWN=260,KEY_VOLOVER=261,KEY_DEL=46; //del海信键值
			switch(keyCode) {
				case KEY_0:
				case KEY_1:
				case KEY_2:
				case KEY_3:
				case KEY_4:
				case KEY_5:
				case KEY_6:
				case KEY_7:
				case KEY_8:
				case KEY_9:
					this.key_number_event(keyCode-48);
					break;
				case 1:  //ipannel 
				case KEY_UP:
					this.key_up_event();
					break;
				case 2:  //ipannel 
				case KEY_DOWN:
					this.key_down_event();
					break;
				case 3:  //ipannel 
				case 37: 
				case KEY_LEFT:
					this.key_left_event();
					break;
				case 4:  //ipannel 
				case 39: 
				case KEY_RIGHT:
					this.key_right_event();
					break;
				case KEY_OK:
					this.key_ok_event();
					break;
				case 32: //空格键
				case 45: //兼容云平台
				case 340: //ipannel 返回
				case 1249: //兼容烽火盒子
				case KEY_BACK:
					this.key_back_event();
					break;
				case KEY_PAGEUP:
					this.key_pageUp_event();
					break;
				case KEY_PAGEDOWN:
					this.key_pageDown_event();
					break;
				case KEY_DEL:
					this.key_del_event();
					break;
				case 259:
				case KEY_VOLUP:
					this.key_volUp_event();
					break;
				case 260:
				case KEY_VOLDOWN:
					this.key_volDown_event();
					break;
				case KEY_VOLOVER:
					this.key_volOver_event();
					break;
				default:
					this.key_default_event(keyCode);
				  break;
			}
		},
		
	 	/**
		 * @function key_default_event
		 * @description 键值默认处理，不在case处理中的其他键值
		 * @example  XEpg.Nav.key_default_event();
		 */	
	 key_default_event:function(){},
	 	 /**
		 * @function key_number_event
		 * @param {number} num 数字键值
		 * @description 数字键处理
		 * @example  XEpg.Nav.key_number_event(49);
		 */	
	 key_number_event:function(num){},
	 	 	/**
		 * @function key_up_event
		 * @description 上键事件处理
		 * @example  XEpg.Nav.key_up_event();
		 */	
	 key_up_event:function(){this.key_up_opt();},
	 	 	/**
		 * @function key_down_event
		 * @description 下键事件处理
		 * @example  XEpg.Nav.key_down_event();
		 */	
	 key_down_event:function(){this.key_down_opt();},
	 	 	/**
		 * @function key_left_event
		 * @description 左键事件处理
		 * @example  XEpg.Nav.key_left_event();
		 */	
	 key_left_event:function(){this.key_left_opt();},
	 	 	/**
		 * @function key_right_event
		 * @description 右键事件处理
		 * @example  XEpg.Nav.key_right_event();
		 */	
	 key_right_event:function(){this.key_right_opt();},
	 	 	/**
		 * @function key_ok_event
		 * @description 确认OK键事件处理
		 * @example  XEpg.Nav.key_ok_event();
		 */	
	 key_ok_event:function(){this.key_click_opt();},
	 	 	/**
		 * @function key_back_event
		 * @description  返回键事件处理
		 * @example  XEpg.Nav.key_back_event();
		 */	
	 key_back_event:function(){this.key_back_opt();},
	 	 	/**
		 * @function key_pageUp_event
		 * @description 上页键事件处理
		 * @example  XEpg.Nav.key_pageUp_event();
		 */	
	 key_pageUp_event:function(){},
	 	 	/**
		 * @function key_pageDown_event
		 * @description 下页键事件处理
		 * @example  XEpg.Nav.key_pageDown_event();
		 */	
	 key_pageDown_event:function(){},
	 	 	/**
		 * @function key_del_event
		 * @description 删除键事件处理
		 * @example  XEpg.Nav.key_del_event();
		 */	
	 key_del_event:function(){},
	 

		keyPageUpTimeObj:null,
		/**
		 * @function timeKeyPageUp
		 * @description 延时500毫秒上页键事件处理，防止过快跳页
		 * @example  XEpg.Nav.timeKeyPageUp();
		 */	
		timeKeyPageUp:function(){
		   if(this.keyPageUpTimeObj!=null)
		     clearTimeout(this.keyPageUpTimeObj);
		   this.keyPageUpTimeObj=setTimeout(window["XEpg"].nav.key_pageUp_event,500);  
		},
				

		keyPageDownTimeObj:null,
		/**
		 * @function timeKeyPageDown
		 * @description 延时500毫秒下页键事件处理，防止过快跳页
		 * @example  XEpg.Nav.timeKeyPageDown();
		 */	
		timeKeyPageDown:function(){
		   if(this.keyPageDownTimeObj!=null)
		     clearTimeout(this.keyPageDownTimeObj);
		   this.keyPageDownTimeObj=setTimeout(window["XEpg"].nav.key_pageDown_event,500);  
		},
			
	 	/**
		 * @function key_up_opt
		 * @description 上键处理
		 * @example  XEpg.Nav.key_up_opt();
		 */	
		key_up_opt:function(){		
			if(window["XEpg"].My.currentId !=null)
				window["XEpg"].$(window["XEpg"].My.currentId).onUp();
		},
		
	 	/**
		 * @function key_down_opt
		 * @description 下键处理
		 * @example  XEpg.Nav.key_down_opt();
		 */	
		key_down_opt:function(){
			if(window["XEpg"].My.currentId !=null)
				window["XEpg"].$(window["XEpg"].My.currentId).onDown();
		},
		
	 	/**
		 * @function key_left_opt
		 * @description 左键处理
		 * @example  XEpg.Nav.key_left_opt();
		 */	
		key_left_opt:function(){
			if(window["XEpg"].My.currentId !=null)
				window["XEpg"].$(window["XEpg"].My.currentId).onLeft();
		},

	 	/**
		 * @function key_right_opt
		 * @description 右键处理
		 * @example  XEpg.Nav.key_right_opt();
		 */	
		key_right_opt:function(){
			if(window["XEpg"].My.currentId !=null)
				window["XEpg"].$(window["XEpg"].My.currentId).onRight();
		},
				
	 	/**
		 * @function key_click_opt
		 * @description 确定键处理
		 * @example  XEpg.Nav.key_click_opt();
		 */
		key_click_opt:function(){
			if(window["XEpg"].My.currentId !=null)
				window["XEpg"].$(window["XEpg"].My.currentId).onClick();
		},
				
	 	/**
		 * @function key_back_opt
		 * @description 返回键处理
		 * @example  XEpg.Nav.key_back_opt();
		 */
		key_back_opt:function(){
			//调用个性化的页面返回
      window["XEpg"].My.backPage();
    },
    
  };
  
	
	//如果Epg类没有创建
	if(!(typeof(window["XEpg"])=="object" && window["XEpg"]!=null)){
		window["XEpg"]={};
	}
	
	//赋值让外部调用
	window["XEpg"].Nav=NavObj;
	window["XEpg"].Nav.keyBind(); //默认绑定

})(window);
/**
 * @fileOverview 工具类
 * @author suzy
 * @version 2.0
 */
;
(function (window) {
    var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    /**
     * @function trim
     * @param {string} 需要清理空格字符串
     * @return {string} 转换完成字符串
     * @description 字符串方法拓展，清除字符串里的空格
     * @example var testStr = "test test2 ".trim();
     */
    String.prototype.trim = function () {
        return this.replace(/<\/?.+?>/g, "").replace(/[\r\n]/g, "").replace(/(^\s*)|(\s*$)/g, "");
    }


    /**
     * @function jsonTrim
     * @param {string} 需要过滤特殊字符json字符串
     * @return {string} 过滤完成字符串
     * @description 字符串方法拓展，过滤json字符串里特殊字符
     * @example var testStr = "{\"content\":\"test2 \n \r \"}".jsonTrim();
     */
    String.prototype.jsonTrim = function () {
        return this.replace(/\r/g, ' ').replace(/\n/g, ' ');
    }

    /**
     * @function replaceAll
     * @param {string} s1 被替换原始字符串
     * @param {string} s2 替换字符串
     * @return {string} 替换完毕字符串
     * @description 字符串方法拓展，批量替换字符串
     * @example var testStr = "content com".replaceAll("co","test");
     */
    String.prototype.replaceAll = function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    }

    /**
     * @class UtilObj
     * @constructor
     * @author suzy
     * @description 工具类;由于本类加入命名空间XEpg
     * @example UtilObj;
     * @since version 2.0
     */
    var UtilObj = {

        /**
         * @function createJsonp
         * @param {string} id 自动创建script的id
         * @param {string} url 请求地址
         * @description jsonp请求创建
         * @example XEpg.Util.createJsonp("jsonp1","test.htm");
         */
        createJsonp: function (id, url) {
            var eleScript = document.createElement("script");
            eleScript.type = "text/javascript";
            eleScript.id = id;
            eleScript.src = url;
            document.getElementsByTagName("HEAD")[0].appendChild(eleScript);
        },

        /**
         * @function createJsonp
         * @param {string} id 自动创建script的id
         * @description jsonp script移除，对不适用的json进行清理，减少资源占用,需要与createJsonp 一一对应
         * @example XEpg.Util.deleteJsonp("jsonp1");
         */
        deleteJsonp: function (id) {
            var tempObj = document.getElementById(id);
            document.head.removeChild(tempObj);
        },

        /**
         * @function jsonTrim
         * @param {string} str 待替换字符串
         * @description 清除字符串里的换行与回车
         * @example XEpg.Util.jsonTrim("test \n str");
         */
        jsonTrim: function (str) {
            return str.replace(/\r/g, ' ').replace(/\n/g, ' ');
        },

        /**
         * @function isArray
         * @param {object} obj 待判断对象
         * @description 判断对象是否为数组
         * @example XEpg.Util.isArray([1,2]);
         */
        isArray: function (obj) {
            var isArr = Object.prototype.toString.call(obj) === '[object Array]';
            //兼容ipanel低端盒子
            if (!isArr && obj != null) {
                isArr = obj.constructor == Array;
            }
            return isArr;
        },
        /**
         * @function argumentsToArray
         * @param {object} setObj arguments参数对象
         * @description 参数对象转数组
         * @example XEpg.Util.argumentsToArray(arguments);
         */
        argumentsToArray: function (setObj) {
            var tempArray = [];
            //如果传的是个数组，则直接数组赋值
            if (setObj.length == 1 && XEpg.Util.isArray(setObj[0])) {
                tempArray = setObj[0];
            } else {
                for (var i = 0, len = setObj.length; i < len; i++) {
                    if (typeof(setObj[i]) == "object" && setObj[i] != null) {
                        tempArray.push(setObj[i]);
                    }
                }
            }
            //如果没有参数，则为null
            if (tempArray.length == 0)
                tempArray = null;
            return tempArray;
        },

        /**
         * @function ajaxGet
         * @param {string} url ajax请求地址
         * @param {function} callBack 回调方法
         * @return {string} 返回数据
         * @description ajax get请求，如果传callBack，则异步执行，不传为同步执行，结果直接返回，由于同步会阻塞线程，使用需谨慎
         * @example XEpg.Util.ajaxGet("test.htm?p1=a&p2=b",testAjax);  function testAjax(contentStr){alert(contentStr);} 异步实例
         * @example var contentStr = XEpg.Util.ajaxGet("test.htm?p1=a&p2=b"); 同步实例
         */
        ajaxGet: function (url, callBack) {
            var xmlhttp;
            var responseText = "";
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    if (typeof(callBack) == "function")
                        callBack(window["XEpg"].Util.jsonTrim(xmlhttp.responseText)); //兼容低级盒子，不能扩展string
                }
            }
            if (typeof(callBack) == "function")
                xmlhttp.open("GET", url, true);
            else
                xmlhttp.open("GET", url, false);
            xmlhttp.send();
            return window["XEpg"].Util.jsonTrim(xmlhttp.responseText);
        },

        /**
         * @function ajaxPost
         * @param {string} url ajax请求地址
         * @param {string} content ajax请求内容
         * @param {function} callBack 回调方法
         * @return {string} 返回数据
         * @description ajax post请求，如果传callBack，则异步执行，不传为同步执行，结果直接返回，由于同步会阻塞线程，使用需谨慎
         * @example XEpg.Util.ajaxPost("test.htm","p1=a&p2=b",testAjax);  function testAjax(contentStr){alert(contentStr);} 异步实例
         * @example var contentStr = XEpg.Util.ajaxPost("test.htm","p1=a&p2=b"); 同步实例
         */
        ajaxPost: function (url, content, callBack) {
            var xmlhttp;
            var responseText = "";
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    if (typeof(callBack) == "function")
                        callBack(window["XEpg"].Util.jsonTrim(xmlhttp.responseText));
                }
            }
            if (typeof(callBack) == "function")
                xmlhttp.open("POST", url, true);
            else
                xmlhttp.open("POST", url, false);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send(content);
            return window["XEpg"].Util.jsonTrim(xmlhttp.responseText);
        },

        /**
         * @function gotoPage
         * @param {string} url 跳转地址
         * @description 页面跳转
         * @example XEpg.Util.gotoPage("test.htm");
         */
        gotoPage: function (url) {
            window.location.href = url;
        },

        /**
         * @function setCookie
         * @param {string} key 关键字，需唯一
         * @param {string} val 值
         * @description 设置cookie
         * @example XEpg.Util.setCookie("testCookie1","p1=a&p2=b");
         */
        setCookie: function (key, val) {
            var Days = 7; //此 cookie 将被保存 7 天
            var exp = new Date();    //new Date("December 31, 9998");
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = key + "=" + escape(val) + ";expires=" + exp.toGMTString() + ";path=/";
        },

        /**
         * @function getCookie
         * @param {string} key 关键字，需唯一,与setCookie对应
         * @return {string} 值
         * @description 获取cookie存储的值
         * @example XEpg.Util.getCookie("testCookie1");
         */
        getCookie: function (key) {
            var arr = null;
            if (document.cookie != null && document.cookie.length > 0)
                arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
            if (arr != null)
                return unescape(arr[2]);
            return null;
        },

        /**
         * @function delCookie
         * @param {string} key 关键字，需唯一,与setCookie对应
         * @description 删除cookie
         * @example XEpg.Util.delCookie("testCookie1");
         */
        delCookie: function (key) {
            //为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
            var date = new Date();
            date.setTime(date.getTime() - 10000);
            document.cookie = key + "=;expires=" + date.toGMTString() + ";path=/";
        },

        /**
         * @function objectToStr
         * @param {object} jsonObj json对象
         * @return {string} 字符串
         * @description json对象转换为字符串
         * @example var str = XEpg.Util.objectToStr({"id":"3","name":"test"});
         */
        objectToStr: function (jsonObj) {
            var reStr = "";
            if (jsonObj != null && typeof(jsonObj) == "object") {
                var beginStr = "{";
                var endStr = "}";
                if (this.isArray(jsonObj)) {
                    beginStr = "[";
                    endStr = "]";
                }
                for (var item in jsonObj) {
                    //JSON 对象
                    if (!(item >= 0)) {
                        reStr += "'" + item + "':";
                    }
                    var type = typeof(jsonObj[item]);
                    if (type == "number") {
                        reStr += jsonObj[item];
                    } else if (type == "object") {
                        reStr += this.objectToStr(jsonObj[item]);
                    } else {
                        reStr += "'" + jsonObj[item] + "'";
                    }
                    reStr += ",";
                }
                if (reStr.length > 0)
                    reStr = reStr.substr(0, reStr.length - 1);
                reStr = beginStr + reStr + endStr;
            }
            return reStr;
        },

        /**
         * @function getStrRealLen
         * @param {string} str 字符串
         * @return {number} 字符长度
         * @description 获取字符串真实长度,中文字符算2长度
         * @example var str = XEpg.Util.getStrRealLen("test测试");
         */
        getStrRealLen: function (str) {
            if (typeof(str) != "string" || str.length == 0)
                return 0;
            var len = 0;
            var strLen = str.length;
            for (var i = 0; i < strLen; i++) {
                a = str.charAt(i);
                len++;
                if (escape(a).length > 4) {//中文字符的长度经编码之后大于4
                    len++;
                }
            }
            return len;
        },

        /**
         * @function getSubStr
         * @param {string} str 截取前字符串
         * @param {number} len 截取长度,中文字符算2长度
         * @param {boolean} isSuffix 是否加省略号，默认不加
         * @return {string} 截取后字符串
         * @description 截取字符串,中文字符算2长度
         * @example var str = XEpg.Util.getSubStr("test测试",6); //普通截取
         * @example var str = XEpg.Util.getSubStr("test测试",6,true); //截取后面加省略号
         */
        getSubStr: function (str, len, isSuffix) {
            if (typeof(str) != "string" || str.length == 0)
                return "";
            var realLen = this.getStrRealLen(str);
            if (realLen <= len) {
                return str;
            } else {
                var str_length = 0;
                var str_cut = new String();
                var str_len = str.length;
                if (isSuffix)
                    len -= 3;
                for (var i = 0; i < str_len; i++) {
                    var a = str.charAt(i);
                    str_length++;
                    if (escape(a).length > 4) {
                        //中文字符的长度经编码之后大于4
                        str_length++;
                    }
                    str_cut = str_cut.concat(a);
                    if (str_length >= len) {
                        if (isSuffix) {
                            str_cut = str_cut.concat("...");
                        }
                        return str_cut;
                    }
                }
                //如果给定字符串小于指定长度，则返回源字符串；
                if (str_length < len)
                    return str;
            }
        },

        /**
         * @function numSupplyZero
         * @param {string} initNumStr 初始化字符串
         * @param {string} numStr 需要格式化数字
         * @return {string} 格式化后字符串
         * @description 数字前面补0
         * @example var str = XEpg.Util.numSupplyZero("112","0000"); 结果为:0112
         */
        numSupplyZero: function (initNumStr, numStr) {
            var len = initNumStr.length;
            initNumStr = numStr + initNumStr;
            return initNumStr.substring(initNumStr.length - numStr.length);
        },

        /**
         * @function getPageTotal
         * @param {number} totalNum 总条数
         * @param {number} pageSize 每页条数
         * @return {number} 总页数
         * @description 根据总条数与每页条数，计算出总页数
         * @example XEpg.Util.getPageTotal(112,10);
         */
        getPageTotal: function (totalNum, pageSize) {
            return Math.ceil(parseInt(totalNum, 10) / parseInt(pageSize, 10));
        },

        /**
         * @function getSliceList
         * @param {array} objs 列表数组
         * @param {number} pageIndex 开始页
         * @param {number} pageSize 每页条数
         * @return {array} 本页数组
         * @description 根据数组开始页与每页条数，计算出当前页数组列表
         * @example XEpg.Util.getSliceList([1,3,5,6,8,9,7],2,3);
         */
        getSliceList: function (objs, pageIndex, pageSize) {
            var tempObj = objs;
            if (objs != null && typeof(objs) == "object" && objs.length > 0) {
                pageIndex = parseInt(pageIndex, 10);
                pageSize = parseInt(pageSize, 10);
                var len = objs.length;
                if (pageIndex > 0 && pageSize > 0 && len > 0) {
                    var begin = pageSize * (pageIndex - 1);
                    if (begin < 0)
                        begin = 0;
                    var end = pageSize * pageIndex;
                    if (end > len)
                        end = len;
                    tempObj = objs.slice(begin, end);
                }
            }
            return tempObj;
        },

        /**
         * @function replaceUrlParams
         * @param {string} url 地址
         * @param {string} key url参数关键字
         * @param {string|number} value 参数值
         * @return {string} 替换后地址
         * @description 替换地址里的参数值,如果地址里没有该参数，则再末尾补参数与值
         * @example XEpg.Util.replaceUrlParams("test.htm?a=cc&b=kk","a","oo");
         */
        replaceUrlParams: function (url, key, value) {
            var index = url.indexOf(key + "=");
            if (index > -1) {
                var before = url.substring(0, index);
                var after = url.substring(index);
                index = after.indexOf("&");
                after = (index > -1) ? after.substring(index) : "";
                url = before + key + "=" + value + after;
            } else {
                url += (url.indexOf("?") > -1) ? "&" : "?";
                url += key + "=" + value;
            }
            return url;
        },


        /**
         * @function getUrlParam
         * @param {string} strname url参数关键字
         * @param {string} url 地址
         * @return {string} 参数值
         * @description 获取URL地址中的参数值
         * @example XEpg.Util.getUrlParam("a","test.htm?a=cc&b=kk");
         */
        getUrlParam: function (strname, url) {
            var hrefstr, pos, parastr, para, tempstr;
            hrefstr = window.location.href;
            if (typeof(url) != "undefined")
                hrefstr = url;
            pos = hrefstr.indexOf("?");
            //没有参数，则直接跳出
            if (pos == -1 && hrefstr.indexOf("=") == -1)
                return null;
            parastr = decodeURI(hrefstr.substring(pos + 1));
            para = parastr.split("&");
            tempstr = "";
            for (i = 0; i < para.length; i++) {
                tempstr = para[i];
                pos = tempstr.indexOf("=");
                if (tempstr.substring(0, pos) == strname) {
                    var temppath = tempstr.substring(pos + 1);
                    return temppath;
                }
            }
            return null;
        },


        /**
         * @function getUrlParameterObj
         * @param {string} url 地址
         * @return {object} 参数对象
         * @description 获取记录地址里的参数对象
         * @example XEpg.Util.getUrlParameterObj("test.htm?a=cc&b=kk");  结果为 {"a":"cc","b":"kk"}
         */
        /*getUrlParameterObj: function (url) {
            if (typeof(url) == "undefined" || url == null)
                url = window.location.href;
            var pos = url.indexOf("?");
            var obj = null;
            //没有参数，则直接跳出
            if (pos == -1 && url.indexOf("=") == -1)
                return obj;
            var parastr = decodeURI(url.substring(pos + 1));
            var para = parastr.split("&");
            obj = {};
            for (i = 0; i < para.length; i++) {
                var tempstr = para[i];
                pos = tempstr.indexOf("=");
                obj[tempstr.substring(0, pos)] = tempstr.substring(pos + 1);
            }
            return obj;
        },*/

        /**
         * @function timeFormat
         * @param {number} time 需要格式化数值,单位秒s
         * @return {string} 格式化完成字符串
         * @description 时间格式化 hh24:mi:ss
         * @example XEpg.Util.timeFormat("5700");
         */
        timeFormat: function (time) {
            var hour = parseInt(time / 3600);
            time = parseInt(time % 3600);
            var minute = parseInt(time / 60);
            time = parseInt(time % 60);
            var second = parseInt(time);

            var timeStr = "";
            if (hour < 10)
                timeStr += "0";
            timeStr += hour + ":";
            if (minute < 10)
                timeStr += "0";
            timeStr += minute + ":";
            if (second < 10)
                timeStr += "0";
            timeStr += second;
            return timeStr;
        },

        /**
         * @function addNavigationUrl
         * @param {string} url 地址
         * @description 导航地址压入数组
         * @example XEpg.Util.addNavigationUrl("test.htm?a=cc&b=kk");
         */
        addNavigationUrl: function (url) {
            var nav = this.getCookie("navRecord");
            var navUrlStr = "";
            var navUrlArray = null;
            if (nav == null || nav.length < 1) {
                navUrlArray = new Array();
            } else {
                navUrlArray = nav.split(',');
            }
            if (navUrlArray.length > 0) {
                //如果已存在地址，则不记录数组
                if (navUrlArray[navUrlArray.length - 1] == url) {
                    return;
                }
            }
            var temp = url.split("?");
            url = temp[0];
            if (temp.length > 1)
                url += "?" + encodeURI(temp[1]);
            navUrlArray.push(url);
            navUrlStr = navUrlArray.join(",");
            //this.setCookie("navRecord", navUrlStr);
        },

        /**
         * @function gotoBackNavigationUrl
         * @description 跳回前一导航页面
         * @example XEpg.Util.gotoBackNavigationUrl();
         */
        gotoBackNavigationUrl: function () {
            var nav = this.getCookie("navRecord");
            var navUrlStr = "";
            var navUrlArray = null;
            var url = "";
            if (nav != null) {
                navUrlArray = nav.split(',');
                if (navUrlArray.length > 0) {
                    url = navUrlArray.pop();
                    if (url.length < 1 && navUrlArray.length > 0)
                        url = navUrlArray.pop();
                    navUrlStr = navUrlArray.join(",");
                    //this.setCookie("navRecord", navUrlStr);
                    if (url.length > 0) {
                        window.location.href = url;
                    }
                }
            }
        },

        /**
         * @function getLastNavigationUrl
         * @return {string} 上一次访问地址字符串
         * @description 获取上一次访问地址,不清理导航记录
         * @example XEpg.Util.getLastNavigationUrl();
         */
        getLastNavigationUrl: function () {
            var url = "";
            var nav = this.getCookie("navRecord");
            if (nav != null) {
                var navUrlArray = nav.split(',');
                if (navUrlArray.length > 0) {
                    url = navUrlArray[navUrlArray.length - 1];
                }
            }
            return url;
        },

        /**
         * @function getBackNavigationUrl
         * @return {string} 上一次访问地址字符串
         * @description 获取上一次访问地址,并清理导航记录
         * @example XEpg.Util.getBackNavigationUrl();
         */
        getBackNavigationUrl: function () {
            var lastUrl = this.getLastNavigationUrl();
            var currentUrl = window.location.href;
            var reUrl = "";
            //如果同一个页面
            if (lastUrl.split("?")[0] == currentUrl.split("?")[0]) {
                reUrl = lastUrl;
                var nav = this.getCookie("navRecord");
                var navUrlArray = nav.split(',');
                navUrlArray.pop();
                var navUrlStr = navUrlArray.join(",");
                //this.setCookie("navRecord", navUrlStr);
            }
            return reUrl;
        },
        parseJSON: function( data ) {
            if ( window.JSON && window.JSON.parse ) {
                return window.JSON.parse( data + "" );
            }
            var requireNonComma,
                depth = null,
                str = UtilObj.trim( data + "" );
            //// after removing valid tokens
            return ( Function( "return " + str ) )();
            return str && !UtilObj.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {
                if ( requireNonComma && comma ) {
                    depth = 0;
                }
                if ( depth === 0 ) {
                    return token;
                }
                requireNonComma = open || comma;
                depth += !close - !open;
                return "";
            } ) ) ?
                ( Function( "return " + str ) )() :
                console.log( "Invalid JSON: " + data );
        },
        trim: function( text ) {
            return text == null ?
                "" :
                ( text + "" ).replace( rtrim, "" );
        },
        each: function( obj, callback ) {
            var length, i = 0;

            if ( obj && obj.length >= 0) {
                length = obj.length;
                for ( ; i < length; i++ ) {
                    if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                        break;
                    }
                }
            } else {
                for ( i in obj ) {
                    if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                        break;
                    }
                }
            }

            return obj;
        },
        renderTpl: function(data,tpl) {
            var res = "";
            if(data && data.length) {//数组
                var temp = [];
                this.each(data, function(i){
                    var item = data[i];
                    var s = tpl.replace(/\{\{(\w+)\}\}/g,function(all,key){
                        return item[key] || "";
                    });
                    temp.push(s);
                });
                s = temp.join("");
            } else { //对象
                res = tpl.replace(/\{\{(\w+)\}\}/g,function(all,key){
                    return data[key] || "";
                });
            }
            return res;
        }
    };

    /*分页加载*/
    var ListLoader = UtilObj.ListLoader = function(opt, reqData) {
        opt = opt || {};
        this.reqData = reqData || {};
        //this.$wraper = opt.$wraper.length >0 ? opt.$wraper : null;
        this.render = opt.render || function(){};
        this.pn = opt.pn || 1;
        this.ps = opt.ps || 10;
        this.fps = opt.fps || this.ps;
        this.len = this.fps;
        this.activeIndex = 1;
        this.reqUrl = opt.url;
        //接口总页数
        if(opt.total) {
            var left = opt.total -this.fps;
            this.pt = 1 + (left>0 ? Math.ceil(left/this.ps) : 0);
        } else {
            this.pt = 1;
        }
        this.loaded = [];
        this.cacheData = [];
        //默认第一页已经加载
        this.loaded[1] = true;
        //this._bind();
        //this.preload();
    }
    ListLoader.prototype.next = function(cb) {
        var self = this;
        self.load(self.activeIndex + 1, cb);
    }
    ListLoader.prototype.prev = function(cb) {
        var self = this;
        self.load(self.activeIndex - 1, cb);
    }
    ListLoader.prototype.load = function(page, cb) {
        var self = this;
        if(page <= self.pt && page >= 1){
            if(!self.loaded[page]) {
                self._get(page, function(data){
                    self.loaded[page] = true;
                    self.activeIndex = page;
                    self.render(data, page);
                    cb && cb(self.activeIndex);
                });
            } else {
                self.activeIndex = page;
                cb && cb(self.activeIndex);
            }
        }
    }
    ListLoader.prototype.preload = function(i, way) {
        var self = this;
        self.activeIndex = i || 1;
        way = way || 1;
        var page = self.activeIndex + way;
        if(page <= self.pt && page >= 1){
            if(!self.loaded[page]) {
                self._get(page, function(data){
                    self.loaded[page] = true;
                    self.render(data, page);
                });
            }
        }
    }
    ListLoader.prototype.setReqData = function(reqData) {
        this.reqData = reqData;
    }
    ListLoader.prototype.getLen = function(){
        return this.len;
    }
    ListLoader.prototype._get = function(page, cb) {
        var self = this;
        var reqData = {};
        if(!self.reqUrl || self.lock) {
            return;
        }
        for(var key in self.reqData){
            var value = self.reqData[key];
            if (typeof(value)=="string" && value.indexOf("$")==0){
                var thisKey = value.substr(1);
                var v = self[thisKey] || "";
                if(thisKey == "pn") {
                    v = page;
                }
                reqData[key] = v;
            } else {
                reqData[key] = value;
            }
        }
        self.lock = true;
        //$.ajax({
        //    url: self.reqUrl,
        //    type: 'get',
        //    dataType: 'json',
        //    data: reqData,
        //    success:function(res){
        //        if(res.resultcode == '0') {
        //            var list = res.result;
        //            cb && cb(list);
        //        }
        //        self.lock = false;
        //    }, //回传函数(这里是函数名)
        //    error: function () {
        //        self.lock = false;
        //    }
        //});

        var paramArray = [];
        for(var key in reqData){
            paramArray.push([key, reqData[key]].join("="));
        }
        var paramString = "?"+paramArray.join("&");
        UtilObj.ajaxGet(self.reqUrl+paramString, function(res){
            res = UtilObj.parseJSON(res);
            //var list = res.result;
             cb && cb(res);
            self.lock = false;
        });
    }

    ListLoader.prototype.getActiveIndex = function() {
        return this.activeIndex;
    }
    //如果Epg类没有创建
    if (!(typeof(window["XEpg"]) == "object" && window["XEpg"] != null)) {
        window["XEpg"] = {};
    }

    //赋值让外部调用
    window["XEpg"].Util = UtilObj;

})(window);
//封装的 js base64  encode decode   中间做了escape  和  unescape 处理
;(function(window){
    var base64 = {};
    base64.map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    base64.decode = function(s){
        s += '';
        var len = s.length;
        if((len === 0) || (len % 4 !== 0)){
            return s;
        }

        var pads = 0;
        if(s.charAt(len - 1) === base64.map[64]){
            pads++;
            if(s.charAt(len - 2) === base64.map[64]){
                pads++;
            }
            len -= 4;
        }

        var i, b, map = base64.map, x = [];
        for(i = 0; i < len; i += 4){
            b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i + 1)) << 12) | (map.indexOf(s.charAt(i + 2)) << 6) | map.indexOf(s.charAt(i + 3));
            x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff, b & 0xff));
        }

        switch(pads){
            case 1:
                b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i)) << 12) | (map.indexOf(s.charAt(i)) << 6);
                x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff));
                break;
            case 2:
                b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i)) << 12);
                x.push(String.fromCharCode(b >> 16));
                break;
        }
        return unescape(x.join(''));
    };

    base64.encode = function(s){
        if(!s){
            return;
        }

        s += '';
        if(s.length === 0){
            return s;
        }
        s = escape(s);

        var i, b, x = [], map = base64.map, padchar = map[64];
        var len = s.length - s.length % 3;

        for(i = 0; i < len; i += 3){
            b = (s.charCodeAt(i) << 16) | (s.charCodeAt(i+1) << 8) | s.charCodeAt(i+2);
            x.push(map.charAt(b >> 18));
            x.push(map.charAt((b >> 12) & 0x3f));
            x.push(map.charAt((b >> 6) & 0x3f));
            x.push(map.charAt(b & 0x3f));
        }

        switch(s.length - len){
            case 1:
                b = s.charCodeAt(i) << 16;
                x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + padchar + padchar);
                break;
            case 2:
                b = (s.charCodeAt(i) << 16) | (s.charCodeAt(i + 1) << 8);
                x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + map.charAt((b >> 6) & 0x3f) + padchar);
                break;
        }
        return x.join('');
    };

    window.base64 = base64;
})(window);

;(function(window){
    /** MD5 加密处理   开始*/
    var hex_chr = "0123456789abcdef";
    function rhex(num) {
        str = "";
        for (j = 0; j <= 3; j++) {
            str += hex_chr.charAt((num >> (j * 8 + 4)) & 15) + hex_chr.charAt((num >> (j * 8)) & 15);
        }
        return str;
    }
    function str2blks_MD5(str) {
        nblk = ((str.length + 8) >> 6) + 1;
        blks = new Array(nblk * 16);
        for (i = 0; i < nblk * 16; i++) {
            blks[i] = 0;
        }
        for (i = 0; i < str.length; i++) {
            blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
        }
        blks[i >> 2] |= 128 << ((i % 4) * 8);
        blks[nblk * 16 - 2] = str.length * 8;
        return blks;
    }
    function add(x, y) {
        var lsw = (x & 65535) + (y & 65535);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 65535);
    }
    function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }
    function cmn(q, a, b, x, s, t) {
        return add(rol(add(add(a, q), add(x, t)), s), b);
    }
    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    function MD5(str) {
        x = str2blks_MD5(str);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = ff(c, d, a, b, x[i + 10], 17, -42063);
            b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = hh(a, b, c, d, x[i + 5], 4, -378558);
            d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = add(a, olda);
            b = add(b, oldb);
            c = add(c, oldc);
            d = add(d, oldd);
        }
        return (rhex(a) + rhex(b) + rhex(c) + rhex(d)).toUpperCase();
    }
    window.MD5 = MD5;
    /** MD5 加密处理   结束*/
})(window);