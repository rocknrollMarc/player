(function(a,b,c,d){
    c.queryParams=function(b){
        var d=a.location.search.substr(1).split("&"),

        e={},f,g,h;

        for(var i=0,j=d.length;i<j;i++){
            f=d[i].split("=");
            g=decodeURI(f[0]);
            h=decodeURI(f[1]);

            switch(h.toLowerCase()){
            case"true":
                h=true;
                break;

                case"false":
                h=false;
                break;

                case"":
                case"null":
                h=null;
                break;
            default:
                    f=parseFloat(h);
            if(!isNaN(f))h=f}e[g]=h
        }
    if(b){
        c.extend(b,e)
    }else{
        b=e}

    return b
};

c.widget("ui.gestalt",c.ui.mouse,{
    version:"1.0.0",
    options:{
        url:null,
        size:"small",
        controls:false,
        largeUrl:null,
        images:null,
        wait:60,
        keyboard:true,
        animate:false,
        framerate:5,
        mouse:10,
        margin:false
    },

    margin:function(){
        o=this.options;

        if(o.margin==true){
            $(".ui-gs-controls").css("margin","0 auto 0")
        }
        if(o.margin==false){
            $(".ui-gs-controls").css("margin","-36px auto 0")
        }
    },

changeZoomImage:function(){
    $(".zoom-box img").attr("src",this.active_image().replace("small","large"))
},

_create:function(){
    var b=this,
    d=this.options,
    e=this.element[0];

    if(this.options.controls=="zoom"){
        this.element.append('<div id="delete"><img src="css/images/kreuz.png" id="del"> </div>
                            <div class="zoom-box"><img class="zoom" src=""></div>'+
                                '<div id="springer"></div>'
                           )
    }
    this.element.addClass("ui-gs ui-widget ui-widget-content ui-helper-clearfix").attr("role","gestalt").append('<div id="quick" class="ui-gs-images">'+
                                                                                                                '    <div class="ui-gs-progressbar" style="display:none;"></div>'+
                                                                                                                "</div>");
    if(d.controls){
        this._appendControls();
        this.margin()
    }

    this._mouseInit();
    this.images=c(".ui-gs-images",e);
    this.progressbar=c(".ui-gs-progressbar",e).progressbar({value:0});
    this.loaded=false;
    this.running=false;
    this.imageList=[];
    this.imageListZoom=[];
    this.direction="forward";
    this.once=d.animate==="once";
    this.retry={list:[],count:0,id:0};
    this._setOption("framerate",d.framerate);

    if(d.url){var f=d.url+"/"+d.size+"/Filelist.txt";
        c.get(f,function(a,c,d){
            b._setOption("images",a.replace(/['"]/g,"").split(","))},"text")
    }else if(d.images){
        this._setOption("images",d.images)
    }

    d.loaded=function(){
            b.loaded=true;b.progressbar.progressbar("destroy").remove();

            if(d.keyboard){b._keyboardBindings()
        }
        if(d.animate){b.start()}};d.added=function(a,c){
            var d=100*b._imageLoadCount/b.imageList.length;b.progressbar.progressbar("option","value",d)};

            if(a.Touch){
                var g=this.images[0];
                g.addEventListener("touchstart",function(a){
                    a.preventDefault();
                    b._mouseStart(a.touches[0])
                },false);

                g.addEventListener("touchmove",function(a){
                    a.preventDefault();
                    b._mouseDrag(a.touches[0])},false)
            }
},

destroy:function(){
    this._mouseDestroy();
    if(this.options.keyboard){
        c(b).unbind(c.browser.mozilla?"keypress":"keydown",this._keydown)
    }
    this.element.removeClass("ui-gs ui-gs-hide-controls ui-widget ui-widget-content ui-helper-clearfix").removeAttr("role","gestalt").removeData("gestalt").empty();
    c.Widget.prototype.destroy.call(this)
},

_setOption:function(a,b){
    c.Widget.prototype._setOption.apply(this,arguments);

    switch(a){
        case"images":
            if(b&&b.length>0){this.stop()._load()
        }break;
        case"framerate":
            if(b<1){b=1}
        if(b>22){b=22}this.options[a]=b;
        var d=1e3/b;if(d!==this.delay){this.delay=d;
            if(this.running){
                this._stop();
                this._start()
            }
        }
        break
    }
},

            _load:function(){
                var a=this,
                b=null;
                clearInterval(this.retry.id);
                this.retry.list.length=0;
                this.retry.count=0;
                this.images.find("img").remove();
                this.imageList.length=0;
                this._imageLoadCount=0;
                c.each(this.options.images,function(d,e){
                    b=c("<img />");
                    a.imageList.push(b);
                    a.images.append(b);
                    a._addImage(d,e)});
                    this.retry.id=setInterval(function(){
                        a._retryLoad()},1e3);
                        return this
            }

            ,_addImage:function(a,b){
        if(c.browser.msie||this.retry.count){b+="?_="+(new Date).getTime()
        }
        var d=this,
        e=this.imageList[a],
        f=c("<img />").attr("src",b).load(function(){
            d._imageLoaded(a)}).error(function(){
                d.retry.list.push(a)});
                this.imageList[a]=f;
                e.removeAttr("src").replaceWith(f);
                return this
            },

            _imageLoaded:function(a){
                this._imageLoadCount++;
                if(this._imageLoadCount===1){this._setImageSize(this.imageList[a]);
                    this.progressbar.show();
                    var b=2*parseInt(this.progressbar.css("left")||10);
                    this.progressbar.css({width:this.images.width()-b});
                    this._activate(0)
                }
                this._trigger("added",d,{count:
                              this._imageLoadCount});
                if(this._imageLoadCount==this.imageList.length){
                    this._trigger("loaded")
                }return this
            },

            _retryLoad:function(){
                if(this._imageLoadCount===this.imageList.length||this.retry.count>=this.options.wait){
                    clearInterval(this.retry.id);
                    this.retry.id=0;return this
                }

                var a=this,
                b=this.options.images,
                d=null;

                this.retry.count++;
                c.each(this.retry.list,function(c,d){
                    a._addImage(d,b[d])});
                    this.retry.list.length=0;
                    return this
            },


        _activate:function(a){
                this.images.find("img").hide();
                this.imageList[a].show();
                this._active=a;return this
        } ,
    next:function(a){
    var b=this.stop(a)._next();
    this._activate(b);
    this._trigger("next",a,{index:b
    });

    return this
    },

    prev:function(a){
        var b=this.stop(a)._prev();
        this._activate(b);
        this._trigger("prev",a,{index:b});
        return this
    },

    _next:function(){
        var a=this._active,b=this.imageList.length;
        a++;

        if(a>=b){a=0}i=1;
        return a
    },

    _prev:function(){
        var a=this._active,b=this.imageList.length;
        a--;if(a<0){
            a=b-1
        }
        return a
    },

    start:function(a){
        if(this._start()){
            this._trigger("start",a)
        }return this
    },

    stop:function(a){
        if(this._stop()){
            this._trigger("stop",a)
        }return this
    },

    _start:function(){
        if(!this.running){
            var a=this,b=null;
            switch(this.direction){
                case"forward":
                    b=function(){
                    var b=a._next();
                    if(a.once&&b<a._active){
                        a.once=false;
                        a.stop()}a._activate(b)
                };
                break;
                case"reverse":
                    b=function(){
                    var b=a._prev();
                    if(a.once&&b===0){
                        a.once=false;a.stop()
                    }
                    a._activate(b)
                };
                break
            }
            this.running=setInterval(b,this.delay);
            return true
        }return false
    },

    active_image:function(){
        active=this.imageList[this._active].attr("src");
        return active},

        _stop:function(){
            if(this.running){
                clearInterval(this.running);
                this.running=0;
                this.once=false;
                return true
            }return false
        },

        startStop:function(a){
            if(!this.loaded)return this;
            this.running?this.stop(a)
                :this.start(a);
            return this
        },

        _direction:function(a){
            this.direction=a;
            if(this.running)
                {this._stop();
                    this._start()
                }
                return this
        },

        _setImageSize:function(b){
            var d=this.element.outerWidth(true)-this.images.width(),
            e=this.element.outerHeight(true)-this.images.height(),

            f,g,h,i;d=a.innerWidth-d;
            e=a.innerHeight-e;f=d/b.width();
            g=e/b.height();

            h=f<g?f:g;i=h<1?{
                width:b.width()*h,height:b.height()*h}:
                    {width:b.width(), height:b.height()};
                this.images.css(i);

                c("img",this.images[0]).css(i);
                this.element.css("min-width",this.images.outerWidth(true))
        },

        _keyboardBindings:function(){var a=this;
            this._keydown=function(b){
                if(b.altKey||b.ctrlKey||b.metaKey){return}
                var d=b.keyCode?b.keyCode:b.which;

                switch(d){
                    case c.ui.keyCode.SPACE:
                        a.startStop(b);
                    return false;

                    case c.ui.keyCode.LEFT:
                        a.next(b);
                    if(a.options.controls==="zoom"){a.changeZoomImage()
                    }return false;

                    case c.ui.keyCode.RIGHT:
                        a.prev(b);
                    if(a.options.controls==="zoom"){a.changeZoomImage()}return false;

                    case c.ui.keyCode.UP:
                        a._setOption("framerate",a.options.framerate+1);
                    return false;

                    case c.ui.keyCode.DOWN:
                        a._setOption("framerate",a.options.framerate-1);return false}};

                    c(b).bind(c.browser.mozilla?"keypress":"keydown",this._keydown)
        },

        _mouseStart:function(a){
                if(!(this.options.mouse&&this.loaded)){return}
                this.xStart=a.pageX},

        _mouseDrag:function(a){
            if(!(this.options.mouse&&this.loaded)){return}
            if($("#springer").css("display")=="block"||$(".zoom-box").css("display")=="block"){return false}
            var b=(a.pageX-this.xStart)/this.options.mouse,
            c=b<0;
            b=Math.abs(b);
            if(b<1){return}

            if(c){for(;b>0;b--)this.next(a)
            }else{
                for(;b>0;b--)this.prev(a)}

                this.xStart=a.pageX},

        _appendControls:function(){
            var b=this,
            d=this.element[0];
            this.element.append(c('<div class="ui-gs-controls"></div>')
                                .append('<button title="prev" class="zoomClass">Prev</button>')
                                .append('<button title="play">Play/Pause</button>')
                                .append('<button title="next" class="zoomClass">Next</button>')
                               );

        c(".ui-gs-controls button:first",d)
        .button({
            text:false,
            icons:{primary:"ui-icon-seek-prev"}
        })
        .addClass("ui-state-disabled").click(function(a){
            b.next(a);if(b.options.controls==="zoom"){b.changeZoomImage()}return false})
            .next().button({
                text:false,
                icons:{primary:"ui-icon-play"}
            })
            .addClass("ui-state-disabled").click(function(a){
                b.startStop(a);
                return false})
                .next().button({
                    text:false,icons:{primary:"ui-icon-seek-next"}
                })
                .addClass("ui-state-disabled").click(function(a){
                    b.prev(a);
                    if(b.options.controls==="zoom"){
                        b.changeZoomImage()}return false});


        if(this.options.controls==="einzelbild"){
            var e=this.options.url+"/large.html";
            if(this.options.largeUrl){
                e=a.location.href.split("?")[0]+"?url="+encodeURI(this.options.url)+"&"+decodeURIComponent(this.options.largeUrl)
            }
            c(".ui-gs-controls",d).append(
                c('<button title=" "  class="ui-gs-resize">Resize</button>').button
                ({
                    text:false,
                    icons:{primary:"ui-icon-arrow-4-diag"}})
                    .addClass("ui-state-disabled")
                    .click(function(a){b.stop();
                           return false})

                    .addClass("box").mouseover(function(){
                        $(".box").fancybox({})})

                        .click(function(a){
                            $(".box").fancybox({overlayColor:"#777777",
                                               overlayOpacity:.9,
                                               href:b.active_image()
                            })
                        }
                              )
            )}

            if(this.options.controls==="zoom"){
                c(".ui-gs-controls",d).append(
                    c('<button title="zoom"  class="ui-gs-resize zoomClass">Resize</button>')
                    .button({
                        text:false,
                        icons:{primary:"ui-icon-arrow-4-diag"}
                    }).addClass("ui-state-disabled").click(function(a)
                    {b.stop();
                        $(".zoom").attr({src:""});
                        b.changeZoomImage();
                        return false
                    })
                );

                var f={
                    position:"relative",
                    "z-index":"1100"};
                    $(".ui-gs-controls button").css(f)
            }
            if(this.options.controls==="box"){
                var e=this.options.url+"/large.html";
                if(this.options.largeUrl){
                    e=a.location.href.split("?")[0]+
                        "?url="+encodeURI(this.options.url)+
                        "&"+decodeURIComponent(this.options.largeUrl)
                }

                c(".ui-gs-controls",d).append(
                    c('<button title=" " class="ui-gs-resize">Resize</button>')
                    .button({
                        text:false,
                        icons:{primary:"ui-icon-arrow-4-diag"}})
                        .addClass("ui-state-disabled").click(function(a){
                            b.stop();return false

                        }).addClass("box")
                        .mouseover(function(){
                            $(".box").fancybox({
                                width:"90%",
                                height:"100%",
                                fullScale:false,
                                transitionIn:"none",
                                transitionOut:"none",
                                type:"iframe",
                                href:e
                            })
                        })
                )}

if(this.options.controls==="resizeable"){
    var e=this.options.url+"/large.html";

    if(this.options.largeUrl){
        e=a.location.href.split("?")[0]+
            "?url="+encodeURI(this.options.url)+
            "&"+decodeURIComponent(this.options.largeUrl)
    }

    c(".ui-gs-controls",d).append(
        c('<button title="extern" class="ui-gs-resize">Resize</button>')
        .button({
            text:false,
            icons:{primary:"ui-icon-arrow-4-diag"
            }
        })

        .addClass("ui-state-disabled-extern")
        .click(function(b){
            a.open(e,"","type=fullWindow, fullscreen=yes, scrollbars=auto")
        })
    )}

    var g=c(".ui-gs-controls button[title=play]",d);
    this.element
    .bind("gestaltloaded",
          function(){
              c(".ui-gs-controls button",d).each(function(){
                  c(this).removeClass("ui-state-disabled")
              })
          })

          .bind("gestaltstart",function(){
              g.attr("title","pause")
              .find("span.ui-button-icon-primary")
              .removeClass("ui-icon-play").addClass("ui-icon-pause")
          })

          .bind("gestaltstop",function(){
              g.attr("title","play")
              .find("span.ui-button-icon-primary")
              .removeClass("ui-icon-pause").addClass("ui-icon-play")
          });

          var h=0;
          c(".ui-gs-controls button",d).each(function(){
              h+=c(this).outerWidth(true)
          });

          c(".ui-gs-controls",d).css({width:h
          })
        }
})

})(window,document,window.jQuery)
