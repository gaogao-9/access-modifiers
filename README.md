# access-modifiers [![Build Status](https://travis-ci.org/gaogao-9/access-modifiers.svg?branch=master)](https://travis-ci.org/gaogao-9/access-modifiers) [![npm version](https://badge.fury.io/js/access-modifiers.svg)](https://badge.fury.io/js/access-modifiers)

日本語で読みたい方はこちら => [README_JP](https://github.com/gaogao-9/access-modifiers/blob/master/README_JP.md)

## Introduction
easy use private/protected field for ES2015 class syntax

We should have complicated implementations to achieve private/protected access modifiers for ES2015 because of it has no such features for class syntax. <br>This module reduces the complication of the implementation for access modifiers.

```
npm install access-modifiers
```

You can add `--save` or `--save-dev` option for your project needs.

## :warning:Requirements
The module requires ES2015 Proxy.<br>You should use a polyfill like [tvcutsem/harmony-reflect](https://github.com/tvcutsem/harmony-reflect) if your expecting environment is not support the native Proxy.

The module also requires Symbol implementation.<br>You can use a polyfill like [medikoo/es6-symbol](https://github.com/medikoo/es6-symbol).<br>In addition, the module is well suited to class syntax. To use the class syntax, you can use [Babel](https://babeljs.io/).

## Usage (Node.js)
### Animal.js

```js
import AccessModifiers from "access-modifiers";

// the `create` method returns the objects for private and protected modifiers
const [_,p] = AccessModifiers.create();

class Animal{
  constructor(age){
    this[_.age]  = age;      // access to a private field
    this[p.name] = "Animal"; // access to a protected field
  }

  get age(){
    return this[_.age];
  }

  get name(){
    return this[p.name];
  }

  // restores the field information in a public method
  introduce(){
    return `Hello, my name is ${this.name}(age: ${this.age}).`;
  }
}

// finally, registers the objects for private and protected modifiers used on the Animal class
AccessModifiers.register([_,p], Animal);

export default Animal;
```

### Gorilla.js

```js
import AccessModifiers from "access-modifiers";
import Animal from "./Animal.js";

// you should give a base class to the `create` method for inheritance
const [_,p] = AccessModifiers.create(Animal);

class Gorilla extends Animal{
  constructor(age){
    super(age);
    this[_.like] = "Banana";  // access to a private field
    this[p.name] = "Gorilla"; // access to a protected field (overrides the Animal's field)
  }

  get like(){
    return this[_.like];
  }

  // overrides a public method (rewrite the protected `name` field used in the `super.introduce` method)
  introduce(){
    return `${super.introduce()} I like a ${this.like}.`;
  }
}

// finally, registers the objects for private and protected modifiers used on the Gorilla class
AccessModifiers.register([_,p], Gorilla);

export default Gorilla;
```

### index.js

```js
import "harmony-reflect"; // you do not have to this line if the native Proxy is supported
import Animal  from "./Animal.js";
import Gorilla from "./Gorilla.js";

const animal = new Animal(5);
console.log(animal.introduce()); // "Hello, my name is Animal(age: 5)."
animal.age = 10; // cannot set the value because the `age` is getter property
console.log(animal.age); // 5

const gorilla = new Gorilla(8);
console.log(gorilla.introduce()); // "Hello, my name is Gorilla(age: 8). I like a Banana."

// you can forcefully get the field values for Reflection
console.log(Object.getOwnPropertySymbols(gorilla)); // [symbol(name), symbol(age), symbol(like)]
```

## Usage (Browsers supporting Proxy)

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <!-- ensure to load browser.min.js -->
    <script src="release/access-modifiers.browser.min.js"></script>
    <script>
      // do same way
      const[_,p] = AccessModifier.create();

      class Animal{
        // implementation
      }

      AccessModifier.register([_,p]);
    </script>
    <!-- ... -->
  </head>
  <body>
  </body>
</html>
```

## Usage (Browsers not supporting Proxy)
### You had better not to put a dummy Proxy

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <script src="release/access-modifiers.browser.min.js"></script>
    <script>
      // define the name of private/protected members as Array to the 1st arg for the `create` method
      const [_,p] = AccessModifier.create([["age"],["name"]]);

      // do same way
      class Animal{
        // implementation
      }

      AccessModifier.register([_,p]);
    </script>
    <!-- ... -->
  </head>
  <body>
  </body>
</html>
```
