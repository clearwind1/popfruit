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
    private selettipText: GameUtil.MyTextField;

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

        this.selettipText = new GameUtil.MyTextField(this.mStageW / 2, textposy + 50, 35);
        this.selettipText.setText('');
        this.addChild(this.selettipText);
    }

    public updatscore() {
        this.levelText.setText('' + GameData._i().currgamescore[1]);
        this.scoreText.setText('' + GameData._i().currgamescore[0]);
        this.goalText.setText('' + GameData._i().gamescore);
    }

    public updatatiptext(fnum: number) {
        if (fnum == 0) {
            this.selettipText.setText('');
            return;
        }
        var score: number = 20 + (fnum - 2) * ((fnum - 3) * 5 + 25);
        this.selettipText.setText(fnum+'个水果'+score+'分');
    }

    public nextgamescore() {
        if (GameData._i().currgamescore[1] <= 6) {
            GameData._i().gamescore = 1000 + 2000 * (GameData._i().currgamescore[1] - 1);
        }
        else {
            for (var i: number = 0; i < GameData._i().currgamescore[1] - 6; i++){
                GameData._i().gamescore += 1400 + (GameData._i().currgamescore[1] - 7) * (3000+1000*Math.floor((GameData._i().currgamescore[1] - 7)/10));
            }
        }
    }

}