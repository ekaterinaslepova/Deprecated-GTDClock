/**
 * Created by nebel on 07.01.2016.
 */

function Renderer(view, clock) {
    this.view = view;
    this.clock = clock;
    this._start();
}

Renderer.prototype._start = function() {
    var that = this;
    setTimeout(function() {
        that._render();
        setTimeout(arguments.callee, 100);
    }, 100);
};

Renderer.prototype._render = function() {
    this.view.redraw();
    this.clock.draw();
};