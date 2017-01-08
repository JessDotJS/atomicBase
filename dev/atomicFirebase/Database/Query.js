/**
 * Created by Computadora on 08-Jan-17.
 */


'use strict';

var Query = function(ref, schema){
    this.ref = ref;
    this.schema = schema;
};


Query.prototype.create = function(afObject){
    var self = this;
    var fanoutObject = {};
    var primaryRef = self.ref.root.child(self.ref.primary);
    return new Promise(function(resolve, reject){
        primaryRef.push(self.schema.build(afObject, 'local')).then(function(snapshot){
            afObject.$key = snapshot.key;
            if(self.ref.secondary){
                self.ref.getSecondaryRefs(afObject).then(function(secondaryRefs){
                    for(var i = 0; i < secondaryRefs.length; i++){
                        fanoutObject[secondaryRefs[i]] = self.schema.build(afObject, 'local')
                    }
                    self.processFanoutObject(fanoutObject).then(function(response){
                        resolve(afObject.$key);
                    }).catch(function(err){reject(err)});
                }).catch(function(err){reject(err)});
            }else{
                resolve(afObject.$key);
            }
        }).catch(function(err){reject(err)});
    });
};

Query.prototype.update = function(afObject){
    var self = this;
    return new Promise(function(resolve, reject){
        self.alter(afObject, 'update').then(function(response){
            resolve(response);
        }).catch(function(err){reject(err)});
    });
};

Query.prototype.remove = function(afObject){
    var self = this;
    return new Promise(function(resolve, reject){
        self.alter(afObject, 'remove').then(function(response){
            resolve(response);
        }).catch(function(err){reject(err)});
    });
};

Query.prototype.alter = function(afObject, type){
    var self = this;
    var fanoutObject = {};
    var formattedObject = {};
    if(type == 'update'){
        formattedObject = self.schema.build(afObject, 'local');
    }
    return new Promise(function(resolve, reject){
        /*
         * Primary Ref
         * */
        fanoutObject[self.ref.primary + '/' + afObject.$key] = formattedObject;

        /*
         * Secondary & Foreign
         * */
        if(self.ref.secondary && self.ref.foreign){
            self.ref.secondary(afObject).then(function(secondaryRefs){
                self.ref.foreign(afObject).then(function(foreignRefs){
                    for(var i = 0; i <secondaryRefs.length; i++){
                        fanoutObject[secondaryRefs[i]] = formattedObject;
                    }
                    for(var i = 0; i < foreignRefs.length; i++){
                        fanoutObject[foreignRefs[i]] = formattedObject;
                    }
                    self.processFanoutObject(fanoutObject).then(function(response){
                        resolve(response);
                    }).catch(function(err){reject(err)});
                }).catch(function(err){reject(err)});
            }).catch(function(err){reject(err)});
        }else if(self.ref.secondary && !self.ref.foreign){
            self.ref.secondary(afObject).then(function(secondaryRefs){
                for(var i = 0; i <secondaryRefs.length; i++){
                    fanoutObject[secondaryRefs[i]] = formattedObject;
                }
                self.processFanoutObject(fanoutObject).then(function(response){
                    resolve(response);
                }).catch(function(err){reject(err)});
            }).catch(function(err){reject(err)});
        }else if(!self.ref.secondary && self.ref.foreign){
            self.ref.foreign(afObject).then(function(foreignRefs){
                for(var i = 0; i < foreignRefs.length; i++){
                    fanoutObject[foreignRefs[i]] = formattedObject;
                }
                self.processFanoutObject(fanoutObject).then(function(response){
                    resolve(response);
                }).catch(function(err){reject(err)});
            }).catch(function(err){reject(err)});
        }
    });
};



Query.prototype.processFanoutObject = function (fanoutObject) {
    var self = this;
    return new Promise(function(resolve, reject){
        self.ref.root.update(fanoutObject).then(function(response){
            resolve(response);
        }).catch(function(err){reject(err)});
    });
};


