/**
 * Create by hardy on 16/12/21
 * 游戏结束页面
 */
class GameOverPageShow extends Othercontainer {
    public constructor() {
        super();
    }
    protected show() {
        var data: any = {
            'code': 1
        };
        this.showscene(data);
    }
    /**显示 */
    private showscene(data: any) {
        //console.log('data-====', data['msg']);
        if (data['code'] == 1) {
            var bgname: string = 'gameoverbg_png';
            var gameoverbg: MyBitmap = new MyBitmap(RES.getRes(bgname), this.mStageW / 2, this.mStageH / 2);
            this.addChild(gameoverbg);
            var bgtext: MyBitmap = new MyBitmap(RES.getRes('gameovertext_png'), 315, 60, gameoverbg);
            this.addChild(bgtext);
            
            var morescore: number = this.getlastscore();
            var gettext: GameUtil.MyTextField = new GameUtil.MyTextField(110, 160, 40, 0, 0.5, gameoverbg);
            gettext.setText('获得:');
            gettext.textFlow = <Array<egret.ITextElement>>[{ text: "获得: ", style: { "textColor": 0xc96b21, "size": 40 } },
                { text: '' + GameData._i().currgamescore[0], style: { "textColor": 0xf83243, "size": 40 } }];
            this.addChild(gettext);

            var leveltext: GameUtil.MyTextField = new GameUtil.MyTextField(345, 160, 40, 0, 0.5, gameoverbg);
            leveltext.setText('关卡:');
            leveltext.textFlow = <Array<egret.ITextElement>>[{ text: "关卡: ", style: { "textColor": 0xc96b21, "size": 40 } },
                { text: '' + GameData._i().currgamescore[1], style: { "textColor": 0xf83243, "size": 40 } }];
            this.addChild(leveltext);

            var lasttext: GameUtil.MyTextField = new GameUtil.MyTextField(100, 225, 28, 0, 0.5, gameoverbg);
            lasttext.setText('最后剩余:' + GameData._i().lastfruit + '个水果，获得额外加分');
            lasttext.textColor = 0xc96b21;
            this.addChild(lasttext);
            var lastnumtext: GameUtil.MyTextField = new GameUtil.MyTextField(310, 265, 40, 0, 0.5, gameoverbg);
            lastnumtext.setText('' + morescore);
            lastnumtext.textColor = 0xf83243;
            this.addChild(lastnumtext);

            /**创建按钮 */
            var btname: string[] = ['gameoversharebtn_png', 'gameoverrestartbtn_png', 'gameoverretrunbtn_png'];
            var btnfun: Function[] = [this.share, this.relife, this.turnback];
            for (var i: number = 0; i < 3; i++) {
                var btn: GameUtil.Menu = new GameUtil.Menu(this, btname[i], btname[i], btnfun[i]);
                this.addChild(btn);
                GameUtil.relativepos(btn, gameoverbg, 120 + 190 * i, 340);
            }
        }
        else {
            data['msg'];
        }
    }
    /**分享 */
    private share() {
        if (!GameUtil.isSomeType(GameConfig.WeiXinstr)) {
            this.addChild(new GameUtil.TipsPanel(null, '请在微信中打开', true));
        } else {
            this.addChild(new SharePageShow());
        }
    }
    /**返回开始界面 */
    private turnback() {
        // PlayerData._i().initdata();
        //GameData._i().currgamescore[0] = GameData._i().gamescore;
        GameData._i().GameOver = false;
        GameData._i().gamescore = 0;
        this.close();
        GameUtil.GameScene.runscene(new StartGameScene());
    }
    /**复活 */
    private relife() {
        //PlayerData._i().initdata();
        GameData._i().GameOver = false;
        GameData._i().gamescore = 0;
        (<GameScene>this.parent).restart();
        this.close();
    }

    private getlastscore(): number{
        var lastscore: number = 0;
        var lastnum: number = GameUtil.MAX(1, GameData._i().lastfruit);
        for (var i: number = 0; i < 11 - lastnum; i++){
            lastscore += (380 - i * 40);
            //console.log('\nlastscore====', lastscore);
        }

        return lastscore;
    }

}