'use strict';

/*
* Custom ordering is not recommended for large sets of data
* */

var AtomicPriority = function(config, ref){
    this.ref = ref;
    this.increment = 50000000;

    if(config == undefined){
        this.orderSelected = 'dateDesc';
    }else{
        this.orderSelected = config.order;
        this.childAdded = config.childAdded || 'last';
    }

};

AtomicPriority.prototype.getPriority = function(data){
    var self = this;
    if(self.orderSelected != undefined){
        if(self.orderSelected == 'custom'){
            return new Promise(function(resolve, reject){
                self[self.childAdded]().then(function(defaultPriority){
                    resolve(defaultPriority);
                }).catch(function(err){reject(err)});
            });
        }else if(typeof self.orderSelected == 'function'){
            return self.orderSelected(data);
        }else{
            return self[self.orderSelected]();
        }
    }else{
        return self.dateDesc();
    }
};


AtomicPriority.prototype.dateDesc = function(){
    var currentClientTS = new Date().getTime();
    return -(currentClientTS);
};

AtomicPriority.prototype.dateAsc = function(){
    return new Date().getTime();
};



AtomicPriority.prototype.first = function(){
    var self = this;
    var refQuery = self.ref.root.child(self.ref.primary)
        .orderByPriority()
        .limitToFirst(1);
    return new Promise(function(resolve, reject){
        refQuery.once("value").then(function(snapshot){
            if(snapshot.val()){
                var priority = 0;
                snapshot.forEach(function(DataSnapshot) {
                    priority = DataSnapshot.getPriority();
                });
                resolve(priority / 2)
            }else{
                resolve(self.increment);
            }
        }).catch(function(err){reject(err)});
    });
};

AtomicPriority.prototype.last = function(){
    var self = this;
    var refQuery = self.ref.root.child(self.ref.primary)
        .orderByPriority()
        .limitToLast(1);
    return new Promise(function(resolve, reject){
        refQuery.once("value").then(function(snapshot){
            if(snapshot.val()){
                var priority = 0;
                snapshot.forEach(function(DataSnapshot) {
                    priority = DataSnapshot.getPriority();
                });
                resolve(priority + self.increment)
            }else{
                resolve(self.increment);
            }
        }).catch(function(err){reject(err)});
    });
};


AtomicPriority.prototype.previous = function(previousItem){
    var self = this;
    var refQuery = self.ref.root.child(self.ref.primary)
        .orderByPriority()
        .endAt(previousItem.$priority)
        .limitToLast(2);
    return new Promise(function(resolve, reject){
        refQuery.once("value").then(function(snapshot){
            var acum = 0;
            snapshot.forEach(function(itemSnapshot){
                acum += itemSnapshot.getPriority()
            });
            resolve(acum / 2);
        }).catch(function(err){reject(err)});
    });
};

AtomicPriority.prototype.next = function(nextItem){
    var self = this;
    var refQuery = self.ref.root.child(self.ref.primary)
        .orderByPriority()
        .startAt(nextItem.$priority)
        .limitToFirst(2);
    return new Promise(function(resolve, reject){
        refQuery.once("value").then(function(snapshot){
            var acum = 0;
            snapshot.forEach(function(itemSnapshot){
                acum += itemSnapshot.getPriority()
            });
            resolve(acum / 2);
        }).catch(function(err){reject(err)});
    });
};







AtomicPriority.prototype.isFirst = function(item){
    var self = this;
    return new Promise(function(resolve, reject){
        self.first().then(function(firstPosition){
            if(item.$priority == firstPosition){
                resolve(true)
            }else{
                resolve(false)
            }
        }).catch(function(err){reject(err)});
    });
};

AtomicPriority.prototype.isLast = function(item){
    var self = this;
    return new Promise(function(resolve, reject){
        self.last().then(function(lastPosition){
            if(item.$priority == lastPosition){
                resolve(true)
            }else{
                resolve(false)
            }
        }).catch(function(err){reject(err)});
    });
};
