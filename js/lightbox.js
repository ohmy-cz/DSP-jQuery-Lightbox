// this is a simple lightbox using CSS3 effects and inline CSS, so you don't need to load external CSS. 
// it's using jQuery.
var DSPLb = new DSPjQueryLightbox_1_0();
DSPLb.loadingAnimSrc = '/common/images/ajax-loader.gif';

$.fn.lightbox = function()
{
	return 	$(this)
				.each(function(){
					$(this)
						.click(function(){
							try{
								var trigger = $(this);
								
								DSPLb.open({
									width 	: trigger.attr('data-width'),
									height 	: trigger.attr('data-height'),
									href 	: trigger.attr('href').toString(),
									onClose : function(){
												if(typeof(trigger.attr('data-onclose')) != 'undefined' && trigger.attr('data-onclose') != '')
												{
													eval(trigger.attr('data-onclose'));
												}
											  }
								});
							} catch(e) { alert(e); }
							
							return false;
						});
				});
}

function DSPjQueryLightbox_1_0()
{
	this.bitmaps			= {
								loadingAnimSrc		: '/images/ajax-loader.gif',
								closeButtonSrc		: 'images/bigButtons.png'
							  };
	this.settings			= null;
	this.contentIframe		= {
								reference			: null,
								changeWatcherTimer 	: null,
								previousHeight		: null
							  };
	
	this.DSPLbDimmedArea		= $('<div class="dimmed" style="'+
								'-moz-opacity:0;'+
								'filter:alpha(opacity=0);'+
								'opacity:0;'+
								'width:100%;'+
								'height:100%;'+
								'position:fixed;'+
								'background-color:#000000;'+ // transparent used to work better, then stopped
								'top:0px;'+
								'left:0px;'+
								'z-index:10000;'+
						  	  '">&nbsp;</div>');
	this.lightboxWindow 	= $('<div style="'+
						 		'width:1020px;'+
								'height:90%;'+
								'margin:auto;'+
								'background-color:#ffffff;'+
								'padding:0px 0px 0px 0px !important;'+
								'-moz-border-radius:10px;'+
								'border-radius:10px;'+
								'position:fixed;'+
								'z-index:10001;'+
								'overflow:hidden;'+
								'-moz-box-shadow: 0px 5px 20px rgba(0,0,0,0.5);'+
								'-webkit-box-shadow: 0px 5px 20px rgba(0,0,0,0.5);'+
								'box-shadow: 0px 5px 20px rgba(0,0,0,0.5);'+
						  	  '">'+
							  	'<div id="topBar" style="'+
									'width:100%;'+
									'height:30px;'+
									'background-color:#4a4749;'+
									'-moz-border-radius-topright:10px;'+
									'border-top-right-radius:10px;'+
									'-moz-border-radius-topleft:10px;'+
									'border-top-left-radius:10px;'+
									'background: -webkit-gradient(linear, left top, left bottom, from(#777777), to(#4a4749));'+
									'background: -moz-linear-gradient(top,  #777777,  #4a4749);'+
									'filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#777777\', endColorstr=\'#4a4749\')'+
								'">'+
									'<h1 style="color:#ffffff;font-size:14px;font-weight:normal;font-family:Arial;float:left;margin:0px;padding:3px 0px 0px 10px;">Please wait...</h1>'+
									'<a href="#" id="close" class="tinyButtons remove" style="'+
										'outline:0px;'+
										'display:block;'+
										'width:21px;'+
										'height:20px;'+
										'background-image:url('+this.bitmaps.closeButtonSrc+');'+
										'background-repeat:no-repeat;'+
										'background-position:0px 0px;'+
										'float:right;'+
										'margin-top:5px;'+
										'margin-right:5px;'+
										'position:relative;'+
										'text-indent:-1000px;'+
										'overflow:hidden;'+
									'">Close</a>'+
								'</div>'+
								'<iframe src="" width="100%" height="100%" frameborder="0" scrolling="none" style="'+
									'overflow:auto;'+
									'overflow-x:hidden;'+
								'"></iframe>'+
							  '</div>');
	
	
	this._addLoadingAnimation = function()
	{
		var horizontalCenter = (this.lightboxWindow.width()-16)/2;
		var verticalCenter = (this.lightboxWindow.height()-32)/2;
		this.lightboxWindow.find('iframe').before('<img id="DSPLightboxLoading" src="'+this.bitmaps.loadingAnimSrc+'" width="16" height="16" align="center" alt="Loading..." style="position:absolute;left:'+horizontalCenter+'px;top:'+verticalCenter+'px"/>');
	}
	
	this._removeLoadingAnimation = function()
	{
		$('#DSPLightboxLoading').remove();
	}
	
	this.open = function(settings)
	{
		var thisObj = this;
		this.settings = settings;
		
		if(typeof(this.settings) != 'undefined')
		{
			if(typeof(this.settings.href) != 'undefined' && this.settings.href != '' && this.settings.href.substr(0, 1) != '#' && this.settings.href != null)
			{
				if(typeof(this.settings.height) == 'undefined' || this.settings.height == null || this.settings.height == '')
				{
					this.settings.height = this.getActualViewportHeight()*0.9;
					$(window).resize(function(){thisObj.lightboxWindow.css('height', (thisObj.getActualViewportHeight()*0.9)+'px');});
				}
				
				if(typeof(this.settings.width) != 'undefined' && this.settings.width != null && this.settings.width != '')
				{
					this.lightboxWindow.css('width', this.settings.width);
				}
				if(typeof(this.settings.height) != 'undefined' && this.settings.height != null && this.settings.height != '')
				{
					this.lightboxWindow.css('height', this.settings.height);
				}
				
				this.alignLightboxToCenterOnResize();
				this._addLoadingAnimation();
				
				// set lightboxmode flag, so the target document knows it's loaded from within an iframe
				var contentSrc = thisObj.settings.href;
				if(contentSrc.indexOf('?') == -1)
				{
					contentSrc+='?lightboxmode=1';
				} else {
					contentSrc+='&lightboxmode=1';
				}
				
				$('body').prepend(this.DSPLbDimmedArea.hide());
				
				$('body')
					.prepend(
						this.lightboxWindow
							.css('top', ((thisObj.settings.height*1.1)*-1)+'px')
							.find('iframe')
								.attr('src', contentSrc)
								.load(function(){
									// if it's a local page, we can measure it's size and set the lightbox accordingly
									if($(this).attr('src').indexOf(window.location.hostname) != -1)
									{
										thisObj._removeLoadingAnimation();
										thisObj.contentIframe.reference = $(this.contentWindow.document.body);
										try{
											var contentTitle = $(this.contentWindow.document.head).find('title').text();
											thisObj.lightboxWindow.find('h1').text(contentTitle);
										} catch(e) {
										}
										
										try{
											// this should fix floating issue in some pages; if not used and the page with floating elements isn't properly closed with this kind of CSS, the measurement will be inaccurate.
											thisObj.contentIframe.reference.append('<div style="clear:both;"></div>');
										} catch(e) {
										}
										
										thisObj.startIframeChangeWatcher();
										$(window).unbind('resize');
										thisObj.alignLightboxToCenterOnResize();
									}
								})
							.end()
					);
					
					this.DSPLbDimmedArea
						.css('opacity', '0')
						.show()
						.animate({opacity:0.5,backgroundColor:'#000000'}, 'slow', function(){
							var leftOffset = (thisObj.getActualViewportWidth()-thisObj.lightboxWindow.width())/2;
							thisObj.lightboxWindow
								.css('left', (leftOffset > 0) ? leftOffset : '0px')
								.animate({top:'30px'}, 'slow');
						}
					);
					
				// dimmed area behavior -> when clicked, it will close the window.
				this.DSPLbDimmedArea
					.click(function(){
						thisObj.close();
						return false;
					});
					
				// close button behavior	
				this.lightboxWindow
					.find('#close')
						.click(function(){
							thisObj.close();
							return false;
						});
			} else {
				alert('DSPLightbox error: href attribute not specified');
			}
		} else {
			alert('DSPLightbox error: no settings specified');
		}
	}
	
	this.startIframeChangeWatcher = function()
	{
		var thisObj = this;
			
		if(this.contentIframe.reference != null && this.contentIframe.reference != 'undefined')
		{
			var contentHeight = this.contentIframe.reference.height()+parseInt(this.contentIframe.reference.css('padding-top'))+parseInt(this.contentIframe.reference.css('padding-bottom'));
			var topBarHeight = this.lightboxWindow.find('#topBar').height()
			
			console.log(contentHeight,topBarHeight);
			var heightToSet = (contentHeight+topBarHeight);
			console.log(heightToSet);
			
			if(this.contentIframe.reference.height() != this.contentIframe.previousHeight && heightToSet < this.getActualViewportHeight())
			{
				this.lightboxWindow.css('height', heightToSet+'px');
				this.contentIframe.previousHeight = this.contentIframe.reference.height();
			}
			
			this.contentIframe.changeWatcherTimer = setTimeout(function(){thisObj.startIframeChangeWatcher()}, 500);
		}
	}
	
	this.alignLightboxToCenterOnResize = function()
	{
		var thisObj = this;
		$(window)
			.resize(function(){
				var leftOffset = (thisObj.getActualViewportWidth()-thisObj.lightboxWindow.width())/2;
				thisObj.lightboxWindow.css('left', (leftOffset > 0) ? leftOffset : '0px');
			});
	}
	
	this.stopIframeChangeWatcher = function()
	{
		if(typeof(this.contentIframe.changeWatcherTimer) != 'undefined')
		{
			clearTimeout(this.contentIframe.changeWatcherTimer);
		}
		this.contentIframe.changeWatcherTimer = null;
		this.contentIframe.reference = null;
		this.contentIframe.previousHeight = null;
	}
	
	this.close = function()
	{
		var thisObj = this; 
		
		if(typeof(this.settings) != 'undefined' && typeof(this.settings.onClose) != 'undefined')
		{
			this.settings.onClose();
		}
		
		this.lightboxWindow
			.animate({top:this.lightboxWindow.height()*-1}, 'slow', function(){
				$(this).remove();
				thisObj.DSPLbDimmedArea.fadeOut('slow', function(){$(this).remove()});
				
				if(typeof(thisObj.settings.callback) == 'function')
				{
					thisObj.settings.callback();
				}
			});
			
		this.stopIframeChangeWatcher();
	}
	
	this.getActualViewportHeight = function()
	{
		return window.innerHeight ? window.innerHeight : $(window).height();
	}
	
	this.getActualViewportWidth = function()
	{
		return window.innerWidth ? window.innerWidth : $(window).width();
	}
}

if(typeof($) == 'undefined')
{
	alert('DSPLightbox error: The lightbox requires jQuery library.');
} else {
	$(function(){
		$('.lightbox').lightbox();
	});
}