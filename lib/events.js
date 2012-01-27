var events = require('duality/events'),
    ui = require('./ui');

// syntax highlighting of code blocks
events.on('afterResponse', ui.syntaxHighlight);
