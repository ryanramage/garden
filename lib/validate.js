module.exports = function (newDoc, oldDoc, userCtx) {
    if (!newDoc.kanso) {
        throw({
            forbidden: 'Document is missing "kanso" property\n' +
                       'Adding apps requires at least kanso 0.1.2'
        });
    }
};
