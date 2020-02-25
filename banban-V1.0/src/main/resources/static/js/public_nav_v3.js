window.djnav = {
    data:{
        top_search_data:{// 头部搜索相关数据
            msg_info_list:[],//历史搜索数据
            msg_info_len:0,
            val:'',
        },
        user_info:{},// 用户信息
    },// 数据
	/**
	 *djnav 加载执行函数
	 *
	 */
	onload:function() {
        // 头部搜索输入框 点击搜索
        $('.search_p').on('click',function () {
            djnav.inputShow($('.nav_search_inpt').val());
        });
        // 头部搜索输入框 点击enter
        $(".nav_search_inpt").keypress(function (e) {
            if (e.which == 13) {
                djnav.inputShow($(this).val());
            }
        });
        // 头部搜索输入框获取焦点
	    $('.nav_search_inpt').on('focus', function() {
            djnav.input_focus();
        });
        // 头部搜索输入框失去焦点
        $('.nav_search_inpt').on('blur', function() {
            setTimeout(function(){
                $('.msg_info_ul').hide()
            },400);
        });
        if(loginstatus===1) {
            djnav.get_user_data();
        }
	},
	/**
	 *获取url参数返回参数值 中文编码使用下面的CodeChinese方法
	 *
	 * @param {*} name
	 * @returns
	 */
	GetQueryString:function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)
	     {
	     	return decodeURIComponent(r[2]);
	     }else
	     { 
	     	return false;
	     };
	},
	/**
	 *头像
	 *
	 * @param {*} e
	 */
	avatar:function(e) {
		clearInterval(avatar_timer1);
        var layerIndex = layer.open({
            type: 2,
            title: '上传头像',
            shadeClose: false,
            shade: 0.6,
            area: ['450px', '530px'],
            content: '/user/info/avatar', //iframe的url
            end: function(){ //此处用于演示
            	clearInterval(avatar_timer1);
            	var imgurl = store.get('setImgUrl');
            		store.remove('setImgUrl_ok');
            	if(imgurl){
            		location = location;
            	};
            }
        });
        avatar_timer1 = setInterval(function(){
        	var boor = store.get('setImgUrl_ok');
        	if(boor){
        		store.remove('setImgUrl_ok');
        		layer.close(layerIndex);
        		clearInterval(avatar_timer1);
        	};
        },500);
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
    //获取用户的等级信息
    get_user_data:function(){
        var _this = this;
        var url = '/index/index/userlevel';
        var postData = {};
        $.ajax({
            type: "POST",
            url: url,
            data: postData,
            dataType: "json",
            success: function (res) {
                if (res.code == 1) {
                    var json = res.data;
                    _this.data.user_info = json;
                    // 用户性别设置
                    tel_login_v1.sex_is_check = Number(json.sex);
                    if (!json.is_mobile) {
                        tel_login_v1.bindPopShowFun(3);
                    }else {
                        if (!tel_login_v1.sex_is_check) {
                            // 不是第一次登陆 但是没有设置性别 显示设置性别弹窗
                            tel_login_v1.bindPopShowFun(12, _this.data.user_info.nickname);
                        }else {
                            // 是否是新入驻用户，是则弹出标签选项
                            if (typeof alert_pw_label != 'undefined' && alert_pw_label) {
                                tel_login_v1.bindPopShowFun(13);
                            }
                        }
                    }
                    // if (json.is_mobile && tel_login_v1.sex_is_check == 0) {
                    //     // 不是第一次登陆 但是没有设置性别 显示设置性别弹窗
                    //     tel_login_v1.bindPopShowFun(12,_this.data.user_info.nickname);
                    // }
                    // // 是否是新入驻用户，是则弹出标签选项
                    // if (json.is_mobile && tel_login_v1.sex_is_check &&(typeof alert_pw_label != 'undefined' && alert_pw_label)) {
                    //     tel_login_v1.bindPopShowFun(13);
                    // }
                    // ===================头部信息开始===================
                    //
                    var nav_v3_login_box = $('.public_nav_v3 .login_box');
                    if(json.avatar_frame-1>0) {// 头像框
                        var str = 'frame_'+(json.avatar_frame-1);
                        nav_v3_login_box.find('.r_pic .frame').addClass(str);
                        nav_v3_login_box.find('.r_info .r_info_c .r_user_info .frame').addClass(str);
                    }
                    // 头像
                    nav_v3_login_box.find('.r_pic .avatar').attr('src',json.avatar).css("display","block");
                    nav_v3_login_box.find('.r_user_info .avatar').attr('src',json.avatar);
                    nav_v3_login_box.find('.r_user_detail .nickname').html(json.nickname);
                    // 等级信息
                    var level_img_str = common.levelImgFun(json.level);
                    var level_img_html = '<img src="'+level_img_str+'" alt="" class="info_level">';
                    if(Number(json.level)-1>0) {
                        nav_v3_login_box.find('.r_info .r_info_c .r_user_info .r_user_detail .level_wrap').append(level_img_html);
                    }

                    //升级弹窗
                    tel_login_v1.data.up_level.level = json.level;
                    if(json.upgrade_info.upgrade){
                        tel_login_v1.bindPopShowFun(9)
                    }

                    // 爵位信息
                    var noble_img_str = common.jewelImgFun(json.noble_id);
                    var noble_img_html = '<img src="'+noble_img_str+'" alt="" class="info_noble">';
                    if(Number(json.noble_id)-1>0) {
                        nav_v3_login_box.find('.r_info .r_info_c .r_user_info .r_user_detail .level_wrap').append(noble_img_html);
                    }

                    // 靓号
                    if(json.vip_uid>0) {
                        var vip_uid_img_str = public_img_str+'/frame/ico_pretty_min.png';
                        var vip_uid_img_html = '<img src="'+vip_uid_img_str+'" alt="" class="info_vip">';
                        // nav_v3_login_box.find('.r_info .r_info_c .r_user_info .r_user_detail .level_wrap').append(vip_uid_img_html);
                        nav_v3_login_box.find('.r_info .r_info_c .r_user_info .r_user_detail .info_uid').html(vip_uid_img_html+json.vip_uid);

                    }

                    // 接单按钮
                    if(json.pw_status === 1) {
                        var pw_btn_html = '';
                        if(json.login_status == 1) {
                            pw_btn_html = '<div class="btn" onclick="djnav.fn_status()">开始接单</div>';
                        }else if(json.login_status == 2){
                            pw_btn_html = '<div class="btn on" onclick="djnav.fn_status()">结束接单</div>';

                        }
                        nav_v3_login_box.find('.r_info .r_info_c .r_user_info').append(pw_btn_html);
                    }
                    // 等级经验

                    nav_v3_login_box.find('.r_info .r_info_c .empirical_wrap .empirical_i.level .l_img').addClass('level_'+(json.level-1));
                    nav_v3_login_box.find('.r_info .r_info_c .empirical_wrap .empirical_i.level .r_img').addClass('level_'+(json.level));

                    var level_difference = json.score/json.score_next;
                    if(level_difference>=0.11) {
                        nav_v3_login_box.find('.r_info .r_info_c .empirical_wrap .empirical_i.level .line_dot_l').addClass('on');
                    }
                    if(level_difference>=0.83) {
                        nav_v3_login_box.find('.r_info .r_info_c .empirical_wrap .empirical_i.level .line_dot_r').addClass('on');
                    }
                    nav_v3_login_box.find('.r_info .r_info_c .empirical_wrap .empirical_i.level .line').css({'width':level_difference*100+'%'});
                    // 爵位经验
                    nav_v3_login_box.find('.r_info .r_info_c .empirical_wrap .empirical_i.noble .l_img').addClass('noble_'+(json.noble_id-1));
                    nav_v3_login_box.find('.r_info .r_info_c .empirical_wrap .empirical_i.noble .r_img').addClass('noble_'+(json.noble_id));
                    var noble_difference = json.noble_score/json.noble_score_next;
                    if(noble_difference>=0.11) {
                        nav_v3_login_box.find('.r_info .r_info_c .empirical_wrap .empirical_i.noble .line_dot_l').addClass('on');
                    }
                    if(noble_difference>=0.83) {
                        nav_v3_login_box.find('.r_info .r_info_c .empirical_wrap .empirical_i.noble .line_dot_r').addClass('on');
                    }
                    nav_v3_login_box.find('.r_info .r_info_c .empirical_wrap .empirical_i.noble .line').css({'width':noble_difference*100+'%'});
                    // 钱包
                    nav_v3_login_box.find('.money_wrap .money_info_i.money .text').html(json.money+'元');
                    nav_v3_login_box.find('.money_wrap .money_info_i.diamond .text').html(json.diamond+'钻');


                    // ===================头部信息结束===================

                    // 缓存用户信息，用于聊天使用
                    localStorage.setItem("browser_user_info",JSON.stringify(json));
                    // 获取聊天未读消息
                    djnav.get_unread_notice(_this.data.user_info);
                } else {
                    layer.msg(res.msg, {
                        time: 2000
                    }, function () {});
                }
            }
        });
    },
    /**
     *未读消息 用于计算未读消息数量
     *
     */
    get_unread_notice: function (browser_user_info) {
        var max_sequence_id = LS.get("b_max_sequence_id_" + browser_user_info.uid);
        var max_chat_id = "";
        if (max_sequence_id && max_sequence_id != "undefined") {
            max_chat_id = max_sequence_id;
        }
        var _this = this;
        var my_user_info = browser_user_info;
        _BROWSER_CHAT.my_user_info = my_user_info;
        // 缓存消息
        if (LS.get("b_s_wf_notice_" + my_user_info.uid) == undefined) {//查找是否已经缓存，没有缓存则缓存消息
            //消息列表
            var wf_notice = '{"list":[]}';
            LS.set("b_s_wf_notice_" + my_user_info.uid, wf_notice);
        }
        $.ajax({
            type: "POST",
            url: '/user/message/sync_message',
            data: {
                max_chat_id: max_chat_id
            },
            dataType: "json",
            success: function (res) {
                if (res.code == 1) {
                    // 数据超过三百条，只加载最近300条
                    var data_num = 100;
                    for (var i in res.msg_list) {
                        res.msg_list[i] = JSON.parse(res.msg_list[i]);
                    }
                    var black_list = res.black_list;// 黑名单
                    var unread_msg_id = res.unread_msg_id; // 未读id
                    var msg_list = res.msg_list;// 消息列表
                    
                    if (msg_list.length > 0) {
                        // 保留100条
                        if (msg_list.length > data_num) {
                            msg_list = msg_list.slice(msg_list.length - data_num, msg_list.length);
                        }
                        // 去除最大 消息id值 并保存
                        var temp_sequence_ids = [];
                        // 把服务器返回 聊天数据，存储为自己要的格式
                        var msg_info_temp = [];
                        for (var i in msg_list) {
                            if (msg_list[i].msg_type != "admin_gift") {// 屏蔽官方礼物
                                var uid = msg_list[i].userid+'';
                                temp_sequence_ids.push(msg_list[i].sequence_id);
                                if (black_list.indexOf(uid)===-1) {// 拉黑好友信息不加载
                                    // 消息模板
                                    var msg_info = {
                                        content: msg_list[i].content,// 消息内容
                                        msg_type: msg_list[i].msg_type, // 消息类型（text文本，image图片，voice，语音）
                                        send_state: 1, // 发送状态 0 发出，1 发送成功，2，发送失败
                                        see_state:1,// 已读未读状态：0 未读，1 已读
                                        to_uid: msg_list[i].to_uid, // 接收人id
                                        uid: msg_list[i].userid, // 发送人uid
                                        message_id: msg_list[i].sequence_id + "",// 消息id
                                        create_time: Math.round(Number(msg_list[i].sequence_id) / 1000).toString(),//创建时间
                                        sequence_id: msg_list[i].sequence_id,// 后台定义消息id
                                        avatar: msg_list[i].avatar,//发送消息人头像
                                        nickname: msg_list[i].nickname,//发送人昵称
                                    };
                                    if (msg_list[i].location == 3) {// 系统提醒
                                        msg_info.type = 0;// 0:中间消息提醒 1:是时间,2:对方发的消息,3:自己发的消息
                                    } else if (msg_list[i].location == 2) {// 自己发送的
                                        msg_info.type = 3;// 0:中间消息提醒 1:是时间,2:对方发的消息,3:自己发的消息
                                    } else if (msg_list[i].location == 1) {// 自己接收的
                                        msg_info.type = 2;// 0:中间消息提醒 1:是时间,2:对方发的消息,3:自己发的消息
                                    }
                                    // 收到的消息 在未读消息列表中不存在 则标记为未读
                                    if (msg_list[i].location == 1 && unread_msg_id.indexOf(msg_info.message_id) !== -1){
                                        msg_info.see_state = 0; // 读取状态
                                    }
                                    // 会话id 小在前 大在后
                                    Number(msg_info.to_uid) > Number(msg_info.uid) ? msg_info.session_id = Number(msg_info.uid) + '-' + Number(msg_info.to_uid) : msg_info.session_id = Number(msg_info.to_uid) + '-' + Number(msg_info.uid);
                                    msg_info_temp.push(msg_info);
                                }
                            }
                        }
                        temp_sequence_ids = temp_sequence_ids.sort();
                        LS.set("b_max_sequence_id_" + browser_user_info.uid, temp_sequence_ids[temp_sequence_ids.length - 1] + "");
                        // 新数据添加，去重，保留本地数据
                        // 分组未读消息数据
                        var group_arr = _BROWSER_CHAT.group_array_fn("uid", msg_info_temp);
                        
                        for (var k in group_arr) {
                            // 获取当前房间 聊天信息缓存
                            var s_chat_room_msg = JSON.parse(LS.get("browser_chat_room_" + my_user_info.uid + "_" + k));
                            if (!s_chat_room_msg) {// 不存在
                                s_chat_room_msg = [];
                                s_chat_room_msg = s_chat_room_msg.concat(group_arr[k]);
                            } else {// 存在
                                s_chat_room_msg = s_chat_room_msg.concat(group_arr[k]);
                            };
                            // 去重
                            var result = [];
                            var obj = {};
                            for (var i = 0; i < s_chat_room_msg.length; i++) {
                                if (s_chat_room_msg[i].sequence_id) {
                                    if (!obj[s_chat_room_msg[i].sequence_id]) {
                                        result.push(s_chat_room_msg[i]);
                                        obj[s_chat_room_msg[i].sequence_id] = true;
                                    }
                                } else {
                                    if (!obj[s_chat_room_msg[i].message_id]) {
                                        result.push(s_chat_room_msg[i]);
                                        obj[s_chat_room_msg[i].message_id] = true;
                                    }
                                }
                            }
                            // 未读消息数
                            var num = _BROWSER_CHAT.get_ele_num(result, "see_state", 0);
                            // 更新缓存
                            _BROWSER_CHAT.update_notice_friend(result[result.length - 1], num);
                            // 消息存储
                            LS.set("browser_chat_room_" + my_user_info.uid + "_" + k, JSON.stringify(result));
                            // ====================未读礼物消息数据操作开始=======================//
                            // 最近五条未读礼物消息
                            var gift_msg_data = [];
                            for (var i in s_chat_room_msg) {
                                // 礼物消息
                                if (s_chat_room_msg[i].msg_type == 'gift' && !s_chat_room_msg[i].see_state) {
                                    gift_msg_data.push(s_chat_room_msg[i]);
                                }
                            };
                            // 超过五条只取最近五条未读礼物消息 其余删除
                            if (gift_msg_data.length > 5) {
                                var del_num = gift_msg_data.length - 5;
                                // 删除超过的数量
                                gift_msg_data.splice(0, del_num);
                            }
                            LS.set("browser_chat_room_gift_" + my_user_info.uid + "_" + k, JSON.stringify(gift_msg_data));
                            // ====================未读礼物消息数据操作结束=======================//
                        }
                    }
                    // 消息列表 存在 好友消息缓存 则加入 消息列表缓存
                    if (LS.get("b_s_wf_friend_notice_" + my_user_info.uid) && JSON.parse(LS.get("b_s_wf_friend_notice_" + my_user_info.uid)).length > 0) {
                        $.each(JSON.parse(LS.get("b_s_wf_friend_notice_" + my_user_info.uid)), function (i, item) {
                            _BROWSER_CHAT.set_LS_wf_notice(item);
                        });
                    } else {
                        LS.set("b_s_wf_friend_notice_" + my_user_info.uid, "[]")
                    };
                    // 获取 未读消息数量
                    djnav.get_unread_num(my_user_info);
                } else {
                }
            }
        });
    },
    /**
     *获取 未读消息数量
     *
     */
    get_unread_num: function (my_user_info) {
        var _this = this;

        var temp_num = 0;
        var temp_friend_notice = JSON.parse(LS.get("b_s_wf_friend_notice_" + my_user_info.uid));
        // console.log(temp_friend_notice);
        
        $.each(temp_friend_notice, function (i, item) {
            var temp_notice_i = JSON.parse(LS.get("browser_chat_room_" + my_user_info.uid + "_" + item.uid));
            var num = _BROWSER_CHAT.get_ele_num(temp_notice_i, "see_state", 0);
            temp_num = temp_num + num;
        });
        // 存在未读消息
        if (temp_num > 0) {
            $(".sidebar-btn.message .side_new_msg").addClass("on");
            if (temp_num>99) {
                $(".sidebar-btn.message .side_new_msg .num").text('9..');
            }else {
                $(".sidebar-btn.message .side_new_msg .num").text(temp_num);
            }
        } else {
            $(".sidebar-btn.message .side_new_msg").removeClass("on");
        };
    },
    //输入框输入时间
    inputShow:function(val){
    	if(!val){return;};
        localStorage.setItem('searchKey', val);
        //历史记录把已经存在的数组取出
        var arr = store.get("historical_search") || [];
        var isseach = false;
        for(var i=0,len=arr.length;i<len;i++){
            if(val === arr[i].name){
                isseach = true;
                break;
            };
        };
        if(!isseach){
            var jsn = {
                id:(new Date()).getTime(),//获取当前的时间戳 作为id
                name:val
            };
            arr.push(jsn);
            var len = arr.length;
            // 历史搜索缓存6条
            if(len>6){
                arr = arr.slice(len-6);
            };
            store.set("historical_search",arr);
        };
        $('.msg_info_ul').hide();
        window.open('/peiwan/search.html','_bank');
    },
    //搜索输入框获取焦点事件
    input_focus:function(){
        //获取焦点时显示
        // this.msg_info_show = true;//历史搜索是否显示
        var arr = store.get("historical_search") || [];
        arr.reverse();
        this.data.top_search_data.msg_info_len = arr.length;
        for(var i=0,len=this.msg_info_len;i<len;i++){
            arr[i].index = i;
        };
        this.data.top_search_data.msg_info_list = arr;
        var msg_info_ul = $('.msg_info_ul');
        $('.msg_info_ul').html('');
        var str ='';
        for(var i in arr) {
            str += '<li class="msg_info_li" >'+arr[i].name+'</li>'
        }

        if(str != ''){
            msg_info_ul.append(str);
            msg_info_ul.show();
            msg_info_ul.find('.msg_info_li').on('click',function() {
                djnav.inputShow($(this).text());
            });
        }
    },
    //当前用户状态点击事件
    fn_status:function(){
        if(djnav.data.change_status_ajax) {
            return;
        }else {
            djnav.data.change_status_ajax = true;
        }
        if(djnav.data.user_info.login_status == 1)
        {
            $.ajax({
                type: "POST",
                url: '/user/info/set_status',
                data: {value:2},
                dataType: "json",
                success: function (res) {
                    if (res.code == 1) {
                        layer.msg(res.msg, {
                            time: 1000
                        }, function () {
                            location = location;
                        });
                    } else  if (res.code == 2){
                        djnav.data.change_status_ajax = false;
                        layer.msg("您的账号已被冻结，请联系客服！",{time:6000});
                    }else{
                        djnav.data.change_status_ajax = false;
                        layer.msg(res.msg, {
                            time: 2000
                        }, function () {});
                    }
                }
            });
        }else if(djnav.data.user_info.login_status == 2)
        {
            $.ajax({
                type: "POST",
                url: '/user/info/set_status',
                data: {value:1},
                dataType: "json",
                success: function (res) {
                    if (res.code == 1) {
                        layer.msg(res.msg, {
                            time: 1000
                        }, function () {
                            location = location;
                        });
                    }else{
                        djnav.data.change_status_ajax = false;
                        layer.msg(res.msg, {
                            time: 2000
                        }, function () {});
                    }
                }
            });
        }else if(djnav.data.user_info.login_status == 3){
            djnav.data.change_status_ajax = false;
            layer.msg("接单中不能修改状态");
            return;
        };
    },
    // 返回顶部
    scroll_top:function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
};
djnav.onload();