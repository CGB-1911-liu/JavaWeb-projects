/* * @Title: 登录注册
* @Author: 王晓琨
* @Date: 2019-05-09 09:21:37
* @Last Modified
 * by: 王晓琨
* @Last Modified time: 2019-05-09 09:21:37
 */

var common;
var loginNum;
var registerNum;
var captcha1;  //腾讯云图形验证

window.tel_login_v1 = {
    el: "#tel_login_v1",
    data: {
        // 元素
        pop_wrap: $('#tel_login_v1'),//弹窗外层
        pop_box: $('.pop-box'),//弹窗内部外层
        pop_box1: $('.pop-box1'),//登录注册外层
        is_load:false,// 是否载入
        is_pw_rz:false,// 是否新用户入驻

        isshow: false,
        checked: true, //是否记住密码
        agreementChecked: true, //阅读并同意协议选中 注册时候的选择
        agreementChecked1:true,//阅读并同意协议选中 登录的时候选择
        agreementChecked2:true,//阅读并同意协议选中 短信登录的时候选择
        loginTabShow: 0, //登录显示：0|用户名和密码登录，1|短信验证码登录

        imgCode: img_code, //图行验证码路径
        popShow: 1, //弹窗
        contentShow: false, //登录内容显示
        setpassword: '', //设置密码
        code_readonly: false, //图形验证码输入框，默认允许输入
        set_pwd: '', //单独设置密码

        // 账号登录
        user_mobile: '', //手机号
        user_pwd: '', //注册密码

        // 短信登录
        regist_msg_code: 86, //注册地区  +86 中国大陆  +886 中国台湾
        regist_msg_code_show: false,//国际编码显示
        regist_msg_code_search_val: '',//国际编码查询数据
        msg_mobile: '', //手机号
        msg_pwd: '', //注册密码
        msg_captcha_code: '', //图形验证码
        msg_message_code: '', //短信验证码
        // msg_message_code_btn: '获取验证码', //获取短信验证码按钮值
        // msgIsdisabled: false, //input禁用
        // msgNoPwdShow: false, //是否需要填写密码

        // 注册
        regist_phone_code: 86, //注册地区  +86 中国大陆  +886 中国台湾
        regist_phone_code_show: false,//国际编码显示
        regist_phone_code_search_val: '',//国际编码查询数据
        regist_mobile: '', //注册手机号
        regist_pwd: '', //注册密码
        regist_ticket:'', //腾讯云回调票据
        regist_rand_str:'', //腾讯云回调随机字符串
        regist_Tencent_type:'', //1 短信登录使用腾讯云  2 注册使用腾讯用
        regist_captcha_code: '', //注册图形验证码  弃用
        regist_message_code: '', //注册短信验证码
        // regist_message_code_btn: '获取验证码', //获取短信验证码按钮值
        // registIsdisabled: false, //input禁用

        // 忘记密码
        regist_reset_code: 86, //注册地区  +86 中国大陆  +886 中国台湾
        regist_reset_code_show: false,//国际编码显示
        regist_reset_code_search_val: '',//国际编码查询数据
        reset_mobile: '', //手机号
        reset_pwd: '', //密码
        reset_re_pwd: '', //重复密码
        reset_captcha_code: '', //图形验证码
        reset_message_code: '', //短信验证码
        // reset_message_code_btn: '获取验证码', //获取短信验证码按钮值
        // resetIsdisabled: false, //input禁用

        // 普通绑定
        bind_mobile: '', //手机号
        regist_bind_code: 86, //注册地区  +86 中国大陆  +886 中国台湾
        regist_bind_code_show: false,//国际编码显示
        regist_bind_code_search_val: '',//国际编码查询数据
        bind_pwd: '', //密码
        bind_captcha_code: '', //图形验证码
        bind_message_code: '', //短信验证码
        // bind_message_code_btn: '获取验证码', //获取短信验证码按钮值
        // bindIsdisabled: false, //input禁用
        // noPwdShow: false, //是否需要填写密码

        // 绑定其它手机号
        bind_other_mobile: '', //手机号
        regist_bind_other_code: 86, //注册地区  +86 中国大陆  +886 中国台湾
        regist_bind_other_code_show: false,//国际编码显示
        regist_bind_other_code_search_val: '',//国际编码查询数据
        bind_other_pwd: '', //密码
        bind_other_captcha_code: '', //图形验证码
        bind_other_message_code: '', //短信验证码
        // bind_other_message_code_btn: '获取验证码', //获取短信验证码按钮值
        // bindOtherIsdisabled: false, //input禁用
        // otherNoPwdShow: false, //是否需要填写密码
        tgly: -1, //推广来源，1：新人礼

        is_new_bind: 'disabled', // 是否是第一次登陆网站，并且未绑定手机号
        sex_is_check: 0, //性别

        code_data: '',// 国际编码数据

        agreement_check1: true,//账号登录 用户协议
        agreement_check2: true,//短信登录 用户协议
        agreement_check3: true,//注册登录 用户协议

        //新的性别选择老的不用了
        sex:{
            DOM:document.querySelector(".public-sex"),
            sex:0,
            nickname:"",
            DOMinput:false,//input对象
            DOMarr:[],
        },
        label:{
            DOM:document.querySelector(".public-label"),
            arr:[],//所选内容
            DOM_this_num:document.querySelector(".public-label .label_this_num")
        },
        up_level:{
            DOM:document.querySelector(".public_up_level"),
            level:0,//等级
        },
        is_login_timer:false,
    },
    onload: function () {
        var _this = this;
        this.data.code_data = PHONE_PREFIX;
        if ((typeof bound_moblie_alert) != "undefined") {
            this.data.is_new_bind = bound_moblie_alert;
        }
        this.watch();
        captcha1 = new TencentCaptcha('2058695242', function(res) {/* callback */
            if(res.ret === 0){
                _this.data.regist_ticket = res.ticket;
                _this.data.regist_rand_str = res.randstr;
                console.log(_this.data.regist_rand_str,_this.data.regist_ticket);
                console.log(_this.data.regist_Tencent_type);
                if (_this.data.regist_Tencent_type == -1) {
                    // 账号密码错误超过两次，显示图形验证码
                    _this.userLoginFun(true);
                }else {
                    _this.sendmessageFun(_this.data.regist_Tencent_type);
                }
             };
        });
        var login_timer = setInterval(function () {
            if (_this.data.is_login_timer) {
                clearInterval(login_timer);
                document.getElementById('web_room_btn').click();
            }
        }, 1000);
        // document.getElementById('web_room_btn_a').click();
    },
    // 监听 和事件绑定
    watch:function() {
        var _this = this;
        // 账号登录
        $('.user_mobile').on('input propertychange', function () {//手机号
            // console.log(1111);
            _this.data.user_mobile = $('.user_mobile').val();
        });
        $('.user_pwd').on('input propertychange', function () {//注册密码
            _this.data.user_pwd = $('.user_pwd').val();
        });
        $(".user_pwd").keypress(function (e) {// 密码框enter
            if (e.which == 13) {
                _this.userLoginFun();
            }
        });
        // 短信登录
        $('.msg_mobile').on('input propertychange', function () {// 手机号
            _this.data.msg_mobile = $('.msg_mobile').val();
        });
        $('.msg_pwd').on('input propertychange', function () {// 注册密码
            _this.data.msg_pwd = $('.msg_pwd').val();
        });
        $('.msg_captcha_code').on('input propertychange', function () {// 图形验证码
            _this.data.msg_captcha_code = $('.msg_captcha_code').val();
        });
        $('.msg_message_code').on('input propertychange', function () {// 短信验证码
            _this.data.msg_message_code = $('.msg_message_code').val();
        });
        // 注册
        $('.regist_mobile').on('input propertychange', function () {// 手机号
            _this.data.regist_mobile = $('.regist_mobile').val();
        });
        $('.regist_pwd').on('input propertychange', function () {// 注册密码
            _this.data.regist_pwd = $('.regist_pwd').val();
        });
        $('.regist_captcha_code').on('input propertychange', function () {// 图形验证码  弃用
            _this.data.regist_captcha_code = $('.regist_captcha_code').val();
        });
        $('.regist_message_code').on('input propertychange', function () {// 短信验证码
            _this.data.regist_message_code = $('.regist_message_code').val();
        });
        // 忘记密码
        $('.reset_mobile').on('input propertychange', function () {// 手机号
            _this.data.reset_mobile = $('.reset_mobile').val();
        });
        $('.reset_pwd').on('input propertychange', function () {// 注册密码
            _this.data.reset_pwd = $('.reset_pwd').val();
        });
        $('.reset_re_pwd').on('input propertychange', function () {// 注册密码
            _this.data.reset_re_pwd = $('.reset_re_pwd').val();
        });
        $('.reset_captcha_code').on('input propertychange', function () {// 图形验证码
            _this.data.reset_captcha_code = $('.reset_captcha_code').val();
        });
        $('.reset_message_code').on('input propertychange', function () {// 短信验证码
            _this.data.reset_message_code = $('.reset_message_code').val();
        });
        // 普通绑定
        $('.bind_mobile').on('input propertychange', function () {// 手机号
            _this.data.bind_mobile = $('.bind_mobile').val();
        });
        $('.bind_pwd').on('input propertychange', function () {// 注册密码
            _this.data.bind_pwd = $('.bind_pwd').val();
        });
        $('.bind_captcha_code').on('input propertychange', function () {// 图形验证码
            _this.data.bind_captcha_code = $('.bind_captcha_code').val();
        });
        $('.bind_message_code').on('input propertychange', function () {// 短信验证码
            _this.data.bind_message_code = $('.bind_message_code').val();
        });
        // 绑定其它手机号
        $('.bind_other_mobile').on('input propertychange', function () {// 手机号
            _this.data.bind_other_mobile = $('.bind_other_mobile').val();
        });
        $('.bind_other_pwd').on('input propertychange', function () {// 注册密码
            _this.data.bind_other_pwd = $('.bind_other_pwd').val();
        });
        $('.bind_other_captcha_code').on('input propertychange', function () {// 图形验证码
            _this.data.bind_other_captcha_code = $('.bind_other_captcha_code').val();
        });
        $('.bind_other_message_code').on('input propertychange', function () {// 短信验证码
            _this.data.bind_other_message_code = $('.bind_other_message_code').val();
        });
        // 国际编码搜索监听
        
        $('.regist_msg_code_search_val').on('input propertychange', function () {// 短信登录 国际编码搜索监听
            _this.find_list($('.regist_msg_code_wrap'), $('.regist_msg_code_search_val').val());
        });
        $('.regist_phone_code_search_val').on('input propertychange', function () {// 注册 国际编码搜索监听
            _this.find_list($('.regedit_code_wrap'), $('.regist_phone_code_search_val').val());
        });
        $('.regist_reset_code_search_val').on('input propertychange', function () {// 忘记密码 国际编码搜索监听
            _this.find_list($('.regist_reset_code_wrap'), $('.regist_reset_code_search_val').val());
        });
        $('.regist_bind_code_search_val').on('input propertychange', function () {// 普通绑定 国际编码搜索监听
            _this.find_list($('.regist_bind_code_wrap'), $('.regist_bind_code_search_val').val());
        });
        $('.regist_bind_other_code_search_val').on('input propertychange', function () {// 绑定其它手机号 国际编码搜索监听
            _this.find_list($('.regist_bind_other_code_wrap'), $('.regist_bind_other_code_search_val').val());
        });

        //性别的事件绑定 和对象选择
        //_this.data.sex.DOM.
        _this.data.sex.DOMarr = _this.data.sex.DOM.querySelectorAll("li");
        _this.data.sex.DOMinput = _this.data.sex.DOM.querySelector("input");
        for(var i=0;i<_this.data.sex.DOMarr.length;i++){
            _this.data.sex.DOMarr[i].onclick = function(){
                var data = this.getAttribute("data");
                if(data == 1){
                    _this.data.sex.DOMarr[0].classList.add("active");
                    _this.data.sex.DOMarr[1].classList.remove("active");
                }else{
                    _this.data.sex.DOMarr[1].classList.add("active");
                    _this.data.sex.DOMarr[0].classList.remove("active");
                };
                _this.data.sex.sex = data;
            };
        };
        //点击下一步事件
        _this.data.sex.DOM.querySelector("button").onclick = function(){
            _this.saveSexFun();
        };

        //标签选择处理
        _this.data.label.DOM.querySelector(".right").onclick = function(){
            _this.data.label.DOM.style.display = 'none';
            _this.open_web_room(false);
        };
        if (loginstatus) {
            //获取标签数据
            $.ajax({
                type: "POST",
                url: "/user/usercenter/getlabelconfig",
                data: "",
                dataType: "json",
                success: function (res) {
                    if (res.code == 1) {
                        var arr = res.data;
                        _this.label_fn(arr);
                    };
                },
                error: function () {
                }
            });
        }
        //标签的提交事件
        _this.data.label.DOM.querySelector("button").onclick = function(){
            if(_this.data.label.arr.length === 0){
                layer.msg("请选择标签");
                return;
            };
            var todata = {
                aliasList:_this.data.label.arr.join(",")
            };
            $.ajax({
                type: "POST",
                url: '/user/usercenter/setUserLabel',
                data: todata,
                dataType: "json",
                success: function (res) {
                    if (res.code == 1) {
                        _this.open_web_room("设置成功");
                    } else {
                        layer.msg(res.msg, {
                            time: 2000
                        }, function () {});
                    }
                },
                error:function(){
                    layer.msg("网络连接错误请重试", {
                        time: 2000
                    }, function () {});
                }
            });
        };
    },
    //腾讯云图形验证
    captcha_show:function(type){
        // type:-1,账号密码错误超过两次，显示图形验证码
        var _this = this;
        console.log(type);
        _this.data.regist_Tencent_type = type;
        if(type == 1){
            // 登录图形验证
            if (!common.form_Verification({type: "mobile", el: ".msg_mobile", parset: ".msg-inp", value: _this.data.msg_mobile})) {
                return false;
            }
        } else if (type == 2){
            // 注册图形验证
            if (!common.form_Verification({type: "mobile", el: ".regist_mobile", parset: ".regist-inp", value: _this.data.regist_mobile})) {
                return false;
            }
        };        
        captcha1.show(); // 显示验证码
    },
    /**
     *
     *
     * @param {*} ind  类型判断显示弹窗： 1|登录注册弹窗， 2|忘记密码，3|绑定手机号 4|绑定其它手机号，5|绑定成功，6|没有绑定手机号绑定 7|数据库存在继续绑定，8|绑定账号有未完成订单弹窗   9|等级等级弹窗
     * @param {*} ly 1:|注册，4|网页版聊天室
     * @returns
     */
    bindPopShowFun: function (ind, ly) {
        if (!this.data.is_load) {
            this.onload();
            this.data.is_load = true;
        }
        if(ind === 12){
            //性别选择
            this.data.sex.DOM.style.display = 'block';
            //已有昵称填入输入框
            this.data.sex.DOMinput.value = ly||'';
            tel_login_v1.close()
            return;
        }else if(ind === 13){
            // 是否是新入驻用户，是则弹出标签选项
            if (typeof alert_pw_label != 'undefined' && alert_pw_label) {
                this.data.is_pw_rz = alert_pw_label;
            }
            if(this.data.is_pw_rz) {
                // 新入驻用户
                $(this.data.label.DOM).find('.pw_msg').show();
                $(this.data.label.DOM).find('.no_pw_msg').hide();
            }else {
                // 新注册用户
                $(this.data.label.DOM).find('.pw_msg').hide();
                $(this.data.label.DOM).find('.no_pw_msg').show();
            }
            this.data.label.DOM.style.display = 'block';
            tel_login_v1.close()
            return;
        }else if(ind === 9){
            $(this.data.up_level.DOM).find('#u_big_level').text(this.data.up_level.level);
            $(this.data.up_level.DOM).find('#u_sub_level').text(this.data.up_level.level);
            this.data.up_level.DOM.style.display = 'block';
            tel_login_v1.close()
            return;

        };
        this.data.pop_wrap.show();// 显示弹窗外层
        
        this.refreshImgCode();// 刷新图形验证码
        var pop_index = '.pop-box' + ind;// 内部弹窗 索引
        this.data.pop_wrap.find(pop_index).show().siblings('.pop-box').hide();
        this.data.tgly = ly;
        
        if (ly == 1) {
            this.showTab(2)
        }
        if (ind == 3) {
            localStorage.setItem('is_bind_show', true);
        }
        if (ind == 1 && ly != 1) {
            this.showTab(0)
        }
        this.lockScrollBody();
    },
    //允许滑动
    scrollBody: function () {
        document.getElementsByTagName("body")[0].style.position = "relative";
    },
    //禁止滑动
    lockScrollBody: function () {
        document.getElementsByTagName("body")[0].style.position = "fixed";
    },
    // 登录注册选项卡切换
    showTab: function (ind) {
        this.data.pop_box1.find('.login-content-item').eq(ind).show().siblings().hide();
        if(ind == 0 || ind == 1){
            this.data.pop_box1.find('.login-reg-title').find('.text').eq(0).addClass('on').siblings().removeClass('on');
        }else {
            this.data.pop_box1.find('.login-reg-title').find('.text').eq(1).addClass('on').siblings().removeClass('on');
        }
        this.refreshImgCode();
    },
    // 关闭弹窗
    close: function () {
        this.data.pop_wrap.hide();
        this.scrollBody();
    },
    close_level_pop:function(){
        $(this.data.up_level.DOM).hide();
        this.scrollBody();
    },
    // 记住密码
    urserCheckFun: function() {
        if (this.data.checked) {
            this.data.checked = false;
            $('.user-check').removeClass('on');
        }else {
            this.data.checked = true;
            $('.user-check').addClass('on');
        }
    },
    // 注册协议选择
    registCheckFun: function () {
        if (this.data.agreementChecked) {
            this.data.agreementChecked = false;
            $('.regist-check').removeClass('on');
        } else {
            this.data.agreementChecked = true;
            $('.regist-check').addClass('on');
        }
    },
    //手机号密码登录的时候的注册协议的勾选状态
    registCheckFun1:function(){
        if (this.data.agreementChecked1) {
            this.data.agreementChecked1 = false;
            $('.regist-check1').removeClass('on');
        } else {
            this.data.agreementChecked1 = true;
            $('.regist-check1').addClass('on');
        }
    },
    //登录的时候的选择
    registCheckFun2:function(){
        if (this.data.agreementChecked2) {
            this.data.agreementChecked2 = false;
            $('.regist-check2').removeClass('on');
        } else {
            this.data.agreementChecked2 = true;
            $('.regist-check2').addClass('on');
        }
    },
    //账号登录
    userLoginFun: function (is_code) {
        var _this = this;
        var urls = '/user/Login/doLogin';
        //判读用户协议必须要选择
        if (!_this.data.agreementChecked1) {
            layer.msg("请先阅读并同意《刀锋电竞用户协议》和《隐私政策》");
            return false;
        };
        // 普通密码登录
        if (!common.form_Verification({type: "login_number", el: ".user_mobile", parset: ".login-inp", value: this.data.user_mobile})) {
            //手机号未通过
            return false;
        };
        if (!common.form_Verification({ type: "password", el: ".user_pwd", parset: ".login-inp", value: this.data.user_pwd})) {
            //密码未通过
            return false;
        };
        var data = {
            'usercode': this.data.user_mobile,
            'password': this.data.user_pwd,
            'is_remember': this.data.checked,
            'login_type': 1, //登录方式
        };
        // 密码错误两次
        if (is_code) {
            data.ticket = _this.data.regist_ticket;
            data.rand_str = _this.data.regist_rand_str;
        }

        $.ajax({
            type: "POST",
            url: urls,
            data: data,
            dataType: "json",
            async: false,
            success: function (res) {
                if (res.code == 1) {
                    var json = res.data;
                    if (json.is_password === 1) {
                        // 网页版聊天室
                        if (_this.data.tgly == 4) {
                            _this.open_web_room('登录成功');
                        } else {
                            layer.msg('登录成功', {
                                time: 2000
                            }, function () {
                                    window.location.href = window.location.href;
                            });
                            
                        }
                    }
                } else if (res.code == 0) {
                    if (res.data.t_captcha && res.data.t_captcha === 1) {
                        _this.captcha_show(-1);//显示腾讯验证码
                    }else {
                        layer.msg(res.msg, {
                            time: 2000
                        }, function () { });
                    }
                } else {
                    layer.msg(res.msg, {
                        time: 2000
                    }, function () { });
                }
            }
        });
        
    },
    //短信登录
    msgLoginFun: function () {
        var _this = this;
        var urls = '/user/Login/doLogin';
        // 短信登录
        // if (!common.form_Verification({ type: "phone_code", el: ".msg_country_code", parset: ".msg-inp", value: this.data.regist_msg_code})) {
        //     //地区
        //     return false;
        // };
        if (!common.form_Verification({ type: "mobile", el: ".msg_mobile", parset: ".msg-inp", value: this.data.msg_mobile})) {
            //手机号未通过
            return false;
        };
        //弃用  改用腾讯云图形验证
        // if (!common.form_Verification({ type: "captcha_code", el: ".msg_captcha_code", parset: ".msg-inp", value: this.data.msg_captcha_code})) {
        //     return false;
        // }
        if (!common.form_Verification({ type: "message_code", el: ".msg_message_code", parset: ".msg-inp", value: this.data.msg_message_code})) {
            //密码未通过
            return false;
        };

        if (!_this.data.agreementChecked2) {
            layer.msg("请先阅读并同意《刀锋电竞用户协议》和《隐私政策》");
            return false;
        };
        var data = {
            'usercode': this.data.msg_mobile,
            'area_num': this.data.regist_msg_code,
            'is_remember': "",
            'login_type': 2, //登录方式
            'mcode': this.data.msg_message_code
        };
        $.ajax({
            type: "POST",
            url: urls,
            data: data,
            dataType: "json",
            success: function (res) {
                if (res.code == 1) {
                    var json = res.data;
                    if (json.is_password === 1) {
                        // 网页版聊天室
                        if (_this.data.tgly == 4) {
                            _this.open_web_room('登录成功');
                        } else {
                            layer.msg('登录成功', {
                                time: 2000
                            }, function () {
                                window.location.href = window.location.href;
                            });

                        }
                    } else if (Number(json.is_password) === 0) {
                        layer.msg('您尚未设置登录密码,请设置', {
                            time: 2000
                        }, function () {
                            _this.data.pop_box1.find(".msg-login-pwd").hide();
                            _this.data.pop_box1.find(".msg-login-nopwd").show();
                            _this.data.pop_box1.find(".pwd-inpt-wrap").show();
                        });
                    };
                } else {
                    layer.msg(res.msg, {
                        time: 2000
                    }, function () {});
                }
            }
        });
        
    },
    //设置密码
    setPassword: function (ind) {
        var _this = this;
        var pwd = "";
        if (ind === 1) {
            pwd = this.data.msg_pwd;
            if (!common.form_Verification({type: "password", el: ".msg_pwd", parset: ".msg-inp", value: this.data.msg_pwd})) {
                return false;
            }
        } else if (ind === 2) {
            pwd = this.data.bind_pwd;
            if (!common.form_Verification({ type: "password", el: ".bind_pwd", parset: ".msg-inp", value: this.data.bind_pwd})) {
                return false;
            }
        } else if (ind === 3) {
            pwd = this.data.bind_other_pwd;
            if (!common.form_Verification({ type: "password", el: ".bind_other_pwd", parset: ".msg-inp", value: this.data.bind_other_pwd})) {
                return false;
            }
        } else if (ind === 4) {
            pwd = this.data.set_pwd;
            if (!common.form_Verification({ type: "password", el: ".set_pwd", parset: ".set-pwd-inp", value: this.data.set_pwd})) {
                return false;
            }
        };
        var urls = '/user/usercenter/doSetpassword';
        var data = {
            'password': pwd
        };
        $.ajax({
            type: "POST",
            url: urls,
            data: data,
            dataType: "json",
            success: function (res) {
                if (res.code == 1) {
                    if (ind == 4) {
                        layer.msg('设置成功', {
                            time: 2000
                        }, function () {
                            location.href = location.href;
                        });
                    } else {
                        layer.msg('登录成功', {
                            time: 2000
                        }, function () {
                            if (!tel_login_v1.sex_is_check) {
                                // 不是第一次登陆 但是没有设置性别 显示设置性别弹窗
                                tel_login_v1.bindPopShowFun(12, djnav.data.user_info.nickname);
                            } else {
                                // 是否是新入驻用户，是则弹出标签选项
                                if (typeof alert_pw_label != 'undefined' && alert_pw_label) {
                                    tel_login_v1.bindPopShowFun(13);
                                }else {
                                    location.href = location.href;
                                }
                            }
                        });
                        
                    };
                } else {
                    layer.msg(res.msg, {
                        time: 2000
                    }, function () {});
                }
            }
        });
    },
    //获取手机验证码 参数type：1|短信登录，2|注册,3|绑定手机号,4|绑定其它手机号，5|找回密码
    sendmessageFun: function (type) {
        var url = '/user/sms/do_send';
        var data = {};
        var _this = this;
        console.log(type);
        if (type === 1) { //1|短信登录

            if (!_this.data.agreement_check2) {
                layer.msg("请先阅读并同意《刀锋电竞用户协议》和《隐私政策》");
                return false;
            };
            if (!common.form_Verification({type: "mobile", el: ".msg_mobile", parset: ".msg-inp", value: _this.data.msg_mobile})) {
                return false;
            }
            console.log("-----");
            //弃用  改用腾讯云手动图形验证
            // if (!common.form_Verification({ type: "captcha_code", el: ".msg_captcha_code", parset: ".msg-inp", value: _this.data.msg_captcha_code})) {
            //     return false;
            // }
            _this.data.pop_box.find(".msg_mobile").attr("readonly", true);//手机号不能更改
            // _this.data.pop_box.find(".msg_captcha_code").attr("readonly", true); // 图形验证码不允许输入
            _this.data.pop_box.find(".msg_phone-security-code").attr("disabled", true);//发短信按钮禁用
            data = {
                'mobile': _this.data.msg_mobile,
                // 'captcha': _this.data.msg_captcha_code,
                'area_num': _this.data.regist_msg_code||86,
                'type': 'code_login',
                'ticket':_this.data.regist_ticket,
                'rand_str':_this.data.regist_rand_str
            };
            // console.log(data);
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                success: function (res) {
                    if (res.code == 1) {
                        layer.msg("发送成功");
                        var second = 60;
                        var timer = setInterval(function () {
                            second -= 1;
                            _this.data.pop_box.find(".msg_phone-security-code").val(second + 's');
                            if (second < 0) {
                                _this.data.pop_box.find(".msg_mobile").attr("readonly", false);//手机号不能更改
                                _this.data.pop_box.find(".msg_captcha_code").attr("readonly", false); // 图形验证码不允许输入
                                _this.data.pop_box.find(".msg_phone-security-code").attr("disabled", false);//发短信按钮禁用
                                _this.data.pop_box.find(".msg_phone-security-code").val('获取验证码');
                                clearInterval(timer);
                            }
                        }, 1000);
                    } else {
                        layer.msg(res.msg)
                        _this.refreshImgCode();
                        _this.data.pop_box.find(".msg_mobile").attr("readonly", false);//手机号不能更改
                        _this.data.pop_box.find(".msg_captcha_code").attr("readonly", false); // 图形验证码不允许输入
                        _this.data.pop_box.find(".msg_phone-security-code").attr("disabled", false);//发短信按钮禁用
                    }
                }
            });
            
        } else if (type === 2) { //2|注册
            if (!_this.data.agreement_check3) {
                layer.msg("请先阅读并同意《刀锋电竞用户协议》和《隐私政策》");
                return false;
            };
            if (!common.form_Verification({type: "mobile", el: ".regist_mobile", parset: ".regist-inp", value: _this.data.regist_mobile})) {
                return false;
            }
            //弃用  改用腾讯云手动图形验证
            // if (!common.form_Verification({ type: "captcha_code", el: ".regist_captcha_code", parset: ".regist-inp", value: _this.data.regist_captcha_code})) {
            //     return false;
            // }
            _this.data.pop_box.find(".regist_mobile").attr("readonly", true);//手机号不能更改
            // _this.data.pop_box.find(".regist_captcha_code").attr("readonly", true); // 图形验证码不允许输入  弃用
            _this.data.pop_box.find(".regist_phone-security-code").attr("disabled", true);//发短信按钮禁用
            data = {
                'mobile': _this.data.regist_mobile,
                // 'captcha': _this.data.regist_captcha_code,
                'area_num': _this.data.regist_phone_code||86,
                'type': 'register',
                'ticket':_this.data.regist_ticket,
                'rand_str':_this.data.regist_rand_str
            };
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                success: function (res) {
                    if (res.code == 1) {
                        layer.msg("发送成功");
                        var second = 60;
                        var timer = setInterval(function () {
                            second -= 1;
                            _this.data.pop_box.find(".regist_phone-security-code").val(second + 's');
                            if (second < 0) {
                                _this.data.pop_box.find(".regist_mobile").attr("readonly", false);//手机号不能更改
                                // _this.data.pop_box.find(".regist_captcha_code").attr("readonly", false); // 图形验证码不允许输入  弃用
                                _this.data.pop_box.find(".regist_phone-security-code").attr("disabled", false);//发短信按钮禁用
                                _this.data.pop_box.find(".regist_phone-security-code").val('获取验证码');
                                clearInterval(timer);
                            }
                        }, 1000);
                    } else {
                        layer.msg(res.msg)
                        _this.refreshImgCode();
                        _this.data.pop_box.find(".regist_mobile").attr("readonly", false);//手机号不能更改
                        // _this.data.pop_box.find(".regist_captcha_code").attr("readonly", false); // 图形验证码不允许输入  弃用
                        _this.data.pop_box.find(".regist_phone-security-code").attr("disabled", false);//发短信按钮禁用
                    }
                }
            });
            
        } else if (type === 3) { //3|绑定手机号
            if (!common.form_Verification({type: "mobile", el: ".bind_mobile", parset: ".bind-inp", value: _this.data.bind_mobile})) {
                return false;
            }
            if (!common.form_Verification({ type: "captcha_code", el: ".bind_captcha_code", parset: ".bind-inp", value: _this.data.bind_captcha_code})) {
                return false;
            }
            _this.data.pop_box.find(".bind_mobile").attr("readonly", true);//手机号不能更改
            _this.data.pop_box.find(".bind_captcha_code").attr("readonly", true); // 图形验证码不允许输入
            _this.data.pop_box.find(".bind_phone-security-code").attr("disabled", true);//发短信按钮禁用
            data = {
                'mobile': _this.data.bind_mobile,
                'captcha': _this.data.bind_captcha_code,
                'area_num': _this.data.regist_bind_code||86,
                'type': 'bind_phone'
            };
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                success: function (res) {
                    if (res.code == 1) {
                        layer.msg("发送成功");
                        var second = 60;
                        var timer = setInterval(function () {
                            second -= 1;
                            _this.data.pop_box.find(".bind_phone-security-code").val(second + 's');
                            if (second < 0) {
                                _this.data.pop_box.find(".bind_mobile").attr("readonly", false);//手机号不能更改
                                _this.data.pop_box.find(".bind_captcha_code").attr("readonly", false); // 图形验证码不允许输入
                                _this.data.pop_box.find(".bind_phone-security-code").attr("disabled", false);//发短信按钮禁用
                                _this.data.pop_box.find(".bind_phone-security-code").val('获取验证码');
                                clearInterval(timer);
                            }
                        }, 1000);
                    } else {
                        layer.msg(res.msg)
                        _this.refreshImgCode();
                        _this.data.pop_box.find(".bind_mobile").attr("readonly", false);//手机号不能更改
                        _this.data.pop_box.find(".bind_captcha_code").attr("readonly", false); // 图形验证码不允许输入
                        _this.data.pop_box.find(".bind_phone-security-code").attr("disabled", false);//发短信按钮禁用
                    }
                }
            });
        } else if (type === 4) { //4|绑定其它手机号
            if (!common.form_Verification({type: "mobile", el: ".bind_other_mobile", parset: ".bind-other-inp", value: _this.data.bind_other_mobile})) {
                return false;
            }
            if (!common.form_Verification({ type: "captcha_code", el: ".bind_other_captcha_code", parset: ".bind-other-inp", value: _this.data.bind_other_captcha_code})) {
                return false;
            }
            // _this.bindOtherIsdisabled = true; //手机号不能更改、发短信按钮禁用
            // _this.code_readonly = true;
            _this.data.pop_box.find(".bind_other_mobile").attr("readonly", true);//手机号不能更改
            _this.data.pop_box.find(".bind_other_captcha_code").attr("readonly", true); // 图形验证码不允许输入
            _this.data.pop_box.find(".bind_other_phone-security-code").attr("disabled", true);//发短信按钮禁用
            data = {
                'mobile': _this.data.bind_other_mobile,
                'captcha': _this.data.bind_other_captcha_code,
                'area_num': _this.data.regist_bind_other_code||86,
                'type': 'bind_phone'
            };
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                success: function (res) {
                    if (res.code == 1) {
                        layer.msg("发送成功");
                        var second = 60;
                        var timer = setInterval(function () {
                            second -= 1;
                            _this.data.pop_box.find(".bind_other_phone-security-code").val(second + 's');
                            if (second < 0) {
                                _this.data.pop_box.find(".bind_other_mobile").attr("readonly", false);//手机号不能更改
                                _this.data.pop_box.find(".bind_other_captcha_code").attr("readonly", false); // 图形验证码不允许输入
                                _this.data.pop_box.find(".bind_other_phone-security-code").attr("disabled", false);//发短信按钮禁用
                                _this.data.pop_box.find(".bind_other_phone-security-code").val('获取验证码');
                                clearInterval(timer);
                            }
                        }, 1000);
                    } else {
                        layer.msg(res.msg)
                        _this.refreshImgCode();
                        _this.data.pop_box.find(".bind_other_mobile").attr("readonly", false);//手机号不能更改
                        _this.data.pop_box.find(".bind_other_captcha_code").attr("readonly", false); // 图形验证码不允许输入
                        _this.data.pop_box.find(".bind_other_phone-security-code").attr("disabled", false);//发短信按钮禁用
                    }
                }
            });
        } else if (type === 5) { //5|找回密码
            if (!common.form_Verification({type: "mobile", el: ".reset_mobile", parset: ".reset-inp", value: _this.data.reset_mobile})) {
                return false;
            }
            if (!common.form_Verification({ type: "captcha_code", el: ".reset_captcha_code", parset: ".reset-inp", value: _this.data.reset_captcha_code})) {
                return false;
            }
            // _this.resetIsdisabled = true; //手机号不能更改、发短信按钮禁用
            // _this.code_readonly = true;
            _this.data.pop_box.find(".reset_mobile").attr("readonly", true);//手机号不能更改
            _this.data.pop_box.find(".reset_captcha_code").attr("readonly", true); // 图形验证码不允许输入
            _this.data.pop_box.find(".reset_phone-security-code").attr("disabled", true);//发短信按钮禁用
            data = {
                'mobile': _this.data.reset_mobile,
                'captcha': _this.data.reset_captcha_code,
                'area_num': _this.data.regist_reset_code||86,
                'type': "find_pass"
            };
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                success: function (res) {
                    if (res.code == 1) {
                        layer.msg("发送成功");
                        var second = 60;
                        var timer = setInterval(function () {
                            second -= 1;
                            _this.data.pop_box.find(".reset_phone-security-code").val(second + 's');
                            // _this.msg_message_code_btn = second + 's';
                            if (second < 0) {
                                // _this.msgIsdisabled = false; //手机号能更改、发短信按钮解禁
                                _this.data.pop_box.find(".reset_mobile").attr("readonly", false);//手机号不能更改
                                _this.data.pop_box.find(".reset_captcha_code").attr("readonly", false); // 图形验证码不允许输入
                                _this.data.pop_box.find(".reset_phone-security-code").attr("disabled", false);//发短信按钮禁用
                                _this.data.pop_box.find(".reset_phone-security-code").val('获取验证码');
                                // _this.msg_message_code_btn = '获取验证码';
                                clearInterval(timer);
                            }
                        }, 1000);
                    } else {
                        layer.msg(res.msg)
                        _this.refreshImgCode();
                        // _this.msgIsdisabled = false;
                        _this.data.pop_box.find(".reset_mobile").attr("readonly", false);//手机号不能更改
                        _this.data.pop_box.find(".reset_captcha_code").attr("readonly", false); // 图形验证码不允许输入
                        _this.data.pop_box.find(".reset_phone-security-code").attr("disabled", false);//发短信按钮禁用
                    }
                }
            });
        };
    },
    // 显示国际编码
    regist_ul_show: function (type) {
        if (type === 1) {
            $('.regist_msg_code_wrap').show();
        }
        if (type === 2) {
            $('.regedit_code_wrap').show();
        }
        if (type === 3) {
            $('.regist_reset_code_wrap').show();
        }
        if (type === 4) {
            $('.regist_bind_code_wrap').show();
        }
        if (type === 5) {
            $('.regist_bind_other_code_wrap').show();
        }
    },
    // 选中国际编码
    check_ccode_fun: function (i, type,is_hot) {
        var areanum = '';
        if(is_hot===1) {
            areanum = PHONE_PREFIX.hot[i].areanum;
        }else {
            areanum = PHONE_PREFIX.all[i].areanum;
        }
        $('.search_code_inpt').val('');
        $(".hot_wrap").show();
        $(".list_all_wrap .list .li").show();
        if (type === 1) {
            this.data.regist_msg_code = areanum;
            // console.log(this.data.regist_msg_code);
            $('.regist_msg_code_wrap').hide();
            $('.msg_country_code_text').text(areanum);
        }
        if (type === 2) {
            this.data.regist_phone_code = areanum;
            $('.regedit_code_wrap').hide();
            $('.regist_country_code_text').text(areanum);
        }
        if (type === 3) {
            this.data.regist_reset_code = areanum;
            $('.reset_country_code_text').text(areanum);
            $('.regist_reset_code_wrap').hide();
        }
        if (type === 4) {
            this.data.regist_bind_code = areanum;
            $('.bind_country_code_text').text(areanum);
            $('.regist_bind_code_wrap').hide();
        }
        if (type === 5) {
            this.data.regist_bind_other_code = areanum;
            $('.bind_other_country_code_text').text(areanum);
            $('.regist_bind_other_code_wrap').hide();
        }
    },
    // 国际编码搜索查询显示
    find_list: function (obj, keyword) {
        var arr = [];
        var list = PHONE_PREFIX.all;

        for (var i = 0; i < list.length; i++) {
            if (list[i].cname.indexOf(keyword) !== -1) {
                arr.push(i);
            }
        }
        if (!keyword) {
            obj.find(".hot_wrap").show();
            obj.find(".list_all_wrap .list .li").show();
        } else {
            obj.find(".hot_wrap").hide();
            obj.find(".list_all_wrap .list .li").hide();
            for (var i in arr) {
                obj.find(".list_all_wrap .list .li").eq(arr[i]).show();
            }
        }
    },
    //注册
    register: function () {
        if (!common.form_Verification({ type: "phone_code", el: ".regist_phone_code", parset: ".regist-inp", value: this.data.regist_phone_code})) {
            return false;
        }
        if (!common.form_Verification({ type: "mobile", el: ".regist_mobile", parset: ".regist-inp", value: this.data.regist_mobile})) {
            return false;
        }
        //弃用 改用腾讯云手动图形验证
        // if (!common.form_Verification({ type: "captcha_code", el: ".regist_captcha_code", parset: ".regist-inp", value: this.data.regist_captcha_code})) {
        //     return false;
        // }
        if (!common.form_Verification({ type: "message_code", el: ".regist_message_code", parset: ".regist-inp", value: this.data.regist_message_code})) {
            return false;
        }
        if (!common.form_Verification({ type: "password", el: ".regist_pwd", parset: ".regist-inp", value: this.data.regist_pwd})) {
            return false;
        }
        if (!this.data.agreementChecked) {
            layer.msg("未选择服务协议");
            return false;
        };

        var urls = '/user/Register/doRegister';
        var data = {
            'usercode': this.data.regist_mobile,
            'password': this.data.regist_pwd,
            'phone_code': this.data.regist_phone_code,
            'register_type': 1,
            'mcode': this.data.regist_message_code
        };
        if (common.GetQueryString('source') == 'newer_game') {
            data.source = 'newer_game'
        }
        var _this = this;
        $.ajax({
            type: "POST",
            url: urls,
            data: data,
            dataType: "json",
            success: function (res) {
                if (res.code == 1) {
                    layer.msg("注册成功", {
                        time: 2000
                    }, function () {
                        window.location.href = window.location.href;
                    });
                } else {
                    layer.msg(res.msg, {
                        time: 2000
                    }, function () {});
                }
            }
        });
    },
    //找回密码
    password_find: function () {
        if (!common.form_Verification({type: "phone_code", el: ".regist_phone_code", parset: ".reset-inp", value: this.data.regist_reset_code})) {
            return false;
        }
        if (!common.form_Verification({ type: "mobile", el: ".reset_mobile", parset: ".reset-inp", value: this.data.reset_mobile})) {
            return false;
        }
        if (!common.form_Verification({ type: "captcha_code", el: ".reset_captcha_code", parset: ".reset-inp", value: this.data.reset_captcha_code})) {
            return false;
        }
        if (!common.form_Verification({ type: "message_code", el: ".reset_message_code", parset: ".reset-inp", value: this.data.reset_message_code})) {
            return false;
        }
        if (!common.form_Verification({ type: "password", el: ".reset_pwd", parset: ".reset-inp", value: this.data.reset_pwd})) {
            return false;
        }
        if (!common.form_Verification({ type: "password", el: ".reset_re_pwd", parset: ".reset-inp", value: this.data.reset_re_pwd})) {
            return false;
        }
        if (!common.form_Verification({ type: "repassword", el: ".reset_re_pwd", parset: ".reset-inp", value: this.data.reset_re_pwd, oldvalue: this.data.reset_pwd})) {
            return false;
        }

        var url = '/ac/password_find';
        var data = {
            'mobile': this.data.reset_mobile,
            'phone_code': this.data.regist_reset_code,
            'password': this.data.reset_pwd,
            'password_confirm': this.data.reset_re_pwd,
            'message_code': this.data.reset_message_code
        };
        var _this = this;
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "json",
            success: function (res) {
                if (res.code == 1) {
                    layer.msg('找回密码成功', {
                        time: 2000
                    }, function () {
                        window.location.href = window.location.href;
                    });
                } else {
                    layer.msg(res.msg, {
                        time: 2000
                    }, function () {});
                }
            }
        });
    },
    // 绑定手机号
    bindFun: function (ind) {
        var url = '/user/Usercenter/doBuild';
        var _this = this;
        var data = {};
        if (ind === 0) { //更换绑定手机号和第三方登录第一次绑定
            if (!common.form_Verification({type: "phone_code", el: ".regist_phone_code", parset: ".reset-inp", value: this.data.regist_bind_code})) {
                return false;
            }
            if (!common.form_Verification({ type: "mobile", el: ".bind_mobile", parset: ".bind-inp", value: _this.data.bind_mobile})) {
                return false;
            }
            if (!common.form_Verification({ type: "captcha_code", el: ".bind_captcha_code", parset: ".bind-inp", value: _this.data.bind_captcha_code})) {
                return false;
            }
            if (!common.form_Verification({ type: "message_code", el: ".bind_message_code", parset: ".bind-inp", value: _this.data.bind_message_code})) {
                return false;
            }

            data = {
                'mobile': _this.data.bind_mobile,
                'area_num': _this.data.regist_bind_code,
                'build_type': 1,
                'mcode': _this.data.bind_message_code
            };
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                success: function (res) {
                    // 第三方登录手机号已存在
                    if (res.code === 101) {
                        _this.bindPopShowFun(7);
                        return;
                    } else if (res.code === 100 || res.code === 0) {
                        layer.msg(res.msg, {
                            time: 2000
                        }, function () { });
                    } else {
                        var ispwd = res.data.is_password;
                        if (ispwd === 0) {
                            layer.msg('您尚未设置登录密码,请设置', {
                                time: 1000
                            }, function () {
                                _this.data.pop_box.find('.bind-pwd').show();
                                _this.data.pop_box.find('.bind-btn-nopwd').show();
                                _this.data.pop_box.find('.bind-btn-pwd').hide();
                            });
                        } else if (ispwd === 1) {
                            layer.msg('绑定成功', {
                                time: 3000
                            }, function () {
                                if (!tel_login_v1.sex_is_check) {
                                    // 不是第一次登陆 但是没有设置性别 显示设置性别弹窗
                                    tel_login_v1.bindPopShowFun(12, djnav.data.user_info.nickname);
                                } else {
                                    // 是否是新入驻用户，是则弹出标签选项
                                    if (typeof alert_pw_label != 'undefined' && alert_pw_label) {
                                        tel_login_v1.bindPopShowFun(13);
                                    }else {
                                        location.href = location.href;
                                    }
                                }
                            });
                        };
                    };
                }
            });
        } else if (ind === 1) { //继续绑定，合并
            data = {
                'mobile': _this.data.bind_mobile,
                'phone_code': _this.data.regist_bind_code,
                'build_type': 2,
                'mcode': _this.data.bind_message_code
            };
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                success: function (res) {
                    // 第三方登录手机号已存在
                    if (res.code === 101) {
                        _this.bindPopShowFun(7);
                        return;
                    } else if (res.code === 102) {
                        _this.bindPopShowFun(8);
                        return;
                    } else if (res.code === 100 || res.code === 0) {
                        layer.msg(res.msg, {
                            time: 2000
                        }, function () {
                            window.location.href = window.location.href;
                        });
                    } else {
                        _this.bindPopShowFun(5);
                        setTimeout(function () {
                            window.location.href = window.location.href;
                        }, 3000);
                    };
                }
            });
        } else if (ind === 2) { //绑定其它手机号
            if (!common.form_Verification({type: "phone_code", el: ".regist_phone_code", parset: ".reset-inp", value: _this.data.regist_bind_other_code})) {
                return false;
            }
            if (!common.form_Verification({type: "mobile", el: ".bind_other_mobile", parset: ".bind-other-inp", value: _this.data.bind_other_mobile})) {
                return false;
            }
            if (!common.form_Verification({type: "captcha_code", el: ".bind_other_captcha_code", parset: ".bind-other-inp", value: _this.data.bind_other_captcha_code})) {
                return false;
            }
            if (!common.form_Verification({type: "captcha_code", el: ".bind_other_message_code", parset: ".bind-other-inp", value: _this.data.bind_other_message_code})) {
                return false;
            }
            data = {
                'mobile': _this.data.bind_other_mobile,
                'phone_code': _this.data.regist_bind_other_code,
                'build_type': 1,
                'mcode': _this.data.bind_other_message_code
            };
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                success: function (res) {
                    // 第三方登录手机号已存在
                    if (res.code === 101) {
                        _this.bindPopShowFun(7);
                        return;
                    } else if (res.code === 102) {
                        _this.bindPopShowFun(8);
                        return;
                    } else if (res.code === 100 || res.code === 0) {
                        layer.msg(res.msg, {
                            time: 2000
                        }, function () { });
                    } else {
                        var ispwd = res.data.is_password;
                        if (ispwd === 0) {
                            layer.msg('您尚未设置登录密码,请设置', {
                                time: 1000
                            }, function () {
                                _this.data.pop_box.find('.bind-pwd').show();
                                _this.data.pop_box.find('.bind-btn-nopwd').show();
                                _this.data.pop_box.find('.bind-btn-pwd').hide();
                            });
                        } else if (ispwd === 1) {
                            layer.msg('绑定成功', {
                                time: 3000
                            }, function () {
                                if (!tel_login_v1.sex_is_check) {
                                    // 不是第一次登陆 但是没有设置性别 显示设置性别弹窗
                                    tel_login_v1.bindPopShowFun(12, djnav.data.user_info.nickname);
                                } else {
                                    // 是否是新入驻用户，是则弹出标签选项
                                    if (typeof alert_pw_label != 'undefined' && alert_pw_label) {
                                        tel_login_v1.bindPopShowFun(13);
                                    }else {
                                        window.location.href = window.location.href;
                                    }
                                }
                            });
                        };
                        // _this.bindPopShowFun(5);
                        // setTimeout(function () {
                        //     window.location.href = window.location.href;
                        // }, 3000);
                    };
                }
            });
        }
    },
    // 绑定其它手机号
    // bindOtherFun: function () {
    //     this.popShow = 4;
    //     this.refreshImgCode();
    // },
    //注册陪玩协议
    agreement_fn: function (type) {
        if(type === 1) {// 注册协议
            layer.open({
                type: 2,
                title: ['刀锋电竞用户协议', 'text-align:center;color:#313131;font-size:18px;'],
                shadeClose: true,
                shade: 0.5,
                area: ['800px', '600px'],
                content: '/agreement/register.html' //iframe的url
            }); 
        } else if (type === 2) {// 隐私协议
            layer.open({
                type: 2,
                title: "",
                shadeClose: true,
                shade: 0.5,
                area: ['800px', '600px'],
                content: '/index/Agreement/privacy.html' //iframe的url
            }); 
        }
    },
    //弃用  刷新图形验证码  改用腾讯云手动图形验证
    refreshImgCode: function () {
        this.data.pop_box.find('.msg_captcha_code').attr('readonly',false);
        this.data.pop_box.find('.regist_captcha_code').attr('readonly', false);
        this.data.pop_box.find('.reset_captcha_code').attr('readonly', false);
        this.data.pop_box.find('.bind_captcha_code').attr('readonly', false);
        this.data.pop_box.find('.bind_other_captcha_code').attr('readonly', false);
        
        this.data.pop_box.find('.security-code').attr('src', img_code + "?x=" + Math.random());
    },
    // 性别选择
    checkSexFun: function (ind,obj) {
        $(obj).addClass('active').siblings().removeClass('active');
        this.data.sex_is_check = ind;
    },
    // 性别保存
    saveSexFun: function () {
        var _this = this;
        if (_this.data.sex.sex == "0") {
            layer.msg("请选择性别", {time: 800});
            return;
        }
        var url = '/user/usercenter/set_sex';
        var nickname = $.trim(_this.data.sex.DOMinput.value);
        if(nickname === '0'){
            layer.msg("昵称不能是0", {time: 1500});
            return;
        };
        if(!nickname){
            layer.msg("请填写昵称", {time: 800});
            return;
        };
        var data = {
            'sex': _this.data.sex.sex,
            'nickname':nickname,
        };
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "json",
            success: function (res) {
                if (res.code == 1) {
                    //百度注册成功转化埋码
                    window._agl && window._agl.push(['track', ['success', {t: 3}]]);
                    layer.msg('设置成功', {
                        time: 1000
                    }, function () {
                        _this.data.sex.DOM.style.display = 'none';
                        tel_login_v1.bindPopShowFun(13);
                        //进入下一步
                    });
                } else {
                    layer.msg(res.msg, {
                        time: 2000
                    }, function () { });
                }
            }
        });
    },
    
    /**
     *标签内容创建
     *
     * @param {*} arr
     */
    label_fn:function(arr){
        var _this = this;
        var str = '';
        for(var i=0,len=arr.length;i<len;i++){
            str += '<li data="'+arr[i].label_alias+'">'+arr[i].label_name+'</li>';
        };
        _this.data.label.DOM.querySelector("ul").innerHTML = str;
        var arr = _this.data.label.DOM.querySelectorAll("ul li");
        _this.data.label.arr = [];
        for(var i=0,len=arr.length;i<len;i++){
            arr[i].onclick = function(){
                var data = this.getAttribute("data");
                var weizhi = _this.data.label.arr.indexOf(data);
                if(weizhi !== -1){
                    //已选中去掉焦点
                    this.classList.remove("active");
                    //数组中删除
                    _this.data.label.arr.splice(weizhi,1);
                }else{
                    if(_this.data.label.arr.length>4){
                        layer.msg("最多只能选择5个");
                        return;
                    };
                    //添加焦点
                    this.classList.add("active");
                    //添加到数组中
                    _this.data.label.arr.push(data);
                };
                _this.data.label.DOM_this_num.innerHTML = _this.data.label.arr.length;
            };
        };
    },
    /**
     *打开网页聊天室
     *
     */
    open_web_room:function(msg) {
        window.location.href = window.location.href;
        return;
        if(msg) {
            msg+=",";
        }else {
            msg = "";
        }
        layer.msg(msg+'直接进入聊天室？', {
            time: 0, //不自动关闭, 
            btn: ['进入', '取消'],
            shade: [0.8, '#393D49'],
            btnAlign: 'c',
            yes: function (index) {
                window.open("/client/index/web_room", "chatroom");
                window.location.href = window.location.href;
            },
            btn2: function () {
                window.location.href = window.location.href;
            }
        });
    },
};