exports.apps = {
    map: function (doc) {
        if (!/^_design\//.test(doc._id) && doc.kanso) {
            emit([doc._id], doc.kanso);
        }
    }
};

exports.apps_by_category = {
    map: function (doc) {
        if (!/^_design\//.test(doc._id) && doc.kanso) {
            var cfg = doc.kanso.config;
            if (cfg.categories && cfg.categories.length) {
                for (var i = 0; i < cfg.categories.length; i++) {
                    emit([cfg.categories[i]], doc.kanso);
                }
            }
            else {
                emit(['uncategorized'], doc.kanso);
            }
            emit('total', 1);
        }
    },
    reduce: function (keys, values, rereduce) {
        if (rereduce) {
            return sum(values);
        }
        return values.length;
    }
};
