/**
 * Created by Computadora on 08-Jan-17.
 */
'use strict';

var AtomicObject = function(db, objectRef){
    this.db = db;
    this.objectRef = this.db.ref.root.child(objectRef || this.db.ref.primary);
    this.item = {};
    self.eventListenerRef = {};
};

AtomicObject.prototype.$on = function(){
    var self = this;
    self.id = 0;
    return new Promise(function(resolve, reject){
        self.db.server
            .getLatestTS()
            .then(function(serverTS){
                self.objectRef.once('value', function(snapshot) {
                    self.item = self.db.schema.build(snapshot, 'snapshot');
                    self.id = self.generateInstanceID();
                    self.subscribe();

                    resolve(self.id)
                });
            })
            .catch(function(err){reject(err)});
    });

};

/*
 * Event Listeners Subscriber
 * */


AtomicObject.prototype.subscribe = function(){
    var self = this;
    self.subscribed = true;

    self.objectRef.on('child_changed', function(snapshot) {
        self.item[snapshot.key] = snapshot.val();
        document.dispatchEvent( new CustomEvent(self.id + '_object_changed'));
    });

    self.objectRef.on('child_moved', function(snapshot) {
        self.item[snapshot.key] = snapshot.val();
        document.dispatchEvent( new CustomEvent(self.id + '_object_changed'));
    });

    self.objectRef.on('child_removed', function(snapshot) {
        self.item[snapshot.key] = {};
        document.dispatchEvent( new CustomEvent(self.id + '_object_changed'));
    });
};


/*
 * Deactivators
 * */

AtomicObject.prototype.$off = function(){
    this.unsubscribe();
};

AtomicArray.prototype.unsubscribe = function(){
    var self = this;
    if(self.objectRef){
        self.objectRef.off('child_changed');
        self.objectRef.off('child_moved');
        self.objectRef.off('child_removed');
    }
};

/*
 * ID Generation
 * */

AtomicObject.prototype.generateInstanceID = function(){
    return this.generateRandomNumbers() +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers();
};

AtomicObject.prototype.generateRandomNumbers = function(){
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};