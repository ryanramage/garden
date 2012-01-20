var dutils = require('duality/utils'),
    url = require('url'),
    db = require('db');


exports.upload_url = function (req) {
    var baseURL = dutils.getBaseURL(req);
    if (req.client) {
        return url.format({
            host: window.location.host,
            protocol: window.location.protocol,
            pathname: baseURL + '/upload'
        });
    }
    else {
        return url.format({
            host: req.headers['Host'],
            protocol: 'http',
            pathname: baseURL + '/upload'
        });
    }
};


exports.app_url = function (req, id) {
    var baseURL = dutils.getBaseURL(req);
    if (req.client) {
        return url.format({
            host: window.location.host,
            protocol: window.location.protocol,
            pathname: baseURL + '/_db/' + db.encode(id),
            query: 'attachments=true'
        });
    }
    else {
        return url.format({
            host: req.headers['Host'],
            protocol: 'http',
            pathname: baseURL + '/_db/' + db.encode(id),
            query: 'attachments=true'
        });
    }
};

exports.install_script_url = function (req, id) {
    var baseURL = dutils.getBaseURL(req);
    if (req.client) {
        return url.format({
            host: window.location.host,
            protocol: window.location.protocol,
            pathname: baseURL + '/details/' + db.encode(id) + '/install.sh'
        });
    }
    else {
        return url.format({
            host: req.headers['Host'],
            protocol: 'http',
            pathname: baseURL + '/details/' + db.encode(id) + '/install.sh'
        });
    }
};

exports.open_path = function (doc) {
    if (doc.kanso.index) {
        return doc.kanso.index;
    }
    if (doc.kanso.baseURL) {
        return doc.kanso.baseURL + '/';
    }
    if (doc.rewrites && doc.rewrites.length) {
        return '/_rewrite/';
    }
    if (doc._attachments && doc._attachments['index.html']) {
        return '/index.html';
    }
    if (doc._attachments && doc._attachments['index.htm']) {
        return '/index.htm';
    }
    return '';
};

exports.app_title = function (doc) {
    var title = doc.kanso.config.name;
    return title.substr(0, 1).toUpperCase() + title.substr(1);
};
