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
     * Schema Related
     * */
    this.schema = new Schema(databaseObject.schema);

    /*
     * Query Related
     * */
    this.query = new Query(this.ref, this.schema);

};

