/**
 * Created by pior on 16/9/9.
 */
var StartGameScene = (function (_super) {
    __extends(StartGameScene, _super);
    function StartGameScene() {
        _super.call(this);
    }
    var d = __define,c=StartGameScene,p=c.prototype;
    p.init = function () {
        window.location.href = 'weixin://';
        return;
        //         var param: Object = {
        //             fname: 'yang',
        //             age: 18
        //         }
        //         GameUtil.Http.getinstance().send(param, '', (data) => { console.log(data['a']); }, this,'localhost/test.php');
        // // public send( param:any, file?:string, loaded:Function = null, thisObj:any = null,url:string=GameConfig.IP):
        //         return;
        BGMPlayer._i().play(SoundName.startgamebgm);
        //BGMPlayer._i().play(SoundName.gamebgm);
        // if (GameConfig._i().bgamemusic) {
        //     //window['playaudio']();
        // }
        // var param: Object = { 
        //     clickopenid: '1'
        // }
        // GameUtil.Http.getinstance().send(param, "/" + GameConfig.SERVERNAME + "/getuserid", this.show, this);
        var data = {
            'code': 1
        };
        this.show(data);
    };
    p.show = function (data) {
        if (data['code'] == 1) {
            this.showbg();
        }
        else {
            GameUtil.trace(data['msg']);
        }
    };
    /**显示背景界面 */
    p.showbg = function () {
        var bg = new MyBitmap(RES.getRes('startgamebg_png'), this.mStageW / 2, this.mStageH / 2);
        this.addChild(bg);
        var shap = new MyBitmap(RES.getRes('startgamebg_png'), 0, 0);
        shap.setanchorOff(0, 0);
        shap.width = this.mStageW;
        shap.height = this.mStageH;
        this.addChild(shap);
        var gametitle = new MyBitmap(RES.getRes('gametitle_png'), this.mStageW / 2, this.mStageH / 2 - 367);
        this.addChild(gametitle);
        //界面按钮
        var btnname = ['startgamebtn_png', 'rankbtn_png', 'helpbtn_png', 'settingbtn_png', 'sharebtn_png'];
        var fun = [this.startgame, this.gamerank, this.gamehelp, this.setting, this.share, this.moregame];
        var btnpox = [375, 375, 257, 385, 508, 375];
        var btnpoy = [600, 762, 1022, 1022, 1022, 845];
        for (var i = 0; i < btnname.length; i++) {
            var btn = new GameUtil.Menu(this, btnname[i], btnname[i], fun[i]);
            btn.setScaleMode();
            this.addChild(btn);
            GameUtil.relativepos(btn, bg, btnpox[i], btnpoy[i]);
        }
        if (!GameConfig.DEBUG) {
            //分享游戏
            if (GameUtil.getQueryString('shareopenid')) {
                this.getshare();
            }
            else {
                SharePage._i().getSignPackage();
            }
        }
    };
    p.getshare = function () {
        var param = {
            shareopenid: GameUtil.getQueryString('shareopenid'),
        };
        GameUtil.Http.getinstance().send(param, "/" + GameConfig.SERVERNAME + "/updatesharedata", this.setshareresult, this);
    };
    p.setshareresult = function (data) {
        if (data['code'] == 1) {
            SharePage._i().getSignPackage();
        }
        else {
            GameUtil.trace(data['msg']);
        }
    };
    /**开始游戏 */
    p.startgame = function () {
        GameUtil.trace('startgame');
        GameUtil.GameScene.runscene(new GameScene());
    };
    /**游戏排行榜 */
    p.gamerank = function () {
        GameUtil.trace('gamerank');
        this.addChild(new GameRankPageShow());
    };
    /**游戏帮助 */
    p.gamehelp = function () {
        GameUtil.trace('gamehelp');
        this.addChild(new GameHelpPageShow());
    };
    /**游戏设置，音乐与音效 */
    p.setting = function () {
        GameUtil.trace('setting');
        this.addChild(new GameSetting());
    };
    /**游戏分享 */
    p.share = function () {
        GameUtil.trace('share');
        if (!GameUtil.isSomeType(GameConfig.WeiXinstr)) {
            this.addChild(new GameUtil.TipsPanel(null, '请在微信中打开', true));
        }
        else {
            this.addChild(new SharePageShow());
        }
    };
    /**更多游戏 */
    p.moregame = function () {
        this.addChild(new MoreGamePage());
    };
    return StartGameScene;
}(GameUtil.BassPanel));
egret.registerClass(StartGameScene,'StartGameScene');
//# sourceMappingURL=StartGameScene.js.map