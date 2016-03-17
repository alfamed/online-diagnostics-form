function x1(arr) {
  var a = [];
  for (var i = 0; i < arr.length; i++) {
    a.push(function(){
      return arr[i];
    });
  }
  return a;
}
var y = [6, 10, 15, 20];
var z = x1(y);
var w = z[0];
console.log(w());
