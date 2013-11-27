
(function( $ ){

	$.fn.zoom = function( options ){

		var settings =
		{
			height	:	'500px',			// Zoom-Box Höhe
			width	:	'500px',			// Zoom-Box Breite
			position : 	"right",			//Zoom-Box Position
			springer_background : "#000",	// Hintergrund des Springers
			border: "9px #CCCCCC",
			margin: 9,
			pointer: false,
			pointer_bgcolor: "#FFFFFF",
			pointer_fontcolor: "#CCCCCC",
			pointer_text: "RocknRoll",
               		}



		if( options ){
			$.extend( settings, options );
		}

		var height = settings.height;
		var width = settings.width;
		var springer_background = settings.springer_background;
		var position = settings.position;
		var border = settings.border;
		var	margin = settings.margin;
		var pointer = settings.pointer;
		var pointer_bgcolor = settings.pointer_bgcolor;
		var pointer_fontcolor = settings.pointer_fontcolor;
		var	pointer_text = settings.pointer_text;


		$(this).css({"height":height,"width":width});

		$(this).css("border",border);

		$("#springer").css({"background-color":springer_background});

		if(pointer == true){
			$(".zoom-box").after("<div id='pointer'></div>");
			$("#pointer").css("background-color",pointer_bgcolor);
			$("#pointer").css("color",pointer_fontcolor);
			$("#pointer").html(pointer_text);
		}

	var maus = new Maus();
	var springer = new Springer();


	////////////////////////////////
	////Mausposition X,Y////////////
	////////////////////////////////
	function Maus()
	{
		this.position =
		{
			x : function (e)
			{
				return e.pageX;
			},

			y : function (e)
			{
				return e.pageY;
			}
		}
	}



	////////////////////////////////
	////Springer und Zoombild///////
	////////////////////////////////
	function Springer()
	{
		var zoom_box = $(".zoom-box");
		var $delete = $("#delete");
		var pointer = $("#pointer");

		this.springer = $("#springer");
		this.sTop = null;
		this.sLeft = null;
		this.springerSizeB = null;
		this.springerSizeH = null;
		this.width;
		this.height;
		this.windowSize;
		this.deleteButtonLeft;
		this.counter =1;
		this.start = function(count,title){
			if(count+this.counter == 1 && title == "zoom"){
				var kastenT = $("#gestalt").offset().top;
				var kastenL= $("#gestalt").offset().left;
				var gestaltWidth = $("#gestalt").width();
				var gestaltHeight = $("#gestalt").height();
				$("#springer").css("left",kastenL+(gestaltWidth/2)-($("#springer").width()/2));
				$("#springer").css("top",kastenT+(gestaltHeight/2)-($("#springer").height()/2));
				this.show(true);
				this.counter=2;
			}
			else if(count+this.counter == 3){
				var kastenT = $("#gestalt").offset().top;
				var kastenL= $("#gestalt").offset().left;
				var gestaltWidth = $("#gestalt").width();
				var gestaltHeight = $("#gestalt").height();
				if(!window.Touch){
					$("#springer").css("left",kastenL+(gestaltWidth/2)-($("#springer").width()/2));
					$("#springer").css("top",kastenT+(gestaltHeight/2)-($("#springer").height()/2));
				}
				if(title == "zoom" )this.show(true);
			}
		}
		this.exist = function(){
			if ( zoom_box.length > 0 || this.springer.length > 0) {
				return true;
			}
			else{
				return false;
			}
		}

		this.moveZoomImage = function(posLeftY,posLeftX){
			$(".zoom-box img").css("top", -posLeftY+"px");
			$(".zoom-box img").css("left",-posLeftX+"px");
		}

		this.setStop = function(val){
			this.sTop = val;
		}
		this.getStop = function(){
			return this.sTop;
		}

		this.setSleft = function(val){
			this.sLeft = val;
		}
		this.getSleft = function(){
			return this.sLeft;
		}

		this.setSpringerSizeB = function(val){
			this.springerSizeB = val;
		}
		this.getSpringerSizeB = function(){
			return this.springerSizeB;
		}

		this.setSpringerSizeH = function(val){
			this.springerSizeH = val;
		}
		this.getSpringerSizeH = function(){
			return this.springerSizeH;
		}

		this.setWidth = function(val){
			this.width = val;
		}
		this.getWidth = function(){
			return this.width;
		}

		this.setHeight = function(val){
			this.height = val;
		}
		this.getHeight = function(){
			return this.height;
		}

		this.zoom_box_visible = function(){
			if($(".zoom-box").css("display")=="block"){return true}
			else{return false}
		}

		this.stop = function(e,x,y,kastenL,kastenT,smallB,smallH){
			//links
			if(x<kastenL+springer.getWidth()/2-1){
				springer.setSleft(kastenL);
				//links+Oben
				if(y<kastenT+springer.getHeight()/2-1){
					springer.setStop(kastenT);
				}
			}

			//oben
			else if(y<kastenT+springer.getHeight()/2-1){
				springer.setStop(kastenT);
				if(x>smallB-springer.getWidth()/2+kastenL+1){
					springer.setSleft(smallB-springer.getWidth()+kastenL+1);
				}
			}

			//rechts
			else if(x>smallB-springer.getWidth()/2+kastenL+1){
				springer.setSleft(smallB-springer.getWidth()+kastenL+1);
			}

			//unten
			if(y>smallH-springer.getHeight()/2+kastenT+1){
				springer.setStop(smallH-springer.getHeight()+kastenT+1);
			}
		}
		this.zoomStop = function(e,x,y,smallB,smallH,kastenL,kastenT,posLeftY,posLeftX,stopRechts,stopBottom){
			//rechts
			if(x<smallB-springer.getWidth()/2+kastenL+1){
			}else{
				if(x>smallB-springer.getWidth()/2+kastenL+1){
					springer.moveZoomImage(posLeftY,stopRechts);
				}
				if(y>smallH-springer.getHeight()/2+kastenT+1){//unten
					springer.moveZoomImage(stopBottom,stopRechts);
				}
				if(y<kastenT+springer.getHeight()/2-1){
					springer.moveZoomImage(false,stopRechts);
				}
			}

			//links
			if(x>=kastenL+springer.getWidth()/2-1){
			}
			else{
				springer.moveZoomImage(posLeftY,false);
				if(y>smallH-springer.getHeight()/2+kastenT+1){//unten
					springer.moveZoomImage(stopBottom,false);
				}
				if(y<kastenT+springer.getHeight()/2-1){  //links/oben
					springer.moveZoomImage(false,false);
				}
			}

			//Unten
			if(y<smallH-springer.getHeight()/2+kastenT+1){
			}
			else{
					springer.moveZoomImage(stopBottom,posLeftX);
				if(x<kastenL+springer.getWidth()/2-1){
					springer.moveZoomImage(stopBottom,false);
				}
				if(x>smallB-springer.getWidth()/2+kastenL+1){
					springer.moveZoomImage(stopBottom,stopRechts);
				}
			}

			//Oben
			if(y>kastenT+springer.getHeight()/2-1){
			 }
			else{
					springer.moveZoomImage(false,posLeftX);
				if(x<kastenL+springer.getWidth()/2-1){
					springer.moveZoomImage(false,false);
				}
				if(x>smallB-springer.getWidth()/2+kastenL+1){
					springer.moveZoomImage(false,stopRechts);
				}
			}		}

		this.move = function(){
			this.springer.css("top",this.sTop);
			this.springer.css("left",this.sLeft);
		}

		this.showCloseButton = function(){
			$("#delete").fadeIn();
		}

		this.margin = function(){
			return settings.margin;
		}
		this.setZoomBox = function(gestaltT,gestaltWidth,gestaltL,zoomBoxBreite,zoomboxOffsetTop,zoomboxOffsetleft,zoomBoxHoehe){
			switch (settings.position) {
				case "right": this.position_ZoomBox.right(gestaltT,gestaltWidth,gestaltL,zoomBoxBreite,zoomboxOffsetTop,zoomboxOffsetleft);
							this.setPointer(gestaltT+zoomBoxHoehe,gestaltL+gestaltWidth+springer.margin(),zoomBoxBreite);
					break;

				case "left": this.position_ZoomBox.left(gestaltT,gestaltWidth,gestaltL,zoomBoxBreite,zoomboxOffsetTop,zoomboxOffsetleft);
							this.setPointer(gestaltT+zoomBoxHoehe,gestaltL-zoomBoxBreite-springer.margin(),zoomBoxBreite);
					break;

				case "top": this.position_ZoomBox.top(gestaltT,gestaltWidth,gestaltL,zoomBoxBreite,zoomboxOffsetTop,zoomboxOffsetleft);
							this.setPointer(gestaltT-springer.margin()-zoomBoxHoehe,gestaltL+1,zoomBoxBreite);
					break;

				case "bottom": this.position_ZoomBox.bottom(gestaltT,gestaltWidth,gestaltL,zoomBoxBreite,zoomboxOffsetTop,zoomboxOffsetleft);
							this.setPointer(gestaltT+$("#gestalt").height()+zoomBoxHoehe+springer.margin(),gestaltL,zoomBoxBreite);

					break;

				default: this.position_ZoomBox.right(gestaltT,gestaltWidth,gestaltL,zoomBoxBreite,zoomboxOffsetTop,zoomboxOffsetleft);
			}
		}
		this.position_ZoomBox =
		{
			right : function (gestaltT,gestaltWidth,gestaltL,zoomBoxBreite,zoomboxOffsetTop,zoomboxOffsetleft)
			{
				zoom_box.css("left",gestaltL+gestaltWidth+springer.margin());
				zoom_box.css("top",gestaltT);
				$delete.css("top",gestaltT+1);
				$delete.css("left",gestaltL+1+gestaltWidth+springer.margin()+zoomBoxBreite-$("#delete").width());
				if(springer.zoom_box_visible()) {
					springer.showCloseButton();
				}

			},

			left : function (gestaltT,gestaltWidth,gestaltL,zoomBoxBreite,zoomboxOffsetTop,zoomboxOffsetleft)
			{
				zoom_box.css("left",gestaltL-zoomBoxBreite-1-springer.margin());
				zoom_box.css("top",gestaltT);
				$delete.css("top",gestaltT+1);
				$delete.css("left",gestaltL-margin-$("#delete").width());
				if(springer.zoom_box_visible()) {
					springer.showCloseButton();
				}

				//if(gestaltL<zoomBoxBreite){
					//Wenn Box sich überlappt dann...
				//}
			},

			top : function (gestaltT,gestaltWidth,gestaltL,zoomBoxBreite,zoomboxOffsetTop,zoomboxOffsetleft)
			{
				zoom_box.css("top",gestaltT-zoom_box.height()-springer.margin());
				zoom_box.css("left",gestaltL);
				$delete.css("top",gestaltT+1-zoom_box.height()-springer.margin());
				$delete.css("left",gestaltL+1+zoomBoxBreite-$delete.width());

				if(springer.zoom_box_visible()) {
					springer.showCloseButton();
				}
			},

			bottom : function (gestaltT,gestaltWidth,gestaltL,zoomBoxBreite,zoomboxOffsetTop,zoomboxOffsetleft)
			{
				zoom_box.css("top",gestaltT+$("#gestalt").height()+springer.margin());
				zoom_box.css("left",gestaltL);
				$delete.css("top",gestaltT+1+$("#gestalt").height()+springer.margin());
				$delete.css("left",gestaltL+1+zoomBoxBreite-$("#delete").width());

				if(springer.zoom_box_visible()) {
					springer.showCloseButton();
				}
			}

		}

		this.setPointer = function(gestaltT,gestaltL,zoomBoxBreite){
			if(position == "top"){
				$("#pointer").css({left:gestaltL-1, top:gestaltT-$("#pointer").height(), width:zoomBoxBreite+2});
			}
			else if(position == "left"){
				$("#pointer").css({left:gestaltL-1, top:gestaltT+2, width:zoomBoxBreite+2});
			}
			else{
				$("#pointer").css({left:gestaltL, top:gestaltT+2, width:zoomBoxBreite+2});
			}
		}

		this.setSize = function(){
			this.springer.css("width",this.springerSizeB+"px");
			this.springer.css("height",this.springerSizeH+"px");
		}

		this.show = function(state){
			if (state==false){
        		$("#springer").hide();
        	}
        	else if(state==true){
        		$("#springer").show();
        	}
		}

		this.activeImage = function(){

			this.image = $(".activeImage").attr("src");

			return this.image;
		}

		this.smallH = function(){
			$img = $(".ui-gs-images img");
			var smallH = $img.height();
			return smallH;
		}

		this.addLoader = function(zoomBoxHoehe,zoomBoxBreite){
			if($("#springer").hasClass("ready")){$("#load").remove();}
			else
			{
				if($("#load").length == 0){
					$(".zoom-box").append("<div id='load'><img src='css/images/loading.gif' alt='load...' ></div>");
					var loaderTop = (zoomBoxHoehe/2)-($("#load").height()/2);
					var LoaderLeft = (zoomBoxBreite/2)-($("#load").width()/2);
					$("#load").css("top",loaderTop);
					$("#load").css("left",LoaderLeft);
				}
			}
		}
		this.hideZoom = function(){
			$("#springer").hide();
			$(".zoom-box").hide();
			$("#delete").hide();
			$("#pointer").hide();
			this.setZoomState(1);
		}
		this.removeStateReady = function(){
			$("#springer").removeClass("ready");
		}

		this.zommClassState = 1;
		this.setZoomState = function(zoom){
			this.zommClassState = zoom;
		}
		this.getZoomState = function(){
			return this.zommClassState;
		}
		this.openCloseZoombox = function(){
			if(springer.getZoomState() == 2){//zoombox soll sich schließen
				springer.hideZoom();
				springer.setZoomState(1);
			}
			else{
				springer.setZoomState(2);// zoombox soll sich nicht schließen
			}
		}
	}



$(document).ready(function(){

	//Existiert der Springer und die Zoom-Box...
	if(springer.exist())
	{
	var buttons = "button.zoomClass";
	if($.browser.msie || /chrom(e|ium)/.test(navigator.userAgent.toLowerCase())){ var buttons = null;}


	$("#springer, .ui-gs-images, "+ buttons).mousemove(function(e){

		if (window.Touch) {

			document.getElementById("gestalt").addEventListener('touchmove', function(event) {
			event.preventDefault();
			var $img = $(".ui-gs-images");
			var $springer = $("#springer");
			var largeB = $(".zoom").width();
			var largeH = $(".zoom").height();

			var touch = event.touches[0];
			x = touch.pageX;
			y = touch.pageY;

			var smallB = $img.width();
			var smallH = $img.height();


        	////////////////////
        	//Springer anzeigen/
        	////////////////////
			springer.show(true);


			if (springer.getSpringerSizeH() != Infinity)
			{
				springer.setWidth($springer.width());
				springer.setHeight($springer.height());
        	}

			var springerSize = smallH/springer.getHeight();
			var kastenT = $(".ui-gs-images").offset().top;
			var kastenL= $(".ui-gs-images").offset().left;

        	var facLeftX = smallB / (maus.position.x(e)-(springer.getWidth()/2+kastenL)); // + offset left
			var facLeftY = smallB / (maus.position.y(e)-(springer.getHeight()/2+kastenT)); // + offset top

			//Zoom-Box ausrichtung
			var posLeftX = largeB / facLeftX;
			var posLeftY = largeB / facLeftY;

			//Stop Rechts...
			var stoppenRechts = (kastenL+smallB-springer.getWidth()/2);
			var stopR = smallB / (stoppenRechts-(springer.getWidth()/2+kastenL)); // + offset left
			var stopRechts = largeB / stopR;

			//Stop Links...
			var stoppenBottom = Math.round((kastenT+smallH-springer.getHeight()/2));

			var stopB = smallH / (stoppenBottom-(springer.getHeight()/2+kastenT)); // + offset left
			var stopBottom = largeH / stopB;

			var factorSpringerB = smallB/springer.getWidth();
			var zoomboxBreite = largeB/factorSpringerB;

			var factorSpringerH = smallH/springer.getHeight();
			var zoomboxHeight = largeH/factorSpringerH;

			springer.setSpringerSizeB(smallB/(largeH/$(".zoom-box").width()));	 //Springer Breite
			springer.setSpringerSizeH(smallH/(largeB/$(".zoom-box").height()));	 //Springer H√∂he
			springer.setSize(); //Springer gr√∂√üe anpassen

			/////////////////////////////////////////////////////
			//////////// Springer muss innherlab des Bildes bleiben
			/////////////////////////////////////////////////////
			springer.setStop(y+(-springer.getHeight()/2)+"px");
			springer.setSleft(x+(-springer.getWidth()/2)+"px");
			springer.stop(e,x,y,kastenL,kastenT,smallB,smallH);
			//////////////////////////////
			///////Springer bewegen
			//////////////////////////////
			springer.move();
			/////////////////////////////////////////////////////
			//////////// Zoom Bild verschiebung
			/////////////////////////////////////////////////////
			var facLeftX = smallB / (x-(springer.getWidth()/2+kastenL)); // + offset left
			var facLeftY = smallB / (y-(springer.getHeight()/2+kastenT)); // + offset top

			//Zoom-Box ausrichtung
			var posLeftX = largeB / facLeftX;

			var posLeftY = largeB / facLeftY;
			springer.moveZoomImage(posLeftY,posLeftX);
			springer.zoomStop(null,x,y,smallB,smallH,kastenL,kastenT,posLeftY,posLeftX,stopRechts,stopBottom);

			}, false);

		}


		else
			{
			var $img = $(".ui-gs-images");
			var $springer = $("#springer");
			var largeB = $(".zoom").width();
			var largeH = $(".zoom").height();

			var smallB = $img.width();
			var smallH = $img.height();
			var kastenT = $(".ui-gs-images").offset().top;
			var kastenL= $(".ui-gs-images").offset().left;

			var gestaltL = $("#gestalt").offset().left;
			var gestaltT = $("#gestalt").offset().top;
			var zoomBoxBreite = $(".zoom-box").width();
			var gestaltWidth = $("#gestalt").width();
			var zoomBoxBreite = $(".zoom-box").width();
			var zoomboxOffsetTop = $(".zoom-box").offset().top;
			var zoomboxOffsetleft = $(".zoom-box").offset().left;


			var facLeftX = smallB / (maus.position.x(e)-(springer.getWidth()/2+kastenL)); // + offset left
			var facLeftY = smallH / (maus.position.y(e)-(springer.getHeight()/2+kastenT)); // + offset top
			//Zoom-Box ausrichtung
			var posLeftX = largeB / facLeftX;
			var posLeftY = largeH / facLeftY;

			//Stop Rechts...
			var stoppenRechts = (kastenL+smallB-springer.getWidth()/2);
			var stopR = smallB / (stoppenRechts-(springer.getWidth()/2+kastenL)); // + offset left
			var stopRechts = largeB / stopR;

			//Stop Links...
			var stoppenBottom = Math.round((kastenT+smallH-springer.getHeight()/2));

			var stopB = smallH / (stoppenBottom-(springer.getHeight()/2+kastenT)); // + offset left
			var stopBottom = largeH / stopB;

			var factorSpringerB = smallB/springer.getWidth();
			var zoomboxBreite = largeB/factorSpringerB;

			var factorSpringerH = smallH/springer.getHeight();
			var zoomboxHeight = largeH/factorSpringerH;

				springer.setStop(maus.position.y(e)+(-springer.getHeight()/2)+"px");
				springer.setSleft(maus.position.x(e)+(-springer.getWidth()/2)+"px");

				/////////////////////////////////////////////////////
				///////// Springer muss innherlab des Bildes bleiben
				/////////////////////////////////////////////////////
				springer.stop(e,maus.position.x(e),maus.position.y(e),kastenL,kastenT,smallB,smallH);
				/////////////////////////////////////////////////////
				///////// Springer bewegen
				/////////////////////////////////////////////////////
				springer.move();

				/////////////////////////////////////////////////////
				///////// Zoom Bild verschiebung
				/////////////////////////////////////////////////////
				springer.moveZoomImage(posLeftY-2,posLeftX);
				springer.zoomStop(e,maus.position.x(e),maus.position.y(e),smallB,smallH,kastenL,kastenT,posLeftY,posLeftX,stopRechts,stopBottom);
        	}
		});
		$(".zoomClass").click(function(e){

			springer.removeStateReady();
			var title = $(this).attr("title");
			var smallB = $(".ui-gs-images").width();
			var smallH = $(".ui-gs-images").height();
			var gestaltL = $("#gestalt").offset().left;
			var gestaltT = $("#gestalt").offset().top;
			var zoomBoxBreite = $(".zoom-box").width();
			var zoomBoxHoehe = $(".zoom-box").height();
			var zoomBoxHoehe = $(".zoom-box").height();
			var gestaltWidth = $("#gestalt").width();
			var zoomBoxBreite = $(".zoom-box").width();
			var zoomboxOffsetTop = $(".zoom-box").offset().top;
			var zoomboxOffsetleft = $(".zoom-box").offset().left;
			var $springer = $("#springer");

			springer.setZoomBox(gestaltT,gestaltWidth,gestaltL,zoomBoxBreite,zoomboxOffsetTop,zoomboxOffsetleft,zoomBoxHoehe);
			window.setTimeout(function(){springer.addLoader(zoomBoxHoehe,zoomBoxBreite)}, 500);



			//Ist das Große Bild vollständig geladen...
			$('.zoom').load(function() {
				$("#springer").addClass("ready");
					$("#load").remove();

					var largeB = $(".zoom").width();
					var largeH = $(".zoom").height();

					var springerSizeH = smallH/(largeH/$(".zoom-box").height());
					var springerSizeB = smallB/(largeB/$(".zoom-box").width());

					var springerSizeH = smallH/(largeH/zoomBoxHoehe);
					var springerSizeB = smallB/(largeB/zoomBoxBreite);

					springer.setSpringerSizeH(smallH/(largeH/zoomBoxHoehe));	//Springer Breite
					springer.setSpringerSizeB(smallB/(largeB/zoomBoxBreite));	//Springer Höhe
					springer.setSize(); 										//Springer größe setzen


					springer.start(0,title);									//Startposition des Springers setzten
					springer.setWidth($springer.width());
					springer.setHeight($springer.height());

					var top = largeH / (smallH / ((($("#springer").offset().top+($("#springer").height()/2))-($("#springer").height()/2+gestaltT))));
					var left = largeB / (smallB / (($("#springer").offset().left+($("#springer").width()/2))-($("#springer").width()/2+gestaltL)));
					springer.moveZoomImage(top,left);
			});
				springer.start(1,title);
			if($(this).attr("title") == "zoom" ){
				$("#delete").show();
				$(".zoom-box").show();
				$("#pointer").show();
			}

// changeZoomImage:function(){
// 	$(".zoom-box img").attr("src",this.active_image().replace("small","large"));
// },
 			$(document).keydown(function (e) {
				var keyCode = e.keyCode || e.which,
					arrow = {space: 32, left: 37, right: 39, esc: 27 };

				switch (keyCode) {
					case arrow.left:
					springer.removeStateReady();
					window.setTimeout(function(){springer.addLoader(zoomBoxHoehe,zoomBoxBreite)}, 500);
					break;

					case arrow.right:
					springer.removeStateReady();
					window.setTimeout(function(){springer.addLoader(zoomBoxHoehe,zoomBoxBreite)}, 500);
					break;

					case arrow.space:
					springer.removeStateReady();
					springer.hideZoom();
					break;

					case arrow.esc:
					springer.removeStateReady();
					springer.hideZoom();
					break;
				}
			});
				springer.openCloseZoombox();


		});
		$("button[title=play], .zoom-box, #pointer").click(function(){
			springer.hideZoom();
		});

		$("#del").click(function(){
			springer.hideZoom();
			springer.removeStateReady();
		});

	}
});
	};
})(jQuery);





