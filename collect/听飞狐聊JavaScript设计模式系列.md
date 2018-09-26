=============01数据类型和数组基础篇=============
ES数据类型分为基本类型值和引用类型值。
Function是对象，不是数据类型。
五种基本数据类型:Undefined，Null，Boolean，Number，String（按值访问）
四种引用类型：Object,Array,Date，RegExp（Function是特殊的Object,function是其类实例，函数名是指向函数对象的指针）
ES内置对象：
单体内置对象
1.global对象，这是指全局对象，类似与浏览器的window
2.Math对象 进行数学运算的对象
Function对象
Function是特殊的Object,function是其类实例，函数名是指向函数对象的指针
ES5数组新特性
位置方法：（返回索引位置）
arr.indexOf(‘str’,[start]） 
arr.lastIndexOf(‘str’,[start]）
迭代方法： 迭代方法回调支持3个参数，（数组内容，[数组对应的索引，数组本身]）
arr.reverse()这个不是ES5语法，此方法是数组反向处理如【5，3，2】==》【2，3，5】
arr.short(function(a,b){return a-b})这个不是ES5语法，此方法是对数值数组进行排序
arr.every(function(item){}) （根据function中程序判定item是否全部满足某条件，返回true/false）
arr.filter(function(item){}) （根据function中程序过滤出满足条件的item,返回过滤后的数组）
forEach(function(item){}) （根据function中程序对item进行处理，无返回值，至少改变原来数组）
 some(function(item){}) （根据function中程序判断是否有item满足条件，如果有则返回true,否则返回false） 
map(function(item){}) （对每个item运算，并返回每次调用后function执行的结果组成的数组）
缩放方法：
arr.reduce(function(prev,cur,index,array){ return prev+cur})  对每个item运算，并返回最终function执行的结果组成的数组）
arr.reduceRight(function(prev,cur,index,array){ return prev+cur})逆向对每个item运算，并返回最终function执行的结果组成的数组）

=============02对象基础篇=============
Object实例的创建
构造函数法：var o=new Objet();
字面量法：var o={name:'feixu'};
Object属性的访问：
点语法：o.name    方括号语法：o.['name']   枚举可用for in

Object属性/方法的删除：
delete o.name  
不可扩展对象（可修改和删除）
对象禁用扩展：Object.preventExtensions(o);
判断对象是否可扩展：Object.isExtensible(o);
密封对象（可删除）
对象密封：Object.seal(o);
判断对象是否密封：Object.isSealed(o);
密封对象（可删除）
对象密封：Object.seal(o);
判断对象是否密封：Object.isSealed(o);
冻结对象（只能查看）
对象冻结：Object.frozen(o);
判断对象是否冻结：Object.isFrozen(o);

=============03函数基础篇=============
函数实例的创建
函数声明法：function o(a,b){return a+b;}
函数表达式法：var o=function(a,b){return a+b;}
构造函数法：var o =new Function("a","b","return a+b");
call,apply,bind：可以理解为修饰符改变函数内部作用域
call(this,arg1,arg2)
apply(this,[arg1,arg2])
bind()常常和回调函数与事件处理程序一起使用以便在将函数作为变量传递的同时保留代码执行环境。
闭包和柯里化
闭包：有权访问另一个函数作用域中变量的函数。这是书上的解释，有点懵吧，说白了，就是方法里面的方法就叫闭包。
柯里化：把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。




不可扩展对象（可修改和删除）
对象禁用扩展：Object.preventExtensions(o);
判断对象是否可扩展：Object.isExtensible(o);
密封对象（可删除）
对象密封：Object.seal(o);
判断对象是否密封：Object.isSealed(o);
密封对象（可删除）
对象密封：Object.seal(o);
判断对象是否密封：Object.isSealed(o);
冻结对象（只能查看）
对象冻结：Object.frozen(o);
判断对象是否冻结：Object.isFrozen(o);




位置方法：（返回索引位置）
arr.indexOf(‘str’,[start]） 
arr.lastIndexOf(‘str’,[start]）
迭代方法： 迭代方法回调支持3个参数，（数组内容，[数组对应的索引，数组本身]）
arr.reverse()这个不是ES5语法，此方法是数组反向处理如【5，3，2】==》【2，3，5】
arr.every(function(item){}) （根据function中程序判定item是否全部满足某条件，返回true/false）
arr.filter(function(item){}) （根据function中程序过滤出满足条件的item,返回过滤后的数组）
forEach(function(item){}) （根据function中程序对item进行处理，无返回值，至少改变原来数组）
 some(function(item){}) （根据function中程序判断是否有item满足条件，如果有则返回true,否则返回false） 
map(function(item){}) （对每个item运算，并返回每次调用后function执行的结果组成的数组）
缩放方法：
arr.reduce(function(prev,cur,index,array){ return prev+cur})  对每个item运算，并返回最终function执行的结果组成的数组）
arr.reduceRight(function(prev,cur,index,array){ return prev+cur})逆向对每个item运算，并返回最终function执行的结果组成的数组）

  




