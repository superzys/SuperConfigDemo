import GameConfig from "./GameConfig";
class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded(): void {
		//加载IDE指定的场景
		// 设置加载委托


		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		// Laya.loader.load("res/config_data/level.json", Laya.Handler.create(this, this.onProLoaded));
		Laya.loader.load(SuperConfig.GetAllConfig("res/config_data/"), Laya.Handler.create(this, this.onProLoaded));
	}
	
    private onProLoaded(): void {
		SuperConfig.LoadJsonFunc = (f: string) => {
			console.log("加载:" + f);

			return Laya.loader.getRes("res/config_data/" + f);
		}
		let cfg = SuperConfig.GetLevelTable();
		let get1  = cfg.Get_maxexp(10);
		let get2  = cfg.Get(1);
		console.log( get1 +"  "+ get2);


		let heroClu =SuperConfig.NewHeroFormulaSheet();
		heroClu.SetRatio(2);
		heroClu.SetLevel(3);
		let eHP1 = heroClu.GetMaxhp();
		let rat1 = heroClu.GetRatio();
		console.log( eHP1 +"  "+ rat1);
		heroClu.SetLevel(5);
		let eHP2 = heroClu.GetMaxhp();
		let rat2 = heroClu.GetRatio();
		console.log( eHP2 +"  "+ rat2);
		heroClu.SetRatio(10);
		let eHP3 = heroClu.GetMaxhp();
		let rat3 = heroClu.GetRatio();
		console.log( eHP3 +"  "+ rat3);

		console.log(cfg);
	}

}
//激活启动类
new Main();
