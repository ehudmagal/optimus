// page initv

jQuery(window).load(function () {
    refreshAll();

});
function initAll() {
    jcf.customForms.replaceAll();
    validationForm();
    initOpenClose();
    initInputs();
    initSameHeight();
    initSectionOpenClose();
    initPressedState();
    initSwitchView();
    initSplitRows();
    initResizeContent();
    initPopups();
    $('.open').first().trigger('click');
}
function refreshAll() {
    jcf.customForms.refreshAll();
    resizeScrollArea();
    initRefreshCustomScroll();
    initCropLine();
}
//crop overfull lines init
function initCropLine() {
    var maxLength = 32;
    var separator = '...';
    jQuery('.crop-title').each(function () {
        var holder = jQuery(this);
        var items = holder.find('>h2 >span');
        var orienteer = holder.parent().find('.project-stats').eq(0);
        var padding = holder.outerWidth() - holder.width();
        items.each(function () {
            var line = jQuery(this);
            line.data('origText', line.text());
            if (line.width() > holder.width()) {
                var text = line.text();
                while (line.width() > holder.width() && text.length) {
                    text = text.substr(0, text.length - 1);
                    line.text(text + separator);
                }
            }
        })
        jQuery(window).bind('resize', function () {
            items.each(function () {
                var line = jQuery(this);
                line.text(line.data('origText'));
                if (line.width() > holder.width()) {
                    var text = line.text();
                    while (line.width() > holder.width() && text.length) {
                        text = text.substr(0, text.length - 1);
                        line.text(text + separator);
                    }
                }
            });
        });
    });


    jQuery('.crop-drop, .form-container .col').each(function () {
        var holder = jQuery(this);
        var items = holder.find('li a, .row label');
        items.each(function () {
            var line = jQuery(this);
            if (line.children().length) {
                line.children().each(function () {
                    var child = jQuery(this);
                    if (child.text().length > maxLength) child.text(child.text().substr(0, maxLength) + separator);
                });
            }
            else {
                if (!line.data('origText')) {
                    line.data('origText', line.text());
                }
                if (line.text().length > maxLength) {
                    line.text(line.text().substr(0, maxLength) + separator);
                }
            }
        })
        if (holder.width() > 0 && !holder.hasClass('col')) {
            if (holder.css('right').length) {
                holder.css({right: 'auto', left: 0});
            }
            holder.css({width: 'auto'}).css({width: holder.width()});
            if (holder.css('right').length) {
                holder.css({right: '', left: ''});
            }
        }
    });
}

// popups init
function initPopups() {
    jQuery('.location').contentPopup({
        mode: 'click',
        popup: '.drop',
        btnOpen: '.button',
        changePosition: true
    });
}

//return first row in title box
function initSplitRows() {
    var wrapList = jQuery('.projects-area');
    var thumbClass = 'thumbs';
    jQuery('.info').each(function () {
        var holder = jQuery(this);
        var rightBox = holder.parent().find('.right-side');
        var ellipsis = holder.find('.ellipsis');
        var textHolder = holder.find('>span');
        var textBox = holder.find('.location');
        var orienteer = rightBox.find('.orienteer');
        if (rightBox.length && orienteer.length) {
            holder.css({width: (wrapList.hasClass(thumbClass) ? orienteer.offset().left : rightBox.offset().left) - holder.offset().left - 20});
        }
        function calcContent(box, separate) {
            var text = box.data('text'),
                str = '',
                i = 0;
            for (i = text.length - 1; i > 0; i--) {
                if (!str.length) {
                    str = text;
                }
                textBox.html(str);
                if (textHolder.height() <= lineHeight) {
                    return false;
                }
                else {
                    text = text.substr(0, text.length - 1);
                    str = text + separate.html();
                }
            }
        }

        if (ellipsis.length && textBox.length) {
            textBox.data('text', textBox.text());

            var lineHeight = parseInt(textHolder.css('lineHeight')) + 3;
            if (wrapList.length && !wrapList.hasClass(thumbClass)) {
                lineHeight *= 2;
            }
            if (textHolder.height() > lineHeight) {
                textBox.css({opacity: 0});
                jQuery(window).load(function () {
                    calcContent(textBox, ellipsis);
                    textBox.css({opacity: ''});
                });
            }
            jQuery(window).bind('resize', function () {
                setTimeout(function () {
                    holder.css({width: (wrapList.hasClass(thumbClass) ? orienteer.offset().left : rightBox.offset().left) - holder.offset().left});
                    lineHeight = parseInt(textHolder.css('lineHeight')) + 3;
                    if (wrapList.length && !wrapList.hasClass(thumbClass)) {
                        lineHeight *= 2;
                    }
                    calcContent(textBox, ellipsis);
                }, 100);
            });
        }
    });
}

//refresh custom scroll
function initRefreshCustomScroll() {
    jQuery('.scrollable-area-wrapper').each(function () {
        var holder = jQuery(this);
        jQuery(window).bind('resize', function () {
            setTimeout(function () {
                holder.css({width: holder.parent().width()});
                holder.find('.scrollable-area').css({width: holder.parent().width()});
                jcf.customForms.refreshAll();
            }, 100)
        })
    })
}

//resize content height on inner page
function initResizeContent() {
    var minHeight = 680;
    var win = jQuery(window);
    var extraHeight = jQuery('.info-box').outerHeight() || 0;
    var bottomSection = jQuery('.info-box');
    var activeClass = 'active';
    jQuery('.project-list .scrollable-area').each(function () {
        var holder = jQuery(this);

        function recalcHeight() {
            var curHeight = (win.height() < minHeight ? minHeight : win.height()) - holder.offset().top - extraHeight;
            if (bottomSection.length && bottomSection.hasClass(activeClass)) {
                jcf.customForms.refreshAll();
            }
            else {
                holder.css({height: curHeight});
                holder.parent().css({height: curHeight});
                jcf.customForms.refreshAll();
            }
        }

        recalcHeight();
        win.bind('resize updateResize', function () {
            setTimeout(function () {
                recalcHeight();
            }, 200)
        })
    })
}

//switcher view init
function initSwitchView() {
    var thumbClass = 'thumbs';
    jQuery('.projects-area').each(function () {
        var holder = jQuery(this);
        var btnThumb = holder.find('a.thumbs-btn');
        var btnList = holder.find('a.list-btn');
        var scrollHolder = holder.find('.project-list');
        var timeout = 1000;
        var animSpeed = 500;
        var timer;
        btnThumb.bind('click', function (e) {
            if (!holder.hasClass(thumbClass)) {
                holder.addClass(thumbClass);
                jcf.customForms.refreshAll();
                jQuery(window).trigger('resize').trigger('resizeThumbs');
            }
            e.preventDefault();
        })
        btnList.bind('click', function (e) {
            if (holder.hasClass(thumbClass)) {
                holder.removeClass(thumbClass);
                jcf.customForms.refreshAll();
                jQuery(window).trigger('resize').trigger('resizeThumbs');
            }
            e.preventDefault();
        })

        holder.find('.box-holder:has(.box-frame)').each(function () {
            var box = jQuery(this);
            var slide = box.find('.box-frame');
            var map = box.find('.map, .picture');
            if (map.length) {
                map.hover(function () {
                    if (holder.hasClass(thumbClass)) {
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            hideBox(slide, map);
                        }, timeout)
                    }
                }, function () {
                    if (holder.hasClass(thumbClass)) {
                        clearTimeout(timer);
                        showBox(slide, map);
                    }
                })
            }
        })
        function showBox(slide, map) {
            slide.stop().animate({left: 15 + '%'}, {duration: animSpeed});
            map.stop().animate({width: 15 + '%'}, {duration: animSpeed});
        }

        function hideBox(slide, map) {
            slide.stop().animate({left: 80 + '%'}, {duration: animSpeed});
            map.stop().animate({width: 80 + '%'}, {duration: animSpeed});
        }
    })
}

// add pressed state class to elements
function initPressedState() {
    jQuery('a.button').pressedState({
        pressedClass: 'pressed'
    });
    jQuery('.info-box article').pressedState({
        pressedClass: 'pressed'
    });
}

function resizeScrollArea() {
    jQuery('.box').each(function () {
        var holder = jQuery(this);
        var scrollArea = holder.find('.scrollable-area');
        jQuery(window).bind('resize', function () {
            scrollArea.css({width: holder.width()});
            scrollArea.parent().css({width: holder.width()});
            jcf.customForms.refreshAll();
        });
    });
}
function initSectionOpenClose() {
    var timer;
    var flag = false;
    var animSpeed = 1;
    var activeClass = 'active';
    var hiddenClass = 'js-slide-hidden';
    var busyClass = 'busy';
    var win = jQuery(window);

    function hideDropCloseState(fast, slide, btn, containerCloseSlide) {
        if (slide.hasClass(busyClass)) {
            slide.removeClass(busyClass);
            btn.parent().removeClass(activeClass);
            jQuery(window).trigger('hideSlides');
            btn.unbind('mouseleave');
            slide.stop(true, true).slideUp(fast ? 0 : animSpeed, function () {
                if (slide.find('.scrollable-area').length && slide.find('.scrollable-area')[0].jcf) slide.find('.scrollable-area')[0].jcf = null;
                slide.find('.scrollable-area').removeClass('scrollable-area').removeAttr('style').unwrap();
                slide.find('.col-holder').parent().find('.vscrollbar').remove();
                slide.find('.col-frame').css({width: ''});
                //slide.trigger('openStateLine');

                var box = containerCloseSlide.children().eq(slide.attr('data-number-position'));
                if (box.length) slide.insertBefore(box);
                else if (!containerCloseSlide.children().length) {
                    slide.prependTo(containerCloseSlide);
                }
                else {
                    slide.appendTo(containerCloseSlide);
                }
                jcf.customForms.replaceAll();

                jQuery('div.fly').die('mouseenter', function () {
                    clearTimeout(timer);
                }).die('mouseleave', function () {
                    clearTimeout(timer);
                    timer = setTimeout(hideDropCloseState, 50);
                })
                slide.unbind('mouseleave mouseenter').show();
            });
        }
    }

    jQuery('.setting-panel .box').each(function () {
        var box = jQuery(this);
        var holder = box.closest('form');
        var slideHolder = box.find('.holder:has(.title)');
        var opener = box.find('a.open-drop');
        var slideForOpenState = holder.find('.menu');
        var slideForCloseState = opener.attr('href') && opener.attr('href').indexOf('#') == 0 ? jQuery(opener.attr('href')) : false;

        function hideDropOpenState() {
            slideHolder.removeClass(activeClass);
            slideForOpenState.slideUp(animSpeed, function () {
                slideForOpenState.addClass(hiddenClass);
                //initCropLine(slideForCloseState,true);
            });
        }

        if (slideForCloseState && slideForCloseState.length) {
            var containerCloseSlide = slideForCloseState.parent();

            if (!slideHolder.hasClass(activeClass)) {
                slideForOpenState.addClass(hiddenClass);
            }
            opener.each(function () {
                var btnOpen = jQuery(this);
                btnOpen.bind('click', function (e) {
                    if (!holder.hasClass(activeClass)) {
                        if (!btnOpen.parent().hasClass(activeClass)) {
                            slideForCloseState = btnOpen.attr('href') && btnOpen.attr('href').indexOf('#') == 0 ? jQuery(btnOpen.attr('href')) : false;
                            containerCloseSlide = slideForCloseState.parent();
                            if (!slideForCloseState.children().length) {
                                return false;
                            }
                            btnOpen.bind('mouseleave', function () {
                                clearTimeout(timer);
                                timer = setTimeout(function () {
                                    hideDropCloseState(false, slideForCloseState, opener, containerCloseSlide);
                                }, 50);
                            });
                            jQuery(window).trigger('hideSlides');
                            btnOpen.parent().addClass(activeClass);
                            slideForCloseState.addClass(hiddenClass);
                            slideForCloseState.insertAfter(btnOpen);//.trigger('closeStateLine');
                            slideForCloseState.find('.col-holder').addClass('scrollable-area');
                            jcf.customForms.replaceAll();
                            jQuery(window).trigger('resize');
                            slideForCloseState.removeClass(hiddenClass).addClass(busyClass).hide().slideDown(animSpeed, function () {
                                jQuery('div.fly').live('mouseenter', function () {
                                    clearTimeout(timer);
                                }).live('mouseleave', function () {
                                    clearTimeout(timer);
                                })
                                slideForCloseState.bind('mouseleave', function () {
                                    if (!jQuery('.setting-panel').hasClass(activeClass)) {
                                        clearTimeout(timer);
                                    }
                                }).bind('mouseenter', function () {
                                    clearTimeout(timer);
                                })
                            });
                        }
                        else {
                            hideDropCloseState(false, slideForCloseState, opener, containerCloseSlide);
                        }
                    }
                    return false;
                });
            })


            jQuery(window).bind('returnMenu', function () {
                hideDropCloseState(true, slideForCloseState, opener, containerCloseSlide);
            });
            jQuery(window).bind('hideMenu', function () {
                hideDropCloseState(false, slideForCloseState, opener, containerCloseSlide);
            });
            jQuery(window).bind('click', function (e) {
                if (slideHolder.hasClass(activeClass)) {
                    if (!jQuery(e.target).hasClass('sensors-menu') && !jQuery(e.target).parents('.sensors-menu').length || !jQuery(e.target).hasClass('fly') && !jQuery(e.target).parents('.fly').length) {
                        hideDropOpenState(false, slideForCloseState, opener, containerCloseSlide);
                    }
                }
            });
        }
    })
}

// open-close init
//yakir change
var view_setting_pane_state = true;
function initOpenClose() {
    jQuery('.infobar>li').openClose({
        activeClass: 'active',
        autoHide: true,
        opener: '.message',
        slider: '.slider',
        animSpeed: 400,
        effect: 'slide'
    });
    jQuery('.user-block').openClose({
        activeClass: 'active',
        autoHide: true,
        opener: '.name',
        slider: '.slide-drop',
        animSpeed: 400,
        effect: 'slide'
    });
    jQuery('.infobar>li').openClose({
        activeClass: 'active',
        autoHide: true,
        opener: '.alert',
        slider: '.slide-holder',
        animSpeed: 400,
        effect: 'slide'
    });
    jQuery('.my-projects').openClose({
        activeClass: 'active',
        autoHide: true,
        opener: '.opener',
        slider: '.slide',
        animSpeed: 200,
        effect: 'slide'
    });
    jQuery('.save-box').openClose({
        activeClass: 'active',
        autoHide: true,
        opener: '.opener',
        slider: '.slide',
        animSpeed: 400,
        effect: 'slide'
    });

    jQuery('.nav-more').openClose({
        activeClass: 'nav-more-active',
        autoHide: true,
        opener: '.opener-nav',
        slider: '.drop',
        animSpeed: 200,
        effect: 'slide'
    });
    jQuery('.setting-panel').openClose({
        activeClass: 'active',
        animStart: function (direction) {
            jQuery('body').css({overflow: 'hidden'});
            if (direction) jQuery(window).trigger('returnMenu');
            else {
                jQuery(window).trigger('hideMenu');
                jQuery(window).trigger('hideSlides');
            }
        },
        animEnd: function (direction) {
            view_setting_pane_state = direction;
            try {
                //resizeChartHeight();
                chartbox.setGraphHeight();
            }
            catch (err) {
                //Handle errors here
            }
            if (direction) jQuery(window).trigger('resize');
            jQuery(window).trigger('updateResize');
            setTimeout(function () {
                jQuery('body').css({overflow: ''});
            }, 200)

        },
        opener: '.open',
        slider: '.slide-box',
        animSpeed: 600,
        effect: 'slide'
    });
    jQuery('.row').openClose({
        activeClass: 'active',
        autoHide: true,
        outDrop: true,
        opener: '.button',
        slider: '.add-drop',
        animSpeed: 400,
        effect: 'slide'
    });

    //close open/close on mouseleave navigation items fix
    //begin
    var openClass = 'open';
    jQuery('.main-nav > li:has(ul)').each(function () {
        jQuery(this).bind('mouseleave', function () {
            var elementLeft = jQuery(this);
            var isOpen = elementLeft.hasClass(openClass);
            var isActive = elementLeft.hasClass('active');
            if (isOpen && !isActive) {
                elementLeft.find('.opener-nav').trigger('click');
            }
        })
    })
    //end
    //hight animation of the graphSlider//
    var block = jQuery('.project-list .scrollable-area-wrapper');
    var container = jQuery('#container');
    var activeClass = 'active',
        animSpeed = 500,
        block = jQuery('.project-list .scrollable-area'),
        blockHeight = block.height();
    jQuery('.info-box').each(function () {
        var holder = jQuery(this),
            opener = holder.find('a.open'),
            slider = holder.find('.column-holder'),
            sliderHeight = slider.outerHeight();
        if (!holder.hasClass(activeClass)) slider.css({position: 'absolute', left: -9999, width: holder.width()});
        opener.bind('click touchstart', function (e) {
            if (holder.hasClass(activeClass)) {
                holder.removeClass(activeClass);
                slider.slideUp(animSpeed, function () {
                    slider.css({position: 'absolute', left: -9999}).show();
                    jQuery(window).trigger('recalPopupPosition');
                });
                block.stop().animate({height: blockHeight}, {duration: animSpeed, complete: function () {
                    holder.stop().css({paddingTop: 0});
                    block.parent().css({height: block.height()});
                    jcf.customForms.refreshAll();
                }});
            } else {
                blockHeight = block.height();

                holder.addClass(activeClass);
                slider.hide().css({position: '', left: '', width: ''}).slideDown(animSpeed, function () {
                    jQuery(window).trigger('recalPopupPosition').trigger('resize');
                });
                block.stop().animate({height: blockHeight - sliderHeight}, {duration: animSpeed, complete: function () {
                    holder.stop().css({paddingTop: sliderHeight});
                    block.parent().css({height: block.height()});

                    jcf.customForms.refreshAll();
                }});
            }
            return false;
        });
    });
}

// clear inputs on focus
function initInputs() {
    PlaceholderInput.replaceByOptions({
        // filter options
        clearInputs: true,
        clearTextareas: true,
        clearPasswords: true,
        skipClass: 'default',

        // input options
        wrapWithElement: true,
        showUntilTyping: false,
        getParentByClass: false,
        placeholderAttr: 'placeholder'
    });
}

// align blocks height
function initSameHeight() {
    jQuery('.list').sameHeight({
        elements: '>li',
        flexible: true,
        multiLine: true
    });
}

//FORM VALIDATION//
function validationForm() {
    jQuery('.sign-form').each(function () {
        var currentForm = jQuery(this);
        var regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var errorClass = 'invalid';
        var parentSelector = '.sign-row';
        var inputs = currentForm.find('input:not(:submit)');
        var select = currentForm.find('select');
        var btnSubmit = currentForm.find('input:submit');
        var flag = true;

        inputs.each(function () {
            var field = jQuery(this);
            var msg = field.parent().find('.validation');
            msg.bind('click', function (e) {
                e.preventDefault();
                removeError(field.get(0));
            });
            field.bind('change', function () {
                checkedFields(this);
            });
        });
        select.each(function () {
            jQuery(this).bind('change', function () {
                checkedSelects(this);
            });
        });
        btnSubmit.click(function () {
            flag = true;
            inputs.each(function () {
                checkedFields(this);
            });
            select.each(function () {
                checkedSelects(this);
            });

            if (flag) {
                currentForm.submit();
            } else {
                return false;
            }
        });
        //END FORM VALIDATION//
        function checkedSelects(currentField) {
            currentField = jQuery(currentField);
            if (currentField.hasClass('required')) {
                if (!currentField[0].selectedIndex) {
                    addError(currentField);
                } else {
                    removeError(currentField);
                }
            }
        }

        function addError(input) {
            jQuery(input).parents(parentSelector).addClass(errorClass);
            flag = false;
        }

        function removeError(input) {
            jQuery(input).parents(parentSelector).removeClass(errorClass);
        }

        //CHECK FIELDS//
        function checkedFields(currentField) {
            currentField = jQuery(currentField);
            var fieldVal = jQuery.trim(currentField.val());
            if (currentField.hasClass('required')) {
                if ((fieldVal == '') || (currentField[0].defaultValue == currentField[0].value)) {
                    addError(currentField);
                } else if (currentField.parents(parentSelector).hasClass(errorClass)) {
                    removeError(currentField);
                }
            } else if (currentField.hasClass('required-email')) {
                if (!fieldVal.match(regEmail)) {
                    addError(currentField);
                } else if (currentField.parents(parentSelector).hasClass(errorClass)) {
                    removeError(currentField);
                }
            }
        }
    });
}

/*
 * Popups plugin
 */
;
(function ($) {
    function ContentPopup(opt) {
        this.options = $.extend({
            holder: null,
            popup: '.popup',
            btnOpen: '.open',
            btnClose: '.close',
            changePosition: false,
            topClass: 'drop-top',
            openClass: 'popup-active',
            clickEvent: 'click',
            mode: 'click',
            hideOnClickLink: true,
            hideOnClickOutside: true,
            delay: 50
        }, opt);
        if (this.options.holder) {
            this.holder = $(this.options.holder);
            this.init();
        }
    }

    ContentPopup.prototype = {
        init: function () {
            this.findElements();
            this.attachEvents();
        },
        findElements: function () {
            this.popup = this.holder.find(this.options.popup);
            this.btnOpen = this.holder.find(this.options.btnOpen);
            this.btnClose = this.holder.find(this.options.btnClose);
        },
        attachEvents: function () {
            // handle popup openers
            var self = this;
            this.clickMode = (self.options.mode === self.options.clickEvent);
            if (this.options.changePosition) {
                jQuery(window).bind('recalPopupPosition', function () {
                    if (self.popup.is(':visible')) {
                        self.showPopup();
                    }
                    if (self.popup.parents('.info-box').length && !self.popup.parents('.info-box').eq(0).hasClass('active')) self.hidePopup();
                });
            }

            if (this.clickMode) {
                // handle click mode
                this.btnOpen.bind(self.options.clickEvent, function (e) {
                    if (self.holder.hasClass(self.options.openClass)) {
                        if (self.options.hideOnClickLink) {
                            self.hidePopup();
                        }
                    } else {
                        self.showPopup();
                    }
                    e.preventDefault();
                });

                // prepare outside click handler
                this.outsideClickHandler = this.bind(this.outsideClickHandler, this);
            } else {
                // handle hover mode
                var timer, delayedFunc = function (func) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        func.call(self);
                    }, self.options.delay);
                };
                this.btnOpen.bind('mouseover', function () {
                    delayedFunc(self.showPopup);
                }).bind('mouseout', function () {
                    delayedFunc(self.hidePopup);
                });
                this.popup.bind('mouseover', function () {
                    delayedFunc(self.showPopup);
                }).bind('mouseout', function () {
                    delayedFunc(self.hidePopup);
                });
            }

            // handle close buttons
            this.btnClose.bind(self.options.clickEvent, function (e) {
                self.hidePopup();
                e.preventDefault();
            });
        },
        outsideClickHandler: function (e) {
            // hide popup if clicked outside
            var currentNode = (e.changedTouches ? e.changedTouches[0] : e).target;
            if (!$(currentNode).parents().filter(this.holder).length) {
                this.hidePopup();
            }
        },
        showPopup: function () {
            //if(this.popup.parents('.info-box').length && !this.popup.parents('.info-box').eq(0).hasClass('active')) return false;
            // reveal popup
            this.holder.addClass(this.options.openClass);
            this.popup.css({display: 'block'}).removeClass(this.options.topClass);
            if (this.popup.length) {
                if (this.options.changePosition && this.popup.offset().top + this.popup.outerHeight(true) > jQuery('body').height()) {
                    this.popup.addClass(this.options.topClass)
                }
            }

            // outside click handler
            if (this.clickMode && this.options.hideOnClickOutside && !this.outsideHandlerActive) {
                this.outsideHandlerActive = true;
                $(document).bind('click touchstart', this.outsideClickHandler);
            }
        },
        hidePopup: function () {
            // hide popup
            this.holder.removeClass(this.options.openClass);
            this.popup.css({display: 'none'});

            // outside click handler
            if (this.clickMode && this.options.hideOnClickOutside && this.outsideHandlerActive) {
                this.outsideHandlerActive = false;
                $(document).unbind('click touchstart', this.outsideClickHandler);
            }
        },
        bind: function (f, scope, forceArgs) {
            return function () {
                return f.apply(scope, forceArgs ? [forceArgs] : arguments);
            };
        }
    };

    // jQuery plugin interface
    $.fn.contentPopup = function (opt) {
        return this.each(function () {
            new ContentPopup($.extend(opt, {holder: this}));
        });
    };
}(jQuery));

/*
 * jQuery Pressed State helper plugin
 */
;
(function ($) {
    $.fn.pressedState = function (o) {
        var options = $.extend({
            pressedClass: 'pressed'
        }, o);

        // add handlers
        return this.each(function () {
            var item = $(this);
            if (isTouchDevice) {
                item.bind('touchstart', function () {
                    item.addClass(options.pressedClass);
                    $(document).one('touchend', function () {
                        item.removeClass(options.pressedClass);
                    });
                })
            } else {
                item.bind('mousedown', function () {
                    item.addClass(options.pressedClass);
                    item.bind('mouseup.pstate mouseleave.pstate', function () {
                        item.removeClass(options.pressedClass).unbind('.pstate');
                    }).bind('mousemove.pstate', function (e) {
                        e.preventDefault();
                    });
                });
            }
        });
    }

    // detect device type
    var isTouchDevice = (function () {
        try {
            return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
        } catch (e) {
            return false;
        }
    }());
}(jQuery));


/*
 * jQuery SameHeight plugin
 */
(function ($) {
    $.fn.sameHeight = function (opt) {
        var options = $.extend({
            skipClass: 'same-height-ignore',
            leftEdgeClass: 'same-height-left',
            rightEdgeClass: 'same-height-right',
            elements: '>*',
            flexible: false,
            multiLine: false,
            useMinHeight: false,
            biggestHeight: false
        }, opt);
        return this.each(function () {
            var holder = $(this), postResizeTimer, ignoreResize;
            var elements = holder.find(options.elements).not('.' + options.skipClass);
            if (!elements.length) return;

            // resize handler
            function doResize() {
                elements.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', '');
                if (options.multiLine) {
                    // resize elements row by row
                    resizeElementsByRows(elements, options);
                } else {
                    // resize elements by holder
                    resizeElements(elements, holder, options);
                }
            }

            doResize();

            // handle flexible layout / font resize
            var delayedResizeHandler = function () {
                if (!ignoreResize) {
                    ignoreResize = true;
                    doResize();
                    clearTimeout(postResizeTimer);
                    postResizeTimer = setTimeout(function () {
                        doResize();
                        setTimeout(function () {
                            ignoreResize = false;
                        }, 10);
                    }, 100);
                }
            };

            // handle flexible/responsive layout
            if (options.flexible) {
                $(window).bind('resize orientationchange fontresize', delayedResizeHandler);
            }

            // handle complete page load including images and fonts
            $(window).bind('load', delayedResizeHandler);
        });
    };

    // detect css min-height support
    var supportMinHeight = typeof document.documentElement.style.maxHeight !== 'undefined';

    // get elements by rows
    function resizeElementsByRows(boxes, options) {
        var currentRow = $(), maxHeight, maxCalcHeight = 0, firstOffset = boxes.eq(0).offset().top;
        boxes.each(function (ind) {
            var curItem = $(this);
            if (curItem.offset().top === firstOffset) {
                currentRow = currentRow.add(this);
            } else {
                maxHeight = getMaxHeight(currentRow);
                maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
                currentRow = curItem;
                firstOffset = curItem.offset().top;
            }
        });
        if (currentRow.length) {
            maxHeight = getMaxHeight(currentRow);
            maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
        }
        if (options.biggestHeight) {
            boxes.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', maxCalcHeight);
        }
    }

    // calculate max element height
    function getMaxHeight(boxes) {
        var maxHeight = 0;
        boxes.each(function () {
            maxHeight = Math.max(maxHeight, $(this).outerHeight());
        });
        return maxHeight;
    }

    // resize helper function
    function resizeElements(boxes, parent, options) {
        var calcHeight;
        var parentHeight = typeof parent === 'number' ? parent : parent.height();
        boxes.removeClass(options.leftEdgeClass).removeClass(options.rightEdgeClass).each(function (i) {
            var element = $(this);
            var depthDiffHeight = 0;

            if (typeof parent !== 'number') {
                element.parents().each(function () {
                    var tmpParent = $(this);
                    if (this === parent[0]) {
                        return false;
                    } else {
                        depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
                    }
                });
            }
            calcHeight = parentHeight - depthDiffHeight - (element.outerHeight() - element.height());
            if (calcHeight > 0) {
                element.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', calcHeight);
            }
        });
        boxes.filter(':first').addClass(options.leftEdgeClass);
        boxes.filter(':last').addClass(options.rightEdgeClass);
        return calcHeight;
    }
}(jQuery));

/*
 * jQuery FontResize Event
 */
jQuery.onFontResize = (function ($) {
    $(function () {
        var randomID = 'font-resize-frame-' + Math.floor(Math.random() * 1000);
        var resizeFrame = $('<iframe>').attr('id', randomID).addClass('font-resize-helper');

        // required styles
        resizeFrame.css({
            width: '100em',
            height: '10px',
            position: 'absolute',
            borderWidth: 0,
            top: '-9999px',
            left: '-9999px'
        }).appendTo('body');

        // use native IE resize event if possible
        if ($.browser.msie && $.browser.version < 9) {
            resizeFrame.bind('resize', function () {
                $.onFontResize.trigger(resizeFrame[0].offsetWidth / 100);
            });
        }
        // use script inside the iframe to detect resize for other browsers
        else {
            var doc = resizeFrame[0].contentWindow.document;
            doc.open();
            doc.write('<scri' + 'pt>window.onload = function(){var em = parent.jQuery("#' + randomID + '")[0];window.onresize = function(){if(parent.jQuery.onFontResize){parent.jQuery.onFontResize.trigger(em.offsetWidth / 100);}}};</scri' + 'pt>');
            doc.close();
        }
        jQuery.onFontResize.initialSize = resizeFrame[0].offsetWidth / 100;
    });
    return {
        // public method, so it can be called from within the iframe
        trigger: function (em) {
            $(window).trigger("fontresize", [em]);
        }
    };
}(jQuery));

/*
 * jQuery Open/Close plugin
 */
(function ($) {
    function OpenClose(options) {
        this.options = $.extend({
            addClassBeforeAnimation: true,
            activeClass: 'active',
            opener: '.opener',
            autoHide: false,
            outDrop: false,
            slider: '.slide',
            animSpeed: 400,
            effect: 'fade',
            event: 'click'
        }, options);
        this.init();
    }

    OpenClose.prototype = {
        init: function () {
            if (this.options.holder) {
                this.findElements();
                this.attachEvents();
                this.makeCallback('onInit');
            }
        },
        findElements: function () {
            this.holder = $(this.options.holder);
            this.opener = this.holder.find(this.options.opener);
            this.slider = this.holder.find(this.options.slider);

            if (!this.holder.hasClass(this.options.activeClass)) {
                this.slider.addClass(slideHiddenClass);
            }
        },
        attachEvents: function () {
            // add handler
            var self = this;
            var win = jQuery(window);
            this.eventHandler = function (e) {
                e.preventDefault();
                if (self.slider.parents('.scrollable-area').length && !self.slider.hasClass('fly') || self.options.outDrop) {
                    self.slider.addClass('fly').appendTo('body');
                    if (self.opener.offset().left + self.slider.outerWidth(true) + 140 > jQuery(window).width()) {
                        self.slider.addClass('right-side').css({left: self.opener.offset().left - self.slider.outerWidth(true) + self.opener.outerWidth(true) + 5, top: self.opener.offset().top + self.opener.outerHeight() + 5});
                    } else {
                        self.slider.removeClass('right-side').css({left: self.opener.offset().left - 5, top: self.opener.offset().top + self.opener.outerHeight() + 5});
                    }
                }
                if (!self.animating) {
                    if (self.slider.hasClass(slideHiddenClass)) {
                        self.showSlide();
                    } else {
                        self.hideSlide();
                    }
                }
                return false;
            };
            self.opener.bind(self.options.event, this.eventHandler);

            // hove mode handler
            if (self.options.event === 'over') {
                self.opener.bind('mouseenter', function () {
                    self.holder.removeClass(self.options.activeClass);
                    self.opener.trigger(self.options.event);
                });
                self.holder.bind('mouseleave', function () {
                    self.holder.addClass(self.options.activeClass);
                    self.opener.trigger(self.options.event);
                });
            }
            var minW = parseInt(jQuery('body').css('min-width'));

            if (this.slider.parents('.scrollable-area').length || this.options.outDrop) {
                this.holder.addClass(this.options.activeClass);
                this.slider.data('offset', {
                    top: this.opener.offset().top + this.opener.outerHeight() + 5,
                    left: this.opener.offset().left - 5
                })
                this.holder.removeClass(this.options.activeClass);
            }

            if (this.options.autoHide) {
                win.bind('hideSlides', function () {
                    if (self.holder.hasClass(self.options.activeClass)) {
                        self.hideSlide();
                    }
                });
                jQuery('body').bind('click', function (e) {
                    if (!(jQuery(e.target).is(self.slider) || jQuery(e.target).parents().is(self.slider) || jQuery(e.target).is(self.opener))) {
                        self.holder.removeClass(self.options.activeClass);
                        self.hideSlide();
                    }
                });
            }

            self.slider.bind('sliderIsHidden', function () {
                if (self.slider.hasClass('fly')) {
                    self.slider.removeClass('fly').appendTo(self.holder);
                }
            });

            win.bind('updateSlider', function () {
                if (!self.holder.is(':visible') && self.slider.hasClass('fly')) self.slider.hide();
                else if (self.holder.is(':visible') && self.slider.hasClass('fly')) {
                    if (self.opener.offset().left + self.slider.outerWidth(true) + 140 > win.width()) {
                        self.slider.addClass('right-side').css({left: opener.offset().left - self.slider.outerWidth(true) + self.opener.outerWidth(true) + 5, top: self.opener.offset().top + self.opener.outerHeight() + 5});
                    } else {
                        self.slider.removeClass('right-side').css({left: self.opener.offset().left - 5, top: self.opener.offset().top + self.opener.outerHeight() + 5});
                    }
                }
            });

            win.bind('resize', function () {
                setTimeout(function () {
                    if (self.slider.hasClass('fly')) {
                        if (self.opener.offset().left + self.slider.outerWidth(true) + 140 > win.width()) {
                            self.slider.addClass('right-side').css({left: self.opener.offset().left - self.slider.outerWidth(true) + self.opener.outerWidth(true) + 5, top: self.opener.offset().top + self.opener.outerHeight() + 5});
                        } else {
                            self.slider.removeClass('right-side').css({left: self.opener.offset().left - 5, top: self.opener.offset().top + self.opener.outerHeight() + 5});
                        }
                    }
                }, 100)
            })
        },
        showSlide: function () {
            var self = this;
            self.animating = true;
            self.holder.removeClass(self.options.activeClass) //avoid hiding by 'hideSlide' ending in race condition
            jQuery(window).trigger('hideSlides');
            if (self.options.addClassBeforeAnimation) {
                self.holder.addClass(self.options.activeClass);
            }
            self.makeCallback('animStart', true);
            self.slider.removeClass(slideHiddenClass);
            toggleEffects[self.options.effect].show({
                box: self.slider,
                speed: self.options.animSpeed,
                complete: function () {
                    self.animating = false;
                    if (!self.options.addClassBeforeAnimation) {
                        self.holder.addClass(self.options.activeClass);
                    }
                    self.makeCallback('animEnd', true);
                }
            });
        },
        hideSlide: function () {
            var self = this;
            self.animating = true;
            if (self.options.addClassBeforeAnimation) {
                self.holder.removeClass(self.options.activeClass);
            }
            if (!self.slider.length) self.slider = self.holder.data('OpenClose').slider;
            self.makeCallback('animStart', false);
            toggleEffects[self.options.effect].hide({
                box: self.slider,
                speed: self.options.animSpeed,
                complete: function () {
                    self.animating = false;
                    if (!self.options.addClassBeforeAnimation) {
                        self.holder.removeClass(self.options.activeClass);
                    }
                    self.slider.addClass(slideHiddenClass);
                    self.makeCallback('animEnd', false);
                    self.slider.trigger('sliderIsHidden');
                }
            });
        },
        destroy: function () {
            this.slider.removeClass(slideHiddenClass);
            this.opener.unbind(this.options.event, this.eventHandler);
            this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
        },
        makeCallback: function (name) {
            if (typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        }
    };

    // add stylesheet for slide on DOMReady
    var slideHiddenClass = 'js-slide-hidden';
    $(function () {
        var tabStyleSheet = $('<style type="text/css">')[0];
        var tabStyleRule = '.' + slideHiddenClass;
        tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
        if (tabStyleSheet.styleSheet) {
            tabStyleSheet.styleSheet.cssText = tabStyleRule;
        } else {
            tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
        }
        $('head').append(tabStyleSheet);
    });

    // animation effects
    var toggleEffects = {
        slide: {
            show: function (o) {
                o.box.hide().slideDown(o.speed, o.complete);
            },
            hide: function (o) {
                o.box.slideUp(o.speed, o.complete);
            }
        },
        fade: {
            show: function (o) {
                o.box.hide().fadeIn(o.speed, o.complete);
            },
            hide: function (o) {
                o.box.fadeOut(o.speed, o.complete);
            }
        },
        none: {
            show: function (o) {
                o.box.hide().show(0, o.complete);
            },
            hide: function (o) {
                o.box.hide(0, o.complete);
            }
        }
    };

    // jQuery plugin interface
    $.fn.openClose = function (opt) {
        return this.each(function () {
            jQuery(this).data('OpenClose', new OpenClose($.extend(opt, {holder: this})));
        });
    };
}(jQuery));


/*
 * JavaScript Custom Forms Module
 */
jcf = {
    // global options
    modules: {},
    plugins: {},
    baseOptions: {
        useNativeDropOnMobileDevices: true,
        unselectableClass: 'jcf-unselectable',
        labelActiveClass: 'jcf-label-active',
        labelDisabledClass: 'jcf-label-disabled',
        classPrefix: 'jcf-class-',
        hiddenClass: 'jcf-hidden',
        focusClass: 'jcf-focus',
        wrapperTag: 'div'
    },
    // replacer function
    customForms: {
        setOptions: function (obj) {
            for (var p in obj) {
                if (obj.hasOwnProperty(p) && typeof obj[p] === 'object') {
                    jcf.lib.extend(jcf.modules[p].prototype.defaultOptions, obj[p]);
                }
            }
        },
        replaceAll: function () {
            for (var k in jcf.modules) {
                var els = jcf.lib.queryBySelector(jcf.modules[k].prototype.selector);
                for (var i = 0; i < els.length; i++) {
                    if (els[i].jcf) {
                        // refresh form element state
                        els[i].jcf.refreshState();
                    } else {
                        // replace form element
                        if (!jcf.lib.hasClass(els[i], 'default') && jcf.modules[k].prototype.checkElement(els[i])) {
                            new jcf.modules[k]({
                                replaces: els[i]
                            });
                        }
                    }
                }
            }
        },
        refreshAll: function () {
            for (var k in jcf.modules) {
                var els = jcf.lib.queryBySelector(jcf.modules[k].prototype.selector);
                for (var i = 0; i < els.length; i++) {
                    if (els[i].jcf) {
                        // refresh form element state
                        els[i].jcf.refreshState();
                    }
                }
            }
        },
        refreshElement: function (obj) {
            if (obj && obj.jcf) {
                obj.jcf.refreshState();
            }
        },
        destroyAll: function () {
            for (var k in jcf.modules) {
                var els = jcf.lib.queryBySelector(jcf.modules[k].prototype.selector);
                for (var i = 0; i < els.length; i++) {
                    if (els[i].jcf) {
                        els[i].jcf.destroy();
                    }
                }
            }
        }
    },
    // detect device type
    isTouchDevice: (function () {
        try {
            return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
        } catch (e) {
            return false;
        }
    }()),
    // define base module
    setBaseModule: function (obj) {
        jcf.customControl = function (opt) {
            this.options = jcf.lib.extend({}, jcf.baseOptions, this.defaultOptions, opt);
            this.init();
        };
        for (var p in obj) {
            jcf.customControl.prototype[p] = obj[p];
        }
    },
    // add module to jcf.modules
    addModule: function (obj) {
        if (obj.name) {
            // create new module proto class
            jcf.modules[obj.name] = function () {
                jcf.modules[obj.name].superclass.constructor.apply(this, arguments);
            };
            jcf.lib.inherit(jcf.modules[obj.name], jcf.customControl);
            for (var p in obj) {
                jcf.modules[obj.name].prototype[p] = obj[p];
            }
            // on create module
            jcf.modules[obj.name].prototype.onCreateModule();
            // make callback for exciting modules
            for (var mod in jcf.modules) {
                if (jcf.modules[mod] != jcf.modules[obj.name]) {
                    jcf.modules[mod].prototype.onModuleAdded(jcf.modules[obj.name]);
                }
            }
        }
    },
    // add plugin to jcf.plugins
    addPlugin: function (obj) {
        if (obj && obj.name) {
            jcf.plugins[obj.name] = function () {
                this.init.apply(this, arguments);
            };
            for (var p in obj) {
                jcf.plugins[obj.name].prototype[p] = obj[p];
            }
        }
    },
    // miscellaneous init
    init: function () {
        if (navigator.msPointerEnabled) {
            this.eventPress = 'MSPointerDown';
            this.eventMove = 'MSPointerMove';
            this.eventRelease = 'MSPointerUp';
        } else {
            this.eventPress = this.isTouchDevice ? 'touchstart' : 'mousedown';
            this.eventMove = this.isTouchDevice ? 'touchmove' : 'mousemove';
            this.eventRelease = this.isTouchDevice ? 'touchend' : 'mouseup';
        }

        // init jcf styles
        setTimeout(function () {
            jcf.lib.domReady(function () {
                jcf.initStyles();
            });
        }, 1);
        return this;
    },
    initStyles: function () {
        // create <style> element and rules
        var head = document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            rules = document.createTextNode('.' + jcf.baseOptions.unselectableClass + '{' +
                '-moz-user-select:none;' +
                '-webkit-tap-highlight-color:rgba(255,255,255,0);' +
                '-webkit-user-select:none;' +
                'user-select:none;' +
                '}');

        // append style element
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = rules.nodeValue;
        } else {
            style.appendChild(rules);
        }
        head.appendChild(style);
    }
}.init();

/*
 * Custom Form Control prototype
 */
jcf.setBaseModule({
    init: function () {
        if (this.options.replaces) {
            this.realElement = this.options.replaces;
            this.realElement.jcf = this;
            this.replaceObject();
        }
    },
    defaultOptions: {
        // default module options (will be merged with base options)
    },
    checkElement: function (el) {
        return true; // additional check for correct form element
    },
    replaceObject: function () {
        this.createWrapper();
        this.attachEvents();
        this.fixStyles();
        this.setupWrapper();
    },
    createWrapper: function () {
        this.fakeElement = jcf.lib.createElement(this.options.wrapperTag);
        this.labelFor = jcf.lib.getLabelFor(this.realElement);
        jcf.lib.disableTextSelection(this.fakeElement);
        jcf.lib.addClass(this.fakeElement, jcf.lib.getAllClasses(this.realElement.className, this.options.classPrefix));
        jcf.lib.addClass(this.realElement, jcf.baseOptions.hiddenClass);
    },
    attachEvents: function () {
        jcf.lib.event.add(this.realElement, 'focus', this.onFocusHandler, this);
        jcf.lib.event.add(this.realElement, 'blur', this.onBlurHandler, this);
        jcf.lib.event.add(this.fakeElement, 'click', this.onFakeClick, this);
        jcf.lib.event.add(this.fakeElement, jcf.eventPress, this.onFakePressed, this);
        jcf.lib.event.add(this.fakeElement, jcf.eventRelease, this.onFakeReleased, this);

        if (this.labelFor) {
            this.labelFor.jcf = this;
            jcf.lib.event.add(this.labelFor, 'click', this.onFakeClick, this);
            jcf.lib.event.add(this.labelFor, jcf.eventPress, this.onFakePressed, this);
            jcf.lib.event.add(this.labelFor, jcf.eventRelease, this.onFakeReleased, this);
        }
    },
    fixStyles: function () {
        // hide mobile webkit tap effect
        if (jcf.isTouchDevice) {
            var tapStyle = 'rgba(255,255,255,0)';
            this.realElement.style.webkitTapHighlightColor = tapStyle;
            this.fakeElement.style.webkitTapHighlightColor = tapStyle;
            if (this.labelFor) {
                this.labelFor.style.webkitTapHighlightColor = tapStyle;
            }
        }
    },
    setupWrapper: function () {
        // implement in subclass
    },
    refreshState: function () {
        // implement in subclass
    },
    destroy: function () {
        if (this.fakeElement && this.fakeElement.parentNode) {
            this.fakeElement.parentNode.removeChild(this.fakeElement);
        }
        jcf.lib.removeClass(this.realElement, jcf.baseOptions.hiddenClass);
        this.realElement.jcf = null;
    },
    onFocus: function () {
        // emulated focus event
        jcf.lib.addClass(this.fakeElement, this.options.focusClass);
    },
    onBlur: function (cb) {
        // emulated blur event
        jcf.lib.removeClass(this.fakeElement, this.options.focusClass);
    },
    onFocusHandler: function () {
        // handle focus loses
        if (this.focused) return;
        this.focused = true;

        // handle touch devices also
        if (jcf.isTouchDevice) {
            if (jcf.focusedInstance && jcf.focusedInstance.realElement != this.realElement) {
                jcf.focusedInstance.onBlur();
                jcf.focusedInstance.realElement.blur();
            }
            jcf.focusedInstance = this;
        }
        this.onFocus.apply(this, arguments);
    },
    onBlurHandler: function () {
        // handle focus loses
        if (!this.pressedFlag) {
            this.focused = false;
            this.onBlur.apply(this, arguments);
        }
    },
    onFakeClick: function () {
        if (jcf.isTouchDevice) {
            this.onFocus();
        } else if (!this.realElement.disabled) {
            this.realElement.focus();
        }
    },
    onFakePressed: function (e) {
        this.pressedFlag = true;
    },
    onFakeReleased: function () {
        this.pressedFlag = false;
    },
    onCreateModule: function () {
        // implement in subclass
    },
    onModuleAdded: function (module) {
        // implement in subclass
    },
    onControlReady: function () {
        // implement in subclass
    }
});

/*
 * JCF Utility Library
 */
jcf.lib = {
    bind: function (func, scope) {
        return function () {
            return func.apply(scope, arguments);
        }
    },
    browser: (function () {
        var ua = navigator.userAgent.toLowerCase(), res = {},
            match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];
        res[match[1]] = true;
        res.version = match[2] || "0";
        res.safariMac = ua.indexOf('mac') != -1 && ua.indexOf('safari') != -1;
        return res;
    })(),
    getOffset: function (obj) {
        if (obj.getBoundingClientRect) {
            var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            var clientLeft = document.documentElement.clientLeft || document.body.clientLeft || 0;
            var clientTop = document.documentElement.clientTop || document.body.clientTop || 0;
            return {
                top: Math.round(obj.getBoundingClientRect().top + scrollTop - clientTop),
                left: Math.round(obj.getBoundingClientRect().left + scrollLeft - clientLeft)
            }
        } else {
            var posLeft = 0, posTop = 0;
            while (obj.offsetParent) {
                posLeft += obj.offsetLeft;
                posTop += obj.offsetTop;
                obj = obj.offsetParent;
            }
            return {top: posTop, left: posLeft};
        }
    },
    getScrollTop: function () {
        return window.pageYOffset || document.documentElement.scrollTop;
    },
    getScrollLeft: function () {
        return window.pageXOffset || document.documentElement.scrollLeft;
    },
    getWindowWidth: function () {
        return document.compatMode == 'CSS1Compat' ? document.documentElement.clientWidth : document.body.clientWidth;
    },
    getWindowHeight: function () {
        return document.compatMode == 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight;
    },
    getStyle: function (el, prop) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null)[prop];
        } else if (el.currentStyle) {
            return el.currentStyle[prop];
        } else {
            return el.style[prop];
        }
    },
    getParent: function (obj, selector) {
        while (obj.parentNode && obj.parentNode != document.body) {
            if (obj.parentNode.tagName.toLowerCase() == selector.toLowerCase()) {
                return obj.parentNode;
            }
            obj = obj.parentNode;
        }
        return false;
    },
    isParent: function (child, parent) {
        while (child.parentNode) {
            if (child.parentNode === parent) {
                return true;
            }
            child = child.parentNode;
        }
        return false;
    },
    getLabelFor: function (object) {
        if (jcf.lib.getParent(object, 'label')) {
            return object.parentNode;
        } else if (object.id) {
            return jcf.lib.queryBySelector('label[for="' + object.id + '"]')[0];
        }
    },
    disableTextSelection: function (el) {
        if (typeof el.onselectstart !== 'undefined') {
            el.onselectstart = function () {
                return false
            };
        } else if (window.opera) {
            el.setAttribute('unselectable', 'on');
        } else {
            jcf.lib.addClass(el, jcf.baseOptions.unselectableClass);
        }
    },
    enableTextSelection: function (el) {
        if (typeof el.onselectstart !== 'undefined') {
            el.onselectstart = null;
        } else if (window.opera) {
            el.removeAttribute('unselectable');
        } else {
            jcf.lib.removeClass(el, jcf.baseOptions.unselectableClass);
        }
    },
    queryBySelector: function (selector, scope) {
        return this.getElementsBySelector(selector, scope);
    },
    prevSibling: function (node) {
        while (node = node.previousSibling) if (node.nodeType == 1) break;
        return node;
    },
    nextSibling: function (node) {
        while (node = node.nextSibling) if (node.nodeType == 1) break;
        return node;
    },
    fireEvent: function (element, event) {
        if (element.dispatchEvent) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent(event, true, true);
            return !element.dispatchEvent(evt);
        } else if (document.createEventObject) {
            var evt = document.createEventObject();
            return element.fireEvent('on' + event, evt);
        }
    },
    isParent: function (p, c) {
        while (c.parentNode) {
            if (p == c) {
                return true;
            }
            c = c.parentNode;
        }
        return false;
    },
    inherit: function (Child, Parent) {
        var F = function () {
        }
        F.prototype = Parent.prototype
        Child.prototype = new F()
        Child.prototype.constructor = Child
        Child.superclass = Parent.prototype
    },
    extend: function (obj) {
        for (var i = 1; i < arguments.length; i++) {
            for (var p in arguments[i]) {
                if (arguments[i].hasOwnProperty(p)) {
                    obj[p] = arguments[i][p];
                }
            }
        }
        return obj;
    },
    hasClass: function (obj, cname) {
        return (obj.className ? obj.className.match(new RegExp('(\\s|^)' + cname + '(\\s|$)')) : false);
    },
    addClass: function (obj, cname) {
        if (!this.hasClass(obj, cname)) obj.className += (!obj.className.length || obj.className.charAt(obj.className.length - 1) === ' ' ? '' : ' ') + cname;
    },
    removeClass: function (obj, cname) {
        if (this.hasClass(obj, cname)) obj.className = obj.className.replace(new RegExp('(\\s|^)' + cname + '(\\s|$)'), ' ').replace(/\s+$/, '');
    },
    toggleClass: function (obj, cname, condition) {
        if (condition) this.addClass(obj, cname); else this.removeClass(obj, cname);
    },
    createElement: function (tagName, options) {
        var el = document.createElement(tagName);
        for (var p in options) {
            if (options.hasOwnProperty(p)) {
                switch (p) {
                    case 'class':
                        el.className = options[p];
                        break;
                    case 'html':
                        el.innerHTML = options[p];
                        break;
                    case 'style':
                        this.setStyles(el, options[p]);
                        break;
                    default:
                        el.setAttribute(p, options[p]);
                }
            }
        }
        return el;
    },
    setStyles: function (el, styles) {
        for (var p in styles) {
            if (styles.hasOwnProperty(p)) {
                switch (p) {
                    case 'float':
                        el.style.cssFloat = styles[p];
                        break;
                    case 'opacity':
                        el.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + styles[p] * 100 + ')';
                        el.style.opacity = styles[p];
                        break;
                    default:
                        el.style[p] = (typeof styles[p] === 'undefined' ? 0 : styles[p]) + (typeof styles[p] === 'number' ? 'px' : '');
                }
            }
        }
        return el;
    },
    getInnerWidth: function (el) {
        return el.offsetWidth - (parseInt(this.getStyle(el, 'paddingLeft')) || 0) - (parseInt(this.getStyle(el, 'paddingRight')) || 0);
    },
    getInnerHeight: function (el) {
        return el.offsetHeight - (parseInt(this.getStyle(el, 'paddingTop')) || 0) - (parseInt(this.getStyle(el, 'paddingBottom')) || 0);
    },
    getAllClasses: function (cname, prefix, skip) {
        if (!skip) skip = '';
        if (!prefix) prefix = '';
        return cname ? cname.replace(new RegExp('(\\s|^)' + skip + '(\\s|$)'), ' ').replace(/[\s]*([\S]+)+[\s]*/gi, prefix + "$1 ") : '';
    },
    getElementsBySelector: function (selector, scope) {
        if (typeof document.querySelectorAll === 'function') {
            return (scope || document).querySelectorAll(selector);
        }
        var selectors = selector.split(',');
        var resultList = [];
        for (var s = 0; s < selectors.length; s++) {
            var currentContext = [scope || document];
            var tokens = selectors[s].replace(/^\s+/, '').replace(/\s+$/, '').split(' ');
            for (var i = 0; i < tokens.length; i++) {
                token = tokens[i].replace(/^\s+/, '').replace(/\s+$/, '');
                if (token.indexOf('#') > -1) {
                    var bits = token.split('#'), tagName = bits[0], id = bits[1];
                    var element = document.getElementById(id);
                    if (tagName && element.nodeName.toLowerCase() != tagName) {
                        return [];
                    }
                    currentContext = [element];
                    continue;
                }
                if (token.indexOf('.') > -1) {
                    var bits = token.split('.'), tagName = bits[0] || '*', className = bits[1], found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; j < elements.length; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (found[k].className && found[k].className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
                    var tagName = RegExp.$1 || '*', attrName = RegExp.$2, attrOperator = RegExp.$3, attrValue = RegExp.$4;
                    if (attrName.toLowerCase() == 'for' && this.browser.msie && this.browser.version < 8) {
                        attrName = 'htmlFor';
                    }
                    var found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; elements[j]; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0, checkFunction;
                    switch (attrOperator) {
                        case '=':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName) == attrValue)
                            };
                            break;
                        case '~':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).match(new RegExp('(\\s|^)' + attrValue + '(\\s|$)')))
                            };
                            break;
                        case '|':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).match(new RegExp('^' + attrValue + '-?')))
                            };
                            break;
                        case '^':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).indexOf(attrValue) == 0)
                            };
                            break;
                        case '$':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length)
                            };
                            break;
                        case '*':
                            checkFunction = function (e) {
                                return (e.getAttribute(attrName).indexOf(attrValue) > -1)
                            };
                            break;
                        default :
                            checkFunction = function (e) {
                                return e.getAttribute(attrName)
                            };
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (checkFunction(found[k])) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                tagName = token;
                var found = [], foundCount = 0;
                for (var h = 0; h < currentContext.length; h++) {
                    var elements = currentContext[h].getElementsByTagName(tagName);
                    for (var j = 0; j < elements.length; j++) {
                        found[foundCount++] = elements[j];
                    }
                }
                currentContext = found;
            }
            resultList = [].concat(resultList, currentContext);
        }
        return resultList;
    },
    scrollSize: (function () {
        var content, hold, sizeBefore, sizeAfter;

        function buildSizer() {
            if (hold) removeSizer();
            content = document.createElement('div');
            hold = document.createElement('div');
            hold.style.cssText = 'position:absolute;overflow:hidden;width:100px;height:100px';
            hold.appendChild(content);
            document.body.appendChild(hold);
        }

        function removeSizer() {
            document.body.removeChild(hold);
            hold = null;
        }

        function calcSize(vertical) {
            buildSizer();
            content.style.cssText = 'height:' + (vertical ? '100%' : '200px');
            sizeBefore = (vertical ? content.offsetHeight : content.offsetWidth);
            hold.style.overflow = 'scroll';
            content.innerHTML = 1;
            sizeAfter = (vertical ? content.offsetHeight : content.offsetWidth);
            if (vertical && hold.clientHeight) sizeAfter = hold.clientHeight;
            removeSizer();
            return sizeBefore - sizeAfter;
        }

        return {
            getWidth: function () {
                return calcSize(false);
            },
            getHeight: function () {
                return calcSize(true)
            }
        }
    }()),
    domReady: function (handler) {
        var called = false

        function ready() {
            if (called) return;
            called = true;
            handler();
        }

        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", ready, false);
        } else if (document.attachEvent) {
            if (document.documentElement.doScroll && window == window.top) {
                function tryScroll() {
                    if (called) return
                    if (!document.body) return
                    try {
                        document.documentElement.doScroll("left")
                        ready()
                    } catch (e) {
                        setTimeout(tryScroll, 0)
                    }
                }

                tryScroll()
            }
            document.attachEvent("onreadystatechange", function () {
                if (document.readyState === "complete") {
                    ready()
                }
            })
        }
        if (window.addEventListener) window.addEventListener('load', ready, false)
        else if (window.attachEvent) window.attachEvent('onload', ready)
    },
    event: (function () {
        var guid = 0;

        function fixEvent(e) {
            e = e || window.event;
            if (e.isFixed) {
                return e;
            }
            e.isFixed = true;
            e.preventDefault = e.preventDefault || function () {
                this.returnValue = false
            }
            e.stopPropagation = e.stopPropagaton || function () {
                this.cancelBubble = true
            }
            if (!e.target) {
                e.target = e.srcElement
            }
            if (!e.relatedTarget && e.fromElement) {
                e.relatedTarget = e.fromElement == e.target ? e.toElement : e.fromElement;
            }
            if (e.pageX == null && e.clientX != null) {
                var html = document.documentElement, body = document.body;
                e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
                e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
            }
            if (!e.which && e.button) {
                e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0));
            }
            if (e.type === "DOMMouseScroll" || e.type === 'mousewheel') {
                e.mWheelDelta = 0;
                if (e.wheelDelta) {
                    e.mWheelDelta = e.wheelDelta / 120;
                } else if (e.detail) {
                    e.mWheelDelta = -e.detail / 3;
                }
            }
            return e;
        }

        function commonHandle(event, customScope) {
            event = fixEvent(event);
            var handlers = this.events[event.type];
            for (var g in handlers) {
                var handler = handlers[g];
                var ret = handler.call(customScope || this, event);
                if (ret === false) {
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
        }

        var publicAPI = {
            add: function (elem, type, handler, forcedScope) {
                if (elem.setInterval && (elem != window && !elem.frameElement)) {
                    elem = window;
                }
                if (!handler.guid) {
                    handler.guid = ++guid;
                }
                if (!elem.events) {
                    elem.events = {};
                    elem.handle = function (event) {
                        return commonHandle.call(elem, event);
                    }
                }
                if (!elem.events[type]) {
                    elem.events[type] = {};
                    if (elem.addEventListener) elem.addEventListener(type, elem.handle, false);
                    else if (elem.attachEvent) elem.attachEvent("on" + type, elem.handle);
                    if (type === 'mousewheel') {
                        publicAPI.add(elem, 'DOMMouseScroll', handler, forcedScope);
                    }
                }
                var fakeHandler = jcf.lib.bind(handler, forcedScope);
                fakeHandler.guid = handler.guid;
                elem.events[type][handler.guid] = forcedScope ? fakeHandler : handler;
            },
            remove: function (elem, type, handler) {
                var handlers = elem.events && elem.events[type];
                if (!handlers) return;
                delete handlers[handler.guid];
                for (var any in handlers) return;
                if (elem.removeEventListener) elem.removeEventListener(type, elem.handle, false);
                else if (elem.detachEvent) elem.detachEvent("on" + type, elem.handle);
                delete elem.events[type];
                for (var any in elem.events) return;
                try {
                    delete elem.handle;
                    delete elem.events;
                } catch (e) {
                    if (elem.removeAttribute) {
                        elem.removeAttribute("handle");
                        elem.removeAttribute("events");
                    }
                }
                if (type === 'mousewheel') {
                    publicAPI.remove(elem, 'DOMMouseScroll', handler);
                }
            }
        }
        return publicAPI;
    }())
}

// custom checkbox module
jcf.addModule({
    name: 'checkbox',
    selector: 'input[type="checkbox"]',
    defaultOptions: {
        wrapperClass: 'chk-area',
        focusClass: 'chk-focus',
        checkedClass: 'chk-checked',
        labelActiveClass: 'chk-label-active',
        uncheckedClass: 'chk-unchecked',
        disabledClass: 'chk-disabled',
        chkStructure: '<span></span>'
    },
    setupWrapper: function () {
        jcf.lib.addClass(this.fakeElement, this.options.wrapperClass);
        this.fakeElement.innerHTML = this.options.chkStructure;
        this.realElement.parentNode.insertBefore(this.fakeElement, this.realElement);
        jcf.lib.event.add(this.realElement, 'click', this.onRealClick, this);
        this.refreshState();
        if (this.realElement.getAttribute('data-color')) this.fakeElement.style.borderColor = this.realElement.getAttribute('data-color');

        jcf.lib.event.add(this.realElement.parentNode, 'mouseover', function () {
            if (this.realElement.getAttribute('data-hover')) this.realElement.parentNode.style.backgroundColor = this.realElement.getAttribute('data-hover');
        }, this);
        jcf.lib.event.add(this.realElement.parentNode, 'mouseout', function () {
            if (this.realElement.getAttribute('data-hover')) this.realElement.parentNode.style.backgroundColor = '';
        }, this);
    },
    isLinkTarget: function (target, limitParent) {
        while (target.parentNode || target === limitParent) {
            if (target.tagName.toLowerCase() === 'a') {
                return true;
            }
            target = target.parentNode;
        }
    },
    onFakePressed: function () {
        jcf.modules[this.name].superclass.onFakePressed.apply(this, arguments);
        if (!this.realElement.disabled) {
            this.realElement.focus();
        }
    },
    onFakeClick: function (e) {
        jcf.modules[this.name].superclass.onFakeClick.apply(this, arguments);
        this.tmpTimer = setTimeout(jcf.lib.bind(function () {
            this.toggle();
        }, this), 10);
        if (!this.isLinkTarget(e.target, this.labelFor)) {
            return false;
        }
    },
    onRealClick: function (e) {
        setTimeout(jcf.lib.bind(function () {
            this.refreshState();
        }, this), 10);
        e.stopPropagation();
    },
    toggle: function (e) {
        if (!this.realElement.disabled) {
            if (this.realElement.checked) {
                this.realElement.checked = false;
            } else {
                this.realElement.checked = true;
            }
            jQuery(this.realElement).trigger('change');
        }
        this.refreshState();
        return false;
    },
    refreshState: function () {
        if (this.realElement.checked) {
            jcf.lib.addClass(this.fakeElement, this.options.checkedClass);
            jcf.lib.removeClass(this.fakeElement, this.options.uncheckedClass);
            if (this.realElement.getAttribute('data-color')) this.fakeElement.style.backgroundColor = this.realElement.getAttribute('data-color');
            if (this.labelFor) {
                jcf.lib.addClass(this.labelFor, this.options.labelActiveClass);
            }
        } else {
            jcf.lib.removeClass(this.fakeElement, this.options.checkedClass);
            jcf.lib.addClass(this.fakeElement, this.options.uncheckedClass);
            if (this.realElement.getAttribute('data-color')) this.fakeElement.style.backgroundColor = 'transparent';
            if (this.labelFor) {
                jcf.lib.removeClass(this.labelFor, this.options.labelActiveClass);
            }
        }
        if (this.realElement.disabled) {
            jcf.lib.addClass(this.fakeElement, this.options.disabledClass);
            if (this.labelFor) {
                jcf.lib.addClass(this.labelFor, this.options.labelDisabledClass);
            }
        } else {
            jcf.lib.removeClass(this.fakeElement, this.options.disabledClass);
            if (this.labelFor) {
                jcf.lib.removeClass(this.labelFor, this.options.labelDisabledClass);
            }
        }
    }
});

// custom scrollbars module
jcf.addModule({
    name: 'customscroll',
    selector: 'div.scrollable-area',
    defaultOptions: {
        alwaysPreventWheel: false,
        enableMouseWheel: true,
        captureFocus: false,
        handleNested: true,
        alwaysKeepScrollbars: false,
        autoDetectWidth: false,
        scrollbarOptions: {},
        focusClass: 'scrollable-focus',
        wrapperTag: 'div',
        autoDetectWidthClass: 'autodetect-width',
        noHorizontalBarClass: 'noscroll-horizontal',
        noVerticalBarClass: 'noscroll-vertical',
        innerWrapperClass: 'scrollable-inner-wrapper',
        outerWrapperClass: 'scrollable-area-wrapper',
        horizontalClass: 'hscrollable',
        verticalClass: 'vscrollable',
        bothClass: 'anyscrollable'
    },
    replaceObject: function () {
        this.initStructure();
        this.refreshState();
        this.addEvents();
    },
    initStructure: function () {
        // set scroll type
        this.realElement.jcf = this;
        if (jcf.lib.hasClass(this.realElement, this.options.bothClass) ||
            jcf.lib.hasClass(this.realElement, this.options.horizontalClass) && jcf.lib.hasClass(this.realElement, this.options.verticalClass)) {
            this.scrollType = 'both';
        } else if (jcf.lib.hasClass(this.realElement, this.options.horizontalClass)) {
            this.scrollType = 'horizontal';
        } else {
            this.scrollType = 'vertical';
        }

        // autodetect horizontal width
        if (jcf.lib.hasClass(this.realElement, this.options.autoDetectWidthClass)) {
            this.options.autoDetectWidth = true;
        }

        // init dimensions and build structure
        this.realElement.style.position = 'relative';
        this.realElement.style.overflow = 'hidden';

        // build content wrapper and scrollbar(s)
        this.buildWrapper();
        this.buildScrollbars();
    },
    buildWrapper: function () {
        this.outerWrapper = document.createElement(this.options.wrapperTag);
        this.outerWrapper.className = this.options.outerWrapperClass;
        this.realElement.parentNode.insertBefore(this.outerWrapper, this.realElement);
        this.outerWrapper.appendChild(this.realElement);

        // autosize content if single child
        if (this.options.autoDetectWidth && (this.scrollType === 'both' || this.scrollType === 'horizontal') && this.realElement.children.length === 1) {
            var tmpWidth = 0;
            this.realElement.style.width = '99999px';
            tmpWidth = this.realElement.children[0].offsetWidth;
            this.realElement.style.width = '';
            if (tmpWidth) {
                this.realElement.children[0].style.width = tmpWidth + 'px';
            }
        }
    },
    buildScrollbars: function () {
        if (this.scrollType === 'horizontal' || this.scrollType === 'both') {
            this.hScrollBar = new jcf.plugins.scrollbar(jcf.lib.extend(this.options.scrollbarOptions, {
                vertical: false,
                spawnClass: this,
                holder: this.outerWrapper,
                range: this.realElement.scrollWidth - this.realElement.offsetWidth,
                size: this.realElement.offsetWidth,
                onScroll: jcf.lib.bind(function (v) {
                    this.realElement.scrollLeft = v;
                }, this)
            }));
        }
        if (this.scrollType === 'vertical' || this.scrollType === 'both') {
            this.vScrollBar = new jcf.plugins.scrollbar(jcf.lib.extend(this.options.scrollbarOptions, {
                vertical: true,
                spawnClass: this,
                holder: this.outerWrapper,
                range: this.realElement.scrollHeight - this.realElement.offsetHeight,
                size: this.realElement.offsetHeight,
                onScroll: jcf.lib.bind(function (v) {
                    this.realElement.scrollTop = v;
                }, this)
            }));
        }
        this.outerWrapper.style.width = this.realElement.offsetWidth + 'px';
        this.outerWrapper.style.height = this.realElement.offsetHeight + 'px';
        this.resizeScrollContent();
    },
    resizeScrollContent: function () {
        var diffWidth = this.realElement.offsetWidth - jcf.lib.getInnerWidth(this.realElement);
        var diffHeight = this.realElement.offsetHeight - jcf.lib.getInnerHeight(this.realElement);
        this.realElement.style.width = Math.max(0, this.outerWrapper.offsetWidth - diffWidth - (this.vScrollBar ? this.vScrollBar.getScrollBarSize() : 0)) + 'px';
        this.realElement.style.height = Math.max(0, this.outerWrapper.offsetHeight - diffHeight - (this.hScrollBar ? this.hScrollBar.getScrollBarSize() : 0)) + 'px';
    },
    addEvents: function () {
        // enable mouse wheel handling
        if (!jcf.isTouchDevice && this.options.enableMouseWheel) {
            jcf.lib.event.add(this.outerWrapper, 'mousewheel', this.onMouseWheel, this);
        }
        // add touch scroll on block body
        if (jcf.isTouchDevice || navigator.msPointerEnabled) {
            this.outerWrapper.style.msTouchAction = 'none';
            jcf.lib.event.add(this.realElement, jcf.eventPress, this.onScrollablePress, this);
        }

        // handle nested scrollbars
        if (this.options.handleNested) {
            var el = this.realElement, name = this.name;
            while (el.parentNode) {
                if (el.parentNode.jcf && el.parentNode.jcf.name == name) {
                    el.parentNode.jcf.refreshState();
                }
                el = el.parentNode;
            }
        }
    },
    onMouseWheel: function (e) {
        if (this.scrollType === 'vertical' || this.scrollType === 'both') {
            return this.vScrollBar.doScrollWheelStep(e.mWheelDelta) === false ? false : !this.options.alwaysPreventWheel;
        } else {
            return this.hScrollBar.doScrollWheelStep(e.mWheelDelta) === false ? false : !this.options.alwaysPreventWheel;
        }
    },
    onScrollablePress: function (e) {
        if (e.pointerType !== e.MSPOINTER_TYPE_TOUCH) return;

        this.preventFlag = true;
        this.origWindowScrollTop = jcf.lib.getScrollTop();
        this.origWindowScrollLeft = jcf.lib.getScrollLeft();

        this.scrollableOffset = jcf.lib.getOffset(this.realElement);
        if (this.hScrollBar) {
            this.scrollableTouchX = (jcf.isTouchDevice ? e.changedTouches[0] : e).pageX;
            this.origValueX = this.hScrollBar.getScrollValue();
        }
        if (this.vScrollBar) {
            this.scrollableTouchY = (jcf.isTouchDevice ? e.changedTouches[0] : e).pageY;
            this.origValueY = this.vScrollBar.getScrollValue();
        }
        jcf.lib.event.add(this.realElement, jcf.eventMove, this.onScrollableMove, this);
        jcf.lib.event.add(this.realElement, jcf.eventRelease, this.onScrollableRelease, this);
    },
    onScrollableMove: function (e) {
        if (this.vScrollBar) {
            var difY = (jcf.isTouchDevice ? e.changedTouches[0] : e).pageY - this.scrollableTouchY;
            var valY = this.origValueY - difY;
            this.vScrollBar.scrollTo(valY);
            if (valY < 0 || valY > this.vScrollBar.options.range) {
                this.preventFlag = false;
            }
        }
        if (this.hScrollBar) {
            var difX = (jcf.isTouchDevice ? e.changedTouches[0] : e).pageX - this.scrollableTouchX;
            var valX = this.origValueX - difX;
            this.hScrollBar.scrollTo(valX);
            if (valX < 0 || valX > this.hScrollBar.options.range) {
                this.preventFlag = false;
            }
        }
        if (this.preventFlag) {
            e.preventDefault();
        }
    },
    onScrollableRelease: function () {
        jcf.lib.event.remove(this.realElement, jcf.eventMove, this.onScrollableMove);
        jcf.lib.event.remove(this.realElement, jcf.eventRelease, this.onScrollableRelease);
    },
    refreshState: function () {
        if (this.options.alwaysKeepScrollbars) {
            if (this.hScrollBar) this.hScrollBar.scrollBar.style.display = 'block';
            if (this.vScrollBar) this.vScrollBar.scrollBar.style.display = 'block';
        } else {
            if (this.hScrollBar) {
                if (this.getScrollRange(false)) {
                    this.hScrollBar.scrollBar.style.display = 'block';
                    this.resizeScrollContent();
                    this.hScrollBar.setRange(this.getScrollRange(false));
                } else {
                    this.hScrollBar.scrollBar.style.display = 'none';
                    this.realElement.style.width = this.outerWrapper.style.width;
                }
                jcf.lib.toggleClass(this.outerWrapper, this.options.noHorizontalBarClass, this.hScrollBar.options.range === 0);
            }
            if (this.vScrollBar) {
                if (this.getScrollRange(true) > 0) {
                    this.vScrollBar.scrollBar.style.display = 'block';
                    this.resizeScrollContent();
                    this.vScrollBar.setRange(this.getScrollRange(true));
                } else {
                    this.vScrollBar.scrollBar.style.display = 'none';
                    this.realElement.style.width = this.outerWrapper.style.width;
                }
                jcf.lib.toggleClass(this.outerWrapper, this.options.noVerticalBarClass, this.vScrollBar.options.range === 0);
            }
        }
        if (this.vScrollBar) {
            this.vScrollBar.setRange(this.realElement.scrollHeight - this.realElement.offsetHeight);
            this.vScrollBar.setSize(this.realElement.offsetHeight);
            this.vScrollBar.scrollTo(this.realElement.scrollTop);
        }
        if (this.hScrollBar) {
            this.hScrollBar.setRange(this.realElement.scrollWidth - this.realElement.offsetWidth);
            this.hScrollBar.setSize(this.realElement.offsetWidth);
            this.hScrollBar.scrollTo(this.realElement.scrollLeft);
        }
    },
    getScrollRange: function (isVertical) {
        if (isVertical) {
            return this.realElement.scrollHeight - this.realElement.offsetHeight;
        } else {
            return this.realElement.scrollWidth - this.realElement.offsetWidth;
        }
    },
    getCurrentRange: function (scrollInstance) {
        return this.getScrollRange(scrollInstance.isVertical);
    },
    onCreateModule: function () {
        if (jcf.modules.select) {
            this.extendSelect();
        }
        if (jcf.modules.selectmultiple) {
            this.extendSelectMultiple();
        }
        if (jcf.modules.textarea) {
            this.extendTextarea();
        }
    },
    onModuleAdded: function (module) {
        if (module.prototype.name == 'select') {
            this.extendSelect();
        }
        if (module.prototype.name == 'selectmultiple') {
            this.extendSelectMultiple();
        }
        if (module.prototype.name == 'textarea') {
            this.extendTextarea();
        }
    },
    extendSelect: function () {
        // add scrollable if needed on control ready
        jcf.modules.select.prototype.onControlReady = function (obj) {
            if (obj.selectList.scrollHeight > obj.selectList.offsetHeight) {
                obj.jcfScrollable = new jcf.modules.customscroll({
                    alwaysPreventWheel: true,
                    replaces: obj.selectList
                });
            }
        }
        // update scroll function
        var orig = jcf.modules.select.prototype.scrollToItem;
        jcf.modules.select.prototype.scrollToItem = function () {
            orig.apply(this);
            if (this.jcfScrollable) {
                this.jcfScrollable.refreshState();
            }
        }
    },
    extendTextarea: function () {
        // add scrollable if needed on control ready
        jcf.modules.textarea.prototype.onControlReady = function (obj) {
            obj.jcfScrollable = new jcf.modules.customscroll({
                alwaysKeepScrollbars: true,
                alwaysPreventWheel: true,
                replaces: obj.realElement
            });
        }
        // update scroll function
        var orig = jcf.modules.textarea.prototype.refreshState;
        jcf.modules.textarea.prototype.refreshState = function () {
            orig.apply(this);
            if (this.jcfScrollable) {
                this.jcfScrollable.refreshState();
            }
        }
    },
    extendSelectMultiple: function () {
        // add scrollable if needed on control ready
        jcf.modules.selectmultiple.prototype.onControlReady = function (obj) {
            //if(obj.optionsHolder.scrollHeight > obj.optionsHolder.offsetHeight) {
            obj.jcfScrollable = new jcf.modules.customscroll({
                alwaysPreventWheel: true,
                replaces: obj.optionsHolder
            });
            //}
        }
        // update scroll function
        var orig = jcf.modules.selectmultiple.prototype.scrollToItem;
        jcf.modules.selectmultiple.prototype.scrollToItem = function () {
            orig.apply(this);
            if (this.jcfScrollable) {
                this.jcfScrollable.refreshState();
            }
        }

        // update scroll size?
        var orig2 = jcf.modules.selectmultiple.prototype.rebuildOptions;
        jcf.modules.selectmultiple.prototype.rebuildOptions = function () {
            orig2.apply(this);
            if (this.jcfScrollable) {
                this.jcfScrollable.refreshState();
            }
        }

    }
});

// scrollbar plugin
jcf.addPlugin({
    name: 'scrollbar',
    defaultOptions: {
        size: 0,
        range: 0,
        moveStep: 6,
        moveDistance: 50,
        moveInterval: 10,
        trackHoldDelay: 900,
        holder: null,
        vertical: true,
        scrollTag: 'div',
        onScroll: function () {
        },
        onScrollEnd: function () {
        },
        onScrollStart: function () {
        },
        disabledClass: 'btn-disabled',
        VscrollBarClass: 'vscrollbar',
        VscrollStructure: '<div class="vscroll-up"></div><div class="vscroll-line"><div class="vscroll-slider"><div class="scroll-bar-top"></div><div class="scroll-bar-bottom"></div></div></div></div><div class="vscroll-down"></div>',
        VscrollTrack: 'div.vscroll-line',
        VscrollBtnDecClass: 'div.vscroll-up',
        VscrollBtnIncClass: 'div.vscroll-down',
        VscrollSliderClass: 'div.vscroll-slider',
        HscrollBarClass: 'hscrollbar',
        HscrollStructure: '<div class="hscroll-left"></div><div class="hscroll-line"><div class="hscroll-slider"><div class="scroll-bar-left"></div><div class="scroll-bar-right"></div></div></div></div><div class="hscroll-right"></div>',
        HscrollTrack: 'div.hscroll-line',
        HscrollBtnDecClass: 'div.hscroll-left',
        HscrollBtnIncClass: 'div.hscroll-right',
        HscrollSliderClass: 'div.hscroll-slider'
    },
    init: function (userOptions) {
        this.setOptions(userOptions);
        this.createScrollBar();
        this.attachEvents();
        this.setSize();
    },
    setOptions: function (extOptions) {
        // merge options
        this.options = jcf.lib.extend({}, this.defaultOptions, extOptions);
        this.isVertical = this.options.vertical;
        this.prefix = this.isVertical ? 'V' : 'H';
        this.eventPageOffsetProperty = this.isVertical ? 'pageY' : 'pageX';
        this.positionProperty = this.isVertical ? 'top' : 'left';
        this.sizeProperty = this.isVertical ? 'height' : 'width';
        this.dimenionsProperty = this.isVertical ? 'offsetHeight' : 'offsetWidth';
        this.invertedDimenionsProperty = !this.isVertical ? 'offsetHeight' : 'offsetWidth';

        // set corresponding classes
        for (var p in this.options) {
            if (p.indexOf(this.prefix) == 0) {
                this.options[p.substr(1)] = this.options[p];
            }
        }
    },
    createScrollBar: function () {
        // create dimensions
        this.scrollBar = document.createElement(this.options.scrollTag);
        this.scrollBar.className = this.options.scrollBarClass;
        this.scrollBar.innerHTML = this.options.scrollStructure;

        // get elements
        this.track = jcf.lib.queryBySelector(this.options.scrollTrack, this.scrollBar)[0];
        this.btnDec = jcf.lib.queryBySelector(this.options.scrollBtnDecClass, this.scrollBar)[0];
        this.btnInc = jcf.lib.queryBySelector(this.options.scrollBtnIncClass, this.scrollBar)[0];
        this.slider = jcf.lib.queryBySelector(this.options.scrollSliderClass, this.scrollBar)[0];
        this.slider.style.position = 'absolute';
        this.track.style.position = 'relative';
    },
    attachEvents: function () {
        // append scrollbar to holder if provided
        if (this.options.holder) {
            this.options.holder.appendChild(this.scrollBar);
        }

        // attach listeners for slider and buttons
        jcf.lib.event.add(this.slider, jcf.eventPress, this.onSliderPressed, this);
        jcf.lib.event.add(this.btnDec, jcf.eventPress, this.onBtnDecPressed, this);
        jcf.lib.event.add(this.btnInc, jcf.eventPress, this.onBtnIncPressed, this);
        jcf.lib.event.add(this.track, jcf.eventPress, this.onTrackPressed, this);
    },
    setSize: function (value) {
        if (typeof value === 'number') {
            this.options.size = value;
        }
        this.scrollOffset = this.scrollValue = this.sliderOffset = 0;
        this.scrollBar.style[this.sizeProperty] = this.options.size + 'px';
        this.resizeControls();
        this.refreshSlider();
    },
    setRange: function (r) {
        this.options.range = Math.max(r, 0);
        this.resizeControls();
    },
    doScrollWheelStep: function (direction) {
        // 1 - scroll up, -1 scroll down
        this.startScroll();
        if ((direction < 0 && !this.isEndPosition()) || (direction > 0 && !this.isStartPosition())) {
            this.scrollTo(this.getScrollValue() - this.options.moveDistance * direction);
            this.moveScroll();
            this.endScroll();
            return false;
        }
    },
    resizeControls: function () {
        // calculate dimensions
        this.barSize = this.scrollBar[this.dimenionsProperty];
        this.btnDecSize = this.btnDec[this.dimenionsProperty];
        this.btnIncSize = this.btnInc[this.dimenionsProperty];
        this.trackSize = this.barSize - this.btnDecSize - this.btnIncSize;

        // resize and reposition elements
        this.track.style[this.sizeProperty] = this.trackSize + 'px';
        this.trackSize = this.track[this.dimenionsProperty];
        this.sliderSize = this.getSliderSize();
        this.slider.style[this.sizeProperty] = this.sliderSize + 'px';
        this.sliderSize = this.slider[this.dimenionsProperty];
    },
    refreshSlider: function (complete) {
        // refresh dimensions
        if (complete) {
            this.resizeControls();
        }
        // redraw slider and classes
        this.sliderOffset = isNaN(this.sliderOffset) ? 0 : this.sliderOffset;
        this.slider.style[this.positionProperty] = this.sliderOffset + 'px';
    },
    startScroll: function () {
        // refresh range if possible
        if (this.options.spawnClass && typeof this.options.spawnClass.getCurrentRange === 'function') {
            this.setRange(this.options.spawnClass.getCurrentRange(this));
        }
        this.resizeControls();
        this.scrollBarOffset = jcf.lib.getOffset(this.track)[this.positionProperty];
        this.options.onScrollStart();
    },
    moveScroll: function () {
        this.options.onScroll(this.scrollValue);

        // add disabled classes
        jcf.lib.removeClass(this.btnDec, this.options.disabledClass);
        jcf.lib.removeClass(this.btnInc, this.options.disabledClass);
        if (this.scrollValue === 0) {
            jcf.lib.addClass(this.btnDec, this.options.disabledClass);
        }
        if (this.scrollValue === this.options.range) {
            jcf.lib.addClass(this.btnInc, this.options.disabledClass);
        }
    },
    endScroll: function () {
        this.options.onScrollEnd();
    },
    startButtonMoveScroll: function (direction) {
        this.startScroll();
        clearInterval(this.buttonScrollTimer);
        this.buttonScrollTimer = setInterval(jcf.lib.bind(function () {
            this.scrollValue += this.options.moveStep * direction
            if (this.scrollValue > this.options.range) {
                this.scrollValue = this.options.range;
                this.endButtonMoveScroll();
            } else if (this.scrollValue < 0) {
                this.scrollValue = 0;
                this.endButtonMoveScroll();
            }
            this.scrollTo(this.scrollValue);

        }, this), this.options.moveInterval);
    },
    endButtonMoveScroll: function () {
        clearInterval(this.buttonScrollTimer);
        this.endScroll();
    },
    isStartPosition: function () {
        return this.scrollValue === 0;
    },
    isEndPosition: function () {
        return this.scrollValue === this.options.range;
    },
    getSliderSize: function () {
        return Math.round(this.getSliderSizePercent() * this.trackSize / 100);
    },
    getSliderSizePercent: function () {
        return this.options.range === 0 ? 0 : this.barSize * 100 / (this.barSize + this.options.range);
    },
    getSliderOffsetByScrollValue: function () {
        return (this.scrollValue * 100 / this.options.range) * (this.trackSize - this.sliderSize) / 100;
    },
    getSliderOffsetPercent: function () {
        return this.sliderOffset * 100 / (this.trackSize - this.sliderSize);
    },
    getScrollValueBySliderOffset: function () {
        return this.getSliderOffsetPercent() * this.options.range / 100;
    },
    getScrollBarSize: function () {
        return this.scrollBar[this.invertedDimenionsProperty];
    },
    getScrollValue: function () {
        return this.scrollValue || 0;
    },
    scrollOnePage: function (direction) {
        this.scrollTo(this.scrollValue + direction * this.barSize);
    },
    scrollTo: function (x) {
        this.scrollValue = x < 0 ? 0 : x > this.options.range ? this.options.range : x;
        this.sliderOffset = this.getSliderOffsetByScrollValue();
        this.refreshSlider();
        this.moveScroll();
    },
    onSliderPressed: function (e) {
        jcf.lib.event.add(document.body, jcf.eventRelease, this.onSliderRelease, this);
        jcf.lib.event.add(document.body, jcf.eventMove, this.onSliderMove, this);
        jcf.lib.disableTextSelection(this.slider);

        // calculate offsets once
        this.sliderInnerOffset = (jcf.isTouchDevice ? e.changedTouches[0] : e)[this.eventPageOffsetProperty] - jcf.lib.getOffset(this.slider)[this.positionProperty];
        this.startScroll();
        return false;
    },
    onSliderRelease: function () {
        jcf.lib.event.remove(document.body, jcf.eventRelease, this.onSliderRelease);
        jcf.lib.event.remove(document.body, jcf.eventMove, this.onSliderMove);
    },
    onSliderMove: function (e) {
        this.sliderOffset = (jcf.isTouchDevice ? e.changedTouches[0] : e)[this.eventPageOffsetProperty] - this.scrollBarOffset - this.sliderInnerOffset;
        if (this.sliderOffset < 0) {
            this.sliderOffset = 0;
        } else if (this.sliderOffset + this.sliderSize > this.trackSize) {
            this.sliderOffset = this.trackSize - this.sliderSize;
        }
        if (this.previousOffset != this.sliderOffset) {
            this.previousOffset = this.sliderOffset;
            this.scrollTo(this.getScrollValueBySliderOffset());
        }
    },
    onBtnIncPressed: function () {
        jcf.lib.event.add(document.body, jcf.eventRelease, this.onBtnIncRelease, this);
        jcf.lib.disableTextSelection(this.btnInc);
        this.startButtonMoveScroll(1);
        return false;
    },
    onBtnIncRelease: function () {
        jcf.lib.event.remove(document.body, jcf.eventRelease, this.onBtnIncRelease);
        this.endButtonMoveScroll();
    },
    onBtnDecPressed: function () {
        jcf.lib.event.add(document.body, jcf.eventRelease, this.onBtnDecRelease, this);
        jcf.lib.disableTextSelection(this.btnDec);
        this.startButtonMoveScroll(-1);
        return false;
    },
    onBtnDecRelease: function () {
        jcf.lib.event.remove(document.body, jcf.eventRelease, this.onBtnDecRelease);
        this.endButtonMoveScroll();
    },
    onTrackPressed: function (e) {
        var position = e[this.eventPageOffsetProperty] - jcf.lib.getOffset(this.track)[this.positionProperty];
        var direction = position < this.sliderOffset ? -1 : position > this.sliderOffset + this.sliderSize ? 1 : 0;
        if (direction) {
            this.scrollOnePage(direction);
        }
    }
});


// placeholder class
;
(function () {
    var placeholderCollection = [];
    PlaceholderInput = function () {
        this.options = {
            element: null,
            showUntilTyping: false,
            wrapWithElement: false,
            getParentByClass: false,
            showPasswordBullets: false,
            placeholderAttr: 'value',
            inputFocusClass: 'focus',
            inputActiveClass: 'text-active',
            parentFocusClass: 'parent-focus',
            parentActiveClass: 'parent-active',
            labelFocusClass: 'label-focus',
            labelActiveClass: 'label-active',
            fakeElementClass: 'input-placeholder-text'
        };
        placeholderCollection.push(this);
        this.init.apply(this, arguments);
    };
    PlaceholderInput.refreshAllInputs = function (except) {
        for (var i = 0; i < placeholderCollection.length; i++) {
            if (except !== placeholderCollection[i]) {
                placeholderCollection[i].refreshState();
            }
        }
    };
    PlaceholderInput.replaceByOptions = function (opt) {
        var inputs = [].concat(
            convertToArray(document.getElementsByTagName('input')),
            convertToArray(document.getElementsByTagName('textarea'))
        );
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].className.indexOf(opt.skipClass) < 0) {
                var inputType = getInputType(inputs[i]);
                var placeholderValue = inputs[i].getAttribute('placeholder');
                if (opt.focusOnly || (opt.clearInputs && (inputType === 'text' || inputType === 'email' || placeholderValue)) ||
                    (opt.clearTextareas && inputType === 'textarea') ||
                    (opt.clearPasswords && inputType === 'password')
                    ) {
                    new PlaceholderInput({
                        element: inputs[i],
                        focusOnly: opt.focusOnly,
                        wrapWithElement: opt.wrapWithElement,
                        showUntilTyping: opt.showUntilTyping,
                        getParentByClass: opt.getParentByClass,
                        showPasswordBullets: opt.showPasswordBullets,
                        placeholderAttr: placeholderValue ? 'placeholder' : opt.placeholderAttr
                    });
                }
            }
        }
    };
    PlaceholderInput.prototype = {
        init: function (opt) {
            this.setOptions(opt);
            if (this.element && this.element.PlaceholderInst) {
                this.element.PlaceholderInst.refreshClasses();
            } else {
                this.element.PlaceholderInst = this;
                if (this.elementType !== 'radio' || this.elementType !== 'checkbox' || this.elementType !== 'file') {
                    this.initElements();
                    this.attachEvents();
                    this.refreshClasses();
                }
            }
        },
        setOptions: function (opt) {
            for (var p in opt) {
                if (opt.hasOwnProperty(p)) {
                    this.options[p] = opt[p];
                }
            }
            if (this.options.element) {
                this.element = this.options.element;
                this.elementType = getInputType(this.element);
                if (this.options.focusOnly) {
                    this.wrapWithElement = false;
                } else {
                    if (this.elementType === 'password' && this.options.showPasswordBullets) {
                        this.wrapWithElement = false;
                    } else {
                        this.wrapWithElement = this.elementType === 'password' || this.options.showUntilTyping ? true : this.options.wrapWithElement;
                    }
                }
                this.setPlaceholderValue(this.options.placeholderAttr);
            }
        },
        setPlaceholderValue: function (attr) {
            this.origValue = (attr === 'value' ? this.element.defaultValue : (this.element.getAttribute(attr) || ''));
            if (this.options.placeholderAttr !== 'value') {
                this.element.removeAttribute(this.options.placeholderAttr);
            }
        },
        initElements: function () {
            // create fake element if needed
            if (this.wrapWithElement) {
                this.fakeElement = document.createElement('span');
                this.fakeElement.className = this.options.fakeElementClass;
                this.fakeElement.innerHTML += this.origValue;
                this.fakeElement.style.color = getStyle(this.element, 'color');
                this.fakeElement.style.position = 'absolute';
                this.element.parentNode.insertBefore(this.fakeElement, this.element);

                if (this.element.value === this.origValue || !this.element.value) {
                    this.element.value = '';
                    this.togglePlaceholderText(true);
                } else {
                    this.togglePlaceholderText(false);
                }
            } else if (!this.element.value && this.origValue.length) {
                this.element.value = this.origValue;
            }
            // get input label
            if (this.element.id) {
                this.labels = document.getElementsByTagName('label');
                for (var i = 0; i < this.labels.length; i++) {
                    if (this.labels[i].htmlFor === this.element.id) {
                        this.labelFor = this.labels[i];
                        break;
                    }
                }
            }
            // get parent node (or parentNode by className)
            this.elementParent = this.element.parentNode;
            if (typeof this.options.getParentByClass === 'string') {
                var el = this.element;
                while (el.parentNode) {
                    if (hasClass(el.parentNode, this.options.getParentByClass)) {
                        this.elementParent = el.parentNode;
                        break;
                    } else {
                        el = el.parentNode;
                    }
                }
            }
        },
        attachEvents: function () {
            this.element.onfocus = bindScope(this.focusHandler, this);
            this.element.onblur = bindScope(this.blurHandler, this);
            if (this.options.showUntilTyping) {
                this.element.onkeydown = bindScope(this.typingHandler, this);
                this.element.onpaste = bindScope(this.typingHandler, this);
            }
            if (this.wrapWithElement) this.fakeElement.onclick = bindScope(this.focusSetter, this);
        },
        togglePlaceholderText: function (state) {
            if (!this.element.readOnly && !this.options.focusOnly) {
                if (this.wrapWithElement) {
                    this.fakeElement.style.display = state ? '' : 'none';
                } else {
                    this.element.value = state ? this.origValue : '';
                }
            }
        },
        focusSetter: function () {
            this.element.focus();
        },
        focusHandler: function () {
            clearInterval(this.checkerInterval);
            this.checkerInterval = setInterval(bindScope(this.intervalHandler, this), 1);
            this.focused = true;
            if (!this.element.value.length || this.element.value === this.origValue) {
                if (!this.options.showUntilTyping) {
                    this.togglePlaceholderText(false);
                }
            }
            this.refreshClasses();
        },
        blurHandler: function () {
            clearInterval(this.checkerInterval);
            this.focused = false;
            if (!this.element.value.length || this.element.value === this.origValue) {
                this.togglePlaceholderText(true);
            }
            this.refreshClasses();
            PlaceholderInput.refreshAllInputs(this);
        },
        typingHandler: function () {
            setTimeout(bindScope(function () {
                if (this.element.value.length) {
                    this.togglePlaceholderText(false);
                    this.refreshClasses();
                }
            }, this), 10);
        },
        intervalHandler: function () {
            if (typeof this.tmpValue === 'undefined') {
                this.tmpValue = this.element.value;
            }
            if (this.tmpValue != this.element.value) {
                PlaceholderInput.refreshAllInputs(this);
            }
        },
        refreshState: function () {
            if (this.wrapWithElement) {
                if (this.element.value.length && this.element.value !== this.origValue) {
                    this.togglePlaceholderText(false);
                } else if (!this.element.value.length) {
                    this.togglePlaceholderText(true);
                }
            }
            this.refreshClasses();
        },
        refreshClasses: function () {
            this.textActive = this.focused || (this.element.value.length && this.element.value !== this.origValue);
            this.setStateClass(this.element, this.options.inputFocusClass, this.focused);
            this.setStateClass(this.elementParent, this.options.parentFocusClass, this.focused);
            this.setStateClass(this.labelFor, this.options.labelFocusClass, this.focused);
            this.setStateClass(this.element, this.options.inputActiveClass, this.textActive);
            this.setStateClass(this.elementParent, this.options.parentActiveClass, this.textActive);
            this.setStateClass(this.labelFor, this.options.labelActiveClass, this.textActive);
        },
        setStateClass: function (el, cls, state) {
            if (!el) return; else if (state) addClass(el, cls); else removeClass(el, cls);
        }
    };

    // utility functions
    function convertToArray(collection) {
        var arr = [];
        for (var i = 0, ref = arr.length = collection.length; i < ref; i++) {
            arr[i] = collection[i];
        }
        return arr;
    }

    function getInputType(input) {
        return (input.type ? input.type : input.tagName).toLowerCase();
    }

    function hasClass(el, cls) {
        return el.className ? el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)')) : false;
    }

    function addClass(el, cls) {
        if (!hasClass(el, cls)) el.className += " " + cls;
    }

    function removeClass(el, cls) {
        if (hasClass(el, cls)) {
            el.className = el.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), ' ');
        }
    }

    function bindScope(f, scope) {
        return function () {
            return f.apply(scope, arguments);
        };
    }

    function getStyle(el, prop) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null)[prop];
        } else if (el.currentStyle) {
            return el.currentStyle[prop];
        } else {
            return el.style[prop];
        }
    }
}());

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */
;
(function (a) {
    function d(b) {
        var c = b || window.event, d = [].slice.call(arguments, 1), e = 0, f = !0, g = 0, h = 0;
        return b = a.event.fix(c), b.type = "mousewheel", c.wheelDelta && (e = c.wheelDelta / 120), c.detail && (e = -c.detail / 3), h = e, c.axis !== undefined && c.axis === c.HORIZONTAL_AXIS && (h = 0, g = -1 * e), c.wheelDeltaY !== undefined && (h = c.wheelDeltaY / 120), c.wheelDeltaX !== undefined && (g = -1 * c.wheelDeltaX / 120), d.unshift(b, e, g, h), (a.event.dispatch || a.event.handle).apply(this, d)
    }

    var b = ["DOMMouseScroll", "mousewheel"];
    if (a.event.fixHooks)for (var c = b.length; c;)a.event.fixHooks[b[--c]] = a.event.mouseHooks;
    a.event.special.mousewheel = {setup: function () {
        if (this.addEventListener)for (var a = b.length; a;)this.addEventListener(b[--a], d, !1); else this.onmousewheel = d
    }, teardown: function () {
        if (this.removeEventListener)for (var a = b.length; a;)this.removeEventListener(b[--a], d, !1); else this.onmousewheel = null
    }}, a.fn.extend({mousewheel: function (a) {
        return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
    }, unmousewheel: function (a) {
        return this.unbind("mousewheel", a)
    }})
})(jQuery)
