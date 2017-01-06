/**
 * Created by Computadora on 05-Jan-17.
 */
afSchema.factory('Database', ['RefRegistrator', 'Schema', function(RefRegistrator, Schema){


    var Database = function(databaseObject){

        /*
        * Refs Related
        * */
        this.refs = new RefRegistrator(databaseObject.refs);

        /*
         * Schema Related
         * */
        this.schema = new Schema(databaseObject.schema);


    };





    return Database;
}]);