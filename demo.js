var jsonFile = require('./index.js');
var path = require('path');
var filename = path.join(process.cwd(), 'data.json');
var isContinue = 3;
process.stdin.resume();
process.stdin.setEncoding('utf8');
displayMessage();
process.stdin.on('data', function(isContinue) {
    console.log('received data:', isContinue);
    switch (parseInt(isContinue)) {
        case 1:
            saveSpelling();
            break;
        case 2:
            checkSpelling();
            break;
        case 3:
            getAllBlankSpelling();
            break;
        case 0:
            done();
            break;
    }
});

function done() {
    console.log('Now that process.stdin is paused, there is nothing more to do.');
    process.exit();
}

function displayMessage() {
    console.log("Hello, Welcome In spellcheck-json module");
    console.log("Press 1 Save spelling");
    console.log("Press 2 check wrong spelling");
    console.log("Press 3 get all spelling will null value");
    console.log("Press 0 exit\n");
}

function saveSpelling() {
    console.log("Enter spelling key:");
    process.stdin.on('data', function(key) {
        console.log("Enter spelling Value:");
        process.stdin.on('data', function(value) {
            jsonFile(filename, function(err, file) {
                var obj = {};
                obj[key.toString().replace(/[\r\n]+/g, '')] = value.toString().replace(/[\r\n]+/g, '');
                file.set(obj);
                file.save(function(noSaveError) {
                    if (noSaveError) {
                        console.log("Error in save spelling");
                        process.stdin.on('data', function(value) {
                            process.exit();
                        });
                    } else {
                        console.log("spelling saved successfully");
                        process.stdin.on('data', function(value) {
                            process.exit();
                        });
                    }
                }).then(function() {
                    process.stdin.on('data', function(value) {
                        process.exit();
                    });
                })['catch'](function() {
                    console.log('Error in save spelling');
                    process.stdin.on('data', function(value) {
                        process.exit();
                    });
                });

            });
        });
    });
}

function checkSpelling() {
    console.log("Enter spelling key:");
    process.stdin.on('data', function(key) {
        jsonFile(filename, function(err, file) {
            if (err) {
                console.log("Error in open file:" + err);
                process.stdin.on('data', function(value) {
                    process.exit();
                });
            } else {
                console.log("Key is:" + key);
                file.get(key.toString().replace(/[\r\n]+/g, '')).then(function(value) {
                    console.log("Key:" + key + ":value:" + value);
                    process.stdin.on('data', function(value) {
                        process.exit();
                    });
                });
            }

        });
    });
}

function getAllBlankSpelling() {
    jsonFile(filename, function(err, file) {
        if (err) {
            console.log("Error in open file:" + err);
            process.stdin.on('data', function(value) {
                process.exit();
            });
        } else {
            file.getAllBlankSpelling(function(dataObj) {
                if (dataObj.length != 0) {
                    dataObj.forEach(function(data) {
                        console.log("value:" + JSON.stringify(data));
                    })
                }
                process.stdin.on('data', function(value) {
                    process.exit();
                });
            });
        }

    });
}
