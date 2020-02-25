(function(){

	var avatar_timer1 = null;//用来监听是否自动关闭图像上传窗口的事件
	window.chat_win=null;
    window.public_domain = window.location.protocol+"//"+document.domain;
    if((public_domain.indexOf("http://dj.com") ===-1) && (public_domain.indexOf("https://test.daofengdj.com") ===-1) && (public_domain.indexOf("https://test_zs.daofengdj.com") ===-1)){
        window.public_domain = "https://yundown.daofengdj.com";
    };
	// 缓存
	window.LS = {
		set: function (name, data) {
			if (typeof data === "string") {
				localStorage.setItem(name, data);
			} else {
				// alert("本地存贮必须为字符串形式");
			};
		},
		get: function (name) {
			return localStorage.getItem(name);
		},
		remove: function (name) {
			return localStorage.removeItem(name);
		}
	};
	/**
	 *图像尺寸限定
	 *
	 * @param {*} str 图像地址
	 * @param {*} size 限制大小
	 * @returns
	 */
	window._P_H = function(str, size){
	        if (!str||!size) {
	            str = 'https://img1.daofengdj.com/static/public/img/avatar_middle.png';
	        } else {
	            //这里还可以加不同的尺寸
				if (str.indexOf('daofengdj/sq/') !== -1) {
					str = str.replace(/sq\/.*/, 'sq/' + size);
				} else if (str.indexOf('img1.daofengdj.com') !== -1) {
					str = str + '!daofengdj/sq/' + size;
				} else if (str.indexOf('dianjing.b0.upaiyun.com') !== -1) {
					str = str + '!daofengdj/sq/' + size;
				}
	       }
	       return (str);
	};
	window.common = {
		/**
		 *所有的数据验证方法
		 *
		 * @param {*} data
		 * @returns
		 */
		post_Verification:function(data){
			if (data.body.code == 0) {
				return false;
			};
            return true;
		},
		/**
		 *错误请求处理
		 *
		 * @param {*} data
		 */
		error:function(data){
			console.log(data);
		},
		/**
		 *获取url参数返回参数值 中文编码使用下面的CodeChinese方法
		 *
		 * @param {*} name
		 * @returns
		 */
		GetQueryString: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) {
				return decodeURIComponent(r[2]);
			} else {
				return false;
			};
		},
		/**
		 *返回一个日期格式传递一个时间戳
		 *
		 * @param {*} format
		 * @returns
		 */
		timestamp :function(format){
       		var format = new Date(format*1000);
            var year = format.getFullYear();
            var month = format.getMonth()+1;
            var date = format.getDate();
            var hour = format.getHours();
            var minute = format.getMinutes();
            var miao = format.getSeconds();
            var returnstr = function(val){
            	return val<10?'0'+val:val;
            };
            return returnstr(year)+"-"+returnstr(month)+"-"+returnstr(date)+' '+returnstr(hour)+":"+returnstr(minute)+":"+returnstr(miao);
    	},
		/**
		 *处理折扣的方法首页列表页用到
		 *
		 * @param {*} data_list
		 * @returns
		 */
		discounted_data_fn:function(data_list){
			if(!data_list){return [];};
			//增加展示出来的折后信息在数据中新加一个字段this_discount（10为没有折扣不显示）
			for(var i=0,len=data_list.length;i<len;i++){
				var str1 = data_list[i].discount;
				if(str1){
					// var arr1 = str1.split(',');
					// var k=10,m=10;
					// for(var j=0;j<arr1.length;j++){
					// 	k--;
					// 	if(arr1[j]>0){
					// 		m = k;
					// 	};
					// };
					// data_list[i].this_discount = m;
					data_list[i].this_discount = str1;
				}else{
					data_list[i].this_discount = 10;
				};
			};
		},
		/**
		 *表单验证通用{type:"mobile",el:"#mobile",parset:"#test1",L:100,T:100,value:15890611985,time:1000}
		 *
		 * @param {*} options
		 * @returns
		 */
		form_Verification:function(options){
			/**
			 * 参数说明[可有可无的属性]
			 * type 类型
			 * el 输入框
			 * [parset] 父元素有此属性会插入此元素中没有会插入body中
			 * [L][T] 创建的创建提示信息的left高度和top高度没有参数会创建相对于el元素的left和top值
			 * value 值
			 * [time]显示多久隐藏 默认3s
			 * 会在页面中创建<div class="Prompt_msg_style" style="left:xx;top:xx">xxx</div>这样一个元素样式
			 * 样式在home_nav_footer.css有差异可以覆盖此属性
			 * 方法会返回一个boor值
			 */
			var obj = document.querySelector(options.el);
			var _left = obj.offsetLeft;
			var _top = obj.offsetTop;
			var _width = obj.offsetWidth;
			if(options.x){
				_left = options.left;
			};
			if(options.y){
				_top = options.y;
			};
			var Odiv = document.createElement('div');
			if(options.parset){
				var parsetObj = document.querySelector(options.parset);
			}else{
				var parsetObj = document.body;
			};
			var _time = 3000;
			if(options.time){
				_time = options.time;
			};
			var msg = "";
			Odiv.className = "Prompt_msg_style";
			Odiv.style.top = (_top-25)+"px";
			Odiv.style.left = (_left)+"px";
			var _fn = function(obj){
				obj.innerHTML = msg;
				parsetObj.appendChild(obj);
				setTimeout(function(){
					parsetObj.removeChild(obj);
				},_time);
			};
			var value = options.value;
			var oldvalue = options.oldvalue;
			if(options.type === "mobile"){
				//登录手机号
				if(value == ''){
					msg = "请输入手机号";
					_fn(Odiv);
					return false;
				}
				if (isNaN(value)) {
					msg = "手机号必须是数字";
					_fn(Odiv);
					return false;
				};
				//增加了海外手机号所以前端不再对手机号格式判断
			}else if(options.type === "password"){
				//密码
				if(value == ''){
					msg = "请输入密码";
					_fn(Odiv);
					return false;
				}
				if(value.length<6 || value.length>20){
					msg = "密码长度为6-20位";
					_fn(Odiv);
					return false;
				};
				var pattern = /[\u4e00-\u9fa5]/;
				if(pattern.test(value)){
					msg = "密码中不能包含中文";
					_fn(Odiv);
					return false;
				};
			}else if(options.type === "repassword"){
				//检测确认密码；
				if(oldvalue!==value && value!=''){
					msg = '两次输入的密码不一致！';
					_fn(Odiv);
					return false;
				}else{
					return true;
				}
			}else if(options.type === "message_code"){
				//检测短信验证码
				if(value == ''){
					msg = '请输入短信验证码';
					_fn(Odiv);
					return false;
				}else{
					return true;
				}
			}else if(options.type === "captcha_code"){
				if(value == ''){
					msg = '请输入验证码';
					_fn(Odiv);
					return false;
				}else{
					return true;
				}
			}else if(options.type === "seach"){
				if(value == ''){
					msg = '内容不能为空';
					_fn(Odiv);
					return false;
				};
			}else if(options.type === "login_number"){
				if(value == ''){
					msg = '内容不能为空';
					_fn(Odiv);
					return false;
				};
				if(!(/^[0-9]*$/.test(value))){
					msg = "请输入数字";
					_fn(Odiv);
					return false;
				};
			};
			return true;
		},
		/**
		 *把分的人民币单位转换为元10.00
		 *
		 * @param {*} value
		 * @returns
		 */
		money_conversion:function(value){
			value = parseInt(value);
			return (value/100).toFixed(2);
		},
		/**
		 *返回格式化事件单位秒如01:01:12
		 *
		 * @param {*} time_num
		 * @returns
		 */
		return_formattime:function(time_num){
			function str2(num)
			{
				return num<10?'0'+num:num;
			};
			var shi = parseInt(time_num/3600);
			var fen = parseInt((time_num%3600)/60);
			var miao = parseInt(time_num%60);
			return str2(shi)+":"+str2(fen)+":"+str2(miao);
		},
    	/**
		 *页码
		 *
		 * @param {*} _fn
		 * @param {*} pages
		 * @param {*} curr
		 */
		page:function(_fn,pages,curr){
    		laypage({
	            cont: "pageInfo", 
	            //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
	            pages: pages, //通过后台拿到的总页数
	            skin: '#fdc790',
	            curr: curr,//当前页
	            jump: function (obj, first) { //触发分页后的回调
	                if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
	                    _fn(obj.curr);
	                };
	            }
	        });
    	},
    	/**
		 *对数组的特殊化处理 分组
		 *
		 * @param {*} arr 数据源
		 * @param {*} num 分成几组
		 * @returns
		 */
		arrey_change1:function(arr,num){
    		/**
    		 * 例如
    		 * 参数 [0,1,2,3,4,5,6]和2
    		 * 返回 [[0,1],[2,3],[4,5],[6]]
    		 */
    		var num1 = arr.length;
			var num2 = parseInt(num1/num);
			if(num1%num){
				num2++;
			};
			var k=0;
			var arr1 = [];
			for(var i=0;i<num2;i++){
				var arr2 = [];
				for(var j=0;j<num;j++){
					if(arr[k]){
						arr2.push(arr[k]);
					};
					k++;
				};
				arr1.push(arr2);
			};
			return arr1;
        },
		/**
		 *等级图片
		 *
		 * @param {*} level
		 * @returns
		 */
		levelImgFun: function (level) {//等级图片
			var imgUrl = public_domain + "/static/public/img/level_v3/";
			var imgind = 0;
			if (level) {
				imgind = level - 1;
			} else {
				imgind = 0;
			};
			if (imgind === 0) {
				return 0;
			} else {
				return imgUrl + imgind + ".png";
			}
		},
		/**
		 *透明等级图片
		 *
		 * @param {*} level
		 * @returns
		 */
		levelImgFun2: function (level) {//等级图片
			var imgUrl = public_domain + "/static/public/img/level_v3/";
			var imgind = 0;
			if (level) {
				imgind = level - 1;
			} else {
				imgind = 0;
			};
			if (imgind === 0) {
				return 0;
			} else {
				return imgUrl + imgind + ".png";
			}
		},
		/**
		 *爵位图片
		 *
		 * @param {*} noble
		 * @returns
		 */
		jewelImgFun: function (noble) {
			var imgUrl = public_domain + "/static/public/img/rank_v2/";
			var imgind = 0;
			if (noble) {
				imgind = noble - 1;
			} else {
				imgind = 0;
			};
			if (imgind === 0) {
				return 0;
			} else {
				return imgUrl + imgind + ".png";
			}

		},
        /**
		 *新分页
		 *
		 * @param {*} page_info laypage外层id
		 * @param {*} btn_color 样式
		 * @param {*} _fn 回调函数
		 * @param {*} pages 总页数
		 * @param {*} curr 当前页码
		 * @param {*} f_is 首页
		 * @param {*} l_is 尾页
		 */
		mypage: function(page_info,btn_color,_fn,pages,curr,f_is,l_is){
	        laypage({
	            cont: page_info,
	            //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
	            pages: pages, //通过后台拿到的总页数
	            skin: btn_color,
	            curr: curr,//当前页
	            first: f_is,//首页
	            last: l_is,//尾页
	            jump: function (obj, first) { //触发分页后的回调
	                if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
	                    _fn(obj.curr);
	                };
	            }
	        });
	    },
	    /**
		 *手机号 中间四位为星星
		 *
		 * @param {*} phone
		 * @returns
		 */
		change_phone: function(phone) {
            var i = phone.substring(3,7);
            var re_phone = phone.replace(i,"****");
            return re_phone;
        },
		/**
		 *限制输入大小
		 *
		 * @param {*} obj jquery input 对象
		 * @param {*} num 限制字数大小
		 * @return {num} 返回当前数量
		 */
		limit_inpt_num: function(obj,num) {
			obj.on("input propertychange", function () {
				var _val = $(this).val(),
				count = "";
				if (_val.length > num) {
					$(this).val(_val.substring(0, num));
				}
				count = $(this).val().length;
				return count;
			});
		},
		/**
		 *设置cookie
		*
		* @param {*} cname
		* @param {*} cvalue
		* @param {*} exdays
		*/
		setCookie: function (cname, cvalue, exdays) {
			var d = new Date();
			d.setTime(d.getTime() + exdays);
			var expires = "expires=" + d.toUTCString();
			document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/"
		},
		/**
		 *获取指定名称的cookie值
		 *
		 * @param {*} name
		 * @returns
		 */
		getCookie: function (cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1);
				if (c.indexOf(name) != -1) {
					return c.substring(name.length, c.length);
				}
			}
			return null;
		},
		/**
		 *删除cookie
		 *
		 * @param {*} cname
		 */
		delCookie: function (cname) {
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval = common.getCookie(cname);
			if (cval != null)
				document.cookie = cname + "=" + cval + ";expires=" + exp.toGMTString();
		},
		/**
		 *打开聊天窗
		 *
		 * @param {*} is_service 是否打开服务
		 * @param {*} uid 跟谁聊天的uid
		 */
		open_msg_chat: function (is_service, uid) {
			var url = "/user/index/chat.html";
			$(".sidebar-btn.message .side_new_msg").removeClass("on");

			if (is_service == 1) {
				url = url + "?is_service=" + is_service + "&uid=" + uid;
			}
			window.open(url, "chat_win");
		},
		/**
		 *公共ajax
		 *
		 * @param {*} url 请求地址
		 * @param {*} todata 请求参数
		 * @param {*} fn 成功回调
		 * @param {*} fn2 失败回调
		 */
		ajax: function (url, todata, fn, fn2) {
			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'json',
				data: todata,
				success: function (res) {
					fn(res);
				},
				error: function (code) {
					if (fn2) { fn2(code) };
				}
			});
		},
		/**
         *XSS数据过滤
         *
         * @param {*} str
         * @returns
         */
		filterXSS: function (str) {
			return str
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;')
				.replace(/\r{0,}\n/g, '<br/>')
		},
		/**
		 * 返回顶部
		 */
		scroll_top:function () {
			$('html, body').animate({
				scrollTop: 0
			}, 400);
		},

		/**
		 * 跳转到聊天室房间
		 * @param room_id		房间ID
		 */
		jump_chat_room:function (room_id) {
			window.open("/client/index/web_room.html?roomid="+room_id,"chatroom")
		},
		/**
		 * 跳转到用户详情页面
		 * @param uid		用户UID
		 */
		jump_user_info:function (uid) {
			window.open("/item/"+uid+".html")
		},
		/**
		 * 跳转到网站首页
		 */
		jump_web_index:function () {
			window.location.href = '/'
		},
		/**
		 * 获得两个日期之间的所有日期组成数组
		 * @param stime			开始时间  	2019-12-30
		 * @param etime			结束时间		2020-01-30
		 * @returns {Array}		时间区间内所有时间组成的数组
		 */
		get_diff_date:function(stime,etime) {
			var diff_date = new Array();
			var i = 0;
			//开始日期小于等于结束日期,并循环
			while (stime <= etime) {
				diff_date[i] = stime;

				//获取开始日期时间戳
				var stime_ts = new Date(stime).getTime();

				//增加一天时间戳后的日期
				var next_date = stime_ts + (24 * 60 * 60 * 1000);

				//拼接年月日，这里的月份会返回（0-11），所以要+1
				var next_dates_y = new Date(next_date).getFullYear() + '-';
				var next_dates_m = (new Date(next_date).getMonth() + 1 < 10) ? '0' + (new Date(next_date).getMonth() + 1) + '-' : (new Date(next_date).getMonth() + 1) + '-';
				var next_dates_d = (new Date(next_date).getDate() < 10) ? '0' + new Date(next_date).getDate() : new Date(next_date).getDate();

				stime = next_dates_y + next_dates_m + next_dates_d;

				//增加数组key
				i++;
			}
			return diff_date;
		},
	}
	//common.onload();
}());