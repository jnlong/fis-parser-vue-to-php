var fs = require('fs');
var path = require('path');
var vuePhp = require('./vue-php');
var root = fis.project.getProjectPath();
var confDef = { ext: '.php', outPath: '' };

module.exports = function (content, file, conf) {
    conf = Object.assign(confDef, conf);
    outPath = confDef.outPath;
    var fileName = path.parse(file.realpath).name;
    var res = vuePhp.getPhpCode(file.realpath, fileName);
    var realFile = path.resolve(root, outPath, fileName + confDef.ext);
    if (outPath) {
        fs.writeFileSync(realFile, res);
        return	content;
    } else {
        return res;
    }
}
