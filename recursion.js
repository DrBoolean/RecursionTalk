require('pointfree-fantasy').expose(global);

// helpers
var head = function(xs) { return xs[0]; }
var tail = function(xs) { return xs.slice(1, xs.length); }


var sum = function(xs) {
  if(xs.length === 0) return 0;
  return head(xs) + sum(tail(xs));
}
console.log("sum recursive", sum([1,2,3]));

var reverse = function(xs) {
  if(xs.length == 0) return xs;
  return reverse(tail(xs)).concat([head(xs)]);
}
console.log("reverse recursive", reverse([1,2,3]));


var sum = function(list) {
  function go(acc, xs) {
    if(xs.length === 0) return acc;
    return go(acc+head(xs), tail(xs));
  }
  return go(0, list)
}

console.log("sum tail rec", sum([1,2,3]));

var reverse = function(xs) {
  var go = function(xs, acc) {
    if(xs.length == 0) return acc;
    return go(tail(xs), [head(xs)].concat(acc));
  }
  return go(xs,[]);
}

console.log("reverse tail rec", reverse([1,2,3]));


var reduce = function(f, acc, xs) {
  if(xs.length == 0) return acc;
  return reduce(f, f(acc, head(xs)), tail(xs));
}

var sum = function(xs){ return reduce(function(acc, x){ return x+acc; }, 0, xs); }
var reverse = function(xs) { return reduce(function(acc, x){ return [x].concat(acc); }, [], xs); }

console.log("sum via reduce", sum([1,2,3]));
console.log("reverse via reduce", reverse([1,2,3]));


var unfold = function(f, seed) {
  function go(f, seed, acc) {
    var res = f(seed);
    return res ? go(f, res[1], acc.concat([res[0]])) : acc;
  }
  return go(f, seed, [])
}


var makeAlphabet = function() {
  return unfold(function(b){ if(b < 26) return [String.fromCharCode(b+65), b+1] }, 0);
}

var range = curry(function(initial, count){
  return unfold(function(b){ if(b <= count) return [b, b+1] }, initial);
})


console.log("alphabet via unfold", makeAlphabet());
console.log("range via unfold", range(2, 10));

var hylo = function(fld, unfld, seed) {
  return fld(unfld(seed));
}

console.log("hylo sum of range", hylo(sum, range(2), 10))

var consonants = function(xs){
  var vowels = ['A', 'E', 'I', 'O', 'U'];
  return xs.filter(function(x){ return vowels.indexOf(x) < 0 });
}

console.log("hylo consonants of alphabet", hylo(consonants, makeAlphabet, 0));

