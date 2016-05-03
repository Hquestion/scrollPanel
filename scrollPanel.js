(function($){
    $.fn.scrollPanel = function(option){
        var $el = $(this);
        var dx = 0, dy = 0, mx=0, my = 0;
        var ox = 0, oy = 0;
        var currentTf = {};
        var isMouseDown = false;
        var $scrollPanel = $el.find('.scroll-panel');

        $el.css({
            'overflow': 'hidden',
            'position': 'absolute'
        });
        $scrollPanel.css({
            'transform': 'translate3d(0,0,0)'
        });
        $el.on('touchstart mousedown', function(e){
            e.preventDefault();
            e.stopPropagation();
            dx = (e.touches && e.touches[0] || e)['pageX'];
            dy = (e.touches && e.touches[0] || e)['pageY'];
            isMouseDown = true;
            currentTf = getEleTranslate($scrollPanel);
        });
        $el.on('touchmove mousemove', function(e){
            if(isMouseDown) {
                e.preventDefault();
                e.stopPropagation();
                mx = (e.touches && e.touches[0] || e)['pageX'];
                my = (e.touches && e.touches[0] || e)['pageY'];
                ox = mx - dx;
                oy = my - dy;
                translateEle($scrollPanel, {
                    x: ox,
                    y: oy
                });
                isMouseDown = true;
            }
        });

        $el.on('touchend mouseup', function(e){
            e.preventDefault();
            e.stopPropagation();
            isMouseDown = false;
            fixEdge($el, $scrollPanel);
        });

        $el.on('mouseout', function(e){
            isMouseDown = false;
            fixEdge($el, $scrollPanel);
        });

        function translateEle($el, axis) {
            disableTransition($el);
            $el.css({
                'transform': 'translate3d(' + (+currentTf.x + +axis.x) +'px, '+ (+currentTf.y + +axis.y) +'px, 0)'
            });
        }

        function getEleTranslate($el) {
            var transfromStr = $el.css('transform') || '';
            var transfromArray = transfromStr.slice(transfromStr.indexOf('(') + 1, transfromStr.length - 1).split(',');
            var tx = parseInt(transfromArray[0] || 0),
                ty = parseInt(transfromArray[1] || 0),
                tz = parseInt(transfromArray[2] || 0);
            return {
                x: tx,
                y: ty,
                z: tz
            };
        }

        function fixEdge($el, $scrollPanel) {
            var tf = getEleTranslate($scrollPanel);
            var boxWidth = $el.width(),
                panelWidth = $scrollPanel.width();
            var boxHeight = $el.height(),
                panelHeight = $scrollPanel.height();
            enableTransition($scrollPanel);
            if(tf.x > 0) {
                $scrollPanel.css({
                    'transform' : 'translate3d(0, ' + tf.y + 'px, ' + '0)'
                });
            }else if(panelWidth + tf.x < boxWidth) {
                $scrollPanel.css({
                    'transform' : 'translate3d(' + (boxWidth - panelWidth) + 'px, ' + tf.y + 'px, ' + '0)'
                });
            }
            tf = getEleTranslate($scrollPanel);
            if(tf.y > 0) {
                $scrollPanel.css({
                    'transform' : 'translate3d(' + tf.x + 'px, 0, 0)'
                });
            }else if(panelHeight + tf.y < boxHeight) {
                $scrollPanel.css({
                    'transform' : 'translate3d('+tf.x + 'px, ' + (boxHeight - panelHeight) + 'px, 0)'
                });
            }
        }

        function disableTransition($el) {
            $el.css({
                transition: 'none'
            });
        }

        function enableTransition($el) {
            $el.css({
                transition: 'all ease-in .2s'
            });
        }
    }
})(Zepto || jQuery);