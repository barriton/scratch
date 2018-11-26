function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dev : {
                options: {
                    sourcemap: 'none',
                    trace: false
                },
                files:[
                    {
                        expand: true,
                        cwd: 'assets/src/css',
                        src: ['default.scss'],
                        dest : 'assets/src/css',
                        ext: '.lint.css'
                    }
                ]
            },
            dist: {
                options: {
                    sourcemap: 'none',
                    trace: true,
                    style: 'compressed'
                },
                files:[
                    {
                        expand: true,
                        cwd: 'assets/src/css',
                        src: ['*.scss'],
                        dest : 'assets/src/css',
                        ext: '.min.css'
                    },
                    {
                        src : ['node_modules/gridlex/src/gridlex.scss'],
                        dest : 'assets/dist/css/gridlex.min.css'
                    }
                ]
            }
        },
        uglify: {
            options: {
                mangle: {
                    reserved : ['jQuery','$']
                },
                compress: {
                    //  drop_console: true
                }
            },
            my_target: {
                files:[{
                    expand: true,
                    cwd : 'assets/src/js',
                    src : ['*.js','!*.min.js'],
                    dest : 'assets/src/js',
                    ext : '.min.js'
                }]
            }
        },
        concat: {
            vendor_css:{
                src: [
                    'assets/src/css/normalize.min.css',
                    'assets/src/css/barriton.min.css',
                    'assets/dist/css/gridlex.min.css'
                ],
                dest : 'assets/dist/css/<%= pkg.prefixVendors %>.min.css'
            },
            css:{
                src: [
                    'assets/src/css/default.min.css'
                ],
                dest : 'assets/dist/css/<%= pkg.prefixDist %>.min.css'
            },
            vendor_js:{
                src: [
                    'node_modules/angular/angular.min.js',
                    'node_modules/angular-inview/angular-inview.js',
                    'node_modules/barriton-bjs/bjs.js'
                ],
                dest: 'assets/dist/js/<%= pkg.prefixVendors %>.min.js'
            },
            script:{
                src: [
                    'assets/src/js/default.min.js'
                ],
                dest : 'assets/dist/js/<%= pkg.prefixDist %>.min.js'
            }
        },
        copy: {
            main: {
                expand: true,
                src : '**',
                dest : 'build/'
            }
        },
        clean : {
            begin : [
                'README.md',
                '.gitignore',
                '.git'
            ],
            pre_build : ['build'],
            build : ['build/.sass-cache',
                'build/node_modules',
                'build/Gruntfile.js',
                'build/package.json',
                'build/assets/src']
        },
        command:{
            run_cmd:{
                cmd: ['chown -R <%= pkg.user %>:<%= pkg.group %> build', 'touch ./build/.build_'+guid()]
            }
        },
        postcss:{
            options: {
                processors: [
                    require('autoprefixer')({browsers: '> 1%, last 2 versions, not ie <= 8'})
                ]
            },
            dist: {
                src: 'assets/src/css/*.lint.css'
            }
        },
        cssmin:{
            target:{
                files:{
                    'assets/src/css/normalize.min.css' : ['node_modules/normalize.css/normalize.css']
                }
            }
        },
        modernizr: {
            dist:{
                "crawl": false,
                "customTests": [],
                "dest": "assets/dist/js/modernizr.js",
                "tests": [
                    "cssremunit",
                    "filereader"
                ],
                "options": [
                    "domPrefixes",
                    "prefixes",
                    "hasEvent",
                    "testAllProps",
                    "testProp",
                    "testStyles",
                    "html5shiv",
                    "setClasses"
                ],
                "uglify": true
            }
        },
        csslint:{
            strict:{
                src : ['assets/src/css/*.lint.css']
            }
        },
        watch: {
            scripts: {
                files : 'assets/src/js/*.js',
                tasks : [
                    'uglify',
                    'concat:vendor_js',
                    'concat:script',
                    'modernizr:dist'
                ]
            },
            styles: {
                files : 'assets/src/css/*.scss',
                tasks: [
                    'sass:dev',
                    'sass:dist',
                    'csslint',
                    'cssmin',
                    'postcss',
                    'concat:vendor_css',
                    'concat:css'
                ]
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
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-contrib-csslint');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('prod', ['uglify', 'concat', 'sass', 'concat', 'clean:pre_build', 'copy', 'clean:build', 'command']);
    grunt.registerTask('clean-prod', ['clean:pre_build']);
    grunt.registerTask('begin', ['clean:begin']);
};