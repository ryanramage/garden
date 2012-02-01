window._dashboard_urls = [];

(function () {

    var _ = require('underscore')._;

    /**
     *  Check if dashboard available on localhost at default URL
     */

    var default_url = 'http://localhost:5984' +
        '/dashboard/_design/dashboard/_rewrite/';

    $.ajax({
        url: default_url + 'info?callback=?',
        dataType: 'json',
        jsonp: true,
        success: function (data) {
            window._dashboard_urls.push(default_url);
            window._dashboard_urls = _.uniq(window._dashboard_urls);
        }
    });

})();
