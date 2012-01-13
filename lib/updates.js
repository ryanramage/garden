var validate = require('./validate'),
    datelib = require('datelib');


exports.upload = function (oldDoc, req) {
    var newDoc = JSON.parse(req.body);
    newDoc._id = req.query.name || newDoc._id;

    // This is the whole point for the update handler existing
    newDoc.kanso._uploaded_by = req.userCtx.name;
    newDoc.kanso._upload_time = datelib.ISODateString();

    // Check for conflicts (there's still a race condition here
    // between the update function and the actual save but there's no
    // way around that)
    if (oldDoc && newDoc._rev !== oldDoc._rev) {
        return [null, {
            code: 409,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                error: 'conflict',
                reason: 'Document update conflict.'
            })
        }];
    }

    // Run validate_doc_update on the new document manually to try and
    // catch errors before returning from the update handler.
    // This will not catch validation errors thrown by other design docs
    // so it not a guarantee that the doc will save, again no way around that.
    try {
        validate(newDoc, oldDoc, req.userCtx);
    }
    catch (e) {
        if (e.forbidden) {
            return [null, {
                code: 403,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    error: 'forbidden',
                    reason: e.forbidden
                })
            }];
        }
        else if (e.unauthorized) {
            return [null, {
                code: 401,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    error: 'unauthorized',
                    reason: e.unauthorized
                })
            }];
        }
        else {
            return [null, {
                code: 500,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    error: 'error',
                    reason: e.message || e.toString()
                })
            }];
        }
    }

    // Assume the save will be successful at this point
    return [newDoc, {
        code: 201,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ok: true,
            id: newDoc._id
            //rev: unknown - yay update handlers!
        })
    }];
};
