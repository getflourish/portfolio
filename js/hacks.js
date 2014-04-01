$(document).ready(function() {

    /**
     * Lazyload images is good for long scrolling pages ;)
     */

    $("img").lazyload({
        threshold: 2000,
        effect: "fadeIn"
    });

    /**
     * Set up smooth scrolling transitions for navigation links.
     * All links with the class 'scrollPage' will use the transition.
     */

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

    function onResize() {

        // Height of the "Zacken"
        zh = 25;

        // Hard coded padding between slide and intro
        pad = 60;

        // misleading naming of the wrapping container that holds everthing below the yellow slideContent
        contentWrap = $("#start-wrap");

        // Let’s get the height of the window, so we can scale the yellow slideContent accordingly
        windowHeight = $(window).height();

        // Vertically center the content inside the slide
        startTop = (windowHeight - slideContent.height()) / 2;
        slideContent.css('top', startTop + 'px');

        // Height of the introduction
        introH = $('#intro .project-intro').height();

        // Scale the slide to fit the window.
        slide.height(windowHeight - zh);

        // Remember the slide height
        var slideHeight = slide.outerHeight();

        // Let’s offset the main content by the height of the intro section.
        // The intro will be positioned at the lower part of the screen, initally hidden, then revealed after a bit of scrolling.
        var mainOffset = windowHeight - startTop;
        contentWrap.css('margin-top', mainOffset + 'px');

        // magic number
        var magic = windowHeight - 60 - introH;

        if (magic < slideContent.height()) {
            magic = windowHeight - introH;
        }

        // Position the Zacken at the bottom of the slide
        $('#zacken').css('top', slideHeight + 'px');

        // Scale the contact to the window height so we can scroll the contact / highlight it in the nav
        $('#contact').css('height', windowHeight + 'px');


        // To be able to scroll the page when it is fixed, we need to make it virtually taller.
        // So we need to know the calculated height of the page and then add a static element to the page that will be offset
        // by that amount. Otherwise the page would only be as tall as the height of the viewport and we wouldn’t be able to
        // scroll and rip off the slideContent at the beginning.
        // We will add an empty container to calculated bottom of the page.

        contentHeight = contentWrap.outerHeight();
        $("#spacer").css('top', contentHeight - windowHeight + "px");
    }


    /**
     * Calculations for the curtain effect at the top of the page.
     * We will have a yellow slideContent that will rip off the bottom, move up and reveal some facts about my life.
     * When all information is unvealed, the main content will begin to move as the user scrolls.
     */

    var contentHeight;
    var contentWrap;
    var introH;
    var pad;
    var startTop;
    var windowHeight;
    var zh;

    // Let’s get access to some important elements
    var main = $("#main");
    var slide = $("#slide");
    var slideContent = $("#slide-content");
    var zacken = $("#zacken");

    if ($(window).width() > 768) {

        // Initially call onResize to calculate all relevant sizes related to the viewport
        onResize();

        // window resize
        $(window).resize(function() {
            onResize();
        });

        // The scroll position of my portrait will loosen the page or make it sticky again.
        // Don’t do this on Mobile, as we can’t get touchmove for now

        $('#portrait').waypoint(function(direction) {
            if (direction == "down") {
                contentWrap.css('position', 'relative');
                contentWrap.css('top', startTop + 'px');
                $('footer').addClass("footer-hidden");
            } else {
                contentWrap.css('position', 'fixed');
                contentWrap.css('top', 0 + 'px');
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
                    scrollTop: introH + zh
                }, 500);
            });
        });

        /**
         * Fancy progress indicators that highlight the current project in the navigation
         */

        // Current is the highlighted link in the navigation. It’s the id of the project with a 'nav-' prefix.
        var current = $('#nav-projects');

        // Current project is the actual project in the main content area.
        var currentProject = $('#projects');

        // Progress indicator to show how much you’ve already seen
        $(window).scroll(function() {

            // The absolute current scroll position
            var scrollY = $(window).scrollTop();

            // The height of the current project is needed so we know how much progress we’ve made
            var projectHeight = currentProject.outerHeight();

            // We need to know where the current project ends
            var bottom = currentProject.offset().top + projectHeight;

            // So we can finally calculate the ratio.
            var percentage = 1 - ((scrollY - bottom) / projectHeight) * -1;

            // We use a background image for the highlight and simply change its position based on the progress.
            // We start with x = -200 and shift it based on the length of the width of the navigation text and the progress we’ve made
            var x = -200 + current.outerWidth() * percentage;
            current.css('background-position', x + 'px');
        });

        /*
         * Logic to figure out what project is in the viewport and should be highlighted
         */

        $('article').each(
            function(intIndex) {

                $(this).waypoint(function(direction) {

                    var name = $(this).attr('id');

                    // Hack to ensure the scroll indicators are working properly - not sure why onResize() is not enough
                    $(window).trigger('resize');

                    if (direction == 'down') {

                        // When we scroll down and reach a project, let’s select this one and strike through the previous one.
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
    } else {
        // misleading naming of the wrapping container that holds everthing below the yellow slideContent
        contentWrap = $("#start-wrap");

        // Let’s get the height of the window, so we can scale the yellow slideContent accordingly
        windowHeight = $(window).height();

        slideContent = $("#slide-content");
        var slideHeight = slide.outerHeight();

        // Vertically center the content inside the slide
        startTop = (windowHeight - slideContent.height()) / 2;
        slideContent.css('top', startTop + 'px');
        // Make the page static
        contentWrap.css('position', 'relative');
        contentWrap.css('top', windowHeight + 'px');

        // Position the Zacken at the bottom of the slide
        $('#zacken').css('top', slideHeight + 'px');

        // Hide the footer on mobile
        $('footer').addClass("footer-hidden");
    }

    // Refresh Waypoints after resize event
    $.waypoints('refresh');
    $(window).trigger('resize');
});