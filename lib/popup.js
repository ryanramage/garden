var templates = require('duality/templates');


var id_counter = 0;

exports.resize = function (el, options) {
    $('.note', el).css({
        width: options.width + 'px',
        height: (options.height - 20) + 'px',
        marginLeft: (0 - options.width/2) + 'px',
        marginTop: (0 - options.height/2 + 20) + 'px'
    });
    $('.note-top', el).css({
        width: (options.width - 19) + 'px',
        marginLeft: (0 - options.width/2) + 'px',
        marginTop: (0 - options.height/2) + 'px'
    });
    $('.note-corner', el).css({
        marginLeft: (options.width/2 - 19) + 'px',
        marginTop: (0 - options.height/2 + 1) + 'px'
    });
    $('.note-corner-border', el).css({
        marginLeft: (options.width/2 - 18) + 'px',
        marginTop: (0 - options.height/2) + 'px'
    });
    $('.note-inner', el).css({
        height: (options.height - 20) + 'px'
    });
    $('.note-actions', el).css({
        width: (options.width - 20) + 'px'
    });
};

exports.open = function (req, options) {
    console.log('popup open called');
    if (!options) {
        throw new Error("missing options");
    }
    if (!options.width) {
        throw new Error("missing options.width");
    }
    if (!options.height) {
        throw new Error("missing options.height");
    }
    var el = $(templates.render('popup.html', req, {
        options: options
    }));
    el.attr('id', 'popup' + id_counter);
    id_counter++;
    $('.closebtn', el).click(function (ev) {
        ev.preventDefault();
        exports.close(el);
        return false;
    });
    exports.resize(el, options);
    $('.note-inner', el).html(options.content || '');
    $('body').append(el);
    return el;
};

exports.close = function (el) {
    el.remove();
};

exports.closeAll = function () {
    $('.note-container').remove();
};
