let p1 = new Promise((resolve, reject)=>{
    console.log('p1')
    resolve('resolve p1')
})

let p2 = new Promise((resolve, reject)=>{
    console.log('p2')
    resolve('resolve p2')
})

let p3 = new Promise((resolve, reject)=>{
    console.log('p3')
    resolve('resolve p3')
})

async function f01(){
    let a1 = await(Promise.resolve(101))
    console.log(a1)
    let a2 = await(Promise.resolve(103))
    console.log(a2)
    let a3 = await(Promise.resolve(105))
    console.log(a3)
    return 'async'
}

console.log('start')

setTimeout(()=>{
    console.log('setTimeout')
})

p1.then(data=>{
    console.log(data)
    return 'p1 then1'
}).then(data=>{
    console.log(data)
    return Promise.resolve('async p2 then2')
}).then(data=>{
    console.log(data)
    new Promise((resovle, reject)=>{
        resovle('pip')
    }).then(data=>console.log(data))
    return 'p1 then3'
}).then(data=>{
    console.log(data)
})

p2.then(data=>{
    console.log(data)
    new Promise((resolve, reject)=>{console.log(resolve('p2 belly'))}).then(p3data=>console.log(p3data))
})
f01().then(data=>console.log(data)).then(data=>console.log(data)).then(data=>console.log(data))
console.log('end')