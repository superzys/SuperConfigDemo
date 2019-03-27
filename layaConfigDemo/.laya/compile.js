// v1.0.0
//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
let useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
//获取Node插件和工作路径
let ideModuleDir = useIDENode ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
let workSpaceDir = useIDENode ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\compile.js", "").replace("/.laya/compile.js", "") : "./../";

//引用插件模块
let gulp = require(ideModuleDir + "gulp");
let browserify = require(ideModuleDir + "browserify");
let source = require(ideModuleDir + "vinyl-source-stream");
let tsify = require(ideModuleDir + "tsify");

// 如果是发布时调用编译功能，增加prevTasks
let prevTasks = "";
if (global.publish) {
	prevTasks = ["loadConfig"];
}

//===== zys  configJson的开始
//自己全局安装的插件
let gutil = require(ideModuleDir +  "gulp-util");
// let babel = require("C:\\Users\\zys\\AppData\\Roaming\\npm\\node_modules\\"+ "gulp-babel");
let ts = require("C:\\Users\\zys\\AppData\\Roaming\\npm\\node_modules\\"+ "gulp-typescript");
let uglify = require( ideModuleDir + "gulp-uglify");

// gutil.log(gutil.colors.red('[log]'), "ideModuleDir is " + ideModuleDir);

// gutil.log(gutil.colors.red('[log]'), "start yk " + workSpaceDir);
console.log("start configJosn complie");
gulp.task("configJosn", prevTasks, function () {
	// gutil.log(gutil.colors.red('[log]'), "start configJosn compile");
	return gulp.src([
		// workSpaceDir + "/libs/*.d.ts",
		// workSpaceDir + "/protobuf/**/*.d.ts",
		//如果需要加入 配置库 文件
		workSpaceDir + "/src/Config/**/*.ts"])
		.pipe(ts({
			noImplicitAny: false,
			outFile: "superconfig.js",
			target: "es6",
			lib: ["es6", "dom"],
			removeComments: true,
		}))
		// .pipe(babel({
		// 	presets: ['es2015']
		// }))
		// .pipe(uglify())
		.on('error', function (err) {
			console.log(err.toString());
			// gutil.log(gutil.colors.red('[Error]'), err.toString());
		})
		.pipe(gulp.dest(workSpaceDir + "/bin/js"))
});

let jsontask = ["configJosn"];
//====  configJson的 结束
//使用browserify，转换ts到js，并输出到bin/js目录
gulp.task("compile", jsontask, function () {
	// 发布时调用编译功能，判断是否点击了编译选项
	if (global.publish && !global.config.compile) {
		return;
	} else if (global.publish && global.config.compile) {
		// 发布时调用编译，workSpaceDir使用publish.js里的变量
		workSpaceDir = global.workSpaceDir;
	}
	return browserify({
		basedir: workSpaceDir,
		//是否开启调试，开启后会生成jsmap，方便调试ts源码，但会影响编译速度
		debug: true,
		entries: ['src/Main.ts'],
		cache: {},
		packageCache: {}
	})
		//使用tsify插件编译ts
		.plugin(tsify)
		.bundle()
		//使用source把输出文件命名为bundle.js
		.pipe(source('bundle.js'))
		//把bundle.js复制到bin/js目录
		.pipe(gulp.dest(workSpaceDir + "/bin/js"));
});