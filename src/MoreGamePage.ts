/**
 * Create by hardy on 17/3/30
 * 更多游戏界面
 */

class MoreGamePage extends Othercontainer {
    public constructor() {
        super();
    }

    private othergamebtn: GameUtil.Menu[];
    private curpage: number;
    private totalpage: number;
    protected show() {
        this.othergamebtn = [];
        this.curpage = 0;
        this.totalpage = GameConfig.MoreGameName.length + 1;
        console.log('totalpage====', this.totalpage);

        var moregamebg: MyBitmap = new MyBitmap(RES.getRes('moregamebg_png'), this.mStageW / 2, this.mStageH / 2);
        this.addChild(moregamebg);

        for (var i: number = 0; i < 3; i++) {
            var btname: string = GameConfig.MoreGameName[i] + '_png';
            this.othergamebtn[i] = new GameUtil.Menu(this, btname, btname, this.opengame, [i]);
            this.addChild(this.othergamebtn[i]);
            GameUtil.relativepos(this.othergamebtn[i], moregamebg, 127 + 157 * i, 171);
        }

        var changebtn: GameUtil.Menu = new GameUtil.Menu(this, 'changebtn_png', 'changebtn_png', this.change,[moregamebg]);
        changebtn.setScaleMode();
        this.addChild(changebtn);
        GameUtil.relativepos(changebtn, moregamebg, 438, 292);

        var close: GameUtil.Menu = new GameUtil.Menu(this, 'closebtn_png', 'closebtn_png', this.close);
        this.addChild(close);
        GameUtil.relativepos(close, moregamebg, 544, 23);
    }

    private change(moregamebg:any) {
        console.log('change');
        if (this.getChildByName('waitimg') != null) {
            console.log('getChildByName-=======', this.getChildByName('waitimg'));
            this.removeChild(this.getChildByName('waitimg'));
        }
        this.curpage++;
        if (this.curpage > this.totalpage/3) {
            this.curpage = 0;
        }
        console.log('curpage====', this.curpage);
        for (var i: number = 0; i < 3; i++){
            if (i+1 + this.curpage * 3 == this.totalpage) {
                var waitimg: MyBitmap = new MyBitmap(RES.getRes('waitimg_png'));
                waitimg.name = 'waitimg';
                this.addChild(waitimg);
                GameUtil.relativepos(waitimg, moregamebg, 127 + 157 * i, 171);
                //break;
            }
            console.log('i====', i+this.curpage * 3);

            var btname: string = GameConfig.MoreGameName[i+this.curpage*3] + '_png';
            this.othergamebtn[i].setButtonTexture(btname, btname);
        }
    }

    private opengame(target: number) {
        console.log('target====', target + this.curpage * 3);
        window.location.href = 'http://' + GameConfig.MoreGameName[target + this.curpage * 3] + '.h5.gamexun.com/';
    }
}
