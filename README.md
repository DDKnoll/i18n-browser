# Node.js: i18n-2-browser

I ripped out the core templating parts of John Resig's https://github.com/jeresig/i18n-node-2 library.  Its now set up to take a locales object similar to the ones used in his javascript library.

The purpose is for rendering on client side.  I just needed the translation engine without any of the other server side functions. Check out the test directory for usage examples.