$(function () {

    //更改音乐列表滚动条的样式
    $(".music").mCustomScrollbar();

    var libray;
    //获取文件中的歌曲列表
    (function get_music() {
        var item_number = 0;
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success:function (data) {
                libray=data;
                console.log(libray);
                $.each(data, function (index, ele) {
                    item_number++;
                    $("#mCSB_1_container").append($(" <li >\n" +
                        "                 <span class=\"check_box\">\n" +
                        "                    <div class=\"check\"></div>\n" +
                        "                </span>\n" +
                        "                <span class=\"song\">"+item_number+" &nbsp;&nbsp;&nbsp;"+ele.name+"</span>\n" +
                        "                <span class=\"play\">\n" +
                        "                    <div class=\"play_icon_pause\" id="+ item_number+">\n" +
                        "                        <audio src="+ele.link_url+"></audio>\n" +
                        "                    </div>\n" +
                        "                </span>\n" +
                        "                <span class=\"singer\">"+ele.singer+"</span>\n" +
                        "                <span class=\"total_time\">"+ele.time+"</span>\n" +
                        "            </li>"));
                })
            },
            error:function (e) {
                console.log(e);
            }
        });
    })();


    var now_playing=-1;//记录现在播放的是哪一首歌曲
    //给歌曲列表中的每一个条目添加点击事件
    (function click_music() {

        //为每一个li添加鼠标移入移出事件委托
        $("body").delegate(".content .list .music li","mouseenter",function(){
            $(this.children[1]).animate({left:'50px'},700);
            $(this.children[2].children[0]).show();
        });
        $("body").delegate(".content .list .music li","mouseleave",function(){
            $(this.children[1]).stop(true,true);
            $(this.children[1]).animate({left:'0'});
            $(this.children[2].children[0]).hide();
        });

        //为每一个播放按钮添加点击事件委托
        $("body").delegate(".content .list .music li .play .play_icon_pause","click",function(){

            if(now_playing===parseInt(this.id)){//当前播放与点击一致,暂停播放
                this.children[0].pause();
                now_playing=-1;
                console.log("当前选中的歌曲与正在播放的歌曲一至,nowplaying为："+now_playing);
                $(this).removeClass("play_icon_playing");
                $(this).addClass("play_icon_pause");
                var songname = $(this.parentNode.parentNode).get(0).children[1].innerText;
                $(this.parentNode.parentNode).get(0).children[1].innerHTML = songname ;
            }

            else{//当前播放与点击不一致，开始播放

                //将所有的播放暂停(图标和声音)
                $.each($("audio"), function (index, ele) {
                    //移除gif
                    $($(ele.parentNode.parentNode.parentNode).get(0).children[1].children[0]).remove();
                    //移除正在播放的图标
                    $(ele.parentNode).removeClass("play_icon_playing");
                    //添加暂停的图标
                    $(ele.parentNode).addClass("play_icon_pause");
                    //歌曲暂停播放
                    ele.pause();
                });

                //获取当前条目的歌曲名称
                songname = $(this.parentNode.parentNode).get(0).children[1].innerText;
                now_playing=parseInt(songname);

                var $back_img =  $(".gsback img");
                $back_img.stop(true,true);
                $back_img.fadeOut(2000,function () {
                    $back_img.attr("src",libray[now_playing-1].cover);
                });
                $back_img.fadeIn(3000);
                var $cover_img =  $(".content .cover .img img");
                $cover_img.fadeOut(1000,function () {
                    $cover_img.attr("src",libray[now_playing-1].cover);
                    $cover_img.fadeIn(500);
                });

                var $info_li= $(".content .cover .info li");
                $info_li.get(0).innerText="歌名:"+libray[now_playing-1].name;
                $info_li.get(1).innerText="歌手:"+libray[now_playing-1].singer;
                $info_li.get(2).innerText="专辑:"+libray[now_playing-1].album;

                //给当前条目添加gif
                $(this.parentNode.parentNode).get(0).children[1].innerHTML =
                    "<span class='gif'></span>"+ songname ;
                //切换图标状态
                $(this).toggleClass("play_icon_playing");
                //播放歌曲
                this.children[0].play();
            }

        });
    })();


});