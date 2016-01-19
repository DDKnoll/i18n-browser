# Node.js: i18n-2-browser

Designed to work with webtranslateit.com API.

## Initialization
```
var I18n = require('i18n');
var englishTranslator = new I18n({
  "Hello": "Hallo {{name}}, wie geht es dir heute?"
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
var HelloPerson = englishTranslator.__('Hello', {name: "Marcus"});
console.log(HelloPerson); // Hallo Marcus, wie geht es dir heute?
```

## Else Fallback

This is a good practice as it makes sure that at least one version of text will appear.
```
var HelloPerson = englishTranslator.__(
  'Not a key?',
  {name: "Marcus"}
).else("Hallo {{name}}, wie geht es dir heute?") ;
console.log(HelloPerson); // Hallo Marcus, wie geht es dir heute?
```

## Keys are evaluated
```
var puppy = englishTranslator.__('dog.puppy');
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
var one = englishTranslator.__('cats', {count: 1});
var other = englishTranslator.__('cats', {count: 2});
console.log(one); // 1 Katze
console.log(other); // 2 Katzen
```


#### I apologize for the versioning. The 1.* releases are still work in progress releases but I can't go back now!