var gulp             = require('gulp'),
    gutil            = require('gulp-util'),
    rev              = require('gulp-rev'),
    revReplace       = require('gulp-rev-replace'),
    stripDebug       = require('gulp-strip-debug'),
    del              = require('del'),
    path             = require('path'),
    webpack          = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    webpackConfig    = require('./webpack.config.js'),
    awspublish       = require('gulp-awspublish'),
    iconfont         = require('gulp-iconfont'),
    iconfontCss      = require('gulp-iconfont-css'),
    ENV              = process.env.NODE_ENV || 'development';


var paths = {
    dist: './dist',
    assets: './src/assets',
    index: './src/assets/index.html',
    images: './src/assets/img/**/*'
};

gulp.task('clean', function(cb) {
  del(['./dist/**/*', paths.dist], cb);
});

gulp.task('copy-index', ['clean'], function() {
    return gulp.src(paths.index)
    .pipe(gulp.dest(paths.dist))
});

gulp.task('copy-images', ['clean'], function() {
    return gulp.src(paths.images)
    .pipe(gulp.dest('dist/img'));
});

var fontName = 'SynIcons';

gulp.task('iconfont', ['clean'], function(){
  gulp.src([paths.assets + '/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: fontName,
      path: paths.assets + '/templates/synicons.css',
      targetPath: '../../css/synicons.css',
      fontPath: '/fonts/icons/'
    }))
    .pipe(iconfont({
      fontName: fontName,
      normalize: true,
      fontHeight: 1001
    }))
    .pipe(gulp.dest(paths.dist + '/fonts/icons/'));
});

gulp.task('webpack:build', ['clean', 'copy', 'iconfont'], function(callback) {
    var config     = Object.create(webpackConfig);
    config.devtool = 'sourcemap';
    config.debug   = true;

    if (ENV == 'production') {
      config.progress = false;
      config.debug    = false;
      config.plugins  = config.plugins.concat(
          new webpack.DefinePlugin({
              'process.env': {
                  // This has effect on the react lib size
                  'NODE_ENV': JSON.stringify('production')
              }
          }),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin()
      );
    }

    // run webpack
    webpack(config).run(callback);
});

gulp.task('webpack-dev-server', ['clean', 'copy', 'iconfont'], function() {
    var config = Object.create(webpackConfig);
    config.devtool = 'eval';
    config.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(config), {
        publicPath: '/js/',
        contentBase: paths.dist,
        https: true,
        hot: true,
        stats: {
            colors: true
        }
    }).listen(8080, 'localhost', function(err) {
        if(err) throw new gutil.PluginError('webpack-dev-server', err);
        gutil.log('[webpack-dev-server]', 'https://localhost:8080/');
    });
});


gulp.task('revision', ['clean', 'iconfont', 'webpack:build'], function(){
  return gulp.src(['./dist/**/*.js', './dist/**/*.css'])
    //.pipe(stripDebug())
    .pipe(rev())
    .pipe(gulp.dest(paths.dist))
    .pipe(rev.manifest())
    .pipe(gulp.dest(paths.dist))
});

gulp.task('revreplace', ['clean', 'webpack:build', 'revision'], function(){
  var manifest = gulp.src('./' + paths.dist + '/rev-manifest.json');

  return gulp.src(paths.index)
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('publish', ['clean', 'build'], function() {

  var params = {
    bucket: 'new-dashboard.syncano.rocks',
    region: 'eu-west-1'
  };

  if (ENV === 'production') {
    params.bucket = 'syncano-dashboard-production';
    params.region = 'eu-west-1';
  }

  var publisher = awspublish.create({
    region: params.region,
    params: {
      Bucket: params.bucket
    }
  });

  return gulp.src(['./dist/**/*', '!./dist/rev-manifest.json'])
    .pipe(publisher.publish())
    .pipe(publisher.sync())
    .pipe(awspublish.reporter());
});

gulp.task('copy', ['copy-index', 'copy-images']);
gulp.task('serve', ['webpack-dev-server']);
gulp.task('build', ['webpack:build', 'revreplace']);
gulp.task('default', ['webpack-dev-server']);