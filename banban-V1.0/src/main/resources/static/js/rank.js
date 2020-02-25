
var font_red = 'font_red',
    font_orange = 'font_orange',
    font_violet = 'font_violet';

var rank_v3_data = {
	data: {// 页面涉及的数据
		rank_load_state:false,  //禁止排行榜数据重复加载
       
        // 总榜
        charm: [], //魅力
        pop: [], //人气
        contribute: [], //富豪榜
        // 总榜前三
        top_charm: [], //魅力
        top_pop: [], //人气
        top_contribute: [], //富豪榜
        // 周榜
        seven_charm: [], //魅力
        seven_pop: [], //人气
        seven_contribute: [], //富豪榜
        // 周榜前三
        top_seven_charm: [], //魅力
        top_seven_pop: [], //人气
        top_seven_contribute: [], //富豪榜

	},
	watch: function() {// 要监听的数据变化相关

	},
	onload: function() {// 页面加载完成需要执行的js
		var show_rank = function(){
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(scrollTop>1400){
                if(rank_v3_data.data.rank_load_state){return;};
                rank_v3_data.data.rank_load_state = true;
                document.getElementById('rankings_wrapper').classList.add('indexpart-show');
                rank_v3_data.methods.ranking_all_list();
                
            };
		};
		window.addEventListener('scroll', function() {
            show_rank();
        });
        //默认要执行一次
        show_rank();
	},
	html: {// 页面创建HTML结构相关
		/*
         *排行榜初始页面创建
         *@param top_seven_charm  魅力榜周榜前三
         *@param seven_charm    魅力榜周榜
         *@param charm  魅力榜总榜
         *@param top_charm    魅力榜总榜前三
         *@param seven_pop  人气榜周榜
         *@param top_seven_pop    人气榜周榜前三
         *@param pop  人气榜总榜
         *@param top_pop    人气榜总榜前三
         *@param seven_contribute  富豪榜周榜
         *@param top_seven_contribute    富豪榜周榜前三
         *@param contribute  富豪榜总榜
         *@param top_contribute    富豪榜总榜前三
         */
        rank_createHtml:function(top_seven_charm,seven_charm,charm,top_charm,seven_pop,top_seven_pop,pop,top_pop,seven_contribute,top_seven_contribute,contribute,top_contribute){
        	var obj = $("<div></div>");
			var str = '';
			str +='<!-- 魅力榜 -->';
			str +='<div class="left rankings_item">';
			str +=    '<!-- 头 -->';
			str +=    '<div class="list_title_wrapper">';
			str +=        '<img src="'+home_img_str+'/index_v3/list_title_1.png" alt="陪玩魅力榜"class="title" width="180">';
			// str +=        '<!-- 波浪 -->';
			// str +=        '<div class="waves_wrapper"></div>';
			str +=    '</div>';
			str +=    '<!-- 选项卡 -->';
			str +=    '<div class="tab_wrapper">';
			str +=        '<div class="tab_content">';
			str +=            '<div class="tab_item on" onmouseenter="rank_v3_data.methods.tabFun1(1)">周榜</div>';
			str +=            '<div class="tab_item" onmouseenter="rank_v3_data.methods.tabFun1(2)">总榜</div>';
			str +=        '</div>';
			str +=    '</div>';
			str +=    '<!-- 列表内容 -->';
			str +=    '<div class="list_wrapper">';
			str +=        '<!-- 周榜 -->';
			str +=        '<div class="list_item on">';
			str +=            '<div class="top">';
			str +=                '<ul class="list_top_wrapper">';
			if(top_seven_charm){
				for(var i = 0;i<top_seven_charm.length;i++){
					if(top_seven_charm[i]){
						var topList = top_seven_charm[i];
						str +=                    '<li class="list_top_item url_point"  onclick="rank_v3_data.methods.detailUrl('+topList.uid+','+topList.pw_status+')">';
						str +=                        '<div class="logo_wrapper">';
						str +=                            '<img src="'+_P_H(topList.avatar,80)+'" alt="" class="logo">';
						str +=                            '<img src="'+rank_v3_data.methods.frameFun(i)+'" alt="" class="logo_frame">';
						str +=                        '</div>';
						str +=                        '<div class="infor_wrapper">';
						if(topList.font_color == 1){
						str +=                        	  '<span class="text font_red">';
						}else if(topList.font_color == 2){
						str +=                        	  '<span class="text font_orange">';
						}else if(topList.font_color == 3){
						str +=                        	  '<span class="text font_violet">';
						}else{
						str +=                        	  '<span class="text">';
						};
						if(topList.s_nickname){
						str +=                        		'<span class="guan_ming">'+topList.s_nickname+'<img title="'+topList.s_name+'" src="'+topList.path+'"></span>';
						};
						
						str +=                        		rank_v3_data.methods.returnstr(topList)
						str +=                        	  '</span>';
						str +=                            '<div class="icon_wrapper">';
						if(rank_v3_data.methods.jewelImgFun(topList.noble_id)){
						str +=                                '<img  src="'+rank_v3_data.methods.jewelImgFun(topList.noble_id)+'" alt="" class="icon_title">';
						};
						if(rank_v3_data.methods.levelImgFun(topList.level)){
						str +=                                '<img  src="'+rank_v3_data.methods.levelImgFun(topList.level)+'" alt="" class="icon_level">';
						};
						if(topList.vip_uid){
						str +=                                '<!-- 靓号 -->';
						str +=                                '<span class="num_wrapper">';
						str +=                                    '<span class="text">'+topList.vip_uid+'</span>';
						str +=                                '</span>';
						};
						str +=                            '</div>';
						str +=                        '</div>';
						str +=                        '<div class="hot_wrapper">';
						str +=                            '<span class="hot_text">'+topList.value+'</span><br><br>魅力';
						str +=                        '</div>';
						str +=                    '</li>';
					}
				}
			};
			str +=                '</ul>';
			str +=            '</div>';
			str +=            '<div class="bottom">';
			str +=                '<ul class="list_bottom_wrapper">';	
			if(seven_charm){
				for(var i = 0;i<seven_charm.length;i++){
					if(seven_charm[i]){
						var allList = seven_charm[i];
						str +=                    '<li class="list_bottom_item url_point"  onclick="rank_v3_data.methods.detailUrl('+allList.uid+','+allList.pw_status+')">';
						str +=                        '<div class="logo_wrapper"><img src="'+_P_H(allList.avatar,60)+'" alt="" class="logo"><span class="num">'+(i+4)+'</span></div>';
						str +=                        '<div class="info_wrapper">';
						if(allList.font_color == 1){
						str +=                        	  '<span class="nick_name font_red">';
						}else if(allList.font_color == 2){
						str +=                        	  '<span class="nick_name font_orange">';
						}else if(allList.font_color == 3){
						str +=                        	  '<span class="nick_name font_violet">';
						}else{
						str +=                        	  '<span class="nick_name">';
						};
						if(allList.s_nickname){
						str +=                        		'<span class="guan_ming">'+allList.s_nickname+'<img title="'+allList.s_name+'" src="'+allList.path+'"></span>';
						};
						
						str +=                        		rank_v3_data.methods.returnstr(allList)
						str +=                        	  '</span>';


						str +=                            '<div class="icon_wrapper">';
						if(rank_v3_data.methods.jewelImgFun(allList.noble_id)){
						str +=                                '<img  src="'+rank_v3_data.methods.jewelImgFun(allList.noble_id)+'" alt="" class="icon_title">';
						};
						if(rank_v3_data.methods.levelImgFun(allList.level)){
						str +=                                '<img  src="'+rank_v3_data.methods.levelImgFun(allList.level)+'" alt="" class="icon_level">';
						};
						if(allList.vip_uid){
						str +=                                '<!-- 靓号 -->';
						str +=                                '<div class="pretty_num_wrapper">';
						str +=                                    '<span class="text">'+allList.vip_uid+'</span>';
						str +=                                '</div>';
						};
						str +=                            '</div>';
						str +=                        '</div>';
						str +=                        '<div class="hot_wrapper">';
						str +=                            '<!-- 热度值 -->';
						str +=                            '<span class="hot_text">'+allList.value+'</span>魅力';
						str +=                        '</div>';
						str +=                    '</li>';
					}
				}	
			};
			str +=                '</ul>';
			str +=            '</div>';
			str +=        '</div>';
			str +=        '<!-- 总榜 -->';
			str +=        '<div class="list_item">';
			str +=            '<div class="top">';
			str +=                '<ul class="list_top_wrapper">';
			if(top_charm){
				for(var i = 0;i<top_charm.length;i++){
					if(top_charm[i]){
						var topList = top_charm[i];
						str +=                    '<li class="list_top_item url_point"  onclick="rank_v3_data.methods.detailUrl('+topList.uid+','+topList.pw_status+')">';
						str +=                        '<div class="logo_wrapper">';
						str +=                            '<img src="'+_P_H(topList.avatar,80)+'" alt="" class="logo">';
						str +=                            '<img src="'+rank_v3_data.methods.frameFun(i)+'" alt="" class="logo_frame">';
						str +=                        '</div>';
						str +=                        '<div class="infor_wrapper">';
						if(topList.font_color == 1){
						str +=                        	  '<span class="text font_red">';
						}else if(topList.font_color == 2){
						str +=                        	  '<span class="text font_orange">';
						}else if(topList.font_color == 3){
						str +=                        	  '<span class="text font_violet">';
						}else{
						str +=                        	  '<span class="text">';
						};
						if(topList.s_nickname){
						str +=                        		'<span class="guan_ming">'+topList.s_nickname+'<img title="'+topList.s_name+'" src="'+topList.path+'"></span>';
						};
						
						str +=                        		rank_v3_data.methods.returnstr(topList)
						str +=                        	  '</span>';
						str +=                            '<div class="icon_wrapper">';
						if(rank_v3_data.methods.jewelImgFun(topList.noble_id)){
						str +=                                '<img  src="'+rank_v3_data.methods.jewelImgFun(topList.noble_id)+'" alt="" class="icon_title">';
						};
						if(rank_v3_data.methods.levelImgFun(topList.level)){
						str +=                                '<img  src="'+rank_v3_data.methods.levelImgFun(topList.level)+'" alt="" class="icon_level">';
						};
						if(topList.vip_uid){
						str +=                                '<!-- 靓号 -->';
						str +=                                '<span class="num_wrapper">';
						str +=                                    '<span class="text">'+topList.vip_uid+'</span>';
						str +=                                '</span>';
						};
						str +=                            '</div>';
						str +=                        '</div>';
						str +=                        '<div class="hot_wrapper">';
						str +=                            '<span class="hot_text">'+topList.value+'</span><br><br>魅力';
						str +=                        '</div>';
						str +=                    '</li>';
					}
				}
			};
			str +=                '</ul>';
			str +=            '</div>';
			str +=            '<div class="bottom">';
			str +=                '<ul class="list_bottom_wrapper">';	
			if(charm){
				for(var i = 0;i<charm.length;i++){
					if(charm[i]){
						var allList = charm[i];
						str +=                    '<li class="list_bottom_item url_point"  onclick="rank_v3_data.methods.detailUrl('+allList.uid+','+allList.pw_status+')">';
						str +=                        '<div class="logo_wrapper"><img src="'+_P_H(allList.avatar,60)+'" alt="" class="logo"><span class="num">'+(i+4)+'</span></div>';
						str +=                        '<div class="info_wrapper">';
						if(allList.font_color == 1){
						str +=                        	  '<span class="nick_name font_red">';
						}else if(allList.font_color == 2){
						str +=                        	  '<span class="nick_name font_orange">';
						}else if(allList.font_color == 3){
						str +=                        	  '<span class="nick_name font_violet">';
						}else{
						str +=                        	  '<span class="nick_name">';
						};
						if(allList.s_nickname){
						str +=                        		'<span class="guan_ming">'+allList.s_nickname+'<img title="'+allList.s_name+'" src="'+allList.path+'"></span>';
						};
						
						str +=                        		rank_v3_data.methods.returnstr(allList)
						str +=                        	  '</span>';


						str +=                            '<div class="icon_wrapper">';
						if(rank_v3_data.methods.jewelImgFun(allList.noble_id)){
						str +=                                '<img  src="'+rank_v3_data.methods.jewelImgFun(allList.noble_id)+'" alt="" class="icon_title">';
						};
						if(rank_v3_data.methods.levelImgFun(allList.level)){
						str +=                                '<img  src="'+rank_v3_data.methods.levelImgFun(allList.level)+'" alt="" class="icon_level">';
						};
						if(allList.vip_uid){
						str +=                                '<!-- 靓号 -->';
						str +=                                '<div class="pretty_num_wrapper">';
						str +=                                    '<span class="text">'+allList.vip_uid+'</span>';
						str +=                                '</div>';
						};
						str +=                            '</div>';
						str +=                        '</div>';
						str +=                        '<div class="hot_wrapper">';
						str +=                            '<!-- 热度值 -->';
						str +=                            '<span class="hot_text">'+allList.value+'</span>魅力';
						str +=                        '</div>';
						str +=                    '</li>';
					}
				}	
			};
			str +=                '</ul>';
			str +=            '</div>';
			str +=        '</div>';
			str +=         '';
			str +=    '</div>';
			str +='</div>';
			str +='<!-- 人气榜 -->';
			str +='<div class="middle rankings_item">';
			str +=    '<!-- 头 -->';
			str +=    '<div class="list_title_wrapper">';
			str += '<img src="' + home_img_str +'/index_v3/list_title_2.png" alt="陪玩人气榜"class="title" width="180">';
			// str +=        '<!-- 波浪 -->';
			// str +=        '<div class="waves_wrapper"></div>';
			str +=    '</div>';
			str +=    '<!-- 选项卡 -->';
			str +=    '<div class="tab_wrapper">';
			str +=        '<div class="tab_content">';
			str +=            '<div class="tab_item on" onmouseenter="rank_v3_data.methods.tabFun2(1)">周榜</div>';
			str +=            '<div class="tab_item" onmouseenter="rank_v3_data.methods.tabFun2(2)">总榜</div>';
			str +=        '</div>';
			str +=    '</div>';
			str +=    '<!-- 列表内容 -->';
			str +=    '<div class="list_wrapper">';
			str +=        '<!-- 周榜 -->';
			str +=        '<div class="list_item on">';
			str +=            '<div class="top">';
			str +=                '<ul class="list_top_wrapper">';
			if(top_seven_pop){
				for(var i = 0;i<top_seven_pop.length;i++){
					if(top_seven_pop[i]){
						var topList = top_seven_pop[i];
						str +=                    '<li class="list_top_item url_point"  onclick="rank_v3_data.methods.detailUrl('+topList.uid+','+topList.pw_status+')">';
						str +=                        '<div class="logo_wrapper">';
						str +=                            '<img src="'+_P_H(topList.avatar,80)+'" alt="" class="logo">';
						str +=                            '<img src="'+rank_v3_data.methods.frameFun(i)+'" alt="" class="logo_frame">';
						str +=                        '</div>';
						str +=                        '<div class="infor_wrapper">';
						if(topList.font_color == 1){
						str +=                        	  '<span class="text font_red">';
						}else if(topList.font_color == 2){
						str +=                        	  '<span class="text font_orange">';
						}else if(topList.font_color == 3){
						str +=                        	  '<span class="text font_violet">';
						}else{
						str +=                        	  '<span class="text">';
						};
						if(topList.s_nickname){
						str +=                        		'<span class="guan_ming">'+topList.s_nickname+'<img title="'+topList.s_name+'" src="'+topList.path+'"></span>';
						};
						
						str +=                        		rank_v3_data.methods.returnstr(topList)
						str +=                        	  '</span>';
						str +=                            '<div class="icon_wrapper">';
						if(rank_v3_data.methods.jewelImgFun(topList.noble_id)){
						str +=                                '<img  src="'+rank_v3_data.methods.jewelImgFun(topList.noble_id)+'" alt="" class="icon_title">';
						};
						if(rank_v3_data.methods.levelImgFun(topList.level)){
						str +=                                '<img  src="'+rank_v3_data.methods.levelImgFun(topList.level)+'" alt="" class="icon_level">';
						};
						if(topList.vip_uid){
						str +=                                '<!-- 靓号 -->';
						str +=                                '<span class="num_wrapper">';
						str +=                                    '<span class="text">'+topList.vip_uid+'</span>';
						str +=                                '</span>';
						};
						str +=                            '</div>';
						str +=                        '</div>';
						str +=                        '<div class="hot_wrapper">';
						str +=                            '<span class="hot_text">'+topList.value+'</span><br><br>时长';
						str +=                        '</div>';
						str +=                    '</li>';
					}
				}
			};
			str +=                '</ul>';
			str +=            '</div>';
			str +=            '<div class="bottom">';
			str +=                '<ul class="list_bottom_wrapper">';	
			if(seven_pop){
				for(var i = 0;i<seven_pop.length;i++){
					if(seven_pop[i]){
						var allList = seven_pop[i];
						str +=                    '<li class="list_bottom_item url_point"  onclick="rank_v3_data.methods.detailUrl('+allList.uid+','+allList.pw_status+')">';
						str +=                        '<div class="logo_wrapper"><img src="'+_P_H(allList.avatar,60)+'" alt="" class="logo"><span class="num">'+(i+4)+'</span></div>';
						str +=                        '<div class="info_wrapper">';
						if(allList.font_color == 1){
						str +=                        	  '<span class="nick_name font_red">';
						}else if(allList.font_color == 2){
						str +=                        	  '<span class="nick_name font_orange">';
						}else if(allList.font_color == 3){
						str +=                        	  '<span class="nick_name font_violet">';
						}else{
						str +=                        	  '<span class="nick_name">';
						};
						if(allList.s_nickname){
						str +=                        		'<span class="guan_ming">'+allList.s_nickname+'<img title="'+allList.s_name+'" src="'+allList.path+'"></span>';
						};
						
						str +=                        		rank_v3_data.methods.returnstr(allList)
						str +=                        	  '</span>';


						str +=                            '<div class="icon_wrapper">';
						if(rank_v3_data.methods.jewelImgFun(allList.noble_id)){
						str +=                                '<img  src="'+rank_v3_data.methods.jewelImgFun(allList.noble_id)+'" alt="" class="icon_title">';
						};
						if(rank_v3_data.methods.levelImgFun(allList.level)){
						str +=                                '<img  src="'+rank_v3_data.methods.levelImgFun(allList.level)+'" alt="" class="icon_level">';
						};
						if(allList.vip_uid){
						str +=                                '<!-- 靓号 -->';
						str +=                                '<div class="pretty_num_wrapper">';
						str +=                                    '<span class="text">'+allList.vip_uid+'</span>';
						str +=                                '</div>';
						};
						str +=                            '</div>';
						str +=                        '</div>';
						str +=                        '<div class="hot_wrapper">';
						str +=                            '<!-- 热度值 -->';
						str +=                            '<span class="hot_text">'+allList.value+'</span>时长';
						str +=                        '</div>';
						str +=                    '</li>';
					}
				}	
			};
			str +=                '</ul>';
			str +=            '</div>';

			str +=        '</div>';
			str +=        '<!-- 总榜 -->';
			str +=        '<div class="list_item">';
			

			str +=            '<div class="top">';
			str +=                '<ul class="list_top_wrapper">';
			if(top_pop){
				for(var i = 0;i<top_pop.length;i++){
					if(top_pop[i]){
						var topList = top_pop[i];
						str +=                    '<li class="list_top_item url_point"  onclick="rank_v3_data.methods.detailUrl('+topList.uid+','+topList.pw_status+')">';
						str +=                        '<div class="logo_wrapper">';
						str +=                            '<img src="'+_P_H(topList.avatar,80)+'" alt="" class="logo">';
						str +=                            '<img src="'+rank_v3_data.methods.frameFun(i)+'" alt="" class="logo_frame">';
						str +=                        '</div>';
						str +=                        '<div class="infor_wrapper">';
						if(topList.font_color == 1){
						str +=                        	  '<span class="text font_red">';
						}else if(topList.font_color == 2){
						str +=                        	  '<span class="text font_orange">';
						}else if(topList.font_color == 3){
						str +=                        	  '<span class="text font_violet">';
						}else{
						str +=                        	  '<span class="text">';
						};
						if(topList.s_nickname){
						str +=                        		'<span class="guan_ming">'+topList.s_nickname+'<img title="'+topList.s_name+'" src="'+topList.path+'"></span>';
						};
						
						str +=                        		rank_v3_data.methods.returnstr(topList)
						str +=                        	  '</span>';
						str +=                            '<div class="icon_wrapper">';
						if(rank_v3_data.methods.jewelImgFun(topList.noble_id)){
						str +=                                '<img  src="'+rank_v3_data.methods.jewelImgFun(topList.noble_id)+'" alt="" class="icon_title">';
						};
						if(rank_v3_data.methods.levelImgFun(topList.level)){
						str +=                                '<img  src="'+rank_v3_data.methods.levelImgFun(topList.level)+'" alt="" class="icon_level">';
						};
						if(topList.vip_uid){
						str +=                                '<!-- 靓号 -->';
						str +=                                '<span class="num_wrapper">';
						str +=                                    '<span class="text">'+topList.vip_uid+'</span>';
						str +=                                '</span>';
						};
						str +=                            '</div>';
						str +=                        '</div>';
						str +=                        '<div class="hot_wrapper">';
						str +=                            '<span class="hot_text">'+topList.value+'</span><br><br>时长';
						str +=                        '</div>';
						str +=                    '</li>';
					}
				}
			};
			str +=                '</ul>';
			str +=            '</div>';
			str +=            '<div class="bottom">';
			str +=                '<ul class="list_bottom_wrapper">';	
			if(pop){
				for(var i = 0;i<pop.length;i++){
					if(pop[i]){
						var allList = pop[i];
						str +=                    '<li class="list_bottom_item url_point"  onclick="rank_v3_data.methods.detailUrl('+allList.uid+','+allList.pw_status+')">';
						str +=                        '<div class="logo_wrapper"><img src="'+_P_H(allList.avatar,60)+'" alt="" class="logo"><span class="num">'+(i+4)+'</span></div>';
						str +=                        '<div class="info_wrapper">';
						if(allList.font_color == 1){
						str +=                        	  '<span class="nick_name font_red">';
						}else if(allList.font_color == 2){
						str +=                        	  '<span class="nick_name font_orange">';
						}else if(allList.font_color == 3){
						str +=                        	  '<span class="nick_name font_violet">';
						}else{
						str +=                        	  '<span class="nick_name">';
						};
						if(allList.s_nickname){
						str +=                        		'<span class="guan_ming">'+allList.s_nickname+'<img title="'+allList.s_name+'" src="'+allList.path+'"></span>';
						};
						
						str +=                        		rank_v3_data.methods.returnstr(allList)
						str +=                        	  '</span>';


						str +=                            '<div class="icon_wrapper">';
						if(rank_v3_data.methods.jewelImgFun(allList.noble_id)){
						str +=                                '<img  src="'+rank_v3_data.methods.jewelImgFun(allList.noble_id)+'" alt="" class="icon_title">';
						};
						if(rank_v3_data.methods.levelImgFun(allList.level)){
						str +=                                '<img  src="'+rank_v3_data.methods.levelImgFun(allList.level)+'" alt="" class="icon_level">';
						};
						if(allList.vip_uid){
						str +=                                '<!-- 靓号 -->';
						str +=                                '<div class="pretty_num_wrapper">';
						str +=                                    '<span class="text">'+allList.vip_uid+'</span>';
						str +=                                '</div>';
						};
						str +=                            '</div>';
						str +=                        '</div>';
						str +=                        '<div class="hot_wrapper">';
						str +=                            '<!-- 热度值 -->';
						str +=                            '<span class="hot_text">'+allList.value+'</span>时长';
						str +=                        '</div>';
						str +=                    '</li>';
					}
				}	
			};
			
			str +=                '</ul>';
			str +=            '</div>';


			str +=        '</div>';
			str +=         '';
			str +=    '</div>';
			str +='</div>';
			str +='<!-- 富豪榜 -->';
			str +='<div class="right rankings_item">';
			str +=    '<!-- 头 -->';
			str +=    '<div class="list_title_wrapper">';
			str += '<img src="' + home_img_str +'/index_v3/list_title_3.png" alt="陪玩富豪榜"class="title" width="180">';
			// str +=        '<!-- 波浪 -->';
			// str +=        '<div class="waves_wrapper"></div>';
			str +=    '</div>';
			str +=    '<!-- 选项卡 -->';
			str +=    '<div class="tab_wrapper">';
			str +=        '<div class="tab_content">';
			str +=            '<div class="tab_item on" onmouseenter="rank_v3_data.methods.tabFun3(1)">周榜</div>';
			str +=            '<div class="tab_item" onmouseenter="rank_v3_data.methods.tabFun3(2)">总榜</div>';
			str +=        '</div>';
			str +=    '</div>';
			str +=    '<!-- 列表内容 -->';
			str +=    '<div class="list_wrapper">';
			str +=        '<!-- 周榜 -->';
			str +=        '<div class="list_item on">';
			str +=            '<div class="top">';
			str +=                '<ul class="list_top_wrapper">';
			if(top_seven_contribute){
				for(var i = 0;i<top_seven_contribute.length;i++){
					if(top_seven_contribute[i]){
						var topList = top_seven_contribute[i];
						str +=                    '<li class="list_top_item url_point"  >';
						str +=                        '<div class="logo_wrapper">';
						str +=                            '<img src="'+_P_H(topList.avatar,80)+'" alt="" class="logo">';
						str +=                            '<img src="'+rank_v3_data.methods.frameFun(i)+'" alt="" class="logo_frame">';
						str +=                        '</div>';
						str +=                        '<div class="infor_wrapper">';
						if(topList.font_color == 1){
						str +=                        	  '<span class="text font_red">';
						}else if(topList.font_color == 2){
						str +=                        	  '<span class="text font_orange">';
						}else if(topList.font_color == 3){
						str +=                        	  '<span class="text font_violet">';
						}else{
						str +=                        	  '<span class="text">';
						};
						if(topList.s_nickname){
						str +=                        		'<span class="guan_ming">'+topList.s_nickname+'<img title="'+topList.s_name+'" src="'+topList.path+'"></span>';
						};
						
						str +=                        		rank_v3_data.methods.returnstr(topList)
						str +=                        	  '</span>';
						str +=                            '<div class="icon_wrapper">';
						if(rank_v3_data.methods.jewelImgFun(topList.noble_id)){
						str +=                                '<img  src="'+rank_v3_data.methods.jewelImgFun(topList.noble_id)+'" alt="" class="icon_title">';
						};
						if(rank_v3_data.methods.levelImgFun(topList.level)){
						str +=                                '<img  src="'+rank_v3_data.methods.levelImgFun(topList.level)+'" alt="" class="icon_level">';
						};
						if(topList.vip_uid){
						str +=                                '<!-- 靓号 -->';
						str +=                                '<span class="num_wrapper">';
						str +=                                    '<span class="text">'+topList.vip_uid+'</span>';
						str +=                                '</span>';
						};
						str +=                            '</div>';
						str +=                        '</div>';
						str +=                        '<div class="hot_wrapper">';
						str +=                            '<span class="hot_text">'+topList.value+'</span><br><br>贡献';
						str +=                        '</div>';
						str +=                    '</li>';
					}
				}
			};
			str +=                '</ul>';
			str +=            '</div>';
			str +=            '<div class="bottom">';
			str +=                '<ul class="list_bottom_wrapper">';	
			if(seven_contribute){
				for(var i = 0;i<seven_contribute.length;i++){
					if(seven_contribute[i]){
						var allList = seven_contribute[i];
						str +=                    '<li class="list_bottom_item url_point" >';
						str +=                        '<div class="logo_wrapper"><img src="'+_P_H(allList.avatar,60)+'" alt="" class="logo"><span class="num">'+(i+4)+'</span></div>';
						str +=                        '<div class="info_wrapper">';
						if(allList.font_color == 1){
						str +=                        	  '<span class="nick_name font_red">';
						}else if(allList.font_color == 2){
						str +=                        	  '<span class="nick_name font_orange">';
						}else if(allList.font_color == 3){
						str +=                        	  '<span class="nick_name font_violet">';
						}else{
						str +=                        	  '<span class="nick_name">';
						};
						if(allList.s_nickname){
						str +=                        		'<span class="guan_ming">'+allList.s_nickname+'<img title="'+allList.s_name+'" src="'+allList.path+'"></span>';
						};
						
						str +=                        		rank_v3_data.methods.returnstr(allList)
						str +=                        	  '</span>';


						str +=                            '<div class="icon_wrapper">';
						if(rank_v3_data.methods.jewelImgFun(allList.noble_id)){
						str +=                                '<img  src="'+rank_v3_data.methods.jewelImgFun(allList.noble_id)+'" alt="" class="icon_title">';
						};
						if(rank_v3_data.methods.levelImgFun(allList.level)){
						str +=                                '<img  src="'+rank_v3_data.methods.levelImgFun(allList.level)+'" alt="" class="icon_level">';
						};
						if(allList.vip_uid){
						str +=                                '<!-- 靓号 -->';
						str +=                                '<div class="pretty_num_wrapper">';
						str +=                                    '<span class="text">'+allList.vip_uid+'</span>';
						str +=                                '</div>';
						};
						str +=                            '</div>';
						str +=                        '</div>';
						str +=                        '<div class="hot_wrapper">';
						str +=                            '<!-- 热度值 -->';
						str +=                            '<span class="hot_text">'+allList.value+'</span>贡献';
						str +=                        '</div>';
						str +=                    '</li>';
					}
				}	
			};
			
			str +=                '</ul>';
			str +=            '</div>';
			str +=        '</div>';
			str +=        '<!-- 总榜 -->';
			str +=        '<div class="list_item">';
			str +=            '<div class="top">';
			str +=                '<ul class="list_top_wrapper">';
			if(top_contribute){
				for(var i = 0;i<top_contribute.length;i++){
					if(top_contribute[i]){
						var topList = top_contribute[i];
						str +=                    '<li class="list_top_item url_point" >';
						str +=                        '<div class="logo_wrapper">';
						str +=                            '<img src="'+_P_H(topList.avatar,80)+'" alt="" class="logo">';
						str +=                            '<img src="'+rank_v3_data.methods.frameFun(i)+'" alt="" class="logo_frame">';
						str +=                        '</div>';
						str +=                        '<div class="infor_wrapper">';
						if(topList.font_color == 1){
						str +=                        	  '<span class="text font_red">';
						}else if(topList.font_color == 2){
						str +=                        	  '<span class="text font_orange">';
						}else if(topList.font_color == 3){
						str +=                        	  '<span class="text font_violet">';
						}else{
						str +=                        	  '<span class="text">';
						};
						if(topList.s_nickname){
						str +=                        		'<span class="guan_ming">'+topList.s_nickname+'<img title="'+topList.s_name+'" src="'+topList.path+'"></span>';
						};
						
						str +=                        		rank_v3_data.methods.returnstr(topList)
						str +=                        	  '</span>';
						str +=                            '<div class="icon_wrapper">';
						if(rank_v3_data.methods.jewelImgFun(topList.noble_id)){
						str +=                                '<img  src="'+rank_v3_data.methods.jewelImgFun(topList.noble_id)+'" alt="" class="icon_title">';
						};
						if(rank_v3_data.methods.levelImgFun(topList.level)){
						str +=                                '<img  src="'+rank_v3_data.methods.levelImgFun(topList.level)+'" alt="" class="icon_level">';
						};
						if(topList.vip_uid){
						str +=                                '<!-- 靓号 -->';
						str +=                                '<span class="num_wrapper">';
						str +=                                    '<span class="text">'+topList.vip_uid+'</span>';
						str +=                                '</span>';
						};
						str +=                            '</div>';
						str +=                        '</div>';
						str +=                        '<div class="hot_wrapper">';
						str +=                            '<span class="hot_text">'+topList.value+'</span><br><br>贡献';
						str +=                        '</div>';
						str +=                    '</li>';
					}
				}
			};
			str +=                '</ul>';
			str +=            '</div>';
			str +=            '<div class="bottom">';
			str +=                '<ul class="list_bottom_wrapper">';	
			if(contribute){
				for(var i = 0;i<contribute.length;i++){
					if(contribute[i]){
						var allList = contribute[i];
						str +=                    '<li class="list_bottom_item url_point" >';
						str +=                        '<div class="logo_wrapper"><img src="'+_P_H(allList.avatar,60)+'" alt="" class="logo"><span class="num">'+(i+4)+'</span></div>';
						str +=                        '<div class="info_wrapper">';
						if(allList.font_color == 1){
						str +=                        	  '<span class="nick_name font_red">';
						}else if(allList.font_color == 2){
						str +=                        	  '<span class="nick_name font_orange">';
						}else if(allList.font_color == 3){
						str +=                        	  '<span class="nick_name font_violet">';
						}else{
						str +=                        	  '<span class="nick_name">';
						};
						if(allList.s_nickname){
						str +=                        		'<span class="guan_ming">'+allList.s_nickname+'<img title="'+allList.s_name+'" src="'+allList.path+'"></span>';
						};
						
						str +=                        		rank_v3_data.methods.returnstr(allList)
						str +=                        	  '</span>';


						str +=                            '<div class="icon_wrapper">';
						if(rank_v3_data.methods.jewelImgFun(allList.noble_id)){
						str +=                                '<img  src="'+rank_v3_data.methods.jewelImgFun(allList.noble_id)+'" alt="" class="icon_title">';
						};
						if(rank_v3_data.methods.levelImgFun(allList.level)){
						str +=                                '<img  src="'+rank_v3_data.methods.levelImgFun(allList.level)+'" alt="" class="icon_level">';
						};
						if(allList.vip_uid){
						str +=                                '<!-- 靓号 -->';
						str +=                                '<div class="pretty_num_wrapper">';
						str +=                                    '<span class="text">'+allList.vip_uid+'</span>';
						str +=                                '</div>';
						};
						str +=                            '</div>';
						str +=                        '</div>';
						str +=                        '<div class="hot_wrapper">';
						str +=                            '<!-- 热度值 -->';
						str +=                            '<span class="hot_text">'+allList.value+'</span>贡献';
						str +=                        '</div>';
						str +=                    '</li>';
					}
				}	
			};
			
			str +=                '</ul>';
			str +=            '</div>';
			str +=        '</div>';
			str +=         '';
			str +=    '</div>';
			str +='</div> ';  
			obj.html(str);
			$("#rankings_wrapper").append(obj);
        }
    },
    methods: {// 要执行的方法相关
    	/*
         *魅力、人气、富豪数据排行榜
         */
        ranking_all_list:function(){
            var _this = this;
            var urls = '/index/index/index_bang';
            $.ajax({
                type: "POST",
                url: urls,
                dataType: "json",
                success: function (res) {
                    if(res.code === 1){
                        //魅力榜
                        // 周榜
                        $.each(res.data.charm.seven, function(index, item) {
                            if (index > 2) {
                                rank_v3_data.data.seven_charm.push(item);
                                
                            } else {
                                rank_v3_data.data.top_seven_charm.push(item);
                            };
                        });
                        // 总榜
                        $.each(res.data.charm.all, function(index, item) {

                            if (index > 2) {
                                rank_v3_data.data.charm.push(item);
                            } else {
                                rank_v3_data.data.top_charm.push(item);
                            };
                        });

                        //人气榜
                        // 周榜
                        $.each(res.data.pop.seven, function(index, item) {
                            if (index > 2) {
                                rank_v3_data.data.seven_pop.push(item);
                                
                            } else {
                                rank_v3_data.data.top_seven_pop.push(item);
                            };
                        });
                        // 总榜
                        $.each(res.data.pop.all, function(index, item) {
                            if (index > 2) {
                                rank_v3_data.data.pop.push(item);
                            } else {
                                rank_v3_data.data.top_pop.push(item);
                            };
                        });

                        //富豪榜
                        // 周榜
                        $.each(res.data.contribute.seven, function(index, item) {
                            if (index > 2) {
                                rank_v3_data.data.seven_contribute.push(item);
                                
                            } else {
                                rank_v3_data.data.top_seven_contribute.push(item);
                            };
                        });
                        // 总榜
                        $.each(res.data.contribute.all, function(index, item) {
                            if (index > 2) {
                                rank_v3_data.data.contribute.push(item);
                                
                            } else {
                                rank_v3_data.data.top_contribute.push(item);
                            };
                        });

                        rank_v3_data.html.rank_createHtml(rank_v3_data.data.top_seven_charm,rank_v3_data.data.seven_charm,rank_v3_data.data.charm,rank_v3_data.data.top_charm,rank_v3_data.data.seven_pop,rank_v3_data.data.top_seven_pop,rank_v3_data.data.pop,rank_v3_data.data.top_pop,rank_v3_data.data.seven_contribute,rank_v3_data.data.top_seven_contribute,rank_v3_data.data.contribute,rank_v3_data.data.top_contribute);
                    };
                }
            });
        },
        // 排名框
        frameFun: function(ind) {
            var imgUrl =  public_domain +"/static/home/img/index_v2/ico_num_";
            var imgind = ind + 1;
            return imgUrl + imgind + ".png";
        },
        //等级图片
        levelImgFun: function(level) {
            if(level!=undefined){
                return common.levelImgFun(level);
            };
        },
        //爵位图片
        jewelImgFun: function(noble) {
            if(noble!=undefined){
                if(!common.jewelImgFun(noble)){
                    return 0;
                };
                return common.jewelImgFun(noble);
            };
        },
        // 没有昵称转匿名
        returnstr: function(itm) {
            var str = "";
            if (itm.nickname) {
                str = itm.nickname;
            } else {
                var str1 = itm.uid + "";
                str = '匿名用户' + (str1.substring(0, (str1.length - 2))) + "**";
            };
            return str;
        },
        /*
         *排行榜周榜、日榜切换
         */
        tabFun1:function(ind) {
            ind = ind-1;
            $('.left .tab_item').eq(ind).addClass('on').siblings().removeClass('on');
            $('.left .list_item').eq(ind).addClass('on').siblings().removeClass('on');
        },
        tabFun2: function(ind) {
            ind = ind-1;
            $('.middle .tab_item').eq(ind).addClass('on').siblings().removeClass('on');
            $('.middle .list_item').eq(ind).addClass('on').siblings().removeClass('on');
        },
        tabFun3: function(ind) {
            ind = ind-1;
            $('.right .tab_item').eq(ind).addClass('on').siblings().removeClass('on');
            $('.right .list_item').eq(ind).addClass('on').siblings().removeClass('on');
        },
        /*
         *排行榜陪玩详情链接
         *@param uid    陪玩uid
         *@param pw_status    0:老板  1:陪玩
         */
        detailUrl: function(uid,pw_status) {
            if(pw_status == 1){
                var url = "/item/"+uid+".html";
                window.open(url);
            }else{
                return;
            };
        },

    },

}


