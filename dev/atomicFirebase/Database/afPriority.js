'use strict';

/*
* Custom ordering is not recommended for large sets of data
* */

var $afPriority = function(config, ref){
    this.ref = ref;
    this.increment = 50000000;

    if(config == undefined){
        this.orderSelected = 'dateDesc';
    }else{
        this.orderSelected = config.order;
        this.childAdded = config.childAdded || 'last';
    }

};

$afPriority.prototype.getPriority = function(){
    var self = this;
    if(self.orderSelected != undefined){
        if(self.orderSelected == 'custom'){
            return new Promise(function(resolve, reject){
                self[self.childAdded]().then(function(defaultPriority){
                    resolve(defaultPriority);
                }).catch(function(err){reject(err)});
            });
        }else{
            return self[self.orderSelected]();
        }
    }else{
        return 0;
    }

};


$afPriority.prototype.dateDesc = function(){
    var currentClientTS = new Date().getTime();
    return -(currentClientTS);
};

$afPriority.prototype.dateAsc = function(){
    return new Date().getTime();
};



$afPriority.prototype.first = function(){
    var self = this;
    var refQuery = self.ref.root.child(self.ref.primary)
        .limitToFirst(1)
        .orderByPriority();
    return new Promise(function(resolve, reject){
        refQuery.once("value").then(function(snapshot){
            if(snapshot.exists()){
                resolve(parseInt(snapshot.getPriority()) / 2);
            }else{
                resolve(self.increment);
            }
        }).catch(function(err){reject(err)});
    });
};

$afPriority.prototype.last = function(){
    var self = this;
    var refQuery = self.ref.root.child(self.ref.primary)
        .limitToLast(1)
        .orderByPriority();
    return new Promise(function(resolve, reject){
        refQuery.once("value").then(function(snapshot){
            if(snapshot.exists()){
                resolve(parseInt(snapshot.getPriority()) + self.increment);
            }else{
                resolve(self.increment);
            }
        }).catch(function(err){reject(err)});
    });
};


$afPriority.prototype.previous = function(previousItem){
    var self = this;
    var refQuery = self.ref.root.child(self.ref.primary)
        .endAt(previousItem.$priority)
        .limitToLast(2)
        .orderByPriority();
    return new Promise(function(resolve, reject){
        refQuery.once("value").then(function(snapshot){
            var acum = 0;
            snapshot.forEach(function(itemSnapshot){
                acum += parseInt(itemSnapshot.getPriority())
            });
            resolve(acum / 2);
        }).catch(function(err){reject(err)});
    });
};

$afPriority.prototype.next = function(nextItem){
    var self = this;
    var refQuery = self.ref.root.child(self.ref.primary)
        .startAt(nextItem.$priority)
        .limitToFirst(2)
        .orderByPriority();
    return new Promise(function(resolve, reject){
        refQuery.once("value").then(function(snapshot){
            var acum = 0;
            snapshot.forEach(function(itemSnapshot){
                acum += parseInt(itemSnapshot.getPriority())
            });
            resolve(acum / 2);
        }).catch(function(err){reject(err)});
    });
};

$afPriority.prototype.isFirst = function(item){
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

$afPriority.prototype.isLast = function(item){
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
