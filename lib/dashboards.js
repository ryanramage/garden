var url = require('url'),
    path = require('path'),
    cookies = require('cookies'),
    dutils = require('duality/utils'),
    _ = require('underscore')._;


exports.default_url = 'http://localhost:5984';
exports._dashboard_urls = [];


exports.completeURL = function (url) {
    if (/\/dashboard\/_design\/dashboard\/_rewrite/.test(url)) {
        return url;
    }
    return url.replace(/\/$/, '') + '/dashboard/_design/dashboard/_rewrite/';
};

exports.getURLs = function () {
    return _.uniq(exports._dashboard_urls);
};

exports.detectLocal = function () {
    if (_.indexOf(exports._dashboard_urls, exports.default_url) === -1) {
        $.ajax({
            url: exports.completeURL(exports.default_url) + 'info?callback=?',
            dataType: 'json',
            jsonp: true,
            success: function (data) {
                exports.add(exports.default_url);
            }
        });
    }
};

exports.readCookie = function () {
    var value = cookies.readBrowserCookie('_dashboard_urls');
    if (value) {
        var durls = JSON.parse(unescape(value));
        exports._dashboard_urls = _.uniq(exports._dashboard_urls.concat(durls));
    }
};

exports.updateCookie = function () {
    cookies.setBrowserCookie(null, {
        name: '_dashboard_urls',
        value: JSON.stringify(exports._dashboard_urls),
        path: dutils.getBaseURL()
    });
};

exports.add = function (url) {
    exports._dashboard_urls.unshift(url);
    exports._dashboard_urls = _.uniq(exports._dashboard_urls);
    exports.updateCookie();
};

exports.init = function () {
    exports.readCookie();
    exports.detectLocal();
    // detect 'dashboard' param in URL
    var parts = url.parse(window.location.toString(), true);
    if (parts.query && parts.query.dashboard) {
        exports.add(parts.query.dashboard);
    }
};

exports.installURL = function (dashboard_url, app_url) {
    dashboard_url = exports.completeURL(dashboard_url);
    var parts = url.parse(dashboard_url, true);
    parts.pathname = path.join(parts.pathname, 'install');
    parts.query.app_url = app_url;
    return url.format(parts);
};

exports.moveToTop = function (url) {
    exports._dashboard_urls = _.without(exports._dashboard_urls, url)
    exports.add(url);
};
