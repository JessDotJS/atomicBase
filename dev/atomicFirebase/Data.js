/**
 * Created by Computadora on 05-Jan-17.
 */
afSchema.factory('Data', ['RefRegistrator', function(RefRegistrator){


    var Data = function(dataObject){

        /*
        * Refs Related
        * */
        this.initRefs(dataObject.refs);

        /*
         * Schema Related
         * */



    };


    Data.prototype.initRefs = function(refsObject){
        //root: firebase.database().ref() - Default
        this.refs = new RefRegistrator({
            primary: refsObject.primary,
            secondary: refsObject.secondary
        });
    };


    return Data;
}]);