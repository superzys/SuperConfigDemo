/// <reference path="ConfigBase.ts" />
namespace SuperConfig {
	export function GetAllConfig(preUrl:string) {
		return [
			preUrl+'level.json'
			,preUrl+'map.json'
			,preUrl+'worldmap.json'
		 ]
	}
	export function Load() {
		this.LoadLevelTable();
		this.LoadMapTable();
		this.LoadWorldmapTable();
	}
	export function Clear() {
		this.ClearLevelTable();
		this.ClearMapTable();
		this.ClearWorldmapTable();
	}
}
