const fs = require('fs');

// File destination.txt will be created or overwritten by default.
fs.copyFile('public/angular/index.html', 'resources/views/angular.blade.php', (err) => {
  if (err) throw err;
});


var dir = './public/storage/temporarStored';
var postedVideos = './public/storage/postedVideos';
var postedImages = './public/storage/postedImages';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
if (!fs.existsSync(postedVideos)){
    fs.mkdirSync(postedVideos);
}
if (!fs.existsSync(postedImages)){
    fs.mkdirSync(postedImages);
}

