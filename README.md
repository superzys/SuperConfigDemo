# SuperConfigDemo
编译已加入 编译superconfig.js 到bin/js目录下。
需要自行安装几个依赖库
>npm install -g gulp-typescript
>npm install -g gulp-typescript
>npm install -g gulp-uglify

如果没有更改过配置 数据， 想提升编译速度 自行修改 compile.js 文件

1. 注释编译 数据部分
注释20行 //===== zys  configJson的开始 
一直到 57行 //====  configJson的 结束

2.修改  59行 gulp.task("compile", jsontask, function () { 
    为  gulp.task("compile", prevTasks, function () {
