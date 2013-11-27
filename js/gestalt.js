// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name gestalt-min.js
// ==/ClosureCompiler==

(function(window, document, jq, undefined) {

jq.queryParams = function( defaults ) {
    var ary = window.location.search.substr(1).split('&'),
        obj = {},
        tmp, key, val;

    for (var ii=0, len=ary.length; ii<len; ii++) {
        tmp = ary[ii].split('=');
        key = decodeURI(tmp[0]);
        val = decodeURI(tmp[1]);


        switch (val.toLowerCase()) {
        case 'true':
            val = true;
            break
        case 'false':
            val = false;
            break;
        case '':
        case 'null':
            val = null;
            break;
        default:
            tmp = parseFloat(val);
            if (!isNaN(tmp)) val = tmp;
        };

        obj[key] = val;
    };
    if (defaults) { jq.extend(defaults, obj); }
    else          { defaults = obj; }

    return defaults;
};

jq.widget('ui.gestalt', jq.ui.mouse, {
    version: '1.0.0',
    options: {
        url: null,
        size: 'small',
        controls: false,
        largeUrl: null,		// URI encoded options to be passed to the large image viewer
        images: null,		// the list of image files to animate
        wait: 60,			// retry loading images for this number of seconds
        keyboard: true,		// allow keyboard interaction (true, false)
        animate: false,		// start animating after loading (true, 'once', false)
        framerate: 5,		// number of images to display per second
        mouse: 10,			// allow mouse interaction (Integer > 0, false)
							// - specifies the distance the mouse must move to
                       	    //   animate to the next / previous image (in pixels)
    	margin: true
    },


	margin:function(){
	o=this.options;

	if(o.margin==true){
		$(".ui-gs-controls").css("margin","15px auto 10px");
	}
	if(o.margin==false){
		$(".ui-gs-controls").css("margin","15px auto 10px");
	}
},

 changeZoomImage:function(){
 	$(".zoom-box img").attr("src",this.active_image().replace("small","large"));
 },


    _create: function( ) {
        var self = this,
            o = this.options,
            context = this.element[0];


		if( this.options.controls == "zoom"){
        	this.element
        	.append(
        	    '<div id="delete"><img src="css/images/kreuz.png" id="del"></div><div class="zoom-box"><img class="zoom" src=""></div>'+
        	    '<div id="springer"></div>'
        	);
		}


        this.element
        .addClass('ui-gs ui-widget ui-widget-content ui-helper-clearfix')
        .attr('role','gestalt')
        .append(
            '<div id="quick" class="ui-gs-images">' +
            '    <div class="ui-gs-progressbar" style="display:none;"></div>' +
            '</div>'
        );




        if (o.controls) { this._appendControls(); this.margin();}

        this._mouseInit();
        this.images = jq('.ui-gs-images', context);
        //zoombox

        this.progressbar = jq('.ui-gs-progressbar', context).progressbar({ value: 0 });
        this.loaded = false;

        this.running = false;
        this.imageList = [];
        this.imageListZoom = [];
        this.direction = 'forward';
        this.once = o.animate === 'once';
        this.retry = {
            list: [],
            count: 0,
            id: 0
        };

        this._setOption('framerate', o.framerate);

        // if we are given a url, attempt to download a list of image files to
        // add to the viewer
        if (o.url) {
            var url = o.url + '/' + o.size + '/Filelist.txt';
            jq.get(url, function( data, status, xhr ) {
                self._setOption('images', data.replace(/['"]/g, '').split(','));
            }, 'text');
        } else if (o.images) { this._setOption('images', o.images); }

        // the loaded function will be called when all images have been
        // loaded into the viewer
        o.loaded = function() {
            self.loaded = true;
            self.progressbar.progressbar('destroy').remove();
            if (o.keyboard) { self._keyboardBindings(); }
            if (o.animate) { self.start(); }
        };

        // the added function is called when an image is loaded - it is used
        // to update the progress bar
        o.added = function( event, ui ) {
            var value = 100 * self._imageLoadCount / self.imageList.length;
            self.progressbar.progressbar('option', 'value', value);
        };

        if (window.Touch) {
            var imagesDiv = this.images[0];
            imagesDiv.addEventListener('touchstart', function( event ) {
                event.preventDefault()
                self._mouseStart(event.touches[0]);
            }, false);
            imagesDiv.addEventListener('touchmove', function( event ) {
                event.preventDefault()
                self._mouseDrag(event.touches[0]);
            }, false);
        }
    },

    destroy: function() {
        this._mouseDestroy();
        if (this.options.keyboard) { jq(document).unbind(jq.browser.mozilla ? 'keypress' : 'keydown', this._keydown); }

        this.element
        .removeClass('ui-gs ui-gs-hide-controls ui-widget ui-widget-content ui-helper-clearfix')
        .removeAttr('role','gestalt')
        .removeData('gestalt')
        .empty();

        jq.Widget.prototype.destroy.call( this );
    },

	// Options Werte setzen
    _setOption: function( key, value ) {
        jq.Widget.prototype._setOption.apply(this, arguments);
        switch (key) {
        case 'images':
            if (value && value.length > 0) { this.stop()._load(); }
            break;

        case 'framerate':
            if (value < 1) { value = 1; }
            if (value > 22) { value = 22; }
            this.options[ key ] = value;
            var delay = 1000 / value;

            if (delay !== this.delay) {
                this.delay = delay;
                if (this.running) {
                    this._stop();
                    this._start();
                }
            }
            break;
        }
    },


    _load: function() {
        var self = this,
            $img = null;

        clearInterval(this.retry.id);
        this.retry.list.length = 0;
        this.retry.count = 0;

        this.images.find('img').remove();

		this.imageList.length = 0;
        this._imageLoadCount = 0;

        jq.each(this.options.images, function(ii, val) {
            $img = jq('<img />');  // just a placeholder for now

            self.imageList.push($img);
            self.images.append($img);
            self._addImage(ii, val);

        });

        this.retry.id = setInterval(function() {self._retryLoad()}, 1000);
        return this;
    },



    _addImage: function( index, src ) {
	// Prevent caching in IE, see CTS#132920.
        if (jq.browser.msie || this.retry.count) { src += '?_=' + (new Date).getTime(); }

        var self = this,
            $oldImg = this.imageList[index],
            $newImg = jq('<img />')
                  .attr('src', src)
                  .load(function() {self._imageLoaded(index)}) .error(function() {self.retry.list.push(index)}); this.imageList[index] = $newImg; $oldImg.removeAttr('src').replaceWith($newImg);
        return this;
    },




    _imageLoaded: function( index ) {
        this._imageLoadCount++;

        if (this._imageLoadCount === 1) {
            this._setImageSize(this.imageList[index]);

            this.progressbar.show();
            var margin = 2 * parseInt(this.progressbar.css('left') || 10);
            this.progressbar.css({width: this.images.width() - margin});
            this._activate(0);
        }

        this._trigger('added', undefined, { count: this._imageLoadCount });

        if (this._imageLoadCount == this.imageList.length) { this._trigger('loaded'); }

        return this;
    },


    _retryLoad: function() {
        if ((this._imageLoadCount === this.imageList.length) || (this.retry.count >= this.options.wait)) {
            clearInterval(this.retry.id);
            this.retry.id = 0;
            return this;
        }

        var self = this,
            images = this.options.images,
            img = null;

        this.retry.count++;
        jq.each(this.retry.list, function(ii, index) {self._addImage(index, images[index])});
        this.retry.list.length = 0;
        return this;
    },


    _activate: function( index ) {
        this.images.find('img').hide();
        this.imageList[index].show();
        this._active = index;
        return this;
    },

    next: function( event ) {
      var index = this.stop(event)._next();
      this._activate(index);
      this._trigger('next', event, { index: index });
      return this;
    },

    prev: function( event ) {
      var index = this.stop(event)._prev();
      this._activate(index);
      this._trigger('prev', event, { index: index });
      return this;
    },

    _next: function() {
        var index = this._active,
            length = this.imageList.length;

        index++;
        if (index >= length) { index = 0; }
        i=1;
        return index;
    },

    _prev: function() {
        var index = this._active,
            length = this.imageList.length;

        index--;
        if (index < 0) { index = length-1; }
        return index;
    },

    start: function( event ) {
        if (this._start()) { this._trigger('start', event); }

        return this;
    },

    stop: function( event ) {
        if (this._stop()) { this._trigger('stop', event); }


        return this;
    },

    _start: function() {
        if (!this.running) {
            var self = this,
                func = null;

            switch (this.direction) {
            case 'forward':
                func = function() {
                    var index = self._next();
                    if (self.once && index < self._active) {
                        self.once = false;
                        self.stop();
                    }
                    self._activate(index);
                };
                break;
            case 'reverse':
                func = function() {
                    var index = self._prev();
                    if (self.once && index === 0) {
                        self.once = false;
                        self.stop();
                    }
                    self._activate(index);
                };
                break;
            }

            this.running = setInterval(func, this.delay);
            return true;
        }
        return false;
    },

	active_image: function(){
		active = this.imageList[this._active].attr("src");

		return active;
	},

    _stop: function() {

        if (this.running) {
            clearInterval(this.running);
            this.running = 0;
            this.once = false;

            return true;
        }
        return false;
    },

    startStop: function( event ) {
        if (!this.loaded) return this;
        this.running ? this.stop(event) : this.start(event);
        return this;
    },

    _direction: function( dir ) {
        this.direction = dir;
        if (this.running) {
            this._stop();
            this._start();
        }
        return this;
    },

    _setImageSize: function( $image ) {
        var width = this.element.outerWidth(true) - this.images.width(),
            height = this.element.outerHeight(true) - this.images.height(),
            wScale, hScale, scale, css;

        width = window.innerWidth - width;
        height = window.innerHeight - height;

        wScale = width / $image.width();
        hScale = height / $image.height();
        scale = (wScale < hScale) ? wScale : hScale;

        css = (scale < 1) ?
              {width: $image.width()*scale, height: $image.height()*scale} :
              {width: $image.width(), height: $image.height()};

        this.images.css(css);

        jq('img', this.images[0]).css(css);
        this.element.css('min-width', this.images.outerWidth(true));
    },

    _keyboardBindings: function() {
        var self = this;

        this._keydown = function( event ) {
            if (event.altKey || event.ctrlKey || event.metaKey) { return; }
            var code = event.keyCode ? event.keyCode : event.which;

            switch (code) {
            case jq.ui.keyCode.SPACE:      // spacebar

            if(jq("textarea").focusin()) {  // If there is a textfield being used then prevent default.
                return false;               // prevent default
            }else{
                 self.startStop(event);
            }
               return false;				// prevent default browser behavior

            case jq.ui.keyCode.LEFT:       // left arrow
                self.next(event);
                if(self.options.controls === 'zoom'){self.changeZoomImage();}
                return false;

            case jq.ui.keyCode.RIGHT:      // right arrow
                self.prev(event);
                if(self.options.controls === 'zoom'){self.changeZoomImage();}
                return false;

            case jq.ui.keyCode.UP:         // up arrow
                self._setOption('framerate', self.options.framerate+1);
                return false;

            case jq.ui.keyCode.DOWN:       // down arrow
                self._setOption('framerate', self.options.framerate-1);
                return false;
            }
        };

        jq(document).bind(jq.browser.mozilla ? 'keypress' : 'keydown', this._keydown);
    },

    _mouseStart: function( event ) {
        if (!(this.options.mouse && this.loaded)) { return; }
        this.xStart = event.pageX;
    },

    _mouseDrag: function( event ) {

        if (!(this.options.mouse && this.loaded )) { return; }
		if (($("#springer").css("display")=="block" || $(".zoom-box").css("display")=="block")) { return false; }//Ist der Springer sichtbar, dann funtion abschalten
        var x = (event.pageX - this.xStart) / this.options.mouse,
            next = x < 0;
        x = Math.abs(x);
        if (x < 1) { return; }

        if (next) { for (; x>0; x--) this.next(event); }
        else      { for (; x>0; x--) this.prev(event); }

        this.xStart = event.pageX;
    },




    _appendControls: function() {
        var self = this,
            context = this.element[0];

        this.element.append(
            jq('<div class="ui-gs-controls"></div>')
            .append('<button title="prev" class="zoomClass buttonPrev">Prev</button>')
            .append('<button title="play" class="buttonPlay">Play</button>')
            .append('<button title="next" class="zoomClass buttonNext">Next</button>')
        );

        jq('.ui-gs-controls button:first', context)
        .button({
            text: false,
            icons: { primary: 'ui-icon-prev-default' }
        }).addClass('ui-state-disabled').click(function(event) { self.next(event);if(self.options.controls === 'zoom'){self.changeZoomImage();}  return false; })
        .next().button({
            text: false,
            icons: { primary: 'buttonPlay' }
        }).addClass('ui-state-disabled').click(function(event) { self.startStop(event); return false; })
        .next().button({
            text: false,
            icons: { primary: 'ui-icon-next-default' }
        }).addClass('ui-state-disabled').click(function(event) { self.prev(event); if(self.options.controls === 'zoom'){self.changeZoomImage();} return false; });



        if (this.options.controls === 'einzelbild') {
            var url = this.options.url + '/large.html';

            if (this.options.largeUrl) {
                url = window.location.href.split('?')[0] +
                      '?url=' + encodeURI(this.options.url) +
                      '&' + decodeURIComponent(this.options.largeUrl);
            }


		jq('.ui-gs-controls', context).append(
			jq('<button title=" "  class="ui-gs-resize">Resize</button>')
				.button({
					text: false,
					icons: { primary: 'ui-icon-zoom-default' }
				}).addClass('ui-state-disabled').click(function(event) { self.stop(); return false; })

         .addClass('box')
			.mouseover(function(){
				$(".box").fancybox({});
			})
            .click(function(event) {
            	$(".box").fancybox({
					'overlayColor'		: '#777777',
					'overlayOpacity'	: 0.9,
					'href'				: self.active_image(),
                    'padding'           : 9
				});
             })
        )
     }



        if (this.options.controls === 'zoom') {

		jq('.ui-gs-controls', context).append(
			jq('<button title="zoom"  class="ui-gs-resize zoomClass buttonZoom">Resize</button>')
				.button({
					text: false,
					icons: { primary: 'ui-icon-zoom-default' }
				}).addClass('ui-state-disabled').click(function(event)
					{
						self.stop();
						$(".zoom").attr({src: ""});
						self.changeZoomImage();
						return false;
					})
        )
						var prob = {
							'position' : 'relative',
							'z-index' : '1100'
						}
						$("ui-gs-controls button").css(prob);
     }





        if (this.options.controls === 'box') {
            var url = this.options.url + '/large.html';

            if (this.options.largeUrl) {
                url = window.location.href.split('?')[0] +
                      '?url=' + encodeURI(this.options.url) +
                      '&' + decodeURIComponent(this.options.largeUrl);
            }

				//Christopher Böhm
				//7.Feb.11
				//Den Iframe öffnen

            jq('.ui-gs-controls', context).append(
                jq('<button title=" " class="ui-gs-resize">Resize</button>')
                .button({
                    text: false,
                    icons: { primary: 'ui-icon-zoom-default' }
                }).addClass('ui-state-disabled').click(function(event) { self.stop(); return false; })

               .addClass('box')
            	.mouseover( function() {
              	$(".box").fancybox({
              		//'overlayColor'	: '#000',
              		//'overlayOpacity'	: false,
					'width'				: '90%',
					'height'			: '100%',
					'fullScale'			: false,
					'transitionIn'		: 'none',
					'transitionOut'		: 'none',
					'type'				: 'iframe',
					'href'				: url,
                    'padding'           :1
					});
              	 })
            )
        }




if (this.options.controls === 'resizeable') {
            var url = this.options.url + '/large.html';

            if (this.options.largeUrl) {
                url = window.location.href.split('?')[0] +
                      '?url=' + encodeURI(this.options.url) +
                      '&' + decodeURIComponent(this.options.largeUrl);
            }



            jq('.ui-gs-controls', context).append(
                jq('<button title="extern" class="ui-gs-resize">Resize</button>')
                .button({
                    text: false,
                    icons: { primary: 'ui-icon-zoom-default' }
                })

         .addClass('ui-state-disabled-extern')
                .click(function(event) {
                    window.open(url, '', 'type=fullWindow, fullscreen=yes, scrollbars=auto');
                })
            );
         }



        var $button = jq('.ui-gs-controls button[title=play]', context);
        this.element
        .bind('gestaltloaded', function() {
            jq('.ui-gs-controls button', context).each(function () {
                jq(this).removeClass('ui-state-disabled');
            });
        })
        .bind('gestaltstart', function() {
            $button.attr({
  title: "pause",
})
            .find('span.ui-button-icon-primary')
                .removeClass('buttonPlay').addClass('buttonPause');
        })
        .bind('gestaltstop', function() {
            $button.attr('title', 'play')
            .find('span.ui-button-icon-primary')
                .removeClass('buttonPause').addClass('buttonPlay');
        });

        var width = 0;
        jq('.ui-gs-controls button', context).each(function() {
            width += jq(this).outerWidth(true);
        });
        jq('.ui-gs-controls', context).css({width: width});
   }

});

})(window, document, window.jQuery);






