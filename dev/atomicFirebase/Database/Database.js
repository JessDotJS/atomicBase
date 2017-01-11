/**
 * Created by Computadora on 05-Jan-17.
 */

'use strict';

var Database = function(databaseObject){

    /*
     * Refs Related
     * */
    this.ref = new RefRegistrator(databaseObject.refs);

    /*
     * $afPriority Related
     * */

    this.$afPriority = new $afPriority(databaseObject.schema.priority, this.ref);

    /*
     * Schema Related
     * */
    this.schema = new Schema(databaseObject.schema, this.$afPriority);


    /*
     * Query Related
     * */
    this.query = new Query(this.ref, this.schema);


    /*
     * Server Related
     * */
    this.server = new Server(this.ref);


    /*
     * $afArray Related
     * */
    this.$afArray = new $afArray(this.ref, this.schema, this.server);


};

