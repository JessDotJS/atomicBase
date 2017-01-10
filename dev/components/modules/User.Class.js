/**
 * Created by Computadora on 05-Jan-17.
 */
'use strict';

var User = function(){

    this.db = new Database({

        /*
         * Refs Related
         * */

        refs: {
            primary: 'users',
            /*foreign: function(user){
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
            name: {
                value: '='
            },
            group: {
                value: '='
            },
            tasks: {
                value: '='
            },
            priority: 'desc'// Default = 'asc'
        }
    });
};



User.prototype.alterUserGroups = function(user, group){
    var self = this;
    var groupClass = new Group();
    var userGroup;
    var groupUser;
    if(user.groups == undefined)user.groups = {};
    if(group.users == undefined)group.users = {};
    return new Promise(function(resolve, reject){
        self.isAssigned(user, group).then(function(isAssigned){
            if(isAssigned){
                userGroup = {};
                groupUser = {};
            }else{
                userGroup = self.db.schema.build(user, 'foreign');
                groupUser = groupClass.db.schema.build(user, 'foreign');
            }
            group.users[user.$key] = userGroup;
            user.groups[group.$key] = groupUser;
        }).catch(function(err){reject(err)});
        self.db.query.update(self.db.schema.build(user, 'local'))
            .then(function(){
            groupClass.db.query.update(groupClass.db.schema.build(group, 'local'))
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