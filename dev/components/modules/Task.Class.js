/**
 * Created by Computadora on 05-Jan-17.
 */
'use strict';

var Task = function(){

    this.db = new Database({

        /*
         * Refs Related
         * */

        refs: {
            primary: 'tasks',
            /*foreign: function(task){
                return new Promise(function(resolve, reject){
                    resolve([
                        'foreign/1/foreignTest/1/' + test.$key,
                        'foreign/2/foreignTest/2/' + test.$key,
                        'foreign/3/foreignTest/3/' + test.$key
                    ]);
                });
            }*/
        },


        /*
         * Schema Related
         * */

        schema: {
            primary: {
                name: {
                    value: '='
                },
                description: {
                    value: '='
                }
            },
            secondary: {
                name: {
                    value: '='
                },
                description: {
                    value: '='
                }
            },
            foreign: {
                name: {
                    value: '='
                }
            },

            priority: {
                order: 'dateDesc'
            }
        }
    });
};



var User = function(){

    this.db = new Database({
        refs: {
            //main ref
            primary: 'users',

            /*
            * Imagine a scenario where whenever a user account is created it
            * needs to be saved in the Main Ref & some other refs.
            * */
            secondary: function(user){
                //Beware of the user
                return new Promise(function(resolve, reject){
                    //In this case, the admin user node
                    resolve([
                        'adminUsers/' + user.$key
                    ]);
                });
            },

            foreign: function(task){
                return new Promise(function(resolve, reject){
                    resolve([
                        'foreign/1/foreignTest/1/' + test.$key,
                        'foreign/2/foreignTest/2/' + test.$key,
                        'foreign/3/foreignTest/3/' + test.$key
                    ]);
                });
            }
        },



    });


};