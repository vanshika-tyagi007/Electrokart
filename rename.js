const fs = require('fs');
const path = require('path');

const walk = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          if (file.includes('node_modules') || file.includes('.git') || file.includes('uploads')) {
            if (!--pending) done(null, results);
            return;
          }
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk(__dirname, function(err, results) {
  if (err) throw err;
  results.forEach(file => {
    if (file.match(/\.(js|ejs|html|md|css|json)$/)) {
      if (file.endsWith('rename.js') || file.includes('package-lock.json')) return;
      let content = fs.readFileSync(file, 'utf8');
      let original = content;
      
      content = content.replace(/VØLT/g, 'Electrokart');
      content = content.replace(/VOLT/g, 'Electrokart');
      content = content.replace(/volt/g, 'electrokart');
      content = content.replace(/Volt/g, 'Electrokart');
      
      if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated ' + file);
      }
    }
  });
});
