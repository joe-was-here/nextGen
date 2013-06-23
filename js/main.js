var nextGen = function ($) {

    $(document).ready(function () {

        var studentPickWrap = $('.studentPicker');
        var studentPicker = $('.studentPicker select');
        var sideBar = $('.sideBar ul');
        //Load the students
        var studentsObj;
        //Get students JSON
        $.getJSON('json/students.json', function (data) {
            var students = [];
            //Populate the students drop down
            $.each(data.students, function(key, val) {
                students.push('<option value="' + key + '" data-course="' + val.course + '" data-completed="' + val.completedModules + '" >' + key + '</option>');
            });
            studentPicker.html(students.join(''));

            //Store data for later
            studentsObj = data;

            //Set up the login button
            $('.studentPicker .btn').click(function () {
                login($('option[value="' + studentPicker.val() + '"]').attr('data-course'), $('option[value="' + studentPicker.val() + '"]').attr('data-completed'));
            });
        });

        //After a student is selected load stuff
        var coursesObj;
        var modulesObj;
        var login = function (course, completed) {
            //Show loader
            studentPickWrap.addClass('loadingCourse').html('<i class="icon-spinner icon-spin"></i>');
            //Get the course JSON
            $.getJSON('json/courses.json', function (data) {
                var modules = [];
                //Load the modules onto the sidebar
                $.each(data.courses[course].modules, function(key, val) {
                    modules.push('<li data-module="' + val + '">Module ' + (key + 1) + '</li>');
                });
                sideBar.html(modules.join(''));
                $($('.sideBar ul li')[completed]).addClass('active');
                moduleBuilder($('.sideBar .active').attr('data-module'));
                //Set up clicks on module
                $('.sideBar ul li').click(function () {
                    var that = $(this);
                    if ( !(that.hasClass('active')) || !($('.navigating').length) ) {
                        $('.sideBar ul li').removeClass('active');
                        that.addClass('active');
                        $('.content').addClass('navigating');
                        moduleBuilder(that.attr('data-module'));
                    }
                });
                //Hide the studentpicker
                studentPickWrap.hide();
            });
        };

        //Populate the modules
        var tasksIcons = {
            'videos' : 'icon-film',
            'pdfs' : 'icon-file-text',
            'tests' : 'icon-file-text-alt',
            'quiz' : 'icon-list-ul',
            'assignments' : 'icon-suitcase',
            'forums' : 'icon-group'
        };
        var moduleBuilder = function (module) {
            var buildModuleIcons = function () {
                //Go through the selected module
                $.each(modulesObj[module], function(key, val) {
                    //Build module icons
                    var countClass = val.length ? 'count' : 'count inactive';
                    tasks.push('<li data-section="' + key + '" class="counters" data-toggle="tooltip" title="' + key + '" data-placement="top">' +
                                    '<i class="' + tasksIcons[key] + '"></i>' +
                                    '<span class="' + countClass + '">' + val.length + '</span>' +
                                '</li>');
                });

                //Put them in a list and append it to the content
                $('<ul/>', {
                    'class': 'moduleTasks',
                    html: tasks.join('')
                }).appendTo('.content');
                var counters = $('.counters');
                counters.tooltip();
                counters.click(function () {
                    var that = $(this);
                    if ( !(that.children('.inactive').length) ) {
                        showContent(that.attr('data-section'));
                    }
                });
            };

            var tasks = [];
            if ( !modulesObj ) {
                //Grab modules JSON
                $.getJSON('json/modules.json', function (data) {
                    modulesObj = data.modules;
                    buildModuleIcons();
                });
            } else {
                $('.content').html('');
                buildModuleIcons();
            }

        };


        //Show content based on which icon was clicked
        var showContent = function (clicked) {
            var activeModule = $('.sideBar .active').attr('data-module');
            var contentToShow = [];

            switch ( clicked ) {
            case 'videos' :
                $.each(modulesObj[activeModule][clicked], function (key, val) {
                    contentToShow.push('<iframe width="560" height="315" src="http://www.youtube.com/embed/' + val + '" frameborder="0" allowfullscreen></iframe>');
                });
                $('.content').html(contentToShow.join('')).removeClass('navigating');
                break;
            case 'pdfs' :
                $.each(modulesObj[activeModule][clicked], function (key, val) {
                    contentToShow.push('<a href="pdfs/' + val + '.pdf" target="_blank">Some PDF</a>');
                });
                $('.content').html(contentToShow.join('')).removeClass('navigating');
                break;
            default :
                break;
            }

        };

    });

}(jQuery);