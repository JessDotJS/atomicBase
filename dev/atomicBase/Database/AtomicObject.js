/**
 * Created by Computadora on 08-Jan-17.
 */
'use strict';

var AtomicObject = function(afObjectObject){
    this.id = 0;
    this.ref = infiniteDisplayConfig.ref;
    this.objectBuilder = infiniteDisplayConfig.objectBuilder;
    this.firstLotSize = infiniteDisplayConfig.firstLotSize;
    this.nextLotSize = infiniteDisplayConfig.nextLotSize;
    this.eventListenerRef = null;
    this.displayedItems = 0;
    this.subscribed = false;
    this.firstLotLoaded = false;
    this.itemsRemaining = true;
    this.fetching = false;
    this.items = [];
};


