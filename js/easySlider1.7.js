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
			prevText: 		  'Previous',
			nextId: 		    'nextBtn',	
			nextText: 		  'Next',
			controlsShow:	  true,
			controlsBefore:	'',
			controlsAfter:	'',	
			controlsFade:	  true,
			firstId: 		    'firstBtn',
			firstText: 		  'First',
			firstShow:		  false,
			lastId: 		    'lastBtn',	
			lastText: 		  'Last',
			lastShow:		    false,				
			vertical:		    false,
			speed: 			    800,
			auto:			      false,
			pause:			    2000,
			continuous:		  false, 
			numeric: 		    false,
			numericId:      'controls',
      itemCount:      1,
      scrollBy:       1,
      startAt:        0
		}; 

		var options = $.extend(defaults, options);  
				
		this.each(function() {  
			var container = $(this); 				
      $('ul', obj).wrap('<div></div>');
      var obj = $('div', container);

			var w = $("li", obj).width(); 
			var h = $("li", obj).height(); 
			var s = $("li", obj).length;

      var liCss = {
        position:   'absolute',
        listStyle:  'none',
        width:      w,
        height:     h
      };
		
			var clickable = true;
      var padItemCount   = options.continuous ? options.itemCount + options.scrollBy : 0;
			var maxPos         = options.continuous ? s : s - options.itemCount;
			var curPos         = options.startAt;
      var totalItemCount = s;

      console.log(s+" "+padItemCount+" "+maxPos);
      
      var firstItem = $("ul li:first-child");
      var lastItem  = $("ul li:nth-child("+s+")");
			
			if(options.continuous){
        for (var i=1; i <= padItemCount; i++){
          $("ul", obj).prepend($("ul li:nth-child("+s+")",   obj).clone());
          $("ul", obj).append( $("ul li:nth-child("+2*i+")", obj).clone());
        }
				totalItemCount = s + 2 * options.itemCount;
			};				

      $("ul", obj).css({ position: "relative"});
      $("li", obj).css(liCss);

      sizeContainers();
      positionLis();

      obj.css({
		    position: "absolute",
        clip:     "rect(0px "+(options.vertical ? w : w * s)+"px "+(options.vertical ? h * s : h)+"px 0px)",
        overflow: "hidden"
      });
								
			if(options.controlsShow){
				var html = options.controlsBefore;				
				if(options.numeric){
					html += '<ol id="'+ options.numericId +'"></ol>';
				} else {
					if(options.firstShow) html += '<span id="'+ options.firstId +'"><a href=\"javascript:void(0);\">'+ options.firstText +'</a></span>';
					html += ' <span id="'+ options.prevId +'"><a href=\"javascript:void(0);\">'+ options.prevText +'</a></span>';
					html += ' <span id="'+ options.nextId +'"><a href=\"javascript:void(0);\">'+ options.nextText +'</a></span>';
					if(options.lastShow) html += ' <span id="'+ options.lastId +'"><a href=\"javascript:void(0);\">'+ options.lastText +'</a></span>';				
				};
				
				html += options.controlsAfter;						
				$(obj).after(html);										
			};
			
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
				$("a","#"+options.nextId).click(function(){		
					animate("next",true);
				});
				$("a","#"+options.prevId).click(function(){		
					animate("prev",true);				
				});	
				$("a","#"+options.firstId).click(function(){		
					animate("first",true);
				});				
				$("a","#"+options.lastId).click(function(){		
					animate("last",true);				
				});				
			};
  
			
			function setCurrent(i){
				i = parseInt(i)+1;
				$("li", "#" + options.numericId).removeClass("current");
				$("li#" + options.numericId + i).addClass("current");
			};
			
			function adjust(){
        if (options.continuous) {
          if (curPos >= maxPos)  curPos =  curPos            % maxPos;		
          if (curPos < 0)        curPos = (curPos + maxPos)  % maxPos;
        }

				$("ul", obj).css(ulCssForPosition(curPos));

				clickable = true;
				if(options.numeric) setCurrent(curPos);
        console.log(">>> "+curPos);
			};

      function positionLis(){
        $("li", obj).each(function(i){
          $(this).css(liCssForPosition(i-padItemCount));
        });                         
      }

      function sizeContainers(){
        if (options.vertical) {
          container.width(w); 
          container.height(h * options.itemCount); 
          obj.width(w); 
          obj.height(h * options.itemCount); 
          $("ul", obj).css('height', totalItemCount * h);
        } else {
          container.width(w* options.itemCount);
          container.height(h);
          obj.width(w * options.itemCount); 
          obj.height(h); 
          $("ul", obj).css('width',  totalItemCount * w);
        }
      }
			
			function animate(dir,clicked){
				if (clickable){
					clickable   = false;
					var oldPos  = curPos;				

					switch(dir){
						case "next":
							curPos = options.continuous ? curPos+options.scrollBy : Math.min(curPos+options.scrollBy, maxPos);
							break; 
						case "prev":
							curPos = options.continuous ? curPos-options.scrollBy : Math.max(curPos-options.scrollBy, 0);
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
					
					if(!options.continuous && options.controlsFade){					
						if(curPos==(maxPos)){
							$("a","#"+options.nextId).hide();
							$("a","#"+options.lastId).hide();
						} else {
							$("a","#"+options.nextId).show();
							$("a","#"+options.lastId).show();					
						};
						if(curPos==0){
							$("a","#"+options.prevId).hide();
							$("a","#"+options.firstId).hide();
						} else {
							$("a","#"+options.prevId).show();
							$("a","#"+options.firstId).show();
						};					
					};				
					
					if(clicked) clearTimeout(timeout);

					if(options.auto && dir=="next" && !clicked){;
						timeout = setTimeout(function(){
							animate("next",false);
						},speed+options.pause);
					};
			
				};
			};

      function liCssForPosition(pos){
        return (options.vertical) ? { top:  pos * h } : { left:  pos * w };				
      }

      function ulCssForPosition(pos){
        return (options.vertical) ? { top: -pos * h } : { left: -pos * w };				
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
        positionLis();
      }

			// init
			var timeout;
			if(options.auto){;
				timeout = setTimeout(function(){
					animate("next",false);
				},options.pause);
			};		
			
			if(!options.continuous && options.controlsFade){					
				$("a","#"+options.prevId).hide();
				$("a","#"+options.firstId).hide();				
			};

      adjust();

      $('#adder').click(function(){
        addElement(s+1);
      });

		});
	};

})(jQuery);
