var templates = require('duality/templates'),
    utils = require('./utils');


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
