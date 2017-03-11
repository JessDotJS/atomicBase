/**
 * Created by Computadora on 08-Jan-17.
 */


'use strict';

var Query = function(ref, schema){
    this.ref = ref;
    this.schema = schema;
};


Query.prototype.create = function(atomicObject){
    var self = this;
    var fanoutObject = {};
    var primaryRef = self.ref.root.child(self.ref.primary);
    return new Promise(function(resolve, reject){
        primaryRef.push(self.schema.build(atomicObject, 'primary')).then(function(snapshot){
            atomicObject.$key = snapshot.key;
            if(self.ref.secondary){
                self.ref.getSecondaryRefs(atomicObject).then(function(secondaryRefs){
                    for(var i = 0; i < secondaryRefs.length; i++){
                        fanoutObject[secondaryRefs[i]] = self.schema.build(atomicObject, 'secondary')
                    }
                    self.processFanoutObject(fanoutObject).then(function(response){
                        resolve(atomicObject.$key);
                    }).catch(function(err){reject(err)});
                }).catch(function(err){reject(err)});
            }else{
                resolve(atomicObject.$key);
            }
        }).catch(function(err){reject(err)});
    });
};

Query.prototype.update = function(atomicObject){
    var self = this;
    return new Promise(function(resolve, reject){
        self.alter(atomicObject, 'update').then(function(response){
            resolve(true);
        }).catch(function(err){reject(err)});
    });
};

Query.prototype.remove = function(atomicObject){
    var self = this;
    return new Promise(function(resolve, reject){
        self.alter(atomicObject, 'update').then(function(response){
            self.alter(atomicObject, 'remove').then(function(response){
                resolve(response);
            }).catch(function(err){reject(err)});
        }).catch(function(err){reject(err)});
    });
};

Query.prototype.alter = function(atomicObject, type){
    var self = this;
    var fanoutObject = {};

    var primary;
    var secondary;
    var foreign;

    if(type == 'update'){
        primary = self.schema.build(atomicObject, 'primary');
        secondary = self.schema.build(atomicObject, 'secondary');
        foreign = self.schema.build(atomicObject, 'foreign');
    }else if(type == 'remove'){
        primary = {};
        secondary = {};
        foreign = {};
    }


    return new Promise(function(resolve, reject){
        /*
         * Primary Ref
         * */

        var objectKey;
        if(atomicObject.$key == undefined){
            objectKey = atomicObject.key;
        }else{
            objectKey = atomicObject.$key;
        }

        fanoutObject[self.ref.primary + '/' + objectKey] = primary;

        /*
         * Secondary & Foreign
         * */
        if(self.ref.secondary && self.ref.foreign){
            self.ref.secondary(atomicObject).then(function(secondaryRefs){
                self.ref.foreign(atomicObject).then(function(foreignRefs){
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
            self.ref.secondary(atomicObject).then(function(secondaryRefs){
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
            self.ref.foreign(atomicObject).then(function(foreignRefs){
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

Query.prototype.set = function(atomicObject){
    var self = this;
    var fanoutObject = {};
    var primaryRef = self.ref.root.child(self.ref.primary);
    return new Promise(function(resolve, reject){
        primaryRef.set(self.schema.build(atomicObject, 'primary')).then(function(snapshot){
            resolve(true);
        }).catch(function(err){reject(err)});
    });
};
