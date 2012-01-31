var events = require('duality/events'),
    popup = require('./popup'),
    ui = require('./ui');

// syntax highlighting of code blocks
events.on('afterResponse', ui.syntaxHighlight);

// close all popups when navigating away from page
events.on('beforeResource', popup.closeAll);
