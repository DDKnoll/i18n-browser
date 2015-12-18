// Run $ expresso
var I18n = require('../i18n'),
	fs = require('fs'),
	assert = require('assert');

var locales = JSON.parse(fs.readFileSync('locales/locales.js', 'utf8'));

module.exports = {
	'check set/getLocale': function () {
		var i18n = new I18n(locales);

		var loc = i18n.getLocale();
		assert.equal('en', i18n.getLocale(), 'should return default setting');
		assert.equal('de', i18n.setLocale('de'), 'should return the new setting');
		assert.equal('de', i18n.getLocale(), 'should return the new setting');
	},

	'check singular': function () {
		var i18n = new I18n(locales);

		i18n.setLocale('en');
		assert.equal(i18n.__('Hello'), 'Hello');
		assert.equal(i18n.__('Hello %s, how are you today?', 'Marcus'), 'Hello Marcus, how are you today?');
		assert.equal(i18n.__('Hello %s, how are you today? How was your %s.', 'Marcus', i18n.__('weekend')), 'Hello Marcus, how are you today? How was your weekend.');
	},

};
