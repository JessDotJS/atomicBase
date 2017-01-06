/**
 * Created by Computadora on 05-Jan-17.
 */
var RefRegistrator = function(refsObject){
    if(firebase != undefined && firebase != null){
        this.root = refsObject.root || firebase.database().ref(); // firebase.initializeApp(config) Required & Mutable
        this.primary = refsObject.primary; // Required
        if(refsObject.secondary != undefined && refsObject.secondary != null){
            this.secondary = this.initSecondaryRefs(refsObject.secondary);// Optional
        }else{
            console.log('Info: No secondary refs Found');
        }
    }else{
        throw "firebase variable couldn't be found, make sure you initialize it at the end of index.html";
    }
};


RefRegistrator.prototype.initSecondaryRefs = function(refs){
    var secondary = {};
    for (var key in refs) {
        // skip loop if the property is from prototype
        if (!refs.hasOwnProperty(key)) continue;
        var obj = refs[key];
        for (var property in obj) {
            // skip loop if the property is from prototype
            if(!obj.hasOwnProperty(property)) continue;
            secondary[key] = obj[property];
        }
    }
    return secondary;
};