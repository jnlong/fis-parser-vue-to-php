var vueTemplateCompiler = require('vue-template-compiler');
var path = require('path');
var fs = require('fs');

function compilerPhp(template) {
    var phpInfo = '';
    try{
        var phpCompiler = require('./vue-template-php-compiler/build');
        var phpInfo = phpCompiler.compile(template);
        return phpInfo;
    }
    catch(e){
        return phpInfo;
    }
}

function getPhpCode(compPath, compName, contentObj) {
    var config = contentObj.config;
    var configData = config.data ? jsObjToPhpArr(config.data) : 'array()';
    var configComponents = config.components ? jsObjToPhpArr(config.components) : 'array()';

    function jsObjToPhpArr(obj) {
        var ret = 'array(';
        var keys = Object.keys(obj);
        keys.forEach(function (e, i) {
            var val = obj[e];
            ret += '"' + e + '" => ';
            if (typeof val === 'string') {
                val = val.replace(/(["'])/g, '\\$1');
                ret += '"' + val + '"';
            } else if (typeof val === 'object') {
                ret += jsObjToPhpArr(val);
            } else {
                ret += val;
            }
            if (i + 1 < keys.length) {
                ret += ',';
            }
        });
        ret += ')';
        return ret;
    }

    // 执行vue-php编译
    var template = contentObj.template;
    var phpInfo = compilerPhp(template);
    if (!phpInfo) {
        console.log('组件 ' + compName + ' 编译失败');
        return phpInfo;
    }

    var phpRender = phpInfo.render;
    var phpStaticRender = phpInfo.staticRenderFns;

    var className = compName.replace(/-/g, '_');
    className = className.split('_').map(function (e, i) {
        var chars = e.split('');
        chars[0] = chars[0].toUpperCase();
        return chars.join('');
    }).join('_');

    // 输出php文件
    // include_once('Vue_Base.php');
    var phpCode = `<?php

        class ${className} extends Vue_Base {

            public $_d = ${configData};
            public $options = array(
                "components" => ${configComponents}
            );
            ${phpStaticRender.map(function (fn, i) {
                return `
            public function _m${i}($ctx) {
                ${fn}
            }
                `;
            }).join('\n')}

            public function _render($ctx) {
                ${phpRender}
            }
        }
        `;

    console.log('组件 ' + compName + ' 编译成功');
    return phpCode;
}
module.exports.getPhpCode = getPhpCode;
