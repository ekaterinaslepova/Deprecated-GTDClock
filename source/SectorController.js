/**
 * Created by nebel on 06.12.2015.
 */

function SectorController(model, view) {
    this.model = model;
    this.view = view;
    this.activatedId = 0;
    this.activatedX = 0;
    this.activatedY = 0;
    this.movableIdSet = [];
    this.selectableIdSet = [];
    this.model.init(this._generateId(true));
}

SectorController.prototype.addSector = function() {
    if (this.model.isEmpty()) {
        this.model.addFirst(this._generateId(), this._generateId(), this._generateId(true));
    }
    else {
        this.model.add(this._generateId(), this._generateId(true));
    }
};

SectorController.prototype.moveSector = function(x, y) {
    var delta = this._calculateAngleDelta(x, y),
        clockwise = this._isClockwise(x, y);
    if (clockwise === false) {
        delta = -delta;
    }
    this.activatedX = x;
    this.activatedY = y;

    this.model.move(this.activatedId, 7*delta);
};

SectorController.prototype.removeSector = function() {
    this.model.removeActiveSector();
};

SectorController.prototype.selectSector = function(x, y) {
    var sectorId = this._transformToId(this.view.getBgColor(x, y)),
        sector = this.model.getSector(sectorId),
        activeSector = this.model.getActiveSector();
    if (sector !== undefined) {
        if (sector === activeSector) {
            return;
        }
        else {
            this.model.setActiveSector(sector);
        }
    }
};

SectorController.prototype.activateMove = function(x, y) {
    var color = this.view.getBgColor(x, y);
    this.activatedId = this._transformToId(color);
    this.activatedX = x;
    this.activatedY = y;
};

SectorController.prototype.deactivateMove = function() {
    this.activatedId = 0;
    this.activatedX = 0;
    this.activatedY = 0;
};

SectorController.prototype.isMovable = function(pixel) {
    var id = this._transformToId(pixel);
    return this.movableIdSet.indexOf(id) !== -1;
};

SectorController.prototype.isSelectable = function(pixel) {
    var id = this._transformToId(pixel);
    return this.selectableIdSet.indexOf(id) !== -1;
};

SectorController.prototype.addActivity = function() {
    var activity = new Activity('image/flower.jpg', this.model.getActiveSector());
    this.model.addActivity(activity);
};

SectorController.prototype._calculateAngleDelta = function(x, y) {
    return Math.acos((x*this.activatedX + y*this.activatedY)/(Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2))*Math.sqrt(Math.pow(this.activatedX, 2)+Math.pow(this.activatedY, 2))));
};

SectorController.prototype._isClockwise = function(x, y) {
    var delta_y = y - this.activatedY,
        delta_x = x - this.activatedX,
        angle = this.model.angle(this.activatedId);

    if (delta_y >= 0) {
        if (delta_x >= 0 && (angle < Math.PI/2 || angle === 0 || angle === 2*Math.PI) || delta_x <= 0 && angle >= Math.PI/2 && angle < Math.PI) {
            return true;
        }
    }
    if (delta_y <= 0) {
        if (delta_x >= 0 && angle>= 1.5*Math.PI || delta_x <= 0 && angle >= Math.PI && angle < 1.5*Math.PI) {
            return true;
        }
    }

    return false;
};

SectorController.prototype._generateId = function(selectableId) {
    var id, num1, num2, num3, set = selectableId ? this.selectableIdSet : this.movableIdSet;
    do {
        num1 = String(Math.floor(Math.random()*255));
        num2 = String(Math.floor(Math.random()*255));
        num3 = String(Math.floor(Math.random()*255));
        while (num1.length < 3) {
            num1 = "0" + num1;
        }
        while (num2.length < 3) {
            num2 = "0" + num2;
        }
        while (num3.length < 3) {
            num3 = "0" + num3;
        }
        id = 'rgb(' + num1 + ',' + num2 + ',' + num3 + ')';
    }
    while (set.indexOf(id) !== -1);
    set.push(id);
    return id;
};

SectorController.prototype._transformToId = function(color) {
    var num1 = String(color[0]),
        num2 = String(color[1]),
        num3 = String(color[2]);

    while (num1.length < 3) {
        num1 = "0" + num1;
    }
    while (num2.length < 3) {
        num2 = "0" + num2;
    }
    while (num3.length < 3) {
        num3 = "0" + num3;
    }

    return 'rgb(' + num1 + ',' + num2 + ',' + num3 + ')';
};
