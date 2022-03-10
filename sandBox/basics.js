let person = function(){}
p1 = person()       //作为函数调用
p2 = new person()   //作为构造函数调用
console.log('p1:', p1, 'p2', p2)

let warning = (param)=>{
  console.warn(param)
}
let log = (param)=>{
  console.log(param)
}
warning(3)
log(7)
// export {log: log, warning: warning}
const throttle = (func, delay) => {
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
        if(timer){
            clearTimeout(timer)
            timer = setTimeout(func, delay)
        }
        else {
            timer = this.setTimeout(func, delay)
        }
    }
}
