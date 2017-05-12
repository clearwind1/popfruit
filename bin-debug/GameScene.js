/**
 * Create by hardy on 16/12/21
 * 主游戏场景
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        _super.call(this);
        this.moveoncetag = false;
    }
    var d = __define,c=GameScene,p=c.prototype;
    p.init = function () {
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
    };
    p.initdata = function () {
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
    };
    /**
     * 显示背景
     */
    p.showbg = function () {
        this.intervalarr = [];
        this.blockarr = [];
        this.selectarr = [];
        for (var i = 0; i < GameConfig.BCOL * GameConfig.BROW; i++) {
            this.blockarr[i] = null;
        }
        var gamebg = new MyBitmap(RES.getRes('gamebg_png'), 0, 0);
        gamebg.setanchorOff(0, 0);
        gamebg.width = this.mStageW;
        gamebg.height = this.mStageH;
        this.addChild(gamebg);
        this.tiptext = new TipTextPage();
        this.addChild(this.tiptext);
        var exitgamebtn = new GameUtil.Menu(this, 'returnbtn_png', 'returnbtn_png', this.exitgame);
        exitgamebtn.setScaleMode();
        exitgamebtn.x = 54;
        exitgamebtn.y = 53;
        this.addChild(exitgamebtn);
        var restartbtn = new GameUtil.Menu(this, 'restartbtn_png', 'restartbtn_png', this.restartask);
        restartbtn.setScaleMode();
        restartbtn.x = this.mStageW - 54;
        restartbtn.y = 53;
        this.addChild(restartbtn);
        this.blockdispcont = new egret.DisplayObjectContainer();
        this.blockdispcont.$touchEnabled = true;
        this.addChild(this.blockdispcont);
        this.blockdispcont.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchbegin, this);
        this.gameinterval();
    };
    /**游戏定时器 */
    p.gameinterval = function () {
        GameUtil.trace('interval');
        //this.gameover();
    };
    p.createblock = function () {
        for (var i = 0; i < GameConfig.BCOL * GameConfig.BROW; i++) {
            var eleid = RandomUtils.limitInteger(0, 4);
            var blocksp = new Blocksprite(eleid, (i % GameConfig.BROW), Math.floor(i / GameConfig.BROW));
            this.blockdispcont.addChild(blocksp);
            this.blockarr[i] = blocksp;
        }
    };
    p.checkgameover = function () {
        //GameData._i().GamePause = false;
        var bgameover = true;
        for (var i = 0; i < this.blockdispcont.numChildren; i++) {
            this.selectarr = [];
            var blocksp = this.blockdispcont.getChildAt(i);
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
    };
    p.touchbegin = function (evt) {
        if (GameData._i().GamePause) {
            return;
        }
        GameData._i().GamePause = true;
        for (var i = 0; i < this.blockdispcont.numChildren; i++) {
            var blocksp = this.blockdispcont.getChildAt(i);
            if (blocksp != null && this.getrect(blocksp).contains(evt.localX, evt.localY)) {
                //console.log('enter');
                if (this.selectarr.length > 0) {
                    if (!this.arrfindelement(blocksp, this.selectarr)) {
                        for (var j = 0; j < this.selectarr.length; j++) {
                            this.selectarr[j].select(false);
                        }
                        this.selectarr = [];
                        GameData._i().GamePause = false;
                    }
                    else {
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
                        for (var ai = 0; ai < this.selectarr.length; ai++) {
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
    };
    p.arrfindelement = function (element, arr) {
        if (arr.indexOf(element) != -1) {
            return true;
        }
        return false;
    };
    p.checktouchblock = function (block) {
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
    };
    p.dropbolck = function () {
        if (this.selectarr.length > 6) {
            var goodtipimg = new MyBitmap(RES.getRes('goodtip_png'), this.mStageW / 2, this.mStageH / 2);
            this.addChild(goodtipimg);
            egret.Tween.get(goodtipimg).to({ y: this.mStageH / 2 - 100 }, 550).call(function () {
                goodtipimg.parent.removeChild(goodtipimg);
            });
        }
        for (var i = 0; i < this.selectarr.length; i++) {
            var blocksp = this.selectarr[i];
            this.blockdispcont.removeChild(blocksp);
            var index = this.blockarr.indexOf(blocksp);
            this.blockarr[index] = null;
        }
        this.selectarr = [];
        this.downBlock();
    };
    //往下掉落
    p.downBlock = function () {
        //向下
        for (var i = 0; i < GameConfig.BROW; i++) {
            for (var j = GameConfig.BCOL - 1; j >= 0; j--) {
                if (this.blockarr[i + GameConfig.BROW * j] == null) {
                    for (var k = j - 1; k >= 0; k--) {
                        if (this.blockarr[i + GameConfig.BROW * k] != null) {
                            var blocksp = this.blockarr[i + GameConfig.BROW * k];
                            //var posx:number = this.offX+kdiamod.width*i;
                            blocksp.posy = j;
                            var posy = GameConfig.getSH() / 2 - 252 + j * GameConfig.DICBH;
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
    };
    p.moveleft = function () {
        //向左
        for (var i = 0; i < GameConfig.BROW; i++) {
            var posy = GameConfig.BCOL - 1;
            if (this.blockarr[i + posy * GameConfig.BROW] == null) {
                for (var j = GameUtil.MIN(GameConfig.BROW - 1, i + 1); j < GameConfig.BROW; j++) {
                    if (this.blockarr[j + posy * GameConfig.BROW] != null) {
                        for (var k = 0; k < GameConfig.BCOL; k++) {
                            if (this.blockarr[j + GameConfig.BROW * k] != null) {
                                var blocksp = this.blockarr[j + GameConfig.BROW * k];
                                //var posx:number = this.offX+kdiamod.width*i;
                                blocksp.posx = i;
                                var posx = GameConfig.getSW() / 2 - 334 + i * GameConfig.DICBW;
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
    };
    p.jugeishad = function (pos) {
        if (this.blockarr[pos] != null) {
            return true;
        }
        return false;
    };
    p.jugeisgameover = function () {
        return true;
    };
    /**游戏结束 */
    p.gameover = function () {
        GameUtil.trace('gameover');
        //this.gametime.stop();
        //egret.Tween.removeAllTweens();
        GameData._i().lastfruit = this.blockdispcont.numChildren;
        var addscore = this.getlastscore();
        GameData._i().currgamescore[0] += addscore;
        var tiptext = new GameUtil.MyTextField(this.mStageW / 2, this.mStageH / 2, 50);
        this.addChild(tiptext);
        tiptext.textAlign = egret.HorizontalAlign.CENTER;
        tiptext.width = 300;
        tiptext.textColor = 0xff0000;
        tiptext.setText('剩余' + GameData._i().lastfruit + '个水果' + '加' + addscore + '分');
        egret.setTimeout(this.culgameover, this, 2700, [tiptext]);
    };
    p.culgameover = function (tiptext) {
        var _this = this;
        tiptext[0].parent.removeChild(tiptext[0]);
        if (GameData._i().currgamescore[0] >= GameData._i().gamescore) {
            //下一关
            var passgameimg = new MyBitmap(RES.getRes('passgame_png'), this.mStageW / 2, this.mStageH / 2);
            this.addChild(passgameimg);
            passgameimg.scaleX = 0;
            passgameimg.scaleY = 0;
            egret.Tween.get(passgameimg).to({ scaleX: 1.2, scaleY: 1.2 }, 900).to({ scaleX: 1, scaleY: 1 }, 400).to({ scaleX: 1 }, 500).call(function () {
                passgameimg.parent.removeChild(passgameimg);
                _this.nextlevelgame();
            });
        }
        else {
            GameData._i().GameOver = true;
            this.clearinter();
            this.addChild(new GameOverPageShow());
        }
    };
    /**
     *下一关
     */
    p.nextlevelgame = function () {
        //剩余水果数
        GameData._i().currgamescore[1]++;
        this.tiptext.nextgamescore();
        this.tiptext.updatscore();
        this.blockdispcont.removeChildren();
        this.createblock();
    };
    /**重置游戏数据 */
    p.reset = function () {
        this.gameinterval();
        this.restart();
    };
    /**清除定时器 */
    p.clearinter = function () {
        GameUtil.clearinterval(this.intervalarr);
        // for (var i: number = 0; i < this.enemyContain.numChildren; i++) {
        //     var enemysp: EnemySprite = <EnemySprite>this.enemyContain.getChildAt(i);
        //     GameUtil.clearinterval(enemysp.intervalarr);
        // }
    };
    p.exitgame = function () {
        GameUtil.GameScene.runscene(new StartGameScene());
    };
    p.restartask = function () {
        var _this = this;
        var askcon = new egret.DisplayObjectContainer();
        this.addChild(askcon);
        askcon.touchEnabled = true;
        var shap = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0.6);
        askcon.addChild(shap);
        var bgname = 'restartbg_png';
        var gameoverbg = new MyBitmap(RES.getRes(bgname), this.mStageW / 2, this.mStageH / 2);
        askcon.addChild(gameoverbg);
        var bgtext = new MyBitmap(RES.getRes('restarttext_png'), 330, 80, gameoverbg);
        askcon.addChild(bgtext);
        var btname = ['yesbtn_png', 'nobtn_png'];
        var btnfun = [this.restart,];
        for (var i = 0; i < 2; i++) {
            var btn = new GameUtil.Menu(this, btname[i], btname[i], function (id) {
                askcon.parent.removeChild(askcon);
                if (id == 0) {
                    _this.restart();
                }
            }, [i]);
            askcon.addChild(btn);
            GameUtil.relativepos(btn, gameoverbg, 175 + 290 * i, 260);
        }
    };
    p.restart = function () {
        this.blockdispcont.removeChildren();
        for (var i = 0; i < GameConfig.BROW * GameConfig.BCOL; i++) {
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
    };
    p.getrect = function (obj) {
        var rect = obj.getBounds();
        rect.x = obj.x - obj.width / 2;
        rect.y = obj.y - obj.height / 2;
        return rect;
    };
    p.getlastscore = function () {
        var lastscore = 0;
        var lastnum = GameUtil.MAX(1, this.blockdispcont.numChildren);
        for (var i = 0; i < 11 - lastnum; i++) {
            lastscore += (380 - i * 40);
        }
        return lastscore;
    };
    p.createbom = function (resnum, x, y, maxpa) {
        var _this = this;
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
        egret.setTimeout(function () {
            system.stop();
            _this.removeChild(system);
            GameData._i().GamePause = false;
        }, this, 1000);
    };
    return GameScene;
}(GameUtil.BassPanel));
egret.registerClass(GameScene,'GameScene');
//# sourceMappingURL=GameScene.js.map