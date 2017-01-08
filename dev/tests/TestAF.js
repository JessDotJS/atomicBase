/**
 * Created by Computadora on 05-Jan-17.
 */
'use strict';

var TestAF = function(){

    this.db = new Database({

        /*
         * Refs Related
         * */

        refs: {
            //root's default = firebase.database().ref()
            primary: 'test', //Required
            secondary: function(test){
                return new Promise(function(resolve, reject){
                    resolve([
                        'secondaryTest/1/' + test.$key,
                        'secondaryTest/2/' + test.$key,
                        'secondaryTest/3/' + test.$key
                    ]);
                });
            },
            foreign: function(test){
                return new Promise(function(resolve, reject){
                    resolve([
                        'foreign/1/foreignTest/1/' + test.$key,
                        'foreign/2/foreignTest/2/' + test.$key,
                        'foreign/3/foreignTest/3/' + test.$key
                    ]);
                });
            }
        },


        /*
         * Schema Related
         * */

        schema: {
            name: {
                value: '=',
                default: 'No name was provided', // When property's value is undefined - Default = null
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
                    return properties.smallNumber * 10
                },
                default: 0
            },
            shortDescription: {
                value: '=',
                default: 'No description was provided'
            },
            priority: 'desc'// Default = 'asc'
        }
    });
};