var semnet = require('./semnet.js');

function tests() {
  var util = require('util');
  var db = new semnet.Semnet();
  db.add('animal');
  db.add('mammal');
  db.add('dog');
  db.add('cat');
  db.add('lion');
  db.add('elephant');
  db.add('ant');
  db.add('bigger', {opposite: 'smaller', transitive: true});
  db.fact('mammal', 'is', 'animal');
  db.fact('lion', 'bigger', 'cat');
  db.fact('dog', 'bigger', 'cat');
  db.fact('cat', 'bigger', 'ant');
  db.fact('dog', 'smaller', 'elephant');
  db.fact('lion', 'is', 'mammal');
  console.assert(db.entities.dog.bigger.indexOf('ant') >= -1);
  var db2 = new semnet.Semnet();
  db2.import(db.export());
  console.assert(util.inspect(db2.export()) == util.inspect(db.export()));
  console.assert(util.inspect(db.q().filter('is', 'mammal').all()) == util.inspect(['lion']));
  console.assert(util.inspect(db.q().filter('is', 'animal').all()) == util.inspect(['mammal', 'lion']));
  console.assert(util.inspect(db.q().filter('contains', 'lion').all()) == util.inspect(['animal', 'mammal']));
  db.fact('dog', 'is', 'mammal');
  db.fact('elephant', 'is', 'mammal');
  db.fact('cat', 'is', 'mammal');
  return db;
}

db = tests();
console.log('[+] Tests passed');
