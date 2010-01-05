/*
 *  jovoSlider 0.8 - jQuery plugin
 *  written by Alexander Presber / jovoto.com
 *
 *  Copyright (c) 2009 Jovoto.com
 *  Dual licensed under the MIT (MIT-LICENSE.txt)
 *  and GPL (GPL-LICENSE.txt) licenses.
 *
 *  Built for jQuery library
 *  http://jquery.com
 *
 */

(function($) {

  $.fn.jovoSlider = function(options){
    
    // default configuration properties
    var defaults = {      
      prevId:         'prevBtn',
      nextId:         'nextBtn',  
      controlsFade:   true,
      firstId:        'firstBtn',
      lastId:         'lastBtn',  
      vertical:       false,
      duration:       800,
      auto:           false,
      pause:          2000,
      continuous:     false, 
      numeric:        false,
      numericId:      'controls',
      scrollBy:       0,
      scrollPosition: 0,
      visibleItems:   0,
      loadPosition:   0,
      currentClass:   ''
    }; 

    var options = $.extend(defaults, options);  
        
    this.each(function() {  
      var loading = false;
      var outest = $(this);         
      var container = $('.slider-container', outest);
      // if (!container.length) alert('no container element with class "slider-container" found'); 
      container.wrap('<div class="slider-box"></div>');
      var box = $('div.slider-box', outest);
      // if (!box.length) alert('no box element with class "slider-box" found'); 

      var w = items().width(); 
      var h = items().height(); 
      var s = items().length;
      var visItemCount  = options.visibleItems || getVisItemCount();
      var scrollBy      = options.scrollBy || visItemCount - 1;
      var loadPos       = options.loadPosition;

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
          visItemCount  = getVisItemCount();
          scrollBy      = visItemCount - 1;
          maxPos        = options.continuous ? s - 2 : s - visItemCount;
          adjust();
          sizeContainers();
          toggleControls();
        });
      }

    
      var clickable       = true;
      var leftOffset      = options.continuous ? scrollBy + options.scrollPosition : 0;
      var leftPadding     = leftOffset;
      var rightPadding    = leftOffset;
      var maxPos          = options.continuous ? s - 2 : s - visItemCount;
      var minPos          = 0;

      var currentIndex = 0;
      if (options.currentClass) {
        var currentItem = 
        currentIndex = Math.max(minPos, Math.min(maxPos,  items().index(items().filter('.'+options.currentClass)) - Math.floor(scrollBy/2)));
      }

      var curPos          = options.scrollPosition || currentIndex;
      var totalItemCount = s;

      var firstItem = $(".slider-item:first-child",      box);
      var lastItem  = $(".slider-item:nth-child("+s+")", box);

      if(options.continuous){
        // console.log('adding '+leftOffset+' elements on both sides');
        for (var i=1; i <= leftOffset; i++){
          container.prepend($(".slider-item:nth-child("+s+")",   box).clone());
          container.append( $(".slider-item:nth-child("+2*i+")", box).clone());
        }
        totalItemCount = s + 2 * visItemCount;
      };        

      firstItem.addClass('first');
      lastItem.addClass('last');

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
        // console.log('>> '+minPos+" "+curPos+" "+maxPos+" "+s);
        if (options.continuous) {
               if (curPos >= maxPos)  curPos -= s;    
          else if (curPos < minPos )  curPos += s;
        }
        // console.log('<< '+minPos+" "+curPos+" "+maxPos);

        container.css(containerCssForPosition(curPos));

        clickable = true;

        if(options.numeric) setCurrentNumericSwitch(curPos);
      };

      function positionItems(){
        items().each(function(i){
          $(this).css(itemCssForPosition(i-leftOffset));
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
      
      function animate(dir, clicked){
        // console.log("animate: "+dir+" "+clicked);
        if (clickable){
          clickable   = false;

          if (options.ajaxUrl) {
            if (dir=='next' && (curPos >= maxPos - 3*scrollBy)) {
              addAjaxItems('end', loadPos+s, loadPos + s + 3*scrollBy + 1);
            } 
            if (dir=='prev' && (curPos <= 3*scrollBy)) {
              addAjaxItems('start', loadPos - 3*scrollBy - 1, loadPos);
            }
          }

          curPos = parseInt(dir) || {
            'next'  : options.continuous ? curPos + scrollBy : Math.min(curPos + scrollBy, maxPos),
            'prev'  : options.continuous ? curPos - scrollBy : Math.max(curPos - scrollBy, minPos),
            'first' : minPos,
            'last'  : maxPos
          }[dir];

          container.animate(
            containerCssForPosition(curPos),
            { queue: false, duration: options.duration, complete: adjust }
          );        

          toggleControls();
          
          if(clicked) clearTimeout(timeout);

          if(options.auto && dir=="next" && !clicked){;
            timeout = setTimeout(function(){
              animate("next",false);
            }, options.duration + options.pause);
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
          $("#"+options.nextId+", #"+options.lastId) [(curPos>=maxPos) ? 'hide' : 'show']();
          $("#"+options.prevId+", #"+options.firstId)[(curPos<=minPos) ? 'hide' : 'show']();
        };        
      }

      function addAjaxItems(position, from, to) {
        if (loading) return;
        loading = true;
        $.ajax({
          url: options.ajaxUrl, 
          data: {
            from: from,
            to:   to
          },
          success: function(res){
            var html = $.trim(res);
            if (!html) return;
            var snippet = $(html).filter('div');
            var length = snippet.size();

            s               += length;
            totalItemCount  += length;

            if (position == 'start') {
              firstItem.before(snippet);   
              if (options.continuous){
                lastItem.after(snippet);   
                totalItemCount  += length;
              }
              leftOffset += length;
              loadPos    -= length;
              firstItem = $(".slider-item:nth-child("+(leftPadding+1)+")", box); 
              minPos -= length;
              // console.log('new minPos:'+minPos);
            } else {
              lastItem.after(snippet);   
              if (options.continuous){
                firstItem.before(snippet);   
                totalItemCount += length;
                leftPadding    += length;
                leftOffset     += length;
              }
              lastItem = $(".slider-item:nth-child("+(leftPadding+s)+")", box);
              maxPos += length;
              // console.log('new maxPos:'+maxPos);
            }

            items().removeClass('first last')
            firstItem.addClass('first');
            lastItem.addClass('last');

            items().css(itemCss);

            sizeContainers();
            positionItems();
            toggleControls();
            loading = false;
          }    
        });
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
