"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Helloworld = /** @class */ (function (_super) {
    __extends(Helloworld, _super);
    function Helloworld() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.text = 'hello';
        return _this;
    }
    Helloworld.prototype.start = function () {
        // init logic
        var arr = SuperConfig.GetAllConfig("./resources/config_data/");
        this.label.string = this.text;
        var urls = new Array();
        urls.push("./config_data/level.json");
        // cc.loader.loadResArray(urls, (completedCount: number, totalCount: number, item: cc.Asset) => {
        //     console.log(" 车工那个夹杂");
        // }, ((error: Error, resource: any[]) => {
        //     if (error == null) {
        //         console.error("加载莫迷宫失败")
        //     }
        //     else {
        //         console.error(error)
        //     }
        // }))
        cc.loader.loadResDir('./config_data', function (err, objects, urls) {
            var data = objects[0];
            var url = urls[0];
        });
        // cc.loader.loadRes("config_data/level.json", cc.SpriteAtlas, function (err, atlas) {
        //     console.log(" 成功");
        // });
        // SuperConfig.LoadJsonFunc = (f: string) => {
        //     console.log("加载:" + f);
        //     return cc.loader.getRes("res/config_data/" + f);
        // }
        // let cfg = SuperConfig.GetLevelTable();
    };
    __decorate([
        property(cc.Label)
    ], Helloworld.prototype, "label", void 0);
    __decorate([
        property
    ], Helloworld.prototype, "text", void 0);
    Helloworld = __decorate([
        ccclass
    ], Helloworld);
    return Helloworld;
}(cc.Component));
exports.default = Helloworld;
