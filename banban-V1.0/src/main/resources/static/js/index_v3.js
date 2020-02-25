/*
* @Title: 新版首页js
* @Author: yx
* @Date: 2019-09-15 09:25:06
 * @Last Modified by: yx
 * @Last Modified time: 2019-11-27 10:45:53
*/
var galleryTop;  //banner轮播
var timer;  //banner导航匀速滚动定时器
var index_v3_data = {
    data: {// 页面涉及的数据
        banner_index:1, //banner默认索引值
        banner_scroll:[],   //banner滚动数据
        // 语音
        temp_video: "",//临时存储正在播放音频 id字符串  
    },
    watch: function() {// 要监听的数据变化相关

    },
    onload: function() {// 页面加载完成需要执行的js
        var _this = this;
        _this.methods.gift_list_loop();  //礼物列表滚动

        _this.methods.banner_jump_chatroom();
        /**
         * 首页banner
         */
        galleryTop = new Swiper('.middle-swiper .gallery-top', {
            spaceBetween: 0,
            loop: true,
            autoplay: 7000,
            speed: 1500,
            observer: true,
            observeParents: true,
            autoplayDisableOnInteraction: false,
            onAutoplay:function(Swiper){
                var slide_length = document.querySelectorAll('.middle-swiper .swiper-slide').length-2;
                if(Swiper.activeIndex == slide_length+1){
                    var DOM = document.querySelector("#middle-nav");
                    DOM.scrollTo(0,0);
                   
                    document.getElementById('li_nav_1').classList.add('active');
                    document.getElementById('li_nav_'+slide_length).classList.remove('active');
                }else{
                    _this.methods.scroll_dom(Swiper.activeIndex,slide_length);
                    document.getElementById('li_nav_'+Swiper.activeIndex).classList.add('active');
                    document.getElementById('li_nav_'+(Swiper.activeIndex-1)).classList.remove('active');
                };
            }
        });

        /**
         * 点单娱乐
         */
        setTimeout(function() {
            var swiper = new Swiper('.orderSheet .content', {
                slidesPerView: 'auto',
                slidesPerGroup: 5,
                speed: 1500,
                spaceBetween: 0,
                prevButton: '.swiper-button-prev3',
                nextButton: '.swiper-button-next3',
            });
        }, 200); 

        /**
         * 新人推荐区域
         */
        setTimeout(function() {
            var swiper = new Swiper('.entering .content', {
                slidesPerView: 'auto',
                slidesPerGroup: 7,
                speed: 1500,
                spaceBetween: 0,
                prevButton: '.swiper-button-prev2',
                nextButton: '.swiper-button-next2',
            });
        }, 200); 

        // 推荐陪玩 选项卡                                                                         
        $('.commend-box .tab-i').each(function (ind) {
            $(this).on('click', function () {
                $(this).addClass('active').siblings().removeClass('active');
                $('.hot-i').eq(ind).addClass('active').siblings().removeClass('active');
                $('.pw_num').eq(ind).addClass('active').siblings().removeClass('active');
                $('.more_a').eq(ind).addClass('active').siblings().removeClass('active');
            });
        });
    
        // 公告 咨讯
        $('.infor-box .tab-i').each(function (ind) {
            $(this).on('click', function () {
                $(this).addClass('active').siblings().removeClass('active');
                $('.infor-i').eq(ind).addClass('active').siblings().removeClass('active');
                $('.information_a').eq(ind).addClass('a_active').siblings().removeClass('a_active');
            });
        });
       
        // 风采展示 精彩锦集
        $('.wonder-box .text').each(function (ind) {
            $(this).on('click', function () {
                $(this).addClass('active').siblings().removeClass('active');
                $('.wonder-i').eq(ind).addClass('active').siblings().removeClass('active');
                $('.video_a').eq(ind).addClass('a_active').siblings().removeClass('a_active');
            });
        });

        var show_everydom = function(){
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(scrollTop >350){
                document.getElementById('orderSheet').classList.add('main-dom-show');
                $('.recommend').addClass('active');
                // $('.recommend').addClass('main-dom-show');
                if(scrollTop >650){
                    document.getElementById('bottom-wrap').classList.add('main-dom-show');
                    if(scrollTop >990){
                        document.getElementById('entering').classList.add('main-dom-show');
                        if(scrollTop >1270){
                            document.getElementById('hot_activity').classList.add('main-dom-show');
                            if(scrollTop>1610){
                                document.getElementById('rankings_wrapper').classList.add('main-dom-show');
                                if(rank_v3_data.data.rank_load_state){return;};
                                rank_v3_data.data.rank_load_state = true;
                                rank_v3_data.methods.ranking_all_list();
                            };
                        };
                    };
                };
            };
            if(scrollTop < 400){
                $('.recommend').removeClass('active');
            };
        };
        window.addEventListener('scroll', function() {
            show_everydom();
        });
        //默认要执行一次
        show_everydom();

    },
    html: {// 页面创建HTML结构相关
        createHtml:function() {
       
        },
    },
    methods: {// 要执行的方法相关
        /*
         *跳转固定聊天室
         */
        go_room:function (id) {
            if(loginstatus != 1){
                tel_login_v1.bindPopShowFun(1);
                return;
            }
            common.jump_chat_room(id);
        },
        /*
         *赠礼单的轮播滚动
         */
        gift_list_loop:function(){
            var DOMbox = document.querySelector(".list_scroll");
            var DOMmove = DOMbox.querySelector(".scroll_dom");
            var list = DOMmove.querySelectorAll(".list");
            var x = 0;
            for(var i=0,len=list.length;i<len;i++){
                x+= list[i].offsetWidth+30;
            };
            var all_width = x;
            var str = DOMmove.innerHTML;
            DOMmove.innerHTML = str+str;
            DOMmove.style.width = (x*2+2)+'px';
            var x = 0;
            var sped = -2;//速度
            var timer;
            var callbank = function(){
                x+=sped;
                if(x<=-all_width+1){
                    x = 0;
                };
                DOMmove.style.left = x+'px';
                timer = requestAnimationFrame(callbank);
            };
            timer = requestAnimationFrame(callbank);
            DOMbox.onmouseenter = function(){
                //关闭定时器
                cancelAnimationFrame(timer);
            };
            DOMbox.onmouseleave = function(){
                //继续定时器
                timer = requestAnimationFrame(callbank);
            };
        },
        //处理banner中有跳转到聊天室的处理方法
        banner_jump_chatroom:function(){
            var arra = document.querySelectorAll(".baner_a");
            for(var i=0,len=arra.length;i<len;i++){
                var url = arra[i].getAttribute("href");
                if(url.indexOf("client/index/web_room") !== -1){
                    arra[i].removeAttribute("href");
                    arra[i].setAttribute("data",url);
                    arra[i].onclick = function(){
                        var data = this.getAttribute("data");
                        //判断登录
                        if(loginstatus != 1){
                            //调用登录窗口
                            window.tel_login_v1.bindPopShowFun(1);
                            return;
                        };
                        window.open(data,"chatroom");
                    };
                };
            };
        },
        /*
         *banner轮播切换
         *@param ind      将要切换到的banner索引值
         */
        banner_nav:function(ind){  
            var _this = this;          
            if(index_v3_data.data.banner_index != ind){
                index_v3_data.data.banner_index = ind;
                galleryTop && galleryTop.slideTo(ind);
                document.getElementById('li_nav_'+ind).classList.add('active');

                var slide_length = document.querySelectorAll('.middle-swiper .swiper-slide').length-2;
                for(var i = 1;i<=slide_length;i++){
                    if(i == ind){
                       
                    }else{
                        document.getElementById('li_nav_'+i).classList.remove('active');
                    };
                };
                _this.scroll_dom(ind,slide_length);
            };
        },
        /*
         *计算banner滚动位置
         *@param ind      将要切换到的banner索引值
         *@param length   banner总长度
         */
        scroll_dom:function(ind,length){
            var _this = this;
            var all_h = $("#middle-nav").height();  //元素的总高度
            var ds =  $("#middle-nav").scrollTop();//滚动条高度
            var dom_t = $("#li_nav_"+ind).offset().top; //元素距离顶部高度
            var dom_h = $("#li_nav_"+ind).height();//元素高度
            var top_h = dom_t-dom_h;  //元素顶部到文档窗口顶部的高度
            var bottom_h = 380 - dom_t;  //元素底部到文档窗口底部的高度
            var DOM = document.querySelector("#middle-nav");
            //向上滑动
            if(top_h <97){
                if(top_h < 0){
                    _this.banner_scroll_fun(ds,ds-100+top_h,1,length,ind);
                    _this.GoSpeed();
                }else{
                    _this.banner_scroll_fun(ds,ds-(100-top_h),1,length,ind);
                    _this.GoSpeed();
                };
            };
            //向下滑动
            if(bottom_h <97){
                if(bottom_h < 0){
                    _this.banner_scroll_fun(ds,ds+97+(87+bottom_h),2,length,ind);
                    _this.GoSpeed();
                }else{
                    _this.banner_scroll_fun(ds,ds+90+bottom_h,2,length,ind);
                    _this.GoSpeed();
                };
            };
        },
        /*
         *banner匀速滚动参数值
         *@param now      此时滚动条高度
         *@param spee     滚动条将要达到的高度
         *@param status   1：向上滑动  2：向下滑动
         *@param length   banner总长度
         *@param ind      将要切换到的banner索引值
         */
        banner_scroll_fun:function(now,spee,status,length,ind){
            index_v3_data.data.banner_scroll.now = now;
            index_v3_data.data.banner_scroll.spee = spee;
            index_v3_data.data.banner_scroll.status = status;
            index_v3_data.data.banner_scroll.length = length;
            index_v3_data.data.banner_scroll.ind = ind;
        },
        /*
         *banner匀速滚动定时器
         */
        GoSpeed:function(){
            var _this = this;
            timer=setInterval(function(){
                _this.runToSpeed()
            },1)
        },
        /*
         *banner匀速滚动
         */
        runToSpeed:function(){
            var DOM = document.querySelector("#middle-nav");
            var nowspee = index_v3_data.data.banner_scroll.now;
            var soonspee = index_v3_data.data.banner_scroll.spee;
            var length = index_v3_data.data.banner_scroll.length;
            var ind = index_v3_data.data.banner_scroll.ind;
            
            if(index_v3_data.data.banner_scroll.status == 1){
                //向上滑动
                nowspee = nowspee--;
                index_v3_data.data.banner_scroll.now--;
                console.log()
                if(nowspee < soonspee || nowspee < 0){
                    clearInterval(timer);
                    index_v3_data.data.banner_scroll = [];
                }else{
                    DOM.scrollTo(0,nowspee);
                };
            }else{
                //向下滑动
                nowspee = nowspee++;
                index_v3_data.data.banner_scroll.now++;
                if(nowspee > soonspee || length == ind){
                    DOM.scrollTo(0,soonspee);
                    clearInterval(timer);
                    index_v3_data.data.banner_scroll = [];
                }else{
                    DOM.scrollTo(0,nowspee);
                };
            };
        },
        /**
         *判断音频是否可以播放
         *
         * @param {*} path
         * @param {*} callback
         */
        canPlayAudioMP3:function(path,callback){
            try {
                var audio = new Audio();
                //Shortcut which doesn't work in Chrome (always returns ""); pass through
                //If this event fires, then MP3s can be played
                audio.addEventListener('canplaythrough', function (e) {
                    callback(true);
                }, false);

                //If this is fired, then client can't play MP3s
                audio.addEventListener('error', function (e) {
                    callback(false, this.error)
                }, false);
                //Smallest base64-encoded MP3 I could come up with (<0.000001 seconds long)
                audio.src = path;
                // audio.load();
            }
            catch (e) {
                callback(false, e);
            }
        },
         /**
         *音频播放
         *
         * @param {*} name 分类 
         * @param {*} ind 索引
         */
        playVideo: function (video_str, name, ind,video_path) {
            var _this = this;
            var id = name + ind;
            // 判断文件是否存在
            _this.canPlayAudioMP3(video_path,function(is_load){
                if(is_load) {
                    // 判断是否存在标签
                    var audio = document.getElementById(id);
                    if (!audio) {
                        audio = document.createElement('audio') //生成一个audio元素 
                        audio.style.display = "none";
                        audio.setAttribute("id", id);
                        audio.controls = false //这样控件才能显示出来 
                        audio.src = video_path //音乐的路径 
                        document.body.appendChild(audio) //把它添加到页面中
                    }
                    
                    // var audio = document.getElementById(id);  //必须用原生js获取id，jquery无效
                    if (audio !== null && audio.error == null) {
                        // 判断页面是否播放过
                        if (!index_v3_data.data.temp_video) {
                            index_v3_data.data.temp_video = id;
                        }
                        // 页面播放过，并且不是点击同一个音频
                        if (index_v3_data.data.temp_video && (index_v3_data.data.temp_video != id)) {
                            var temp_audio = document.getElementById(index_v3_data.data.temp_video);
                            // 检测上一个播放是否完成
                            if (temp_audio !== null) {
                                //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
                                if (!temp_audio.paused) {
                                    temp_audio.pause();// 这个就是暂停
                                    document.getElementById(index_v3_data.data.temp_video + '_bg').classList.remove('active');
                                    temp_audio.currentTime = 0;
                                    temp_audio.remove();
                                }
                            }
                            index_v3_data.data.temp_video = id;
                        }
                        //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
                        if (audio.paused) {
                            audio.play();//audio.play();// 这个就是播放 
                            document.getElementById(name + ind + '_bg').classList.add('active');
                            _this[video_str] = ind;

                        } else {
                            audio.pause();// 这个就是暂停
                            document.getElementById(name + ind + '_bg').classList.remove('active');
                            _this[video_str] = -1;
                            audio.remove();
                        }
                        // 监听是否播放完成
                        audio.addEventListener('ended', function () {
                            document.getElementById(name + ind + '_bg').classList.remove('active');
                            _this[video_str] = -1;
                            audio.remove();
                        }, false);
                    }
                }
            })
        },
        /**
         *获取音频时间
         *
         * @param {*} name
         * @param {*} ind
         */
        getVideoTime: function (name,type,ind){
            var _this = this;
            var id = name + type + ind;
            var text_id = id+'_text';
            //播放器控制
            var audio = document.getElementById(id);
            //获取时长
            // duration 获取音频的时长，单位为s
            if (audio !== null && audio.error == null) {
                var arr = {};
                arr.el = audio;
                //arr.el.volume = 0.5;
                arr.t = null;
                arr.getTime = function () {
                    arr.t = setInterval(function () {
                        if (!isNaN(parseInt(arr.el.duration))) {
                            clearInterval(arr.t);
                            arr.t = null;
                            document.getElementById(text_id).innerHTML = parseInt(audio.duration);
                        };
                    }, 500);
                };
                arr.getTime();
            }
            
        },
        /*
         *推荐陪玩关闭
         */
        recommend_close:function(){
            $('.recommend').removeClass('active');
        },
        /*
         *推荐陪玩关闭
         */
        activity_end: function () {
            layer.msg('活动已结束！');
        },
    }
};