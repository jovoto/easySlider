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
			var obj = $(this); 				
			var w = $("li", obj).width(); 
			var h = $("li", obj).height(); 
			var s = $("li", obj).length;
			var clickable = true;
			var maxPos = options.continuous ? s-1 : s-options.itemCount;
			var curPos = options.startAt;
      var totalItemCount = s;
      
      var firstItem = $("ul li:first-child");
      var lastItem  = $("ul li:nth-child("+s+")");
      var padItemCount = Math.max(options.itemCount, options.scrollBy) + options.startAt;
			
			if(options.continuous){
        for (var i=1; i <= padItemCount; i++){
          $("ul", obj).prepend($("ul li:nth-child("+s+")",   obj).clone().css(
            options.vertical ? { position: "absolute", top : - i * h } : { marginLeft : - i * w } 
          ));
          $("ul", obj).append( $("ul li:nth-child("+2*i+")", obj).clone());
        }
				totalItemCount = s + 2 * options.itemCount;
			};				

      if (options.vertical) {
        $("ul", obj).css('height', totalItemCount * h);
			  obj.width(w); 
			  obj.height(h * options.itemCount); 
      } else {
        $("ul", obj).css('width',  totalItemCount * w);
			  obj.width(w * options.itemCount); 
			  obj.height(h); 
			  $("li", obj).css('float','left');
      }

			obj.css(          { overflow: "hidden", });
      $("ul", obj).css( { position: "relative"});
								
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
				if (curPos >= maxPos)  curPos =  curPos            % maxPos - 1;		
				if (curPos < 0)        curPos = (curPos + maxPos)  % maxPos + 1;

				$("ul", obj).css(cssForPosition(curPos));

				clickable = true;
				if(options.numeric) setCurrent(curPos);
			};
			
			function animate(dir,clicked){
				if (clickable){
					clickable   = false;
					var oldPos  = curPos;				

					switch(dir){
						case "next":
							curPos = options.continuous ? curPos+options.scrollBy : maxPos;
							break; 
						case "prev":
							curPos = options.continuous ? curPos-options.scrollBy : 0;
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
            cssForPosition(curPos),
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

      function cssForPosition(pos){
        return (options.vertical) 
          ? { marginTop:  - pos * h }
          : { marginLeft: - pos * w };				
      }

      function addElement(txt){
        if (options.continuous) {
          $('ul li', obj).slice(0,padItemCount).each(function(i){
            $(this).css(cssForPosition(padItemCount-i+1));
          });
        }

        var newLast   = jQuery("<li style='float:left;'>"+txt+"</li>");
        var newFirst  = jQuery("<li style='float:left; margin-left: -"+w+"px;'>"+txt+"</li>");   

        lastItem.after(newLast);   
        lastItem = newLast;

        firstItem.before(newFirst); 

        s++;
        maxPos++;
        padItemCount ++;
        totalItemCount += 2;

        if (options.vertical) {
          $("ul", obj).css('height', totalItemCount * h);
          obj.width(w); 
          obj.height(h * options.itemCount); 
        } else {
          $("ul", obj).css('width',  totalItemCount * w);
          obj.width(w * options.itemCount); 
          obj.height(h); 
          $("li", obj).css('float','left');
        }

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
