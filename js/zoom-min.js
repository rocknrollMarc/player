(function(a){a.fn.zoom=function(b){function p(){this.position={x:function(a){return a.pageX},y:function(a){return a.pageY}}}function q(){var b=a(".zoom-box");var d=a("#delete");var e=a("#pointer");this.springer=a("#springer");this.sTop=null;this.sLeft=null;this.springerSizeB=null;this.springerSizeH=null;this.width;this.height;this.windowSize;this.deleteButtonLeft;this.counter=1;this.start=function(b,c){if(b+this.counter==1&&c=="zoom"){var d=a("#gestalt").offset().top;var e=a("#gestalt").offset().left;var f=a("#gestalt").width();var g=a("#gestalt").height();a("#springer").css("left",e+f/2-a("#springer").width()/2);a("#springer").css("top",d+g/2-a("#springer").height()/2);this.show(true);this.counter=2}else if(b+this.counter==3){var d=a("#gestalt").offset().top;var e=a("#gestalt").offset().left;var f=a("#gestalt").width();var g=a("#gestalt").height();if(!window.Touch){a("#springer").css("left",e+f/2-a("#springer").width()/2);a("#springer").css("top",d+g/2-a("#springer").height()/2)}if(c=="zoom")this.show(true)}};this.exist=function(){if(b.length>0||this.springer.length>0){return true}else{return false}};this.moveZoomImage=function(b,c){a(".zoom-box img").css("top",-b+"px");a(".zoom-box img").css("left",-c+"px")};this.setStop=function(a){this.sTop=a};this.getStop=function(){return this.sTop};this.setSleft=function(a){this.sLeft=a};this.getSleft=function(){return this.sLeft};this.setSpringerSizeB=function(a){this.springerSizeB=a};this.getSpringerSizeB=function(){return this.springerSizeB};this.setSpringerSizeH=function(a){this.springerSizeH=a};this.getSpringerSizeH=function(){return this.springerSizeH};this.setWidth=function(a){this.width=a};this.getWidth=function(){return this.width};this.setHeight=function(a){this.height=a};this.getHeight=function(){return this.height};this.zoom_box_visible=function(){if(a(".zoom-box").css("display")=="block"){return true}else{return false}};this.stop=function(a,b,c,d,e,f,g){if(b<d+o.getWidth()/2-1){o.setSleft(d);if(c<e+o.getHeight()/2-1){o.setStop(e)}}else if(c<e+o.getHeight()/2-1){o.setStop(e);if(b>f-o.getWidth()/2+d+1){o.setSleft(f-o.getWidth()+d+1)}}else if(b>f-o.getWidth()/2+d+1){o.setSleft(f-o.getWidth()+d+1)}if(c>g-o.getHeight()/2+e+1){o.setStop(g-o.getHeight()+e+1)}};this.zoomStop=function(a,b,c,d,e,f,g,h,i,j,k){if(b<d-o.getWidth()/2+f+1){}else{if(b>d-o.getWidth()/2+f+1){o.moveZoomImage(h,j)}if(c>e-o.getHeight()/2+g+1){o.moveZoomImage(k,j)}if(c<g+o.getHeight()/2-1){o.moveZoomImage(false,j)}}if(b>=f+o.getWidth()/2-1){}else{o.moveZoomImage(h,false);if(c>e-o.getHeight()/2+g+1){o.moveZoomImage(k,false)}if(c<g+o.getHeight()/2-1){o.moveZoomImage(false,false)}}if(c<e-o.getHeight()/2+g+1){}else{o.moveZoomImage(k,i);if(b<f+o.getWidth()/2-1){o.moveZoomImage(k,false)}if(b>d-o.getWidth()/2+f+1){o.moveZoomImage(k,j)}}if(c>g+o.getHeight()/2-1){}else{o.moveZoomImage(false,i);if(b<f+o.getWidth()/2-1){o.moveZoomImage(false,false)}if(b>d-o.getWidth()/2+f+1){o.moveZoomImage(false,j)}}};this.move=function(){this.springer.css("top",this.sTop);this.springer.css("left",this.sLeft)};this.showCloseButton=function(){a("#delete").fadeIn()};this.margin=function(){return c.margin};this.setZoomBox=function(b,d,e,f,g,h,i){switch(c.position){case"right":this.position_ZoomBox.right(b,d,e,f,g,h);this.setPointer(b+i,e+d+o.margin(),f);break;case"left":this.position_ZoomBox.left(b,d,e,f,g,h);this.setPointer(b+i,e-f-o.margin(),f);break;case"top":this.position_ZoomBox.top(b,d,e,f,g,h);this.setPointer(b-o.margin()-i,e+1,f);break;case"bottom":this.position_ZoomBox.bottom(b,d,e,f,g,h);this.setPointer(b+a("#gestalt").height()+i+o.margin(),e,f);break;default:this.position_ZoomBox.right(b,d,e,f,g,h)}};this.position_ZoomBox={right:function(c,e,f,g,h,i){b.css("left",f+e+o.margin());b.css("top",c);d.css("top",c+1);d.css("left",f+1+e+o.margin()+g-a("#delete").width());if(o.zoom_box_visible()){o.showCloseButton()}},left:function(c,e,f,g,h,j){b.css("left",f-g-1-o.margin());b.css("top",c);d.css("top",c+1);d.css("left",f-i-a("#delete").width());if(o.zoom_box_visible()){o.showCloseButton()}},top:function(a,c,e,f,g,h){b.css("top",a-b.height()-o.margin());b.css("left",e);d.css("top",a+1-b.height()-o.margin());d.css("left",e+1+f-d.width());if(o.zoom_box_visible()){o.showCloseButton()}},bottom:function(c,e,f,g,h,i){b.css("top",c+a("#gestalt").height()+o.margin());b.css("left",f);d.css("top",c+1+a("#gestalt").height()+o.margin());d.css("left",f+1+g-a("#delete").width());if(o.zoom_box_visible()){o.showCloseButton()}}};this.setPointer=function(b,c,d){if(g=="top"){a("#pointer").css({left:c-1,top:b-a("#pointer").height(),width:d+2})}else if(g=="left"){a("#pointer").css({left:c-1,top:b+2,width:d+2})}else{a("#pointer").css({left:c,top:b+2,width:d+2})}};this.setSize=function(){this.springer.css("width",this.springerSizeB+"px");this.springer.css("height",this.springerSizeH+"px")};this.show=function(b){if(b==false){a("#springer").hide()}else if(b==true){a("#springer").show()}};this.activeImage=function(){this.image=a(".activeImage").attr("src");return this.image};this.smallH=function(){$img=a(".ui-gs-images img");var b=$img.height();return b};this.addLoader=function(b,c){if(a("#springer").hasClass("ready")){a("#load").remove()}else{if(a("#load").length==0){a(".zoom-box").append("<div id='load'><img src='css/images/loading.gif' alt='load...' ></div>");var d=b/2-a("#load").height()/2;var e=c/2-a("#load").width()/2;a("#load").css("top",d);a("#load").css("left",e)}}};this.hideZoom=function(){a("#springer").hide();a(".zoom-box").hide();a("#delete").hide();a("#pointer").hide();this.setZoomState(1)};this.removeStateReady=function(){a("#springer").removeClass("ready")};this.zommClassState=1;this.setZoomState=function(a){this.zommClassState=a};this.getZoomState=function(){return this.zommClassState};this.openCloseZoombox=function(){if(o.getZoomState()==2){o.hideZoom();o.setZoomState(1)}else{o.setZoomState(2)}}}var c={height:"500px",width:"500px",position:"right",springer_background:"#000",border:"1px solid black",margin:0,pointer:true,pointer_bgcolor:"#CCCCCC",pointer_fontcolor:"#000000",pointer_text:"Mein Hinweis"};if(b){a.extend(c,b)}var d=c.height;var e=c.width;var f=c.springer_background;var g=c.position;var h=c.border;var i=c.margin;var j=c.pointer;var k=c.pointer_bgcolor;var l=c.pointer_fontcolor;var m=c.pointer_text;a(this).css({height:d,width:e});a(this).css("border",h);a("#springer").css({"background-color":f});if(j==true){a(".zoom-box").after("<div id='pointer'></div>");a("#pointer").css("background-color",k);a("#pointer").css("color",l);a("#pointer").html(m)}var n=new p;var o=new q;a(document).ready(function(){if(o.exist()){var b="button.zoomClass";if(a.browser.msie||/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())){var b=null}a("#springer, .ui-gs-images, "+b).mousemove(function(b){if(window.Touch){document.getElementById("gestalt").addEventListener("touchmove",function(c){c.preventDefault();var d=a(".ui-gs-images");var e=a("#springer");var f=a(".zoom").width();var g=a(".zoom").height();var h=c.touches[0];x=h.pageX;y=h.pageY;var i=d.width();var j=d.height();o.show(true);if(o.getSpringerSizeH()!=Infinity){o.setWidth(e.width());o.setHeight(e.height())}var k=j/o.getHeight();var l=a(".ui-gs-images").offset().top;var m=a(".ui-gs-images").offset().left;var p=i/(n.position.x(b)-(o.getWidth()/2+m));var q=i/(n.position.y(b)-(o.getHeight()/2+l));var r=f/p;var s=f/q;var t=m+i-o.getWidth()/2;var u=i/(t-(o.getWidth()/2+m));var v=f/u;var w=Math.round(l+j-o.getHeight()/2);var z=j/(w-(o.getHeight()/2+l));var A=g/z;var B=i/o.getWidth();var C=f/B;var D=j/o.getHeight();var E=g/D;o.setSpringerSizeB(i/(g/a(".zoom-box").width()));o.setSpringerSizeH(j/(f/a(".zoom-box").height()));o.setSize();o.setStop(y+ -o.getHeight()/2+"px");o.setSleft(x+ -o.getWidth()/2+"px");o.stop(b,x,y,m,l,i,j);o.move();var p=i/(x-(o.getWidth()/2+m));var q=i/(y-(o.getHeight()/2+l));var r=f/p;var s=f/q;o.moveZoomImage(s,r);o.zoomStop(null,x,y,i,j,m,l,s,r,v,A)},false)}else{var c=a(".ui-gs-images");var d=a("#springer");var e=a(".zoom").width();var f=a(".zoom").height();var g=c.width();var h=c.height();var i=a(".ui-gs-images").offset().top;var j=a(".ui-gs-images").offset().left;var k=a("#gestalt").offset().left;var l=a("#gestalt").offset().top;var m=a(".zoom-box").width();var p=a("#gestalt").width();var m=a(".zoom-box").width();var q=a(".zoom-box").offset().top;var r=a(".zoom-box").offset().left;var s=g/(n.position.x(b)-(o.getWidth()/2+j));var t=h/(n.position.y(b)-(o.getHeight()/2+i));var u=e/s;var v=f/t;var w=j+g-o.getWidth()/2;var z=g/(w-(o.getWidth()/2+j));var A=e/z;var B=Math.round(i+h-o.getHeight()/2);var C=h/(B-(o.getHeight()/2+i));var D=f/C;var E=g/o.getWidth();var F=e/E;var G=h/o.getHeight();var H=f/G;o.setStop(n.position.y(b)+ -o.getHeight()/2+"px");o.setSleft(n.position.x(b)+ -o.getWidth()/2+"px");o.stop(b,n.position.x(b),n.position.y(b),j,i,g,h);o.move();o.moveZoomImage(v-2,u);o.zoomStop(b,n.position.x(b),n.position.y(b),g,h,j,i,v,u,A,D)}});a(".zoomClass").click(function(b){o.removeStateReady();var c=a(this).attr("title");var d=a(".ui-gs-images").width();var e=a(".ui-gs-images").height();var f=a("#gestalt").offset().left;var g=a("#gestalt").offset().top;var h=a(".zoom-box").width();var i=a(".zoom-box").height();var i=a(".zoom-box").height();var j=a("#gestalt").width();var h=a(".zoom-box").width();var k=a(".zoom-box").offset().top;var l=a(".zoom-box").offset().left;var m=a("#springer");o.setZoomBox(g,j,f,h,k,l,i);window.setTimeout(function(){o.addLoader(i,h)},500);a(".zoom").load(function(){a("#springer").addClass("ready");a("#load").remove();var b=a(".zoom").width();var j=a(".zoom").height();var k=e/(j/a(".zoom-box").height());var l=d/(b/a(".zoom-box").width());var k=e/(j/i);var l=d/(b/h);o.setSpringerSizeH(e/(j/i));o.setSpringerSizeB(d/(b/h));o.setSize();o.start(0,c);o.setWidth(m.width());o.setHeight(m.height());var n=j/(e/(a("#springer").offset().top+a("#springer").height()/2-(a("#springer").height()/2+g)));var p=b/(d/(a("#springer").offset().left+a("#springer").width()/2-(a("#springer").width()/2+f)));o.moveZoomImage(n,p)});o.start(1,c);if(a(this).attr("title")=="zoom"){a("#delete").show();a(".zoom-box").show();a("#pointer").show()}a(document).keydown(function(a){var b=a.keyCode||a.which,c={space:32,left:37,right:39,esc:27};switch(b){case c.left:o.removeStateReady();window.setTimeout(function(){o.addLoader(i,h)},500);break;case c.right:o.removeStateReady();window.setTimeout(function(){o.addLoader(i,h)},500);break;case c.space:o.removeStateReady();o.hideZoom();break;case c.esc:o.removeStateReady();o.hideZoom();break}});o.openCloseZoombox()});a("button[title=play], .zoom-box, #pointer").click(function(){o.hideZoom()});a("#del").click(function(){o.hideZoom();o.removeStateReady()})}})}})(jQuery)