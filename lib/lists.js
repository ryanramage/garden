var templates = require('duality/templates'),
    utils = require('./utils'),
    shows = require('./shows');


exports.app_list = function (head, req) {
    start({code: 200, headers: {'Content-Type': 'text/html'}});

    var row, rows = [];
    while (row = getRow()) {
        rows.push(row);
    }

    return {
        title: 'Apps',
        content: templates.render('app_list.html', req, {
            rows: rows,
            upload_url: utils.upload_url(req)
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

    return {
        title: 'App: ' + doc._id,
        content: templates.render('app_details.html', req, {
            doc: doc,
            install_script_url: utils.install_script_url(req, doc._id)
        })
    };
};
