import object from 'lodash/fp/object'
import uuid from 'node-uuid'
class Util {
    constructor() {}
    /**
     * 深度克隆
     */
    static deepClone = obj => {
        var proto = Object.getPrototypeOf(obj)
        return Object.assign({}, Object.create(proto), obj)
    }
    /**
     * 深度覆盖 获得原始对象没有的内容，并替换原始对象里面没有的
     * original 原始对象
     * substitute 代替对象
     */
    static deepCover = (original, substitute) => {
        //使用lodash扩展
        return object.defaultsDeep(original, substitute)
    }
    /**
     * 深度覆盖 获得原始对象没有的内容，并替换原始对象里面没有的
     * original 原始对象
     * substitute 代替对象
     */
    static assign = (original, substitute) => {
        //使用lodash扩展
        return object.assign(original, substitute)
    }
    /**
     * 深度覆盖 获得原始对象没有的内容，并合并替换原始对象里面有的内容
     * original 原始对象
     * substitute 代替对象
     */
    static merge = (original, substitute) => {
        return object.merge(original, substitute)
    }
    /**
     * 获得唯一id，根据时间获得，且移除-
     *
     */
    static getUuid = () => {
        let id = uuid.v1()
        id = id.replace(/\-/g, '')
        return id
    }
    /**
     * 是否包含属性
     * obj
     * {string} attrName
     */
    static isContain = (obj, attrName) => {
        if (Array.isArray(obj)) {
            if (obj.indexOf(attrName) > -1) {
                return true
            }
            if (typeof attrName.length != 'undefined') {
                if (obj.indexOf(parseInt(attrName)) > -1) {
                    return true
                }
            }
        } else if (obj && typeof obj[attrName] != 'undefined') {
            return true
        } else {
            return false
        }
    }
    /**
     * 根据左上角坐标 和节点的宽高，获得全部节点的坐标范围
     * data.position.x data.position.y
     */
    static getExtent = (datas, eWidth, eHeight) => {
        let minX, minY, maxX, maxY
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i]
            //假定x y 都是存在的，数据需要处理掉，没有坐标则为null
            let x = data.position.x
            let y = data.position.y
            if (x == null || y == null) {
                continue
            }
            if (i == 0) {
                minX = x
                maxX = x + eWidth
                minY = y
                maxY = y + eHeight
            } else {
                if (x < minX) {
                    minX = x
                }
                if (x + eWidth > maxX) {
                    maxX = x + eWidth
                }
                if (y < minY) {
                    minY = y
                }
                if (y + eHeight > maxY) {
                    maxY = y + eHeight
                }
            }
        }
        return { minX, minY, maxX, maxY }
    }
    /**
     * 清空画布然后绘制背景色
     * @param {*} ctx
     * @param {*} width
     * @param {*} height
     * @param {*} color
     */
    static clearCanvasDrawBack = (ctx, width, height, color) => {
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, width, height)
        if (color) {
            ctx.fillStyle = color
        } else {
            ctx.fillStyle = '#FFFFFF'
        }
        ctx.fillRect(0, 0, width, height)
        ctx.restore()
    }
    /**
     * 设置样式，需要特殊处理一些样式设置
     * @param {*} ctx
     * @param {*} style
     */
    static setStyle = (ctx, style, start, end) => {
        for (let name in style) {
            if (name == 'lineDash') {
                ctx.setLineDash(style['lineDash'])
            } else if (name == 'fillStyle' && Array.isArray(style[name]) && start && end) {
                let gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y)
                let fillStyle = style[name]
                for (let i = 1; i < fillStyle.length; i += 2) {
                    gradient.addColorStop(fillStyle[i], fillStyle[i + 1])
                }
                ctx.fillStyle = gradient
            } else if (name == 'strokeStyle' && Array.isArray(style[name]) && start && end) {
                let gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y)
                let strokeStyle = style[name]
                for (let i = 1; i < strokeStyle.length; i += 2) {
                    gradient.addColorStop(strokeStyle[i], strokeStyle[i + 1])
                }
                ctx.strokeStyle = gradient
            } else {
                ctx[name] = style[name]
            }
        }
    }
    /**
     * 绘制圆角矩形
     * @param {object} ctx 画布上下文
     * @param {*} x 经度
     * @param {*} y 纬度
     * @param {*} w 宽度
     * @param {*} h 高度
     * @param {*} r 圆角半径
     */
    static drawRoundRect = (ctx, x, y, w, h, r) => {
        if (w < 2 * r) {
            r = w / 2
        }
        if (h < 2 * r) {
            r = h / 2
        }
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.arcTo(x + w, y, x + w, y + h, r)
        ctx.arcTo(x + w, y + h, x, y + h, r)
        ctx.arcTo(x, y + h, x, y, r)
        ctx.arcTo(x, y, x + w, y, r)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    }
    /**
     * 绘制文本超出长度时显示。。
     * @param {*} ctx
     * @param {*} x
     * @param {*} y
     * @param {*} text
     * @param {*} length
     */
    static drawText(ctx, x, y, text, textStyle, length) {
        this.setStyle(ctx, textStyle)
        let textLength = ctx.measureText(text).width
        if (textLength > length) {
            text = text.substr(0, text.length - 1) + '...'
            let textLength = ctx.measureText(text).width
            while (textLength > length) {
                text = text.substr(0, text.length - 4) + '...'
                textLength = ctx.measureText(text).width
            }
        }
        ctx.fillText(text, x, y)
        return {
            textLength: ctx.measureText(text).width,
            x,
            y
        }
    }
    /**
     * 绘制圆
     * @param {*} ctx
     * @param {*} x
     * @param {*} y
     * @param {*} r
     * @param {*} start
     * @param {*} end
     */
    static drawCircle(ctx, x, y, r, start, end) {
        let unit = Math.PI / 180
        ctx.beginPath()
        ctx.arc(x, y, r, start * unit, end * unit)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    }
    /**
     * 绘制箭头 ，当height为负时为上箭头，为正时为下箭头
     * @param {*} ctx
     * @param {*} x
     * @param {*} y
     * @param {*} width
     * @param {*} height
     */
    static drawArrow(ctx, x, y, width, height) {
        let x0 = x - width / 2
        let x1 = x + width / 2
        let x2 = x
        let y0 = y
        let y1 = y
        let y2 = y + height
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    }
    /**
     * 鼠标事件坐标对应画布上的左上角坐标
     * @param {*} canvas 画布canvas
     * @param {*} x 鼠标事件坐标
     * @param {*} y 鼠标事件坐标
     */
    static windowToCanvasLeftRight(canvas, x, y) {
        let bbox = canvas.getBoundingClientRect()
        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height)
        }
    }
    /**
     * 画布左上角坐标转换至画布的内部坐标
     * @param {*} x 画布相对左上角的坐标
     * @param {*} y 画布相对左上角的坐标
     * @param {*} panX 当前画布的偏移量
     * @param {*} panY 当前画布的偏移量
     * @param {*} scaleNum 缩放值
     */
    static leftRight2Canvas(x, y, panX, panY, scaleNum) {
        return {
            x: (x - panX) / scaleNum,
            y: (y - panY) / scaleNum
        }
    }
    /**
     * 画布的内部坐标转换至画布左上角坐标
     * @param {*} x 画布内部的坐标
     * @param {*} y 画布内部的坐标
     * @param {*} panX 当前画布的偏移量
     * @param {*} panY 当前画布的偏移量
     * @param {*} scaleNum 缩放值
     */
    static canvas2LeftRight(x, y, panX, panY, scaleNum) {
        return {
            x: x * scaleNum + panX,
            y: y * scaleNum + panY
        }
    }
    /**
     * 是否在画布范围内
     * left 相对于画布内的左上角距离
     * top 相对于画布内的左上角距离
     */
    static isInCanvas(canvas, left, top) {
        let width = canvas.width
        let height = canvas.height
        if (left >= 0 && left <= width && top >= 0 && top <= height) {
            return true
        }
        return false
    }
    /**
     * 获得圆上一点
     * @param {*} x
     * @param {*} y
     * @param {*} r
     * @param {*} deg 度 [-180,180] 从头上开始
     */
    static getCirclePoint(x, y, r, deg) {
        return {
            x: x + r * Math.cos((deg * Math.PI) / 180),
            y: y + r * Math.sin((deg * Math.PI) / 180)
        }
    }
}

export default Util
