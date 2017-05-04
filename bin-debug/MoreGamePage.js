/**
 * Create by hardy on 17/3/30
 * 更多游戏界面
 */
var MoreGamePage = (function (_super) {
    __extends(MoreGamePage, _super);
    function MoreGamePage() {
        _super.call(this);
    }
    var d = __define,c=MoreGamePage,p=c.prototype;
    p.show = function () {
        this.othergamebtn = [];
        this.curpage = 0;
        this.totalpage = GameConfig.MoreGameName.length + 1;
        console.log('totalpage====', this.totalpage);
        var moregamebg = new MyBitmap(RES.getRes('moregamebg_png'), this.mStageW / 2, this.mStageH / 2);
        this.addChild(moregamebg);
        for (var i = 0; i < 3; i++) {
            var btname = GameConfig.MoreGameName[i] + '_png';
            this.othergamebtn[i] = new GameUtil.Menu(this, btname, btname, this.opengame, [i]);
            this.addChild(this.othergamebtn[i]);
            GameUtil.relativepos(this.othergamebtn[i], moregamebg, 127 + 157 * i, 171);
        }
        var changebtn = new GameUtil.Menu(this, 'changebtn_png', 'changebtn_png', this.change, [moregamebg]);
        changebtn.setScaleMode();
        this.addChild(changebtn);
        GameUtil.relativepos(changebtn, moregamebg, 438, 292);
        var close = new GameUtil.Menu(this, 'closebtn_png', 'closebtn_png', this.close);
        this.addChild(close);
        GameUtil.relativepos(close, moregamebg, 544, 23);
    };
    p.change = function (moregamebg) {
        console.log('change');
        if (this.getChildByName('waitimg') != null) {
            console.log('getChildByName-=======', this.getChildByName('waitimg'));
            this.removeChild(this.getChildByName('waitimg'));
        }
        this.curpage++;
        if (this.curpage > this.totalpage / 3) {
            this.curpage = 0;
        }
        console.log('curpage====', this.curpage);
        for (var i = 0; i < 3; i++) {
            if (i + 1 + this.curpage * 3 == this.totalpage) {
                var waitimg = new MyBitmap(RES.getRes('waitimg_png'));
                waitimg.name = 'waitimg';
                this.addChild(waitimg);
                GameUtil.relativepos(waitimg, moregamebg, 127 + 157 * i, 171);
            }
            console.log('i====', i + this.curpage * 3);
            var btname = GameConfig.MoreGameName[i + this.curpage * 3] + '_png';
            this.othergamebtn[i].setButtonTexture(btname, btname);
        }
    };
    p.opengame = function (target) {
        console.log('target====', target + this.curpage * 3);
        window.location.href = 'http://' + GameConfig.MoreGameName[target + this.curpage * 3] + '.h5.gamexun.com/';
    };
    return MoreGamePage;
}(Othercontainer));
egret.registerClass(MoreGamePage,'MoreGamePage');
//# sourceMappingURL=MoreGamePage.js.map