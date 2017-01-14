/**
 * Created by Computadora on 08-Jan-17.
 */
'use strict';

var AtomicObject = function(db, objectRef){
    this.db = db;
    this.objectRef = this.db.ref.root.child(objectRef || this.db.ref.primary);
    this.item = {};
};

AtomicObject.prototype.initialize = function(){
    var self = this;
    return new Promise(function(resolve, reject){
        self.objectRef.on('value', function(snapshot) {
            if(snapshot){
                self.item = self.db.schema.build(snapshot, 'snapshot');
                document.dispatchEvent( new CustomEvent('object_changed'));
                resolve(true)
            }
        });
    });

};




/*
 * Deactivators
 * */

AtomicObject.prototype.$off = function(){
    this.objectRef.off();
};