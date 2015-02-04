require('pointfree-fantasy').expose(global);

var mapper = function(f,cnct){
  return function(acc, x){ return cnct(acc, f(x)) }
}

var filterer = function(f, cnct){
  return function(acc, x){ return f(x) ? cnct(acc, x) : acc }
}


var res = [1,2,3].reduce(filterer(function(x){ return x > 1},
                         mapper(function(x){ return x + 1; }, concat)),
                         []);

console.log("RESULT", res)

