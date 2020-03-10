// Entry point for the unpkg bundle containing custom model definitions.
//
// It differs from the notebook bundle in that it does not need to define a
// dynamic baseURL for the static assets and may load some css that would
// already be loaded by the notebook otherwise.

// Export widget models and views, and the npm package version number.
// module.exports = require('./example.js');
// module.exports = require('./viewer.js');

// var example = require('./example.js');
var widget = require('./widget.js');

module.exports = {
    Model: widget.Model,
    View: widget.View,
    // HelloModel: example.HelloModel,
    // HelloView: example.HelloView,
};

module.exports['version'] = require('../package.json').version;
