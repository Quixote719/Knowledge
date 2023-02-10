import { message } from 'antdForHik'

import { getToken } from '@/utils/auth'
/* eslint-disable */
const JSONbig = require('json-bigint')({ storeAsString: true })
/* eslint-enable */

// const { backend_host } = window
const doFetch = (url, param = {}) => {
    // if (!url.startsWith('http://') && !param.noCrossOrigin) {
    //     url = backend_host + url
    // }
    let method = param.method || 'get'
    const token = getToken() || '123'
    let headers = {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        'X-User-Id': token
    }

    let commonHeader = {
        mode: 'cors'
    }
    if (method.toLowerCase() === 'get') {
        return fetch(url, {
            headers,
            ...commonHeader
        }).catch(err => {
            console.warn(err)
        })
    } else {
        let payload = param.payload || {}
        // let contentType = param.contentType || null
        // if (!contentType) {
        //     // let params = new FormData()
        //     // for (let key in payload) {
        //     //     params.append(`${key}`, payload[key])
        //     // }
        //     return fetch(url, {
        //         headers,
        //         method: method.toLowerCase(),
        //         ...commonHeader,
        //         body: params
        //     }).catch(e => {
        //         console.warn(e)
        //     })
        // }
        payload = typeof payload === 'string' ? payload : JSON.stringify(payload)

        return fetch(url, {
            method: method,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            ...commonHeader,
            body: payload
        }).catch(err => {
            console.warn(err)
        })
    }
}

const fetchProxy = async (url, param = {}) => {
    try {
        let res = await doFetch(url, param)
        // if (res) {
        if (res.status !== 200) {
            let data = {}
            let msg
            try {
                data = await res
                msg = data.message || data.msg || '服务器运行异常'
            } catch (e) {
                // message.error('服务器运行异常')
                console.error(e, 'error')
                // throw new Error('服务器运行异常')
            }
            if (data.code === '0x00e30013') {
                message.destroy()
                message.error(msg)
                // logout()
                return
            }
            switch (res.status) {
                case 404:
                    message.error('服务器地址或资源不存在')
                    break
                case 400:
                    message.error(msg || '接口请求异常')
                    break
                case 401: {
                    message.destroy()
                    message.error(msg)
                    // logout()
                    break
                }
                case 422: {
                    if (data.data && Array.isArray(data.data.list)) {
                        return data
                    }
                    message.error(msg || '服务器运行异常')
                    break
                }
                default:
                    message.error(msg || '服务器运行异常')
                    break
            }
        }
        if (param.file) {
            const blob = await res.blob()
            const a = document.createElement('a')
            const url = window.URL.createObjectURL(blob)
            const filename = res.headers.get('Content-Disposition').split('filename=')[1]
            a.href = url
            a.download = filename
            a.click()
            window.URL.revokeObjectURL(url)
        } else {
            const text = await res.text()
            // console.log(res)
            return JSONbig.parse(text)
            // return {}
        }
        // }
    } catch (err) {
        //此处try-catch只处理 HttpError，其余Error交给外层的try-catch
        if (!param.noErrorTip) {
            // errTip(err.toString())
            message.destroy()
            message.error(err.toString())
        }
        throw err
    }
}

export default fetchProxy
