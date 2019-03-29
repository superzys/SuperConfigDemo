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
		LoadLevelTable();
		LoadMapTable();
		LoadWorldmapTable();
	}
	export function Clear() {
		ClearLevelTable();
		ClearMapTable();
		ClearWorldmapTable();
	}
}
