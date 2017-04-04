/**
 * Created by Computadora on 10-Jan-17.
 */

'use strict';

var SchemaUtilities = function(){


};

SchemaUtilities.prototype.retrieveConfiguration = function(schema){
    var schemaObject = {};
    if(schema){
        for (var key in schema) {
            if (!schema.hasOwnProperty(key)) continue;
            schemaObject[key] = schema[key];
        }
    }else{
        return schemaObject = false;
    }
    return schemaObject;
};