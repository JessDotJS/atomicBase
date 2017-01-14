/**
 * Created by Computadora on 05-Jan-17.
 */
'use strict';

var Group = function(){

    this.db = new Database({

        /*
         * Refs Related
         * */

        refs: {
            primary: 'groups',
            foreign: function(group){
                var groupKey;
                var userClass = new User();
                return new Promise(function(resolve, reject){
                    var refArray = [];
                    for (var key in group.users) {
                        if (!group.users.hasOwnProperty(key)) continue;
                        refArray.push(userClass.db.ref.primary + '/' + key + '/groups/' + group.$key || group.key);
                    }
                    resolve(refArray);
                });
            }
        },


        /*
         * Schema Related
         * */

        schema: {
            primary: {
                name: {
                    value: '='
                },
                tasks: {
                    value: '='
                },
                users: {
                    value: '='
                }
            },
            secondary: {
                name: {
                    value: '='
                },
                tasks: {
                    value: '='
                },
                users: {
                    value: '='
                }
            },
            foreign: {
                name: {
                    value: '='
                }
            },

            priority: 'dateDesc'
        }
    });
};