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

let pr1 = new Promise((res, rej)=>{ setTimeout(()=>{console.log('pr1 finished'); res(1)}, 2000)})
let pr2 = new Promise((res, rej)=>{ setTimeout(()=>{console.log('pr2 finished'); res(2)}, 3000)})
let pr3 = new Promise((res, rej)=>{ setTimeout(()=>{console.log('pr3 finished'); res(3)}, 5000)})
let pr4 = new Promise((res, rej)=>{ setTimeout(()=>{console.log('pr4 rejected'); rej(4)}, 2500)})
Promise.all([pr1, pr2, pr3]).then((res)=>{ console.log('all finished', res)})
Promise.all([pr1, pr2, pr3, pr4]).then(res=>{console.log('all finnished', res)}, rej=>{console.warn('failed', rej)})

Promise.race([pr1, pr2, pr3, pr4]).then(res=>{console.log('winner', res)}, rej=>{console.log('fail', rej)})
Promise.allSettled([pr1, pr2, pr3, pr4]).then(res=>{console.log('allSettled', res)}, rej=>{console.log('fail', rej)})

