SEMNET
======

### Description

Basic semantic network - javascript implementation


### Usage

```js
var db = new Semnet();
db.add('animal');
db.add('mammal');
db.add('dog');
db.add('cat');
db.add('elephant');
db.add('ant');
db.add('bigger', {opposite: 'smaller', transitive: true});

db.fact('mammal', 'is', 'animal');
db.fact('lion', 'bigger', 'cat');
db.fact('dog', 'bigger', 'cat');
db.fact('cat', 'bigger', 'ant');
db.fact('dog', 'smaller', 'elephant');
db.fact('lion', 'is', 'mammal');

var results  = db.q().filter('is', 'mammal').filter('bigger', 'ant').all(); // ['lion']
var results2 = db.q().filter('smaller', 'dog').all(); // ['ant', 'cat']

```
