module.exports = function(grunt){

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          sourcemap: 'none',
          trace: true,
          style: 'compressed'
        },
        files:[
          {
            expand: true,
            cwd: 'assets/css/build',
            src: ['*.scss'],
            dest : 'assets/css',
            ext: '.min.css'
          },
          {
            src : ['node_modules/gridlex/src/gridlex.scss'],
            dest : 'assets/css/gridlex.min.css'
          }
        ]
      }
    },
    uglify: {
      options: {
        mangle: {
          except : ['jQuery','$']
        },
        compress: {
          //drop_console: true
        }
      },
      my_target: {
        files:[{
          expand: true,
          cwd : 'assets/js/build',
          src : ['*.js'],
          dest : 'assets/js',
          ext : '.min.js'
        }]
      }
    },
    concat: {
      vendor_css:{
        src: [
          'assets/css/normalize.min.css',
          'assets/css/barriton.min.css',
          'assets/css/gridlex.min.css',
        ],
        dest : 'assets/css/dist/<%= pkg.prefixVendors %>.min.css'
      },
      css:{
        src: [
          'assets/css/default.min.css',
        ],
        dest : 'assets/css/dist/<%= pkg.prefixDist %>.min.css'
      },
      vendor_js:{
        src: [
          'node_modules/jquery/dist/jquery.min.js',
        ],
        dest: 'assets/js/dist/<%= pkg.prefixVendors %>.min.js'
      },
      script:{
        src: [
          'assets/js/default.min.js',
        ],
        dest : 'assets/js/dist/<%= pkg.prefixDist %>.min.js'
      }
    },
    copy: {
      main: {
        expand: true,
        src : '**',
        dest : 'production/'
      }
    },
    clean : {
      begin : [
        'README.md',
        '.gitignore',
        '.git',
        'assets/css/dist/.gitkeep',
        'assets/js/dist/.gitkeep',
        'assets/js/build/.gitkeep'
      ],
      pre_build : ['production'],
      build : ['production/.sass-cache',
        'production/node_modules',
        'production/Gruntfile.js',
        'production/package.json',
        'production/.ftppass',
        'production/assets/css/build',
        'production/assets/css/*.css',
        'production/assets/js/build',
        'production/assets/js/*.js'],
    },
    command:{
      run_cmd:{
        cmd: ['chown -R <%= pkg.user %>:<%= pkg.group %> production']
      }
    },
    postcss:{
      options: {
        processors: [
          require('autoprefixer')({browsers: '> 1%, last 2 versions, not ie <= 8'})
        ]
      },
      dist: {
        src: 'assets/css/*.css'
      }
    },
    cssmin:{
      target:{
        files:{
          'assets/css/normalize.min.css' : ['node_modules/normalize.css/normalize.css']
        }
      }
    },
    modernizr: {
      dist: {
        parseFiles: true,
        dest : 'assets/js/dist/modernizr.js',
        options : [
          'cssremunit','filereader','domprefixes','hasevent','prefixes','setclasses','shiv','testallprops','testprop','teststyles'
        ]
      }
    },
    watch: {
      scripts: {
        files : 'assets/js/build/*.js',
        tasks : [
          'uglify',
          'concat',
          'modernizr:dist'
        ]
      },
      styles: {
        files : 'assets/css/build/*.scss',
        tasks: [
          'sass',
          'cssmin',
          'postcss',
          'concat'
        ]
      }
    },
    'ftp-deploy':{
      build:{
        auth:{
          host: '<%= pkg.ftp.host %>',
          port: '<%= pkg.ftp.port %>',
          authKey : 'key'
        },
        src : 'production',
        dest : '/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-commands');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-ftp-deploy');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-modernizr');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('prod', ['uglify', 'concat', 'sass', 'concat', 'clean:pre_build', 'copy', 'clean:build', 'command']);
  grunt.registerTask('deploy', ['ftp-deploy']);
  grunt.registerTask('clean-prod', ['clean:pre_build']);
  grunt.registerTask('begin', ['clean:begin']);
};