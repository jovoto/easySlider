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
 
/*
 *	markup example for $("#slider").easySlider();
 *	
 * 	<div id="slider">
 *		<ul>
 *			<li><img src="images/01.jpg" alt="" /></li>
 *			<li><img src="images/02.jpg" alt="" /></li>
 *			<li><img src="images/03.jpg" alt="" /></li>
 *			<li><img src="images/04.jpg" alt="" /></li>
 *			<li><img src="images/05.jpg" alt="" /></li>
 *		</ul>
 *	</div>
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
			var container = $(this); 				
      $('ul', obj).wrap('<div></div>');
      var obj = $('div', container);

			var w = $("li", obj).width(); 
			var h = $("li", obj).height(); 
			var s = $("li", obj).length;
      var visItemCount  = options.visibleItems || getVisItemCount();
      var scrollBy      = options.scrollBy;
      var scrollBy      = visItemCount - 1;

      var liCss = {
        position:   'absolute',
        listStyle:  'none',
        width:      w,
        height:     h
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

      var firstItem = $("ul li:first-child");
      var lastItem  = $("ul li:nth-child("+s+")");
			
			if(options.continuous){
        for (var i=1; i <= padItemCount; i++){
          $("ul", obj).prepend($("ul li:nth-child("+s+")",   obj).clone());
          $("ul", obj).append( $("ul li:nth-child("+2*i+")", obj).clone());
        }
				totalItemCount = s + 2 * visItemCount;
			};				

      $("ul", obj).css({ 
        position: "relative",
        margin:   '0px',
        padding:  '0px'
      });
      $("li", obj).css(liCss);

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
				$("#"+options.nextId).click(function(){		
					animate("next",true);
				});
				$("#"+options.prevId).click(function(){		
					animate("prev",true);				
				});	
				$("#"+options.firstId).click(function(){		
					animate("first",true);
				});				
				$("#"+options.lastId).click(function(){		
					animate("last",true);				
				});				
			};

      function getVisItemCount(){
        return (options.vertical) 
          ? Math.floor(container.parent().height() / h)
          : Math.floor(container.parent().width()  / w)
      }
			
			function setCurrentNumericSwitch(i){
				i = parseInt(i)+1;
				$("li", "#" + options.numericId).removeClass("current");
				$("li#" + options.numericId + i).addClass("current");
			};
			
			function adjust(){
        console.log(curPos+" "+maxPos);
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

				$("ul", obj).css(ulCssForPosition(curPos));

				clickable = true;

				if(options.numeric) setCurrentNumericSwitch(curPos);
			};

      function positionItems(){
        $("li", obj).each(function(i){
          $(this).css(liCssForPosition(i-padItemCount));
        });                         
      }

      function sizeContainers(){
        if (options.vertical) {
          container.width(w); 
          container.height(h * visItemCount); 
          obj.width(w); 
          obj.height(h * visItemCount); 
          $("ul", obj).css('height', totalItemCount * h);
        } else {
          container.width(w* visItemCount);
          container.height(h);
          obj.width(w *visItemCount); 
          obj.height(h); 
          $("ul", obj).css('width',  totalItemCount * w);
        }
        obj.css({
          position: "absolute",
          clip:     "rect(0px "+(options.vertical ? w : w * s)+"px "+(options.vertical ? h * s : h)+"px 0px)",
          overflow: "hidden"
        });
        
      }
			
			function animate(dir,clicked){
				if (clickable){
					clickable   = false;
					var oldPos  = curPos;				

					switch(dir){
						case "next":
							curPos = options.continuous ? curPos + scrollBy : Math.min(curPos + scrollBy, maxPos);
							break; 
						case "prev":
							curPos = options.continuous ? curPos - scrollBy : Math.max(curPos - scrollBy, 0);
							break; 
						case "first":
							curPos = 0;
							break; 
						case "last":
							curPos = maxPos;
							break; 
						default:
							curPos = dir;
							break; 
					};	
					var diff  = Math.abs(oldPos-curPos);
					var speed = options.speed;						

				  $("ul",obj).animate(
            ulCssForPosition(curPos),
						{ queue:false, duration:speed, complete:adjust }
					);				

          toggleControls();
					
					if(clicked) clearTimeout(timeout);

					if(options.auto && dir=="next" && !clicked){;
						timeout = setTimeout(function(){
							animate("next",false);
						},speed+options.pause);
					};
			
				};
			};

      function liCssForPosition(pos){
        return (options.vertical) ? { left: 0, top:  pos * h } : { top: 0, left:  pos * w };				
      }

      function ulCssForPosition(pos){
        return (options.vertical) ? { left: 0, top: -pos * h } : { top: 0, left: -pos * w };				
      }

      function toggleControls(){
        if(!options.continuous && options.controlsFade){					
          if(curPos==(maxPos)){
            $("#"+options.nextId).hide();
            $("#"+options.lastId).hide();
          } else {
            $("#"+options.nextId).show();
            $("#"+options.lastId).show();					
          };
          if(curPos==0){
            $("#"+options.prevId).hide();
            $("#"+options.firstId).hide();
          } else {
            $("#"+options.prevId).show();
            $("#"+options.firstId).show();
          };					
        };				
      }

      function addElement(txt){
        var newLast   = jQuery("<li>"+txt+"</li>").css(liCss);
        var newFirst  = jQuery("<li>"+txt+"</li>").css(liCss);   

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
