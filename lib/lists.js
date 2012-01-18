var templates = require('duality/templates'),
    utils = require('./utils'),
    shows = require('./shows'),
    ui = require('./ui'),
    events = require('duality/events');


exports.app_list = function (head, req) {
    start({code: 200, headers: {'Content-Type': 'text/html'}});

    var row, rows = [];
    while (row = getRow()) {
        rows.push(row);
    }

    return {
        title: 'Apps',
        content: templates.render('app_list.html', req, {
            rows: rows
        })
    };
};


exports.app_details = function (head, req) {
    start({code: 200, headers: {'Content-Type': 'text/html'}});

    var row, rows = [];
    while (row = getRow()) {
        rows.push(row);
    }

    if (!rows.length) {
        return shows.not_found(null, req);
    }
    var doc = rows[0].doc;
    var screenshot = doc.kanso.screenshots ? doc.kanso.screenshots[0]: null;

    events.once('afterResponse', function (info, req, res) {
        if (doc.kanso.readme) {
            ui.fetchREADME(doc, doc.kanso.readme);
        }
    });

    return {
        title: 'App: ' + doc._id,
        content: templates.render('app_details.html', req, {
            doc: doc,
            screenshot: screenshot,
            install_script_url: utils.install_script_url(req, doc._id)
        })
    };
};
