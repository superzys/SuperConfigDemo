var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * * 配置表模块撒!放进项目里面撒.
 */
var SuperConfig;
(function (SuperConfig) {
    // * 加载json的接口委托，由引擎设置
    SuperConfig.LoadJsonFunc = null;
    var FormulaSheetTemplate = /** @class */ (function () {
        function FormulaSheetTemplate() {
            this.datas = new Map();
            this.relation = new Map();
            this.funcs = new Map();
        }
        return FormulaSheetTemplate;
    }());
    SuperConfig.FormulaSheetTemplate = FormulaSheetTemplate;
    var FormulaSheet = /** @class */ (function (_super) {
        __extends(FormulaSheet, _super);
        function FormulaSheet() {
            var _this = _super.apply(this, arguments) || this;
            _this.newdatas = new Map();
            return _this;
        }
        FormulaSheet.prototype.get = function (key) {
            if (this.newdatas.has(key)) {
                return this.newdatas.get(key);
            }
            if (this.datas.has(key)) {
                return this.datas.get(key);
            }
            if (this.funcs.has(key)) {
                var v = this.funcs.get(key)(this);
                this.newdatas.set(key, v);
                return v;
            }
            console.error("no value in sheet " +
                name +
                " with key = " +
                key +
                " 请检查是否Config.NewXXX来构造算法对象");
            return 0;
        };
        FormulaSheet.prototype.set = function (key, val) {
            var _this = this;
            if (this.newdatas.has(key)) {
                if (this.newdatas.get(key) == val)
                    return;
            }
            this.newdatas.set(key, val);
            if (this.relation.has(key)) {
                var list = this.relation.get(key);
                list.forEach(function (v, index) {
                    if (_this.newdatas.has(v)) {
                        _this.newdatas.delete(v);
                    }
                });
            }
        };
        FormulaSheet.prototype.excelIf = function (a, b, c) {
            if (c > 0)
                return a;
            return b;
        };
        FormulaSheet.prototype.excelCompare = function (a) {
            if (a)
                return 1;
            return -1;
        };
        FormulaSheet.prototype.excelPow = function (a, b) {
            return Math.pow(a, b);
        };
        FormulaSheet.prototype.excelMod = function (a, b) {
            return a % b;
        };
        // FormulaSheet.factcache.set(1,1);
        FormulaSheet.prototype.excelFact = function (a) {
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
            for (var index = FormulaSheet.factmax + 1; index <= n; index++) {
                var val = FormulaSheet.factcache.get(index - 1) * index;
                FormulaSheet.factcache.set(index, val);
            }
            FormulaSheet.factmax = n;
            return FormulaSheet.factcache.get(n);
        };
        FormulaSheet.prototype.excelRound = function (a, b) {
            var d = Math.pow(10, b);
            return Math.floor((a * b + 0.5) / d);
        };
        FormulaSheet.prototype.excelRoundDown = function (a, b) {
            var d = Math.pow(10, b);
            return Math.floor((a * d) / d);
        };
        FormulaSheet.prototype.excelRoundUp = function (a, b) {
            var d = Math.pow(10, b);
            return Math.ceil(a * d) / d;
        };
        FormulaSheet.prototype.excelMax = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length == 0)
                return 0;
            var ret = args[0];
            args.forEach(function (v) {
                ret = Math.max(ret, v);
            });
            return ret;
        };
        FormulaSheet.prototype.excelMin = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length == 0)
                return 0;
            var ret = args[0];
            args.forEach(function (v) {
                ret = Math.min(ret, v);
            });
            return ret;
        };
        return FormulaSheet;
    }(FormulaSheetTemplate));
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
        if (_LevelTable == null)
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
        _LevelTable = null;
    }
    SuperConfig.ClearLevelTable = ClearLevelTable;
    var LevelTableGroup = /** @class */ (function () {
        function LevelTableGroup() {
        }
        LevelTableGroup.prototype.init = function (d) {
            this.Maxexp = d.Maxexp;
            this.Maxexp_maxhp = d.Maxexp_maxhp;
            return this;
        };
        return LevelTableGroup;
    }());
    SuperConfig.LevelTableGroup = LevelTableGroup;
    var LevelConfig = /** @class */ (function () {
        function LevelConfig() {
        }
        LevelConfig.prototype.init = function (d) {
            this.Level = d.Level;
            this.Maxexp = d.Maxexp;
            this.Maxhp = d.Maxhp;
            this.Txt = d.Txt;
            this.Double = d.Double;
            this.Aaa = d.Aaa;
            return this;
        };
        return LevelConfig;
    }());
    SuperConfig.LevelConfig = LevelConfig;
    // 等级.xlsx
    var LevelTable = /** @class */ (function () {
        function LevelTable() {
            this.Maxexp_Cached = new Map();
            this.Maxexp_maxhp_Cached = new Map();
        }
        LevelTable.prototype.init = function (d) {
            this.Name = d.Name;
            this._Datas = new Map();
            var keys = Object.keys(d._Datas);
            for (var index = 0; index < keys.length; index++) {
                var k = keys[index];
                this._Datas.set(k, new LevelConfig().init(d._Datas[k]));
            }
            this._Group = new LevelTableGroup().init(d._Group);
            return this;
        };
        LevelTable.prototype.Get = function (id) {
            var k = id.toString();
            if (this._Datas.has(k))
                return this._Datas.get(k);
            return null;
        };
        LevelTable.prototype.Get_maxexp = function (Maxexp) {
            var cach_key = +Maxexp + "_";
            if (this.Maxexp_Cached.has(cach_key))
                return this.Maxexp_Cached.get(cach_key);
            if (this._Group.Maxexp[Maxexp.toString()]) {
                var ids = this._Group.Maxexp[Maxexp.toString()];
                var configs = [];
                for (var i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    configs.push(this.Get(id));
                }
                this.Maxexp_Cached[cach_key] = configs;
                return configs;
            }
            return null;
        };
        LevelTable.prototype.Get_maxexp_maxhp = function (Maxexp, Maxhp) {
            var cach_key = +Maxexp + "_" + Maxhp + "_";
            if (this.Maxexp_maxhp_Cached.has(cach_key))
                return this.Maxexp_maxhp_Cached.get(cach_key);
            if (this._Group.Maxexp_maxhp[Maxexp.toString()]) {
                var tmp0 = this._Group.Maxexp_maxhp[Maxexp.toString()];
                if (tmp0[Maxhp.toString()]) {
                    var ids = tmp0[Maxhp.toString()];
                    var configs = [];
                    for (var i = 0; i < ids.length; i++) {
                        var id = ids[i];
                        configs.push(this.Get(id));
                    }
                    this.Maxexp_maxhp_Cached[cach_key] = configs;
                    return configs;
                }
            }
            return null;
        };
        LevelTable.prototype.data_level_vlookup_1 = function (id) {
            return GetLevelTable()._Datas.get(id.toString()).Level;
        };
        LevelTable.prototype.data_level_vlookup_2 = function (id) {
            return GetLevelTable()._Datas.get(id.toString()).Maxexp;
        };
        LevelTable.prototype.data_level_vlookup_3 = function (id) {
            return GetLevelTable()._Datas.get(id.toString()).Maxhp;
        };
        LevelTable.prototype.data_level_vlookup_5 = function (id) {
            return GetLevelTable()._Datas.get(id.toString()).Double;
        };
        LevelTable.prototype.data_level_vlookup_6 = function (id) {
            return GetLevelTable()._Datas.get(id.toString()).Aaa;
        };
        return LevelTable;
    }());
    SuperConfig.LevelTable = LevelTable;
})(SuperConfig || (SuperConfig = {}));
/// <reference path="ConfigBase.ts" />
var SuperConfig;
(function (SuperConfig) {
    var _MapTable;
    function GetMapTable() {
        if (_MapTable == null)
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
        _MapTable = null;
    }
    SuperConfig.ClearMapTable = ClearMapTable;
    var MapTableGroup = /** @class */ (function () {
        function MapTableGroup() {
        }
        MapTableGroup.prototype.init = function (d) {
            this.Type = d.Type;
            return this;
        };
        return MapTableGroup;
    }());
    SuperConfig.MapTableGroup = MapTableGroup;
    var MapConfig = /** @class */ (function () {
        function MapConfig() {
        }
        MapConfig.prototype.init = function (d) {
            this.Id = d.Id;
            this.Type = d.Type;
            this.Share = d.Share;
            this.Res = d.Res;
            this.Name = d.Name;
            this.Randomlvmin = d.Randomlvmin;
            this.Randomlvmax = d.Randomlvmax;
            return this;
        };
        return MapConfig;
    }());
    SuperConfig.MapConfig = MapConfig;
    // 场景.xlsx
    var MapTable = /** @class */ (function () {
        function MapTable() {
            this.Type_Cached = new Map();
        }
        MapTable.prototype.init = function (d) {
            this.Name = d.Name;
            this._Datas = new Map();
            var keys = Object.keys(d._Datas);
            for (var index = 0; index < keys.length; index++) {
                var k = keys[index];
                this._Datas.set(k, new MapConfig().init(d._Datas[k]));
            }
            this._Group = new MapTableGroup().init(d._Group);
            return this;
        };
        MapTable.prototype.Get = function (id) {
            var k = id.toString();
            if (this._Datas.has(k))
                return this._Datas.get(k);
            return null;
        };
        MapTable.prototype.Get_type = function (Type) {
            var cach_key = +Type + "_";
            if (this.Type_Cached.has(cach_key))
                return this.Type_Cached.get(cach_key);
            if (this._Group.Type[Type.toString()]) {
                var ids = this._Group.Type[Type.toString()];
                var configs = [];
                for (var i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    configs.push(this.Get(id));
                }
                this.Type_Cached[cach_key] = configs;
                return configs;
            }
            return null;
        };
        MapTable.prototype.data_map_vlookup_1 = function (id) {
            return GetMapTable()._Datas.get(id.toString()).Id;
        };
        MapTable.prototype.data_map_vlookup_2 = function (id) {
            return GetMapTable()._Datas.get(id.toString()).Type;
        };
        MapTable.prototype.data_map_vlookup_3 = function (id) {
            return GetMapTable()._Datas.get(id.toString()).Share;
        };
        MapTable.prototype.data_map_vlookup_6 = function (id) {
            return GetMapTable()._Datas.get(id.toString()).Randomlvmin;
        };
        MapTable.prototype.data_map_vlookup_7 = function (id) {
            return GetMapTable()._Datas.get(id.toString()).Randomlvmax;
        };
        return MapTable;
    }());
    SuperConfig.MapTable = MapTable;
})(SuperConfig || (SuperConfig = {}));
/// <reference path="ConfigBase.ts" />
var SuperConfig;
(function (SuperConfig) {
    var _WorldmapTable;
    function GetWorldmapTable() {
        if (_WorldmapTable == null)
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
        _WorldmapTable = null;
    }
    SuperConfig.ClearWorldmapTable = ClearWorldmapTable;
    var WorldmapTableGroup = /** @class */ (function () {
        function WorldmapTableGroup() {
        }
        WorldmapTableGroup.prototype.init = function (d) {
            this.Frommap = d.Frommap;
            this.Frommap_tomap = d.Frommap_tomap;
            this.Frommap_tomap_fromnpc = d.Frommap_tomap_fromnpc;
            return this;
        };
        return WorldmapTableGroup;
    }());
    SuperConfig.WorldmapTableGroup = WorldmapTableGroup;
    var WorldmapConfig = /** @class */ (function () {
        function WorldmapConfig() {
        }
        WorldmapConfig.prototype.init = function (d) {
            this.Id = d.Id;
            this.Frommap = d.Frommap;
            this.Fromnpc = d.Fromnpc;
            this.Tomap = d.Tomap;
            this.Tonpc = d.Tonpc;
            return this;
        };
        return WorldmapConfig;
    }());
    SuperConfig.WorldmapConfig = WorldmapConfig;
    // 场景.xlsx
    var WorldmapTable = /** @class */ (function () {
        function WorldmapTable() {
            this.Frommap_Cached = new Map();
            this.Frommap_tomap_Cached = new Map();
            this.Frommap_tomap_fromnpc_Cached = new Map();
        }
        WorldmapTable.prototype.init = function (d) {
            this.Name = d.Name;
            this._Datas = new Map();
            var keys = Object.keys(d._Datas);
            for (var index = 0; index < keys.length; index++) {
                var k = keys[index];
                this._Datas.set(k, new WorldmapConfig().init(d._Datas[k]));
            }
            this._Group = new WorldmapTableGroup().init(d._Group);
            return this;
        };
        WorldmapTable.prototype.Get = function (id) {
            var k = id.toString();
            if (this._Datas.has(k))
                return this._Datas.get(k);
            return null;
        };
        WorldmapTable.prototype.Get_frommap = function (Frommap) {
            var cach_key = +Frommap + "_";
            if (this.Frommap_Cached.has(cach_key))
                return this.Frommap_Cached.get(cach_key);
            if (this._Group.Frommap[Frommap.toString()]) {
                var ids = this._Group.Frommap[Frommap.toString()];
                var configs = [];
                for (var i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    configs.push(this.Get(id));
                }
                this.Frommap_Cached[cach_key] = configs;
                return configs;
            }
            return null;
        };
        WorldmapTable.prototype.Get_frommap_tomap = function (Frommap, Tomap) {
            var cach_key = +Frommap + "_" + Tomap + "_";
            if (this.Frommap_tomap_Cached.has(cach_key))
                return this.Frommap_tomap_Cached.get(cach_key);
            if (this._Group.Frommap_tomap[Frommap.toString()]) {
                var tmp0 = this._Group.Frommap_tomap[Frommap.toString()];
                if (tmp0[Tomap.toString()]) {
                    var ids = tmp0[Tomap.toString()];
                    var configs = [];
                    for (var i = 0; i < ids.length; i++) {
                        var id = ids[i];
                        configs.push(this.Get(id));
                    }
                    this.Frommap_tomap_Cached[cach_key] = configs;
                    return configs;
                }
            }
            return null;
        };
        WorldmapTable.prototype.Get_frommap_tomap_fromnpc = function (Frommap, Tomap, Fromnpc) {
            var cach_key = +Frommap + "_" + Tomap + "_" + Fromnpc + "_";
            if (this.Frommap_tomap_fromnpc_Cached.has(cach_key))
                return this.Frommap_tomap_fromnpc_Cached.get(cach_key);
            if (this._Group.Frommap_tomap_fromnpc[Frommap.toString()]) {
                var tmp0 = this._Group.Frommap_tomap_fromnpc[Frommap.toString()];
                if (tmp0[Tomap.toString()]) {
                    var tmp1 = tmp0[Tomap.toString()];
                    if (tmp1[Fromnpc.toString()]) {
                        var ids = tmp1[Fromnpc.toString()];
                        var configs = [];
                        for (var i = 0; i < ids.length; i++) {
                            var id = ids[i];
                            configs.push(this.Get(id));
                        }
                        this.Frommap_tomap_fromnpc_Cached[cach_key] = configs;
                        return configs;
                    }
                }
            }
            return null;
        };
        WorldmapTable.prototype.data_worldmap_vlookup_1 = function (id) {
            return GetWorldmapTable()._Datas.get(id.toString()).Id;
        };
        WorldmapTable.prototype.data_worldmap_vlookup_2 = function (id) {
            return GetWorldmapTable()._Datas.get(id.toString()).Frommap;
        };
        WorldmapTable.prototype.data_worldmap_vlookup_3 = function (id) {
            return GetWorldmapTable()._Datas.get(id.toString()).Fromnpc;
        };
        WorldmapTable.prototype.data_worldmap_vlookup_4 = function (id) {
            return GetWorldmapTable()._Datas.get(id.toString()).Tomap;
        };
        WorldmapTable.prototype.data_worldmap_vlookup_5 = function (id) {
            return GetWorldmapTable()._Datas.get(id.toString()).Tonpc;
        };
        return WorldmapTable;
    }());
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
    var HeroFormulaSheet = /** @class */ (function (_super) {
        __extends(HeroFormulaSheet, _super);
        function HeroFormulaSheet() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HeroFormulaSheet.prototype.Init = function () {
            this.datas.set(1003, 20);
            this.funcs.set(1006, function (ins) {
                return (SuperConfig.GetLevelTable().data_level_vlookup_3(ins.get(1 * 1000 + 3)) + ins.get(2 * 1000 + 8));
            });
            this.datas.set(2003, 5);
            this.funcs.set(2008, function (ins) {
                return ins.excelFact(ins.get(2 * 1000 + 3));
            });
            this.relation.set(1003, [1006]);
            this.relation.set(2008, [1006]);
            this.relation.set(2003, [2008, 1006]);
        }; // 初始化数据结束
        HeroFormulaSheet.prototype.GetLevel = function () {
            return this.get(1003);
        };
        HeroFormulaSheet.prototype.SetLevel = function (v) {
            this.set(1003, v);
        };
        HeroFormulaSheet.prototype.GetRatio = function () {
            return this.get(2003);
        };
        HeroFormulaSheet.prototype.SetRatio = function (v) {
            this.set(2003, v);
        };
        HeroFormulaSheet.prototype.GetMaxhp = function () {
            return this.get(1006);
        };
        return HeroFormulaSheet;
    }(SuperConfig.FormulaSheet));
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
    var PlayerFormulaSheet = /** @class */ (function (_super) {
        __extends(PlayerFormulaSheet, _super);
        function PlayerFormulaSheet() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PlayerFormulaSheet.prototype.Init = function () {
            this.datas.set(1003, 10);
            this.funcs.set(1006, function (ins) {
                return (ins.get(1 * 1000 + 3) * 999);
            });
            this.relation.set(1003, [1006]);
        }; // 初始化数据结束
        PlayerFormulaSheet.prototype.GetLevel = function () {
            return this.get(1003);
        };
        PlayerFormulaSheet.prototype.SetLevel = function (v) {
            this.set(1003, v);
        };
        PlayerFormulaSheet.prototype.GetLevelupexp = function () {
            return this.get(1006);
        };
        return PlayerFormulaSheet;
    }(SuperConfig.FormulaSheet));
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
        this.LoadLevelTable();
        this.LoadMapTable();
        this.LoadWorldmapTable();
    }
    SuperConfig.Load = Load;
    function Clear() {
        this.ClearLevelTable();
        this.ClearMapTable();
        this.ClearWorldmapTable();
    }
    SuperConfig.Clear = Clear;
})(SuperConfig || (SuperConfig = {}));
