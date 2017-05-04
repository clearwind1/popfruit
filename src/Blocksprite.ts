/**
 * Created by pior on 16/9/1.
 */
class Blocksprite extends MyBitmap {

    private dicbw: number;

    public blockid: number;
    public posx: number;
    public posy: number;

    public constructor(blockid: number, posx: number, posy: number) {
        var texname = 'fruit_' + blockid + '_png';
        super(RES.getRes(texname), GameConfig.getSW() / 2 - 334 + posx * GameConfig.DICBW, GameConfig.getSH() / 2 - 252 + posy * GameConfig.DICBH);
        this.blockid = blockid;
        this.posx = posx;
        this.posy = posy;
    }

    public select(b: boolean) {
        var texname = 'fruit_' + this.blockid + '_png';
        if (b) {
            texname = 'fruit_' + this.blockid + '_s_png';
            this.setscale(1.2);
            egret.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 300);
        }
        this.setNewTexture(RES.getRes(texname));
    }

    public setscale(sc) {
        this.$setScaleX(sc);
        this.$setScaleY(sc);
    }

}