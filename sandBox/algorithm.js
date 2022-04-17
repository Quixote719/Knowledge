const quickSort = (nums) => {
    start = 0, end = nums.length-1
    const quickNumSort = (arr, start, end) => {
        if(start>=end) return 
        let l = start, r = end, target = arr[l]
        while(l<r){
            while(l<r && arr[r]>=target){
                r--
            }
            while(l<r && arr[l]<=target){
                l++
            }
            [arr[l], arr[r]] = [arr[r], arr[l]]
        }
        [arr[start], arr[r]] = [arr[r], arr[start]]
        quickNumSort(arr, start, l-1)
        quickNumSort(arr, l+1, end)
    }
    quickNumSort(nums, start, end)
}

//let ar1 =[9,3,1,7,4,8,2,6,12,10]

const ishtmlValid = (param) => {
    let n = param.length, check = true, closed = true, tBeginIndex, tEndIndex, tagStack = [], firstHalf=false
    for(let i = 0; i < n; i++){
        if(param[i] === '<'){
            if(closed){
                closed = false;
                tBeginIndex = i
                if(!firstHalf){
                    if(param[i+1]!=='/'){
                        firstHalf = true
                    }
                }
            }
            else{
                return false
            }
        }
        else if(param[i] === '>'){
            if(!closed){
                closed = true
                let tag = param.substr(tBeginIndex, i-tBeginIndex+1)
                if(firstHalf){
                    tagStack.push(tag)
                    firstHalf = false
                } 
            }
            else {
                return false
            }
        }
        else if(param[i] === '/'){
            let endTagContent = '', cur = i+1
            while(param[cur]!=='>' && cur < n){
                endTagContent += param[cur]
                cur++
            }
            let beginTag = tagStack.pop()
            if(!beginTag) return false
            else {
                let beginTagContent = beginTag.split('').filter(item=>item!=='<'&&item!=='>').join('')
                if(beginTagContent !== endTagContent) return false
            } 
        } 
    }
    return tagStack.length === 0
}

const sortByFre = (param) => {
    let strMap = {}, n = param.length, res = ''
    for(let i = 0; i < n; i++) {
        if(!strMap[param[i]]) strMap[param[i]] = 1
        else strMap[param[i]]++
    }
    let mapKeyOrder = Object.keys(strMap).sort((a, b) => strMap[b] - strMap[a] !== 0 ? strMap[b] - strMap[a] : ( a > b ? 1 : -1))
    mapKeyOrder.forEach(key => { res += key.repeat(strMap[key])})
    return res
}