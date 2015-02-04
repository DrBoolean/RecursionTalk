var Nil = {}
Nil.inspect = function(){ return 'Nil'; }
var inspect = function (x){ if(!x) return x; return x.inspect ? x.inspect() : x; }

var Cons = function(h, tl) { return new _Cons(h, tl) }
var _Cons = function(h, tl) {
  this.head = h;
  this.tail = tl;
};
_Cons.prototype.inspect = function(){ return 'Cons('+inspect(this.head)+', '+inspect(this.tail)+')'; }

Nil.map = function(f) { return Nil; }
_Cons.prototype.map = function(f) { return Cons(this.head, f(this.tail)); };


_Cons.prototype.bimap = function(f, g) { return Cons(f(this.head), g(this.tail)); };
Nil.bimap = function(f,g) { return Nil; }

Nil.fold = function(f, acc) { return acc }
_Cons.prototype.fold = function(f, acc) {
  return this.tail.fold(f, f(acc, this.head))
}

module.exports = {Cons: Cons, Nil: Nil}
