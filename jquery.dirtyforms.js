if (typeof jQuery == 'undefined') throw("jQuery Required");

(function($) {

    var handlerSet = false;
    var skipNextCheck = false;

    var defaultOptions = {
        dirtyMessage: 'You have unsaved changes on this page are you sure you wish to navigate away?',
        not : null,
    };

    $.dirtyForm = function(elm, option) {
        if (!handlerSet) {
            handlerSet = true;
            var oldumload = window.onbeforeunload;
            window.onbeforeunload = function() {
                if(oldumload)
                {
                    var ret = oldumload();
                    if (ret)
                        return ret;
                }
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
        this.options = $.extend({}, defaultOptions, option);
        
        this.element = $(elm).not(this.options.not);
        if (this.element.length > 0)
        {
            this.initialVal = getValue(this.element);

            this.element.data('dirtyFormObject', self);

            this.isDirty = function() {
                return (self.initialVal !== getValue(self.element));
            };

            this.markClean = function() {
                self.initialVal = getValue(self.element);
            };
        }
    };



    function getValue(elm) {

        var elmValue;

        elm.trigger('refreshValue');

        if (elm.is('input[type=checkbox],input[type=radio]')) {
            elmValue = elm.attr('checked');
        }
        else {
            elmValue = elm.val();
        }

        return elmValue;
    };

    var inputElements = 'input[type=hidden],input[type=text],input[type=date],input[type=number],input[type=password],input[type=checkbox],input[type=radio],select,textarea';


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

    $.fn.notDirtyForm = function() {
        this.each(function() {

            var self = $(this);

            if (self.is(inputElements)) {
                var df = self.data('dirtyFormObject');
                if (df) {
                    self.removeData('dirtyFormObject');
                }
            }
            else {
                $(inputElements, self).notDirtyForm();
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
    $.fn.getDirty = function() {
        var isDirty = false;
        var dirty = [];
        this.each(function() {
            var self = $(this);
            if (self.is(inputElements)) {
                var df = self.data('dirtyFormObject');
                if (df) {
                    if (df.isDirty()) {
                        dirty.push(this)
                    }
                }
            }
            else {                
                var toadd = $(inputElements, self).getDirty();
                for(var i =0;i<toadd.length;i++)
                {
                    dirty.push(toadd[i]);
                }
            }
        });

        return dirty;
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