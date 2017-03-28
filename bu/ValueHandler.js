/**
 * Created by Computadora on 10-Jan-17.
 */
'use strict';

/*
 * Value Handler
 * */

var ValueHandler = function(){
    this.default = null;
};

ValueHandler.prototype.getValue = function(value, data){
    var self = this;
    var foundVal = null;
    var valueType = typeof value;
    if(value != undefined){
        if(valueType == 'string' || valueType == 'number' || valueType == 'object' || valueType == 'boolean'){
            return self.handleNormal(value, data);
        }else if(valueType == 'function'){
            return self.handleFunction(value, data);
        }
    }else{
        return self.default
    }
};


/*
 * Value Handlers
 * */

ValueHandler.prototype.handleNormal = function(value, data){
    if(value == undefined){
        value = self.default;
    }
    return value;
};

ValueHandler.prototype.handleFunction = function(value, data){
    if(value(data) == undefined){
        value = self.default;
    }
    return value(data);
};