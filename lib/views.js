exports.apps = {
    map: function (doc) {
        if (!/^_design\//.test(doc._id)) {
            emit([doc._id], null);
        }
    }
};
