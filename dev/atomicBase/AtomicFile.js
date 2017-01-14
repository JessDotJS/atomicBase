/**
 * Created by Computadora on 13-Jan-17.
 */
'use strict';

var AtomicFile = function(ref){
    this.ref = ref;
    this.progress = 0;
};


AtomicFile.prototype.upload = function(file, customRef){
    var self = this;
    self.progress = 0;
    return new Promise(function(resolve, reject){
        var fileName = self.generateName(file);
        var uploadTask =
            self.ref.rootStorage
                .child(customRef || self.ref.primaryStorage)
                .child(fileName)
                .put(file);

        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            /*
             * nextOrObserver / Optional / (nullable function(non-null Object) or non-null Object)
             * The next function, which gets called for each item in the event
             * stream, or an observer object with some or all of these three
             * properties (next, error, complete).
             * */
            function(snapshot){
                self.progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
            },
            /*
             * error / Optional / function(non-null Error)
             * A function that gets called with an Error if the event stream ends due to an error.
             * Value may be null.
             * */
            function(err){reject(err);},
            /*
             * complete / Optional / function()
             * A function that gets called if the event stream ends normally.
             * Value may be null.
             * */
            function(){
                var fileURL = uploadTask.snapshot.downloadURL;

                resolve({
                    fileName: fileName,
                    fileUrl: fileURL
                });
            });

    });
};

AtomicFile.prototype.delete = function(fileName, customRef){
    var self = this;
    return new Promise(function(resolve, reject){
        self.ref.rootStorage
            .child(customRef || self.ref.primaryStorage + '/' + fileName)
            .delete()
            .then(function(){
                resolve(true);
            })
            .catch(function(err){reject(err)});
    });
};


AtomicFile.prototype.generateName = function(file){
    return this.generateRandomNumbers() +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() + '-' +
        this.generateRandomNumbers() +
        this.generateRandomNumbers() +
        this.generateRandomNumbers() + '.' +
        this.getFileExtension(file);
};

AtomicFile.prototype.generateRandomNumbers = function(){
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

AtomicFile.prototype.getFileExtension = function(file){
    if(file.type == 'image/jpeg') {
        return 'jpeg'
    }else if(file.type == 'image/gif'){
        return 'gif'
    }else if(file.type == 'image/png'){
        return 'png'
    }else if(file.type == 'image/svg'){
        return 'svg'
    }
};
