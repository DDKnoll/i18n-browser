// Run $ expresso
var I18n = require('../index'),
	fs = require('fs'),
	assert = require('assert');

var locales = JSON.parse(fs.readFileSync('locales/en.js', 'utf8'));

module.exports = {

	'check singular': function () {
		var i18n = I18n(locales);

		assert.equal(i18n.__('Hello'), 'Hello');
		assert.equal(i18n.__('Hello {{name}}, how are you today?', {name: 'Marcus'}), 'Hello Marcus, how are you today?');
		assert.equal(i18n.__('Hello {{name}}, how are you today? How was your {{time}}.', {name: 'Marcus', time: i18n.__('weekend')}), 'Hello Marcus, how are you today? How was your weekend.');
	},

};
