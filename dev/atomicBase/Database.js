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
     * Atomic Priority Related
     * */


    this.atomicPriority = new AtomicPriority(databaseObject.schema.priority || null, this.ref);

    /*
     * Schema Related
     * */
    this.schema = new Schema(databaseObject.schema, this.atomicPriority);


    /*
     * Query Related
     * */
    this.query = new Query(this.ref, this.schema);


    /*
     * Server Related
     * */
    this.server = new Server(this.ref);


    /*
     * Atomic Array Related
     * */
    this.atomicArray = new AtomicArray(this.ref, this.schema, this.server, this.atomicPriority, databaseObject.filters);



    /*
     * Atomic File Related
     * */
    this.atomicFile = new AtomicFile(this.ref);




};

