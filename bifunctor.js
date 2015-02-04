require('pointfree-fantasy').expose(global);
var LL = require('./linked_list');
var Cons = LL.Cons;
var Nil = LL.Nil;


var bimap = curry(function(f, g, x){ return x.bimap(f, g); })

//+ mapp1 :: Bifunctor s => (a -> b) -> s a -> s b
var map = curry(function(f, l) { return bimap(f, map(f), l) })
//var mapp = function(f, l) { return l.bimap(f, ((x) => mapp(f, x))) }

//+ fold :: Bifunctor s => (s a b -> b) -> s a -> b
var fold = curry(function(f,x){ return compose(f, bimap(I, fold(f)))(x) })


var lst = Cons(6, Cons(4, Cons(2, Nil)))
console.log("Fix Both", lst);
console.log("Fix Map", map(function(x){ return x + 1}, lst));
console.log("Foldit", fold(function(x){ return (x === Nil) ? 0 : x.head+x.tail }, lst));
