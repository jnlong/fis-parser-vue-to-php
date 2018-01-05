// 将vue单文件中的template转换成php语言

var path = require('path');
var parse5 = require('parse5');
var vuePhp = require('./vue-php');
var vueTemplateCompiler = require('vue-template-compiler');
var root = fis.project.getProjectPath();
var confDef = { ext: '.php', outPath: '', isAddPath: false };

// 将content转换成对象{template:{content:''}, config:{}}
function getBlocks(contentHtml) {
    if (!contentHtml) {
        return {
            template: {content: ''},
            config: {content: ''}
        };
    }
    
    var config;
    var result = (0, vueTemplateCompiler.parseComponent)(contentHtml);
    var ret = {
        template: result.template.content
    };

    result.customBlocks.forEach(function (e, i) {
        ret[e.type] = {
            code: e.content
        };
    });
    
    try {
        ret.config = JSON.parse(ret.config.code);
    } catch (e) {
        ret.config = {};
    }
    return ret;
}

// 使用fis来编译html：转换资源的路径、设置hash等操作
function compileHtml(content, file) {
    var fileName;
    var fileObj;
    var res;

    fileName = file.realpathNoExt + '-vue-php-a' + '.html';
    fileObj = fis.file.wrap(fileName);
    fileObj.cache = file.cache;
    fileObj.release = false;
    fileObj.setContent(content);
    fis.compile.process(fileObj);
    fileObj.links.forEach(function(derived) {
        file.addLink(derived);
    });
    res = fileObj.getContent();
    return res;
}

module.exports = function(content, file, conf) {
    // 整合conf参数
    var parsePath = path.parse(file.realpath);
    var fileName = parsePath.name;
    var addPath = '';
    var resContent = '';
    var objContent;

    try {
        // 1.将content转换成对象
        objContent = getBlocks(content);
        // 2.fis编译
        objContent.template = compileHtml(objContent.template, file);
        // console.log('resContent: '+ objContent.template);
        // 3.vue-php编译
        resContent = vuePhp.getPhpCode(file.realpath, fileName, objContent);
        // 4.输出编译后的文件
        Object.assign(confDef, conf);
        outPath = confDef.outPath;
        if (confDef.isAddPath) {
            addPath = parsePath.dir.split('/').pop();
        }
        var realPath = path.resolve(root, outPath, addPath);
        var realFile = path.resolve(realPath, fileName + confDef.ext);
        // console.log(realPath, realFile);
        if (outPath) {
            fis.util.write(realFile, resContent, 'utf-8', false);
            return content;
        } else {
            return content;
        }
    } catch(e) {
        return content;
    }
}