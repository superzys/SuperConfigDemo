/// <reference path="ConfigBase.ts" />
namespace SuperConfig {
	export function  NewHeroFormulaSheet():HeroFormulaSheet{
		var formula = new HeroFormulaSheet();
		formula.Init();
		return formula;
	}
	export class HeroFormulaSheet extends FormulaSheet { //定义数据表类开始
		public Init(){
			this.datas.set(1003,20);
			this.funcs.set(1006 , (ins) => {
				return (GetLevelTable().data_level_vlookup_3(ins.get(1 * 1000 + 3)) + ins.get(2 * 1000 + 8));
			});
			this.datas.set(2003,5);
			this.funcs.set(2008 , (ins) => {
				return ins.excelFact(ins.get(2 * 1000 + 3));
			});
			this.relation.set(1003, [1006]);
			this.relation.set(2008, [1006]);
			this.relation.set(2003, [2008,1006]);
		} // 初始化数据结束
		public GetLevel() : number { //等级
			return this.get(1003);
		}
		public SetLevel(v:number) {//等级
			this.set(1003,v);
		}
		public GetRatio() : number { //成长
			return this.get(2003);
		}
		public SetRatio(v:number) {//成长
			this.set(2003,v);
		}
		public GetMaxhp() : number { //最大血量
			return this.get(1006);
		}
	}
}
