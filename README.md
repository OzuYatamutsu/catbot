# Catbot!
Meow.

## What do?
```
npm install
npm start
```
Do.

## No, but really, what do?
* Add a function to generate a response in `generators.js`:

```javascript
module.exports = {
  // ...
  "doFunc": (args) => {
    let messageArg = args.message.split("!catbot do-func")[1];
    // Do something
    
    return Promise.resolve("my returned message string");
  },
  // ...
}
```
The function should return a promise.

* Add a message string to `message-handler.js`:

```javascript
/*
 * Returns a Promise based on a given !catbot directive.
 */
function command(str) { 
  const table = {
    // ...
    "!catbot do-func": generators.doFunc,
    // ...
  }

  // ...
}
```

* _optional_ Document its use in `generators.doHelp`.

* You're good!

<img src="https://raw.githubusercontent.com/OzuYatamutsu/catbot/master/catbot_ex1.png" />

## Cats?
<img src="http://www.ohgizmo.com/wp-content/uploads/2014/03/Cat-Burger-Pillow.jpg" />
