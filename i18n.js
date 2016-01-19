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
var mustache = require("mustache");

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
    var dotNotation = function(path){
        var resolved = dotNotationHelper(self.locale, path);
        return (resolved ? resolved : false);
    };
    // Recursive function that iterates down an object
    var dotNotationHelper = function (object, path) {
        if (object.hasOwnProperty(path)) {
            return object[path]; //Found the exact string
        }

        // Check if we should recurse.
        if (typeof path === 'string') {
            if(path.indexOf('.') >= 0){
                return dotNotationHelper(object, path.split('.'));
            } else {
                return false; // No dot notation, we just don't recognize the string.
            }
        } else if (Array.isArray(path)){ // The function has been called recursively.
            if(path.length === 1) {
                return dotNotationHelper(object, path[0]);
            } else if (path.length === 0) {
                return false;
            } else {
                if (object.hasOwnProperty(path[0])) {
                    return dotNotationHelper(object[path[0]], path.slice(1));
                } else {
                    return false;
                }
            }
        }
    }.bind(self);

    // read locale file, translate a msg.
    // private function. Use i18n(locale).__("translate") or i18n(locale).__n("test");
    var translate = function (singular, plural) {
        return dotNotation(singular, plural ? { one: singular, other: plural } : undefined);
    }.bind(self);

    //     /** arg[0], arg[1], ..., fnName */
    // var __elseConstructor = function(fn, argumentsPassed){
    //     // This calls the previous function with the default argument. The only difference is that it
    //     // resolves the template string to the default value passed
    //     return function(defaultString) {
    //         argumentsPassed = argumentsPassed.concat(defaultString);
            
    //     }.bind(this);
    // }.bind(self);

    // /**
    //  * This function should be called whenever a value is returned because it allows
    //  * additional functions to be chained in a stream.
    //  * example: return returnFalsey(arguments, '__');
    //  */
    // var __return = function(fn, argumentsPassed){
    //     var returned = {
    //         'else': __elseConstructor(fn, argumentsPassed)
    //     }
    //     console.log(returned);
    //     return returned;
    // }.bind(self);

    /*****
     * PUBLIC METHODS
     */
    // self.__n = function (pathOrSingular, data, count) {
    //     if(!arguments[1]) arguments[1] = {}; //Data should exist;
    //     var msg, count;
    //     if (typeof countOrPlural === 'number') {
    //         var path = pathOrSingular;
    //         count = countOrPlural;
    //         msg = translate(path);

    //         msg = mustache.render(parseInt(count, 10) > 1 ? msg.other : msg.one, data);
    //     } else {
    //         var singular = pathOrSingular;
    //         var plural = countOrPlural;
    //         count = additionalOrCount;
    //         msg = translate(singular, plural);

    //         msg = mustache.render(parseInt(count, 10) > 1 ? msg.other : msg.one, [count]);

    //         if (arguments.length > 3) {
    //             msg = mustache.render(msg, Array.prototype.slice.call(arguments, 3));
    //         }
    //     }

    //     return msg ? msg : __return('__', arguments);
    // };

    self.__ = function (msg, data, defaultString) {
        // Default is only used by the else chained command.
        var msg = translate(arguments[0]);
        msg = msg ? msg : defaultString;
        if(typeof msg === 'object'){
            if(msg.hasOwnProperty('one') && msg.hasOwnProperty('other')){
                // This is a plural
                if(arguments[1] && arguments[1].hasOwnProperty('count') && arguments[1]['count'] !== 1){
                    msg = msg['other']
                } else {
                    msg = msg['one']
                }
            }
        }

        if (arguments.length > 1) {
            msg = mustache.render(msg, arguments[1]);
        }

        return msg;
    };

    return self;
};
