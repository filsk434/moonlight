function time() {
const target = document.querySelector('.result');

var d = new Date();
var n = d.getHours();

if(0<n<6) {
  input = ("Good Night");
}
if(6<n<12) {
  input = ("Good Morning");
}
if(12<n<18) {
  input = ("Good Day");
}
else {
  input = ("Good Evening");
}
target.innerHTML = input;

console.log(input);
}
time();