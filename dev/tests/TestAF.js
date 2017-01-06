/**
 * Created by Computadora on 05-Jan-17.
 */

afSchema.factory('TestAF', ['Data', function(Data){



    var TestAF = function(){
        this.data = new Data({

            /*
            * Refs Related
            * */

            refs: {
                primary: 'test', //Required
                secondary: { //Default = null
                    users: function(test){
                        return [
                            'users/1/' + test.$key,
                            'users/2/' + test.$key,
                            'users/3/' + test.$key
                        ];
                    }
                },
                foreign: { //Default = null (Useful when inserting an object inside another object)

                }
            },


            /*
            * Schema Related
            * */

            schema: {
                properties: {
                    name: {
                        value: '=',
                        default: null, // Default = null
                        rules: { //@TODO Firebase rules generator
                            read: true,
                            write: true,
                            validate: false,
                            index: false
                        }
                    },
                    smallNumber: {
                        value: '=',
                        default: 2
                    },
                    biggerNumber: {
                        value: function(properties){
                            return properties.smallNumber * 10;
                        }
                    },
                    negativeNumberCopy: {
                        value: function(properties){
                            return -(properties.biggerNumber)
                        }
                    },
                    shortDescription: {
                        value: '='
                    },
                    longDescription: {
                        value: '=',
                        ifNone: function(){
                            return 5 - 4;
                        }
                    }
                },
                files: 'single'
            }
        });
    };



    return TestAF;
}]);