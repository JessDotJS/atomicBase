/**
 * Created by Computadora on 04-Jan-17.
 */

afSchema.factory('Schema', [function(){

    var Schema = function(schema){
        if(schema != undefined && schema != null){
            this.schema = schema;
        }else{
            throw "schemaObject couldn't be found, AF Schema Builder couldn't initialize";
        }
    };

    /*
     * Read
     * */

    Schema.prototype.buildFromSnapshot = function(snapshot){
        return this.buildSchemaProperties({
            $key: snapshot.key,
            creationTS: snapshot.val().creationTS,
            latestServerTS: snapshot.val().latestServerTS,
            $priority: snapshot.val().getPriority()
        }, snapshot.val());
    };


    /*
     * Write
     * */
    Schema.prototype.buildLocal = function(data){
        var currentClientTS = new Date().getTime();
        return this.buildSchemaProperties({
            creationTS: data.creationTS || currentClientTS,
            lastEventTS: currentClientTS,
            latestServerTS: firebase.database.ServerValue.TIMESTAMP,
            '.priority': data.$priority || this.getPriority()
        }, data);
    };



    /*
     * Schema Properties
     * */
    Schema.prototype.buildSchemaProperties = function(defaults, data){
        var dataObject = defaults;
        for (var key in this.schema) {
            if (!this.schema.hasOwnProperty(key)) continue;
            dataObject[key] = this.getPropertyValue({
                key: key,
                value: data[key]
            }, data);
        }
        return dataObject;
    };


    /*
     * Getters
     * */

    Schema.prototype.getPriority = function(){
        var priority = null;
        switch(typeof this.schema.priority){
            case 'string' || 'number':
                priority = this.schema.priority;
                break;
            case 'function':
                priority = this.schema.priority();
                break;
            default:
                break;
        }
        return priority;
    };

    Schema.prototype.getPropertyValue = function(propertyObject, propertiesData){
        var propertyValue = null;
        switch(typeof this.schema[propertyObject.key].value){
            case 'string' || 'number' || 'boolean' || 'object':
                if(this.schema[propertyObject.key].value == '='){
                    console.log(this.getPropertyDefaultValue(propertyObject, propertiesData));
                    propertyValue = propertyObject.value || this.getPropertyDefaultValue(propertyObject, propertiesData)
                }
                break;
            case 'function':
                propertyValue = this.schema[propertyObject.key].value(propertiesData) ||
                    this.getPropertyDefaultValue(propertyObject, propertiesData);
                break;
            default:
                break;
        }
        return propertyValue;
    };

    Schema.prototype.getPropertyDefaultValue = function(propertyObject, propertiesData){
        var defaultValue = null;
        switch(typeof this.schema[propertyObject.key].default){
            case 'string' || 'number' || 'boolean' || 'object':
                defaultValue = this.schema[propertyObject.key].default || null;
                break;
            case 'function':
                defaultValue = this.schema[propertyObject.key].default(propertiesData) || null;
                break;
            default:
                break;
        }
        return defaultValue;
    };


    return Schema;
}]);