// Run $ expresso
var I18n = require('../i18n'),
  fs = require('fs'),
  assert = require('assert');

var de = JSON.parse(fs.readFileSync('locales/de.js', 'utf8'));
var en = JSON.parse(fs.readFileSync('locales/en.js', 'utf8'));

module.exports = {

    'check non-existent': function () {
        var i18n = new I18n(en);
        assert.equal(i18n.__('Hello?').else("I don't exist"), "I don't exist");
    },

    'check singular': function () {
        var i18n = new I18n(en);
        assert.equal(i18n.__('Hello'), 'Hello');
        assert.equal(i18n.__('Hello {{name}}, how are you today?', {name: 'Marcus'}), 'Hello Marcus, how are you today?');
        assert.equal(i18n.__('Hello {{name}}, how are you today? How was your {{time}}.', {name: 'Marcus', time: 'weekend'}), 'Hello Marcus, how are you today? How was your weekend.');

        var i18n = new I18n(de);
        assert.equal(i18n.__('Hello'), 'Hallo');
        assert.equal(i18n.__('Hello {{name}}, how are you today?', {name: 'Marcus'}), 'Hallo Marcus, wie geht es dir heute?');
        assert.equal(i18n.__('Hello {{name}}, how are you today? How was your {{time}}.', {name: 'Marcus', time: i18n.__('weekend')}), 'Hallo Marcus, wie geht es dir heute? Wie war dein Wochenende.');
    },

    'check plural passed': function () {
        var i18n = new I18n(en);

        var singular = i18n.__('{{count}} cat', {count: 1});
        var plural = i18n.__('{{count}} cat', {count: 3});
        assert.equal(singular, '1 cat');
        assert.equal(plural, '3 cats');

        var i18n = new I18n(de);
        singular = i18n.__('{{count}} cat', {count: 1});
        plural = i18n.__('{{count}} cat', {count: 3});
        assert.equal(singular, '1 Katze');
        assert.equal(plural, '3 Katzen');
    },

    'check path': function() {
        var i18n = new I18n(en);

        assert.equal(i18n.__('dog.puppy'), 'Puppy');

        var i18n = new I18n(de);
        assert.equal(i18n.__('dog.puppy'), 'Hündchen');
    },

    'check nested plural with order swapped': function () {
        var i18n = new I18n(de);

        singular = i18n.__('There are {{count}} monkeys in the {{tree}}', {count: 1, tree: i18n.__('tree', {count: 1})});
        plural = i18n.__('There are {{count}} monkeys in the {{tree}}', {count: 3, tree: i18n.__('tree', {count: 2})});
        assert.equal(singular, 'Im Baum sitzt ein Affe');
        assert.equal(plural, "Im Bäume sitzen 3 Affen");
    },

};
