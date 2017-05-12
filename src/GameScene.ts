/**
 * Create by hardy on 16/12/21
 * 主游戏场景
 */
class GameScene extends GameUtil.BassPanel {

    private intervalarr: number[];

    private blockdispcont: egret.DisplayObjectContainer;
    private touchlayer: egret.Shape;

    private beginpointx: number;
    private beginpointy: number;

    private recordisempy: number[];
    private blockarr: Blocksprite[];
    private selectarr: Blocksprite[];
    private tiptext: TipTextPage;
    private moveoncetag: boolean = false;

    private hightscore: number;
    private curscore: number;
    private lvimg: MyBitmap;

    private goalNumber: number;

    private bcallleft: boolean;

    public constructor() {
        super();
    }
    public init() {
        BGMPlayer._i().play(SoundName.gamebgm);
        //window['stopaudio']();
        this.initdata();
        this.showbg();
        // var posx: number = (Math.floor(Math.random() * 10)) % 4;
        // var posy: number = (Math.floor(Math.random() * 10)) % 4;
        this.createblock();

        //test        
        // this.getlastscore();
        //this.gameover();
    }
    private initdata() {
        this.bcallleft = false;
        this.goalNumber = 1000;
        this.hightscore = 0;
        this.curscore = 0;
        GameData._i().gamescore = 1000;
        GameData._i().currgamescore[0] = 0;
        GameData._i().currgamescore[1] = 1;
        GameData._i().currgamescore[2] = 0;
        this.beginpointx = 0;
        this.beginpointy = 0;
        this.recordisempy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    /**
     * 显示背景
     */
    private showbg() {

        this.intervalarr = [];

        this.blockarr = [];
        this.selectarr = [];
        for (var i: number = 0; i < GameConfig.BCOL * GameConfig.BROW; i++) {
            this.blockarr[i] = null;
        }

        var gamebg: MyBitmap = new MyBitmap(RES.getRes('gamebg_png'), 0, 0);
        gamebg.setanchorOff(0, 0);
        gamebg.width = this.mStageW;
        gamebg.height = this.mStageH;
        this.addChild(gamebg);

        this.tiptext = new TipTextPage();
        this.addChild(this.tiptext);

        var exitgamebtn: GameUtil.Menu = new GameUtil.Menu(this, 'returnbtn_png', 'returnbtn_png', this.exitgame);
        exitgamebtn.setScaleMode();
        exitgamebtn.x = 54;
        exitgamebtn.y = 53;
        this.addChild(exitgamebtn);

        var restartbtn: GameUtil.Menu = new GameUtil.Menu(this, 'restartbtn_png', 'restartbtn_png', this.restartask);
        restartbtn.setScaleMode();
        restartbtn.x = this.mStageW - 54;
        restartbtn.y = 53;
        this.addChild(restartbtn);

        this.blockdispcont = new egret.DisplayObjectContainer();
        this.blockdispcont.$touchEnabled = true;
        this.addChild(this.blockdispcont);
        this.blockdispcont.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchbegin, this);

        this.gameinterval();
    }
    /**游戏定时器 */
    private gameinterval() {
        GameUtil.trace('interval');
        //this.gameover();
    }

    private createblock() {

        for (var i: number = 0; i < GameConfig.BCOL * GameConfig.BROW; i++) {
            var eleid = RandomUtils.limitInteger(0, 4);
            var blocksp: Blocksprite = new Blocksprite(eleid, (i % GameConfig.BROW), Math.floor(i / GameConfig.BROW));
            this.blockdispcont.addChild(blocksp);
            this.blockarr[i] = blocksp;
        }
    }

    private checkgameover() {
        //GameData._i().GamePause = false;
        var bgameover: boolean = true;
        for (var i = 0; i < this.blockdispcont.numChildren; i++) {
            this.selectarr = [];
            var blocksp: Blocksprite = <Blocksprite>this.blockdispcont.getChildAt(i);
            this.selectarr.push(blocksp);
            // blocksp.select(true);
            this.checktouchblock(blocksp);
            //console.log('arr====', this.selectarr);
            if (this.selectarr.length >= 2) {
                bgameover = false;
                break;
            }
        }
        this.selectarr = [];
        if (bgameover) {
            this.gameover();
        }
    }

    private touchbegin(evt: egret.TouchEvent) {

        if (GameData._i().GamePause) {
            return;
        }
        GameData._i().GamePause = true;

        for (var i = 0; i < this.blockdispcont.numChildren; i++) {
            var blocksp: Blocksprite = <Blocksprite>this.blockdispcont.getChildAt(i);
            if (blocksp != null && this.getrect(blocksp).contains(evt.localX, evt.localY)) {
                //console.log('enter');
                if (this.selectarr.length > 0) {
                    if (!this.arrfindelement(blocksp, this.selectarr)) {
                        for (var j: number = 0; j < this.selectarr.length; j++) {
                            this.selectarr[j].select(false);
                        }
                        this.selectarr = [];
                        GameData._i().GamePause = false;
                    } else {
                        GameData._i().gamesound[SoundName.remove].play();
                        GameData._i().currgamescore[0] += 20 + (this.selectarr.length - 2) * ((this.selectarr.length - 3) * 5 + 25);
                        this.createbom(blocksp.blockid, evt.localX, evt.localY, this.selectarr.length);
                        this.tiptext.updatscore();
                        this.dropbolck();
                    }

                    this.tiptext.updatatiptext(0);
                }
                else {
                    this.selectarr.push(blocksp);
                    // blocksp.select(true);
                    this.checktouchblock(blocksp);
                    //console.log('arr====', this.selectarr);
                    if (this.selectarr.length >= 2) {
                        GameData._i().gamesound[SoundName.clickf].play();
                        for (var ai: number = 0; ai < this.selectarr.length; ai++) {
                            this.selectarr[ai].select(true);
                        }
                        this.tiptext.updatatiptext(this.selectarr.length);
                    }
                    else {
                        this.selectarr = [];
                    }
                    GameData._i().GamePause = false;
                }
                break;
            }
        }

    }

    private arrfindelement(element: any, arr: any[]): boolean {
        if (arr.indexOf(element) != -1) {
            return true;
        }
        return false;
    }

    private checktouchblock(block: Blocksprite) {

        var selectEleID = block.blockid;
        var touchtag = block.posx + block.posy * GameConfig.BROW;
        var dirTag = touchtag - 1;
        if (touchtag % GameConfig.BROW != 0 && this.blockarr[dirTag] != null) {
            var newblock = this.blockarr[dirTag];
            if (!this.arrfindelement(newblock, this.selectarr) && newblock.blockid == selectEleID) {
                this.selectarr.push(newblock);
                this.checktouchblock(newblock);
            }
        }
        dirTag = touchtag + 1;
        if (dirTag % GameConfig.BROW != 0 && this.blockarr[dirTag] != null) {
            var newblock = this.blockarr[dirTag];
            if (!this.arrfindelement(newblock, this.selectarr) && newblock.blockid == selectEleID) {
                this.selectarr.push(newblock);
                this.checktouchblock(newblock);
            }
        }
        dirTag = touchtag + GameConfig.BROW;
        if (this.blockarr[dirTag] != null) {
            var newblock = this.blockarr[dirTag];
            if (!this.arrfindelement(newblock, this.selectarr) && newblock.blockid == selectEleID) {
                this.selectarr.push(newblock);
                this.checktouchblock(newblock);
            }
        }
        dirTag = touchtag - GameConfig.BROW;
        if (dirTag > 0 && this.blockarr[dirTag] != null) {
            var newblock = this.blockarr[dirTag];
            if (!this.arrfindelement(newblock, this.selectarr) && newblock.blockid == selectEleID) {
                this.selectarr.push(newblock);
                this.checktouchblock(newblock);
            }
        }
    }

    private dropbolck() {

        if (this.selectarr.length > 6) {
            var goodtipimg: MyBitmap = new MyBitmap(RES.getRes('goodtip_png'), this.mStageW / 2, this.mStageH / 2);
            this.addChild(goodtipimg);
            egret.Tween.get(goodtipimg).to({ y: this.mStageH / 2 - 100 }, 550).call(function () {
                goodtipimg.parent.removeChild(goodtipimg);
            })
        }

        for (var i: number = 0; i < this.selectarr.length; i++) {
            var blocksp = this.selectarr[i];
            this.blockdispcont.removeChild(blocksp);
            var index: number = this.blockarr.indexOf(blocksp);
            this.blockarr[index] = null;
        }
        this.selectarr = [];
        this.downBlock();
    }

    //往下掉落
    private downBlock(): void {
        //向下
        for (var i: number = 0; i < GameConfig.BROW; i++) {
            for (var j: number = GameConfig.BCOL - 1; j >= 0; j--) {
                if (this.blockarr[i + GameConfig.BROW * j] == null) {

                    for (var k: number = j - 1; k >= 0; k--) {
                        if (this.blockarr[i + GameConfig.BROW * k] != null) {
                            var blocksp = this.blockarr[i + GameConfig.BROW * k];

                            //var posx:number = this.offX+kdiamod.width*i;
                            blocksp.posy = j;
                            var posy: number = GameConfig.getSH() / 2 - 252 + j * GameConfig.DICBH;

                            var tw = egret.Tween.get(blocksp);
                            tw.to({ y: posy }, 300);

                            this.blockarr[i + GameConfig.BROW * j] = blocksp;
                            this.blockarr[i + GameConfig.BROW * k] = null;

                            break;
                        }
                    }
                }
            }
        }
        egret.setTimeout(this.moveleft, this, 300);
    }
    private moveleft() {
        //向左
        for (var i: number = 0; i < GameConfig.BROW; i++) {
            var posy: number = GameConfig.BCOL - 1;
            if (this.blockarr[i + posy * GameConfig.BROW] == null) {
                for (var j: number = GameUtil.MIN(GameConfig.BROW - 1, i + 1); j < GameConfig.BROW; j++) {
                    if (this.blockarr[j + posy * GameConfig.BROW] != null) {
                        for (var k: number = 0; k < GameConfig.BCOL; k++) {
                            if (this.blockarr[j + GameConfig.BROW * k] != null) {
                                var blocksp = this.blockarr[j + GameConfig.BROW * k];

                                //var posx:number = this.offX+kdiamod.width*i;
                                blocksp.posx = i;
                                var posx: number = GameConfig.getSW() / 2 - 334 + i * GameConfig.DICBW

                                var tw = egret.Tween.get(blocksp);
                                tw.to({ x: posx }, 300).call(function () {

                                });

                                this.blockarr[i + GameConfig.BROW * k] = blocksp;
                                this.blockarr[j + GameConfig.BROW * k] = null;
                            }
                        }
                        break;
                    }
                }
            }
        }
        this.checkgameover();
    }

    private jugeishad(pos): boolean {
        if (this.blockarr[pos] != null) {
            return true;
        }

        return false;
    }

    private jugeisgameover(): boolean {

        return true;
    }
    /**游戏结束 */
    public gameover() {
        GameUtil.trace('gameover');
        //this.gametime.stop();
        //egret.Tween.removeAllTweens();

        GameData._i().lastfruit = this.blockdispcont.numChildren;
        var addscore: number = this.getlastscore();
        GameData._i().currgamescore[0] += addscore;

        var tiptext: GameUtil.MyTextField = new GameUtil.MyTextField(this.mStageW / 2, this.mStageH / 2, 50);
        this.addChild(tiptext);
        tiptext.textAlign = egret.HorizontalAlign.CENTER;
        tiptext.width = 300;
        tiptext.textColor = 0xff0000;
        tiptext.setText('剩余' + GameData._i().lastfruit + '个水果' + '加' + addscore + '分');

        egret.setTimeout(this.culgameover, this, 2700, [tiptext]);

    }
    private culgameover(tiptext: any) {

        (<GameUtil.MyTextField>tiptext[0]).parent.removeChild(tiptext[0]);

        if (GameData._i().currgamescore[0] >= GameData._i().gamescore) {
            //下一关
            var passgameimg: MyBitmap = new MyBitmap(RES.getRes('passgame_png'), this.mStageW / 2, this.mStageH / 2);
            this.addChild(passgameimg);
            passgameimg.scaleX = 0;
            passgameimg.scaleY = 0;
            egret.Tween.get(passgameimg).to({ scaleX: 1.2, scaleY: 1.2 }, 900).to({ scaleX: 1, scaleY: 1 }, 400).to({ scaleX: 1 }, 500).call(() => {
                passgameimg.parent.removeChild(passgameimg);
                this.nextlevelgame();
            });
        }
        else {
            GameData._i().GameOver = true;
            this.clearinter();
            this.addChild(new GameOverPageShow());
        }
    }
    /**
     *下一关
     */
    private nextlevelgame() {
        //剩余水果数
        GameData._i().currgamescore[1]++;
        this.tiptext.nextgamescore();
        this.tiptext.updatscore();
        this.blockdispcont.removeChildren();
        this.createblock();
    }

    /**重置游戏数据 */
    public reset() {
        this.gameinterval();
        this.restart();
    }
    /**清除定时器 */
    private clearinter() {
        GameUtil.clearinterval(this.intervalarr);
        // for (var i: number = 0; i < this.enemyContain.numChildren; i++) {
        //     var enemysp: EnemySprite = <EnemySprite>this.enemyContain.getChildAt(i);
        //     GameUtil.clearinterval(enemysp.intervalarr);
        // }
    }

    private exitgame() {
        GameUtil.GameScene.runscene(new StartGameScene());
    }

    private restartask() {
        var askcon: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        this.addChild(askcon);
        askcon.touchEnabled = true;
        var shap: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0.6);
        askcon.addChild(shap);

        var bgname: string = 'restartbg_png';
        var gameoverbg: MyBitmap = new MyBitmap(RES.getRes(bgname), this.mStageW / 2, this.mStageH / 2);
        askcon.addChild(gameoverbg);
        var bgtext: MyBitmap = new MyBitmap(RES.getRes('restarttext_png'), 330, 80, gameoverbg);
        askcon.addChild(bgtext);

        var btname: string[] = ['yesbtn_png', 'nobtn_png'];
        var btnfun: Function[] = [this.restart,];
        for (var i: number = 0; i < 2; i++) {
            var btn: GameUtil.Menu = new GameUtil.Menu(this, btname[i], btname[i], (id) => {
                askcon.parent.removeChild(askcon);
                if (id == 0) {
                    this.restart();
                }
            }, [i]);
            askcon.addChild(btn);
            GameUtil.relativepos(btn, gameoverbg, 175 + 290 * i, 260);
        }
    }
    public restart() {
        this.blockdispcont.removeChildren();
        for (var i: number = 0; i < GameConfig.BROW * GameConfig.BCOL; i++) {
            this.blockarr[i] = null;
        }
        GameData._i().gamescore = 1000;
        GameData._i().currgamescore[0] = 0;
        GameData._i().currgamescore[1] = 1;
        GameData._i().currgamescore[2] = 0;
        this.tiptext.updatscore();
        this.curscore = 0;
        this.hightscore = 2;
        this.createblock();
        console.log('restart');
        //this.restart();
    }

    private getrect(obj: any): egret.Rectangle {
        var rect: egret.Rectangle = obj.getBounds();
        rect.x = obj.x - obj.width / 2;
        rect.y = obj.y - obj.height / 2;

        return rect;
    }

    private getlastscore(): number {
        var lastscore: number = 0;
        var lastnum: number = GameUtil.MAX(1, this.blockdispcont.numChildren);
        for (var i: number = 0; i < 11 - lastnum; i++) {
            lastscore += (380 - i * 40);
            //console.log('\nlastscore====', lastscore);
        }

        return lastscore;
    }

    private createbom(resnum: number, x: number, y: number, maxpa: number) {
        //获取纹理
        var texture = RES.getRes("bom" + resnum + "_png");
        //获取配置
        var config = RES.getRes("bomconfig_json");
        //创建 GravityParticleSystem
        var system = new particle.GravityParticleSystem(texture, config);
        system.emitterX = x;
        system.emitterY = y;
        //启动粒子库
        system.start(800);
        system.maxParticles = maxpa * 5;
        //将例子系统添加到舞台
        this.addChild(system);
        egret.setTimeout(() => {
            system.stop();
            this.removeChild(system);
            GameData._i().GamePause = false;
        }, this, 1000);
    }
}