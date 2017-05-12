/**
 * Create by hardy on 17/4/26
 * 主游戏场景
 */

class TipTextPage extends GameUtil.BassPanel {
    public constructor() {
        super();
    }

    private scoreText: GameUtil.MyTextField;
    private levelText: GameUtil.MyTextField;
    private goalText: GameUtil.MyTextField;
    private tiptext: GameUtil.MyTextField;
    private selettipText: GameUtil.MyTextField;
    private numtiptext: GameUtil.MyTextField;

    public init() {
        var textposy: number = GameConfig.getSH() / 2 - 395;
        var stpos: number[] = [0, 150, 360];
        var sttext: string[] = ['关卡', '分数', '目标分数'];
        for (var i: number = 0; i < 3; i++) {
            var scorett: GameUtil.MyTextField = new GameUtil.MyTextField(this.mStageW / 2 - 301 + stpos[i], textposy, 40, 0, 0.5);
            scorett.setText(sttext[i]);
            scorett.textColor = 0xffffff;
            this.addChild(scorett);
        }

        this.levelText = new GameUtil.MyTextField(this.mStageW / 2 - 211 + stpos[0], textposy, 40, 0, 0.5);
        this.levelText.setText('' + GameData._i().currgamescore[1]);
        this.levelText.textColor = 0xffffff;
        this.addChild(this.levelText);

        this.scoreText = new GameUtil.MyTextField(this.mStageW / 2 - 211 + stpos[1], textposy, 40, 0, 0.5);
        this.scoreText.setText('' + GameData._i().currgamescore[0]);
        this.scoreText.textColor = 0xffffff;
        this.addChild(this.scoreText);

        this.goalText = new GameUtil.MyTextField(this.mStageW / 2 - 131 + stpos[2], textposy, 40, 0, 0.5);
        this.goalText.setText('' + GameData._i().gamescore);
        this.goalText.textColor = 0xffffff;
        this.addChild(this.goalText);

        this.tiptext = new GameUtil.MyTextField(this.mStageW / 2, textposy + 50, 35);
        this.tiptext.setText('');
        this.tiptext.textColor = 0xffffff;
        this.addChild(this.tiptext);

        this.numtiptext = new GameUtil.MyTextField(this.tiptext.x - 110, textposy + 53, 35, 1);
        this.numtiptext.setText('');
        this.numtiptext.textColor = 0xff0000;
        this.addChild(this.numtiptext);

        this.selettipText = new GameUtil.MyTextField(this.tiptext.x+35, textposy + 53, 35,0.5);
        this.selettipText.setText('');
        this.selettipText.textColor = 0xff0000;
        this.addChild(this.selettipText);
    }

    public updatscore() {
        this.levelText.setText('' + GameData._i().currgamescore[1]);
        this.scoreText.setText('' + GameData._i().currgamescore[0]);
        this.goalText.setText('' + GameData._i().gamescore);
    }

    public updatatiptext(fnum: number) {
        if (fnum == 0) {
            this.numtiptext.setText('');
            this.tiptext.setText('');
            this.selettipText.setText('');
            return;
        }
        var score: number = 20 + (fnum - 2) * ((fnum - 3) * 5 + 25);
        this.numtiptext.setText(fnum+'');
        this.tiptext.setText('个水果         分');
        this.selettipText.setText(score+'');
    }

    public nextgamescore(gamelevel:number = GameData._i().currgamescore[1]) {
        if (gamelevel <= 6) {
            GameData._i().gamescore = 1000 + 2000 * (gamelevel - 1);
        }
        else {
            for (var i: number = 0; i < gamelevel - 6; i++){
                GameData._i().gamescore += 14000 + (gamelevel - 7) * (3000+1000*Math.floor((gamelevel - 7)/10));
            }
        }
    }

}