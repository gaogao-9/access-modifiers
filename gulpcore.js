import browserify from "browserify";
import source     from "vinyl-source-stream";
import buffer     from "vinyl-buffer";
import globby     from "globby";
import through    from "through2";
import gulp       from "gulp";
import babel      from "gulp-babel";
import babelify   from "babelify";
import plumber    from "gulp-plumber";
import sourcemaps from "gulp-sourcemaps";
import uglify     from "gulp-uglify";
import extReplace from "gulp-ext-replace";
import notifier   from "node-notifier";
import rimraf     from "rimraf";

gulp.task("debug",(callback)=>{
	// メイン記述用
	const mainPromise = new Promise((resolve,reject)=>{
		const babelPromise = new Promise((resolve,reject)=>{
			gulp.src(["./src/**/!(access-modifiers.browser.js)"])
				.pipe(plumber({
					errorHandler(err){
						notifier.notify({
							message: err.message,
							title: err.plugin,
							sound: "Glass"
						});
					},
				}))
				.pipe(babel())
				.pipe(gulp.dest("./debug"))
				.on("end",resolve);
		});
		
		const browserifyPromise = new Promise((resolve,reject)=>{
			const bundledStream = through();
			
			bundledStream
				.pipe(source("access-modifiers.browser.js"))
				.pipe(buffer())
				.pipe(gulp.dest("./debug/"))
				.on("end",()=>{
					resolve();
				});
			
			globby(["./src/**/access-modifiers.browser.js"]).then((entries)=>{
				const b = browserify({
					entries: entries,
					transform: [babelify]
				});
				
				b.bundle().pipe(bundledStream);
			}).catch(err=>{
				bundledStream.emit("error",err);
			});
		});
		
		Promise.all([babelPromise,browserifyPromise]).then(resolve).catch(reject);
	});
	
	// テスト記述用
	const testPromise = new Promise((resolve,reject)=>{
		gulp.src(["./test/src/**/*.js"])
			.pipe(plumber({
				errorHandler(err){
					notifier.notify({
						message: err.message,
						title: err.plugin,
						sound: "Glass"
					});
				},
			}))
			.pipe(babel())
			.pipe(gulp.dest("./test/debug"))
			.on("end",resolve);
	});
	
	Promise.all([mainPromise,testPromise])
		.then(()=>{callback()})
		.catch(err=>{
			console.error(err.stack);
			throw err;
		});
});

gulp.task("release",["debug"],(callback)=>{
	// メイン記述用
	const mainPromise = new Promise((resolve,reject)=>{
		const rawPromise = new Promise((resolve,reject)=>{
			gulp.src(["./debug/**/*.js"])
				.pipe(gulp.dest("./release"))
				.on("end",resolve);
		});
		
		const minifyPromise = new Promise((resolve,reject)=>{
			gulp.src(["./debug/**/*.js"])
				.pipe(sourcemaps.init({loadMaps: true}))
					.pipe(uglify())
					.pipe(plumber({
						errorHandler(err){
							notifier.notify({
								message: err.message,
								title: err.plugin,
								sound: "Glass"
							});
							reject(err);
						},
					}))
				.pipe(sourcemaps.write("./"))
				.pipe(extReplace(".min.js", ".js"))
				.pipe(gulp.dest("./release"))
				.on("end",resolve);
		});
		
		Promise.all([rawPromise,minifyPromise]).then(resolve).catch(reject);
	});
	
	// テスト記述用
	const testPromise = new Promise((resolve,reject)=>{
		const rawPromise = new Promise((resolve,reject)=>{
			gulp.src(["./test/debug/**/*.js"])
				.pipe(gulp.dest("./test/release"))
				.on("end",resolve);
		});
		const minifyPromise = new Promise((resolve,reject)=>{
			gulp.src(["./test/debug/**/*.js"])
				.pipe(sourcemaps.init({loadMaps: true}))
					.pipe(uglify())
					.pipe(plumber({
						errorHandler(err){
							notifier.notify({
								message: err.message,
								title: err.plugin,
								sound: "Glass"
							});
							reject(err);
						},
					}))
				.pipe(sourcemaps.write("./"))
				.pipe(extReplace(".min.js", ".js"))
				.pipe(gulp.dest("./test/release"))
				.on("end",resolve);
		});
		
		Promise.all([rawPromise,minifyPromise]).then(resolve).catch(reject);
	});
	
	Promise.all([mainPromise,testPromise])
		.then(()=>{callback()})
		.catch(err=>{
			console.error(err.stack);
			throw err;
		});;
});

gulp.task("clean",(callback)=>{
	const mainDebugPromise = new Promise((resolve,reject)=>{
		rimraf("./debug",resolve);
	});
	const mainReleasePromise = new Promise((resolve,reject)=>{
		rimraf("./release",resolve);
	});
	
	// テスト用記述
	const testDebugPromise = new Promise((resolve,reject)=>{
		rimraf("./test/debug",resolve);
	});
	const testReleasePromise = new Promise((resolve,reject)=>{
		rimraf("./test/release",resolve);
	});
	
	Promise.all([mainDebugPromise,mainReleasePromise,testDebugPromise,testReleasePromise])
		.then(()=>{callback()})
		.catch(err=>{
			console.error(err.stack);
			throw err;
		});;
});

gulp.task("watch", function() {
  gulp.watch(["./src/**/*.js","./test/src/**/*.js"], ["debug"]);
});

gulp.task("watch-release", function() {
  gulp.watch(["./src/**/*.js","./test/src/**/*.js"], ["release"]);
});

gulp.task("default", ["debug", "watch"]);

gulp.task("default-release", ["release", "watch-release"]);