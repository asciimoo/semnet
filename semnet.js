
function QuerySet(db) {
  this.filter = function(relation, entity) {
      if(this.query[relation]) this.query[relation].push(entity);
      else this.query[relation] = [entity];
      return this;
  }

  this.all = function() {
    var ret = [];
    for(ent in this.db.entities) {
      var loop_count = 0, match_count = 0
      for(relation in this.query) {
        for(entity in this.query[relation]) {
          loop_count++;
          if(this.db.entities[ent][relation] && this.db.entities[ent][relation].indexOf(this.query[relation][entity]) != -1) {
              match_count++;
          }
        }
      }
      if(match_count == loop_count) ret.push(ent);
    }
    return ret;
  };

  this.query = {};
  this.db    = db;

  return this;
}

function Semnet() {
  this.export = function() {
    return {entities:  this.entities
           ,relations: this.relations
           };
  }

  this.import = function(json) {
    if(json.entities) this.entities = json.entities;
    if(json.relations) this.relations = json.relations;
  }

  this.add = function(name, options) {
    if(!this.entities[name]) this.entities[name] = {};
    if(!options) return;
    this.relations[name] = {transitive : options.transitive?true:false
                           ,opposite   : options.opposite?options.opposite:false
                           };
    if(options.opposite)
      this.relations[options.opposite] = {transitive : options.transitive?true:false
                                         ,opposite   : name
                                         };
  };

  this.q = function() {
    var query = new QuerySet(this);
    return query;
  }

  this.fact = function(entity, relation_name, entitx) {
    if(!this.entities[entity]) this.add_entity(entity);
    if(!this.entities[entitx]) this.add_entity(entitx);
    var relation = this.relations[relation_name];
    if(!this.entities[entity][relation_name]) {
      this.entities[entity][relation_name] = [entitx];
    } else {
      this.entities[entity][relation_name].push(entitx);
    }
    if(relation.opposite) {
      if(!this.entities[entitx][relation.opposite]) {
        this.entities[entitx][relation.opposite] = [entity];
      } else {
        this.entities[entitx][relation.opposite].push(entity);
      }
    }
    if(relation.transitive) {
      var relateds = this.entities[entitx][relation_name];
      for(i in relateds) {
        if(relateds[i] == entity || this.entities[entity][relation_name].indexOf(relateds[i]) != -1) continue;
        this.fact(entity, relation_name, relateds[i]);
      }
      relateds = this.entities[entity][relation.opposite];
      for(i in relateds) {
        if(relateds[i] == entitx || this.entities[entitx][relation.opposite].indexOf(relateds[i]) != -1) continue;
        this.fact(entitx, relation.opposite, relateds[i]);
      }
    }
  };

  this.entities  = {};
  this.relations = {};
  this.add('is', {opposite: 'contains', transitive: true});

  return this;
}


if(typeof require != 'undefined') {
  module.exports.Semnet = Semnet;
  module.exports.QuerySet = QuerySet;
  //var db = new Semnet();
  //var repl = require('repl');
  //repl.start().context.db = db;
}
