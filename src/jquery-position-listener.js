/**
 * @fileoverview jquery-position-listener
 * @author ryosuke.tsuji
 * @version 1.0.0
 */

/**
 * The jQuery plugin namespace.
 * @external "jQuery.fn"
 */

(function($) {
    'use strict';
    var scrollHandler,
        positionManager,
        raf = window.requestAnimationFrame || window.webkitAnimationFrame || window.mozAnimationFrame || window.oAnimationFrame || function(callback) {
            setTimeout(function() {
                callback();
            }, 1000 / 60);
        },
        $window = $(window);

    scrollHandler = {
        init: function() {
            $window.on('resize', $.proxy(this.handleResize, this));
            $window.on('scroll', $.proxy(this.handleScroll, this));

            setTimeout(function() {
                $window.trigger('position-listener-scroll');
            }, 1000 / 60);
        },
        handleResize: function() {
            var that = this,
                args = arguments;

            raf(function() {
                that.handleScroll.apply(that, args);
            });
        },
        handleScroll: function() {
            $window.trigger('position-listener-scroll');
        }
    };

    positionManager = {
        listenerIds: [],
        listeners: {},
        addPositionListener: function(options) {
            this.listenerIds.push(options.id);
            this.listeners[options.id] = {
                isElementIn: false,
                triggerPosition: options.triggerPosition,
                element: options.element,
                listener: options.listener,
                once: options.once
            };
        },
        removePositionListener: function(id) {
            var index = $.inArray(id, this.listenerIds);

            this.listeners[id] = null;
            if (0 <= index) {
                this.listenerIds.splice(index, 1);
            }
        },
        getInListener: function(id, listener) {
            var that = this;

            return function() {
                var $element = $(listener.element);

                listener.listener.call(listener.element, {
                    target: listener.element,
                    isElementIn: true
                });

                if (listener.once) {
                    that.removePositionListener(id);
                    $element.removeData('jquery-position-listener-id');
                }
            };
        },
        getOutListener: function(listener) {
            return function() {
                listener.listener.call(listener.element, {
                    target: listener.element,
                    isElementIn: false
                });
            };
        },
        execute: function() {
            var scrollTop = $window.scrollTop(),
                windowHeight = window.innerHeight || $window.height(),
                ids = this.listenerIds,
                listeners = this.listeners,
                listenerQueue = [],
                listener,
                $element,
                elementTop,
                top,
                border,
                viewRate,
                i,
                length;

            for (i = 0, length = ids.length; i < length; i++) {
                listener = listeners[ids[i]];
                $element = $(listener.element);
                elementTop = $element.offset().top;
                top = elementTop - scrollTop;
                border = windowHeight * listener.triggerPosition;
                viewRate = (windowHeight - top) / border;

                if (!listener.isElementIn && 1 <= viewRate) {
                    listenerQueue.push(this.getInListener(ids[i], listener));
                    listener.isElementIn = true;
                } else if (listener.isElementIn && viewRate < 1) {
                    listenerQueue.push(this.getOutListener(listener));
                    listener.isElementIn = false;
                }
            }

            for (i = 0, length = listenerQueue.length; i < length; i++) {
                raf(listenerQueue[i]);
            }

            this.scrollTop = scrollTop;
        }
    };

    $.fn.extend({
        /**
         * @function external:"jQuery.fn".addPositionListener
         * @desc add specified position listener on jquery object
         * @param {Number} triggerPosition listener trigger percentage of element. Please specify 0 to 1.
         * @param {function} listener listener function
         * @param {Boolean} isOnce whether remove listener after a function call or not.
         */
        addPositionListener: function(triggerPosition, listener, isOnce) {
            return $(this).each(function() {
                var random = Math.random(),
                    config = {
                        id: 'jquery-position-listener-id-' + new Date().getTime() + random,
                        once: !!isOnce,
                        triggerPosition: triggerPosition,
                        element: this,
                        listener: listener
                    };

                positionManager.addPositionListener(config);

                $(this).data('jquery-position-listener-id', config.id);
            });
        },
        removePositionListener: function(id) {
            positionManager.removePositionListener(id);
        }
    });

    scrollHandler.init();

    $window.on('position-listener-scroll', $.proxy(positionManager.execute, positionManager));

    if (typeof define === 'function' && define.amd) {
        define('positionlistener', [], function() {
            return jQuery;
        });
    }

}.call(window, jQuery));
