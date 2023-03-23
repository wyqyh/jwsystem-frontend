 import hasPerm from "./hasPerm";

 const install = function(Vue) {
   Vue.directive('hasPerm', hasPerm)
 }

 export default install