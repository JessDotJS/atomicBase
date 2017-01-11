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
        primaryRef.push(self.schema.build(afObject, 'primary')).then(function(snapshot){
            afObject.$key = snapshot.key;
            if(self.ref.secondary){
                self.ref.getSecondaryRefs(afObject).then(function(secondaryRefs){
                    for(var i = 0; i < secondaryRefs.length; i++){
                        fanoutObject[secondaryRefs[i]] = self.schema.build(afObject, 'secondary')
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
        self.alter(afObject, 'update').then(function(response){
            self.alter(afObject, 'remove').then(function(response){
                resolve(response);
            }).catch(function(err){reject(err)});
        }).catch(function(err){reject(err)});
    });
};

Query.prototype.alter = function(afObject, type){
    var self = this;
    var fanoutObject = {};

    var primary;
    var secondary;
    var foreign;

    if(type == 'update'){
        primary = self.schema.build(afObject, 'primary');
        secondary = self.schema.build(afObject, 'secondary');
        foreign = self.schema.build(afObject, 'foreign');
    }else if(type == 'remove'){
        primary = {};
        secondary = {};
        foreign = {};
    }


    return new Promise(function(resolve, reject){
        /*
         * Primary Ref
         * */
        fanoutObject[self.ref.primary + '/' + afObject.$key || afObject.key] = primary;

        /*
         * Secondary & Foreign
         * */
        if(self.ref.secondary && self.ref.foreign){
            self.ref.secondary(afObject).then(function(secondaryRefs){
                self.ref.foreign(afObject).then(function(foreignRefs){
                    for(var i = 0; i <secondaryRefs.length; i++){
                        fanoutObject[secondaryRefs[i]] = secondary;
                    }
                    for(var i = 0; i < foreignRefs.length; i++){
                        fanoutObject[foreignRefs[i]] = foreign;
                    }
                    self.processFanoutObject(fanoutObject).then(function(response){
                        resolve(response);
                    }).catch(function(err){reject(err)});
                }).catch(function(err){reject(err)});
            }).catch(function(err){reject(err)});
        }
        /*
         * Secondary & !Foreign
         * */
        else if(self.ref.secondary && !self.ref.foreign){
            self.ref.secondary(afObject).then(function(secondaryRefs){
                for(var i = 0; i <secondaryRefs.length; i++){
                    fanoutObject[secondaryRefs[i]] = secondary;
                }
                self.processFanoutObject(fanoutObject).then(function(response){
                    resolve(response);
                }).catch(function(err){reject(err)});
            }).catch(function(err){reject(err)});
        }

        /*
         * !Secondary & Foreign
         * */
        else if(!self.ref.secondary && self.ref.foreign){
            self.ref.foreign(afObject).then(function(foreignRefs){
                for(var i = 0; i < foreignRefs.length; i++){
                    fanoutObject[foreignRefs[i]] = foreign;
                }
                self.processFanoutObject(fanoutObject).then(function(response){
                    resolve(response);
                }).catch(function(err){reject(err)});
            }).catch(function(err){reject(err)});
        }

        /*
         * !Secondary & !Foreign
         * */
        else{
            self.processFanoutObject(fanoutObject).then(function(response){
                resolve(response);
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


