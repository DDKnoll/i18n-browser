/**
 * @author  Dugan Knoll<duganknoll@gmail.com>
 * @author  Then by John Resig <jeresig@gmail.com>
 * @author  Originally by Marcus Spiegel <marcus.spiegel@gmail.com>
 * @link    https://github.com/jeresig/i18n-node
 * @license http://opensource.org/licenses/MIT
 *
 * This is a stripped out version of jeresig's i18n node package.
 * The original version runs server side, and since we're on an
 * isomorphic stack we need client side functionality.
 *
 * All we need is templating and the ability to pass in defaults
 * for locales from a data store.  It doesn't handle any loading.
 * It just needs locales to be passed in 
 * 
 * @version 0.0.1
 */

// dependencies
var vsprintf = require("sprintf").vsprintf;


function dotNotation (obj, is, value) {
    if (obj.hasOwnProperty(is)) {
        return obj[is];
    }

    if (typeof is === 'string') {
        return dotNotation(obj, is.split('.'), value);
    } else if (is.length === 1 && value !== undefined) {
        return obj[is[0]] = value;
    } else if (is.length === 0) {
        return obj;
    } else {
        if (obj.hasOwnProperty(is[0])) {
            return dotNotation(obj[is[0]], is.slice(1), value);
        } else {
            return obj[is.join('.')] = is.join('.');
        }
    }
}

var i18n = module.exports = function (locales, opt) {
    this.locales = locales

    //  Short Circuit if no locales
    if (!locales) {
        return false;
    } else if (Array.isArray(locales)){
        console.log('passing in an array of locales is currently unsupported');
        return false;
    } else {
    // TODO: Do we need to do anything to the data?

    }
    var self = this;

    // Put into dev or production mode
    this.devMode = process.env.NODE_ENV !== "production";

    // Copy over options
    for (var prop in opt) {
        this[prop] = opt[prop];
    }

    // you may register helpers in global scope, up to you
    if (typeof this.register === "object") {
        i18n.resMethods.forEach((method) => {
            self.register[method] = self[method].bind(self);
        });
    }

    // Set the locale to the default locale
    this.setLocale(this.defaultLocale);

    // Check the defaultLocale
    if (!this.locales[this.defaultLocale]) {
        console.error("Not a valid default locale.");
    }

    if (!this.locale) {
        this.defaultLocale = opt.locales[0];
        this.setLocale(this.preferredLocale());
    }
};

i18n.registerMethods = function (helpers, req) {
    i18n.resMethods.forEach(function (method) {
        if (req) {
            helpers[method] = req.i18n[method].bind(req.i18n);
        } else {
            helpers[method] = function (req) {
                return req.i18n[method].bind(req.i18n);
            };
        }
    });
    return helpers;
};

i18n.prototype = {
    defaultLocale: "en",
    extension: ".js",
    url: "locales",
    cookieName: "lang",
    sessionVarName: "locale",
    indent: "\t",

    parse: JSON.parse,

    dump: function (data, indent) {
        return JSON.stringify(data, null, indent);
    },

    __: function () {
        var msg = this.translate(this.locale, arguments[0]);

        if (arguments.length > 1) {
            msg = vsprintf(msg, Array.prototype.slice.call(arguments, 1));
        }

        return msg;
    },

    __n: function (pathOrSingular, countOrPlural, additionalOrCount) {
        var msg, count;
        if (typeof countOrPlural === 'number') {
            var path = pathOrSingular;
            count = countOrPlural;
            msg = this.translate(this.locale, path);

            msg = vsprintf(parseInt(count, 10) > 1 ? msg.other : msg.one, Array.prototype.slice.call(arguments, 1));
        } else {
            var singular = pathOrSingular;
            var plural = countOrPlural;
            count = additionalOrCount;
            msg = this.translate(this.locale, singular, plural);

            msg = vsprintf(parseInt(count, 10) > 1 ? msg.other : msg.one, [count]);

            if (arguments.length > 3) {
                msg = vsprintf(msg, Array.prototype.slice.call(arguments, 3));
            }
        }

        return msg;
    },

    setLocale: function (locale) {

        if (!locale) return;

        if (!this.locales[locale]) {
            if (this.devMode) {
                console.warn("Locale (" + locale + ") not found.");
            }

            locale = this.defaultLocale;
        }

        return (this.locale = locale);
    },

    getLocale: function () {
        return this.locale;
    },

    isPreferredLocale: function () {
        return !this.prefLocale ||
        this.prefLocale === this.getLocale();
    },

    preferredLocale: function (req) {
        req = req || this.request;

        if (!req || !req.headers) {
            return;
        }

        var accept = req.headers["accept-language"] || "",
            regExp = /(^|,\s*)([a-z0-9-]+)/gi,
            self = this,
            prefLocale,
            match;

        while (!prefLocale && (match = regExp.exec(accept))) {
            var locale = match[2].toLowerCase();
            var parts = locale.split("-");

            if (self.locales[locale]) {
                prefLocale = locale;
            } else if (parts.length > 1 && self.locales[parts[0]]) {
                prefLocale = parts[0];
            }
        }

        return prefLocale || this.defaultLocale;
    },

    // read locale file, translate a msg
    translate: function (locale, singular, plural) {
        if (!locale || !this.locales[locale]) {
            if (this.devMode) {
                console.warn("WARN: Locale not found. Using the default (" +
                this.defaultLocale + ") as current locale");
            }

            locale = this.defaultLocale;

            this.initLocale(locale, {});
        }

        return dotNotation(this.locales[locale], singular, plural ? { one: singular, other: plural } : undefined);
    },


    initLocale: function (locale, data) {
        if (!this.locales[locale]) {
            this.locales[locale] = data;
            // Only cache the files when we're not in dev mode
            if (!this.devMode) {
                var file = this.locateFile(locale);
                if (!i18n.localeCache[file]) {
                    i18n.localeCache[file] = data;
                }
            }
        }
    }
};
