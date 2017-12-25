var fs = require('fs');
var path = require('path');
var vuePhp = require('./vue-php');
var root = fis.project.getProjectPath();
var confDef = { ext: '.php', outPath: '',isAddPath: false};

module.exports = function (content, file, conf) {
    conf = Object.assign(confDef, conf);
    outPath = confDef.outPath;
    var parsePath = path.parse(file.realpath);
    var fileName = parsePath.name;
    var res = vuePhp.getPhpCode(file.realpath, fileName);
    var addPath = '';
    if(confDef.isAddPath){
        addPath = parsePath.dir.split('/').pop();
    }
    var realPath = path.resolve(root, outPath, addPath);
    var realFile = path.resolve(realPath, fileName + confDef.ext);
    console.log(realPath,realFile)
    if (outPath) {
        fs.writeFile(realFile, res, function(err){
            if(err) {
                !fs.existsSync(realPath) && fs.mkdirSync(realPath);
                fs.writeFileSync(realFile, res);
                return content;
            } else {
                return content;
            }
        });
        return content;
    } else {
        return res;
    }
}
