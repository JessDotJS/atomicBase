/**
 * Created by Computadora on 08-Jan-17.
 */
'use strict';

var Server = function(refObject){
    this.serverRef = refObject.root.child('atomicBase/server')
};


Server.prototype.updateTS = function(){
    var self = this;
    return new Promise(function(resolve, reject){
        self.serverRef.set({TS: firebase.database.ServerValue.TIMESTAMP})
            .then(function(response){
                resolve(response);
            }).catch(function(err){reject(err)});
    });
};

Server.prototype.getTS = function(){
    var self = this;
    return new Promise(function(resolve, reject){
        self.serverRef.once("value")
            .then(function(snapshot){
                resolve(snapshot.val().TS);
            }).catch(function(err){reject(err)});
    });
};

Server.prototype.getLatestTS = function(){
    var self = this;
    return new Promise(function(resolve, reject){
        self.updateTS()
            .then(function(snapshot){
                self.getTS()
                    .then(function(serverTS){
                        resolve(serverTS)  ;
                    })
                    .catch(function(err){reject(err)});
            })
            .catch(function(err){reject(err)});
    });
};