/**
 * * 配置表模块撒!放进项目里面撒.
 */
namespace SuperConfig {

  // * 加载json的接口委托，由引擎设置
  export var LoadJsonFunc : Function = null;

  export class FormulaSheetTemplate {
    public datas: Map<number, number> = new Map<number, number>();
    public relation: Map<number, number[]> = new Map<number, number[]>();
    public funcs: Map<number, Function> = new Map<number, Function>();
  }

  export class FormulaSheet extends FormulaSheetTemplate {
    public name: string;
    public newdatas: Map<number, number> = new Map<number, number>();

    public get(key: number): number {
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
      console.error(
        "no value in sheet " +
          name +
          " with key = " +
          key +
          " 请检查是否Config.NewXXX来构造算法对象"
      );
      return 0;
    }
    public set(key: number, val: number) {
      if (this.newdatas.has(key)) {
        if (this.newdatas.get(key) == val) return;
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

    public excelIf(a: number, b: number, c: number): number {
      if (c > 0) return a;
      return b;
    }

    public excelCompare(a: boolean): number {
      if (a) return 1;
      return -1;
    }

    public excelPow(a: number, b: number): number {
      return Math.pow(a, b);
    }

    public excelMod(a: number, b: number): number {
      return a % b;
    }

    private static factcache: Map<number, number> = new Map<number, number>();
    private static factmax: number = 1;
    public excelFact(a: number): number {
      // var n = a.toFixed(0)
      var n = Math.floor(a);
      if (n < 0) return 0;
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

    public excelRound(a: number, b: number): number {
      var d = Math.pow(10, b);
      return Math.floor((a * b + 0.5) / d);
    }

    public excelRoundDown(a: number, b: number): number {
      var d = Math.pow(10, b);
      return Math.floor((a * d) / d);
    }
    public excelRoundUp(a: number, b: number): number {
      var d = Math.pow(10, b);
      return Math.ceil(a * d) / d;
    }

    public excelMax(...args: number[]): number {
      if (args.length == 0) return 0;

      var ret = args[0];
      args.forEach(v => {
        ret = Math.max(ret, v);
      });
      return ret;
    }

    public excelMin(...args: number[]) {
      if (args.length == 0) return 0;

      var ret = args[0];
      args.forEach(v => {
        ret = Math.min(ret, v);
      });
      return ret;
    }
  }
}
