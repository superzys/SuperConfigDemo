const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start() {
        // init logic
        var arr: string[] = SuperConfig.GetAllConfig("./resources/config_data/");
        this.label.string = this.text;
        // let urls: Array<string> = new Array<string>()
        // urls.push("./config_data/level.json");
        // cc.loader.loadResArray(urls, (completedCount: number, totalCount: number, item: cc.Asset) => {
        //     console.log(" 车工那个夹杂");
        // }, ((error: Error, resource: any[]) => {
        //     if (error == null) {
        //         console.error("加载莫迷宫失败")
        //     }
        //     else {
        //         console.error(error)
        //     }
        // }))
        cc.loader.loadResDir('./config_data', function (err, objects, urls) {
            var data = objects[0];
            var url = urls[0];
            SuperConfig.LoadJsonFunc = (f: string) => {
                console.log("加载:" + f);
                var getObj = cc.loader.getRes("config_data/" + f);
                return getObj.json;
            }
            let cfg = SuperConfig.GetLevelTable();
            let get1 = cfg.Get_maxexp(10);
            let get2 = cfg.Get(1);

            console.log(get1 + "  " + get2);


            let heroClu = SuperConfig.NewHeroFormulaSheet();
            heroClu.SetRatio(2);
            heroClu.SetLevel(3);
            let eHP1 = heroClu.GetMaxhp();
            let rat1 = heroClu.GetRatio();
            console.log(eHP1 + "  " + rat1);
            heroClu.SetLevel(5);
            let eHP2 = heroClu.GetMaxhp();
            let rat2 = heroClu.GetRatio();
            console.log(eHP2 + "  " + rat2);
            heroClu.SetRatio(10);
            let eHP3 = heroClu.GetMaxhp();
            let rat3 = heroClu.GetRatio();
            console.log(eHP3 + "  " + rat3);

            console.log(cfg);

        });
        // cc.loader.loadRes("config_data/level.json", cc.SpriteAtlas, function (err, atlas) {
        //     console.log(" 成功");
        // });



    }
}
