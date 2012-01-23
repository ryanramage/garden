var templates = require('duality/templates'),
    utils = require('./utils'),
    shows = require('./shows'),
    ui = require('./ui'),
    events = require('duality/events'),
    datelib = require('datelib');


exports.app_list = function (head, req) {
    start({code: 200, headers: {'Content-Type': 'text/html'}});

    if (req.client && utils.initial_hit) {
        // dont' bother with the second render, nothing new to show
    }
    else {
        var row, rows = [];
        while (row = getRow()) {
            var promo_images = row.value.config.promo_images || {};
            row.promo_image = promo_images.small;
            row.short_description = utils.truncateParagraph(
                row.value.config.description,
                120
            );
            row.title = utils.app_title(row.value.config);
            rows.push(row);
        }

        return {
            title: 'Apps',
            content: templates.render('app_list.html', req, {
                rows: rows
            })
        };
    };
};


exports.app_details = function (head, req) {
    start({code: 200, headers: {'Content-Type': 'text/html'}});

    if (req.client && utils.initial_hit) {
        // dont' bother with the second render, nothing new to show
    }
    else {
        var row, rows = [];
        while (row = getRow()) {
            rows.push(row);
        }

        if (!rows.length) {
            return shows.not_found(null, req);
        }
        var id = rows[0].id;
        var meta = rows[0].value;
        var ldesc = meta.config.long_description;
        var title = utils.app_title(meta.config);

        events.once('afterResponse', function (info, req, res) {
            ui.loadScreenshots(id, meta, req);
        });

        return {
            title: 'App: ' + title,
            content: templates.render('app_details.html', req, {
                meta: meta,
                id: id,
                title: title,
                long_description_paragraphs: ldesc.split('\n\n'),
                icon_96: meta.config.icons['96'],
                updated: datelib.prettify(meta.push_time),
                install_script_url: utils.install_script_url(req, id)
            })
        };
    }
};
