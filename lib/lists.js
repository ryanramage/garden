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

    events.once('afterResponse', function (info, req, res) {
        if (cfg.readme) {
            ui.fetchREADME(doc, cfg.readme);
        }
    });

    var screenshots = [];
    if (cfg.screenshots) {
        screenshots = cfg.screenshots.map(function (s) {
            return '/_db/' + doc._id + '/' + s;
        });
    }

    var ldesc = doc.kanso.config.long_description;

    return {
        title: 'App: ' + doc._id,
        content: templates.render('app_details.html', req, {
            doc: doc,
            long_description_paragraphs: ldesc.split('\n\n'),
            icon_96: cfg.icons['96'],
            updated: datelib.prettify(doc.kanso.push_time),
            title: utils.app_title(doc),
            screenshots: screenshots,
            install_script_url: utils.install_script_url(req, doc._id)
        })
    };
};
