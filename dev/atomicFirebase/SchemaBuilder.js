/**
 * Created by Computadora on 04-Jan-17.
 */


afSchema.factory('SchemaBuilder', ['SchemaPropertyProcessor', function(SchemaPropertyProcessor){
    var SchemaBuilder = function(schemaObject){
        if(schemaObject != undefined && schemaObject != null){
            this.schemaObject = schemaObject;
        }else{
            throw "schemaObject couldn't be found, AF Schema Builder couldn't initialize";
        }
    };

    SchemaBuilder.prototype.build = function(data){
        var dataObject = {};
        var dataType = this.getDataType(data);
        if(dataType == 'snapshot'){
            dataObject = this.buildFromSnapshot(data);
        }else if(dataType == 'normal'){

        }
    };

    SchemaBuilder.prototype.buildFromSnapshot = function(snapshot){
        this.buildSchemaProperties({
            $key: snapshot.key,
            creationTS: snapshot.val().creationTS,
            lastEventTS: snapshot.val().lastEventTS,
            serverTS: snapshot.val().serverTS,
            $priority: snapshot.val().getPriority()
        }, snapshot.val())
    };

    SchemaBuilder.prototype.buildSchemaProperties = function(defaults, data){
        var dataObject = defaults;
        for (var key in this.schemaObject.properties) {
            if (!this.schemaObject.properties.hasOwnProperty(key)) continue;
            var dataObjectValue = data[key];
            for (var property in dataObjectValue) {
                if(!dataObjectValue.hasOwnProperty(property)) continue;
                dataObject[key] = this.getPropertyValue({
                    key: key,
                    value: dataObjectValue[property]
                }, data);
            }
        }
        return dataObject;
    };


    SchemaBuilder.prototype.getPropertyValue = function(propertyObject, propertiesData){
        var propertyValue = null;
        switch(typeof propertyObject.value){
            case 'string':
                if(propertyObject.value == '='){
                    propertyValue = propertiesData[propertyObject.key]
                }else{
                    propertyValue = propertyObject.value;
                }
                break;
            case 'object':

                break;
            case 'function':

                break;
            default:
                break;
        }
        return propertyValue;
    };


    SchemaBuilder.prototype.getDataType = function(data){
        if(data.exists()){
            return 'snapshot';
        }else{
            return 'normal';
        }
    };

    return SchemaBuilder;
}]);