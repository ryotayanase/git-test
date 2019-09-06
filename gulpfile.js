/* プラグインの読み込み */

// gulpプラグインの読み込み
const gulp = require("gulp");
// Sassをコンパイルするプラグインの読み込み
const sass = require("gulp-sass");
// browserSyncプラグインの読み込み
const browserSync = require("browser-sync");
// htmlファイルを一行に圧縮
const htmlmin = require("gulp-minify-html");
//svg圧縮
const imagemin = require("gulp-imagemin");
//png圧縮
const pngquant = require("imagemin-pngquant");
//jpg圧縮
const mozjpeg = require("imagemin-mozjpeg");
//差分のあるものがある時だけ実行
const changed = require("gulp-changed");

/* End - プラグインの読み込み */

//BrowserSync
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'dist/',
      index: 'index.html'
    },
    //ファイルに変更があった時リロードするかどうか
    watch: true,
  })
});

//htmlを一行にする
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({
      // 余白を除去する
      collapseWhitespace: true,
      // コメントを除去する
      removeComments: true
    }))
    // distに出力
    .pipe(gulp.dest('dist'))
});

//scss to css
gulp.task("scss", function () {
  // style.scssファイルを取得
  return gulp.src('src/css/*.scss')
      // Sassのコンパイルを実行
      .pipe(sass(
        {outputStyle: "compressed"}
      ))
      // cssフォルダー以下に出力
      .pipe(gulp.dest("dist/css"))
});

// src/imgフォルダのjpg,png画像を圧縮して、dist/imgフォルダに保存する
gulp.task('img', function () {
  return gulp.src("src/img/*.{png,jpg,svg,gif}") // srcフォルダ以下のpng,jpg画像を取得する
    .pipe(
      imagemin([
        pngquant({
          quality: "65-80", // 画質
          speed: 1 // スピード
        }),
        mozjpeg({
          quality: 80, // 画質
          progressive: true
        }),
        imagemin.svgo(),
        imagemin.gifsicle()
      ])
    )
    .pipe(gulp.dest("dist/img")); //保存
});

//srcディレクトリからdistディレクトリにコピーする
gulp.task('copy', function () { // 
  return gulp.src('src/**/*.+(ico|pdf|xml|eps|zip|json)')
   // 開発ディレクトリに出力
    .pipe(gulp.dest('dist')) 
});

//ファイルの変更を監視
gulp.task('watcher', function () {
  gulp.watch('src/*.html', gulp.task('html'));
  gulp.watch('./src/css/*.scss', gulp.task('scss'));
});

// src 配下の *.html, *.css ファイルが変更されたリロード。
gulp.task('watch', gulp.series(gulp.parallel('browser-sync', 'watcher', 'html', 'scss', 'img'), function () {
}));