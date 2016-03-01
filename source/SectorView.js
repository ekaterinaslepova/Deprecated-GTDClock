/**
 * Created by nebel on 04.12.2015.
 */

function SectorView(context, bckg_context, radius, model) {
    this.context = context;
    this.bckg_context = bckg_context;
    this.radius = radius;
    this.model = model;
}

SectorView.prototype.redraw = function() {
    this.context.clearRect(-this.context.canvas.width/2, -this.context.canvas.height/2, this.context.canvas.width, this.context.canvas.height);
    this.draw();
};

SectorView.prototype.draw = function() {
    this._drawActiveSector();
    this._drawActivities();
    this._drawSeparators(this.context);

    this._drawSectors();
    this._drawSeparators(this.bckg_context, true);

    this._drawCircle();
};

SectorView.prototype._drawSeparators = function(context, is_bckg_context) {
    var i, separator;
    for (i = 0; i < this.model.separators.length; ++i) {
        separator = this.model.separators[i];

        if (is_bckg_context) {
            context.strokeStyle = separator["id"];
        }

        context.beginPath();

        context.moveTo(0, 0);
        context.rotate(separator["rotate"]);
        context.lineTo(0, -this.radius);
        context.moveTo(0, 0);
        context.rotate(-separator["rotate"]);

        context.stroke();
    }
};

SectorView.prototype._drawSectors = function() {
    var i, sector, start, end;
    for (i = 0; i < this.model.sectors.length; ++i) {
        sector = this.model.sectors[i];
        start = sector['separator1']['rotate'];
        end = sector['separator2']['rotate'];
        if (end === 0) {
            end = 2*Math.PI;
        }

        this.bckg_context.beginPath();
        this.bckg_context.fillStyle = sector['id'];
        this.bckg_context.moveTo(0, 0);
        this.bckg_context.arc(0, 0, 200, start-0.5*Math.PI, end-0.5*Math.PI);
        this.bckg_context.fill();
    }
};

SectorView.prototype._drawActiveSector = function() {
    var activeSector = this.model.getActiveSector(), start, end;
    if (activeSector === null) {
        return;
    }

    start = activeSector['separator1']['rotate'];
    end = activeSector['separator2']['rotate'];
    if (end === 0) {
        end = 2*Math.PI;
    }

    this.context.beginPath();
    this.context.fillStyle = "#FFB6C1";
    this.context.moveTo(0, 0);
    this.context.arc(0, 0, 200, start-0.5*Math.PI, end-0.5*Math.PI);
    this.context.fill();
};

SectorView.prototype._drawActivities = function() {
    var i, sector;
    for (i = 0; i < this.model.sectors.length; ++i) {
        sector = this.model.sectors[i];
        if (typeof sector.activity == 'object') {
            sector.activity.draw(this.context, 200);
        }
    }
};

SectorView.prototype._drawCircle = function() {
    this.context.beginPath();
    this.context.arc(0, 0, 200, 200, 0, 2 * Math.PI, false);
    this.context.stroke();
};

SectorView.prototype.getBgColor = function(x, y) {
    return this.bckg_context.getImageData(x, y, 1, 1).data;
};
