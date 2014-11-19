
;(function(){

    /**
     * Perform initial dispatch.
     */

    var dispatch = true;

    /**
     * Base path.
     */

    var base = '';

    var location = history.location || window.location;

    /**
     * Running flag.
     */

    var running;

    /**
     * Register `path` with callback `fn()`,
     * or route `path`, or `page.start()`.
     *
     *   page(fn);
     *   page('*', fn);
     *   page('/user/:id', load, user);
     *   page('/user/' + user.id, { some: 'thing' });
     *   page('/user/' + user.id);
     *   page();
     *
     * @param {String|Function} path
     * @param {Function} fn...
     * @api public
     */

    function page(path, fn) {
        // <callback>
        if ('function' == typeof path) {
            return page('*', path);
        }

        // route <path> to <callback ...>
        if ('function' == typeof fn) {
            var route = new Route(path);
            for (var i = 1; i < arguments.length; ++i) {
                page.callbacks.push(route.middleware(arguments[i]));
            }
            // show <path> with [state]
        } else if ('string' == typeof path) {
            page.show(path, fn);
            // start [options]
        } else {
            page.start(path);
        }
    }

    /**
     * Callback functions.
     */

    page.callbacks = [];

    /**
     * Get or set basepath to `path`.
     *
     * @param {String} path
     * @api public
     */

    page.base = function(path){
        if (0 == arguments.length) return base;
        base = path;
    };

    /**
     * Bind with the given `options`.
     *
     * Options:
     *
     *    - `click` bind to click events [true]
     *    - `popstate` bind to popstate [true]
     *    - `dispatch` perform initial dispatch [true]
     *
     * @param {Object} options
     * @api public
     */

    page.start = function(options){
        options = options || {};
        if (running) return;
        running = true;
        if (false === options.dispatch) dispatch = false;
//        if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
//        if (false !== options.click) window.addEventListener('click', onclick, false);
        if (false !== options.popstate) addEvent(window, 'popstate', onpopstate);
        if (false !== options.click) addEvent(document, 'click', onclick);
        if (!dispatch) return;
        var url = location.pathname + location.search + location.hash;
        page.replace(url, null, true, dispatch);
    };

    /**
     * Unbind click and popstate event handlers.
     *
     * @api public
     */

    page.stop = function(){
        running = false;
//        removeEventListener('click', onclick, false);
//        removeEventListener('popstate', onpopstate, false);
        removeEvent(document, 'click', onclick);
        removeEvent(window, 'popstate', onpopstate);
    };

    /**
     * Show `path` with optional `state` object.
     *
     * @param {String} path
     * @param {Object} state
     * @param {Boolean} dispatch
     * @return {Context}
     * @api public
     */

    page.show = function(path, state, dispatch){
        var ctx = new Context(path, state);
        if (false !== dispatch) page.dispatch(ctx);
        if (!ctx.unhandled) ctx.pushState();
        return ctx;
    };

    /**
     * Replace `path` with optional `state` object.
     *
     * @param {String} path
     * @param {Object} state
     * @return {Context}
     * @api public
     */

    page.replace = function(path, state, init, dispatch){
        var ctx = new Context(path, state);
        ctx.init = init;
        if (null == dispatch) dispatch = true;
        if (dispatch) page.dispatch(ctx);
        ctx.save();
        return ctx;
    };

    /**
     * Dispatch the given `ctx`.
     *
     * @param {Object} ctx
     * @api private
     */

    page.dispatch = function(ctx){
        var i = 0;

        function next() {
            var fn = page.callbacks[i++];
            if (!fn) return unhandled(ctx);
            fn(ctx, next);
        }

        next();
    };

    /**
     * Unhandled `ctx`. When it's not the initial
     * popstate then redirect. If you wish to handle
     * 404s on your own use `page('*', callback)`.
     *
     * @param {Context} ctx
     * @api private
     */

    function unhandled(ctx) {
//        var current = window.location.pathname + window.location.search;
//        if (current == ctx.canonicalPath) return;
        if (location.pathname + location.search == ctx.canonicalPath) return;
        page.stop();
        ctx.unhandled = true;
        window.location = ctx.canonicalPath;
    }

    /**
     * Initialize a new "request" `Context`
     * with the given `path` and optional initial `state`.
     *
     * @param {String} path
     * @param {Object} state
     * @api public
     */

    function Context(path, state) {
        if ('/' == path[0] && 0 != path.indexOf(base)) path = base + path;
        var i = path.indexOf('?');

        this.canonicalPath = path;
        this.path = path.replace(base, '') || '/';

        this.title = document.title;
        this.state = state || {};
        this.state.path = path;
        this.querystring = ~i ? path.slice(i + 1) : '';
        this.pathname = ~i ? path.slice(0, i) : path;
        this.params = [];

        // fragment
        this.hash = '';
        if (!~this.path.indexOf('#')) return;
        var parts = this.path.split('#');
        this.path = parts[0];
        this.hash = parts[1] || '';
        this.querystring = this.querystring.split('#')[0];
    }

    /**
     * Expose `Context`.
     */

    page.Context = Context;

    /**
     * Push state.
     *
     * @api private
     */

    Context.prototype.pushState = function(){
        history.pushState(this.state, this.title, this.canonicalPath);
    };

    /**
     * Save the context state.
     *
     * @api public
     */

    Context.prototype.save = function(){
        history.replaceState(this.state, this.title, this.canonicalPath);
    };

    /**
     * Initialize `Route` with the given HTTP `path`,
     * and an array of `callbacks` and `options`.
     *
     * Options:
     *
     *   - `sensitive`    enable case-sensitive routes
     *   - `strict`       enable strict matching for trailing slashes
     *
     * @param {String} path
     * @param {Object} options.
     * @api private
     */

    function Route(path, options) {
        options = options || {};
        this.path = path;
        this.method = 'GET';
        this.regexp = pathtoRegexp(path
            , this.keys = []
            , options.sensitive
            , options.strict);
    }

    /**
     * Expose `Route`.
     */

    page.Route = Route;

    /**
     * Return route middleware with
     * the given callback `fn()`.
     *
     * @param {Function} fn
     * @return {Function}
     * @api public
     */

    Route.prototype.middleware = function(fn){
        var self = this;
        return function(ctx, next){
            if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
            next();
        };
    };

    /**
     * Check if this route matches `path`, if so
     * populate `params`.
     *
     * @param {String} path
     * @param {Array} params
     * @return {Boolean}
     * @api private
     */

    Route.prototype.match = function(path, params){
        var keys = this.keys
            , qsIndex = path.indexOf('?')
            , pathname = ~qsIndex ? path.slice(0, qsIndex) : path
            , m = this.regexp.exec(pathname);

        if (!m) return false;

        for (var i = 1, len = m.length; i < len; ++i) {
            var key = keys[i - 1];

            var val = 'string' == typeof m[i]
                ? decodeURIComponent(m[i])
                : m[i];

            if (key) {
                params[key.name] = undefined !== params[key.name]
                    ? params[key.name]
                    : val;
            }
            else if (val.indexOf('/')>=0){
                params.push.apply(params,val.split('/'));
            }
            else {
                params.push(val);
            }
        }

        return true;
    };

    /**
     * Normalize the given path string,
     * returning a regular expression.
     *
     * An empty array should be passed,
     * which will contain the placeholder
     * key names. For example "/user/:id" will
     * then contain ["id"].
     *
     * @param  {String|RegExp|Array} path
     * @param  {Array} keys
     * @param  {Boolean} sensitive
     * @param  {Boolean} strict
     * @return {RegExp}
     * @api private
     */

    function pathtoRegexp(path, keys, sensitive, strict) {
        if (path instanceof RegExp) return path;
        if (path instanceof Array) path = '(' + path.join('|') + ')';
        path = path
            .concat(strict ? '' : '/?')
            .replace(/\/\(/g, '(?:/')
            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
                keys.push({ name: key, optional: !! optional });
                slash = slash || '';
                return ''
                    + (optional ? '' : slash)
                    + '(?:'
                    + (optional ? slash : '')
                    + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
                    + (optional || '');
            })
            .replace(/([\/.])/g, '\\$1')
            .replace(/\*/g, '(.*)');
        return new RegExp('^' + path + '$', sensitive ? '' : 'i');
    }

    /**
     * Handle "populate" events.
     */

    function onpopstate(e) {
        if (e.state) {
            var path = e.state.path;
            page.replace(path, e.state);
        }
    }

    /**
     * Handle "click" events.
     */

    function onclick(e) {
        //if (1 != which(e)) return;
        if (!which(e)) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (e.defaultPrevented) return;
        // ensure link
        //var el = e.target;
        var el = e.target || e.srcElement;
        while (el && 'A' != el.nodeName) el = el.parentNode;
        if (!el || 'A' != el.nodeName) return;

        // ensure non-hash for the same path
        var link = el.getAttribute('href');
        if (el.pathname == location.pathname && (el.hash || '#' == link)) return;

        // check target
        if (el.target) return;

        // x-origin
        if (!sameOrigin(el.href)) return;

        // rebuild path
        var path = el.pathname + el.search + (el.hash || '');

        // on non-html5 browsers (IE9-), `el.pathname` doesn't include leading '/'
        if (path[0] !== '/') path = '/' + path;

        // same page
        var orig = path + el.hash;

        path = path.replace(base, '');
        if (base && orig == path) return;

        //e.preventDefault();
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        // If in pull do not move page.
        if (CPullToRefresh.inPullToRefresh()) return;

        page.show(orig);
    }

    /**
     * Event button.
     */

    function which(e) {
        e = e || window.event;
        return null == e.which
            //? e.button
            //: e.which;
            ? e.button == 0
            : e.which == 1;
    }

    /**
     * Check if `href` is the same origin.
     */

    function sameOrigin(href) {
        var origin = location.protocol + '//' + location.hostname;
        if (location.port) origin += ':' + location.port;
        return 0 == href.indexOf(origin);
    }

    /**
     * Basic cross browser event code
     */

    function addEvent(obj, type, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
        } else {
            obj.attachEvent('on' + type, fn);
        }
    }

    function removeEvent(obj, type, fn) {
        if (obj.removeEventListener) {
            obj.removeEventListener(type, fn, false);
        } else {
            obj.detachEvent('on' + type, fn);
        }
    }

    /**
     * Expose `page`.
     */

    if ('undefined' == typeof module) {
        window.page = page;
    } else {
        module.exports = page;
    }

})();
