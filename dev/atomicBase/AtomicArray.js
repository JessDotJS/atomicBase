/**
 * Created by Computadora on 08-Jan-17.
 */
'use strict';

var AtomicArray = function(ref, schema, server, atomicPriority, filters){
    this.ref = ref;
    this.schema = schema;
    this.server = server;
    this.atomicPriority = atomicPriority;
    this.filters = filters;
};



AtomicArray.prototype.$on = function(atomicArrayObject){
    var self = this;
    self.id = 0;

    if(atomicArrayObject != undefined){
        self.arrayRef = atomicArrayObject.ref || self.ref.primary;
        self.query = {
            initialLotSize: atomicArrayObject.initialLotSize || 10,
            nextLotSize: atomicArrayObject.nextLotSize || 12
        };
    }else{
        self.arrayRef = self.ref.primary;
        self.query = {
            initialLotSize: 10,
            nextLotSize: 12
        };
    }

    self.eventListenerRef = null;
    self.displayedItems = 0;
    self.subscribed = false;
    self.initialLotLoaded = false;
    self.itemsRemaining = true;
    self.fetching = false;
    self.items = [];

    return new Promise(function(resolve, reject){
        self.loadInitialLot().then(function(instanceID){
            resolve(instanceID);
        }).catch(function(err){reject(err)});
    });

};




/*
* Content Loaders
* */
AtomicArray.prototype.loadInitialLot = function(){
    var self = this;
    return new Promise(function(resolve, reject){
        var initialLotRef = self.ref.root.child(self.arrayRef).limitToFirst(self.query.initialLotSize);
        initialLotRef
            .once("value")
            .then(function(initialLotItemsSnapshot){
                self.server.updateTS().then(function(){
                    self.server.getTS().then(function(serverTS){
                        initialLotItemsSnapshot.forEach(function(item){
                            self.addItem(item, false);
                        });
                        self.eventListenerRef = self.ref.root.child(self.arrayRef).orderByChild('latestServerTS').startAt(serverTS);
                        self.id = self.generateInstanceID();
                        self.initialLotLoaded = true;
                        self.subscribe();
                        self.applyFilters();
                        resolve(self.id);
                    }).catch(function(err){reject(err)});
                }).catch(function(err){reject(err)});
        });
    });
};


AtomicArray.prototype.loadNextLot = function(){
    var self = this;
    return new Promise(function(resolve, reject){
        if(!self.fetching && self.items[parseInt(self.displayedItems) - 1] != undefined){
            self.fetching = true;
            var previousArrayLength = self.items.length;
            var nextLotRef =
                self.ref.root.child(self.arrayRef).startAt(self.items[parseInt(self.displayedItems) - 1].$priority + 1)
                    .limitToFirst(self.query.nextLotSize);
            nextLotRef.once("value").then(function(snapshot){
                snapshot.forEach(function(childSnapshot) {
                    self.addItem(childSnapshot, false);
                });
                if(previousArrayLength == self.items.length){
                    self.itemsRemaining = false;
                }
                self.applyFilters();
                self.fetching = false;
                resolve(true);
            }).catch(function(err){
                reject(err);
            });
        }else{
            setTimeout(function(){  resolve(false) }, 4000);
        }
    });

};


/*
* AtomicArray Event Dispatcher
* */

AtomicArray.prototype.applyFilters = function(){
    var self = this;
    self.items.sort(self.sortItems());
    document.dispatchEvent( new CustomEvent(self.id + '_apply_filters'));
};

/*
 * Event Listeners Subscriber
 * */


AtomicArray.prototype.subscribe = function(){
    var self = this;
    self.subscribed = true;
    self.eventListenerRef.on('child_added', function(snapshot) {
        //console.log('child_added');
        self.addItem(snapshot, true);
        self.applyFilters();
    });

    self.eventListenerRef.on('child_changed', function(snapshot) {
        //console.log('child_changed');
        self.editItem(snapshot);
        self.applyFilters();
    });

    self.eventListenerRef.on('child_moved', function(snapshot) {
        //console.log('child_moved');
        self.editItem(snapshot);
        self.applyFilters();
    });

    self.eventListenerRef.on('child_removed', function(snapshot) {
        //console.log('child_removed');
        self.removeItem(snapshot);
        self.applyFilters();
    });
};


/*
 * Deactivators
 * */

AtomicArray.prototype.$off = function(){
    this.unsubscribe();
    this.resetDefaults();
};

AtomicArray.prototype.unsubscribe = function(){
    var self = this;
    if(self.subscribed){
        self.eventListenerRef.off('child_added');
        self.eventListenerRef.off('child_changed');
        self.eventListenerRef.off('child_moved');
        self.eventListenerRef.off('child_removed');
        self.subscribed = false;
    }
};

AtomicArray.prototype.resetDefaults = function(){
    this.arrayRef = null;
    this.query = null;
    this.eventListenerRef = null;
    this.displayedItems = 0;
    this.subscribed = false;
    this.initialLotLoaded = false;
    this.itemsRemaining = true;
    this.fetching = false;
    this.items = [];
};


/*
* Item Handlers
* */

AtomicArray.prototype.addItem = function(snapshot, isNew){
    var self = this;
    if(!self.itemExists(snapshot)){
        var afObject = self.schema.build(snapshot, 'snapshot');
        if(isNew)afObject.isNew = true;
        self.items.push(afObject);
        self.displayedItems += 1;
    }
};

AtomicArray.prototype.editItem = function(snapshot){
    var self = this;
    var afObject = self.schema.build(snapshot, 'snapshot');
    for(var i = 0; i < self.items.length; i++){
        if(self.items[i].$key == afObject.$key){
            self.items[i] = afObject;
        }
    }
};

AtomicArray.prototype.removeItem = function(snapshot){
    var self = this;
    for(var i = 0; i < self.items.length; i++){
        if(self.items[i].$key == snapshot.key){
            self.items.splice(i, 1);
            self.displayedItems -= 1;
        }
    }
};


AtomicArray.prototype.itemExists = function(snapshot){
    var self = this;
    var exists = false;
    for(var i = 0; i < self.items.length; i++){
        if(self.items[i].$key == snapshot.key){
            exists = true;
        }
    }
    return exists;
};


/*
* Sorting Functionality
* */

AtomicArray.prototype.sortItems = function(){
    var self = this;
    if(typeof self.atomicPriority.orderSelected == 'string'){
        return self.builtInSort[self.atomicPriority.orderSelected];
    }else if(typeof self.atomicPriority.orderSelected == 'function'){
        return self.builtInSort['dateDesc'];
    }
};

AtomicArray.prototype.builtInSort = {
    custom: function(a, b){
        return a.$priority - b.$priority;
    },
    dateDesc: function(a, b){
        return a.$priority - b.$priority;
    },
    dateAsc: function(a, b){
        return a.$priority + b.$priority;
    }
};

/*
* ID Generation
* */

AtomicArray.prototype.generateInstanceID = function(){
    return this.generateRandomNumbers() +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers();
};

AtomicArray.prototype.generateRandomNumbers = function(){
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};