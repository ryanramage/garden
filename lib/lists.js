var templates = require('duality/templates'),
    utils = require('./utils'),
    shows = require('./shows'),
    ui = require('./ui'),
    events = require('duality/events'),
    jsonp = require('jsonp'),
    datelib = require('datelib');


exports.home = function (head, req) {
    start({code: 200, headers: {'Content-Type': 'text/html'}});

    events.once('afterResponse', function (info, req, res) {
        ui.addCategories(req, '#categories');
    });

    if (req.client && req.initial_hit) {
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
            title: 'Kanso Garden',
            content: templates.render('home.html', req, {
                rows: rows
            })
        };
    };
};

exports.category_page = function (head, req) {
    start({code: 200, headers: {'Content-Type': 'text/html'}});

    events.once('afterResponse', function (info, req, res) {
        ui.addCategories(req, '#categories');
    });

    if (req.client && req.initial_hit) {
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
            title: req.query.category,
            content: templates.render('category_page.html', req, {
                rows: rows,
                title: utils.toSentenceCase(req.query.category),
                category: req.query.category
            })
        };
    };
};


exports.app_details = function (head, req) {
    start({code: 200, headers: {'Content-Type': 'text/html'}});

    var row, rows = [];
    while (row = getRow()) {
        rows.push(row);
    }

    var id = rows[0].id;
    var meta = rows[0].value;

    events.once('afterResponse', function (info, req, res) {
        ui.loadScreenshots(id, meta, req);
        $('.install_btn').click(function (ev) {
            ev.preventDefault();
            ui.showInstallPopup(req, id);
            return false;
        });
    });

    if (req.client && req.initial_hit) {
        // dont' bother with the second render, nothing new to show
    }
    else {
        if (!rows.length) {
            return shows.not_found(null, req);
        }
        var ldesc = meta.config.long_description;
        var title = utils.app_title(meta.config);

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

exports.user_page = function (head, req) {
    start({code: 200, headers: {'Content-Type': 'text/html'}});

    events.once('afterResponse', function (info, req, res) {
        ui.addCategories(req, '#categories');
    });

    if (req.client && req.initial_hit) {
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
            title: req.query.user,
            content: templates.render('user_page.html', req, {
                rows: rows,
                title: utils.toSentenceCase(req.query.user),
                user: req.query.user
            })
        };
    };
};

exports.app_versions = function(head, req) {
    var row = [];
    var result = {};
    while (row = getRow()) {
        var version;
        if (row.value.config && row.value.config.version) {
            result[row.id] = row.value.config.version;
        }
        else if (row.value.version) {
            result[row.id] = row.value.version;
        }
    }
    return jsonp.response(req.query.callback, result);
}
