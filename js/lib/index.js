// Export widget models and views, and the npm package version number.
// var example = require('./example.js');
var widget = require('./widget.js');

module.exports = {
    View: widget.View,
    Model: widget.Model,
    // HelloView: example.HelloView,
    // HelloModel: example.HelloModel,
};

module.exports['version'] = require('../package.json').version;
