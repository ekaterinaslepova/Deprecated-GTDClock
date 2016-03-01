/**
 * Created by nebel on 04.01.2016.
 */

function Activity(src, sector) {
    this.image = new Image();
    this.image.src = src;
    this.sector = sector;
}

Activity.prototype.draw = function(ctx, radius) {
    var offset, A, rotate, minAngle,
        halfSectorAngle = this._halfSectorAngle(),
        imageSize = this.image.naturalHeight;

    imageSize = this._calculateSize(imageSize, imageSize/2, function(size) {
        var A = 0.8*radius - size,
            angle = Math.atan((size/2)/A);

        return A > 0 && angle <= halfSectorAngle;
    });
    A = 0.8*radius - imageSize;

    minAngle = Math.atan((imageSize/2)/A);
    rotate = this._rotate(halfSectorAngle, minAngle);
    offset = Math.sqrt(Math.pow(A,2) + Math.pow(imageSize/2,2));

    ctx.rotate(-Math.PI+rotate);
    ctx.translate(0, offset);
    ctx.rotate(-minAngle);
    ctx.drawImage(this.image, 0, 0, imageSize, imageSize);
    ctx.rotate(minAngle);
    ctx.translate(0, -offset);
    ctx.rotate(Math.PI-rotate);
};

Activity.prototype._calculateSize = function(size, delta, fn) {
    if (delta < 1) {
        return size;
    }

    if (!fn(size)) {
        size = this._calculateSize(size - delta, Math.floor(delta/2), fn);
    }
    else {
        var res;
        res = this._calculateSize(size + delta, Math.floor(delta/2), fn);
        if (fn(res)) {
            size = res;
        }
    }

    return size;
};

Activity.prototype._halfSectorAngle = function() {
    var sectorStart = this.sector.separator1.rotate,
        sectorEnd = this.sector.separator2.rotate,
        sectorAngle;

    if (sectorEnd === 0) {
        sectorEnd = 2*Math.PI;
    }
    if (sectorEnd < sectorStart) {
        sectorAngle = 2*Math.PI - (sectorStart - sectorEnd);
    }
    else {
        sectorAngle = sectorEnd - sectorStart;
    }

    return sectorAngle/2;
};

Activity.prototype._rotate = function(halfSectorAngle, minAngle) {
    var rotate = this.sector.separator1.rotate + halfSectorAngle + minAngle;
    if (rotate > 2*Math.PI) {
        rotate -= 2*Math.PI;
    }
    return rotate;
};