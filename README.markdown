SEMNET
======

### Description

Basic semantic network - javascript implementation


### Usage

Nodejs:

```js
var s = require('./semnet.js');
var db = new s.Semnet();
```

HTML:

```html
<script type="text/javascript" src="https://raw.github.com/asciimoo/semnet/master/semnet.js"> </script>
<script type="text/javascript">
  var db = new Semnet();
</script>
```

```js
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

var big_mammals   = db.q().filter('is', 'mammal').filter('bigger', 'ant').all(); // ['lion']
var small_animals = db.q().filter('smaller', 'dog').all(); // ['ant', 'cat']

var my_query = db.q();

my_query.filter('is', 'animal').or(db.q().filter('smaller', 'lion')).all(); // ['cat', 'ant', 'mammal', 'lion']

```

### Testing

```
> nodejs tests.js
```

### License

```
semnet is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

semnet is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with semnet. If not, see < http://www.gnu.org/licenses/ >.

(C) 2012- by Adam Tauber, <asciimoo@gmail.com>
```
