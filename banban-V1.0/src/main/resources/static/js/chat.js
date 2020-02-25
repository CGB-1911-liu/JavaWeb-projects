/*
* @Title: 私信聊天
* @Author: 王晓琨
* @Date: 2018-11-21 15:43:08
 * @Last Modified by: 王晓琨
 * @Last Modified time: 2019-12-19 19:09:18
*/
"use strict";
(function () {

    // 临时 图片信息
    // var upload_img_path_temp = [];
    // // 临时 文本信息
    // var send_text_temp = [];
    // 监听是否已经在底部，用于有新消息时 是显示提醒，还是滚动到底部
    // window._chat_scroll_status = false;
    // 缓存最新一条消息 时间，用于判断下次发送消息是否 创建 时间dom 结构
    // window._chat_temp_timestamp = 1451577600;//2016-01-01 00:00:00
    // 聊天数据
    // 假的模拟聊天数据
    // type 1:是时间,2:对方发的消息,3:自己发的消息
    // sending_state//发送状态只有自己的聊天信息有false就是发送成功true发送未成功会显示loading图标
    // read_state//已读未读状态是指本地接到新消息但是不在聊天面板就是true在本地存储中就是未读消息
    // to_uid:接收用户的uid
    // userid:发送人的uid

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
    var a = {
        my_user_info: {},//用户信息
        friend_user_info: [],//好友信息
        chats: [],// 聊天消息
        gift:[],// 礼物
        chat_win: null,// 聊天窗口
        chat_pop_show: false,// 聊天弹窗是否显示
        hiddenProperty: 'hidden' in document ? 'hidden' :
            'webkitHidden' in document ? 'webkitHidden' :
                'mozHidden' in document ? 'mozHidden' :
                    null,//浏览器是否获取焦点
        visibilityChangeEvent: "",
        is_focus:true,//标记页面是否获取焦点
        new_notice_title:{//新消息标题数据
            g_blinkid: 0,
            g_blinkswitch: 0,
            g_blinktitle: document.title,
            g_onlineuser: "",
            g_sysmsg_sound: null,
            g_newmsg_sound: null,
            g_app_num: 0,
            g_appnum: 0,
            g_bappmore: false,
            g_inputtime: 0,
        },
        wf_notice: {//消息列表
            list: []
        },
        // 系统消息
        wf_sys_notice: {},
        // 未读消息
        wf_unread_notice: {
            data: {
                prove: [],
                chat: []
            },
            is_ajax: true
        },
        unread_num: 0,
        show_msg: {},//换装秀消息
        show_msg_current_page: 1,// 消息列表当前页
        show_msg_last_page: 1,// 消息列表当前页
        show_msg_is_load: false,//换装秀消息是否加载过
        b_chat_user_info: {},//判断聊天窗口哪个显示
        //生成emojihtml片段时用
        emoji_array: ["[GG]", "[啊]", "[便便]", "[馋]", "[大哭]", "[大笑]", "[呆]", "[得意]", "[低头]", "[顶圈]", "[丢魂]", "[飞吻]", "[尴尬]", "[哈哈]", "[汗]", "[很开心]", "[禁言]", "[惊吓]", "[开心]", "[瞌睡]", "[可爱亲]", "[可爱伸舌头]", "[恐怖]", "[苦恼]", "[酷]", "[礼貌]", "[流泪]", "[迷恋]", "[勉笑]", "[恼火]", "[撇嘴]", "[期待]", "[亲亲]", "[伸舌头]", "[生气]", "[叹气]", "[痛苦]", "[喔]", "[无脸]", "[无奈]", "[无语]", "[笑哭]", "[一字眼]", "[晕]", "[可爱]", "[调皮]", "[心动]", "[心碎]", "[鼓掌]", "[干杯]", "[秀肌肉]", "[扎心]", "[相爱]", "[棒棒糖]", "[玫瑰花]"],
        // 解析图片表情时用
        emoji_json: { "[GG]": "emoji_1", "[啊]": "emoji_2", "[便便]": "emoji_3", "[馋]": "emoji_4", "[大哭]": "emoji_5", "[大笑]": "emoji_6", "[呆]": "emoji_7", "[得意]": "emoji_8", "[低头]": "emoji_9", "[顶圈]": "emoji_10", "[丢魂]": "emoji_11", "[飞吻]": "emoji_12", "[尴尬]": "emoji_13", "[哈哈]": "emoji_14", "[汗]": "emoji_15", "[很开心]": "emoji_16", "[禁言]": "emoji_17", "[惊吓]": "emoji_18", "[开心]": "emoji_19", "[瞌睡]": "emoji_20", "[可爱亲]": "emoji_21", "[可爱伸舌头]": "emoji_22", "[恐怖]": "emoji_23", "[苦恼]": "emoji_24", "[酷]": "emoji_25", "[礼貌]": "emoji_26", "[流泪]": "emoji_27", "[迷恋]": "emoji_28", "[勉笑]": "emoji_29", "[恼火]": "emoji_30", "[撇嘴]": "emoji_31", "[期待]": "emoji_32", "[亲亲]": "emoji_33", "[伸舌头]": "emoji_34", "[生气]": "emoji_35", "[叹气]": "emoji_36", "[痛苦]": "emoji_37", "[喔]": "emoji_38", "[无脸]": "emoji_39", "[无奈]": "emoji_40", "[无语]": "emoji_41", "[笑哭]": "emoji_42", "[一字眼]": "emoji_43", "[晕]": "emoji_44", "[可爱]": "emoji_45", "[调皮]": "emoji_46", "[心动]": "emoji_47", "[心碎]": "emoji_48", "[鼓掌]": "emoji_49", "[干杯]": "emoji_50", "[秀肌肉]": "emoji_51", "[扎心]": "emoji_52", "[相爱]": "emoji_53", "[棒棒糖]": "emoji_54", "[玫瑰花]": "emoji_55" },

        //页面加载完毕第一个调用的方法
        onload: function () {

            window.public_domain = "//rcstatic.test.daofengdj.com/static";

            window._de_bug = true;
            var gift_url = "/client/api/gift";

            a.ajax(gift_url, {}, function (res) {
                if (res.code == 1) {
                    a.gift = res.data;
                }
            });
            setTimeout(function() {
                // 判断是否登录
                if (loginstatus) {
                    a.visibilityChangeEvent = a.hiddenProperty.replace(/hidden/i, 'visibilitychange');//浏览器改变焦点
                    // 当前用户信息赋值
                    a.my_user_info = JSON.parse(LS.get("browser_user_info"));
                    if (a.my_user_info) {
                        window.browser_user_info = a.my_user_info;
                        browser_user_info.identity = 2;
                        browser_user_info.device_id = "12";
                    } else {
                        // 刷新父级窗口
                        self.opener.location.reload();
                    };

                    // 聊天好友信息
                    if (LS.get("b_s_wf_friend_notice_" + a.my_user_info.uid)) {
                        a.friend_user_info = JSON.parse(LS.get("b_s_wf_friend_notice_" + a.my_user_info.uid));
                    } else {
                        // 不存在，则初始化好友缓存信息
                        LS.set("b_s_wf_friend_notice_" + _BROWSER_CHAT.my_user_info.uid, "[]");
                    };
                    // 初始化用户信息
                    a.initialize_user_info();
                    // 关闭窗口
                    $(".chat_wrapper").find(".close_box .close_btn").on("click", function () {
                        a.close_pop();
                    });
                    // 获取未读消息
                    // a.get_unread_notice();
                    // 缓存消息
                    if (LS.get("b_s_wf_notice_" + _BROWSER_CHAT.my_user_info.uid) == undefined) {//查找是否已经缓存，没有缓存则缓存消息
                        //消息列表
                        var wf_notice = '{"list":[]}';
                        LS.set("b_s_wf_notice_" + _BROWSER_CHAT.my_user_info.uid, wf_notice);
                    }
                    var l_wf_notice_temp = LS.get("b_s_wf_notice_" + _BROWSER_CHAT.my_user_info.uid);
                    _BROWSER_CHAT.wf_notice = JSON.parse(l_wf_notice_temp);
                    // 加载消息列表
                    _BROWSER_CHAT.get_notice_list();
                    setInterval(function () {
                        var temporary_data = _BROWSER_CHAT.de_bug_data_turnover_get("browser_de_bug_inchat");
                        // console.log(temporary_data);

                        if (temporary_data) {
                            for (var i = 0, len = temporary_data[0].length; i < len; i++) {
                                if (temporary_data[0][i]) {
                                    on_browser_layer_recv_data(Math.floor(temporary_data[1][i]), temporary_data[0][i]);
                                };
                            };
                        };
                    }, 500);

                    // 监听页面是否获取焦点
                    document.addEventListener(a.visibilityChangeEvent, a.onVisibilityChange);
                    // ws链接被关闭
                    if (_Brower_WS.ws_state === 2) {
                        //重新连接ws
                        _Brower_WS.no_reconnect = false;
                        _Brower_WS.open_ws();
                    }
                    var url = "/pw/app/api/v3/slide/get.json";
                    var post_data = {};
                    a.ajax(url, post_data, function (res) {
                        if (res.code == 1) {
                            var json = res.data;
                                var chat_ad_obj = $('.chat_ad');
                                chat_ad_obj.list = json;
                                a.create_chat_ad(chat_ad_obj);

                                if(chat_ad_obj.dom) {
                                    chat_ad_obj.html(chat_ad_obj.dom);
                                }


                        } else {

                        }
                    });
                    
                }
            },200);


        },
        /**
         *加载客服地址
         *
         */
        service_fn:function(){
            var appid = 'dsQIsvEEt22a2B72';
            var web_domain = 'https://kf.zuhaowan.net';
            // 获取地址栏参数
            var url_param = a.get_url_param("uid");

            if (url_param) {
                var userid = url_param;
            }else {
                var userid = '';
            };
            if (!sceneId) { var sceneId = ''; };
            if (!staffId) { var staffId = ''; };
            if (!nickname) { var nickname = ''; };
            if (!group) { var group = ''; };
            var url = web_domain + "/im/text/" + appid + ".html?userid=" + userid + "&nickname=" + nickname + "&group=" + group + "&staffId=" + staffId + "&sceneId=" + sceneId;
            $("#iframe_service").attr("src", url);
            
        },
        /**
         *监听页面是否获取焦点
         *
         */
        onVisibilityChange:function() {
            if (!document[a.hiddenProperty]) {
                a.stopBlinkNewMsg();
                a.is_focus = true;
                // console.log('页面非激活');
            } else {
                a.is_focus = false;
                // console.log('页面激活');
            }
        },
        /**
         *新消息提醒
         *
         */
        blinkNewMsg: function() {
            document.title = a.new_notice_title.g_blinkswitch % 2 == 0 ? "【　　　】 - " + a.new_notice_title.g_blinktitle : "【新消息】 - " + a.new_notice_title.g_blinktitle;
            a.new_notice_title.g_blinkswitch++;
        },
        /**
         *停止新消息提醒定时器
         *
         */
        stopBlinkNewMsg:function() {
            if (a.new_notice_title.g_blinkid) {
                clearInterval(a.new_notice_title.g_blinkid);
                a.new_notice_title.g_blinkid = 0;
                document.title = a.new_notice_title.g_blinktitle;
            }
        },
        /**
         *清空聊天弹窗页面数据
         *
         */
        clear_chat_pop: function () {
            _BROWSER_CHAT.chat_pop_show = false;
            $(".msg_chat_w").fadeOut();
        },
        /**
         *初始化处理用户信息
         *
         */
        initialize_user_info: function () {
            var str_location_href = location.href;
            if (str_location_href.indexOf('dj.com') !== -1) {
                // browser_user_info.ws_ip = 'ws://192.168.1.81:9501';//接口获取
                browser_user_info.ws_ip = 'ws://local_dj_chat.im.com';//接口获取
            };
            if (str_location_href.indexOf('www.test.daofengdj.com') !== -1) {
                browser_user_info.ws_ip = 'ws://dj_im.test.daofengdj.com';//接口获取
            };
            if (str_location_href.indexOf('rc.daofengdj.com') !== -1) {
                browser_user_info.ws_ip = 'wss://chat.daofengdj.com';//接口获取
            };
            if (str_location_href.indexOf('www.daofengdj.com') !== -1) {
                browser_user_info.ws_ip = 'wss://chat.daofengdj.com';//接口获取
            };
            if (str_location_href.indexOf('www.tianxinmiao.com') !== -1) {
                browser_user_info.ws_ip = 'wss://chat.daofengdj.com';//接口获取
            };
        },
        /**
         *给主窗口发送信息
         *
         * @param {*} type
         * @param {*} data
         */
        to_trunk: function (type, data) {
            if (_de_bug) {
                //3000是发给服务器的
                if ((type === 2005) || (type === 3000)) {
                    _BROWSER_CHAT.de_bug_data_turnover("browser_de_bug_intrunk", type, data);
                } else {
                    _BROWSER_CHAT.de_bug_data_turnover("browser_de_bug_intrunk", type, data);
                };
            }
        },
        /**
         *聊天窗口切换
         *
         * @param {*} uid
         */
        change_check: function (item, is_one_item) {
            if (is_one_item) {
                // 默认欢迎语
                setTimeout(function () {
                    var content = "";
                    var con_url = "/user/usercenter/getWelcome";
                    var post_da = {
                        uid: item.uid
                    };
                    a.ajax(con_url, post_da, function (res) {
                        if (res.code == 1) {
                            content = res.data;
                            if (content == "" || !content) {
                                return;
                            }else {
                                _BROWSER_CHAT.send_normal_msg(item.uid, item.avatar, item.nickname, a.my_user_info.uid, content);
                            }
                        }else if(res.code == -2) {
                            
                            layer.confirm(res.msg, {
                                btn: ['知道了'] //按钮
                            }, function () {
                                layer.confirm('是否关闭聊天窗口', {
                                    btn: ['关闭', '取消'] //可以无限个按钮
                                }, function (index, layero) {
                                        window.close();
                                        _Brower_WS.no_reconnect = true;
                                        window._Browser_Websocket.close();
                                }, function (index) {
                                        layer.close(index);
                                        _Brower_WS.no_reconnect = true;
                                        window._Browser_Websocket.close();
                                });
                            });
                            
                        }
                    });

                }, 100);
            }
            // console.log(11111);
            if(item===2){
                // 人工服务
                a.service_fn();
                item = {
                    uid:'888888',
                    nickname:'在线客服',
                    avatar:public_domain+'/user/img/index/chat/ico_10.png'
                };
                // 头部昵称


                // 头部
                if(item.dom_top){
                    $('.top_title.chat_top_title').html(item.dom_top);
                }else {
                    a.create_chat_top(item);
                    $('.top_title.chat_top_title').html(item.dom_top);
                }
                $(".top_title.chat_top_title .btn").hide();

                $(".chat_l_id_" + item.uid).addClass("on").siblings().removeClass("on");
                $(".chat_r_id_" + item.uid).addClass("on").siblings().removeClass("on");
                a.change_scroll_status(-1);
            }else {
                // 头部昵称
                // $(".top_title .title").text(item.nickname);
                // 头部

                if(item.dom_top){
                    $('.top_title.chat_top_title').html(item.dom_top);
                }else {
                    a.create_chat_top(item);
                    $('.top_title.chat_top_title').html(item.dom_top);
                }
                $(".chat_l_id_" + item.uid).addClass("on").siblings().removeClass("on");
                $(".chat_r_id_" + item.uid).addClass("on").siblings().removeClass("on");
                // 更改滚动状态
                var ind = _BROWSER_CHAT.getobj_array_index(a.friend_user_info, "uid", item.uid);

                a.change_scroll_status(ind);
                var b_order_ajax_info = localStorage.getItem('b_order_ajax_info_'+a.my_user_info.uid+'_'+item.uid);// 订单信息
                var temp_time = a.get_timestamp();// 当前时间
                var _time = 0;
                if(b_order_ajax_info){
                    _time = temp_time - Number(JSON.parse(b_order_ajax_info).time);// 时间间隔
                }else {
                    _time = temp_time;
                }

                if(b_order_ajax_info && (_time < 10)){// 10s之内不调取订单接口
                    if(!(JSON.parse(b_order_ajax_info).info instanceof Array)) {
                        item.order_info = JSON.parse(b_order_ajax_info).info;
                        a.create_chat_right_order(item);// 创建订单流程结构
                        if(item.dom_order){
                            item.dom_chat_list.addClass('on');
                            item.dom_order_wrap.html(item.dom_order);
                        }
                    }
                }else {
                    a.get_order_info(item);
                }
            }
        },
        /**
         *调取订单信息
         *
         */
        get_order_info:function(item,type) {
            var url = "/user/order/chat_order";
            var post_data = {
                pw_uid: item.uid,
                uid: a.my_user_info.uid

            };
            a.ajax(url, post_data, function (res) {
                if (res.code == 1) {
                    var json = res.data;
                    if (!(json instanceof Array)) {
                        item.order_info = json;
                        a.create_chat_right_order(item); // 创建订单流程结构
                        if (item.dom_order) {
                            item.dom_chat_list.addClass('on');
                            item.dom_order_wrap.html(item.dom_order);
                        }
                    }else {
                        if(type==1) {
                            item.order_info.order_status = 4;
                            a.create_chat_right_order(item);
                            if (item.dom_order) {
                                item.dom_chat_list.addClass('on');
                                item.dom_order_wrap.html(item.dom_order);
                            }
                        }
                    }
                    var temp_order_info = {
                        time: a.get_timestamp(),
                        info: json
                    };
                    // 存储订单信息
                    localStorage.setItem('b_order_ajax_info_' + a.my_user_info.uid + '_' + item.uid, JSON.stringify(temp_order_info));
                }
            });
        },
        /**
         *创建聊天窗口
         *
         * @param {*} item
         */
        insert_chat_dom: function (item, is_one_item) {
            // 左侧
            a.create_chat_left(item);
            $(".chat_left ").append(item.dom_left);

            // 右侧
            a.create_chat_right(item);
            $(".chat_right ").append(item.dom_right);
            // 滚动到页面底部
            setTimeout(function () {
                a.scroll_bottom_fn(item, false);
            }, 200);

            if (!is_one_item) {
                item.dom_left.addClass("on").siblings().removeClass("on");
                item.dom_right.addClass("on").siblings().removeClass("on");
            }
        },
        /**
         *更改 滚动状态  设置当前窗口滚动状态为false，其它窗口为true ，用于新消息提醒
         *
         * @param {*} friend_user_info
         */
        change_scroll_status: function (ind) {
            $.each(a.friend_user_info, function (i, item) {
                if (i != ind) {
                    item._chat_scroll_status = true;
                } else {
                    a.scroll_bottom_fn(item, true);
                }
            });
        },
        /**
         *滚动到页面底部
         *
         */
        scroll_bottom_fn: function (item, is_see) {
            var scrollHeight = item.dom_right.find(".chat_list")[0].scrollHeight;// 聊天内容文档高度
            var clientHeight = item.dom_right.find(".chat_list")[0].clientHeight;// 可视区域高度
            var scrollTop = scrollHeight > clientHeight ? scrollHeight : clientHeight; // 取最高高度作为滚动高度
            item.dom_right.find(".chat_list")[0].scrollTop = scrollTop;
            if (is_see) {
                item._chat_scroll_status = false;
                item.dom_right.find(".new_msg_wrapper").removeClass("on");
                item.dom_right.find(".new_msg_wrapper").find(".num").text("0");
                item.dom_num.removeClass("on");
                item.dom_num.text("0");

                // 更新改变未读状态为已读
                a.update_see_status(item);
            };

        },
        /**
         * 判断文档是否是滚动到底部
         *
         * @returns true 到底部，false 没有到底部
         */
        check_scroll_bottom: function (item) {
            var scrollHeight = item.dom_right.find(".chat_list")[0].scrollHeight;// 聊天内容文档高度
            var clientHeight = item.dom_right.find(".chat_list")[0].clientHeight;// 可视区域高度
            var scrollTop = item.dom_right.find(".chat_list")[0].scrollTop;//隐藏区域高度
            if (scrollHeight - scrollTop == clientHeight) {
                // 如果 聊天内容文档高度-藏区域高度=可视区域高度  则代表滚动到页面底部
                return true;
            } else {
                return false;
            };
        },
        /**
         *创建 消息
         *
         * @param {*} info 窗口对象
         * @param {*} type type 0：提示信息，1:是时间,2:对方发的消息,3:自己发的消息,4:默认消息
         * @param {*} content 消息内容
         * @param {*} msg_type 消息类型（text文本，image图片，voice，语音,phone,通话）
         * @param {*} see_state 查看状态   true,false
         * @param {*} send_state 发送状态 0 发出，1 发送成功，2，发送失败
         * @param {*} to_uid 接收人id
         * @param {*} uid 发送人uid
         * @param {*} message_id 消息id
         * @param {*} avatar 发送消息人头像
         * @param {*} nickname  发送人昵称
         * @param {*} time 创建时间
         * @param {*} sequence_id 数据库消息id
         * @param {*} session_id 会话id
         * @returns
         */
        create_msg: function (info, type, content, msg_type, see_state, send_state, to_uid, uid, message_id, avatar, nickname, time, sequence_id, session_id) {
            // console.log(info,content);
            var msg_info = {
                type: type, // 1:是时间,2:对方发的消息,3:自己发的消息,4:默认消息
                content: content,// 消息内容
                msg_type: msg_type, // 消息类型（text文本，image图片，voice，语音）
                see_state: see_state, // 读取状态
                send_state: send_state, // 发送状态 0 发出，1 发送成功，2，发送失败
                to_uid: to_uid, // 接收人id
                uid: uid, // 发送人uid
                message_id: message_id,// 消息id
                sequence_id: '',// 数据库消息id
                session_id: '',// 会话id
                create_time: time,//创建时间
                avatar: avatar,//发送消息人头像
                nickname: nickname,//发送人昵称
            };
            if (sequence_id) {
                msg_info.sequence_id = sequence_id;
            }
            if (session_id) {
                msg_info.session_id = session_id;
            }
            if (type == 0 || type == 2 || type == 3|| type == 5|| type == 6) {
                info.send_text_temp.push(msg_info);
                // 获取当前 消息缓存
                var s_cur_chat_msgs = JSON.parse(localStorage.getItem("browser_chat_room_" + a.my_user_info.uid + "_" + info.uid));

                s_cur_chat_msgs.push(msg_info);
                localStorage.setItem("browser_chat_room_" + a.my_user_info.uid + "_" + info.uid, JSON.stringify(s_cur_chat_msgs));
            }
            if (msg_type == 'gift') {
                console.log(1111111);
                // 创建动效信息
                a.create_gift_animate(info, msg_info);
            }
            
            return msg_info;
        },
        /**
         *两次消息之间 发送间隔超过 5分钟，插入时间间隔
         *
         * @param {*} info 窗口对象
         * @param {*} message_id 消息id
         * @param {*} time 创建时间
         */
        insert_chat_time_dom: function (info, message_id, time) {
            // 五分钟未发送消息 插入时间
            if ((time - info._chat_temp_timestamp) > (5 * 60)) {
                var msg_info = a.create_msg(info, 1, message_id, "chat_time", true, 1, info.uid, a.my_user_info.uid, message_id, "", "", time);
                // 创建页面结构
                a.create_chat_item_dom(info, msg_info);
                // 加入页面
                info.dom_right.find(".chat_content").append(msg_info.dom);
                // 最新消息时间 赋值给 临时时间戳 用于下次判断 是否插入时间dom
                info._chat_temp_timestamp = time;
            };
        },
        /**
         *发送消息
         *
         * @param {*} arr
         */
        send_msg: function (info, content) {

            // 去除左右两端空格
            content = content.replace(/(^\s*)|(\s*$)/g, "");
            if (content == "") {
                layer.msg("消息不能为空");
                return false;
            };
            content = a.filterXSS(content);
            // 消息id 当前时间戳
            var message_id = a.get_timestamp(1);
            var time = a.get_timestamp();
            // 两次消息之间 发送间隔超过 5分钟，插入时间间隔
            a.insert_chat_time_dom(info, message_id, time);

            console.log(info);
            
            var wsdata = {
                action: 'one_chat',
                token: browser_user_info.token,
                device_id: browser_user_info.device_id,
                termtyp: 'web',
                data: {
                    message_id: message_id,// 消息id
                    content: content,//内容
                    msg_type: 'text',// 消息类型（text文本，image图片，voice，语音）
                    to_uid: info.uid// 发给谁
                }
            };
            // console.log(wsdata);
            // 发送信息
            _BROWSER_MESSG.to_ws(3000, JSON.stringify(wsdata));
            // a.to_trunk(2004, JSON.stringify(wsdata));
            // 生成消息对象
            var msg_info = a.create_msg(info, 3, content, "text", true, 0, info.uid, a.my_user_info.uid, message_id, a.my_user_info.avatar, a.my_user_info.nickname, time);
            // 创建 聊天结构
            a.insert_chat_item_dom(info, msg_info);
        },
        /**
         *发送图片消息
         *
         * @param {*} img_path
         */
        send_img_msg: function (return_info) {
            var info = a.get_ele_arr(a.friend_user_info, "uid", return_info.uid);
            // 消息id 当前时间戳
            var message_id = a.get_timestamp(1);
            var time = a.get_timestamp();
            var msg_info = {};

            msg_info = a.create_msg(info, 3, return_info.img_path, "image", true, 0, info.uid, a.my_user_info.uid, message_id, a.my_user_info.avatar, a.my_user_info.nickname, time);
            var wsdata = {
                action: 'one_chat',
                token: browser_user_info.token,
                device_id: browser_user_info.device_id,
                termtyp: 'web',
                data: {
                    message_id: message_id,// 消息id
                    content: return_info.img_path,//内容
                    msg_type: 'image',// 消息类型（text文本，image图片，voice，语音）
                    to_uid: info.uid// 发给谁
                }
            };
            // 发送消息
            _BROWSER_MESSG.to_ws(3000, JSON.stringify(wsdata));
            a.insert_chat_item_dom(info, msg_info);

            // 上传loading 隐藏
            info.dom_right.find(".up_img_status").removeClass("on");
        },
        /**
         *发送默认信息
         *
         * @param {*} userid 发送人uid
         * @param {*} avatar 发送人 头像
         * @param {*} nickname 发送人 昵称
         * @param {*} to_uid 接收人uid
         * @param {*} content 发送消息
         */
        send_normal_msg: function (userid, avatar, nickname, to_uid, content) {
            // 消息id 当前时间戳
            var message_id = a.get_timestamp(1);
            var time = a.get_timestamp();
            var temp_msg = {
                avatar: avatar,
                content: content,
                create_time: time,
                message_id: message_id,
                msg_type: "text",
                nickname: nickname,
                timestamp: time,
                to_uid: to_uid,
                userid: userid,
            };
            // 从哪里来
            var p_uid = userid;
            // 到哪里去
            var info = _BROWSER_CHAT.get_ele_arr(_BROWSER_CHAT.friend_user_info, "uid", p_uid);
            if (info) {//存在聊天窗口
                // 消息id 当前时间戳
                var message_id = a.get_timestamp(1);
                var time = a.get_timestamp();
                // 两次消息之间 发送间隔超过 5分钟，插入时间间隔
                a.insert_chat_time_dom(info, message_id, time);

                var msg_info = _BROWSER_CHAT.create_msg(info, 2, temp_msg.content, temp_msg.msg_type, true, 1, temp_msg.to_uid, temp_msg.userid, temp_msg.message_id, temp_msg.avatar, temp_msg.nickname,time);
                // 创建 聊天结构
                _BROWSER_CHAT.create_chat_item_dom(info, msg_info);
                // 加入页面
                info.dom_right.find(".chat_content").append(msg_info.dom);
                // 更改聊天面板未读消息  数量
                _BROWSER_CHAT.change_left_num(info);
            }
        },
        /**
         *发送礼物消息
         *
         * @param {*} arr
         */
        send_gift_msg: function (info, content) {
            // 消息id 当前时间戳
            var message_id = a.get_timestamp(1);
            var time = a.get_timestamp();
            // 两次消息之间 发送间隔超过 5分钟，插入时间间隔
            a.insert_chat_time_dom(info, message_id, time);
            var wsdata = {
                action: 'one_chat',
                token: a.my_user_info.token,
                device_id: a.my_user_info.device_id,
                termtyp: 'web',
                data: {
                    message_id: message_id,// 消息id
                    content: content,//内容
                    msg_type: 'gift',// 消息类型（text文本，image图片，voice，语音,gift:礼物消息）
                    to_uid: info.uid// 发给谁
                }
            };
            // console.log(wsdata);
            // 发送信息
            _BROWSER_MESSG.to_ws(3000, JSON.stringify(wsdata));
            // 生成消息对象
            var msg_info = a.create_msg(info, 3, content, "gift", true, 0, info.uid, a.my_user_info.uid, message_id, a.my_user_info.avatar, a.my_user_info.nickname, time);
            // 创建 聊天结构
            a.insert_chat_item_dom(info, msg_info);
            
        },
        /**
         * 聊天信息 插入 房间
         *
         * @param {*} msg_info 要插入的聊天信息
         */
        insert_chat_item_dom: function (info, msg_info) {
            // 创建 聊天结构
            a.create_chat_item_dom(info, msg_info);
            a.chats.push(msg_info);
            // 加入页面
            info.dom_right.find(".chat_content").append(msg_info.dom);
            // console.log(21212112211221);

            // 滚动到页面底部
            a.scroll_bottom_fn(info, false);

            // 标记 窗口打开状态（1：打开，2：打开之后第一次发送信息，undefined：关闭）

            setTimeout(function () {
                if (Number(LS.get("chat_room_status_" + a.my_user_info.uid + "_" + info.uid)) === 1) {
                    LS.set("chat_room_status_" + a.my_user_info.uid + "_" + info.uid, "2");
                    // info.message_id = msg_info.message_id;
                    var friend_notice = {
                        id: info.uid,
                        avatar: info.avatar,
                        nickname: info.nickname,
                        num: 0,
                        uid: info.uid,
                        login_status: info.login_status,
                        type: 2,
                        time: a.format_time(msg_info.create_time),
                        timestamp: msg_info.create_time,
                        dom: false
                    };
                    // 打开窗口第一次发送信息 给消息列表插入 用户信息
                    a.to_trunk(2006, JSON.stringify(friend_notice));
                }
            }, 500);
        },
        /**
         *关闭窗口
         *
         */
        close_pop: function () {
            window.close();
            

        },
        /**
         *关闭单个窗口
         *
         * @param {*} item
         */
        close_one_pop: function (item,is_del_store) {
            // console.log(item);
            var is_del = a.del_ele_arr(a.friend_user_info, "uid", item.uid, true);
            var l = a.friend_user_info.length;
            if (l == 0) {
                LS.set("browser_chat_user_info", "{}");
                a.change_check(2, false);
            } else {
                if (is_del) {
                    // 清除单个聊天窗口数据
                    a.del_ele_arr(a.b_chat_user_info, "uid", item.uid, false);
                    var temp_chat_user_info = JSON.parse(LS.get("browser_chat_user_info"));
                    delete(temp_chat_user_info[item.uid]);
                    // a.del_ele_arr(temp_chat_user_info, "uid", item.uid, false);
                    LS.set("browser_chat_user_info", JSON.stringify(temp_chat_user_info));
                    // 切换选中
                    a.change_check(a.friend_user_info[l - 1], false);
                }
            }

            if(is_del_store) {
                // 获取最新 消息列表 本地缓存
                var temp_LS = JSON.parse(LS.get("b_s_wf_notice_" + _BROWSER_CHAT.my_user_info.uid));
                // 清除 消息列表 本地缓存中 验证消息对象
                a.del_ele_arr(temp_LS.list, "id", item.id, false);
                // 更新 消息列表 本地缓存
                LS.set("b_s_wf_notice_" + _BROWSER_CHAT.my_user_info.uid, JSON.stringify(temp_LS));
                // 验证消息
                if (item.type == 1) {// 验证消息

                } else if (item.type == 2) {//好友消息
                    // 获取最新 消息列表 好友本地缓存
                    var temp_LS1 = JSON.parse(LS.get("b_s_wf_friend_notice_" + _BROWSER_CHAT.my_user_info.uid));
                    // 删除单个 消息列表 好友本地缓存
                    a.del_ele_arr(temp_LS1, "id", item.id, false);
                    // 更新 消息列表 好友本地缓存
                    LS.set("b_s_wf_friend_notice_" + _BROWSER_CHAT.my_user_info.uid, JSON.stringify(temp_LS1));
                }
            }
        },
        /**
         *
         * =============================================================================
         *
         * ===============================聊天消息操作================================
         *
         * =============================================================================
         *
         */
        /**
         *获取单个用户头像和昵称
         *
         * @param {*} json 数据源
         * @param {*} callback
         * @returns
         */
        get_user_avatar_one: function (json, callback) {
            callback(json);
            return;
            // if (!json.avatar || !json.nickname) {
                // 是否存在好友信息
                var is_exit = false;
                var temp_friend = {};
                for (var i in DATA.wf_notice) {
                    if (DATA.wf_notice[i].to_uid == json.userid) {
                        is_exit = true;
                        temp_friend = DATA.wf_notice[i];
                        break;
                    }
                }
                if (is_exit) {// 存在聊天好友
                    json.avatar = temp_friend.avatar;
                    json.nickname = temp_friend.nickname;
                    callback(json);
                } else {// 不存在
                    var urls = '/user/message/getChatUserInfo';
                    var post_data = {
                        token: browser_user_info.token,
                        device_id: browser_user_info.device_id,
                        termtyp: 'web',
                        to_uid: json.userid
                    };
                    a.ajax(urls, post_data, function (res) {
                        if (res.status === 0) {
                            var user_info = res.data.user_info;
                            if (user_info.length > 0) {
                                var temp_user_info = user_info[0];
                                if (temp_user_info) {
                                    json.avatar = temp_user_info.avatar;
                                    json.nickname = temp_user_info.nickname;
                                    callback(json);
                                } else {
                                    callback(false);
                                }
                            } else {
                                callback(false);
                            }
                        } else {
                            callback(false);
                        }
                    });
                }
            // } else {
            //     callback(json);
            // }
        },
        /**
         * 消息列表内容
         *
         */
        get_notice_list: function () {
            var service_obj = {
                uid:'888888',
                nickname:'在线客服',
                avatar:public_domain+'/user/img/index/chat/ico_10.png'
            };
            a.create_chat_top(service_obj);
            $('.top_title.chat_top_title').html(service_obj.dom_top);
            $(".top_title.chat_top_title .btn").hide();
            // 获取地址栏参数
            var url_param = a.get_url_param("pw_uid");
            // 重新获取聊天好友信息
            _BROWSER_CHAT.friend_user_info = JSON.parse(LS.get("b_s_wf_friend_notice_" + _BROWSER_CHAT.my_user_info.uid));
            // 排序
            _BROWSER_CHAT.bubbleSort(_BROWSER_CHAT.friend_user_info,"timestamp");
            if (url_param) {
                var friend_user_info_i = JSON.parse(LS.get("temp_friend_info"));//单个陪玩信息

                var is_check = false;// 标记是否应该执行切换选项卡函数
                if (friend_user_info_i && url_param == friend_user_info_i.uid && _BROWSER_CHAT.friend_user_info && !a.is_exist_fn(_BROWSER_CHAT.friend_user_info, "uid", url_param)) {
                    // 本地存储存在单个陪玩信息 && 地址栏参数跟存储数据uid一致 && 聊天好友不存在跟地址栏参数一致好友
                    _BROWSER_CHAT.friend_user_info.push(friend_user_info_i);//把单条信息加入聊天好友信息
                    is_check = true;//标记 执行选项卡切换
                } else if (friend_user_info_i && _BROWSER_CHAT.friend_user_info && a.is_exist_fn(_BROWSER_CHAT.friend_user_info, "uid", url_param)) {
                    // 本地存储存在单个陪玩信息 && 聊天好友存在跟地址栏参数一致好友
                    friend_user_info_i = a.get_ele_arr(_BROWSER_CHAT.friend_user_info, "uid", url_param);
                    if (friend_user_info_i) {
                        //更新单个陪玩缓存
                        LS.set("temp_friend_info", JSON.stringify(friend_user_info_i));
                        is_check = true;
                    } else {
                        is_check = false;
                    };
                }
                $.each(_BROWSER_CHAT.friend_user_info, function (i, item) {
                    _BROWSER_CHAT.show_chat_pop(item, false);
                });
                // 选显卡切换到跟地址栏参数一致uid好友
                if (is_check) {
                    setTimeout(function () {
                        _BROWSER_CHAT.change_check(friend_user_info_i, true);
                    }, 100);
                }
            } else {
                // 插入页面
                if (_BROWSER_CHAT.friend_user_info && _BROWSER_CHAT.friend_user_info.length) {
                    $.each(_BROWSER_CHAT.friend_user_info, function (i, item) {
                        if(_BROWSER_CHAT.friend_user_info.length-1 === i) {
                            
                            _BROWSER_CHAT.show_chat_pop(item, false);
                            var is_service = a.get_url_param('is_service');
                            if (is_service == 1) {
                                setTimeout(function () {
                                    _BROWSER_CHAT.change_check(2, false)
                                }, 100)
                            }else{
                                setTimeout(function () {
                                    _BROWSER_CHAT.change_check(item, true);
                                }, 100);
                            }
                        }else {
                            _BROWSER_CHAT.show_chat_pop(item, false);
                        }

                    });
                }
            }
        },
        /**
         *弹出聊天框
         *
         * @param {*} item 好友数据
         * @param {*} is_one_item 是否是单独一个打开
         */
        show_chat_pop: function (item, is_one_item) {
            /**
             * ===================================chat_step_1_1============================
             *
             *    聊天第一步 打开聊天窗口
             *
             *
             * ==========================================================================
             */
            var chat_data_fn = function (item) {
                // 标记 窗口打开状态（1：打开，2：打开之后第一次发送信息，undefined：关闭）
                LS.set("chat_room_status_" + a.my_user_info.uid + "_" + item.uid, "1");
                // 获取当前房间 聊天信息缓存
                var s_chat_room_msg = JSON.parse(LS.get("browser_chat_room_" + a.my_user_info.uid + "_" + item.uid));
                // 当前房间聊天信息数量
                if (!s_chat_room_msg || s_chat_room_msg.length < 1) {//不存在 则创建缓存
                    LS.set("browser_chat_room_" + a.my_user_info.uid + "_" + item.uid, "[]");
                } else {// 存在

                    if (s_chat_room_msg.length > 100) {// 本地只保留最新100条数据
                        // 超过的条数
                        var del_num = s_chat_room_msg.length - 100;
                        // 删除超过的数量
                        s_chat_room_msg.splice(0, del_num);
                    }
                    LS.set("browser_chat_room_" + a.my_user_info.uid + "_" + item.uid, JSON.stringify(s_chat_room_msg));
                }
            };
            // 缓存用户信息
            var store_user_info = function (item) {
                // var temp_item = ;
                _BROWSER_CHAT.b_chat_user_info[item.id]= item;
                // console.log(_BROWSER_CHAT.b_chat_user_info);

                // 聊天id 存入缓存
                LS.set("browser_chat_user_info", JSON.stringify(_BROWSER_CHAT.b_chat_user_info));
            };

            // 告诉聊天窗口谁来了
            var tel_chat = function (item, is_exist, is_first) {
                // console.log(11111111111111);

                // 给聊天窗口发送信息告诉谁来了
                var to_chat_msg = {
                    uid: item.uid,
                    avatar: item.avatar,
                    chat_id: item.uid,// 聊天人员id
                    nickname: item.nickname,//昵称
                    is_exist: is_exist,//聊天窗口是否存在
                    is_first: is_first,//是否是首次打开聊天面板
                    is_one_item: is_one_item,//是否是单独打开
                };
                // _BROWSER_MESSG.to_chat(102, 3007, JSON.stringify(to_chat_msg));

                $.each(JSON.parse(LS.get("browser_chat_user_info")), function (i, item) {

                    // 不在_BROWSER_CHAT.friend_user_info 中存在，才加进去
                    if (!_BROWSER_CHAT.is_exist_fn(_BROWSER_CHAT.friend_user_info, "uid", i)) {
                        _BROWSER_CHAT.friend_user_info.push(item);
                    }
                });
                if (to_chat_msg.is_exist && item.dom_left) {
                    // // 单独一个打开
                    // if(is_one_item) {
                    //     _BROWSER_CHAT.change_check(to_chat_msg);
                    // }
                } else {
                    var temp_chat = _BROWSER_CHAT.get_ele_arr(_BROWSER_CHAT.friend_user_info, "uid", to_chat_msg.uid);
                    if (temp_chat) {
                        _BROWSER_CHAT.insert_chat_dom(temp_chat, is_one_item);
                    }
                }
            };
            // 聊天用户信息存储
            store_user_info(item);
            // 用户 聊天消息操作
            chat_data_fn(item);
            // 告诉聊天窗口谁来了
            tel_chat(item, 0, 0);
            // 标记窗口打开
            _BROWSER_CHAT.chat_pop_show = true;
        },
        /**
         *更新改变未读状态为已读
         *
         * @param {*} item 当前聊天对象
         */
        update_see_status: function (item) {
            // 当前窗口 聊天信息缓存
            var s_chat_room_msg = JSON.parse(LS.get("browser_chat_room_" + a.my_user_info.uid + "_" + item.uid));
            if (s_chat_room_msg.length > 0) {
                // 所有数据 未读状态修改 为已读
                a.edit_ele_arr(s_chat_room_msg, "see_state", false, "see_state", true);
                // 设置缓存
                LS.set("browser_chat_room_" + a.my_user_info.uid + "_" + item.uid, JSON.stringify(s_chat_room_msg));
                item.num = 0;
                // 更新 好友 dom
                a.update_friend_notice(item);

                // 消息列表，聊天消息本地缓存
                // 消息列表内容
                var friend_notice = {
                    id: item.uid,
                    avatar: item.avatar,
                    nickname: item.nickname,
                    num: 0,
                    uid: item.uid,
                    login_status: item.login_status,
                    type: 2,
                    time: a.format_time(s_chat_room_msg[s_chat_room_msg.length - 1].create_time),
                    timestamp: s_chat_room_msg[s_chat_room_msg.length - 1].create_time,
                    dom: false
                };
                // 更新消息列表本地存储
                a.set_LS_friend_notice(friend_notice);

            }

        },
        // 判断图片类型
        check_file: function (filePath, obj, this_file, uid) { //input $(this).val()，$(this),this
            var _this = a;
            var filePath = filePath;
            if ("" != filePath) {
                var fileType = this.getFileType(filePath);
                //判断上传的附件是否为图片
                if ("jpg" != fileType && "jpeg" != fileType && "bmp" != fileType && "png" != fileType && "gif" != fileType) {
                    layer.msg("请上传JPG,JPEG,BMP,PNG,GIF格式的图片");
                    return false;
                } else {
                    //获取附件大小（单位：KB）
                    var fileSize = this_file.files[0].size / 1024;
                    if (fileSize > 2408) {
                        layer.msg("图片大小不能超过2MB");
                        return false;
                    } else {
                        // 又拍云 第一步
                        _this.uploadStep1(this_file.files[0], uid, fileType);
                        return true;
                    }
                }
            }
        },
        // 获取文件类型
        getFileType: function (filePath) {
            var startIndex = filePath.lastIndexOf(".");
            if (startIndex != -1)
                return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
            else return "";
        },
        // 又拍云上传 step1
        uploadStep1: function (file, uid,file_ext) {
            var _this = a;
            var ajax_url = "/user/upyunfile/upYunFormApiSign";
            var post_data = {
                file_ext: file_ext,
                file_type: file.type,
                uploadPath: 'files'
            };
            a.ajax(ajax_url, post_data, function (res) {
                if (res.code == 1) {

                    var policy = res.data.policy;
                    var authorization = res.data.authorization;
                    // 又拍云 第二步
                    _this.uploadStep2("https://v0.api.upyun.com/dianjing", file, uid, policy, authorization);
                } else {
                    layer.msg('发送失败');
                };
            });

        },
        // 又拍云上传 step2
        uploadStep2: function (url, file, uid, policy, authorization) {
            var _this = a;
            var fd = new FormData();
            fd.append('file', file);//上传的文件： 键名，键值
            fd.append('policy', policy);//上传的文件： 键名，键值
            fd.append('authorization', authorization);//上传的文件： 键名，键值
            var XHR = null;
            if (window.XMLHttpRequest) {
                // 非IE内核
                XHR = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                // IE内核，这里早期IE版本不同，具体可以查下
                XHR = new ActiveXObject("Microsoft.XMLHTTP");
            } else {
                XHR = null;
            }
            if (XHR) {
                XHR.open("POST", url);
                XHR.onreadystatechange = function () {
                    if (XHR.readyState == 4 && XHR.status == 200) {
                        var resultValue = XHR.responseText;
                        //  返回数据
                        var data = JSON.parse(resultValue);

                        var file_path = data.url;
                        var file_size = data.file_size;
                        var mimetype = data.mimetype;
                        // 又拍云 第三步
                        _this.uploadStep3(file_path, file_size, mimetype, uid);

                        XHR = null;
                    }
                }
                XHR.send(fd);
            }
        },
        // 又拍云上传 step3 需要新图片上传接口
        uploadStep3: function (file_path, file_size, mimetype, uid) {
            var _this = a;
            var img_url = "https://img1.daofengdj.com" + file_path;
            var to_chat_info = {
                img_path: img_url,
                uid: uid
            };
            if (file_path) {
                _BROWSER_CHAT.send_img_msg(to_chat_info);
            } else {
                layer.msg("图片上传失败");
            }

        },
        /**
         *设置消息列表 本地缓存
         *
         * @param {*} item 验证消息 或者 好友消息
         */
        set_LS_wf_notice: function (item) {
            if (item.uid == a.my_user_info.uid) {
                return;
            }
            // 消息列表缓存 数据
            var temp_notice = JSON.parse(LS.get("b_s_wf_notice_" + a.my_user_info.uid));
            // 判断数组中是否存在 验证消息数据
            var s_p_num = a.get_ele_num(temp_notice.list, "id", item.id);
            if (s_p_num > 0) {// 本地存在 验证消息 则删除 再追加
                //console.log(555555);
                if (a.del_ele_arr(temp_notice.list, "id", item.id, false)) {
                    temp_notice.list.push(item);
                };
                LS.set("b_s_wf_notice_" + a.my_user_info.uid, JSON.stringify(temp_notice));
            } else {
                //console.log(66666);
                temp_notice.list.push(item);
                LS.set("b_s_wf_notice_" + a.my_user_info.uid, JSON.stringify(temp_notice));
            }
        },
        /**
         * 插入消息列表 好友消息dom
         *
         * @param {*} item
         */
        insert_wf_friend_notice: function (friend_notice) {
            // console.log(232323);

            // console.log(friend_notice);
            // 存储 消息列表 聊天数据
            a.set_LS_friend_notice(friend_notice);

            // 判断数组中是否存在 好友消息数据
            // console.log(_BROWSER_CHAT.friend_user_info);

            var s_f_num = a.get_ele_num(_BROWSER_CHAT.friend_user_info, "id", friend_notice.id);
            if (s_f_num > 0) {// 本地存在 好友消息 则删除 再追加
                // var info = _BROWSER_CHAT.get_ele_arr(_BROWSER_CHAT.friend_user_info, "uid", friend_notice.uid);
                // if (info) {//存在聊天窗口
                //     var msg_info = _BROWSER_CHAT.create_msg(info, 2, data.content, data.msg_type, true, 1, data.to_uid, data.uid, data.message_id, data.avatar, data.nickname);
                //     // 创建 聊天结构
                //     _BROWSER_CHAT.create_chat_item_dom(info, msg_info);
                //     // 加入页面
                //     info.dom_right.find(".chat_content").append(msg_info.dom);
                //     // 更改聊天面板未读消息  数量
                //     _BROWSER_CHAT.change_left_num(info);
                // }
            } else {
                _BROWSER_CHAT.friend_user_info.unshift(friend_notice);
                // 如果弹窗打开了
                if (_BROWSER_CHAT.chat_pop_show) {
                    // console.log(12212211212212121);

                    // 生成dom 结构
                    a.insert_chat_dom(friend_notice, true);
                }

            }
        },
        /**
         * 聊天窗口不存在 则聊天信息 添加到本地缓存
         *
         * @param {*} json
         */
        set_LS_msg: function (json1) {
            // console.log(json);
            a.get_user_avatar_one(json1, function (json) {
                if (json) {
                    LS.set("b_max_sequence_id_" + a.my_user_info.uid, json.sequence_id + "");
                    // 获取当前房间 聊天信息缓存
                    var s_chat_room_msg = JSON.parse(LS.get("browser_chat_room_" + a.my_user_info.uid + "_" + json.userid));
                    if (!s_chat_room_msg) {//不存在 聊天缓存
                        // 聊天消息对象
                        var msg_info = [{
                            content: json.content,// 消息内容
                            msg_type: json.msg_type, // 消息类型（text文本，image图片，voice，语音）
                            send_state: true, // 发送状态
                            to_uid: json.to_uid, // 接收人id
                            uid: json.userid, // 发送人uid
                            message_id: json.message_id,// 消息id
                            sequence_id: json.sequence_id,// 数据库消息id
                            session_id: json.session_id,// 会话id
                            create_time: json.timestamp,//创建时间
                            avatar: json.avatar,//发送消息人头像
                            nickname: json.nickname,//发送人昵称
                        }];
                        if (json.location == 3) {// 敏感消息
                            msg_info[0].type = 0;// 1:是时间,2:对方发的消息,3:自己发的消息
                            msg_info[0].see_state = true; // 读取状态
                        } else if (json.location == 2) {
                            msg_info[0].type = 3;// 1:是时间,2:对方发的消息,3:自己发的消息
                            msg_info[0].see_state = true; // 读取状态
                        } else if (json.location == 1) {
                            msg_info[0].type = 2;// 1:是时间,2:对方发的消息,3:自己发的消息
                            msg_info[0].see_state = false; // 读取状态
                        }
                        // 设置缓存
                        LS.set("browser_chat_room_" + a.my_user_info.uid + "_" + json.userid, JSON.stringify(msg_info));
                    } else {// 存在
                        // 聊天消息对象
                        var msg_info = {
                            content: json.content,// 消息内容
                            msg_type: json.msg_type, // 消息类型（text文本，image图片，voice，语音）
                            send_state: true, // 发送状态
                            to_uid: json.to_uid, // 接收人id
                            uid: json.userid, // 发送人uid
                            message_id: json.message_id,// 消息id
                            sequence_id: json.sequence_id,// 数据库消息id
                            session_id: json.session_id,// 会话id
                            create_time: json.timestamp,//创建时间
                            avatar: json.avatar,//发送消息人头像
                            nickname: json.nickname,//发送人昵称
                        };
                        if (json.location == 3) {// 敏感消息
                            msg_info.type = 0;// 1:是时间,2:对方发的消息,3:自己发的消息
                            msg_info.see_state = true; // 读取状态
                        } else if (json.location == 2) {
                            msg_info.type = 3;// 1:是时间,2:对方发的消息,3:自己发的消息
                            msg_info.see_state = true; // 读取状态
                        } else if (json.location == 1) {
                            msg_info.type = 2;// 1:是时间,2:对方发的消息,3:自己发的消息
                            msg_info.see_state = false; // 读取状态
                        }
                        // 加入列表
                        s_chat_room_msg.push(msg_info);
                        // 设置缓存
                        LS.set("browser_chat_room_" + a.my_user_info.uid + "_" + json.userid, JSON.stringify(s_chat_room_msg));
                    }
                    if (json.location == 1) {//接收的消息
                        // 未读消息数
                        var num = a.get_ele_num(JSON.parse(LS.get("browser_chat_room_" + a.my_user_info.uid + "_" + json.userid)), "see_state", false);
                        // 更新消息列表数据
                        // 消息列表内容
                        var friend_notice = {
                            id: json.userid,
                            avatar: json.avatar,
                            nickname: json.nickname,
                            num: num,
                            uid: json.userid,
                            login_status: 1,
                            type: 2,
                            time: a.format_time(json.timestamp),
                            timestamp: json.timestamp,
                            dom: false
                        };
                        // 判断消息列表是否存在好友对象
                        var temp_notice_dom = a.get_ele_arr(_BROWSER_CHAT.friend_user_info, "uid", json.userid);
                        // console.log(temp_notice_dom);

                        if (temp_notice_dom && temp_notice_dom.dom_left) {// 存在则直接更新
                            // 更新 新消息数量
                            var msg_info = _BROWSER_CHAT.create_msg(temp_notice_dom, 2, json.content, json.msg_type, true, 1, json.to_uid, json.uid, json.message_id, json.avatar, json.nickname, json.timestamp);
                            // 创建 聊天结构
                            _BROWSER_CHAT.create_chat_item_dom(temp_notice_dom, msg_info);
                            // 加入页面
                            temp_notice_dom.dom_right.find(".chat_content").append(msg_info.dom);
                            // 更改聊天面板未读消息  数量
                            _BROWSER_CHAT.change_left_num(temp_notice_dom);
                        } else {// 不存在 创建
                            // 更新 消息列表 好友信息
                            a.insert_wf_friend_notice(friend_notice);
                        };
                    }
                }
            })
        },
        /**
         * 更新消息列表 好友信息
         *
         * @param {*} friend_notice 好友信息
         */
        update_friend_notice: function (friend_notice) {
            // 获取好友对象
            var f_n_obj = a.get_ele_arr(_BROWSER_CHAT.friend_user_info, "uid", friend_notice.uid);
            if (f_n_obj) {// 存在 聊天消息
                // 更新 新消息数量
                f_n_obj.dom_num.text(friend_notice.num);
                if (friend_notice.num > 0) {
                    f_n_obj.dom_num.addClass("on");
                } else {
                    f_n_obj.dom_num.removeClass("on");
                };
            };
        },
        /**
         *设置 消息列表 好友缓存
         *
         * @param {*} unread_prove_num  数量
         * @param {*} time  时间
         */
        set_LS_friend_notice: function (friend_notice) {
            if (friend_notice.uid == a.my_user_info.uid) {
                return;
            }
            // 消息列表，聊天消息本地缓存
            var s_f_n = JSON.parse(LS.get("b_s_wf_friend_notice_" + a.my_user_info.uid));
            if (!s_f_n) {//不存在
                s_f_n = [];
                s_f_n.push(friend_notice);
                LS.set("b_s_wf_friend_notice_" + a.my_user_info.uid, JSON.stringify(s_f_n));
                // 消息列表缓存 数据
                a.set_LS_wf_notice(JSON.parse(LS.get("b_s_wf_friend_notice_" + a.my_user_info.uid))[0]);
            } else {//存在
                // 判断数组中是否存在 好友消息数据
                var s_f_num = a.get_ele_num(s_f_n, "uid", friend_notice.uid);
                if (s_f_num > 0) {// 本地存在 好友消息 则删除 再追加
                    // console.log(9);
                    if (a.del_ele_arr(s_f_n, "uid", friend_notice.uid, false)) {
                        s_f_n.push(friend_notice);
                    };
                    // console.log(s_f_n);

                    LS.set("b_s_wf_friend_notice_" + a.my_user_info.uid, JSON.stringify(s_f_n));
                } else {
                    // console.log(10);
                    s_f_n.push(friend_notice);
                    // console.log(s_f_n);
                    LS.set("b_s_wf_friend_notice_" + a.my_user_info.uid, JSON.stringify(s_f_n));
                }
                // 消息列表缓存 数据
                $.each(JSON.parse(LS.get("b_s_wf_friend_notice_" + a.my_user_info.uid)), function (index, item) {
                    a.set_LS_wf_notice(item);
                });

            };
        },
        /**
         * 更新 消息列表 好友消息
         *
         * @param {*} info
         * @param {*} num
         */
        update_notice_friend: function (info, num) {
            // alert(DATA.wf_notice.list);
            // 更新数量
            // 消息列表 好友缓存
            var s_w_f_n = JSON.parse(LS.get("b_s_wf_friend_notice_" + a.my_user_info.uid));

            if (s_w_f_n && s_w_f_n.length > 0) {// 存在
                var temp_arr = a.get_ele_arr(s_w_f_n, "uid", info.uid);
                if (temp_arr) {
                    temp_arr.num = num;
                } else {
                    // 消息列表内容
                    var friend_notice = {
                        id: info.uid,
                        avatar: info.avatar,
                        nickname: info.nickname,
                        num: num,
                        uid: info.uid,
                        login_status: 1,
                        type: 2,
                        time: a.format_time(info.create_time),
                        timestamp: info.create_time,
                        dom: false
                    };
                    s_w_f_n.push(friend_notice);
                };

            } else {// 不存在
                s_w_f_n = [];
                // 更新 消息列表 好友数据
                // 消息列表内容
                var friend_notice = {
                    id: info.uid,
                    avatar: info.avatar,
                    nickname: info.nickname,
                    num: num,
                    uid: info.uid,
                    login_status: 1,
                    type: 2,
                    time: a.format_time(info.create_time),
                    timestamp: info.create_time,
                    dom: false
                };
                s_w_f_n.push(friend_notice);
            };
            // 更新 消息列表 本地存储
            $.each(s_w_f_n, function (index, item) {
                a.set_LS_friend_notice(item);
            });

        },
        /**
         *
         * =============================================================================
         *
         * ===============================dom创建================================
         *
         * =============================================================================
         *
         */
        /**
         *聊天窗口头部
         *
         * @param {*} item
         */
        create_chat_top:function(item) {
            var obj = $("<div></div>");
            var str = "";
            str += '<div class="top_left">';
            str += '    <img src="' + item.avatar + '" alt="" class="avatar">';
            str += '</div>';
            str += '<div class="top_middle"><div class="title">' + item.nickname + '</div><a href="/item/'+item.uid+'.html" class="btn" target="_blank">立即下单</a></div>';
            str += '<a class="top_right" href="/" target="_blank"><img src="'+public_domain+'/user/img/index/chat/ico_22.png" alt=""></a>';
            obj.html(str);
            if (Number(item.uid) >= 80001 && Number(item.uid) <= 80020) {
                obj.addClass("customer");
            }
            item.dom_top = obj;
            item.dom_top_btn = obj.find('.btn');
        },
        /**
         *聊天窗口广告位
         *
         * @param {*} item
         */
        create_chat_ad:function(item) {
            var obj = $("<div></div>");
            // obj.addClass('ad-content');
            var str = "";
            str += '<div class="ma">';
            str += '    <img src="'+public_domain+'/user/img/index/chat/ico_23.png" alt="" class="avatar">';
            str += '</div>';
            if(item.list.length>0) {
                str += '<div class="bt">官方活动</div>';
                str += '<div class="ad-box">';
                for (var i in item.list) {
                    if(i<2){
                        str += '<a class="ad-i" href="'+(item.list)[i].url+'" title="'+(item.list)[i].title+'" target="_blank"><img src="'+(item.list)[i].path+'" alt="" class="img-ad"></a>';
                    }
                }
                str += '</div>';
            }

            obj.html(str);
            item.dom = obj;

        },
        /**
         *聊天窗口左侧
         *
         * @param {*} item
         */
        create_chat_left: function (item) {
            // console.log('aaa',item);

            var obj = $("<div></div>");
            obj.attr("class", "chat_l_i");
            obj.addClass("chat_l_id_" + item.uid);
            obj.attr("nickname", item.nickname);
            obj.attr("uid", item.uid);
            if (item.is_on) {
                obj.attr("class", "on");
            }
            if (Number(item.uid) >= 80001 && Number(item.uid) <= 80020) { 
                obj.addClass("customer");
            }
            var str = "";
            str += '<div class="avatar_w">';
            str += '	<div class="wai">';
            str += '		<div class="nei">';
            str += '			<img src="' + item.avatar + '" alt="" class="avatar">';
            if(Number(item.uid)>=80001 && Number(item.uid)<=80020) {
                str += '<img src="'+public_domain+'/clientv2_static/wwwimg/medal_kefu.png" class="gf" style="width: 24px;\n' +
                    '    height: 24px;\n' +
                    '    position: absolute;\n' +
                    '    right: -2px;\n' +
                    '    bottom: -5px;">';
            }
            str += '		</div>';
            str += '	</div>';
            str += '</div>';
            str += '<div class="info_w">';
            str += '	<div class="nickname">' + item.nickname + '</div>';
            str += '	<div class="msg">UID:' + item.uid + '</div>';
            str += '</div>';
            str += '<div class="time_wrapper">';
            if (item.time) {
                str += '	<div class="time on">' + item.time + '</div>';
            } else {
                str += '	<div class="time"></div>';
            };
            if (item.num) {
                str += '	<div class="no_num on">' + item.num + '</div>';
            } else {
                str += '	<div class="no_num">0</div>';
            };
            str += '	<i class="icon_close"></i>';
            str += '</div>';
            obj.html(str);
            item.dom_left = obj;
            // 关闭
            item.dom_close_btn = obj.find(".icon_close");
            item.dom_num = obj.find(".no_num");
            // 头部切换
            obj.on("click", function () {
                _BROWSER_CHAT.change_check(item, true);
            });
            // 关闭聊天窗口
            item.dom_close_btn.on("click", function () {
                a.close_one_pop(item,1);
            });

            
        },
        createGradeHtml:function(json) {
            console.log('bbb进来了2');
            var obj = $("<div></div>");
            obj.attr('class','success_promotion p-mask');
            var str = "";
            str +=    '<div class="info"> ' +
                '<div class="grade_box">'+json.after+'</div>' +
                '<div class="title">恭喜您</div>' +
                '<div class="sub_title">贵族等级从 <span>'+json.before+'</span> 升级至 <span>'+json.after+'</span></div>';
            // str +=        '<div class="msg">恭喜您从' + json.before + '晋级为' + json.after+'</div>';
            str +=        '<a class="link" href="/user/usercenter/index.html">查看我的特权</a>';
            str +=        '<p class="btn"></p>';
            str +=    '</div>';
            obj.html(str);
            json.dom = obj;

            obj.find(".btn").click(function(){
                obj.remove();
            });
            console.log('结束啦进来了3');
            $("body").append(json.dom);
        },
        /**
         *聊天窗口主体
         *
         * @param {*} item
         */
        create_chat_right: function (item) {
            var info_data = item;
            var obj = $("<div></div>");
            obj.attr("class", "chat_right_i");
            obj.addClass("chat_r_id_" + item.uid);
            if (item.is_on) {
                obj.attr("class", "on");
            }
            var str = "";
            str += '<div class="order_wrap"></div>';
            str += '<div class="gift_animate_wrap"></div>';
            str += '<div class="chat_list">';
            str += '	<div class="chat_content"></div>';
            str += '	';
            str += '	<!-- 新消息提醒 -->';
            str += '	<div class="new_msg_wrapper">';
            str += '		<i class="icon"></i>';
            str += '		<span class="text"><span class="num">0</span>条新消息</span>';
            str += '		<i class="new_close"></i>';
            str += '	</div>';
            str += '	<!-- 图片上传 -->';
            str += '	<div class="up_img_status" msg="奋力上传图片">';
            str += '		<p>';
            str += '			正在奋力上传...';
            str += '			<img src="' + public_domain + '/user/img/index/chat/loading.gif" alt="" class="icon">';
            str += '		</p>';
            str += '	</div>';
            str += '	<!-- 图片放大弹窗 -->';
            str += '	<div class="img_pop">';
            str += '		<span class="img_close"><span class="close"></span></span>';
            str += '		<div class="wai">';
            str += '			<div class="nei">';
            str += '				<img src="' + public_domain + '/user/img/index/chat/loading.gif" alt="" class="icon">';
            str += '			</div>';
            str += '		</div>';
            str += '	</div>';
            str += '</div>';
            str += '<div class="chat_input_wrapper">';
            str += '	<div class="top_btn">';
            str += '		<div class="emoji_btn btn"><i class="icon"></i></div>';
            str += '		<div class="upload_img_btn btn"><i class="icon"></i></div>';
            str +=      '<div class="gift_btn btn"><i class="icon"></i></div>';
            str += '	</div>';
            str += '	<textarea class="chat_inpt" name="chat_inpt" id="chat_inpt' + item.uid + '"></textarea>';
            str += '	<div class="btn_wrapper">';
            str += '		<div class="cancel_btn btn">关闭</div>';
            str += '		<div class="send_btn btn">发送</div>';
            str += '		<input type="file" style="display: none" class="img_inpt" id="send_img_file_' + item.uid + '"></input>';
            str += '	</div>';
            str += '	<!-- 颜表情 -->';
            str += '	<ul class="emoji_box" onmousedown="return false;" unselectable="on" >';
            for (var i = 1, len = _BROWSER_CHAT.emoji_array.length; i <= len; i++) {
                var path = public_domain + "/user/img/index/chat/face_30/" + "emoji_" + i + ".png";
                var tit = _BROWSER_CHAT.emoji_array[i - 1];
                str += '<li class="emoji_item" title="' + tit + '"><img class="s_ico" src="' + path + '"></li>';
            };
            str += '	</ul>';
            str +=   '<!-- 礼物 -->';
            str +='<div class="gift_box">';
            str +=    '<div class="gift_top">';
            str +=        '<div class="close_box"><span class="close_btn btn"></span></div>';
            str +=        '<div class="top_title gift_top_title"><span class="title">礼物盒子</span></div>';
            str +=    '</div>';
            str +=     '<div class="gift_wrap">';
            str +=        '<ul class="gift_list">';
            for (var j in a.gift) {
                str += '<li class="gift_i" data-id="' + a.gift[j].id + '" data-price="' + a.gift[j].price + '" data-path="' + a.gift[j].icon_path +'" data-name="'+a.gift[j].name+'">';
                str +=            '<img src="'+a.gift[j].icon_path+'" alt="" class="gift_img">';
                str +=            '<div class="name">'+a.gift[j].name+'</div>';
                str +=            '<div class="num">'+a.gift[j].price+'钻石</div>';
                str +=        '</li>';
            };
            str +=       '</ul>';
            str +=    '</div>';
            str +=    '<div class="gift_bottom">';
            str +=        '<img src="'+public_domain + '/user/img/index/chat/ico_15.png" alt="" class="diamond_img">';
            str +=        '<span class="diamond_text">' + a.my_user_info.diamond + '钻石</span>';
            str +=        '<span class="line"></span>';
            str +=        '<span class="recharge">充值 <img src="'+public_domain + '/user/img/index/chat/ico_16.png" alt="" class="recharge_more"></span>';
            str +=        '<div class="send_wrap">';
            str +=            '<span class="left">';
            str +=                '<input type="text" class="send_inp" value="1">';
            str +=                '<div class="send_more_wrap">'
            str +=                    '<img src="'+public_domain + '/user/img/index/chat/ico_16.png" alt="" class="send_more">';
            str +=                    '<div class="send_more_list_wrap">';
            str +=                        '<ul class="send_more_list">';
            str +=                            '<li class="send_more_i" data-val="1314">×1314（一生一世）</li>';
            str +=                            '<li class="send_more_i" data-val="520">×520（情有独钟）</li>';
            str +=                            '<li class="send_more_i" data-val="66">×66（六六大顺）</li>';
            str +=                            '<li class="send_more_i" data-val="30">×30（情不自禁）</li>';
            str +=                            '<li class="send_more_i" data-val="10">×10（十全十美）</li>';
            str +=                            '<li class="send_more_i last" data-val="1">×1（一心一意）</li>';
            str +=                        '</ul>';
            str +=                        '<div class="ico" ></div>';
            str +=                    '</div>';
            str +=                '</div>'
            str +=            '</span>';
            str +=            '<span class="right send_gift_btn">打赏</span>';
            str +=        '</div>';
            str +=    '</div>';
            str +='</div>';
            str += '</div>';

            obj.html(str);
            item.dom_right = obj;
            // 聊天消息主体
            item.dom_chat_list = obj.find('.chat_list');
            //订单流程
            item.dom_order_wrap = obj.find('.order_wrap');
            // 缓存最新一条消息 时间，用于判断下次发送消息是否 创建 时间dom 结构
            item._chat_temp_timestamp = 1451577600;
            item.send_text_temp = [];//临时文本信息
            // 滚动状态
            item._chat_scroll_status = true;
            // 礼物动态效果盒子
            item.dom_gift_animate_wrap = obj.find('.gift_animate_wrap');
            item.dom_send_gift_data = {
                ind:0,
                timer: null,
                dom_arr:[]
            };// 发送的礼物动效数据盒子
            item.dom_send_gift_data.timer = setInterval(function () {
                if (item.dom_send_gift_data.dom_arr.length > 0 && !item._chat_scroll_status) {
                    if (item.dom_send_gift_data.ind < item.dom_send_gift_data.dom_arr.length) {
                        var temp_i = item.dom_send_gift_data.ind;
                        item.dom_send_gift_data.dom_arr[temp_i].animate({
                            right: 225
                        }, 2500, function () {
                            setTimeout(function () {
                                if (item.dom_send_gift_data.dom_arr[temp_i]) {
                                    item.dom_send_gift_data.dom_arr[temp_i].hide();
                                }
                            }, 1500);
                        });
                        setTimeout(function () {
                            if (item.dom_send_gift_data.dom_arr.length - 1 == temp_i) {
                                item.dom_send_gift_data.ind = 0;
                                item.dom_send_gift_data.dom_arr = [];
                                item.dom_right.find('.gift_send_wrap').remove();
                            }
                        }, 4000);
                    }
                    item.dom_send_gift_data.ind++;
                }
            }, 4000);
            
            item.dom_receive_gift_data = {
                ind:0,
                timer: null,
                dom_arr: []
            };// 接收的礼物动效数据盒子
            item.dom_receive_gift_data.timer = setInterval(function () {
                if (item.dom_receive_gift_data.dom_arr.length > 0 && !item._chat_scroll_status) {
                    console.log(22222);
                    
                    if (item.dom_receive_gift_data.ind < item.dom_receive_gift_data.dom_arr.length) {
                        var temp_i = item.dom_receive_gift_data.ind;
                        item.dom_receive_gift_data.dom_arr[temp_i].animate({
                            left: 236
                        }, 2500, function () {
                            setTimeout(function () {
                                if (item.dom_receive_gift_data.dom_arr[temp_i]) {
                                    item.dom_receive_gift_data.dom_arr[temp_i].hide();
                                }
                            }, 1500);
                        });
                        setTimeout(function () {
                            if (item.dom_receive_gift_data.dom_arr.length - 1 == temp_i) {
                                item.dom_receive_gift_data.ind = 0;
                                item.dom_receive_gift_data.dom_arr = [];
                                item.dom_right.find('.gift_receive_wrap').remove();
                            }
                        }, 4000);
                    }
                    item.dom_receive_gift_data.ind++;
                }
            }, 4000);
            obj.find(".emoji_item").on("click", function () {
                // 隐藏颜表情 盒子
                obj.find(".emoji_box").removeClass("on");
                // 数据框数据
                var chat_inpt = obj.find(".chat_inpt").val();
                chat_inpt += $(this).attr("title");
                // 数据框赋值
                obj.find(".chat_inpt").val(chat_inpt);
                return false;
            });
            obj.find(".img_inpt").change(function (event) { //公会头像
                a.check_file($(this).val(), $(this), this, item.uid)
            });
            /**===============礼物相关开始==================== */
            item.gift_id = "";// 礼物id
            item.gift_path = "";// 礼物图片
            item.gift_name = "";// 礼物名称
            item.gift_num_obj = obj.find(".send_inp");// 礼物数量input
            item.gift_price = "";// 礼物单价
            item.gift_price_all = "";// 礼物总价
            // item.send_gift_btn = obj.find(".send_gift_btn");// 赠送礼物按钮
            // 单个礼物选择
            obj.find(".gift_i").on("click", function () {
                $(this).addClass("on").siblings().removeClass("on");
                item.gift_id = $(this)[0].dataset.id;
                item.gift_price = $(this)[0].dataset.price;
                item.gift_path = $(this)[0].dataset.path;
                item.gift_name = $(this)[0].dataset.name;
                item.gift_price_all = Number(item.gift_price) * Number(item.gift_num_obj.val());
            });
            // 监听input 输入
            item.gift_num_obj.on('input propertychange', function () {
                if ($(this).val() < 1) {
                    item.gift_num_obj.val('1');
                }
                if ($(this).val() > 9999) {
                    layer.msg("赠送数量不能超过9999");
                    item.gift_num_obj.val('9999');
                }
                if (!(/(^[1-9]\d*$)/.test($(this).val()))) {
                    layer.msg("输入的不是正整数");
                    item.gift_num_obj.val('1');
                }
                if (item.gift_price) {
                    item.gift_price_all = Number(item.gift_price) * Number(item.gift_num_obj.val());
                }
            });
            // 选择数量
            obj.find(".send_more_i").on('click', function () {
                item.gift_num_obj.val($(this)[0].dataset.val);
            });
            // 赠送礼物
            obj.find(".send_gift_btn").on("click", function () {
                // console.log(item.gift_price);

                if (!item.gift_id) {
                    layer.msg("请选择礼物哦~");
                    return false;
                }
                if (item.gift_price_all > a.my_user_info.diamond) {
                    layer.msg("钻石不足，请充值");
                    return false;
                }
                var url = "/index/peiwan/buyGift";
                var post_data = {
                    pw_uid: item.uid,
                    gift_id: item.gift_id,
                    number: item.gift_num_obj.val(),
                    __token__: document.getElementsByName("__token__")[0].value
                };
                a.ajax(url, post_data, function (res) {
                    if (res.code === 1) {
                        var buy_gift_data = res.data
                        layer.msg(res.msg);
                        // 赠送成功 发送消息
                        var temp_content = {
                            "iconPath": item.gift_path,
                            "name": item.gift_name,
                            "num": Number(item.gift_num_obj.val())
                        };
                        a.send_gift_msg(item, JSON.stringify(temp_content));
                        // 隐藏礼物 盒子
                        obj.find(".gift_box").removeClass("on");

                        var datas = {
                            after:buy_gift_data.after_noble,
                            before:buy_gift_data.before_noble,
                        }
                        if(buy_gift_data.upgrade){
                            console.log('aaa进来了1');
                            a.createGradeHtml(datas);
                        }

                    } else {
                        layer.msg(res.msg);
                    }
                });
            });
            // 关闭礼物
            obj.find(".gift_box .close_btn").on("click", function () {
                // 隐藏礼物 盒子
                obj.find(".gift_box").removeClass("on");
            });
            // 钻石充值
            obj.find(".recharge").on("click", function () {

                window.open('/index/recharge/vocher.html');
            });
            // 礼物显示按钮
            obj.find(".gift_btn").on("click", function () {
                if (obj.find(".gift_box").hasClass("on")) {
                    // 隐藏颜表情
                    obj.find(".gift_box").removeClass("on");
                } else {
                    // 显示颜表情
                    obj.find(".gift_box").addClass("on");
                };
                return false;
            });
            /**===============礼物相关结束==================== */
            /**
             * ===================================chat_step_1_2============================
             *
             *    聊天第二步 加载历史聊天数据
             *
             *
             * ==========================================================================
             */
            var s_chat_room_msg = JSON.parse(localStorage.getItem("browser_chat_room_" + a.my_user_info.uid + "_" + item.uid));
            if (s_chat_room_msg.length > 0) {
                // 删除发布失败数据
                a.del_ele_arr(s_chat_room_msg, "send_state", 0, false)
                localStorage.setItem("browser_chat_room_" + a.my_user_info.uid + "_" + item.uid, JSON.stringify(s_chat_room_msg));
            }
            a.chats = s_chat_room_msg;
            // 聊天数据加载
            $.each(a.chats, function (index, chat_item) {
                // 两次消息之间 发送间隔超过 5分钟，插入时间间隔
                a.insert_chat_time_dom(item, chat_item.message_id, chat_item.create_time);
                // 创建消息dom  结构
                a.create_chat_item_dom(item, chat_item);
                // 插入页面
                if (chat_item.dom) {
                    obj.find(".chat_content").append(chat_item.dom);
                };
            });
            // 最近五条未读礼物消息
            var gift_msg_data = JSON.parse(LS.get("browser_chat_room_gift_" + a.my_user_info.uid + "_" + item.uid));
            if (gift_msg_data) {
                LS.set("browser_chat_room_gift_" + a.my_user_info.uid + "_" + item.uid,'[]');
                // 创建礼物特效
                for (var gift_msg_i = 0; gift_msg_i < gift_msg_data.length; gift_msg_i++) {
                    a.create_gift_animate(item, gift_msg_data[gift_msg_i]);
                }
            }
            
            // 关闭 放大弹窗
            obj.find(".img_close").on("click", function () {
                $(this).parent().removeClass("on");
            });
            // 颜表情显示按钮
            obj.find(".emoji_btn").on("click", function () {
                if (obj.find(".emoji_box").hasClass("on")) {
                    // 隐藏颜表情
                    obj.find(".emoji_box").removeClass("on");
                } else {
                    // 显示颜表情
                    obj.find(".emoji_box").addClass("on");
                };
                return false;
            });
            // 点击菜单其它地方 则清空右键菜单
            $(window).on("click", function () {
                // 隐藏颜表情 盒子
                obj.find(".emoji_box").removeClass("on");
            });
            // 发送消息
            obj.find(".send_btn").on("click", function () {
                a.send_msg(item, obj.find(".chat_inpt").val());
                obj.find(".chat_inpt").val("");
            });
            /*监听输入框的回车操作*/
            obj.find(".chat_inpt").bind('keypress', function (event) {
                if (event.keyCode == "13") {
                    a.send_msg(item, obj.find(".chat_inpt").val());
                    obj.find(".chat_inpt").val("");
                    return false;
                }
            });
            // 关闭窗口
            obj.find(".cancel_btn").on("click", function () {
                a.close_one_pop(item);
            });
            // 复制文本
            function textInit(e) {
                e.preventDefault();
                var text;
                var clp = (e.originalEvent || e).clipboardData;
                if (clp === undefined || clp === null) {
                    text = window.clipboardData.getData("text") || "";
                    if (text !== "") {
                        if (window.getSelection) {
                            var newNode = document.createElement("span");
                            newNode.innerHTML = text;
                            window.getSelection().getRangeAt(0).insertNode(newNode);
                        } else {
                            document.selection.createRange().pasteHTML(text);
                        }
                    }
                } else {
                    text = clp.getData('text/plain') || "";
                    if (text !== "") {
                        document.execCommand('insertText', false, text);
                    }
                }
            }
            // // 新的输入框的粘贴事件
            // obj.find(".chat_inpt").on("paste", function (e) {
            //     textInit(e);
            //     // return false; 

            //     //用c++的你方法处理 获取粘贴路径
            //     // var fileurl = clipboard_get_image();
            //     // 如果粘贴的不是图片，则fileurl 为空，不上传
            //     // if (!fileurl) { return false; };
            //     // 临时存储 上传图片 用于上传失败展示
            //     // upload_img_path_temp = fileurl;
            //     var upload_info = {
            //         uid: item.uid,
            //         // fileurl: fileurl
            //     };
            //     // 聊天 调用主窗口 图片上传方法
            //     _BROWSER_CHAT.chat_upload_img(upload_info);
            //     // a.to_trunk(2003, JSON.stringify(upload_info));
            //     // 显示正在上传
            //     obj.find(".up_img_status").addClass("on");
            // });
            // 反馈内容限制字数 300
            obj.find(".chat_inpt").on("input propertychange", function () {
                var $this = $(this),
                    _val = $this.val(),
                    count = "";
                if (_val.length > 500) {
                    $this.val(_val.substring(0, 500));
                }
            });

            //监听聊天内容滚动
            obj.find(".chat_list").scroll(function () {
                if (a.check_scroll_bottom(item)) {//判断页面是否滚动到页面底部

                    var ind = _BROWSER_CHAT.getobj_array_index(a.friend_user_info, "uid", item.uid);
                    a.change_scroll_status(ind);

                } else {
                    item._chat_scroll_status = true;
                };
            });

            //点击新消息提醒 返回底部
            obj.find(".new_msg_wrapper").on("click", function () {
                a.scroll_bottom_fn(item, true);
            });
            // 选择图片上传
            obj.find(".upload_img_btn").on("click", function () {
                obj.find(".img_inpt").click();
                // var upload_info = {
                //     uid: item.uid,
                //     // fileurl: fileurl
                // };
                // // 聊天 调用主窗口 图片上传方法
                // _BROWSER_CHAT.chat_upload_img(upload_info);
                // if (_de_bug) { return false; };
                // //选择图片
                // var fileurl = client_select_file("jpg|gif|png|jpeg", false, false);
                // if (!fileurl) { return false; };

                // var upload_info = {
                //     uid: item.uid,
                //     fileurl: fileurl
                // };
                // a.to_trunk(2003, JSON.stringify(upload_info));
                // // 显示正在上传
                // obj.find(".up_img_status").addClass("on");
            });
        },
        /**
         *聊天窗口礼物特效
         *
         * @param {*} item
         * @param {*} chat_i 单条消息
         */
        create_gift_animate:function(item,chat_i){
            var obj = $("<div></div>");
            var gift_json = JSON.parse(chat_i.content);
            var num_arr = a.str_arr(gift_json.num);
            var str = '';
            if(chat_i.type ==2) {// 接收的礼物消息
                obj.addClass('gift_receive_wrap');
                str += '<span class="nickname">' + item.nickname + '</span>';
                str +='<span class="text">送您了</span>';
                str += '<img src="' + gift_json.iconPath + '" alt="" class="gift">';
                str +='<i class="num_x"></i>';
                str +='<span class="num_list">';
                for (var i in num_arr) {
                    str += '<i class="num_li num_li_' + num_arr[i] + '"></i>';
                }
                str +='</span>';

                
            }else if(chat_i.type == 3) {// 发送的礼物消息
                obj.addClass('gift_send_wrap');
                str += '<span class="text">您打赏了</span>';
                str += '<span class="nickname">' + item.nickname + '</span>';
                str += '<img src="' + gift_json.iconPath + '" alt="" class="gift">';
                str += '<i class="num_x"></i>';
                str += '<span class="num_list">';
                for (var i in num_arr) {
                    str += '<i class="num_li num_li_' + num_arr[i] + '"></i>';
                }
                str += '</span>';
            }
            obj.html(str);
            console.log(obj);
            
            if (chat_i.type == 2) {// 接收的礼物消息
                item.dom_receive_gift_data.dom_arr.push(obj);
                item.dom_gift_animate_wrap.append(obj);
            } else if (chat_i.type == 3) {// 发送的礼物消息
                item.dom_send_gift_data.dom_arr.push(obj);
                item.dom_gift_animate_wrap.append(obj);
            }

        },
        /**
         *聊天窗口主体 订单流程图
         *
         * @param {*} item
         */
        create_chat_right_order:function(item){
            var obj = $("<div></div>");
            obj.addClass('order-content');

            var str = "";
            str += '<img src="'+item.order_info.app_icon_path+'" alt="" class="img-game">';
            str += '<div class="info">';
            str += '<div class="top">';
            str += '    <span class="game">'+item.order_info.name+'</span><span class="unit">'+item.order_info.order_num+item.order_info.unit+'</span>';
            if(item.order_info.uid == a.my_user_info.uid) {
                item.dom_top_btn.text('再次下单');
                str += '    <div class="btn-wrap">';
                // str += '        <span class="btn">取消订单</span>';
                if(item.order_info.order_status == 7){
                    str += '        <span class="btn appeal">申诉</span>';
                    str += '        <span class="btn ok">完成订单</span>';
                }
                if(item.order_info.order_status == 3){
                    str += '        <span class="btn ok">完成订单</span>';
                }

                str += '    </div>';
            }
            if(item.order_info.order_status == 6){
                str += '        <span class="order-desc">退款申请中</span>';
            }
            str += '</div>';
            str += '<div class="bottom">';
            if(item.order_info.order_status>1){
                str += '<div class="step first on">';
            }else {
                str += '<div class="step first">';
            }

            str += '<span class="line"></span>';
            str += '<span class="dot"></span>';
            str += '<span class="text">待接单</span>';
            str += '</div>';
            if(item.order_info.order_status>2){
                str += '<div class="step first on">';
            }else {
                str += '<div class="step first">';
            }
            str += '<span class="line"></span>';
            str += '<span class="dot"></span>';
            if(item.order_info.order_status == 5){
                str += '<span class="text">申诉中</span>';
            }else {
                str += '<span class="text">进行中</span>';
            }

            str += '</div>';
            if(item.order_info.order_status == 4){
                str += '<div class="step first on">';
            }else {
                str += '<div class="step first">';
            }
            str += '<span class="line"></span>';
            str += '<span class="dot"></span>';
            str += '<span class="text">已完成</span>';
            str += '</div>';
            if(item.order_info.order_status == 4){
                str += '<div class="step first on">';
            }else {
                str += '<div class="step first">';
            }
            str += '<span class="line"></span>';
            str += '</div>';
            str += '</div>';
            str += '</div>';
            obj.html(str);
            item.dom_order = obj;
            // 完成订单
            obj.find('.ok').on('click',function() {
                layer.alert('订单完成后，钱将直接转入陪玩账户，确认完成订单吗？', {
                    time: 0 //不自动关闭
                    ,btn: ['确认', '取消']
                    ,yes: function(index){
                        layer.close(index);
                        var url = "/user/order/confirm_order";
                        var post_data = {
                            order_id:item.order_info.order_id
                        };
                        a.ajax(url, post_data, function (res) {
                            if (res.code == 1) {
                                // item.order_info.order_status = 4;
                                layer.msg(res.msg,{time:2000},function() {
                                    a.get_order_info(item,1);
                                });
                            } else {
                                layer.msg(res.msg);
                            }
                        });
                    }
                });

            });
            // 申诉
            obj.find('.appeal').on('click',function() {
                var url = "/user/order/user_appeal_order";
                var post_data = {
                    order_id:item.order_info.order_id
                };
                a.ajax(url, post_data, function (res) {
                    if (res.code == 1) {
                        item.order_info.order_status = 5;
                        layer.msg(res.msg,{time:2000},function() {
                            a.create_chat_right_order(item);
                            if(item.dom_order){
                                item.dom_chat_list.addClass('on');
                                item.dom_order_wrap.html(item.dom_order);
                            }
                        });
                    } else {
                        layer.msg(res.msg);
                    }
                });
            });
        },
        /**
         *聊天消息
         *
         * @param {*} item
         */
        create_chat_item_dom: function (info, item) {

            var obj = $("<div></div>");
            obj.attr("class", "chat_item");
            // type 0: 消息提醒 1:是时间,2:对方发的消息,3:自己发的消息,5：陪玩接单，陪玩收到消息推送，6：老板取消订单，陪玩收到消息推送
            var str = "";
            if (item.type === 0) {
                obj.addClass("time");
                str += '<span class="text">' + item.content + '</span>';
            } else if (item.type === 1) {
                obj.addClass("time");
                str += '<span class="text">' + a.timestamp(item.create_time) + '</span>';
            } else if (item.type === 3) {
                obj.addClass("my");
            }

            if (item.msg_type === "text" && (item.type == 3 || item.type == 2)) {

                str += '<div class="avatar_wrapper">';
                str += '    <div class="wai">';
                str += '        <div class="nei">';
                if (item.type == 2 || item.type == 4) {
                    str += '        <img class="avatar" src="' + info.avatar + '" />';
                } else if (item.type === 3) {
                    str += '        <img class="avatar" src="' + a.my_user_info.avatar + '" />';
                }
                str += '        </div>';
                str += '    </div>';
                str += '</div>';
                str += '<div class="chat_text_wrapper">';
                str += '    <i class="arrow"></i>';
                str += '    <div class="chat_text">' + _BROWSER_CHAT.analysis_emoji(item.content, public_domain + '/user/img/index/chat/face_30/') + '</div>';
                str += '    <span class="send_fail send_text_fail"></span>';
                str += '</div>';
            } else if (item.msg_type === "image") {
                obj.addClass("chat_img");

                str += '<div class="avatar_wrapper">';
                str += '    <div class="wai">';
                str += '        <div class="nei">';
                if (item.type == 2) {
                    str += '        <img class="avatar" src="' + info.avatar + '" />';
                } else if (item.type === 3) {
                    str += '        <img class="avatar" src="' + a.my_user_info.avatar + '" />';
                }
                str += '        </div>';
                str += '    </div>';
                str += '</div>';
                str += '<div class="chat_text_wrapper">';
                str += '    <div class="chat_text">';
                str += '        <img class="icon" src="' + item.content + '" />';
                str += '        <i class="icon_scale_btn"></i>';
                str += '    </div>';
                str += '    <span class="send_fail send_img_fail"></span>';
                str += '</div> ';
            } else if (item.msg_type === "voice") {
                obj.addClass("time");
                str += '<span class="text">您有一条语音消息，请在手机APP中查看</span>';
            } else if (item.msg_type === "phone") {
                obj.addClass("chat_phone");
                str += '<div class="avatar_wrapper">';
                str += '    <div class="wai">';
                str += '        <div class="nei">';
                if (item.type == 2) {
                    str += '        <img class="avatar" src="' + info.avatar + '" />';
                } else if (item.type === 3) {
                    str += '        <img class="avatar" src="' + a.my_user_info.avatar + '" />';
                }
                str += '        </div>';
                str += '    </div>';
                str += '</div>';
                str += '<div class="chat_text_wrapper">';
                str += '    <i class="arrow"></i>';
                str += '    <div class="chat_text"><i class="icon_phone"></i>' + item.content + '</div>';
                str += '</div>';
            } else if (item.msg_type === "gift") {// 礼物
                obj.addClass("gift");
                var re = new RegExp("\\\\", "g");  //这里第二个参数g表示全部都替换，如果换成是i则表示替换第一个。

                var newStr = item.content.replace(re, "");
                var gift_msg = JSON.parse(newStr);
                str += '<div class="avatar_wrapper">';
                str += '    <div class="wai">';
                str += '        <div class="nei">';
                if (item.type == 2 || item.type == 4) {
                    str += '        <img class="avatar" src="' + info.avatar + '" />';
                } else if (item.type === 3) {
                    str += '        <img class="avatar" src="' + a.my_user_info.avatar + '" />';
                }
                str += '        </div>';
                str += '    </div>';
                str += '</div>';
                str += '<div class="chat_text_wrapper">';
                str += '    <i class="arrow"></i>';
                str +='<div class="chat_text">';
                str +=    '<div class="gift_top">';
                if (item.type == 2) {
                    str += '<span class="gift_text">TA赠给你了</span>';
                } else if (item.type == 3) {
                    str += '<span class="gift_text">您赠给了TA</span>';
                }

                str +=        '<span class="gift_name">' + gift_msg.name + '</span>';
                str +=        '<img src="' + gift_msg.iconPath + '" alt="" class="ico_gift">';
                str +=        '<span class="gift_num_wrap">x <span class="gift_num">' + gift_msg.num + '</span></span>';
                str +=    '</div>';
                str +=    '<div class="gift_line"></div>';
                str +=    '<div class="gift_bottom">';
                if (item.type == 2) {
                    str += '<img src="' + public_domain + '/user/img/index/chat/ico_12.png" alt="" class="icon">';
                    str += '<span class="btn_text">查看礼物</span>';
                } else if (item.type == 3){
                    str += '<img src="' + public_domain + '/user/img/index/chat/ico_13.png" alt="" class="icon">';
                    str += '<span class="btn_text">继续打赏</span>';
                }
                str +=    '</div>';
                str +='</div>';

                str += '    <span class="send_fail send_text_fail"></span>';
                str += '</div>';
            } else if (item.msg_type === "chat_room") {// 房间分享
                obj.addClass("gift");
                obj.addClass("chat_room");
                if (a.isJSON(item.content)) {
                    var re = new RegExp("\\\\", "g");  //这里第二个参数g表示全部都替换，如果换成是i则表示替换第一个。
                    var newStr = item.content.replace(re, "");
                    var chat_room_msg = JSON.parse(newStr);
                } else {
                    return false;
                }

                str += '<div class="avatar_wrapper">';
                str += '    <div class="wai">';
                str += '        <div class="nei">';
                if (item.type == 2 || item.type == 4) {
                    str += '        <img class="avatar" src="' + info.avatar + '" />';
                } else if (item.type === 3) {
                    str += '        <img class="avatar" src="' + a.my_user_info.avatar + '" />';
                }
                str += '        </div>';
                str += '    </div>';
                str += '</div>';
                str += '<div class="chat_text_wrapper">';
                str += '    <i class="arrow"></i>';
                str +='<div class="chat_text">';
                str +=    '<div class="gift_top">';
                str +=        '<div class="gift_title">小姐姐都在这，快来一起嗨！</div>';
                str +=        '<div class="gift_text">' + chat_room_msg.content + '</div>';
                str +=        '<img src="' + chat_room_msg.imgPath + '" alt="" class="ico_gift">';
                str +=    '</div>';
                str +='</div>';
                str += '    <span class="send_fail send_text_fail"></span>';
                str += '</div>';
            } else if(item.type==5) {// 5：陪玩接单，陪玩收到消息推送
                obj.addClass("time").addClass("accept-msg");
                str += '<span class="text">您已经接单，请即刻为老板提供服务！如老板未回复，请通过老板的 <span class="order_connect_btn">QQ或电话</span>   联系TA</span>';
            } else if(item.type==6) {// 6：老板取消订单，陪玩收到消息推送
                obj.addClass("time").addClass("cancel-msg");
                str += '<span class="text">老板申请退款，12小时不处理将自动退款 <span class="order_ok_btn">同意</span><span class="order_cancel_btn">拒绝</span> </span>';
            } else if (item.msg_type === "task"){
                obj.addClass("task");
                var re = new RegExp("\\\\", "g");  //这里第二个参数g表示全部都替换，如果换成是i则表示替换第一个。

                var temp_task_msg = item.content.replace(re, "");
                var task_msg = JSON.parse(temp_task_msg);
                if(item.type!=3) {
                    if(task_msg.level == 1) {
                        str +=    '<div class="task_wrap_1">';
                        str +=        '<div class="avatars">';
                        str +=            '<img src="'+task_msg.pw_avatar+'" class="left_avatar task_avatar">';
                        str +=            '<img src="'+task_msg.boss_avatar+'" class="right_avatar task_avatar">';
                        str +=        '</div>';
                        str +=        '<div class="task_content">';
                        str +=            '<div class="task_title">缘分呀~~终于找到你啦！</div>';
                        str +=            '<div class="task_msg">从今以后，刀锋之旅不会寂寞啦！春风十里不如陪你~</div>';
                        str +=            '<div class="task_desc">在这里遇到什么问题都可以问我哟~</div>';
                        str +=        '</div>';
                        str +=    '</div>';
                        if (!localStorage.getItem('b_chat_task_info_1_' + a.my_user_info.uid + '_' + info.uid + '_' + task_msg.matchRecordId)) {
                            var temp_task_info1 = {
                                start: task_msg.start,
                                matchRecordId: task_msg.matchRecordId
                            };
                            localStorage.setItem('b_chat_task_info_1_' + a.my_user_info.uid + '_' + info.uid + '_' + task_msg.matchRecordId, JSON.stringify(temp_task_info1));
                        }
                    } else if (task_msg.level == 2){
                        str +=    '<div class="task_wrap_2 task_wrap">';
                        str +=        '<div class="left">';
                        str +=            '<img src="'+task_msg.avatar+'" alt="" class="avatar">';
                        str +=            '<div class="info">';
                        if(task_msg.sex == 1) {
                            str += '<i class="sex male"></i>';
                        }else {
                            str += '<i class="sex female"></i>';
                        }
                        str +=                '<span class="nickname">'+task_msg.nickname+'</span>';
                        str +=            '</div>';
                        str +=        '</div>';
                        str +=        '<div class="right">';
                        str +=            '<div class="task_msg">Ta很想和你结交个朋友，并关注了你，现在去关注Ta吧~</div>';
                        var temp_store_task_2 = JSON.parse(localStorage.getItem('b_chat_task_info_2_' + a.my_user_info.uid + '_' + info.uid + '_' + task_msg.matchRecordId));
                        if (temp_store_task_2 && temp_store_task_2.is_follow) {
                            str += '<div class="follow_btn on">关注TA</div>';
                        } else {
                            str += '<div class="follow_btn ">关注TA</div>';
                        }
                        str +=        '</div>';
                        str +=    '</div>';
                        if (!localStorage.getItem('b_chat_task_info_2_' + a.my_user_info.uid + '_' + info.uid + '_' + task_msg.matchRecordId)) {
                            var temp_task_info2 = {
                                start: task_msg.start,
                                matchRecordId: task_msg.matchRecordId
                            };
                            localStorage.setItem('b_chat_task_info_2_' + a.my_user_info.uid + '_' + info.uid + '_' + task_msg.matchRecordId, JSON.stringify(temp_task_info2));
                        }
                    } else if (task_msg.level == 8) {
                        str +=    '<div class="task_wrap_3 task_wrap">';
                        str +=        '<div class="left">';
                        str +=            '<img src="'+task_msg.avatar+'" alt="" class="avatar">';
                        str +=            '<div class="info">';
                        if (task_msg.sex == 1) {
                            str += '<i class="sex male"></i>';
                        } else {
                            str += '<i class="sex female"></i>';
                        }
                        str +=                '<span class="nickname">'+task_msg.nickname+'</span>';
                        str +=            '</div>';
                        str +=        '</div>';
                        str +=        '<div class="right">';
                        str +=            '<div class="task_title">Ta在邀请你下载APP</div>';
                        str +=            '<div class="task_msg">人家想随时随地都可以和你聊天嘛~</div>';
                        str +=            '<div class="task_desc">扫一扫右侧二维码就可以下载APP了哟~<i class="icon_hand"></i></div>';
                        str +=        '</div>';
                        str +=    '</div>';
                    } else if (task_msg.level == 7) {// 任务 提醒老板 进入聊天室
                        obj.addClass("toast");
                        str += '<span class="text">TA邀请你去聊天玩玩，快去看看吧</span>';
                    }
                }
                
            }


            obj.html(str);
            item.dom = obj;
            item.dom_send_status_icon = obj.find(".send_fail");

            if (item.msg_type === "image") {//图片消息
                // 图片放大按钮
                item.dom_scale_btn = obj.find(".icon_scale_btn");

                item.dom_scale_btn.on("click", function () {
                    info.dom_right.find(".img_pop .icon").attr("src", item.content);
                    info.dom_right.find(".img_pop").addClass("on");
                    return false;
                });
                // 双击图片放大
                item.dom_scale_db_btn = obj.find(".chat_text_wrapper");
                item.dom_scale_db_btn.on("dblclick", function () {
                    info.dom_right.find(".img_pop .icon").attr("src", item.content);
                    info.dom_right.find(".img_pop").addClass("on");
                });
                // 发送失败
                item.dom_send_fail_btn = obj.find(".send_img_fail");
                // item.dom_send_fail_btn.on("click",function() {
                //     a.upload_img_fn(upload_img_path_temp);
                // });
            } else if (item.msg_type === "text") {//文本消息
                // 发送失败
                item.dom_send_fail_btn = obj.find(".send_text_fail");
                // item.dom_send_fail_btn.on("click",function() {
                //     a.send_msg(info,info.send_text_temp);
                // });
            } else if (item.msg_type === "gift") {
                item.dom_btn_text = obj.find(".btn_text");
                if (item.type == 2) {// 查看礼物
                    item.dom_btn_text.on("click", function () {
                        window.open('/user/gift.html');
                    });
                } else if (item.type == 3) {// 再次打赏
                    item.dom_btn_text.on("click", function () {
                        if (info.dom_right.find(".gift_box").hasClass("on")) {
                            // 隐藏颜表情
                            info.dom_right.find(".gift_box").removeClass("on");
                        } else {
                            // 显示颜表情
                            info.dom_right.find(".gift_box").addClass("on");
                        };
                        return false;
                    });
                }

            } else if (item.msg_type === "chat_room") {// 分享消息
                obj.on("click", function () {
                    layer.msg("请在语音客户端或者APP中查看！");
                    return false;
                });
            } else if (item.msg_type === "task") {
                var re = new RegExp("\\\\", "g");  //这里第二个参数g表示全部都替换，如果换成是i则表示替换第一个。

                var temp_task_msg1 = item.content.replace(re, "");
                var task_msg1 = JSON.parse(temp_task_msg1);
                // 关注
                obj.find('.follow_btn').on("click", function () {

                    var url = '/index/peiwan/follow';
                    var post_data = {
                        pw_uid: info.uid
                    };
                    a.ajax(url, post_data, function (res) {
                        if (res.code == 1) {
                            layer.msg(res.msg);
                            $(this).addClass('on');
                            // 第二关任务信息
                            var task_info = JSON.parse(localStorage.getItem('b_chat_task_info_2_' + a.my_user_info.uid + '_' + info.uid + '_' + task_msg1.matchRecordId));
                            task_info.is_follow = 1;
                            localStorage.setItem('b_chat_task_info_2_' + a.my_user_info.uid + '_' + info.uid + '_' + task_msg1.matchRecordId, JSON.stringify(task_info));
                            var is_success = 2;//任务是否超时
                            var time = Number(a.get_timestamp()) - Number(task_info.start);
                            var message_id = a.get_timestamp(1);
                            if (time>60*30) {
                                is_success = 3;
                            }else {
                                is_success = 2;
                            }
                            var url1 = '/user/match_new_user/taskresult';
                            var post_data1 = {
                                doStatus: is_success,
                                progressLevel: 2,
                                source: 4,
                                matchRecordId: task_info.matchRecordId,
                            };
                            a.ajax(url1, post_data1, function (res) {
                                if (res.code == 1) {
                                    if (res.data.subCode==1) {
                                        var content_json = {
                                            level: 3,
                                            createTime: res.data.createTime,
                                            currentLevel: 2,
                                            msg_source: 'web'
                                        };
                                        var wsdata = {
                                            action: 'one_chat',
                                            token: browser_user_info.token,
                                            device_id: browser_user_info.device_id,
                                            termtyp: 'web',
                                            data: {
                                                message_id: message_id,// 消息id
                                                content: JSON.stringify(content_json),//内容
                                                msg_type: 'task',// 消息类型（text文本，image图片，voice，语音,task任务）
                                                to_uid: info.uid// 发给谁
                                            }
                                        };
                                        // console.log(wsdata);
                                        // 发送信息
                                        _BROWSER_MESSG.to_ws(3000, JSON.stringify(wsdata));
                                    }else {
                                        // layer.msg(res.msg);
                                    }
                                }else {
                                    // layer.msg(res.msg);
                                }
                            });
                            
                        } else {
                            layer.msg(res.msg);
                        }
                    });
                });
            }
            
            if(item.type==5) {
                item.order_info_msg = JSON.parse(item.content);
                // 陪玩接受订单 陪玩收到消息
                item.order_connect_btn = obj.find('.order_connect_btn');

                item.order_connect_btn.on('click',function(){
                    a.create_chat_connect_pop(item);
                    if(item.dom_connect_pop) {
                        $('.chat_pop .chat_pop_content').html(item.dom_connect_pop);
                        $('.chat_pop').show();
                    }
                    // console.log(item.order_info_msg.mobile +" " +item.order_info_msg.qq);
                });
            }
            if(item.type==6) {
                // 老板取消订单 陪玩收到消息
                item.order_ok_btn = obj.find('.order_ok_btn');// 同意按钮
                item.order_cancel_btn = obj.find('.order_cancel_btn');// 不同意按钮
                item.order_ok_btn.on('click',function(){
                    // console.log('同意');
                    var url = '/user/order/pw_confirm_cancel';
                    var post_data = {
                        status:1,
                        order_id:JSON.parse(item.content).order_id,
                    };
                    a.ajax(url, post_data, function (res) {
                        if (res.code == 1) {
                            layer.msg(res.msg);
                            // item.order_info.order_status = 5;
                            // layer.msg(res.msg,{time:2000},function() {
                            //     a.create_chat_right_order(item);
                            //     if(item.dom_order){
                            //         item.dom_chat_list.addClass('on');
                            //         item.dom_order_wrap.html(item.dom_order);
                            //     }
                            // });
                        } else {
                            layer.msg(res.msg);
                        }
                    });
                });
                item.order_cancel_btn.on('click',function(){
                    // console.log('拒绝');
                    var url = '/user/order/pw_confirm_cancel';
                    var post_data = {
                        status:2,
                        order_id:JSON.parse(item.content).order_id,
                    };
                    a.ajax(url, post_data, function (res) {
                        if (res.code == 1) {
                            layer.msg(res.msg);
                            // item.order_info.order_status = 5;
                            // layer.msg(res.msg,{time:2000},function() {
                            //     a.create_chat_right_order(item);
                            //     if(item.dom_order){
                            //         item.dom_chat_list.addClass('on');
                            //         item.dom_order_wrap.html(item.dom_order);
                            //     }
                            // });
                        } else {
                            layer.msg(res.msg);
                        }
                    });
                });
            }

            if (item.send_state === 0) {// 显示loading
                item.dom_send_status_icon.addClass("loading").addClass("on");
            } else if (item.send_state === 1) { // 发送成功
                item.dom_send_status_icon.removeClass("on").removeClass("loading");
            } else if (item.send_state === 2) { // 发送失败
                item.dom_send_status_icon.removeClass("loading").addClass("on");
            };

        },
        /**
         *联系方式弹窗
         *
         * @param {*} item
         */
        create_chat_connect_pop:function(item){
            var obj = $("<div></div>");
            obj.attr("class", "chat_pop_i");
            obj.addClass("connect");

            var str = "";
            str += '<span class="pop_close"><img src="'+public_domain+'/user/img/index/chat/close.png"></span>';
            str += '    <img src="'+public_domain+'/user/img/index/chat/ico_24.png" class="img_bt">';
            str += '    <div class="title">老板联系方式</div>';
            str += '    <div class="info_i">';
            str += '    <span class="info_text">QQ:</span><a class="info_desc qq" href="tencent://Message/?Uin='+item.order_info_msg.qq+'&amp;websiteName=q-zone.qq.com&amp;Menu=yes" target="_blank">'+item.order_info_msg.qq+'</a>';
            str += '</div>';
            str += '<div class="info_i">';
            str += '    <span class="info_text">手机:</span><span class="info_desc">'+item.order_info_msg.mobile+'</span>';
            str += '</div>';
            obj.html(str);
            item.dom_connect_pop = obj;
            // 头部切换
            obj.find('.pop_close').on("click", function () {
                $('.chat_pop').hide();
            });
        },
        /**
         *更改聊天面板左侧 未读数量
         *
         * @param {*} item
         */
        change_left_num: function (item) {
            // 接收到信息，判断是否在底部
            if (item._chat_scroll_status) {//不在底部
                item.dom_right.find(".new_msg_wrapper").addClass("on");
                var num = Number(item.dom_right.find(".new_msg_wrapper").find(".num").text()) + 1;
                item.dom_right.find(".new_msg_wrapper").find(".num").text(num);
                item.dom_left.find(".no_num").addClass("on");
                item.dom_left.find(".no_num").text(num);
                var ind = 0;
                for(var i = 0;i<_BROWSER_CHAT.friend_user_info.length;i++) {
                    if(_BROWSER_CHAT.friend_user_info[i].id == item.id) {
                        ind = i;
                        break;
                    }
                }
                a.change_position(_BROWSER_CHAT.friend_user_info, ind, 1, true);
            } else {
                // console.log(22222222222);

                _BROWSER_CHAT.scroll_bottom_fn(item, true);
            };
        },
        /**
         *
         * =============================================================================
         *
         * ===============================公共操作================================
         *
         * =============================================================================
         *
         */
        /**
         *字符串转数组
         *
         * @param {*} str
         * @returns []
         */
        str_arr:function(str) {
            str = "" + str;
            var arr = [];
            for(var i in str) {
                arr.push(str[i]);
            }
            return arr;
        },
        /**
         *修改数组中一个元素的位置上面有详解
         *
         * @param {*} arry
         * @param {*} this_position
         * @param {*} target
         * @param {*} boor
         * @returns
         */
        change_position:function(arry,this_position,target,boor){
            if(!(arry instanceof Array)){
                console.log("修改位置第一个参数必须是数组");
                return;
            }
            if((typeof(this_position) !== 'number') || (typeof(target) !== 'number') ){
                console.log("位置参数必须是数字");
                return;
            }
            arry.splice(target,0,arry[this_position]);
            arry.splice(this_position+1,1);
            if(arry[target].dom_left && boor){
                if(!(arry[target].dom_left instanceof jQuery)){
                    console.log("移动位置里面的dom参数必须是jquery对象");
                    return;
                }
                var parentobj = arry[target].dom_left.parent();
                var childrenobj = parentobj.children();
                childrenobj.eq(target).before(arry[target].dom_left);
            }
        },
        /**
         *对数组对象进行分组
         *
         * @param {string} type 根据type  进行分组
         * @param {[{}]} arr 数组对象
         * @returns 返回分组之后的 数据
         */
        group_array_fn: function (type, arr) {
            var map = {}, dest = {};
            for (var i = 0; i < arr.length; i++) {
                var ai = arr[i];
                if (!dest[ai[type]]) {
                    dest[ai[type]] = [];
                    dest[ai[type]].push(ai);
                } else {
                    dest[ai[type]].push(ai);
                }
            }
            return dest;
        },
        /**
         *获取指定参数对应的数量
         *
         * @param {*} arr 数据源
         * @param {*} type 参数
         * @param {*} val 参数 对应数值
         * @returns 返回指定参数对应数值的数量
         */
        get_ele_num: function (arr, type, val) {
            // console.log(arr);
            var num = 0;
            if(arr){
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i][type] == val) {
                        num++;
                    }
                }
            }
            return num;
        },
        /**
         *判断数组中是否存在
         *
         * @param {*} arr 数据源
         * @param {*} type 参数
         * @param {*} val 参数 对应数值
         * @returns 返回指定参数对应数值的数量
         */
        is_exist_fn:function(arr,type,val) {
            var is_exist = false;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][type] == val) {
                    is_exist = true;
                    break;
                }
            }
            return is_exist;
        },
        /**
         *删除指定参数 指定值的数据
         *
         * @param {数组} arr 数据源
         * @param {string} type 参数
         * @param {*} val 参数 对应数值
         * @param {bloor} boor true:删除dom false:不删除dom
         */
        del_ele_arr: function (arr, type, val, boor) {
            var isok = false;
            for (var i = 0; i < arr.length; i++) {
                // console.log(arr.length);
                if (arr[i][type] === val) {
                    if (boor) {
                        arr[i].dom_left.remove();
                        arr[i].dom_right.remove();
                    };
                    arr.splice(i, 1); //删除下标为i的元素
                    i--;
                    isok = true;
                }
            };
            return isok;
        },
        /**
         *修改指定参数 指定值的数据
         *
         * @param {*} arr 数据源
         * @param {*} type 要修改数据 对应参数
         * @param {*} val type 对应数值
         * @param {*} edit_type 要修改的参数
         * @param {*} edit_val 要修改的参数 数值
         */
        edit_ele_arr: function (arr, type, val, edit_type, edit_val) {

            for (var i = 0; i < arr.length; i++) {
                if (arr[i][type] == val) {
                    arr[i][edit_type] = edit_val;
                }
            };
        },
        /**
         *获取指定参数 的 数据
         *
         * @param {*} arr 数据源
         * @param {*} type 获取数据 对应参数
         * @param {*} val type 对应数值
         */
        get_ele_arr: function (arr, type, val) {
            var is_exist = false;
            var arr_i = "";
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i][type] == val) {
                    is_exist = true;
                    arr_i = arr[i];
                    break;
                }
            };
            if (is_exist) {
                return arr_i;
            } else {
                return false;
            };
        },
        /**
         * 获取当前时间戳
         *
         */
        get_timestamp: function (type) {
            if(type==1) {
                return (Math.floor(Math.random() * 100000) + 1) + "";
            }else {
                return Math.round(new Date().getTime() / 1000).toString();// 10位时间戳
            }
            
        },
        /**
         * 比较两个时间戳是否是同一天
         *
         * @param {timestamp} date1
         * @param {timestamp} date2
         * @returns
         */
        is_same_day: function (date1, date2) {
            if (new Date(date1).toDateString() === new Date(date2).toDateString()) {
                return true;
            } else {
                return false;
            }
        },
        /**
         *返回一个日期格式传递一个时间戳如1920-02-12 10:25:10
         *
         * @param {*} format
         * @returns
         */
        timestamp: function (format) {
            var format = new Date(format * 1000);
            var year = format.getFullYear();
            var month = format.getMonth() + 1;
            var date = format.getDate();
            var hour = format.getHours();
            var minute = format.getMinutes();
            var miao = format.getSeconds();
            var returnstr = function (val) {
                return val < 10 ? '0' + val : val;
            };
            return returnstr(year) + "-" + returnstr(month) + "-" + returnstr(date) + ' ' + returnstr(hour) + ":" + returnstr(minute) + ":" + returnstr(miao);
        },
        /**
         * 时间格式化，用于 标识最新消息时间
         *
         * @param {*} format 时间戳
         * @returns 返回一个日期格式传递一个时间戳如02-12 或者10:25
         */
        format_time: function (format) {
            var format = new Date(format * 1000);
            var year = format.getFullYear();
            var month = format.getMonth() + 1;
            var date = format.getDate();
            var hour = format.getHours();
            var minute = format.getMinutes();
            var miao = format.getSeconds();
            var returnstr = function (val) {
                return val < 10 ? '0' + val : val;
            };
            var str = format;
            // 判断是否是当天
            if (new Date(str).toDateString() === new Date().toDateString()) {
                //今天
                return returnstr(hour) + ":" + returnstr(minute);
            } else if (new Date(str) < new Date()) {
                return month + "-" + returnstr(date);
            }
        },
        //解析emoji文字表情为图片路径参数是一个字符串和一个图片相对emoji文件夹的路径
        analysis_emoji: function (str, path) {
            // console.log(str);
            str = a.filterXSS(str);
            if (!path) {
                // alert("analysis_emoji方法请传一个表情文件夹的路径"); 
                return
            };
            var regExp = /\[.+?\]/g;
            var arr = [];
            var str1 = 0;
            var arr1 = [];
            var arr2 = [];
            var str2 = "";
            var path1 = "<img src='" + path;
            var path2 = ".png' class='emoji'/>";
            var status = true;
            while ((arr = regExp.exec(str)) !== null) {
                status = false;
                arr1.push(str.substring(str1, arr.index));
                arr2.push(arr[0]);
                str1 = arr.index + arr[0].length;
                str2 = str.substring(str1);
            }
            if (status) {
                return str;
            }
            var str3 = "";
            for (var i = 0, len = arr1.length; i < len; i++) {
                str3 += arr1[i];
                if (_BROWSER_CHAT.emoji_json[arr2[i]]) {
                    str3 += (path1 + _BROWSER_CHAT.emoji_json[arr2[i]] + path2);
                }
            }
            str3 += str2;
            return str3;
        },
        //通过一个参数和值得到从数组中得到一个对象的索引值
        getobj_array_index: function (array, key, val) {
            var index = false;
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i][key] === val) {
                    index = i;
                    break;
                };
            };
            return index;
        },
        //统一定义一个分隔符
        de_bug_data_turnover: function (name, type, data) {
            if (name && data && type) {
                if ((typeof name === "string") && (typeof data === "string") && (typeof type === "number")) {
                    //把本地存储的取出来
                    var text_name, code_name, text_data, code_data;
                    text_name = name + "_text";
                    code_name = name + "_code";
                    text_data = localStorage.getItem(text_name) || '';
                    code_data = localStorage.getItem(code_name) || '';
                    text_data += "may_you_be_happy_and_prosperousi" + data;
                    code_data += "may_you_be_happy_and_prosperousi" + type;
                    localStorage.setItem(text_name, text_data);
                    localStorage.setItem(code_name, code_data);
                } else {
                    layer.msg("de_bug_data_turnover方法缺少参数数据类型错误");
                };
            } else {
                layer.msg("de_bug_data_turnover方法缺少参数");
            };
        },
        //浏览器中获取窗口之间数据的方式
        de_bug_data_turnover_get: function (name) {
            // console.log(name);

            if (name && (typeof name === "string")) {
                //参数没有或者数据格式错误
                var text_name, code_name, text_data, code_data, arr1, arr2;
                text_name = name + "_text";
                code_name = name + "_code";
                text_data = localStorage.getItem(text_name) || '';
                code_data = localStorage.getItem(code_name) || '';
                if (text_data) {
                    //取出来后就设为空
                    localStorage.setItem(text_name, "");
                    localStorage.setItem(code_name, "");
                    arr1 = text_data.split("may_you_be_happy_and_prosperousi");
                    arr2 = code_data.split("may_you_be_happy_and_prosperousi");
                    return [arr1, arr2];
                } else {
                    return false;
                };
            } else {
                // alert("参数没有或者数据格式错误");
            };
        },
        //公共ajax
        ajax: function (url, todata, fn, fn2) {
            todata = todata || {};
            todata.termtyp = 'web';
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: todata,
                success: function (res) {
                    fn(res);
                },
                error: function () {
                    // alert("当前网络连接错误请稍后再试");
                    if (fn2) { fn2() };
                }
            });
        },
        /**
         *根据固定参数进行比对，用于sort 排序
         *
         * @param {*} property 参数
         * @returns
         */
        compare: function (property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        /**
         *laypage
         *
         * @param {*} page_info |laypage外层id
         * @param {*} btn_color |样式
         * @param {*} _fn |回调函数
         * @param {*} pages |总页数
         * @param {*} curr |当前页码
         * @param {*} f_is |首页
         * @param {*} l_is |尾页
         */
        mypage: function (page_info, btn_color, _fn, pages, curr, f_is, l_is) {
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
         *获取url参数返回参数值
         *
         * @param {*} name
         * @returns
         */
        get_url_param: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURIComponent(r[2]);
            } else {
                return false;
            };
        },
        /**
         *XSS数据过滤
         *
         * @param {*} str
         * @returns
         */
        filterXSS: function (str) {
            if(!str) return;
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/\r{0,}\n/g, '<br/>')
        },
        /**
         *判断字符串是不是json字符串
         *
         * @param {*} str
         * @returns
         */
        isJSON: function (str) {
            if (typeof str == 'string') {
                try {
                    var obj = JSON.parse(str);
                    if (typeof obj == 'object' && obj) {
                        return true;
                    } else {
                        return false;
                    }

                } catch (e) {
                    console.log('error：' + str + '!!!' + e);
                    return false;
                }
            }
            console.log('It is not a string!')
        },
        //选择排序 正序
        bubbleSort:function(arr,type){
            for(var i = 0;i<arr.length-1;i++){
                for(var j = i+1;j<arr.length;j++){
                    if(arr[i][type]<arr[j][type]){
                        var temp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
        },
		/**
         * 毫秒转秒
         *
         */
        change_timestamp_second: function (str) {
            str = Number(str);
            return Math.round(str / 1000).toString();
        },
    };
    window._BROWSER_CHAT = a;
}());