/**
 * Created by Computadora on 04-Jan-17.
 */

'use strict';



var Schema = function(schema){
    if(schema != undefined && schema != null){
        for (var key in schema) {
            if (!schema.hasOwnProperty(key)) continue;
            this[key] = schema[key];
        }
    }else{
        throw "There was an error in your schema object. AF Schema couldn't initialize.";
    }
};

/*
* Object Builder
* */
Schema.prototype.build = function(data, type){
    var self = this;
    var defaultProperties = {};
    var properties = data;
    switch(type){
        case 'snapshot':
            defaultProperties = self.snapshotDefaults(data);
            properties = properties.val();
            break;
        case 'local':
            defaultProperties = self.localDefaults(data);
            break;
        case 'foreigner':
            defaultProperties = self.foreignerDefaults(data);
            break;
        default:
            break;
    }

    return self.buildSchemaProperties(defaultProperties, properties);
};

/*
 * Read
 * */

Schema.prototype.snapshotDefaults = function(snapshot){
    if(snapshot){
        return {
            $key: snapshot.key,
            creationTS: snapshot.val().creationTS,
            lastEventTS: snapshot.val().lastEventTS,
            latestServerTS: snapshot.val().latestServerTS,
            $priority: snapshot.getPriority() || this.getPriority(snapshot)
        };
    }else{
        return {};
    }
};

Schema.prototype.localDefaults = function(data){
    if(data){
        var currentClientTS = new Date().getTime();
        return {
            creationTS: data.creationTS || currentClientTS,
            lastEventTS: currentClientTS,
            latestServerTS: firebase.database.ServerValue.TIMESTAMP,
            '.priority': data.$priority  || this.getPriority(data)
        };
    }else{
        return {};
    }

};


Schema.prototype.foreignerDefaults = function(data){
    if(data){
        var currentClientTS = new Date().getTime();
        return {
            key: data.$key,
            creationTS: data.creationTS || currentClientTS,
            lastEventTS: currentClientTS,
            latestServerTS: firebase.database.ServerValue.TIMESTAMP,
            '.priority': data.$priority  || this.getPriority(data)
        };
    }else{
        return {};
    }

};


Schema.prototype.getPriority = function(data){
    var self = this;
    var valueHandler = new ValueHandler();
    var priority = null;
    var currentClientTS = new Date().getTime();
    if(typeof self.priority == 'string'){
        switch(self.priority){
            case 'asc':
                priority = currentClientTS;
                break;
            case 'desc':
                priority = -(currentClientTS);
                break;
            default:
                priority = valueHandler.getValue(self.priority, data);
                break;
        }
    }else{
        priority = valueHandler.getValue(self.priority, data);
    }
    return priority;
};


/*
 * Schema Properties
 * */
Schema.prototype.buildSchemaProperties = function(defaults, data){
    var dataObject = defaults;
    for (var key in this) {
        if (!this.hasOwnProperty(key)) continue;
        if(key != 'priority'){
            dataObject[key] = this.getPropertyValue({
                key: key,
                value: data[key]
            }, data);
        }
    }
    return dataObject;
};


/*
 * Getters
 * */
Schema.prototype.getPropertyValue = function(propertyObject, propertiesData){
    var self = this;
    var valueHandler = new ValueHandler();
    var dataValue;

    if(self[propertyObject.key].value == '='){
        dataValue =
            valueHandler.getValue(propertyObject.value, propertiesData) ||
            valueHandler.getValue(self[propertyObject.key].default, propertiesData);
    }else{
        dataValue =
            valueHandler.getValue(self[propertyObject.key].value, propertiesData) ||
            valueHandler.getValue(self[propertyObject.key].default, propertiesData);
    }

    return dataValue;
};