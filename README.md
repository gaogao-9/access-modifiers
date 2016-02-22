# access-modifiers [![Build Status](https://travis-ci.org/gaogao-9/access-modifiers.svg?branch=master)](https://travis-ci.org/gaogao-9/access-modifiers) [![npm version](https://badge.fury.io/js/access-modifiers.svg)](https://badge.fury.io/js/access-modifiers)
easy use private/protected field for ES2015 class syntax

## 概要
ES2015のclass構文はprivate/protectedに対応していないため、privateやprotectedを実現しようとした場合に、あの手この手で実現する必要があります。  
このモジュールは、本来面倒なアクセス修飾子の実装を、楽にするためのモジュールです。

## インストール方法
```
npm install access-modifiers
```
プロジェクトに応じて`--save`や`--save-dev`オプションは適宜指定してください。

## :warning:注意
このモジュールを使用するには、ES2015 Proxyが利用できる必要があります。  
ネイティブのProxyもしくは、Polyfillの[tvcutsem/harmony-reflect](https://github.com/tvcutsem/harmony-reflect)のいずれかを用意してください。  
  
それと当たり前ですが、Symbolオブジェクトが実装されている必要があります。  
Symbolについては[medikoo/es6-symbol](https://github.com/medikoo/es6-symbol)というPolyfillがあります。  
また、class構文が実装されていることが望ましいです。これは[Babel](https://babeljs.io/)を利用するなどして解決してください。

## 使用方法(Node.js)
### Animal.js
```js
import AccessModifiers from "access-modifiers";

// createの戻り値として、private用のオブジェクトとprotected用のオブジェクトが得られる
const [_,p] = AccessModifiers.create();

class Animal{
  constructor(age){
    this[_.age]  = age;      // privateフィールドへのアクセス
    this[p.name] = "Animal"; // protectedフィールドへのアクセス
  }
  
  get age(){
    return this[_.age];
  }
  
  get name(){
    return this[p.name];
  }
  
  // publicメソッドにてフィールドの情報を元に返す
  intoroduce(){
    return `Hello, my name is ${this.name}(age: ${this.age}).`;
  }
}

// 最後に、このクラスで使用したprivate用のオブジェクトとprotected用のオブジェクトを登録する
AccessModifiers.register([_,p], Animal);

export default Animal;
```

### Gorilla.js
```js
import AccessModifiers from "access-modifiers";
import Animal from "./Animal.js";

// 継承を行う場合は、createの引数に基底クラスを与える
const [_,p] = AccessModifiers.create(Animal);

class Gorilla extends Animal{
  constructor(age){
    super(age);
    this[_.like] = "Banana";  // privateフィールドへのアクセス
    this[p.name] = "Gorilla"; // protectedフィールドへのアクセス(Animalのフィールドを上書き)
  }
  
  get like(){
    return this[_.like];
  }
  
  // publicメソッドオーバーライド(内部でprotectedフィールドを介して自身の名前が書き換わる)
  intoroduce(){
    return `${super.intoroduce()} I like a ${this.like}.`;
  }
}

// 最後に、このクラスで使用したprivate用のオブジェクトとprotected用のオブジェクトを登録する
AccessModifiers.register([_,p], Gorilla);

export default Gorilla;
```

### index.js
```js
import "harmony-reflect"; // ネイティブのProxyが実装されていればこれは不要です
import Animal  from "./Animal.js";
import Gorilla from "./Gorilla.js";

const animal = new Animal(5);
console.log(animal.introduce()); // "Hello, my name is Animal(age: 5)."
animal.age = 10; // getterプロパティなので上書きができません
console.log(animal.age); // 5

const gorilla = new Gorilla(8);
console.log(gorilla.introduce()); // "Hello, my name is Gorilla(age: 8). I like a Banana."

// 強引に取り出そうと思えば取り出せるのでリフレクションも可能
console.log(Object.getOwnPropertySymbols(gorilla)); // [symbol(name), symbol(age), symbol(like)]
```

## 使用方法(Proxyが利用できるブラウザ環境)
```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <!-- 予めbrowser.min.jsを読み込んでおく -->
    <script src="release/access-modifiers.browser.min.js"></script>
    <script>
      // あとは大体同じ
      const[_,p] = AccessModifier.create();
      
      class Animal{
        // ここにクラス実装を書く(省略)
      }
      
      AccessModifier.register([_,p]);
    </script>
    <!-- 省略 -->
  </head>
  <body>
  </body>
</html>
```

## 使用方法(Proxyが利用出来ないブラウザ環境)
### ※Proxyを無理矢理搭載するのは素直に諦めたほうがいい（推奨）
```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <script src="release/access-modifiers.browser.min.js"></script>
    <script>
      // createの第一引数に、配列形式で使用するprivate/protectedメンバを全て予め記述する
      const [_,p] = AccessModifier.create([["age"],["name"]]);
      
      // あとは同じ
      class Animal{
        // ここにクラス実装を書く(省略)
      }
      
      AccessModifier.register([_,p]);
    </script>
    <!-- 省略 -->
  </head>
  <body>
  </body>
</html>
```
