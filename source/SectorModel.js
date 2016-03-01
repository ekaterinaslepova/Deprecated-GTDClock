/**
 * Created by nebel on 04.12.2015.
 */


function SectorModel() {
    this.separators = [];
    this.sectors = [];
    this.activeSector = null;
    this.minRotate = 15*Math.PI/180;
}

SectorModel.prototype.init = function(id) {
    var sector = {id: id, separator1:{id : 0, rotate : 0}, separator2: {id : 0, rotate : 0}};
    this.sectors.push(sector);
    this.activeSector = sector;
};

SectorModel.prototype.addFirst = function (separatorId1, separatorId2, sectorId) {
    var separator1 = {id : separatorId1, rotate : 0},
        separator2 = {id : separatorId2, rotate : Math.PI},
        activeSectorId = this.activeSector.id,
        newActive;

    this.separators.push(separator1);
    this.separators.push(separator2);

    this._removeSector(activeSectorId);
    this._addSector({id: sectorId, separator1: separator1, separator2: separator2});
    newActive = this._addSector({id: activeSectorId, separator1: separator2, separator2: separator1});
    this.setActiveSector(newActive);
};

SectorModel.prototype.add = function(separatorId, sectorId) {
    var activeSectorId    = this.activeSector.id,
        activeSectorBegin = this.activeSector["separator1"],
        activeSectorEnd   = this.activeSector["separator2"],
        activeSectorSize  = this._activeSectorSize(),
        newSeparator, newSeparatorIndex, newActive;

    if (activeSectorSize <= this.minRotate) {
        return null;
    }
    else {
        newSeparator = {id: separatorId, rotate: this._activeSectorMedian(activeSectorSize)};
        newSeparatorIndex = this._getSeparatorIndex(activeSectorEnd.id);
        this.separators.splice(newSeparatorIndex, 0, newSeparator);

        this._removeSector(activeSectorId);
        this._addSector({id: activeSectorId, separator1: activeSectorBegin, separator2: newSeparator});
        newActive = this._addSector({id: sectorId, separator1: newSeparator, separator2: activeSectorEnd});
        this.setActiveSector(newActive);
    }
};

SectorModel.prototype._activeSectorSize = function() {
    var activeSectorBeginAngle = this.activeSector.separator1.rotate,
        activeSectorEndAngle = this.activeSector.separator2.rotate,
        activeSectorSize = 0;

    if (activeSectorEndAngle === 0) {
        activeSectorEndAngle = 2*Math.PI;
    }
    if (activeSectorEndAngle > activeSectorBeginAngle) {
        activeSectorSize = activeSectorEndAngle - activeSectorBeginAngle;
    }
    else {
        activeSectorSize = 2*Math.PI - (activeSectorBeginAngle - activeSectorEndAngle);
    }

    return activeSectorSize;
};

SectorModel.prototype._activeSectorMedian = function(sectorSize) {
    var median = this.activeSector.separator1.rotate + sectorSize/2;
    if (median > 2*Math.PI) {
        median -= 2*Math.PI;
    }

    return median;
};

SectorModel.prototype.move = function(id, delta) {
    var currSeparator = this._getSeparator(id),
        currSeparatorIndex = this._getSeparatorIndex(id),
        nextSeparator;

    if (delta > 0) {
        nextSeparator = this.separators[(currSeparatorIndex < this.separators.length-1 ? currSeparatorIndex+1 : 0)];
    }
    else {
        nextSeparator = this.separators[(currSeparatorIndex === 0 ? this.separators.length-1 : currSeparatorIndex-1)];
    }

    if (Math.abs(currSeparator.rotate + delta - nextSeparator.rotate) > this.minRotate )
        this._move(currSeparator, delta);
};

SectorModel.prototype.getSector = function(id) {
    var i, sector;
    for (i = 0; i < this.sectors.length; ++i) {
        sector = this.sectors[i];
        if (sector.id === id) {
            return sector;
        }
    }
};

SectorModel.prototype.getActiveSector = function() {
    return this.activeSector;
};

SectorModel.prototype.setActiveSector = function(sector) {
    this.activeSector = sector;
};

SectorModel.prototype.removeActiveSector = function() {
    if (this.sectors.length <= 2) {
        var activeId = this.activeSector.id;
        this.sectors = [];
        this.separators = [];
        this.init(activeId);
    }
    else {
        var startSeparator = this.activeSector.separator1,
            endSeparator = this.activeSector.separator2,
            prevSector = this._neighborSector(startSeparator, "separator2"),
            nextSector = this._neighborSector(endSeparator, "separator1"),
            newActiveSector;

        this._removeSector(this.activeSector.id);
        this._removeSeparator(startSeparator);
        this._removeSeparator(endSeparator);
        newActiveSector = this._mergeSectors(prevSector, nextSector);
        this.setActiveSector(newActiveSector);
    }
};

SectorModel.prototype.angle = function(id) {
    var separator = this._getSeparator(id);
    if (typeof separator == 'object') {
        return separator.rotate;
    }
};

SectorModel.prototype.isEmpty = function() {
    return this.separators.length === 0;
};

SectorModel.prototype.addActivity = function(activity) {
    var activeSector = this.getActiveSector();
    activeSector.activity = activity;
};

SectorModel.prototype._addSector = function(sector) {
    this.sectors.push(sector);
    return sector;
};

SectorModel.prototype._removeSector = function(id) {
    var toDelete = this.getSector(id);
    this.sectors.splice(this.sectors.indexOf(toDelete), 1);
};

SectorModel.prototype._neighborSector = function(separator, separatorName) {
    var i, sector;
    for (i = 0; i < this.sectors.length; ++i) {
        sector = this.sectors[i];

        if (sector[separatorName] === separator) {
            return sector;
        }
    }
};

SectorModel.prototype._move = function(separator, delta) {
    separator['rotate'] += delta;
    if (separator['rotate'] > 2*Math.PI) {
        separator['rotate'] -= 2*Math.PI;
    }
    else if (separator['rotate'] < 0) {
        separator['rotate'] = 2*Math.PI + separator['rotate'];
    }
};

SectorModel.prototype._getSeparator = function(id) {
    var i = this._getSeparatorIndex(id);
    if (i != -1) {
        return this.separators[i];
    }
};

SectorModel.prototype._removeSeparator = function(separator) {
    var i = this._getSeparatorIndex(separator.id);
    if (i != -1) {
        var toDelete = this.separators[i];
        this.separators.splice(this.separators.indexOf(toDelete), 1);
    }
};

SectorModel.prototype._getSeparatorIndex = function(id) {
    var i, separator;
    for (i = 0; i < this.separators.length; ++i) {
        separator = this.separators[i];
        if (separator.id === id) {
            return i;
        }
    }
    return -1;
};

SectorModel.prototype._mergeSectors = function(sector1, sector2) {
    var newSector = {id: sector1.id, separator1: sector1.separator1, separator2: sector2.separator2};

    this._removeSector(sector1.id);
    this._removeSector(sector2.id);
    this._addSector(newSector);
    return newSector;
};