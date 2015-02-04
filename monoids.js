var LL = require('./linked_list');
var Cons = LL.Cons;
var Nil = LL.Nil;

var Tree = require('./tree');
var Node = Tree.Node;
var Leaf = Tree.Leaf;



var _Sum = function(x) { this.val = x; }
var Sum = function(x){ return new _Sum(x) }
_Sum.prototype.concat = function(y){ return Sum(this.val + y.val) }
_Sum.prototype.empty = function(){ return Sum(0) }

var _Product = function(x) { this.val = x; }
var Product = function(x){ return new _Product(x) }
_Product.prototype.concat = function(y){ return Product(this.val * y.val) }
_Product.prototype.empty = function(){ return Product(1) }


var _Max = function(x) { this.val = x; }
var Max = function(x){ return new _Max(x) }
_Max.prototype.concat = function(y){ return Max(this.val > y.val ? this.val : y.val) }
_Max.prototype.empty = function(){ return Max(-Infinity) }

var mconcat = function(xs) {
  var m = xs[0];
  return xs.reduce(function(acc, x){ return acc.concat(x) }, m.empty());
}


console.log("Sum: ", mconcat([Sum(1),Sum(2),Sum(3),Sum(4)]))
console.log("Prod: ", mconcat([Product(1),Product(2),Product(3),Product(4)]))
console.log("Max: ", mconcat([Max(1), Max(2), Max(3), Max(4)]))

// we can iterator here...
var foldMap = function(f,xs) {
  return xs.fold(function(acc, x){
    var fx = f(x);
    if(acc == undefined) acc = fx.empty();
    return fx.concat(acc);
  }, undefined)
}

var val = function(x){ return x.val; }
var sum = function(xs){ return foldMap(Sum, xs).val }
var product = function(xs){ return foldMap(Product, xs).val }
var max = function(xs){ return foldMap(Max, xs).val }

var lst = Cons(6, Cons(4, Cons(2, Nil)))
var tr = Node(Node(Leaf(2), 1, Leaf(3)), 2, Leaf(4))

console.log('foldMap sum tree', foldMap(Sum, tr))
console.log('foldMap prod lst', foldMap(Product, lst))
