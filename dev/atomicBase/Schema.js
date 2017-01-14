'use strict';


/*
* Schema initialization
*
* @param - Schema Object & atomicPriority
* @returns - void
* */

var Schema = function(schema, atomicPriority){
    if(schema != undefined && schema != null){
        var schemaUtilities = new SchemaUtilities();

        this.atomicPriority = atomicPriority;

        //Build Schema Configuration Objects
        this.primary = schemaUtilities.retrieveConfiguration(schema.primary);
        this.secondary = schemaUtilities.retrieveConfiguration(schema.secondary);
        this.foreign = schemaUtilities.retrieveConfiguration(schema.foreign);
    }else{
        throw "There was an error in your schema object.Schema couldn't initialize.";
    }
};

/*
* Build
*
 * @params
 * data - an afObject coming from snapshot build
 * type - available options: snapshot, primary, secondary & foreign
 * @returns - proper formatted object with desired schema
* */

Schema.prototype.build = function(data, type){
    var self = this;
    var properties;
    if(type == 'snapshot'){
        properties = data.val();
    }else{
        properties = data;
    }
    if(self.getDefaults(data, type).then == undefined){
        return self.buildSchemaProperties(self.getDefaults(data, type), properties, type);
    }else{
        return new Promise(function(resolve, reject){
            self.getDefaults(data, type).then(function(defaults){
                resolve(self.buildSchemaProperties(defaults, properties, type));
            }).catch(function(err){reject(err)})
        });
    }
};


/*
 * Build Schema Properties
 *
 * @params
 * defaults - default object properties
 * data - an afObject coming from snapshot build
 * type - available options: snapshot, primary, secondary & foreign
 * @returns - final schema object
 * */

Schema.prototype.buildSchemaProperties = function(defaults, data, type){
    var self = this;
    var dataObject = defaults;
    var selfSchema;
    if(type == 'snapshot'){
        selfSchema = self['primary'];
        type = 'primary';
    }else{
        selfSchema = self[type];
    }
    for (var key in selfSchema) {
        if (!selfSchema.hasOwnProperty(key)) continue;
        dataObject[key] = self.getPropertyValue({
            key: key,
            value: data[key]
        }, data, type);
    }
    return dataObject;
};


/*
 * Get Property Value
 *
 * @params
 * propertyObject - default object properties
 * propertiesData - an afObject coming from snapshot build
 * type - available options: snapshot, primary, secondary & foreign
 * @returns - final schema object
 * */

Schema.prototype.getPropertyValue = function(propertyObject, propertiesData, type){
    var self = this;
    var valueHandler = new ValueHandler();
    var dataValue;

    if(self[type][propertyObject.key].value == '='){
        dataValue = valueHandler.getValue(propertyObject.value, propertiesData);
        if(dataValue == undefined || dataValue == null){
            dataValue = valueHandler.getValue(self[type][propertyObject.key].default, propertiesData);
        }
    }else{
        dataValue = valueHandler.getValue(self[type][propertyObject.key].value, propertiesData);
        if(dataValue == undefined || dataValue == null){
            valueHandler.getValue(self[type][propertyObject.key].default, propertiesData);
        }
    }
    return dataValue;
};


/*
 * Get Defaults
 *
 * @params
 * data - an afObject coming from snapshot build
 * type - available options: snapshot, primary, secondary & foreign
 * @returns - proper formatted object with desired schema defaults
 * */

Schema.prototype.getDefaults = function(data, type){
    var self = this;
    if(self.atomicPriority.order == 'custom'){
        return new Promise(function(resolve, reject){
            self.atomicPriority.getPriority(data).then(function(defaultPriority){
                resolve(self.default[type](data, defaultPriority));
            }).catch(function(err){reject(err)})
        });
    }else{
        return self.default[type](data, self.atomicPriority.getPriority(data));
    }
};


/*
 * Default.type
 *
 * @params
 * data - an afObject coming from snapshot build
 * defaultPriority - predetermined priority of the item
 * type - available options: snapshot, primary, secondary & foreign
 * @returns - final schema object
 * */

Schema.prototype.default = {
    snapshot: function(data, defaultPriority){
        return {
            $key: data.$key || data.key,
            creationTS: data.val().creationTS,
            lastEventTS: data.val().lastEventTS,
            latestServerTS: data.val().latestServerTS,
            $priority: data.getPriority() || defaultPriority
        }
    },
    primary: function(data, defaultPriority){
        var currentClientTS = new Date().getTime();
        return {
            creationTS: data.creationTS || currentClientTS,
            lastEventTS: currentClientTS,
            latestServerTS: firebase.database.ServerValue.TIMESTAMP,
            '.priority': data.$priority  || defaultPriority
        }
    },
    secondary: function(data, defaultPriority){
        var currentClientTS = new Date().getTime();
        return {
            creationTS: data.creationTS || currentClientTS,
            lastEventTS: currentClientTS,
            latestServerTS: firebase.database.ServerValue.TIMESTAMP,
            '.priority': data.$priority  || defaultPriority
        }
    },
    foreign: function(data, defaultPriority){
        var currentClientTS = new Date().getTime();
        return {
            key: data.$key || data.key,
            creationTS: data.creationTS || currentClientTS,
            lastEventTS: currentClientTS,
            latestServerTS: firebase.database.ServerValue.TIMESTAMP,
            '.priority': data.$priority  || defaultPriority
        }
    }
};