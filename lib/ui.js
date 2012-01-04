var duality = require('duality/core'),
    sanitize = require('sanitize'),
    showdown = require('./showdown-wiki'),
    path = require('path');


exports.fetchREADME = function (doc, att) {
    var pre = $('<pre class="data"></pre>');
    if (att) {
        var dbURL = duality.getDBURL();
        $.get(dbURL + '/' + encodeURIComponent(doc._id) + '/' + att,
            function (data) {
                var ext = path.extname(att);
                if (ext === '.md' || ext === '.markdown') {
                    var html = showdown.convert(data);
                    $('#readme').append('<div class="data">' + html + '</div>');
                    exports.syntaxHighlight();
                }
                else {
                    $('#readme').append(pre.text(data));
                }
            }
        );
    }
    else {
        $('#readme').append(
            pre.text('This package has no README')
        );
    }
};


/**
 * Add syntax highlighting to the page using highlight.js (hljs)
 */

exports.syntaxHighlight = function () {
    $('pre > code').each(function () {
        if (this.className) {
            // has a code class
            $(this).html(hljs.highlight(this.className, $(this).text()).value);
        }
    });
};
