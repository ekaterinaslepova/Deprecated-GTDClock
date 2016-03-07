/**
 * Created by nebel on 31.12.2015.
 */


function Clock(ctx, raidus) {
    this.ctx = ctx;
    this.radius = raidus;
}

Clock.prototype.draw = function() {
    this._drawNumbers();
    this._drawHands();
};

Clock.prototype._drawNumbers = function() {
    var start = 0.95*this.radius,
        end = 1.05*this.radius,
        textStart = 1.15*this.radius,
        ang, i;

    this.ctx.font = 0.2*this.radius + "px Arial";
    this.ctx.textBaseline="middle";
    this.ctx.textAlign="center";
    this.ctx.rotate(-Math.PI/2);
    for (i = 1; i < 13; ++i) {
        ang = i*Math.PI/6;
        this.ctx.rotate(ang);

        this.ctx.beginPath();
        this.ctx.moveTo(start, 0);
        this.ctx.lineTo(end, 0);
        this.ctx.stroke();

        this.ctx.translate(textStart, 0);
        this.ctx.rotate(Math.PI/2-ang);
        this.ctx.strokeText(i, 0, 0);
        this.ctx.rotate(-Math.PI/2+ang);
        this.ctx.translate(-textStart, 0);

        this.ctx.rotate(-ang);
    }
    this.ctx.rotate(Math.PI/2);
};

Clock.prototype._drawHands = function() {
    var now = new  Date(),
        second = now.getSeconds(),
        minute = now.getMinutes(),
        hour = now.getHours();

    hour=(hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    second = second*Math.PI/30;

    this._drawHand(second, this.radius*0.9, this.radius*0.02);
    this._drawHand(minute, this.radius*0.8, this.radius*0.05);
    this._drawHand(hour, this.radius*0.5, this.radius*0.07);
};

Clock.prototype._drawHand = function(pos, length, width) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rotate(-Math.PI/2);
    this.ctx.lineWidth = width;
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = "#000";
    this.ctx.rotate(pos);
    this.ctx.moveTo(0,0);
    this.ctx.lineTo(length, 0);
    this.ctx.stroke();
    this.ctx.restore();
};