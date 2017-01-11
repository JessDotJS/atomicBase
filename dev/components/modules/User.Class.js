/**
 * Created by Computadora on 05-Jan-17.
 */
'use strict';

var User = function(){
    var self = this;
    self.db = new Database({

        /*
         * Refs Related
         * */

        refs: {
            primary: 'users',
            foreign: function(user){
                var groupClass = new Group();
                return new Promise(function(resolve, reject){
                    var refArray = [];
                    for (var key in user.groups) {
                        if (!user.groups.hasOwnProperty(key)) continue;
                        refArray.push(groupClass.db.ref.primary + '/' + key + '/users/' + user.$key || user.key);
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
                groups: {
                    value: '='
                },
                tasks: {
                    value: '='
                }
            },

            secondary: {
                name: {
                    value: '='
                },
                groups: {
                    value: '='
                },
                tasks: {
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




User.prototype.assignToGroup = function(user, group){
    var self = this;
    var groupClass = new Group();
    var userGroup;
    var groupUser;
    if(user.groups == undefined)user.groups = {};
    if(group.users == undefined)group.users = {};
    return new Promise(function(resolve, reject){
        userGroup = self.db.schema.build(user, 'foreign');
        groupUser = groupClass.db.schema.build(group, 'foreign');
        group.users[user.$key] = userGroup;
        user.groups[group.$key] = groupUser;
        self.db.query.update(user)
            .then(function(){
                groupClass.db.query.update(group)
                    .then(function(){
                        resolve(true);
                    }).catch(function(err){reject(err)});
            }).catch(function(err){reject(err)});
    });
};

User.prototype.unassignFromGroup = function(user, group){
    var self = this;
    var groupClass = new Group();
    var userGroup;
    var groupUser;
    if(user.groups == undefined)user.groups = {};
    if(group.users == undefined)group.users = {};
    return new Promise(function(resolve, reject){
        group.users[user.$key] = {};
        user.groups[group.$key] = {};
        self.db.query.update(user)
            .then(function(){
                groupClass.db.query.update(group)
                    .then(function(){
                        resolve(true);
                    }).catch(function(err){reject(err)});
            }).catch(function(err){reject(err)});
    });
};

User.prototype.isAssigned = function(user, group){
    var self = this;
    return new Promise(function(resolve, reject){
        var ref = self.db.ref.root.child("groups/" + group.$key + '/users/' + user.$key);
        ref.once("value").then(function(snapshot){
            resolve(snapshot.exists());
        }).catch(function(err){reject(err)});
    });
};


/*
* Foreign Locations
* */

User.prototype.retrieveGroupRefs = function(){

};