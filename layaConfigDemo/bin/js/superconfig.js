var SuperConfig;
(function (SuperConfig) {
    SuperConfig.LoadJsonFunc = null;
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
        }
        set(key, val) {
            if (this.newdatas.has(key)) {
                if (this.newdatas.get(key) == val)
                    return;
            }
            this.newdatas.set(key, val);
            if (this.relation.has(key)) {
                var list = this.relation.get(key);
                list.forEach((v, index) => {
                    if (this.newdatas.has(v)) {
                        this.newdatas.delete(v);
                    }
                });
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
        excelFact(a) {
            if (FormulaSheet.factmax == 0) {
                FormulaSheet.factmax = 1;
                FormulaSheet.factcache.set(1, 1);
            }
            var n = Math.floor(a);
            if (n < 0)
                return 0;
            if (n <= FormulaSheet.factmax) {
                return FormulaSheet.factcache.get(n);
            }
            for (let index = FormulaSheet.factmax + 1; index <= n; index++) {
                var val = FormulaSheet.factcache.get(index - 1) * index;
                FormulaSheet.factcache.set(index, val);
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
    FormulaSheet.factmax = 0;
    SuperConfig.FormulaSheet = FormulaSheet;
})(SuperConfig || (SuperConfig = {}));
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
    class LevelTableGroup {
        init(d) {
            this.Maxexp = d.Maxexp;
            this.Maxexp_maxhp = d.Maxexp_maxhp;
            return this;
        }
    }
    SuperConfig.LevelTableGroup = LevelTableGroup;
    class LevelConfig {
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
    class LevelTable {
        constructor() {
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
            return null;
        }
        Get_maxexp(Maxexp) {
            var cach_key = +Maxexp + "_";
            if (this.Maxexp_Cached.has(cach_key))
                return this.Maxexp_Cached.get(cach_key);
            if (this._Group.Maxexp[Maxexp.toString()]) {
                var ids = this._Group.Maxexp[Maxexp.toString()];
                var configs = [];
                for (let i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    configs.push(this.Get(id));
                }
                this.Maxexp_Cached[cach_key] = configs;
                return configs;
            }
            return null;
        }
        Get_maxexp_maxhp(Maxexp, Maxhp) {
            var cach_key = +Maxexp + "_" + Maxhp + "_";
            if (this.Maxexp_maxhp_Cached.has(cach_key))
                return this.Maxexp_maxhp_Cached.get(cach_key);
            if (this._Group.Maxexp_maxhp[Maxexp.toString()]) {
                var tmp0 = this._Group.Maxexp_maxhp[Maxexp.toString()];
                if (tmp0[Maxhp.toString()]) {
                    var ids = tmp0[Maxhp.toString()];
                    var configs = [];
                    for (let i = 0; i < ids.length; i++) {
                        var id = ids[i];
                        configs.push(this.Get(id));
                    }
                    this.Maxexp_maxhp_Cached[cach_key] = configs;
                    return configs;
                }
            }
            return null;
        }
        data_level_vlookup_1(id) {
            return GetLevelTable()._Datas.get(id.toString()).Level;
        }
        data_level_vlookup_2(id) {
            return GetLevelTable()._Datas.get(id.toString()).Maxexp;
        }
        data_level_vlookup_3(id) {
            return GetLevelTable()._Datas.get(id.toString()).Maxhp;
        }
        data_level_vlookup_5(id) {
            return GetLevelTable()._Datas.get(id.toString()).Double;
        }
        data_level_vlookup_6(id) {
            return GetLevelTable()._Datas.get(id.toString()).Aaa;
        }
    }
    SuperConfig.LevelTable = LevelTable;
})(SuperConfig || (SuperConfig = {}));
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
    class MapTableGroup {
        init(d) {
            this.Type = d.Type;
            return this;
        }
    }
    SuperConfig.MapTableGroup = MapTableGroup;
    class MapConfig {
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
    class MapTable {
        constructor() {
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
            return null;
        }
        Get_type(Type) {
            var cach_key = +Type + "_";
            if (this.Type_Cached.has(cach_key))
                return this.Type_Cached.get(cach_key);
            if (this._Group.Type[Type.toString()]) {
                var ids = this._Group.Type[Type.toString()];
                var configs = [];
                for (let i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    configs.push(this.Get(id));
                }
                this.Type_Cached[cach_key] = configs;
                return configs;
            }
            return null;
        }
        data_map_vlookup_1(id) {
            return GetMapTable()._Datas.get(id.toString()).Id;
        }
        data_map_vlookup_2(id) {
            return GetMapTable()._Datas.get(id.toString()).Type;
        }
        data_map_vlookup_3(id) {
            return GetMapTable()._Datas.get(id.toString()).Share;
        }
        data_map_vlookup_6(id) {
            return GetMapTable()._Datas.get(id.toString()).Randomlvmin;
        }
        data_map_vlookup_7(id) {
            return GetMapTable()._Datas.get(id.toString()).Randomlvmax;
        }
    }
    SuperConfig.MapTable = MapTable;
})(SuperConfig || (SuperConfig = {}));
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
    class WorldmapTable {
        constructor() {
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
            return null;
        }
        Get_frommap(Frommap) {
            var cach_key = +Frommap + "_";
            if (this.Frommap_Cached.has(cach_key))
                return this.Frommap_Cached.get(cach_key);
            if (this._Group.Frommap[Frommap.toString()]) {
                var ids = this._Group.Frommap[Frommap.toString()];
                var configs = [];
                for (let i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    configs.push(this.Get(id));
                }
                this.Frommap_Cached[cach_key] = configs;
                return configs;
            }
            return null;
        }
        Get_frommap_tomap(Frommap, Tomap) {
            var cach_key = +Frommap + "_" + Tomap + "_";
            if (this.Frommap_tomap_Cached.has(cach_key))
                return this.Frommap_tomap_Cached.get(cach_key);
            if (this._Group.Frommap_tomap[Frommap.toString()]) {
                var tmp0 = this._Group.Frommap_tomap[Frommap.toString()];
                if (tmp0[Tomap.toString()]) {
                    var ids = tmp0[Tomap.toString()];
                    var configs = [];
                    for (let i = 0; i < ids.length; i++) {
                        var id = ids[i];
                        configs.push(this.Get(id));
                    }
                    this.Frommap_tomap_Cached[cach_key] = configs;
                    return configs;
                }
            }
            return null;
        }
        Get_frommap_tomap_fromnpc(Frommap, Tomap, Fromnpc) {
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
                        for (let i = 0; i < ids.length; i++) {
                            var id = ids[i];
                            configs.push(this.Get(id));
                        }
                        this.Frommap_tomap_fromnpc_Cached[cach_key] = configs;
                        return configs;
                    }
                }
            }
            return null;
        }
        data_worldmap_vlookup_1(id) {
            return GetWorldmapTable()._Datas.get(id.toString()).Id;
        }
        data_worldmap_vlookup_2(id) {
            return GetWorldmapTable()._Datas.get(id.toString()).Frommap;
        }
        data_worldmap_vlookup_3(id) {
            return GetWorldmapTable()._Datas.get(id.toString()).Fromnpc;
        }
        data_worldmap_vlookup_4(id) {
            return GetWorldmapTable()._Datas.get(id.toString()).Tomap;
        }
        data_worldmap_vlookup_5(id) {
            return GetWorldmapTable()._Datas.get(id.toString()).Tonpc;
        }
    }
    SuperConfig.WorldmapTable = WorldmapTable;
})(SuperConfig || (SuperConfig = {}));
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
                return (SuperConfig.GetLevelTable().data_level_vlookup_3(ins.get(1 * 1000 + 3)) + ins.get(2 * 1000 + 8));
            });
            this.datas.set(2003, 5);
            this.funcs.set(2008, (ins) => {
                return ins.excelFact(ins.get(2 * 1000 + 3));
            });
            this.relation.set(1003, [1006]);
            this.relation.set(2008, [1006]);
            this.relation.set(2003, [2008, 1006]);
        }
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
        }
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
