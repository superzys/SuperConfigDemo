/// <reference path="ConfigBase.ts" />
namespace SuperConfig {
	var  _WorldmapTable:WorldmapTable;
	export function  GetWorldmapTable():WorldmapTable{
		if(_WorldmapTable == null)
 			LoadWorldmapTable();
		return _WorldmapTable;
	}
	export function LoadWorldmapTable(){
		var json = LoadJsonFunc("worldmap.json");
		 _WorldmapTable = new WorldmapTable().init(json);
	}
	export function ClearWorldmapTable () {
		_WorldmapTable = null;
	}
	export class WorldmapTableGroup {
	// public Frommap:Map<string,number[]> ;
		public Frommap:any;
	// public Frommap_tomap:Map<string,Map<string,number[]>> ;
		public Frommap_tomap:any;
	// public Frommap_tomap_fromnpc:Map<string,Map<string,Map<string,number[]>>> ;
		public Frommap_tomap_fromnpc:any;
		init(d){
			this.Frommap=d.Frommap;
			this.Frommap_tomap=d.Frommap_tomap;
			this.Frommap_tomap_fromnpc=d.Frommap_tomap_fromnpc;
			return this;
		}
	}
	export class WorldmapConfig {
		public  Id:number; // 传送ID（唯一不可变）
		public  Frommap:number; // 场景id
		public  Fromnpc:number; // NPCID
		public  Tomap:number; // 传送到的场景id
		public  Tonpc:number; // 目标点NPCID
		init(d){
			this.Id=d.Id; 
			this.Frommap=d.Frommap; 
			this.Fromnpc=d.Fromnpc; 
			this.Tomap=d.Tomap; 
			this.Tonpc=d.Tonpc; 
			 return this;
		}
	}

// 场景.xlsx
	export class WorldmapTable {
		public Name:string;
		public _Datas : Map<string, WorldmapConfig>;
		public _Group:WorldmapTableGroup;
		private Frommap_Cached:Map<string,WorldmapConfig[]>  = new Map<string,WorldmapConfig[]>();
		private Frommap_tomap_Cached:Map<string,WorldmapConfig[]>  = new Map<string,WorldmapConfig[]>();
		private Frommap_tomap_fromnpc_Cached:Map<string,WorldmapConfig[]>  = new Map<string,WorldmapConfig[]>();
		init(d){
			this.Name = d.Name;
			this._Datas = new Map<string, WorldmapConfig>();
			let keys = Object.keys(d._Datas);
			for (let index = 0; index < keys.length; index++) {
				var k = keys[index];
				this._Datas.set(k,new WorldmapConfig().init(d._Datas[k]));
			}
			this._Group = new WorldmapTableGroup().init(d._Group);
			return this;
		}

		public Get(id:number) :WorldmapConfig {
			let k:string = id.toString();
			if (this._Datas.has(k))
				return this._Datas.get(k);
			return null;
		}
		public  Get_frommap(Frommap:number):WorldmapConfig[] {
			var cach_key:string = +Frommap+"_";
			if(this.Frommap_Cached.has(cach_key))
				return this.Frommap_Cached.get(cach_key);
			if (this._Group.Frommap[Frommap.toString()] ){
				var ids = this._Group.Frommap[Frommap.toString()];
				var configs = [];
				for (let i = 0; i < ids.length; i++) {
					var id = ids[i];
					configs.push(this.Get(id));
				}
				this.Frommap_Cached[cach_key]=configs;
					return configs;
				}
				return null;
		}
		public  Get_frommap_tomap(Frommap:number,Tomap:number):WorldmapConfig[] {
			var cach_key:string = +Frommap+"_"+Tomap+"_";
			if(this.Frommap_tomap_Cached.has(cach_key))
				return this.Frommap_tomap_Cached.get(cach_key);
			if (this._Group.Frommap_tomap[Frommap.toString()] ){
				var tmp0 = this._Group.Frommap_tomap[Frommap.toString()];
				if (tmp0[Tomap.toString()] ){
				var ids = tmp0[Tomap.toString()];
				var configs = [];
				for (let i = 0; i < ids.length; i++) {
					var id = ids[i];
					configs.push(this.Get(id));
				}
				this.Frommap_tomap_Cached[cach_key]=configs;
					return configs;
				}
				}
				return null;
		}
		public  Get_frommap_tomap_fromnpc(Frommap:number,Tomap:number,Fromnpc:number):WorldmapConfig[] {
			var cach_key:string = +Frommap+"_"+Tomap+"_"+Fromnpc+"_";
			if(this.Frommap_tomap_fromnpc_Cached.has(cach_key))
				return this.Frommap_tomap_fromnpc_Cached.get(cach_key);
			if (this._Group.Frommap_tomap_fromnpc[Frommap.toString()] ){
				var tmp0 = this._Group.Frommap_tomap_fromnpc[Frommap.toString()];
				if (tmp0[Tomap.toString()] ){
				var tmp1 = tmp0[Tomap.toString()];
				if (tmp1[Fromnpc.toString()] ){
				var ids = tmp1[Fromnpc.toString()];
				var configs = [];
				for (let i = 0; i < ids.length; i++) {
					var id = ids[i];
					configs.push(this.Get(id));
				}
				this.Frommap_tomap_fromnpc_Cached[cach_key]=configs;
					return configs;
				}
				}
				}
				return null;
		}
		public data_worldmap_vlookup_1(id:number) : number {
			return GetWorldmapTable()._Datas.get(id.toString()).Id;
		}
		public data_worldmap_vlookup_2(id:number) : number {
			return GetWorldmapTable()._Datas.get(id.toString()).Frommap;
		}
		public data_worldmap_vlookup_3(id:number) : number {
			return GetWorldmapTable()._Datas.get(id.toString()).Fromnpc;
		}
		public data_worldmap_vlookup_4(id:number) : number {
			return GetWorldmapTable()._Datas.get(id.toString()).Tomap;
		}
		public data_worldmap_vlookup_5(id:number) : number {
			return GetWorldmapTable()._Datas.get(id.toString()).Tonpc;
		}
	}
}
