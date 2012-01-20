exports.apps = {
    map: function (doc) {
        if (!/^_design\//.test(doc._id) && doc.kanso) {
            var cfg = doc.kanso.config;
            emit([doc._id], {
                name: cfg.name,
                version: cfg.version,
                description: cfg.description,
                promo_images: cfg.promo_images || {},
                icons: cfg.icons || {},
            });
        }
    }
};
