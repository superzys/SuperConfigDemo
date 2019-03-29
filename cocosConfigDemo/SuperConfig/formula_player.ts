/// <reference path="ConfigBase.ts" />
namespace SuperConfig {
	export function  NewPlayerFormulaSheet():PlayerFormulaSheet{
		var formula = new PlayerFormulaSheet();
		formula.Init();
		return formula;
	}
	export class PlayerFormulaSheet extends FormulaSheet { //定义数据表类开始
		public Init(){
			this.datas.set(1003,10);
			this.funcs.set(1006 , (ins) => {
				return (ins.get(1 * 1000 + 3) * 999);
			});
			this.relation.set(1003, [1006]);
		} // 初始化数据结束
		public GetLevel() : number { //等级
			return this.get(1003);
		}
		public SetLevel(v:number) {//等级
			this.set(1003,v);
		}
		public GetLevelupexp() : number { //升级经验
			return this.get(1006);
		}
	}
}
