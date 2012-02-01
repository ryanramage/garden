var templates = require('duality/templates'),
    dutils = require('duality/utils'),
    utils = require('./utils'),
    popup = require('./popup'),
    db = require('db'),
    url = require('url'),
    path = require('path'),
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


exports.addCategories = function (req, el) {
    var current_category = req.query.category;
    var duality = require('duality/core');
    var appdb = db.use(duality.getDBURL());
    var q = {
        reduce: true,
        group_level: 1
    };
    if (exports.category_cache && exports.category_cache_total) {
        var categories = exports.category_cache;
        var total_apps = exports.category_cache_total;
        $(el).replaceWith(
            templates.render('category_list.html', req, {
                categories: categories,
                total_apps: total_apps,
                current_category: current_category
            })
        );
    }
    appdb.getView('garden', 'apps_by_category', q, function (err, data) {
        var total_apps = 0, categories = [];
        _.each(data.rows, function (r) {
            if (r.key === 'total') {
                total_apps = r.value;
            }
            else {
                categories.push({
                    key: r.key[0],
                    name: utils.toSentenceCase(r.key[0]),
                    count: r.value
                });
            }
        });
        if (JSON.stringify(categories) !== JSON.stringify(exports.category_cache) ||
            exports.category_cache_total !== total_apps) {

            exports.category_cache = categories;
            exports.category_cache_total = total_apps;
            $(el).replaceWith(
                templates.render('category_list.html', req, {
                    categories: categories,
                    total_apps: total_apps,
                    current_category: current_category
                })
            );
        }
    });
};

/**
 * Add syntax highlighting to the page using highlight.js (hljs)
 */

exports.syntaxHighlight = function () {
    $('pre > code').each(function () {
        if (this.className) {
            // has a code class
            $(this).html(hljs.highlight(this.className, $(this).text()).value);
        }
    });
};


exports.create

exports.showInstallPopup = function (req, id) {
    var content = templates.render('install_popup_content.html', req, {});
    popup.closeAll();
    var el = popup.open(req, {
        content: content,
        width: 700,
        height: 300
    });
    $('#manual_install img').click(function (ev) {
        exports.createManualInstructions(el, req, id);
    });
    $('#install_to_dashboard img').click(function (ev) {
        var dashboard_urls = [];
        var default_url = 'http://localhost:5984' +
            '/dashboard/_design/dashboard/_rewrite/';

        $.ajax({
            url: default_url + 'info?callback=?',
            dataType: 'json',
            jsonp: true,
            success: function (data) {
                dashboard_urls.push(default_url);
                dashboard_urls = _.uniq(dashboard_urls);
                exports.createDashboardInstructions(
                    el, req, id, dashboard_urls
                );
            },
            error: function () {
               // ignore errors, but don't show default unless explictly added
               dashboard_urls = _.uniq(dashboard_urls);
               exports.createDashboardInstructions(
                   el, req, id, dashboard_urls
                );
            }
        });
    });
};

exports.createManualInstructions = function (el, req, id) {
    $('.note-inner', el).html(
        templates.render('install_popup_manual.html', req, {
            install_script_url: utils.install_script_url(req, id)
        })
    );
    $('.note-actions', el).prepend(
        '<a href="#" class="btn backbtn">&lt; Back</a>' +
        '<a href="#" class="btn primary">Done</a>'
    );
    $('.note-actions .primary', el).click(function (ev) {
        ev.preventDefault();
        popup.close(el);
        return false;
    });
    $('.note-actions .backbtn', el).click(function (ev) {
        ev.preventDefault();
        exports.showInstallPopup(req, id);
        return false;
    });
};

exports.createDashboardInstructions = function (el, req, id, dashboard_urls) {
    $('.note-inner', el).html(
        templates.render('install_popup_dashboard.html', req, {
            dashboard_urls: _.map(dashboard_urls, function (url, i) {
                return {id: i, url: url};
            })
        })
    );
    $('.note-actions', el).prepend(
        '<a href="#" class="btn backbtn">&lt; Back</a>' +
        '<a href="#" class="btn primary">Install</a>'
    );
    $('.note-actions .primary', el).click(function (ev) {
        ev.preventDefault();
        var baseURL = dutils.getBaseURL(req);
        var durl;
        if ($('#dashboard_custom').get(0).checked) {
            durl = $('#dashboard_custom_text').val();
        }
        else {
            durl = $('input[name="dashboard_url"]').val();
        }
        var parts = url.parse(durl, true);
        parts.pathname = path.join(parts.pathname, 'install');
        parts.query.app_url = baseURL + '/details/' + id;
        var install_url = url.format(parts);
        window.open(install_url);
        popup.close(el);
        return false;
    });
    $('.note-actions .backbtn', el).click(function (ev) {
        ev.preventDefault();
        exports.showInstallPopup(req, id);
        return false;
    });
};
