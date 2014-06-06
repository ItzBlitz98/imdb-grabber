;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = 'myNoteAjaxPlugin',
        defaults = {
            waitFor: "1000",
        };

    // The actual plugin constructor
    function Plugin( element, options ) {

        this.element = element;
        this.$element = $(element);

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this._timer = null;
        this._click = false;

        this._init();
    }

    Plugin.prototype._init = function () {

        var self = this;

        this.$element.keyup(function(e){

            if( self._click === false ){
                var id = self.element.id;
                if( self._click === false ){
                    self._click = true;
                    self._timer = setTimeout(function(){self._doneTyping(id)}, self.options.waitFor);
                }
            }
        });

        this.$element.keydown(function(e) {

            if (self._timer) {
                clearTimeout(self._timer);
            }
            self._click = false;

        });

    };

    Plugin.prototype._doneTyping = function(id) {
        moviesearch();
        //alert('done typing');
    };

    $.fn[pluginName] = function( options ) {

        var isMethodCall = typeof options === "string",
            args = Array.prototype.slice.call( arguments, 1 ),
            returnValue = this;

        // allow multiple hashes to be passed on init
        options = !isMethodCall && args.length ?
            $.extend.apply( null, [ true, options ].concat(args) ) :
            options;

        // prevent calls to internal methods
        if ( isMethodCall && options.charAt( 0 ) === "_" ) {
            return returnValue;
        }

        if ( isMethodCall ) {
            this.each(function() {
                var instance = $.data( this, pluginName ),
                    methodValue = instance && $.isFunction( instance[options] ) ?
                        instance[ options ].apply( instance, args ) :
                        instance;

                if ( methodValue !== instance && methodValue !== undefined ) {
                    returnValue = methodValue;
                    return false;
                }
            });

        } else {
            this.each(function() {
                var instance = $.data( this, pluginName );
                if ( instance ) {
                    instance.option( options || {} )._init();
                } else {
                    $.data( this, pluginName , new Plugin( this , options) );
                }
            });
        }

        return returnValue;
    };

})( jQuery, window, document );