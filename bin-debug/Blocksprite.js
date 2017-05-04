/**
 * Created by pior on 16/9/1.
 */
var Blocksprite = (function (_super) {
    __extends(Blocksprite, _super);
    function Blocksprite(blockid, posx, posy) {
        var texname = 'fruit_' + blockid + '_png';
        _super.call(this, RES.getRes(texname), GameConfig.getSW() / 2 - 334 + posx * GameConfig.DICBW, GameConfig.getSH() / 2 - 252 + posy * GameConfig.DICBH);
        this.blockid = blockid;
        this.posx = posx;
        this.posy = posy;
    }
    var d = __define,c=Blocksprite,p=c.prototype;
    p.select = function (b) {
        var texname = 'fruit_' + this.blockid + '_png';
        if (b) {
            texname = 'fruit_' + this.blockid + '_s_png';
            this.setscale(1.2);
            egret.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 300);
        }
        this.setNewTexture(RES.getRes(texname));
    };
    p.setscale = function (sc) {
        this.$setScaleX(sc);
        this.$setScaleY(sc);
    };
    return Blocksprite;
}(MyBitmap));
egret.registerClass(Blocksprite,'Blocksprite');
//# sourceMappingURL=Blocksprite.js.map