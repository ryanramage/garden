module.exports = function (newDoc, oldDoc, userCtx) {

    // TODO: check for other doc types here like comments etc
    if (!newDoc.kanso) {
        throw {
            forbidden: 'Document is missing "kanso" property\n' +
                       'Adding apps requires at least kanso 0.1.2'
        };
    }

    if (newDoc.kanso) {
        if (!userCtx.name) {
            throw {unauthorized: 'You must be logged in to upload an app'};
        }
        if (!newDoc.kanso._uploaded_by) {
            throw {forbidden: 'Missing kanso._uploaded_by property'};
        }
        if (!newDoc.kanso._upload_time) {
            throw {forbidden: 'Missing kanso._upload_time property'};
        }
        if (!newDoc.kanso._build_time) {
            throw {forbidden: 'Missing kanso._build_time property'};
        }
        if (!newDoc.kanso.name) {
            throw {forbidden: 'Missing kanso.name property'};
        }
        if (!newDoc.kanso.description) {
            throw {forbidden: 'Missing kanso.description property'};
        }
        if (!newDoc.kanso.version) {
            throw {forbidden: 'Missing kanso.version property'};
        }

        // updating
        if (oldDoc && !newDoc._deleted) {
            if (newDoc.kanso._uploaded_by !== oldDoc.kanso._uploaded_by) {
                throw {
                    unauthorized: 'Only the uploader can update an existing app'
                };
            }
        }
        // deleting
        if (oldDoc && newDoc._deleted) {
            if (newDoc.kanso._uploaded_by !== oldDoc.kanso._uploaded_by) {
                throw {
                    unauthorized: 'Only the uploader can delete an existing app'
                };
            }
        }
    }

};
