module.exports = function(grunt){
	
	grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat:{
        	options:{
        		 separator: ';'
        	},
        	dist:{
        		src:[
        			'./web/lib/main.js',
        			'./web/lib/directive/**/*.js',
        			'./web/lib/service/**/*.js',
        			'./web/lib/list/**/*.js',
        			'./web/lib/search/**/*.js'
        		],
        		dest:'./web/build/main.js'
        	}
        },
        uglify: {
            options: {
            	//头部
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                src: './web/build/main.js',
                dest: './web/build/main.min.js'
            }
        }
    });

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	
	grunt.registerTask('default', ['concat', 'uglify']);
};
