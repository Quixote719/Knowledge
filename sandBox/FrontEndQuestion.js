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

