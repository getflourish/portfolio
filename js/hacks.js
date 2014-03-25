$(document).ready(function() {

    // Lazyload.js will load images when needed and before they are visible in the viewport
    $("img").lazyload({
        threshold: 1000,
        effect: "fadeIn"
    });

    // Set up nav highlight
    var current = $('#nav-projects');
    var currentProject = $('#projects');

    // Progress indicator to show how much you’ve already seen
    $(window).scroll(function() {
        var scrollY = $(window).scrollTop();
        var projectHeight = currentProject.outerHeight();
        var bottom = currentProject.offset().top + projectHeight;
        var percentage = 1 - ((scrollY - bottom) / projectHeight) * -1;
        var x = -200 + current.outerWidth() * percentage;
        current.css('background-position', x + 'px');
    });

    // Highlight the project that is in the viewport
    $('article').each(
        function(intIndex) {

            $(this).waypoint(function(event, direction) {

                var name = $(this).attr('id');

                if (direction == 'down') {
                    if (current != '#nav-' + name) {

                        current.removeClass('selected');
                        current.addClass('striked');
                        history.replaceState("", name, location.pathname + "#" + name);

                        // scroll indicator

                        current.css('background-position', '0px');
                        currentProject = $(this);
                        current = $('#nav-' + name);
                        current.addClass('selected');
                        current.removeClass('striked');
                    }
                    // up
                } else {
                    current = $('#nav-' + name);
                    current.removeClass('selected');
                    current = $('nav li a h3:eq(' + (intIndex) + ')');
                    current.css('background-position', '-200px 0px');

                    if (intIndex > 0) currentProject = $('#projects article:eq(' + (intIndex - 1) + ')');

                    name = currentProject.attr('id');
                    history.replaceState("", name, location.pathname + "#" + name);
                    current = $('#nav-' + name);
                    current.addClass('selected');
                    current.removeClass('striked');
                }
            }, {
                offset: 40
            }, {
                continuous: true
            }, {
                context: '#main'
            })
        });

    // Clicking an anchor will smoothly scroll to the target
    $('.scrollPage').click(function() {
        var elementClicked = $(this).attr("href");
        var destination = $(elementClicked).offset().top;
        var time = 500;
        $("html:not(:animated),body:not(:animated)").animate({
            scrollTop: destination + 1
        }, time, 'swing', function() {
            window.location.href = elementClicked;
        });
        return false;
    });

    // Slider at the beginning of the page
    var vh = $(window).height();
    var vw = $(window).width();

    // magic number
    var introH = $('#intro .project-intro').outerHeight();
    var magic = vh - 60 - introH;

    if (magic < $('#start').height()) {
        magic = vh - introH;
    }

    // offset content by the height of the yellow slide
    var mainOffset = vh + $("#portrait").css("margin-top");
    $('#main').css('margin-top', mainOffset + 'px');

    $('#start').height(vh);
    var startTop = (vh - 577) / 2;
    $('#start').css('top', startTop + 'px');
    var bla = vh + 40;
    var ph = $('#start-wrap').outerHeight();
    var sum = ph + bla;
    var foo = $('#bg').outerHeight();
    var contact = $('#contact').outerHeight();
    $("#spacer").css('top', sum + magic - vh + "px");
    $("#portfolio").css('top', foo - 60 + 'px');


        $('#portrait').waypoint(function(direction) {
            if (direction == "down") {
                $('#start-wrap').css('position', 'relative');
                $('#start-wrap').css('top', startTop + introH + 'px');
                $('footer').addClass("footer-hidden");
            } else {
                $('#start-wrap').css('position', 'fixed');
                $('#start-wrap').css('top', '0px');
                $('footer').removeClass("footer-hidden");
            }
        }, {
            offset: 0
        });

    // show / hide navigation
    $('#intro').waypoint(function(direction) {
        if (direction == "down") {
            $('nav #nav-main').addClass('nav-visible');
        } else {
            $('nav #nav-main').removeClass('nav-visible');
        }
    }, {
        offset: -500,
        scrollThrottle: 200
    });

    // hack
    $('#bg').css('height', vh - 25);

    // window resize
    $(window).resize(function() {
        var main = $('#main');
        var vh = $(window).height();
        $('#bg').css('height', vh - 25);
        $('#zacken').css('top', vh - 25 + 'px');
        var introH = $('#intro .project-intro').outerHeight();
        var magic = vh - 60 - introH;
        main.css('margin-top', magic + 'px');
        $('#contact').css('height', vh + 'px');
        startTop = (vh - 577) / 2;
        $('#start').css('top', startTop + 'px');
    });

    $('#portrait').hover(
        function() {
            $('.megawrapper-content').addClass('megawrapper-top');
        },
        function() {
            $('.megawrapper-content').removeClass('megawrapper-top');
        });
    $('.opener').each(function() {
        $(this).click(function() {
            $("html:not(:animated),body:not(:animated)").animate({
                scrollTop: introH
            }, 500);
        });
    });
    $.waypoints('refresh');

    $('#contact').css('height', vh + 'px');
});