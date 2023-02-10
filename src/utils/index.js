import { isArray } from 'lodash'

// 拍平树
export const flatTree = (source, result = []) => {
    source.forEach(el => {
        result.push(el)
        if (isArray(el.children) && el.children.length > 0) {
            flatTree(el.children, result)
        }
    })
    return result
}
