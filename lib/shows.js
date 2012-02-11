/**
 * Show functions to be exported from the design doc.
 */

var templates = require('duality/templates'),
    events = require('duality/events'),
    jsonp = require('jsonp'),
    utils = require('./utils'),
    ui = require('./ui');


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
    events.once('afterResponse', function (info, req, res) {
        ui.addCategories(req, '#categories');
    });
    return {
        code: 200,
        title: 'Upload your app',
        content: templates.render('upload_app.html', req, {
            upload_url: utils.upload_url(req)
        })
    };
};


exports.kanso_details = function(doc, req) {
    return jsonp.response(req.query.callback, {
            kanso: doc.kanso,
            open_path: utils.open_path(doc),
            style : 'design-doc',  /* option for db to replicate whole db */
            db_src : utils.app_db(req),
            doc_id : doc._id
        });
}
