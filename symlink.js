const fs = require('fs');
const sources = ['src', 'test'];

sources.forEach(source => {
  const target = `node_modules/${source}`;
  fs.exists(target, function(isExisting) {
    if (isExisting) {
      return;
    }
    fs.symlinkSync(`../${source}`, target, 'dir');
  });
});
