var templates = require('duality/templates'),
    dutils = require('duality/utils'),
    _ = require('underscore')._;


exports.preloadImage = function (src, callback) {
    var img = $('<img>').attr({ src: src });
    img.load(function () { callback(null, this); });
    img.error(callback);
    return img;
};

exports.loadScreenshots = function (id, meta, req) {
    var cfg = meta.config;
    var screenshots = cfg.screenshots.map(function (s) {
        return {src: dutils.getBaseURL(req) + '/_db/' + id + '/' + s};
    });

    // fade in loading after delay set on css transition
    $('#screenshot_container .loading').css({opacity: 1});

    // preload first image
    exports.preloadImage(screenshots[0].src, function (err, img) {
        if (err) {
            return console.error(err);
        }
        $('#screenshot_container').html(
            templates.render('screenshots.html', req, {
                screenshots: screenshots
            })
        );
        screenshots = _.map(screenshots, function (s, i) {
            function updateTop(img) {
                var h = img.height;
                if (h === 0) {
                    // probably not loaded yet
                    $(img).parents('li').css({marginTop: 0});
                }
                else {
                    s.top = Math.max(400 - h, 0) / 2;
                    $(img).parents('li').css({marginTop: s.top});
                }
            }
            var img = $('#screenshots li img').get(i);
            $(img).load(function () {
                updateTop(this);
            });
            updateTop(img);
            s.left = $('#screenshots ul').position().left - (i * 680);
            return s;
        });

        var curr = 0;

        // show or hide next and prev buttons depending on position
        function toggleBtns() {
            if (screenshots.length <= 1) {
                $('#screenshots .prev').hide();
                $('#screenshots .next').hide();
            }
            if (curr === 0) {
                $('#screenshots .prev').hide();
                $('#screenshots .next').show();
            }
            else if (curr === screenshots.length - 1) {
                $('#screenshots .prev').show();
                $('#screenshots .next').hide();
            }
            else {
                $('#screenshots .prev').show();
                $('#screenshots .next').show();
            }
        }

        // update active screenshot nav position
        function updateNav() {
            $('#screenshot_nav li').removeClass('active');
            var li = $('#screenshot_nav li')[curr];
            $(li).addClass('active');
        }

        function update(val) {
            if (val !== undefined) {
                curr = val;
            }
            $('#screenshots ul').css({
                left: screenshots[curr].left + 'px'
            });
            toggleBtns();
            updateNav();
        }
        update();

        $('#screenshot_nav li').each(function (i) {
            $(this).click(function () {
                update(i);
            });
        });

        $('#screenshot_container .next').click(function () {
            if (curr < screenshots.length - 1) {
                update(curr + 1);
            }
        });
        $('#screenshot_container .prev').click(function () {
            if (curr > 0) {
                update(curr - 1);
            }
        });
    });
};
