var semnet = require('./semnet.js');
var util = require('util');

assert_inspected = function(a, b) {
  return console.assert(util.inspect(a) === util.inspect(b));
};

function test() {
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
  assert_inspected(db2.export(), db.export());
  assert_inspected(db.q().filter('is', 'mammal').all(), ['lion']);
  assert_inspected(db.q().filter('is', 'animal').all(), ['mammal', 'lion']);
  assert_inspected(db.q().filter('contains', 'lion').all(), ['animal', 'mammal']);
  db.fact('dog', 'is', 'mammal');
  db.fact('elephant', 'is', 'mammal');
  db.fact('cat', 'is', 'mammal');
  var q = db.q();
  assert_inspected(q.filter('is', 'animal').or(db.q().filter('smaller', 'lion')).all(), ['cat', 'ant', 'mammal', 'dog', 'lion', 'elephant']);
  assert_inspected(db.q().all(), db.q().filter('is', 'animal').or(db.q()).all());
  return db;
}

db = test();
console.log('[+] Tests passed');
