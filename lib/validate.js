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
        if (!newDoc.kanso.pushed_by) {
            throw {forbidden: 'Missing kanso.pushed_by property'};
        }
        if (!newDoc.kanso.push_time) {
            throw {forbidden: 'Missing kanso.push_dtime property'};
        }
        if (!newDoc.kanso.build_time) {
            throw {forbidden: 'Missing kanso.build_time property'};
        }
        if (!newDoc.kanso.config) {
            throw {forbidden: 'Missing kanso.config property'};
        }
        if (!newDoc.kanso.config.name) {
            throw {forbidden: 'Missing kanso.config.name property'};
        }
        if (!newDoc.kanso.config.description) {
            throw {forbidden: 'Missing kanso.config.description property'};
        }
        if (!newDoc.kanso.config.version) {
            throw {forbidden: 'Missing kanso.config.version property'};
        }

        // updating
        if (oldDoc && !newDoc._deleted) {
            if (newDoc.kanso.pushed_by !== oldDoc.kanso.pushed_by) {
                throw {
                    unauthorized: 'Only the uploader can update an existing app'
                };
            }
        }
        // deleting
        if (oldDoc && newDoc._deleted) {
            if (newDoc.kanso.pushed_by !== oldDoc.kanso.pushed_by) {
                throw {
                    unauthorized: 'Only the uploader can delete an existing app'
                };
            }
        }
    }

};
