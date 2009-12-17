/*
 * 	Easy Slider 1.7.1 - jQuery plugin
 *	written by Alen Grakalic	
 *	http://cssglobe.com/post/4004/easy-slider-15-the-easiest-jquery-plugin-for-sliding
 * 
 *  forked and enhanced by Jovoto (www.jovoto.com)
 *
 *	Copyright (c) 2009 Alen Grakalic (http://cssglobe.com) (c) 2009 Jovoto.com
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */

(function($) {

	$.fn.easySlider = function(options){
	  
		// default configuration properties
		var defaults = {			
			prevId: 		    'prevBtn',
			nextId: 		    'nextBtn',	
			controlsFade:	  true,
			firstId: 		    'firstBtn',
			lastId: 		    'lastBtn',	
			vertical:		    false,
			speed: 			    800,
			auto:			      false,
			pause:			    2000,
			continuous:		  false, 
			numeric: 		    false,
			numericId:      'controls',
      scrollBy:       1,
      startAt:        0,
      visibleItems:   0
		}; 

		var options = $.extend(defaults, options);  
				
		this.each(function() {  
			var outest = $(this); 				
      var container = $('.slider-container', outest);
      container.wrap('<div class="slider-box"></div>');
      var box = $('div.slider-box', outest);

			var w = items().width(); 
			var h = items().height(); 
			var s = items().length;
      var visItemCount  = options.visibleItems || getVisItemCount();
      var scrollBy      = options.scrollBy;
      var scrollBy      = visItemCount - 1;

      var itemCss = {
        position:   'absolute',
        listStyle:  'none',
        width:      w,
        height:     h
      };

      var containerCss = {
        position: "relative",
        margin:   '0px',
        padding:  '0px'
      };

      if (!options.visibleItems) {
        $(window).resize(function(){
          visItemCount = getVisItemCount();
          scrollBy = visItemCount - 1;
          adjust();
          sizeContainers();
        });
      }
		
			var clickable = true;
      var padItemCount   = options.continuous ? visItemCount + scrollBy : 0;
			var maxPos         = options.continuous ? s : s - visItemCount;
			var curPos         = options.startAt;
      var totalItemCount = s;

      var firstItem = $(".slider-item:first-child",      box);
      var lastItem  = $(".slider-item:nth-child("+s+")", box);
			
			if(options.continuous){
        for (var i=1; i <= padItemCount; i++){
          container.prepend($(".slider-item:nth-child("+s+")",   box).clone());
          container.append( $(".slider-item:nth-child("+2*i+")", box).clone());
        }
				totalItemCount = s + 2 * visItemCount;
			};				

      container.css(containerCss);
      items().css(itemCss);

      sizeContainers();
      positionItems();

			if(options.numeric){									
				for(var i=0;i<s;i++){						
					$(document.createElement("li"))
						.attr('id',options.numericId + (i+1))
						.html('<a rel='+ i +' href=\"javascript:void(0);\">'+ (i+1) +'</a>')
						.appendTo($("#"+ options.numericId))
						.click(function(){							
							animate($("a",$(this)).attr('rel'),true);
						}); 												
				};							
			} else {
        jQuery.each(['next', 'prev', 'first', 'last'], function(i, move){
          $('#'+options[move+"Id"]).click(function(){animate(move, true)});
        });
			};

      function items(){
        return $(".slider-item", box);
      }

      function getVisItemCount(){
        return (options.vertical) 
          ? Math.floor(outest.parent().height() / h)
          : Math.floor(outest.parent().width()  / w)
      }
			
			function setCurrentNumericSwitch(i){
				i = parseInt(i)+1;
				$("li", "#" + options.numericId).removeClass("current");
				$("li#" + options.numericId + i).addClass("current");
			};
			
			function adjust(){
        // console.log(curPos+" "+maxPos);
        if (options.ajaxUrl && (curPos >= maxPos - 3 * scrollBy) && (curPos < maxPos)) {
          $('#message').text('loading new Elements');

          for(var i=0; i<scrollBy; i++) { 
            addElement(s+1); 
          }

          setTimeout(function(){
            $('#message').text('');
          },2000);
        }

        if (options.continuous) {
          if (curPos >= maxPos)  curPos =  curPos            % maxPos;		
          if (curPos < 0)        curPos = (curPos + maxPos)  % maxPos;
        }

				container.css(containerCssForPosition(curPos));

				clickable = true;

				if(options.numeric) setCurrentNumericSwitch(curPos);
			};

      function positionItems(){
        items().each(function(i){
          $(this).css(itemCssForPosition(i-padItemCount));
        });                         
      }

      function sizeContainers(){
        if (options.vertical) {
          outerCss = {width: w, height: h * visItemCount};
          container.css('height', totalItemCount * h);
        } else {
          outerCss = {width: w * visItemCount, height: h};
          container.css('width',  totalItemCount * w);
        }

        outest.css(outerCss);
        box.css($.extend( 
          {
            position: "absolute",
            clip:     "rect(0px "+(options.vertical ? w : w * s)+"px "+(options.vertical ? h * s : h)+"px 0px)",
            overflow: "hidden"
          },
          outerCss
        ));
        
      }
			
			function animate(dir,clicked){
				if (clickable){
					clickable   = false;

          curPos = parseInt(dir) || {
            'next'  : options.continuous ? curPos + scrollBy : Math.min(curPos + scrollBy, maxPos),
						'prev'  : options.continuous ? curPos - scrollBy : Math.max(curPos - scrollBy, 0),
            'first' : 0,
            'last'  : maxPos
          }[dir];

				  container.animate(
            containerCssForPosition(curPos),
						{ queue: false, duration: options.speed, complete: adjust }
					);				

          toggleControls();
					
					if(clicked) clearTimeout(timeout);

					if(options.auto && dir=="next" && !clicked){;
						timeout = setTimeout(function(){
							animate("next",false);
						}, options.speed + options.pause);
					};
			
				};
			};

      function itemCssForPosition(pos){
        return (options.vertical) ? { left: 0, top:  pos * h } : { top: 0, left:  pos * w };				
      }

      function containerCssForPosition(pos){
        return (options.vertical) ? { left: 0, top: -pos * h } : { top: 0, left: -pos * w };				
      }

      function toggleControls(){
        if(!options.continuous && options.controlsFade){					
          $("#"+options.nextId+", #"+options.lastId) [(curPos==maxPos) ? 'hide' : 'show']();
          $("#"+options.prevId+", #"+options.firstId)[(curPos==0)      ? 'hide' : 'show']();
        };				
      }

      function addElement(txt){
        var newLast   = jQuery('<div class="slider-item">'+txt+"</div>").css(itemCss);
        var newFirst  = jQuery('<div class="slider-item">'+txt+"</div>").css(itemCss);   

        lastItem.after(newLast);   
        lastItem = newLast;

        firstItem.before(newFirst); 

        s++;
        maxPos++;
        padItemCount ++;
        totalItemCount += 2;

        sizeContainers();
        positionItems();
      }

			// init
			var timeout;
			if(options.auto){;
				timeout = setTimeout(function(){
					animate("next",false);
				},options.pause);
			};		
			
      adjust();
      toggleControls();
		});
	};

})(jQuery);
