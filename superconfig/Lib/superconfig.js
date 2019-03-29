"use strict";
/**
 * * 配置表模块撒!放进项目里面撒.
 */
var SuperConfig;
(function (SuperConfig) {
    class FormulaSheetTemplate {
        constructor() {
            this.datas = new Map();
            this.relation = new Map();
            this.funcs = new Map();
        }
    }
    SuperConfig.FormulaSheetTemplate = FormulaSheetTemplate;
    class FormulaSheet extends FormulaSheetTemplate {
        constructor() {
            super(...arguments);
            this.name = "";
            this.newdatas = new Map();
        }
        get(key) {
            if (this.newdatas.has(key)) {
                return this.newdatas.get(key);
            }
            if (this.datas.has(key)) {
                return this.datas.get(key);
            }
            if (this.funcs.has(key)) {
                var getFun = this.funcs.get(key);
                if (getFun) {
                    var v = getFun(this);
                    this.newdatas.set(key, v);
                    return v;
                }
                return 0;
            }
            console.error("no value in sheet " +
                name +
                " with key = " +
                key +
                " 请检查是否Config.NewXXX来构造算法对象");
            return 0;
        }
        set(key, val) {
            if (this.newdatas.has(key)) {
                if (this.newdatas.get(key) == val)
                    return;
            }
            this.newdatas.set(key, val);
            if (this.relation.has(key)) {
                var list = this.relation.get(key);
                if (list) {
                    list.forEach((v, index) => {
                        if (this.newdatas.has(v)) {
                            this.newdatas.delete(v);
                        }
                    });
                }
            }
        }
        excelIf(a, b, c) {
            if (c > 0)
                return a;
            return b;
        }
        excelCompare(a) {
            if (a)
                return 1;
            return -1;
        }
        excelPow(a, b) {
            return Math.pow(a, b);
        }
        excelMod(a, b) {
            return a % b;
        }
        // FormulaSheet.factcache.set(1,1);
        excelFact(a) {
            if (FormulaSheet.factmax == 0) {
                FormulaSheet.factmax = 1;
                FormulaSheet.factcache.set(1, 1);
            }
            // var n = a.toFixed(0)
            var n = Math.floor(a);
            if (n < 0)
                return 0;
            if (n <= FormulaSheet.factmax) {
                return FormulaSheet.factcache.get(n);
            }
            for (let index = FormulaSheet.factmax + 1; index <= n; index++) {
                var oldVal = FormulaSheet.factcache.get(index - 1);
                if (oldVal) {
                    var val = oldVal * index;
                    FormulaSheet.factcache.set(index, val);
                }
            }
            FormulaSheet.factmax = n;
            return FormulaSheet.factcache.get(n);
        }
        excelRound(a, b) {
            var d = Math.pow(10, b);
            return Math.floor((a * b + 0.5) / d);
        }
        excelRoundDown(a, b) {
            var d = Math.pow(10, b);
            return Math.floor((a * d) / d);
        }
        excelRoundUp(a, b) {
            var d = Math.pow(10, b);
            return Math.ceil(a * d) / d;
        }
        excelMax(...args) {
            if (args.length == 0)
                return 0;
            var ret = args[0];
            args.forEach(v => {
                ret = Math.max(ret, v);
            });
            return ret;
        }
        excelMin(...args) {
            if (args.length == 0)
                return 0;
            var ret = args[0];
            args.forEach(v => {
                ret = Math.min(ret, v);
            });
            return ret;
        }
    }
    FormulaSheet.factcache = new Map();
    // private static factcache:{[id:number]:number}={1:1};
    FormulaSheet.factmax = 0;
    SuperConfig.FormulaSheet = FormulaSheet;
})(SuperConfig || (SuperConfig = {}));
/// <reference path="ConfigBase.ts" />
var SuperConfig;
(function (SuperConfig) {
    var _LevelTable;
    function GetLevelTable() {
        if (_LevelTable == undefined)
            LoadLevelTable();
        return _LevelTable;
    }
    SuperConfig.GetLevelTable = GetLevelTable;
    function LoadLevelTable() {
        var json = SuperConfig.LoadJsonFunc("level.json");
        _LevelTable = new LevelTable().init(json);
    }
    SuperConfig.LoadLevelTable = LoadLevelTable;
    function ClearLevelTable() {
        _LevelTable = undefined;
    }
    SuperConfig.ClearLevelTable = ClearLevelTable;
    class LevelTableGroup {
        init(d) {
            this.Maxexp = d.Maxexp;
            this.Maxexp_maxhp = d.Maxexp_maxhp;
            return this;
        }
    }
    SuperConfig.LevelTableGroup = LevelTableGroup;
    class LevelConfig {
        constructor() {
            this.Level = 0; // 等级
            this.Maxexp = 0; // 升级经验
            this.Maxhp = 0; // 最大血量
            this.Txt = ""; // 测试文本
            this.Double = 0; // 测试double
            this.Aaa = 0; // 测试
        }
        init(d) {
            this.Level = d.Level;
            this.Maxexp = d.Maxexp;
            this.Maxhp = d.Maxhp;
            this.Txt = d.Txt;
            this.Double = d.Double;
            this.Aaa = d.Aaa;
            return this;
        }
    }
    SuperConfig.LevelConfig = LevelConfig;
    // 等级.xlsx
    class LevelTable {
        constructor() {
            this.Name = "";
            this._Datas = new Map();
            this.Maxexp_Cached = new Map();
            this.Maxexp_maxhp_Cached = new Map();
        }
        init(d) {
            this.Name = d.Name;
            this._Datas = new Map();
            let keys = Object.keys(d._Datas);
            for (let index = 0; index < keys.length; index++) {
                var k = keys[index];
                this._Datas.set(k, new LevelConfig().init(d._Datas[k]));
            }
            this._Group = new LevelTableGroup().init(d._Group);
            return this;
        }
        Get(id) {
            let k = id.toString();
            if (this._Datas.has(k))
                return this._Datas.get(k);
            return undefined;
        }
        Get_maxexp(Maxexp) {
            var cach_key = +Maxexp + "_";
            if (this.Maxexp_Cached && this.Maxexp_Cached.has(cach_key))
                return this.Maxexp_Cached.get(cach_key);
            if (this._Group && this._Group.Maxexp[Maxexp.toString()]) {
                var ids = this._Group.Maxexp[Maxexp.toString()];
                var configs = [];
                for (let i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    var oneItem = this.Get(id);
                    if (oneItem) {
                        configs.push(oneItem);
                    }
                }
                this.Maxexp_Cached.set(cach_key, configs);
                return configs;
            }
            return undefined;
        }
        Get_maxexp_maxhp(Maxexp, Maxhp) {
            var cach_key = +Maxexp + "_" + Maxhp + "_";
            if (this.Maxexp_maxhp_Cached && this.Maxexp_maxhp_Cached.has(cach_key))
                return this.Maxexp_maxhp_Cached.get(cach_key);
            if (this._Group && this._Group.Maxexp_maxhp[Maxexp.toString()]) {
                var tmp0 = this._Group.Maxexp_maxhp[Maxexp.toString()];
                if (tmp0[Maxhp.toString()]) {
                    var ids = tmp0[Maxhp.toString()];
                    var configs = [];
                    for (let i = 0; i < ids.length; i++) {
                        var id = ids[i];
                        var oneItem = this.Get(id);
                        if (oneItem) {
                            configs.push(oneItem);
                        }
                    }
                    this.Maxexp_maxhp_Cached.set(cach_key, configs);
                    return configs;
                }
            }
            return undefined;
        }
        data_level_vlookup_1(id) {
            var table = GetLevelTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Level;
                }
            }
            return 0;
        }
        data_level_vlookup_2(id) {
            var table = GetLevelTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Maxexp;
                }
            }
            return 0;
        }
        data_level_vlookup_3(id) {
            var table = GetLevelTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Maxhp;
                }
            }
            return 0;
        }
        data_level_vlookup_5(id) {
            var table = GetLevelTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Double;
                }
            }
            return 0;
        }
        data_level_vlookup_6(id) {
            var table = GetLevelTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Aaa;
                }
            }
            return 0;
        }
    }
    SuperConfig.LevelTable = LevelTable;
})(SuperConfig || (SuperConfig = {}));
/// <reference path="ConfigBase.ts" />
var SuperConfig;
(function (SuperConfig) {
    var _MapTable;
    function GetMapTable() {
        if (_MapTable == undefined)
            LoadMapTable();
        return _MapTable;
    }
    SuperConfig.GetMapTable = GetMapTable;
    function LoadMapTable() {
        var json = SuperConfig.LoadJsonFunc("map.json");
        _MapTable = new MapTable().init(json);
    }
    SuperConfig.LoadMapTable = LoadMapTable;
    function ClearMapTable() {
        _MapTable = undefined;
    }
    SuperConfig.ClearMapTable = ClearMapTable;
    class MapTableGroup {
        init(d) {
            this.Type = d.Type;
            return this;
        }
    }
    SuperConfig.MapTableGroup = MapTableGroup;
    class MapConfig {
        constructor() {
            this.Id = 0; // 地图ID（不能改）
            this.Type = 0; // 类型 1=世界场景 2=副本场景
            this.Share = 0; // 场景复用   1复用
            this.Res = ""; // 资源名
            this.Name = ""; // 场景名字
            this.Randomlvmin = 0; // 可随机玩家最小等级
            this.Randomlvmax = 0; // 随机最大等级
        }
        init(d) {
            this.Id = d.Id;
            this.Type = d.Type;
            this.Share = d.Share;
            this.Res = d.Res;
            this.Name = d.Name;
            this.Randomlvmin = d.Randomlvmin;
            this.Randomlvmax = d.Randomlvmax;
            return this;
        }
    }
    SuperConfig.MapConfig = MapConfig;
    // 场景.xlsx
    class MapTable {
        constructor() {
            this.Name = "";
            this._Datas = new Map();
            this.Type_Cached = new Map();
        }
        init(d) {
            this.Name = d.Name;
            this._Datas = new Map();
            let keys = Object.keys(d._Datas);
            for (let index = 0; index < keys.length; index++) {
                var k = keys[index];
                this._Datas.set(k, new MapConfig().init(d._Datas[k]));
            }
            this._Group = new MapTableGroup().init(d._Group);
            return this;
        }
        Get(id) {
            let k = id.toString();
            if (this._Datas.has(k))
                return this._Datas.get(k);
            return undefined;
        }
        Get_type(Type) {
            var cach_key = +Type + "_";
            if (this.Type_Cached && this.Type_Cached.has(cach_key))
                return this.Type_Cached.get(cach_key);
            if (this._Group && this._Group.Type[Type.toString()]) {
                var ids = this._Group.Type[Type.toString()];
                var configs = [];
                for (let i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    var oneItem = this.Get(id);
                    if (oneItem) {
                        configs.push(oneItem);
                    }
                }
                this.Type_Cached.set(cach_key, configs);
                return configs;
            }
            return undefined;
        }
        data_map_vlookup_1(id) {
            var table = GetMapTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Id;
                }
            }
            return 0;
        }
        data_map_vlookup_2(id) {
            var table = GetMapTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Type;
                }
            }
            return 0;
        }
        data_map_vlookup_3(id) {
            var table = GetMapTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Share;
                }
            }
            return 0;
        }
        data_map_vlookup_6(id) {
            var table = GetMapTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Randomlvmin;
                }
            }
            return 0;
        }
        data_map_vlookup_7(id) {
            var table = GetMapTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Randomlvmax;
                }
            }
            return 0;
        }
    }
    SuperConfig.MapTable = MapTable;
})(SuperConfig || (SuperConfig = {}));
/// <reference path="ConfigBase.ts" />
var SuperConfig;
(function (SuperConfig) {
    var _WorldmapTable;
    function GetWorldmapTable() {
        if (_WorldmapTable == undefined)
            LoadWorldmapTable();
        return _WorldmapTable;
    }
    SuperConfig.GetWorldmapTable = GetWorldmapTable;
    function LoadWorldmapTable() {
        var json = SuperConfig.LoadJsonFunc("worldmap.json");
        _WorldmapTable = new WorldmapTable().init(json);
    }
    SuperConfig.LoadWorldmapTable = LoadWorldmapTable;
    function ClearWorldmapTable() {
        _WorldmapTable = undefined;
    }
    SuperConfig.ClearWorldmapTable = ClearWorldmapTable;
    class WorldmapTableGroup {
        init(d) {
            this.Frommap = d.Frommap;
            this.Frommap_tomap = d.Frommap_tomap;
            this.Frommap_tomap_fromnpc = d.Frommap_tomap_fromnpc;
            return this;
        }
    }
    SuperConfig.WorldmapTableGroup = WorldmapTableGroup;
    class WorldmapConfig {
        constructor() {
            this.Id = 0; // 传送ID（唯一不可变）
            this.Frommap = 0; // 场景id
            this.Fromnpc = 0; // NPCID
            this.Tomap = 0; // 传送到的场景id
            this.Tonpc = 0; // 目标点NPCID
        }
        init(d) {
            this.Id = d.Id;
            this.Frommap = d.Frommap;
            this.Fromnpc = d.Fromnpc;
            this.Tomap = d.Tomap;
            this.Tonpc = d.Tonpc;
            return this;
        }
    }
    SuperConfig.WorldmapConfig = WorldmapConfig;
    // 场景.xlsx
    class WorldmapTable {
        constructor() {
            this.Name = "";
            this._Datas = new Map();
            this.Frommap_Cached = new Map();
            this.Frommap_tomap_Cached = new Map();
            this.Frommap_tomap_fromnpc_Cached = new Map();
        }
        init(d) {
            this.Name = d.Name;
            this._Datas = new Map();
            let keys = Object.keys(d._Datas);
            for (let index = 0; index < keys.length; index++) {
                var k = keys[index];
                this._Datas.set(k, new WorldmapConfig().init(d._Datas[k]));
            }
            this._Group = new WorldmapTableGroup().init(d._Group);
            return this;
        }
        Get(id) {
            let k = id.toString();
            if (this._Datas.has(k))
                return this._Datas.get(k);
            return undefined;
        }
        Get_frommap(Frommap) {
            var cach_key = +Frommap + "_";
            if (this.Frommap_Cached && this.Frommap_Cached.has(cach_key))
                return this.Frommap_Cached.get(cach_key);
            if (this._Group && this._Group.Frommap[Frommap.toString()]) {
                var ids = this._Group.Frommap[Frommap.toString()];
                var configs = [];
                for (let i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    var oneItem = this.Get(id);
                    if (oneItem) {
                        configs.push(oneItem);
                    }
                }
                this.Frommap_Cached.set(cach_key, configs);
                return configs;
            }
            return undefined;
        }
        Get_frommap_tomap(Frommap, Tomap) {
            var cach_key = +Frommap + "_" + Tomap + "_";
            if (this.Frommap_tomap_Cached && this.Frommap_tomap_Cached.has(cach_key))
                return this.Frommap_tomap_Cached.get(cach_key);
            if (this._Group && this._Group.Frommap_tomap[Frommap.toString()]) {
                var tmp0 = this._Group.Frommap_tomap[Frommap.toString()];
                if (tmp0[Tomap.toString()]) {
                    var ids = tmp0[Tomap.toString()];
                    var configs = [];
                    for (let i = 0; i < ids.length; i++) {
                        var id = ids[i];
                        var oneItem = this.Get(id);
                        if (oneItem) {
                            configs.push(oneItem);
                        }
                    }
                    this.Frommap_tomap_Cached.set(cach_key, configs);
                    return configs;
                }
            }
            return undefined;
        }
        Get_frommap_tomap_fromnpc(Frommap, Tomap, Fromnpc) {
            var cach_key = +Frommap + "_" + Tomap + "_" + Fromnpc + "_";
            if (this.Frommap_tomap_fromnpc_Cached && this.Frommap_tomap_fromnpc_Cached.has(cach_key))
                return this.Frommap_tomap_fromnpc_Cached.get(cach_key);
            if (this._Group && this._Group.Frommap_tomap_fromnpc[Frommap.toString()]) {
                var tmp0 = this._Group.Frommap_tomap_fromnpc[Frommap.toString()];
                if (tmp0[Tomap.toString()]) {
                    var tmp1 = tmp0[Tomap.toString()];
                    if (tmp1[Fromnpc.toString()]) {
                        var ids = tmp1[Fromnpc.toString()];
                        var configs = [];
                        for (let i = 0; i < ids.length; i++) {
                            var id = ids[i];
                            var oneItem = this.Get(id);
                            if (oneItem) {
                                configs.push(oneItem);
                            }
                        }
                        this.Frommap_tomap_fromnpc_Cached.set(cach_key, configs);
                        return configs;
                    }
                }
            }
            return undefined;
        }
        data_worldmap_vlookup_1(id) {
            var table = GetWorldmapTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Id;
                }
            }
            return 0;
        }
        data_worldmap_vlookup_2(id) {
            var table = GetWorldmapTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Frommap;
                }
            }
            return 0;
        }
        data_worldmap_vlookup_3(id) {
            var table = GetWorldmapTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Fromnpc;
                }
            }
            return 0;
        }
        data_worldmap_vlookup_4(id) {
            var table = GetWorldmapTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Tomap;
                }
            }
            return 0;
        }
        data_worldmap_vlookup_5(id) {
            var table = GetWorldmapTable();
            if (table && table._Datas) {
                var getOne = table._Datas.get(id.toString());
                if (getOne) {
                    return getOne.Tonpc;
                }
            }
            return 0;
        }
    }
    SuperConfig.WorldmapTable = WorldmapTable;
})(SuperConfig || (SuperConfig = {}));
/// <reference path="ConfigBase.ts" />
var SuperConfig;
(function (SuperConfig) {
    function NewHeroFormulaSheet() {
        var formula = new HeroFormulaSheet();
        formula.Init();
        return formula;
    }
    SuperConfig.NewHeroFormulaSheet = NewHeroFormulaSheet;
    class HeroFormulaSheet extends SuperConfig.FormulaSheet {
        Init() {
            this.datas.set(1003, 20);
            this.funcs.set(1006, (ins) => {
                var tab = SuperConfig.GetLevelTable();
                if (tab) {
                    return (tab.data_level_vlookup_3(ins.get(1 * 1000 + 3)) + ins.get(2 * 1000 + 8));
                }
            });
            this.datas.set(2003, 5);
            this.funcs.set(2008, (ins) => {
                return ins.excelFact(ins.get(2 * 1000 + 3));
            });
            this.relation.set(1003, [1006]);
            this.relation.set(2008, [1006]);
            this.relation.set(2003, [2008, 1006]);
        } // 初始化数据结束
        GetLevel() {
            return this.get(1003);
        }
        SetLevel(v) {
            this.set(1003, v);
        }
        GetRatio() {
            return this.get(2003);
        }
        SetRatio(v) {
            this.set(2003, v);
        }
        GetMaxhp() {
            return this.get(1006);
        }
    }
    SuperConfig.HeroFormulaSheet = HeroFormulaSheet;
})(SuperConfig || (SuperConfig = {}));
/// <reference path="ConfigBase.ts" />
var SuperConfig;
(function (SuperConfig) {
    function NewPlayerFormulaSheet() {
        var formula = new PlayerFormulaSheet();
        formula.Init();
        return formula;
    }
    SuperConfig.NewPlayerFormulaSheet = NewPlayerFormulaSheet;
    class PlayerFormulaSheet extends SuperConfig.FormulaSheet {
        Init() {
            this.datas.set(1003, 10);
            this.funcs.set(1006, (ins) => {
                return (ins.get(1 * 1000 + 3) * 999);
            });
            this.relation.set(1003, [1006]);
        } // 初始化数据结束
        GetLevel() {
            return this.get(1003);
        }
        SetLevel(v) {
            this.set(1003, v);
        }
        GetLevelupexp() {
            return this.get(1006);
        }
    }
    SuperConfig.PlayerFormulaSheet = PlayerFormulaSheet;
})(SuperConfig || (SuperConfig = {}));
/// <reference path="ConfigBase.ts" />
var SuperConfig;
(function (SuperConfig) {
    function GetAllConfig(preUrl) {
        return [
            preUrl + 'level.json',
            preUrl + 'map.json',
            preUrl + 'worldmap.json'
        ];
    }
    SuperConfig.GetAllConfig = GetAllConfig;
    function Load() {
        SuperConfig.LoadLevelTable();
        SuperConfig.LoadMapTable();
        SuperConfig.LoadWorldmapTable();
    }
    SuperConfig.Load = Load;
    function Clear() {
        SuperConfig.ClearLevelTable();
        SuperConfig.ClearMapTable();
        SuperConfig.ClearWorldmapTable();
    }
    SuperConfig.Clear = Clear;
})(SuperConfig || (SuperConfig = {}));
