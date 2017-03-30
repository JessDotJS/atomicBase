# AtomicBase, a Firebase Framework
What is AtomicBase?
AtomicBase is a lightweight Firebase Framework  built in ECMA5.
When working on applications that can potentially reach a large scale we know we can always count on NoSQL Structures and amazing SPA frameworks.

But, why do we keep facing the same challenges over and over?
-Data Consistency - Multilocation Actions (Updates/Deletes)
-Schemaless Structures
-Custom handling of data while building an object in order to perform a Database action
-Correct approach to handle all Refs within an application
-High performance pagination capabilities with smart/planned event listeners in order to maintain the array synced with the Database.

This is where AtomicBase comes in
AtomicBase is in an experimental stage and it is not recommended for production unless you know your way around ECMA5 and the latest Firebase SDK.


Creating an Atomic Class

```javascript
                var User = function(){
                    this.db = new Database({
                        //Ref Registrator.
                        refs: {
                            //main ref
                            primary: 'users',

                            /*
                            * Secondary Refs have 2 purposes:
                            *
                            * 1)When creating a record using SomeClass.db.query.create()
                            * that record will also be created in the secondary refs you
                            * specify
                            *
                            * 2)Multilocation Updates/Deletes
                            * */
                            secondary: function(user){
                                /*
                                * The user parameter contains a formatted object
                                * which will allow you to access all properties
                                * specified in the schema plus $key and $priority
                                */
                                return new Promise(function(resolve, reject){
                                    //In this case, the admin user node
                                    resolve([
                                        'adminUsers/' + user.$key
                                    ]);
                                });
                            },


                            /*
                            * Foreign Refs are specifically for copies in which creation
                            * didn't happen when the original record was created.
                            * For example: A user commenting on a post
                            * with this structure:
                            * post
                            *   comments
                            *       commentKey
                            *           userKey
                            *               name
                            * */
                            foreign: function(user){
                                return new Promise(function(resolve, reject){
                                    resolve([
                                        'post/comments/COMMENT_KEY/' + user.$key,
                                    ]);
                                });
                            }

                            /*
                            * Take Away
                            * The reason the secondary & foreign ref objects return a promise
                            * is because to gather all the necessary refs can take queries, etc.
                            * Make sure you set this right since this mechanism will be taking
                            * care of data consistency in your app.
                            * */
                        },



                        /*
                        * IMPORTANT
                        * Primary, Secondary & Foreign Refs are not required
                        * to have the same properties.
                        * */
                        schema: {
                            primary:{
                                name: {
                                    /*
                                    * value can take any kind of data, including functions.
                                    * In case this data will be provided for sure use '='.
                                    * If the value provided is undefined the Atomic Schema will throw an error
                                    * unless you have setup the default property.
                                    * */
                                    value: '=',
                                    //Recommended when the property is optional
                                    default: null
                                },

                                /*
                                * Imagine a case where you had a property which value depended on another
                                * property. For example, totalBalance = availableBalance + pendingBalance
                                */
                                availableBalance: {
                                    value: '=',
                                    default: 0
                                },
                                pendingBalance: {
                                    value: '=',
                                    default: 0
                                },
                                totalBalance: {
                                    value: function(user){
                                        return user.availableBalance + user.pendingBalance;
                                    }
                                },
                            },
                            secondary:{
                                name: {
                                    value: '='
                                }
                            },
                            foreign:{
                                name: {
                                    value: '='
                                }
                            },


                            //Standard
                            priority:{
                                /*
                                * The order priority can take any value including promises
                                * Built-In functionality: dateDesc
                                */
                                order: 'dateDesc'
                            }

                            //Advanced
                            priority:{
                                /*
                                * If the priority was required to be set dynamically
                                * you can set the order to 'custom' and set the
                                * childAdded configuration as 'first' or 'last'
                                */
                                order: 'custom',
                                childAdded: 'last',
                            }
                    });
                };
```