/*!
 * Surge Slider;
 * version: 1.0.0
 * http://naashdev.net
 * Copyright (c) 2016 N. Talbot; Dual licensed: MIT/GPL
 */

(function($) {

    var surgeSlider = {

        /* --------------------------------
         | Init
         * ------------------------------*/
        init: function(options, el) {
            var self = this;
            self.main = {
                $el: $(el)
            };
            self.id = 'surge_slider_' + (Math.random().toString(16).substring(2));
            self.options = $.extend($.fn.surgeSlider.options, options);

            // Core CSS
            slider_css = {
                'width': '715%',
                'position': 'relative',
                'margin': '0',
                'padding': '0',
                'transition-timing-function': self.options.animation_function,
                'transition-duration': self.options.animation_timing + 's',
                'transform': 'translate3d(0px, 0px, 0px)'
            };

            items_css = {
                'float': 'left',
                'list-style': 'none',
                'overflow': 'hidden',
                'position': 'relative',
            };

            view_css = {
                'width': '100%',
                'overflow': 'hidden',
                'position': 'relative',
            };

            // Define thumbs instance
            self.thumbs = {
                $el: $(options.thumb),
            };

            // Create main & thumbnail slider in dom
            self.create_slider();
            if (self.thumbs.$el) self.create_slider(true);
            if (self.options.pager) self.create_pager();

            // Bind Events
            self.bind();


        },

        /* --------------------------------
         | Create Slider
         * ------------------------------*/
        create_slider: function(is_thumbs) {
            var self = this;

            var _self = (!is_thumbs) ? self.main : self.thumbs;

            _self.$el.wrap(function() {
                return "<div class='surge-wrapper'><div class='surge-viewport'></div></div>";
            });

            // Set start position
            _self.$el.attr('data-current-slide', 1).css(slider_css);

            // Cache elems
            _self.elems = {
                $wrap: _self.$el.parent().parent(),
                $view: _self.$el.parent(),
                $items: _self.$el.children(),
            };

            if (!is_thumbs) _self.elems.$wrap.attr('data-slider-id', self.id);

            $.each(_self.elems.$items, function(i){
                $(this).attr('data-slide', i + 1);
            });

            // Set css
            self.set_css(_self, is_thumbs);

        },

        /* --------------------------------
         | Create Pager
         * ------------------------------*/
        create_pager: function() {
            var self = this;

            self.$pager = $(self.options.pager);

            $.each(self.main.elems.$items, function(i) {
                var html = $(self.options.pager_template);
                self.$pager.append(html);
                html.attr('data-slide', i + 1);
                if (!i) html.addClass(self.options.active_class);
            });


        },

        /* --------------------------------
         | Change State
         * ------------------------------*/
        change_state: function(position, direction){
            var self = this;

            if (typeof direction == 'undefined') var direction = 0;
            var i = (position) ? position : self.main.$el.data('current-slide') + direction;

            var in_length = (i <= self.main.elems.$items.length && i >= 1) ? true : false;

            if (in_length) {
                self.main.$el.attr('data-current-slide', i).data('current-slide', i);
                if (self.options.thumb) self.thumbs.$el.attr('data-current-slide', i).data('current-slide', i);
                var $pag = self.$pager.find('.' + self.options.pager_class + ':nth-child(' + i +')');
                self.$pager.find('.' + self.options.pager_class).not($pag).removeClass(self.options.active_class);
                $pag.addClass(self.options.active_class);
                self.set_position(i, self.main);
                self.set_position(i, self.thumbs, true)
            }
        },

        /* --------------------------------
         | Set Position
         * ------------------------------*/
        set_position: function(position, obj, is_thumbs, no_transition){
            var self = this;

            var _self = obj,
                i = position - 1,
                thumb_offset = (position > self.options.thumb_show) ? position - self.options.thumb_show : 0,
                offset = (is_thumbs) ? thumb_offset : i;

            if (typeof no_transition == 'undefined') var no_transition = false;
            if (no_transition) {
                _self.$el.css({'transition-duration': '0s'});
            } else {
                _self.$el.css({'transition-duration': slider_css['transition-duration'] });
            }
            if (is_thumbs) {
                var val = (position > self.options.thumb_show) ? ( (_self.elems.$items.width() + self.options.thumb_gutter) * offset) : 0;
            } else {
                var val = _self.elems.$items.width() * offset;
            }

            _self.$el.css({'transform': 'translate3d(-'+ val +'px, 0px, 0px)'});

        },

        /* --------------------------------
         | Set CSS
         * ------------------------------*/
        set_css: function(obj, is_thumbs) {
            var self = this;

            var _self = obj;

            _self.$el.css(slider_css);
            _self.elems.$view.css(view_css);
            _self.elems.$items.css(items_css);

            // Add optional gutter for thumbnails
            if (is_thumbs && self.options.thumb_gutter) _self.elems.$items.css({'margin-right': self.options.thumb_gutter});

            // Set dynamic width & height
            self.set_width(_self, is_thumbs);
            self.set_height(_self, is_thumbs);

        },

        /* --------------------------------
         | Set Width
         * ------------------------------*/
        set_width: function(obj, is_thumbs) {
            var self = this;

            var _self = obj,
                view_w = _self.elems.$view.width(),
                show = self.options.thumb_show,
                gutter = self.options.thumb_gutter;

            var width = (is_thumbs) ? (view_w - gutter * (show - 1) ) / show : view_w;

            _self.elems.$items.css({'width': width});

        },

        /* --------------------------------
         | Set Height
         * ------------------------------*/
        set_height: function(obj, is_thumbs) {
            var self = this;

            var _self = obj;

            _self.elems.$view.css({'height': _self.elems.$items.height() });

        },

        /* --------------------------------
         | Bind Events
         * ------------------------------*/
        bind: function() {
            var self = this;

            // Next & Prev events
            self.main.$el.on('surge-slider-next', function(){
                self.change_state(false, 1);
            });

            self.main.$el.on('surge-slider-prev', function(){
                self.change_state(false, -1);
            });

            if (self.options.thumb) {
                self.thumbs.elems.$items.find('a').on('click', function(e) {
                    e.preventDefault();
                    self.change_state($(this).parent().data('slide'));
                });
            }

            if (self.options.pager) {
                self.$pager.find('a').on('click', function(e) {
                    e.preventDefault();
                    self.change_state($(this).data('slide'));
                });
            }

        }

    };

    $.fn.surgeSlider = function(options) {
        return this.each(function() {
            var surge_slider = Object.create(surgeSlider);
            surge_slider.init(options, this);
        });
    };

    /* --------------------------------------------------------------------------
     * Defaults
     * ------------------------------------------------------------------------*/
    $.fn.surgeSlider.options = {
        animation_timing: .9,
        animation_function: 'cubic-bezier(0.77, 0, 0.175, 1)',
        thumb: false,
        thumb_show: 4,
        thumb_gutter: 0,
        pager: false,
        pager_template: '<a href="#" class="pager"></a>',
        pager_class: 'pager',
        active_class: 'active',
    };

}(jQuery, window, document));
