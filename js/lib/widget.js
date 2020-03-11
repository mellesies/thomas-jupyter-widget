var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

var Konva = require('konva');
const { v1: uuid1 } = require('uuid');

// See example.py for the kernel counterpart to this file.


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serializing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var Model = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _view_name : 'View',
        _model_name : 'Model',
        _view_module : 'thomas-jupyter-widget',
        _model_module : 'thomas-jupyter-widget',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : {},
        marginals : {},
        query : {},
    })
});


function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        console.warn('Found line of length 0');
        return false
    }

    var denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // Lines are parallel
    if (denominator === 0) {
        console.warn('Denominator is zero 0');
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        // console.debug('Intersection outside segments');
        return false
    }

    // Return an object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return {x, y}
}

function compute_intersection(corners, line) {
    const points = [
        ['tl', 'tr'],
        ['tl', 'bl'],
        ['tr', 'br'],
        ['bl', 'br'],
    ];

    var intersection = false;

    for (const p of points) {
        const key1 = p[0], key2 = p[1];

        intersection = intersect(
            corners[key1].x,
            corners[key1].y,
            corners[key2].x,
            corners[key2].y,
            line.src.x,
            line.src.y,
            line.dst.x,
            line.dst.y,
        );

        if (intersection) {
            break;
        }
    }

    if (!intersection) {
        console.warn('Could not determine intersection');
    }

    return intersection;
}

// Custom View. Renders the widget model.
var View = widgets.DOMWidgetView.extend({

    // Defines how the widget gets rendered into the DOM
    render: function() {
        this.container_id = `konva-container-${uuid1()}`
        this.node_title_height = 15;
        this.node_state_offset = 8;
        this.node_state_height = 14;
        this.node_state_padding = 2;

        this.node_width = 180;
        this.nodes = [];
        this.edges = [];

        this.el.innerHTML = `
            <div
                id="${this.container_id}"
                style="background-color: #336699"
                >
            </div>
        `;

        // Run this *after* the above <div> has rendered.
        setTimeout(() => {
            console.log('Setting up Konva ...');
            this.stage = new Konva.Stage({
              container: this.container_id,
              width: 2048,
              height: 300
            });

            // Create a Layer to hold all shapes
            this.layer = new Konva.Layer();

            this.model.on('change:value', this.value_changed, this);
            this.value_changed();
        }, 0)
    },

    value_changed: function() {
        console.log('value_changed()');
        var value = this.model.get('value');
        var marginals = this.model.get('marginals');
        console.log('marginals:', marginals);
        // var trigger = this.model.get('trigger');
        // this.model.set('trigger', 'flubberdubberdub');
        // this.touch();

        if (value.type !== 'BayesianNetwork') {
            return
        }

        // Clear the layer
        this.layer.removeChildren();

        // Create nodes
        var nodes = value.nodes.map(node =>
            this.create_node(node, marginals[node.name])
        );

        // Create edges
        var edges = value.edges.map(edge =>
            this.create_edge(edge)
        );

        edges.forEach(i => this.layer.add(i));
        nodes.forEach(i => this.layer.add(i));

        // FIXME: does adding a layer that was already added make a difference?
        this.stage.add(this.layer);
        this.layer.draw();
    },

    compute_node_height: function(node) {
        return (
            node.states.length * this.node_state_height
            + 2 * this.node_state_offset
            + this.node_title_height
        )
    },

    create_node: function(node, marginals) {
        const width = this.node_width;
        const height = this.compute_node_height(node)

        var group = new Konva.Group({
            x: node.position[0],
            y: node.position[1],
            width: width,
            height: height,
            draggable: true,
        });

        // Store a reference ...
        this.nodes[node.name] = group;

        // Add drag/drop events to the group
        group.on('dragstart', (e) => {
            // console.log('dragstart', e);
        });

        group.on('dragend', (e) => {
          // console.log('dragend', e);
          node.position = [e.target.x(), e.target.y()];

          var value = this.model.get('value');

          // For some reason the change to 'values' is not picked up until
          // its value is set to something completely different. Spreading the
          // object into a new one didn't help :-(
          this.model.set('value', 'null');
          this.model.set('value', {...value});
          this.touch();
        });

        // Show some background
        var rect = new Konva.Rect({
            fill: '#efefef',
            // stroke: 'black',
            // strokeWidth: 0,
            width: width,
            height: height,
            cornerRadius: 5,
            shadowBlur: 5,
        });

        group.add(rect);


        // Node's RV in the top-left
        var label = new Konva.Label();
        label.add(
            new Konva.Text({
                text: node.name,
                padding: 4,
                fontSize: this.node_title_height,
                fontStyle: "bold",
                width: width,
            })
        );

        group.add(label);

        // Create states
        const
            label_width = 70,
            probability_width = 55;

        // For each state ...
        node.states.map((state, idx) => {
            const y = (
                this.node_title_height
                + this.node_state_offset
                + idx * this.node_state_height
            )

            const remaining_width = width - label_width - probability_width;

            var probability = '...';
            var bar_width = 0;
            var bar_color = '#003366';

            if (marginals) {
                probability = (100 * marginals[state]).toFixed(2) + '%';
                bar_width = 1 + remaining_width * marginals[state]
            }

            /*
            Create a group to hold all state related shapes:
               - state label
               - bar
               - marginal
            */
            var state_group = new Konva.Group({
                y: y,
            });

            // State label
            state_group.add(
                new Konva.Label().add(
                    new Konva.Text({
                        text: state,
                        padding: this.node_state_padding,
                        fontSize: this.node_state_height - this.node_state_padding,
                        wrap: 'none',
                        ellipsis: 'ellipsis',
                        width: width,
                    })
                )
            );

            // State bar
            state_group.add(
                new Konva.Rect({
                    x: label_width,
                    y: 1,
                    width: bar_width,
                    height: this.node_state_height - 2,
                    fill: bar_color,
                })
            );

            // State marginal
            state_group.add(
                new Konva.Label({
                    x: width - probability_width
                }).add(
                    new Konva.Text({
                        text: probability,
                        padding: this.node_state_padding,
                        fontSize: this.node_state_height - this.node_state_padding,
                        align: "right",
                        wrap: "none",
                        width: probability_width,
                    })
                )
            );

            group.add(state_group);
        });

        // this.layer.add(group);
        return group;
    },

    compute_position: function(node) {
        const center = {
            x: node.x() + node.width()/2,
            y: node.y() + node.height()/2
        }

        const corners = {
            'tl': {x: node.x(), y: node.y()},
            'tr': {x: node.x() + node.width(), y: node.y()},
            'bl': {x: node.x(), y: node.y() + node.height()},
            'br': {x: node.x() + node.width(), y: node.y() + node.height()},
        }

        return { center, corners }
    },

    create_edge: function(edge) {
        const
            src_node = this.nodes[edge[0]],
            dst_node = this.nodes[edge[1]];

        const
            src = this.compute_position(src_node),
            dst = this.compute_position(dst_node);

        // console.log('  - src: ', src);
        // console.log('  - dst: ', dst);

        const src_i = compute_intersection(
            src['corners'],
            {src: src['center'], dst: dst['center']}
        );

        const dst_i = compute_intersection(
            dst['corners'],
            {src: src['center'], dst: dst['center']}
        );

        const arrow = new Konva.Arrow({
            x: 0,
            y: 0,
            points: [src_i.x, src_i.y, dst_i.x, dst_i.y],
            pointerLength: 10,
            pointerWidth: 10,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 2,
        });

        // this.layer.add(arrow);
        return arrow;
    }
});


module.exports = {
    Model: Model,
    View: View
};
