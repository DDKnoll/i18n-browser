/*
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
 * It just needs locales to be passed in.
 * @version 0.0.1
 */

// dependencies
var vsprintf = require("sprintf").vsprintf;

var i18n = module.exports = function (locale, opt) {
    'use strict';
    var self = {};

    //  Short Circuit if no locale
    if (!locale) {
        self.locale = {};
    } else if(locale && typeof locale.toObject == 'function' ) {
		self.locale = locale.toObject(); // for immutable structures.
	} else {
		self.locale = locale;
	}

    // Copy over options
    for (var prop in opt) {
        self[prop] = opt[prop];
    }

    // you may register helpers in global scope, up to you
    if (typeof self.register === "object") {
        i18n.resMethods.forEach(function(method) {
            self.register[method] = self[method].bind(self);
        });
    }


    if (!self.locale) {
        self.defaultLocale = opt.locales[0];
        self.setLocale(self.preferredLocale());
    }

    // converts string "Test.test" to its equivalent javascript Test.test
    var dotNotation = function (is, value) {
        if (self.locale.hasOwnProperty(is)) {
            return self.locale[is]; //Found the exact string
        }

        if (typeof is === 'string') {
            if(is.indexOf('.') >= 0){
                return dotNotation(self.locale, is.split('.'), value);
            } else {
                return is; // No dot notation, we just don't recognize the string.
            }
        } else if (typeof is === 'array'){ // This means the function has been called recursively.
            if(is.length === 1 && value !== undefined) {
                return self.locale[is[0]] = value;
            } else if (is.length === 0) {
                return self.locale;
            } else {
                if (self.locale.hasOwnProperty(is[0])) {
                    return dotNotation(self.locale[is[0]], is.slice(1), value);
                } else {
                    return self.locale[is.join('.')] = is.join('.');
                }
            }
        }
    }.bind(self);

    // read locale file, translate a msg.
    // private function. Use i18n(locale).__("translate") or i18n(locale).__n("test");
    var translate = function (singular, plural) {
        return dotNotation(singular, plural ? { one: singular, other: plural } : undefined);
    }.bind(self);

    /*****
     * PUBLIC METHODS
     */
    self.__n = function (pathOrSingular, countOrPlural, additionalOrCount) {
        var msg, count;
        if (typeof countOrPlural === 'number') {
            var path = pathOrSingular;
            count = countOrPlural;
            msg = translate(path);

            msg = vsprintf(parseInt(count, 10) > 1 ? msg.other : msg.one, Array.prototype.slice.call(arguments, 1));
        } else {
            var singular = pathOrSingular;
            var plural = countOrPlural;
            count = additionalOrCount;
            msg = translate(singular, plural);

            msg = vsprintf(parseInt(count, 10) > 1 ? msg.other : msg.one, [count]);

            if (arguments.length > 3) {
                msg = vsprintf(msg, Array.prototype.slice.call(arguments, 3));
            }
        }

        return msg;
    };

    self.__ = function () {
        var msg = translate(arguments[0]);

        if (arguments.length > 1) {
            msg = vsprintf(msg, Array.prototype.slice.call(arguments, 1));
        }

        return msg;
    };

    return self;
};
