/// <reference path="ConfigBase.ts" />
namespace SuperConfig {
	var  _MapTable:MapTable|undefined;
	export function  GetMapTable():MapTable|undefined{
		if(_MapTable == undefined)
 			LoadMapTable();
		return _MapTable;
	}
	export function LoadMapTable(){
		var json = LoadJsonFunc("map.json");
		 _MapTable = new MapTable().init(json);
	}
	export function ClearMapTable () {
		_MapTable = undefined;
	}
	export class MapTableGroup {
	// public Type:Map<string,number[]>  = new Map<string,number[]>();
		public Type:any;
		init(d:any){
			this.Type=d.Type;
			return this;
		}
	}
	export class MapConfig {
		public  Id:number = 0; // 地图ID（不能改）
		public  Type:number = 0; // 类型 1=世界场景 2=副本场景
		public  Share:number = 0; // 场景复用   1复用
		public  Res:string = ""; // 资源名
		public  Name:string = ""; // 场景名字
		public  Randomlvmin:number = 0; // 可随机玩家最小等级
		public  Randomlvmax:number = 0; // 随机最大等级
		init(d:any){
			this.Id=d.Id; 
			this.Type=d.Type; 
			this.Share=d.Share; 
			this.Res=d.Res; 
			this.Name=d.Name; 
			this.Randomlvmin=d.Randomlvmin; 
			this.Randomlvmax=d.Randomlvmax; 
			 return this;
		}
	}

// 场景.xlsx
	export class MapTable {
		public Name:string="";
		public _Datas : Map<string, MapConfig> = new Map<string, MapConfig>();
		public _Group:MapTableGroup|undefined;
		private Type_Cached:Map<string,MapConfig[]>  = new Map<string,MapConfig[]>();
		init(d:any){
			this.Name = d.Name;
			this._Datas = new Map<string, MapConfig>();
			let keys = Object.keys(d._Datas);
			for (let index = 0; index < keys.length; index++) {
				var k = keys[index];
				this._Datas.set(k,new MapConfig().init(d._Datas[k]));
			}
			this._Group = new MapTableGroup().init(d._Group);
			return this;
		}

		public Get(id:number) :MapConfig|undefined {
			let k:string = id.toString();
			if (this._Datas.has(k))
				return this._Datas.get(k);
			return undefined;
		}
		public  Get_type(Type:number):MapConfig[] |undefined{
			var cach_key:string = +Type+"_";
			if(this.Type_Cached&& this.Type_Cached.has(cach_key))
				return this.Type_Cached.get(cach_key);
			if (this._Group && this._Group.Type[Type.toString()] ){
				var ids = this._Group.Type[Type.toString()];
				var configs:MapConfig[] = [];
				for (let i = 0; i < ids.length; i++) {
					var id = ids[i];
					var oneItem = this.Get(id);
					 if(oneItem){
						configs.push(oneItem);
					}
				}
				this.Type_Cached.set(cach_key,configs);
				return configs;
			}
			return undefined;
		}
		public data_map_vlookup_1(id:number) : number {
			var table =GetMapTable() ;
			if(table && table._Datas) {
				 var getOne = table._Datas.get(id.toString()); 
				 if( getOne){
					 return getOne.Id 
				}
			}
			return  0;
		}
		public data_map_vlookup_2(id:number) : number {
			var table =GetMapTable() ;
			if(table && table._Datas) {
				 var getOne = table._Datas.get(id.toString()); 
				 if( getOne){
					 return getOne.Type 
				}
			}
			return  0;
		}
		public data_map_vlookup_3(id:number) : number {
			var table =GetMapTable() ;
			if(table && table._Datas) {
				 var getOne = table._Datas.get(id.toString()); 
				 if( getOne){
					 return getOne.Share 
				}
			}
			return  0;
		}
		public data_map_vlookup_6(id:number) : number {
			var table =GetMapTable() ;
			if(table && table._Datas) {
				 var getOne = table._Datas.get(id.toString()); 
				 if( getOne){
					 return getOne.Randomlvmin 
				}
			}
			return  0;
		}
		public data_map_vlookup_7(id:number) : number {
			var table =GetMapTable() ;
			if(table && table._Datas) {
				 var getOne = table._Datas.get(id.toString()); 
				 if( getOne){
					 return getOne.Randomlvmax 
				}
			}
			return  0;
		}
	}
}
