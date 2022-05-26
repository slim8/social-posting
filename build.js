const fs = require('fs');

// File destination.txt will be created or overwritten by default.
fs.copyFile('public/assets/angular/index.html', 'resources/views/angular.blade.php', (err) => {
  if (err) throw err;
});
