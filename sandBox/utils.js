const { resolve } = require("path")
const { func } = require("prop-types")

const deepCopy = (param) => {
    let copy = null
    if(param instanceof Array){
        copy = [...param]
    }
    else if(typeof param === 'object' && param!==null){
        copy = {}
        Object.keys(param).forEach(key=>{
            if(typeof param[key] === 'object'){
                copy[key] = deepCopy(param[key])
            }
            else{
                copy[key] = param[key]
            }
        })
    }
    else{
        copy = param
    }
    return copy
}

const throtle = (func, delay) => {
    let valid = true
    return () => {
        if(valid){
            valid = false
            func()
            setTimeout(()=>{
                valid = true
            }, delay)
        }
    }
}

const debounce = (func, delay) => {
    let timer = null
    return () => {
        if(timer) {
            clearTimeout(timer)
            timer = setTimeout(func, delay)
        }
        else {
            timer = setTimeout(func, delay)
        }
    }
}

const PromiseAll = (param) => {
    if(Array.isArray(param)){
        return new Promise((resolve, reject)=>{
            let result = []
            param.forEach(item=>{
                if(item instanceof Promise){
                    item.then(data=>{
                        result.push(data)
                        if(result.length===param.length){
                            resolve(result)
                        }
                    })          
                }   
                else{
                    result.push(item)
                    if(result.length===param.length){
                        resolve(result)
                    }
                }
            })
        })
    }
    else {
        throw Error('param should be an Array')
    }
}

const PromiseRace = (param) => {
    if(Array.isArray(param)){
        return new Promise((resolve, reject)=>{
            param.forEach(item=>{
                if(item instanceof Promise){
                    item.then(data=>{
                            resolve(data)
                    })          
                }   
                else{
                    resolve(item)
                }
            })
        })
    }
    else {
        throw Error('param should be an Array')
    }
}

// inheritance
function Animal(){
    this.status = 'live'
}

function Cat(name, age){
    Animal.call(this)
    this.name = name
    this.age = age
    getName = () => {
        return this.name
    }
}

Cat.prototype = new Animal()
Cat.prototype.constructor = Cat

class Singleton1{
    constructor(){
        if(!Singleton1.instance){
            Singleton1.instance = this
        }
        return Singleton1.instance
    }
}

let s1 = new Singleton1(1)
let s2 = new Singleton2(2)

function Singleton2(){}

Singleton2.getInstance = () => {
    if(!Singleton2.instance) Singleton2.instance = new Singleton2()
    return Singleton2.instance
}

let s2_1 = Singleton2.getInstance(1)
let s2_2 = Singleton2.getInstance(2)

class myPromise{
    constructor(executor){
        this.status = 'pending'
        this.value = undefined
        this.reason = undefined
        this.onResolvedCallbacks = []
        this.onRejectedCallbacks= []
        let resolve = (value) => {
            if(this.status === 'pending'){
                this.value = value
                this.status = 'fullfilled'
                this.onResolvedCallbacks.forEach(fn=>fn());
            }
        }

        let reject = (reason) => {
            if(this.status === 'pending'){
                this.reason = reason
                this.status = 'rejected'
                this.onRejectedCallbacks.forEach(fn=>fn());
            }
        }

        try{
            executor(resolve, reject)
        }
        catch(err){
            reject(err)
        }
    }
    
    then(onFullFilled, onRejected){
        if(this.status === 'fullfilled'){
            onFullFilled(this.value)
        }
        else if(this.status === 'rejected'){
            onRejected(this.reason)
        }
        else if (this.status === 'pending') {
            // 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
            this.onResolvedCallbacks.push(() => {
                onFullFilled(this.value)
            });
      
            // 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
            this.onRejectedCallbacks.push(()=> {
                onRejected(this.reason)
            })
          }
    }
}
