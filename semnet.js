
function QuerySet(db) {

  this.db    = db;
  this.query = {'and': {}, '_or': []};

  this.filter = function(relation, entity) {
    if(this.query.and[relation]) this.query.and[relation].push(entity);
    else this.query.and[relation] = [entity];
    return this;
  };

  this.or = function(query_set) {
    this.query._or.push(query_set);
    return this;
  };

  this.all = function() {
    var ret_set = {};
    for(query in this.query._or) {
      var entities = this.query._or[query].all();
      for(entity in entities) {
          ret_set[entities[entity]] = true;
      }
    }
    for(ent in this.db.entities) {
      var loop_count = 0, match_count = 0
      for(relation in this.query.and) {
        for(entity in this.query.and[relation]) {
          loop_count++;
          if(this.db.entities[ent][relation] && this.db.entities[ent][relation].indexOf(this.query.and[relation][entity]) != -1) {
              match_count++;
          }
        }
      }
      if(match_count == loop_count) ret_set[ent] = true;
    }
    var ret = [];
    for(entity in ret_set) {
      ret.push(entity);
    }
    return ret;
  };

  return this;
}


function Semnet() {

  this.entities    = {};
  this.relations   = {};
  this.events      = {'add': [], 'fact': [], 'query': []};

  this.on = function(event_type, method) {
    if(this.events[event_type] === undefined) return false;
    this.events[event_type].push(method);
    return true;
  };

  this.export = function() {
    return {entities:  this.entities
           ,relations: this.relations
           };
  }

  this.import = function(json) {
    if(json.entities) this.entities   = json.entities;
    if(json.relations) this.relations = json.relations;
  }

  this.add = function(name, options) {
    if(!this.entities[name]) this.entities[name] = {};
    for(e in this.events.add) {
      this.events.add[e](name);
    }
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
    for(e in this.events.query) {
      this.events.query[e](query);
    }
    return query;
  }

  this.fact = function(entity, relation_name, entitx) {
    if(!this.entities[entity]) this.add(entity);
    if(!this.entities[entitx]) this.add(entitx);
    //TODO check relation existence
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
    for(e in this.events.fact) {
      this.events.fact[e](entity, relation_name, entitx);
    }
  };

  this.add('is', {opposite: 'contains', transitive: true});
}


if(typeof require != 'undefined') {
  module.exports.Semnet = Semnet;
  module.exports.QuerySet = QuerySet;
}
