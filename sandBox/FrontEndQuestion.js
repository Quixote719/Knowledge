// 1.写一个 mySetInterVal(fn, a, b),每次间隔 a,a+b,a+2b 的时间，然后写一个 myClear，停止上面的 mySetInterVal

function setMyInterval(foo, a, b) {
    this.count = 0
    this.start = () => {
        this.timer = setTimeout(()=>{
            foo()
            this.count++
            this.start()
        }, a + this.count * b)
    }
    this.end = ()=>{
        clearTimeout(this.timer)
    }
}

let myInterval=new setMyInterval(()=>{console.log(6)},100,10)
myInterval.start()
//myInterval.end()

// 2.合并二维有序数组成一维有序数组，归并排序的思路
let test2Arr = [[1,4,6],[7,8,10],[2,6,9],[3,7,13],[1,5,12]];
function mergeSortArr1(arr) {
    return arr.flat(Infinity).sort((a,b)=>a-b)
}

// 合并并排序2个无序数组
let arr01 = [14,7,3,2,28],  arr02 = [94,1,5,6,88]
let mergeArr = (arr1, arr2) => {
    let fooArr1 = sortArr(arr1), fooArr2 = sortArr(arr2)
    let res = []
    while(fooArr1.length>0 && fooArr2.length>0){
        if(fooArr1[0] < fooArr2[0]){
            res.push(fooArr1.shift())
        }
        else{
            res.push(fooArr2.shift())
        }
    }
    res = res.concat(fooArr1, fooArr2)
    return res
}

let sortArr = (arr) => {
    for(i=0; i<arr.length-1; i++) {
        for(j=0; j<arr.length-1-i; j++) {
            if(arr[j]>arr[j+1]) {
                let temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp
            }
        }
    }
    return arr   
}

mergeArr(arr01, arr02)
// 第 3 题：多种方式实现斐波那契数列
let Fibonacci1 = (n) => {
    if(n < 0 || typeof n !== 'number') throw 'illegal input parameter'
    let f0=0, f1=1, count = 2
    if(n===0) return f0
    if(n===1) return f1
    let cur = f0 + f1
    while(count <= n){
        cur = f0 + f1
        f0 = f1
        f1 = cur
        count++
    }
    return cur
}

let Fibonacci2 = (n) => {
    if(n < 0 || typeof n !== 'number') throw 'illegal input parameter'
    let f0=0, f1=1, count = 2
    if(n===0) return f0
    if(n===1) return f1
    let FibonacciGenerator = (n, count, param0, param1) => {
        if(n > count) {
            return FibonacciGenerator(n, ++count, param1, param0 + param1)
        }
        return param0 + param1
    }
    return FibonacciGenerator(n, 2, f0, f1)
}
//instanceof implementation
let instanceOf = (ins, type) => {
    while(ins!==null && ins.__proto__!==null){
        if(ins.__proto__ === type.prototype){
            return true
        }
        ins = ins.__proto__
    }
    return false
}

//Array flat
let a = [4,2,9,[8,17,[5]],0]
a.flat(Infinity)
let ArrayFlat = (arr) => {
    if(!Array.isArray(arr)){return false}
    let resArr = []
    for(let item of arr){
        if(Array.isArray(item)){
            resArr = [...resArr, ...ArrayFlat(item)]
        }
        else{
            resArr.push(item)
        }
    }
    return resArr
}
ArrayFlat(a)

//immutable, immutable是一种持久化数据。一旦被创建就不会被修改。修改immutable对象的时候返回新的immutable。但是原数据不会改变 但当你使用immutable数据的时候：只会拷贝你改变的节点，从而达到了节省性能。

/*深拷贝与浅拷贝  https://juejin.cn/post/6844904197595332622

浅拷贝是创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。

深拷贝是将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象。*/


//Promise
function shopping(resolve, reject) {
    setTimeout(function(){
        resolve('shopping');
    },3000)
}
function cooking(resolve, reject){
    setTimeout(function(){
        //对做好的饭进行下一步处理。
        resolve ('cooking')
    },3000) 
}
function sendMeal(resolve, reject){
    //对送饭的结果进行下一步处理
    resolve('sendMeal');
}

new Promise(shopping)
//用买好的菜做饭
.then((param)=>{
    console.warn(param)
    return new Promise(cooking);
})
//把做好的饭送到老婆公司
.then((param)=>{
    console.warn(param)
    return new Promise(sendMeal);
})
//送完饭后打电话通知我
.then((param)=>{
  console.warn(param)
})
//数组去重
let arr1 = [3,1,7,4,9,4,1,3]
function arraySingle1(arr){
    return arr.filter((item, index)=>arr.indexOf(item) === index)
}

function arraySingle2(arr){
    return [...new Set(arr)]
}

function arraySingle3(arr){
    let resArr = []
    for(let item of arr){
        if(!resArr.includes(item)){
            resArr.push(item)
        }
    }
    return resArr
}

//微任务 宏任务  https://juejin.cn/post/6844903655473152008
