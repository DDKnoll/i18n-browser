// Run $ expresso
var I18n = require('../i18n'),
	fs = require('fs'),
	assert = require('assert');

var de = JSON.parse(fs.readFileSync('locales/de.js', 'utf8'));
var en = JSON.parse(fs.readFileSync('locales/en.js', 'utf8'));

module.exports = {

	'check non-existent': function () {
		var i18n = I18n(en);
		assert.equal(i18n.__('Hello?'), 'Hello?');
	},

	'check singular': function () {
		var i18n = I18n(en);
		assert.equal(i18n.__('Hello'), 'Hello');
		assert.equal(i18n.__('Hello %s, how are you today?', 'Marcus'), 'Hello Marcus, how are you today?');
		assert.equal(i18n.__('Hello %s, how are you today? How was your %s.', 'Marcus', i18n.__('weekend')), 'Hello Marcus, how are you today? How was your weekend.');

		var i18n = I18n(de);
		assert.equal(i18n.__('Hello'), 'Hallo');
		assert.equal(i18n.__('Hello %s, how are you today?', 'Marcus'), 'Hallo Marcus, wie geht es dir heute?');
		assert.equal(i18n.__('Hello %s, how are you today? How was your %s.', 'Marcus', i18n.__('weekend')), 'Hallo Marcus, wie geht es dir heute? Wie war dein Wochenende.');
	},

	'check plural': function () {
		var i18n = I18n(en);

		var singular = i18n.__n('%s cat', '%s cats', 1);
		var plural = i18n.__n('%s cat', '%s cats', 3);
		assert.equal(singular, '1 cat');
		assert.equal(plural, '3 cats');

		var i18n = I18n(de);
		singular = i18n.__n('%s cat', '%s cats', 1);
		plural = i18n.__n('%s cat', '%s cats', 3);
		assert.equal(singular, '1 Katze');
		assert.equal(plural, '3 Katzen');
	},

};
