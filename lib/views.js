exports.apps = {
    map: function (doc) {
        if (!/^_design\//.test(doc._id) && doc.kanso) {
            emit([doc._id], doc.kanso);
        }
    }
};
