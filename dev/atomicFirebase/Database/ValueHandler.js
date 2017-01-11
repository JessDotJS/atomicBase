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
            return self.handleNormal(value, data) || self.default;
        }else if(valueType == 'function'){
            return self.handleFunction(value, data) || self.default;
        }
    }else{
        return self.default
    }
};


/*
 * Value Handlers
 * */

ValueHandler.prototype.handleNormal = function(value, data){
    return value;
};

ValueHandler.prototype.handleFunction = function(value, data){
    return value(data);
};