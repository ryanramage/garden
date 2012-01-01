var dutils = require('duality/utils'),
    url = require('url');


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
