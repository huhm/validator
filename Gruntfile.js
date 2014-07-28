module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%=pkg.author%> | <%= pkg.homepage %> */\n'
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            'validator.js': {
                src: './src/validator.js',
                dest: './dist/validator.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);

};