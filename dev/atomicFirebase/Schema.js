/**
 * Created by Computadora on 04-Jan-17.
 */

afSchema.factory('Schema', ['SchemaBuilder', function(SchemaBuilder){

    var Schema = function(schemaObject){
        if(schemaObject != undefined && schemaObject != null){


        }else{
            throw "schemaObject couldn't be found, AF Schema couldn't initialize";
        }
    };

    Schema.prototype.buildFromSnapshot = function(propertiesObject){
        var propertiesObject = {};

        return propertiesObject;
    };

    return Schema;
}]);