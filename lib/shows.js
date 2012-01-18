/**
 * Show functions to be exported from the design doc.
 */

var templates = require('duality/templates'),
    utils = require('./utils');


exports.not_found = function (doc, req) {
    return {
        code: 404,
        title: 'Not found',
        content: templates.render('404.html', req, {})
    };
};

exports.install_script = function (doc, req) {
    return {
        code: 200,
        headers: {'Content-Type': 'text/plain'},
        body: templates.render('install.sh', req, {
            app: req.query.name,
            app_url: utils.app_url(req, req.query.name),
            open_path: utils.open_path(doc)
        })
    };
};

exports.upload_app = function (doc, req) {
    return {
        code: 200,
        title: 'Upload your app',
        content: templates.render('upload_app.html', req, {
            upload_url: utils.upload_url(req)
        })
    };
};
