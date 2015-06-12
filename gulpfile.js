var gulp             = require('gulp'),
    gutil            = require('gulp-util'),
    rev              = require('gulp-rev'),
    revReplace       = require('gulp-rev-replace'),
    stripDebug       = require('gulp-strip-debug'),
    cloudfront       = require('gulp-cloudfront'),
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
    images: './src/assets/img/**/*',
    fonts: './src/assets/fonts/**/*'
};

gulp.task('clean', function(cb) {
  del(['./dist/**/*', paths.dist], cb);
});

gulp.task('copy-fonts', ['clean'], function() {
    return gulp.src(paths.fonts)
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('copy-index', ['clean'], function() {
    return gulp.src(paths.index)
    .pipe(gulp.dest(paths.dist))
});

gulp.task('copy-images', ['clean'], function() {
    return gulp.src(paths.images)
    .pipe(gulp.dest('dist/img'));
});

var fontName = 'Syncano Icons';

gulp.task('iconfont', ['clean'], function (cb) {
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
    .pipe(gulp.dest(paths.dist + '/fonts/icons/'))
    .on('finish', function() {
      cb();
    });
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
  return gulp.src('./dist/**/*')
    .pipe(rev())
    .pipe(gulp.dest(paths.dist))
    .pipe(rev.manifest())
    .pipe(gulp.dest(paths.dist))
});

gulp.task('clean:unrevisioned', ['clean', 'webpack:build', 'revision'], function (cb) {
  var manifest = require('./' + paths.dist + '/rev-manifest.json'),
      delPaths = Object.keys(manifest).map(function (path) {
        return paths.dist + '/' + path;
      });

  del(delPaths, cb);
});


gulp.task('revreplace', ['clean', 'webpack:build', 'revision', 'clean:unrevisioned'], function(){
  var manifest = gulp.src('./' + paths.dist + '/rev-manifest.json');

  return gulp.src('./dist/**/*')
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('publish', ['clean', 'iconfont', 'build'], function() {

  var aws = {
    region: 'eu-west-1',
    distributionId: 'E10VUXJJFKD7D3',
    params: {Bucket: 'syncano-gui-staging'},
    patternIndex: /^\/index-[a-f0-9]{10}\.html(\.gz)*$/gi
  };

  if (ENV === 'production') {
    aws.params.Bucket  = 'admin-syncano-io';
    aws.distributionId = 'E3GVWH8UCCSHQ7';
  }

  var publisher = awspublish.create(aws);

  return gulp.src([
      './dist/**/*',
      '!./dist/rev-manifest.json'
    ])
    .pipe(awspublish.gzip())
    .pipe(publisher.publish())
    .pipe(awspublish.reporter())
    .pipe(cloudfront(aws));
});

gulp.task('copy', ['copy-index', 'copy-images', 'copy-fonts']);
gulp.task('serve', ['webpack-dev-server']);
gulp.task('build', ['webpack:build', 'iconfont', 'revreplace']);
gulp.task('default', ['webpack-dev-server']);