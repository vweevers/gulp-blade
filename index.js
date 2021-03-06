var map = require('map-stream');
var gutil = require('gulp-util');
var blade = require('blade');

module.exports = function(options) {
  if(!options) options = {};

  function modifyContents(file, cb) {
    if (file.isNull())
      return cb(null, file) // pass along
    if (file.isStream())
      return cb(new Error("gulp-blade: Streaming not supported"))

    var localOptions = {
      filename: file.path,  // required for blade includes
      basedir: file.base    // typically where a glob starts
    }

    for(var k in options)
      localOptions[k] = options[k]

    blade.compile(file.contents.toString(), localOptions, function(err, res){
      if(err) return cb(err);

      file.contents = new Buffer(res.toString());
      file.path = gutil.replaceExtension(file.path, '.js');

      cb(null, file);
    });
  }

  return map(modifyContents);
}