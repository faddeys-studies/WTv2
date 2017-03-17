## Функции



### Функции как тип данных

<ul>
    <li>Являются отдельным объектным типом данных
        <ul>
            <li>Могут иметь собственные свойства</li>
            <li>Наследуют методы <code>Object.prototype</code> и добавляют свои</li>
        </ul>
    </li>
    <li>First-class citizen
        <ul>
            <li>Могут присваиваться переменным</li>
            <li>Могут передаваться как аргументы и результат работы функции</li>
        </ul>
    </li>
    <li>Определяют область видимости</li>
</ul>



### Создание функций: declaration vs expression

<div class="flex">
    <div>
        <h3>Function Declaration</h3>
        <ul>
            <li>Иструкция объявления функции</li>
            <li>Находится в основном потоке кода</li>
        </ul>

        <pre><code data-trim data-noescape class="javascript">
add(1, 2); // => 3
function add(a, b) {
   return a + b;
}
        </code></pre>

        <pre class="fragment"><code data-trim data-noescape class="javascript">
// Function declaration всплывает наверх
function add(a, b) {
   return a + b;
};
add(1, 2); // => 3, вызов существующей функции
        </code></pre>
    </div>
    <div>
        <h3>Function Expression</h3>
        <ul>
            <li>Литерал/анонимная функция</li>
            <li>Находится в контексте выражения</li>
        </ul>
        <pre><code data-trim data-noescape class="javascript">
add(1, 2); // ReferenceError
let add = function(a, b) {
   return a + b;
};
        </code></pre>

        <pre class="fragment"><code data-trim data-noescape class="javascript">
add(1, 2); // add находится в TDZ, ошибка
// Переменная add объявляется
// и инициализируется функцией только здесь:
let add = function(a, b) {
   return a + b;
};
        </code></pre>
    </div>
</div>



### Создание функций: declaration vs expression
<div class="flex">
    <div>
        <h3>Function Declaration</h3>
        <ul>
            <li>Можно вызвать до объявления</li>
            <li>Можно объявить только в основном потоке кода (не внутри блоков `if/while/etc`)(*strict*)</li>
        </ul>

        <pre><code data-trim data-noescape class="javascript">
'use strict';
let flag = true;
if (flag) {
   function checkFlag() {
       console.log('flag is true');
   }
} else {
   function checkFlag() {
       console.log('flag is false');
   }
}
checkFlag(); // ReferenceError
        </code></pre>
    </div>
    <div>
        <h3>Function Expression</h3>
        <ul>
            <li>Нельзя вызвать до объявления</li>
            <li>Можно объявить там же где и любой другой тип данных - внутри блоков, inline</li>
        </ul>
        <pre><code data-trim data-noescape class="javascript">
let flag = true, checkFlag;
if (flag) {
   checkFlag = function() {
       console.log('flag is true');
   }
} else {
   checkFlag = function() {
       console.log('flag is false');
   }
}
checkFlag(); // 'flag is true'
        </code></pre>
    </div>
</div>



### Создание функций: Named Function Expression
 - NFE - это Function Expression с указанным именем функции
 - Имя NFE доступно только внутри этой функции
 - NFE всегда объявляется в контексте выражения

<div class="flex">
    <pre><code data-trim data-noescape class="javascript">
function f(n) {
    return n ? n \* f(n - 1) : 1;
};
f(5); // 120

let g = f;
f = null;
g(5); // TypeError: f is not a function
    </code></pre>
    <pre><code data-trim data-noescape class="javascript">
let f = function factorial(n) {
    return n ? n \* factorial(n - 1) : 1;
};

let g = f;
f = null;
g(5); // 120
factorial(5); // ReferenceError
    </code></pre>
</div>

```javascript
function g() { return 1; }
g();        // => 1

(function g() { return 1; });
g();        // Reference Error: g is now defined!
```



### Создание функций: методы объектов

<ul>
    <li>Метод объекта - обычное свойство, значением которого является функция вместо данных</li>
    <li>`propName: function(...) {...}` - присвоение function expression свойству</li>
    <li>`propName: function fName(...) {...}` - присвоение NFE свойству</li>
    <li>`propName(...) {...}` - более краткая нотация для методов
        <ul>
            <li>не могут использоваться как конструкторы (`new f(...)`)</li>
            <li>можно использовать ключевое слово `super` для ссылки на прототип</li>
        </ul>
    </li>
</ul>

```javascript
let obj = {
    fa: function() { ... },
    fb: function fb() { ... },
    fc() { ... }
}

obj.fd = function() { ... };
```



### Создание функций: конструктор `Function`

 - А я разве уже говорил, что функции - это объекты?
 - Можно объявить функцию "на лету", когда ее код заранее неизвестен
 - Всегда создается глобальная функция, без учета локальной области видимости

```javascript
let body = 'return a + b;';
var add = new Function('a, b', body);
add(1, 2); // 3
```



### Создание функций: Arrow notation
 - Краткая форма записи для inline-функций
 - Синтаксис `(param1, param2, …, paramN) => { statements }`
 - Не создает свой контекст выполнения (`this`)
 - Не может быть конструктором
 - Лучше всего подходит для функций-не-методов

```javascript
let a = [1, 2, 3, 4, 5];

// если нужно вычислить одно выражение, то фигурные скобки и return можно опустить
// аналогично a.sort(function(a, b) { return b - a; });
a.sort((a, b) => b - a);

// если у функции только один параметр, то скобки вокруг списка аргументов можно опустить
// аналогично a.map(function(x) {return x + 1;});
a.map(x => x + 1);

// если функция не имеет параметров, круглые скобки обязательны
// аналогично a.filter(function() { return Math.round(Math.rand()); })
console.log(a.filter( () => Math.round(Math.random()) ));
```



### Параметры
 - Функция может содержать произвольное число параметров
 - Может вызываться с произвольным числом аргументов
 - Если число параметров больше числа переданных аргументов, недостающие параметры становятся `undefined`
 - Если нужно передать много параметров, можно использовать конфигурационный объект
 - Объекты передаются по ссылке

```javascript
function f(options, data) {
    data; // undefined
    options.customField = 'test';
}

let options = { option1: "...", option2: 200, ... };
f(options);
options.customField; // 'test'
```



### Параметры: `arguments` (how things were)
 - `arguments` автоматически создается при входе в функцию
 - Полезен для работы с переменным числом аргументов
 - array-like object, содержит все значения аргументов
 - Нельзя объявить переменную или изменить значение `arguments` (*strict*)
 - Переопределяется в каждой вложенной функции

<div class="flex">
    <pre><code data-trim data-noescape class="javascript">
function f(a, b) {
    arguments.length; // 4
    Array.isArray(arguments); // false
    Array.from(arguments); // [1, 2, 3, 4]

    arguments[0] === a; // true
    arguments[1] === b; // true
}
f(1, 2, 3, 4);

function join(separator) {
    let args = Array.from(arguments).slice(1);
    return args.join(separator);
}
join(':', 'a', 'b', 'c'); // => 'a:b:c'
    </code></pre>
    <pre><code data-trim data-noescape class="javascript">
function outer() {
    [...arguments];     // [1, 2, 3]
    let x = 15;
    function inner() {
        [...arguments]; // ['a', 'b', 'c']
        x; // 15, из внешней области видимости
    }

    inner('a', 'b', 'c');
}
outer(1, 2, 3);
    </code></pre>
</div>



### Параметры: rest-параметры (how things are)
 - Для переменного числа аргументов удобнее использовать rest синтаксис
 - Является массивом
 - Содержит только "дополнительные" (неименованные) аргументы
 - Может находиться только в конце списка параметров

```javascript
function join(separator, ...values) {
    return values.join(separator); // не нужно вырезать первый параметр
}
join(':', 'a', 'b', 'c'); // => 'a:b:c'

function outer(...outerArgs) {
    outerArgs;     // [1, 2, 3]
    let x = 15;
    function inner(...innerArgs) {
        outerArgs; // [1, 2, 3], из внешней области видимости
        innerArgs; // ['a', 'b', 'c']
        x; // 15, из внешней области видимости
    }

    inner('a', 'b', 'c');
}
outer(1, 2, 3);
```



### Параметры: значения по умолчанию (how things were)
 - Раньше нельзя было указывать значения параметров по умолчанию
 - Решение - дополнительный код в начале функции

```javascript
function makeRequest(url, timeout, callback) {
    timeout = timeout || 2000;
    callback = callback || function() {};
    . . .
}
makeRequest("...", 0, function() {});  // 0 - валидное значение для timeout!

function makeRequest(url, timeout, callback) {
    timeout = timeout !== undefined ? timeout : 2000;
    callback = callback !== undefined ? callback || function() {};
    . . .
}
makeRequest("...", 0, function() {});  // все ok, используем timeout = 0
```



### Параметры: значения по умолчанию (how things are)
 - Можно использовать не только литералы, но и выражения
 - Можно использовать значения предыдущих параметров в списке
 - `arguments` отражает аргументы, указанные при вызове функции

<div class="flex">
    <pre><code data-trim data-noescape class="javascript">
function f(a, b = 2000, c = () => {}) {. . .}
f('foo');        // b, c по умолчанию
f('foo', 500);   // c по умолчанию

// Опциональный параметр - необязательно последний
function f2(a, b = 2000, c) {. . .}

f2("foo", undefined, 3); // b = 200, c = 3
f2("foo"); // b = 200, c = undefined

f2("foo", null, 3); // b = null, c = 3
    </code></pre>
    <pre><code data-trim data-noescape class="javascript">
let value = 5;
function getValue() {
    return value++;
}

function add(first, second = getValue()) {
    return first + second;
}
add(1, 1); // => 2, getValue не вызвана
add(1);    // => 6, getValue вызвана
add(1);    // => 7, getValue вызвана

function add(first, second = first) {
    return first + second;
}
add(1, 1); // => 2
add(1);    // => 2
    </code></pre>
</div>



### Параметры: связь с деструктурированием
 - Присвоение значений параметрам функции при ее вызове работает в точности как деструктурирование массивов
 - Можно использовать деструктурирование объектов в параметрах
 - Можно использовать rest-синтаксис в списке параметров
 - Можно использовать spread-синтаксис в списке аргументов

```javascript
// объявление функции
f(param1, param2 = defaultValue2, ...param3) {...}
// вызов функции
f(arg1, arg2, arg3, ...arg4);

// Определение значений параметров по списку аргументов
let [param1, param2 = defaultValue2, ...param3] = [arg1, arg2, arg3, ...arg4];

function drawChart({size = 'big', cords = {x: 0, y: 0}, radius = 25} = {}) {
  console.log(size, cords, radius); // => 'big' {x: 18, y: 30}, 30
  . . .
}

drawChart({cords: {x: 18, y: 30}, radius: 30});
```



### `this`: контекст вызова функции
 - `this` - ключевое слово
 - определяется видом функции и способом ее вызова
 - может содержать любое значение (как правило, ссылка на объект)
 - можно считать дополнительным неявным аргументов функции
 - нельзя присвоить значение напрямую
 - вложенные функции не наследуют `this` от вызывающей функции, а определяют свое



### `this`: контекст вызова функции

<ul>
    <li class="fragment">Определить чему равно `this` очень легко!</li>
    <li class="fragment">3 способа создания функции \* 3 способа вызова функции \* 2 варианта работы интерпретатора</li>
    <li class="fragment">3 способа задать контекст вручную</li>
    <li class="fragment">Пара специальных случаев - `eval()`, глобальная область видимости</li>
    <li class="fragment">Всего - более 20 различных вариантов</li>
</ul>

<img class="fragment" src="img/trollface.png"></img>
<img class="fragment" src="img/this.jpg"></img>



### `this`: тривиальные случаи
 - В глобальной области видимости `this` - глобальный объект
 - В функции, созданной через `new Function()` `this` - глобальный объект
 - При вызове обычной функции `this` равно `undefined` (*strict*)

```javascript
'use strict';

this;  // Window/Global

var a = 5, b = 6;  // var - чтобы a и b стали свойствами глобального объекта
let x = new Function('', 'return this.a + this.b;');
x();   // 11

function f() {
    return this;
}
f();   // undefined
```



### `this`: вызов метода объекта
 - При вызове метода объекта `this` указывает на этот объект
 - Если метод находится в прототипе объекта, `this` все равно указывает на изначальный объект

<div class="flex">
    <pre><code data-trim data-noescape class="javascript">
let obj = {
   a: 2,
   b: 3,
   add() { return this.a + this.b; }
};
obj.add(); // 5
obj["add"](); // 5

let mulF = function() { return this.a * this.b; }
obj.mul = mulF;
mulF();     // TypeError, this === undefined
obj.mul();  // 6 ok, this === obj
    </code></pre>
    <pre><code data-trim data-noescape class="javascript">
let obj2 = {
    a: 10,
    b: 100,
    div() { return this.b / this.a; }
};
Object.setPrototypeOf(obj, obj2);
obj.div(); // 1.5
// метод берется из прототипа obj2,
// this указывает на изначальный объект obj
    </code></pre>
</div>



### `this`: вызов конструктора
 - Каждую (почти) функцию в JS можно вызвать как конструктор: `new f()`
 - `this` внутри вызова конструктора указывает на новый пустой объект
 - Этот объект наследует от свойства `prototype` функции-конструктора

```javascript
let Constr = function() {
   this.a = 1;
   this.greet = function() { return 'hi'; };
   return this;
}
Constr.prototype = {
    getA()  { return this.a; },
    greet() { return 'hello'; }
}
let obj = new Constr();
Object.getPrototypeOf(obj) === Constr.prototype; // true
obj.getA();   // 1
obj.greet();  // 'hi'

Constr.prototype.getA();  // undefined
Constr.prototype.greet(); // 'hello'
```



### `this`: вызов функции с заданным контекстом
 - `call/apply` вызывает функцию с заданным контекстом и аргументами
 - Первый аргумент `call/apply` - контекст при вызове функции (*strict*)
 - Вызов `call` - содержит список аргументов функции
 - Вызов `apply` - второй аргумент - массив аргументов для функции

<div class="flex">
    <pre><code data-trim data-noescape class="javascript">
let obj = {
   a: 2,
   b: 3,
   add: function(c, d) {
       return this.a + this.b + c + d;
   }
};
obj.add(5, 6); // 16
obj.add.call({a: 10, b: 20}, 5, 6); // 41
obj.add.apply({a: 10, b: 20}, [5, 6]); // 41
    </code></pre>
    <pre><code data-trim data-noescape class="javascript">
let aLike = {
    0: 'a', 1: 'b', 2: 'c',
    length: 3
};
aLike.join(':');  // TypeError
Array.prototype.join.call(aLike, ':'); // 'a:b:c'

// Единственный способ разложить массив
// в список аргументов до появления spread
Math.max.apply(undefined, [1, 17, 11]); // => 17
    </code></pre>
</div>



### `this`: создание функции с заданным контекстом
 - `Function.prototype.bind()` создает новую функцию
 - Связывает (bind) новую функцию с указанным контекстом
 - Связывает новую функцию со значениями аргументов (частичное применение/currying)

<div class="flex">
    <pre><code data-trim data-noescape class="javascript">
let sum = function(x, y) { return x + y; },
    sum5 = sum.bind(null, 5);
sum5(9); // 14

sum = function() { return this.x + this.y; };
boundSum = sum.bind({x: 1, y: 2});
boundSum();                   // 3
boundSum.call({x: 5, y: 10}); // все равно 3
    </code></pre>
    <pre><code data-trim data-noescape class="javascript">
let obj = {
   x: 2,
   y: 3,
   addFunction() {
       return this.x + this.y;
   }
};
let f = obj.addFunction;
f(); // TypeError, потеряли контекст

f = obj.addFunction.bind(obj);
f(); // 5, все ok
    </code></pre>
</div>



### `this`: вложенные функции

 - Обычные вложенные функции не могут обратиться к this снаружи
 - Можно присвоить `this` другой переменной, которая будет в scope
 - Можно использовать `bind`
 - Можно использовать arrow-функции, которые разделяют значение `this` и `arguments` со внешней функцией

```javascript
let obj = {
    sort: 'ASC', // ASC/DESC
    data: [5, 9, -4, 19, 0, 3],
    sortData() {
        this.data.sort(function(a, b) {
            return this.sort === 'ASC' ? a - b : b - a;
        })
    }
};
obj.sortData(); // TypeError;
```



### `this`: вложенные функции

<div class="flex">
    <pre><code data-trim data-noescape class="javascript">
let obj = {
  ...
  sortData() {
    let self = this;
    this.data.sort(function(a, b) {
      return self.sort === 'ASC' ? a - b : b - a;
    })
  }
}
obj.sortData();
// ok, self в отличие от this есть в scope

<span class="fragment">
let obj = {
  ...
  sortData() {
    this.data.sort(function(a, b) {
      return this.sort === 'ASC' ? a - b : b - a;
    }.bind(this));
  }
}
obj.sortData();</span>
// ok, вложенная функция связана с obj
    </code></pre>
    <pre class="fragment"><code data-trim data-noescape class="javascript">
let obj = {
  ...
  sortData() {
    this.data.sort(
      (a, b) =>
        this.sort === 'ASC' ? a - b : b - a
    );
  }
}
obj.sortData();
// ok, у arrow функции нет собственного контекста
    </code></pre>
</div>



### Итоги подведем: как создать функцию в зависимости от задачи

 - Для обычных функций в общем потоке выполнения - FE/NFE/Arrow functions (и не используем в теле функции `this`)
 - Для методов объектов - краткий синтаксис method definition
 - Для вложенных (особенно коротких!) функций - Arrow function notation
 - Для функций, код которых заранее неизвестен, - `new Function()`



### Замыкания

 - JS использует лексическую область видимости
 - При вызове функции действует scope, который имелся на момент ее создания, а не вызова
 - Замыкание - это функция, хранящая ссылку на область видимости, в которой она создана
 - Все функции в JS являются замыканиями

<div class="flex">
    <pre><code data-trim data-noescape class="javascript">
let scope = "global";
function checkScope() {
    let scope = "local";

    function inner() {
        return scope;
    }
    return inner();
}
checkScope(); // => ? <span class="fragment">"local"</span>
    </code></pre>

    <pre><code data-trim data-noescape class="javascript">
var scope = "global";
function checkScope() {
   let scope = "local";

   function inner() {
       return scope;
   }
   return inner;
}
checkScope()(); // => ? <span class="fragment">"local"</span>
    </code></pre>
</div>