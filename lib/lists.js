var templates = require('duality/templates'),
    utils = require('./utils'),
    shows = require('./shows'),
    ui = require('./ui'),
    events = require('duality/events'),
    datelib = require('datelib');


exports.app_list = function (head, req) {
    start({code: 200, headers: {'Content-Type': 'text/html'}});

    var row, rows = [];
    while (row = getRow()) {
        row.promo_image = row.value.promo_images.small;
        row.short_description = utils.truncateParagraph(
            row.value.description,
            120
        );
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
    var cfg = doc.kanso.config;
    var ldesc = doc.kanso.config.long_description;

    events.once('afterResponse', function (info, req, res) {
        ui.loadScreenshots(doc, req);
    });

    return {
        title: 'App: ' + doc._id,
        content: templates.render('app_details.html', req, {
            doc: doc,
            long_description_paragraphs: ldesc.split('\n\n'),
            icon_96: cfg.icons['96'],
            updated: datelib.prettify(doc.kanso.push_time),
            title: utils.app_title(doc),
            install_script_url: utils.install_script_url(req, doc._id)
        })
    };
};
