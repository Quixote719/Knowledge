let p1 = function(cb){
    return new Promise((resolve, reject)=>{setTimeout(()=>cb(), 1000); resolve('p1 log')})
}

let p2 = function(cb){
    return new Promise((resolve, reject)=>{setTimeout(()=>cb(), 1000); resolve('p2 log')})
}

let p3 = function(cb){
    return new Promise((resolve, reject)=>{setTimeout(()=>cb(), 1000); reject('p3 log')})
}

let cb1 = ()=>{console.warn('story')}
let cb2 = ()=>{console.warn('legend')}
let cb3 = ()=>{console.warn('myth')}
p1(cb1).then(p2(cb2)).then(p3(cb3))