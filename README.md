# Node.js: i18n-2-browser

Designed to work with webtranslateit.com API.

## Initialization
```
var I18n = require('i18n');
var germanTranslator = new I18n({
  "Hello": "Hallo {{name}}, wie geht es dir heute?",
  "cats": {
    "one": "{{count}} Katze",
    "other": "{{count}} Katzen"
  },
  "dog": {
    "puppy": "Hündchen"  
  } // 1 Katze
});
```

## Basic Translation
```
var HelloPerson = germanTranslator.__('Hello', {name: "Marcus"});
console.log(HelloPerson); // Hallo Marcus, wie geht es dir heute?
```

## default Fallback

Third parameter is the default fallback.
This is a good practice as it makes sure that at least one version of text will appear.
```
var HelloPerson = germanTranslator.__(
  'Not a key?',
  {name: "Marcus"},
  "Hallo {{name}}, wie geht es dir heute?");
console.log(HelloPerson); // Hallo Marcus, wie geht es dir heute?
```

## Keys are evaluated
```
var puppy = germanTranslator.__('dog.puppy');
console.log(puppy); // Hündchen
```


## Plurals

Plurals will be automatically evaluated if the object has keys `one` and `other`.

Then it determines the plural based on the count variable passed to it.

Example data:

```
"cats": {
  "one": "{{count}} Katze",
  "other": "{{count}} Katzen"
}
```

and the usage:

```
var one = germanTranslator.__('cats', {count: 1});
var other = germanTranslator.__('cats', {count: 2});
console.log(one); // 1 Katze
console.log(other); // 2 Katzen
```


#### I apologize for the versioning. The 1.* releases are still work in progress releases but too late now!