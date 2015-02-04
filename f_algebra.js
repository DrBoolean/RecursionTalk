require('pointfree-fantasy').expose(global); // curry/map
var LL = require('./linked_list');
var Cons = LL.Cons;
var Nil = LL.Nil;

var inspect = function (x){ if(!x) return x; return x.inspect ? x.inspect() : x; }
var head = function(xs) { return xs[0]; }
var tail = function(xs) { return xs.slice(1, xs.length); }

var cata = curry(function(f, x) { return compose(f, map(cata(f)))(x) })


var lst = Cons(6, Cons(4, Cons(2, Nil)))
var sum = cata(function(x){ return (x === Nil) ? 0 : x.head + x.tail; }, lst);
console.log("sum cata", sum);



//ana :: (a -> t a) -> a -> t
var ana = curry(function(g, a) { return compose(map(ana(g)), g)(a); })

var listToLinked = function(seed) {
  return ana(function(xs) {
    return (xs.length === 0) ? Nil : Cons(head(xs), tail(xs));
  }, seed)
}

console.log("List Ana", listToLinked([1,2,3,4,5]));


var rangeana = function(initial, count) {
  return ana(function(x) {
    if(x >= count) return Nil;
    return Cons(x, x+1);
  }, initial)
}

console.log("Range Ana", rangeana(2, 10));


// hylo :: Functor f => (f b -> b) -> (a -> f a) -> a -> b
var hylo = curry(function(f, g, a){ return compose(f, map(hylo(f,g)), g)(a) })


var joinAlphabet = function(x) {
  if(x === Nil) return "";
  return x.head+','+x.tail;
}

var makeAlphabet = function(b) {
  if(b > 25) return Nil;
  return Cons(String.fromCharCode(b+65), b+1);
}
var anAlph = ana(makeAlphabet, 0);
console.log("AA", cata(joinAlphabet, anAlph));
console.log("BB", anAlph);

hylo(joinAlphabet, makeAlphabet, 0)

var Const = function(x) { return new _Const(x); };
var _Const = function(val) { this.val = val; };
_Const.prototype.inspect = function(){ return 'Const('+inspect(this.val)+')'; }

var Add = function(x, y) { return new _Add(x, y); };
var _Add = function(x, y) {
  this.x = x;
  this.y = y;
};
_Add.prototype.inspect = function(){ return 'Add('+inspect(this.x)+', '+inspect(this.y)+')'; }

var Mul = function(x, y) { return new _Mul(x, y); };
var _Mul = function(x, y) {
  this.x = x;
  this.y = y;
};
_Mul.prototype.inspect = function(){ return 'Mul('+inspect(this.x)+', '+inspect(this.y)+')'; }

_Const.prototype.map = function(f) { return this } // imporatnat!!! Doesn't do anything
_Add.prototype.map = function(f) { return Add(f(this.x), f(this.y)) }
_Mul.prototype.map = function(f) { return Mul(f(this.x), f(this.y)) }

var interpret = function(a) {
  switch(a.constructor) {
    case _Mul: return a.x * a.y;
    case _Add: return a.x + a.y;
    case _Const: return a.val;
  }
}

var testExpr = Mul(Add(Const(2), Const(3)), Const(4))
var res = cata(interpret, testExpr);
console.log("ADD/MUL", testExpr)
console.log("res", res)


var _Concat = function(v, next) { this.val = v; this.next = next; };
var Concat = function(v, x){ return new _Concat(v, x); }
_Concat.prototype.inspect = function(){ return 'Concat('+inspect(this.val)+', '+inspect(this.next)+')'; }

var _Replace = function(v, x, next) { this.val = v; this.x = x; this.next = next; };
var Replace = function(v, x, next){ return new _Replace(v, x, next); }
_Replace.prototype.inspect = function(){ return 'Replace('+inspect(this.val)+', '+inspect(this.x)+', '+inspect(this.next)+')'; }

var _Input = function(v) { this.val = v; };
var Input = function(v){ return new _Input(v); }
_Input.prototype.inspect = function(){ return 'Input('+inspect(this.val)+')'; }


_Concat.prototype.map = function(f) { return Concat(this.val, f(this.next)); };
_Replace.prototype.map = function(f) { return Replace(this.val, this.x, f(this.next)); };
_Input.prototype.map = function(f) { return Input(this.val); };

var printy = function(t) {
  switch (t.constructor) {
    case _Concat:
      return "concatting "+t.val +" after "+ t.next;
    case _Replace:
      return "replacing "+t.val+" with "+ t.x + " on " +t.next;
    case _Input:
      return t.val;
  }
}

var inter = function(t) {
  switch (t.constructor) {
    case _Concat:
      return t.next + t.val;
    case _Replace:
      return t.next.replace(t.val, t.x);
    case _Input:
      return t.val;
  }
}



var p = Concat("world", Replace("h", "m", Input("hello")));
//=> Concat(world, Replace(h, m, Input(hello))

var res = cata(inter, p)
console.log("RES", res);
//=> melloworld
//=> concatting world after replacing h with m on hello
