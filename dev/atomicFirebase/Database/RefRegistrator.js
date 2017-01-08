/**
 * Created by Computadora on 05-Jan-17.
 */
'use strict';

var RefRegistrator = function(refsObject){
    if(firebase != undefined && firebase != null){
        this.root = refsObject.root || firebase.database().ref();
        this.primary = refsObject.primary;
        this.secondary = refsObject.secondary || false;
        this.foreign = refsObject.foreign || false;
    }else{
        throw "Firebase has not been initialized, make sure you initialize it at the end of your index.html (firebase.initializeApp(config);)";
    }
};


RefRegistrator.prototype.getSecondaryRefs = function(afObject){
    var self = this;
    return new Promise(function(resolve, reject){
        self.secondary(afObject).then(function(secondaryRefs){
            resolve(secondaryRefs);
        }).catch(function(err){reject(err)});
    });
};


RefRegistrator.prototype.getForeignRefs = function(afObject){
    var self = this;
    return new Promise(function(resolve, reject){
        self.foreign(afObject).then(function(foreignRefs){
            resolve(foreignRefs);
        }).catch(function(err){reject(err)});
    });
};