var Empty = {}
Empty.inspect = function(){ return 'Empty' }

var Leaf = function(x) { return new _Leaf(x) };
var _Leaf = function(x) { this.x = x; };
_Leaf.prototype.inspect = function(){ return 'Leaf('+inspect(this.x)+')' }

var Node = function(l, x, r) { return new _Node(l, x, r) }
var _Node = function(l, x, r) {
  this.left = l;
  this.x = x;
  this.right = r;
}
_Node.prototype.inspect = function(){ return 'Node('+inspect(this.left)+', '+inspect(this.x)+', '+inspect(this.right)+')' }

Empty.fold = function(f, acc) { return acc }
_Leaf.prototype.fold = function(f, acc) { return f(acc, this.x) }
_Node.prototype.fold = function(f, acc) { return this.left.fold(f, f(this.right.fold(f, acc), this.x))  }


Empty.map = function(f) { return Empty; }
_Leaf.prototype.map = function(f) { return Leaf(this.x); };
_Node.prototype.map = function(f) { return Node(f(this.left), this.x, f(this.right)); };

module.exports = {Node: Node, Leaf: Leaf, Empty: Empty}
