# vue-php
将vue模板渲染成php模板
因为本项目是结合vue-php开发的fis插件，所以翻译后的php文件，需要结合[vue-php](https://github.com/Joe3Ray/vue-php)使用。

## 本地运行

``` shell
$ git clone https://github.com/jnlong/fis-parser-vue-to-php
$ cd fis-parser-vue-to-php
$ npm install
```

## fis配置

    // 编译vue组件
    fis.match('component/comm/**.vue', {
        parser: [
            fis.plugin('vue-to-php')
        ]
    });

如果想在发布前输出转换后的php文件，可以使用以下配置设置输出路径
    
    // 编译vue组件
    fis.match('component/comm/**.vue', {
        parser: [
            fis.plugin('vue-to-php',{outPath: 'template_vue', ext: '.ph'})
        ]
    });

##参数

* outPath  // 输出路径，默认为空
* ext      // 输出文件的扩展名，默认为.php

## License

[MIT](https://opensource.org/licenses/MIT)