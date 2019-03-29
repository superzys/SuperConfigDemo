/// <reference path="ConfigBase.ts" />
namespace SuperConfig {
	var  _LevelTable:LevelTable|undefined;
	export function  GetLevelTable():LevelTable|undefined{
		if(_LevelTable == undefined)
 			LoadLevelTable();
		return _LevelTable;
	}
	export function LoadLevelTable(){
		var json = LoadJsonFunc("level.json");
		 _LevelTable = new LevelTable().init(json);
	}
	export function ClearLevelTable () {
		_LevelTable = undefined;
	}
	export class LevelTableGroup {
	// public Maxexp:Map<string,number[]>  = new Map<string,number[]>();
		public Maxexp:any;
	// public Maxexp_maxhp:Map<string,Map<string,number[]>>  = new Map<string,number[]>();
		public Maxexp_maxhp:any;
		init(d:any){
			this.Maxexp=d.Maxexp;
			this.Maxexp_maxhp=d.Maxexp_maxhp;
			return this;
		}
	}
	export class LevelConfig {
		public  Level:number = 0; // 等级
		public  Maxexp:number = 0; // 升级经验
		public  Maxhp:number = 0; // 最大血量
		public  Txt:string = ""; // 测试文本
		public  Double:number = 0; // 测试double
		public  Aaa:number = 0; // 测试
		init(d:any){
			this.Level=d.Level; 
			this.Maxexp=d.Maxexp; 
			this.Maxhp=d.Maxhp; 
			this.Txt=d.Txt; 
			this.Double=d.Double; 
			this.Aaa=d.Aaa; 
			 return this;
		}
	}

// 等级.xlsx
	export class LevelTable {
		public Name:string="";
		public _Datas : Map<string, LevelConfig> = new Map<string, LevelConfig>();
		public _Group:LevelTableGroup|undefined;
		private Maxexp_Cached:Map<string,LevelConfig[]>  = new Map<string,LevelConfig[]>();
		private Maxexp_maxhp_Cached:Map<string,LevelConfig[]>  = new Map<string,LevelConfig[]>();
		init(d:any){
			this.Name = d.Name;
			this._Datas = new Map<string, LevelConfig>();
			let keys = Object.keys(d._Datas);
			for (let index = 0; index < keys.length; index++) {
				var k = keys[index];
				this._Datas.set(k,new LevelConfig().init(d._Datas[k]));
			}
			this._Group = new LevelTableGroup().init(d._Group);
			return this;
		}

		public Get(id:number) :LevelConfig|undefined {
			let k:string = id.toString();
			if (this._Datas.has(k))
				return this._Datas.get(k);
			return undefined;
		}
		public  Get_maxexp(Maxexp:number):LevelConfig[] |undefined{
			var cach_key:string = +Maxexp+"_";
			if(this.Maxexp_Cached&& this.Maxexp_Cached.has(cach_key))
				return this.Maxexp_Cached.get(cach_key);
			if (this._Group && this._Group.Maxexp[Maxexp.toString()] ){
				var ids = this._Group.Maxexp[Maxexp.toString()];
				var configs:LevelConfig[] = [];
				for (let i = 0; i < ids.length; i++) {
					var id = ids[i];
					var oneItem = this.Get(id);
					 if(oneItem){
						configs.push(oneItem);
					}
				}
				this.Maxexp_Cached.set(cach_key,configs);
				return configs;
			}
			return undefined;
		}
		public  Get_maxexp_maxhp(Maxexp:number,Maxhp:number):LevelConfig[] |undefined{
			var cach_key:string = +Maxexp+"_"+Maxhp+"_";
			if(this.Maxexp_maxhp_Cached&& this.Maxexp_maxhp_Cached.has(cach_key))
				return this.Maxexp_maxhp_Cached.get(cach_key);
			if (this._Group && this._Group.Maxexp_maxhp[Maxexp.toString()] ){
				var tmp0 = this._Group.Maxexp_maxhp[Maxexp.toString()];
				if (tmp0[Maxhp.toString()] ){
				var ids = tmp0[Maxhp.toString()];
				var configs:LevelConfig[] = [];
				for (let i = 0; i < ids.length; i++) {
					var id = ids[i];
					var oneItem = this.Get(id);
					 if(oneItem){
						configs.push(oneItem);
					}
				}
				this.Maxexp_maxhp_Cached.set(cach_key,configs);
				return configs;
			}
			}
			return undefined;
		}
		public data_level_vlookup_1(id:number) : number {
			var table =GetLevelTable() ;
			if(table && table._Datas) {
				 var getOne = table._Datas.get(id.toString()); 
				 if( getOne){
					 return getOne.Level 
				}
			}
			return  0;
		}
		public data_level_vlookup_2(id:number) : number {
			var table =GetLevelTable() ;
			if(table && table._Datas) {
				 var getOne = table._Datas.get(id.toString()); 
				 if( getOne){
					 return getOne.Maxexp 
				}
			}
			return  0;
		}
		public data_level_vlookup_3(id:number) : number {
			var table =GetLevelTable() ;
			if(table && table._Datas) {
				 var getOne = table._Datas.get(id.toString()); 
				 if( getOne){
					 return getOne.Maxhp 
				}
			}
			return  0;
		}
		public data_level_vlookup_5(id:number) : number {
			var table =GetLevelTable() ;
			if(table && table._Datas) {
				 var getOne = table._Datas.get(id.toString()); 
				 if( getOne){
					 return getOne.Double 
				}
			}
			return  0;
		}
		public data_level_vlookup_6(id:number) : number {
			var table =GetLevelTable() ;
			if(table && table._Datas) {
				 var getOne = table._Datas.get(id.toString()); 
				 if( getOne){
					 return getOne.Aaa 
				}
			}
			return  0;
		}
	}
}
