var url = require('url'),
    path = require('path'),
    cookies = require('cookies'),
    dutils = require('duality/utils'),
    _ = require('underscore')._;


exports.default_url = 'http://localhost:5984';
exports._has_local = false;
exports._dashboard_urls = [];


exports.completeURL = function (url) {
    if (/\/dashboard\/_design\/dashboard\/_rewrite/.test(url)) {
        return url;
    }
    return url.replace(/\/$/, '') + '/dashboard/_design/dashboard/_rewrite/';
};

exports.getURLs = function () {
    var durls = exports._dashboard_urls.slice();
    if (exports._has_local) {
        durls.unshift(exports.default_url);
    }
    return _.uniq(durls);
};

exports.detectLocal = function () {
    $.ajax({
        url: exports.completeURL(exports.default_url) + 'info?callback=?',
        dataType: 'json',
        jsonp: true,
        success: function (data) {
            exports._has_local = true;
        }
    });
};

exports.readCookie = function () {
    var value = cookies.readBrowserCookie('_dashboard_urls');
    if (value) {
        var durls = JSON.parse(unescape(value));
        exports._dashboard_urls = _.uniq(exports._dashboard_urls.concat(durls));
    }
};

exports.add = function (url) {
    exports._dashboard_urls.unshift(url);
    exports._dashboard_urls = _.uniq(exports._dashboard_urls);
    cookies.setBrowserCookie(null, {
        name: '_dashboard_urls',
        value: JSON.stringify(exports._dashboard_urls),
        path: dutils.getBaseURL()
    });
};

exports.init = function () {
    exports.detectLocal();
    exports.readCookie();
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
