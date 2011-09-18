if (typeof jQuery == 'undefined') throw("jQuery Required");

(function($) {

    var handlerSet = false;
    var skipNextCheck = false;

    var defaultOptions = {
        dirtyMessage: 'You have unsaved changes on this page are you sure you wish to navigate away?'
    };

    $.dirtyForm = function(elm, option) {
        if (!handlerSet) {
            handlerSet = true;
            window.onbeforeunload = function() {
                if(!skipNextCheck)
                {
                    var msg = $('body').dirtyMessage();

                    if (msg) {
                        return msg;
                    }
                }
                skipNextCheck = false;
            };
        }

        var self = this;
        this.element = $(elm);
        this.options = $.extend({}, defaultOptions, option);

        this.initialVal = getValue(this.element);

        this.element.data('dirtyFormObject', self);

        this.isDirty = function() {
            return (self.initialVal !== getValue(self.element));
        };

        this.markClean = function() {
            self.initialVal = getValue(self.element);
        };

    };



    function getValue(elm) {

        var elmValue;

        elm.trigger('refreshValue');

        if (elm.is('input[type=check],input[type=radio]')) {
            elmValue = elm.attr('checked');
        }
        else {
            elmValue = elm.val();
        }

        return elmValue;
    };

    var inputElements = 'input[type=hidden],input[type=text],input[type=password],input[type=check],input[type=radio],select,textarea';


    $.fn.skipDirtyForm = function() 
    {
        this.live('click',function() {
            skipNextCheck = true;
        });

        return this;
    };

    $.fn.dirtyForm = function(opts) {
        this.each(function() {

            var self = $(this);
            if (self.is(inputElements)) {
                new $.dirtyForm(self, opts);
            }
            else {
                $(inputElements, self).dirtyForm();
            }


        });

        return this;
    };

    $.fn.markClean = function() {
        this.each(function() {

            var self = $(this);

            if (self.is(inputElements)) {
                var df = self.data('dirtyFormObject');

                if (df) {
                    df.markClean();
                }
            }
            else {
                $(inputElements, self).markClean();
            }

        });

        return this;
    };

    $.fn.isDirty = function() {
        var isDirty = false;

        this.each(function() {

            var self = $(this);
            if (self.is(inputElements)) {
                var df = self.data('dirtyFormObject');

                if (df) {
                    if (df.isDirty()) {
                        isDirty = true;
                    }
                }
            }
            else {
                if ($(inputElements, self).isDirty()) {
                    isDirty = true;
                }
            }

        });

        return isDirty;
    };

    $.fn.dirtyMessage = function() {
        var dirtyMessage = null;

        this.each(function() {
            if (!dirtyMessage) {

                var self = $(this);
                if (self.is(inputElements)) {
                    var df = self.data('dirtyFormObject');

                    if (df) {
                        if (df.isDirty()) {
                            dirtyMessage = df.options.dirtyMessage;
                        }
                    }
                }
                else {
                    if ($(inputElements, self).isDirty()) {
                        dirtyMessage = $(inputElements, self).dirtyMessage();
                    }
                }
            }
        });

        return dirtyMessage;
    };

})(jQuery);
