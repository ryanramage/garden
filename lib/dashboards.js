var url = require('url'),
    path = require('path'),
    _ = require('underscore')._;


exports._dashboard_urls = [];


exports.completeURL = function (url) {
    if (/\/dashboard\/_design\/dashboard\/_rewrite/.test(url)) {
        return url;
    }
    return url.replace(/\/$/, '') + '/dashboard/_design/dashboard/_rewrite/';
};


exports.detectLocal = function () {
    var default_url = 'http://localhost:5984';
    $.ajax({
        url: exports.completeURL(default_url) + 'info?callback=?',
        dataType: 'json',
        jsonp: true,
        success: function (data) {
            console.log('detected local dashboard');
            exports._dashboard_urls.push(default_url);
            exports._dashboard_urls = _.uniq(exports._dashboard_urls);
        }
    });
};

exports.init = function () {
    console.log('init dashboards');
    exports.detectLocal();
};

exports.installURL = function (dashboard_url, app_url) {
    dashboard_url = exports.completeURL(dashboard_url);
    var parts = url.parse(dashboard_url, true);
    parts.pathname = path.join(parts.pathname, 'install');
    parts.query.app_url = app_url;
    return url.format(parts);
};
