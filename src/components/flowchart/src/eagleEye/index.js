import Util from '../util'
import EVENTS from '../event/eventdeclara'
/**
 * 鹰眼
 *
 *
 */
class EagleEye {
    constructor(main) {
        this.main = main
        this.scaleNum = 1
        this.width = 296
        this.height = 192
        this.left = 16
        this.bottom = 16
        this.initDom(main.param.dom)
        this.hide()
        main.bind(EVENTS['eagleEyeShow'], this.show)
        this.main.bind(EVENTS['mousemove'], this.mousemove)
        this.main.bind(EVENTS['mousedown'], this.mousedown)
        this.main.bind(EVENTS['mouseup'], this.mouseup)
        //拖拽功能默认不是拖拽
        this.IsOpenDrag = false
        this.isHold = false
    }
    initDom = dom => {
        this.canvasEagleEye = document.createElement('canvas')
        this.canvasEagleEye.width = this.width
        this.canvasEagleEye.height = this.height
        this.canvasEagleEye.style.position = 'absolute'
        this.canvasEagleEye.style.left = this.left + 'px'
        this.canvasEagleEye.style.bottom = this.bottom + 'px'
        this.canvasEagleEye.style.boxShadow = '0 0 2px 0 rgba(0,0,0,0.20), 0 2px 4px 0 rgba(0,0,0,0.12)'
        this.canvasEagleEye.style.borderRadius = '2px'
        dom.appendChild(this.canvasEagleEye)
        this.canvasEagleEyeCover = document.createElement('canvas')
        this.canvasEagleEyeCover.width = this.width
        this.canvasEagleEyeCover.height = this.height
        this.canvasEagleEyeCover.style.position = 'absolute'
        this.canvasEagleEyeCover.style.left = this.left + 'px'
        this.canvasEagleEyeCover.style.bottom = this.bottom + 'px'
        this.canvasEagleEye.style.boxShadow = '0 0 2px 0 rgba(0,0,0,0.20), 0 2px 4px 0 rgba(0,0,0,0.12)'
        this.canvasEagleEye.style.borderRadius = '2px'
        dom.appendChild(this.canvasEagleEyeCover)
        this.overcontract = document.createElement('div')
        this.overcontract.style.width = '24px'
        this.overcontract.style.height = '24px'
        this.overcontract.style.position = 'absolute'
        this.overcontract.style.left = '282px'
        this.overcontract.style.bottom = '177px'
        this.overcontract.style.border = '0px solid #A8A9A9'
        this.overcontract.style.display = 'none'
        this.overcontract.style.cursor = 'pointer'
        // 修改成require
        this.overcontract.style.background = `url(${require('../../res/img/over/overcontract.svg')})`
        dom.appendChild(this.overcontract)
        this.overcontract.addEventListener('mousedown', () => {
            this.hide()
        })
        this.overexpand = document.createElement('div')
        this.overexpand.style.width = '24px'
        this.overexpand.style.height = '24px'
        this.overexpand.style.position = 'absolute'
        this.overexpand.style.left = '16px'
        this.overexpand.style.bottom = '16px'
        this.overexpand.style.border = '0px solid #A8A9A9'
        this.overexpand.style.display = 'block'
        this.overexpand.style.cursor = 'pointer'
        // 修改成require
        this.overexpand.style.background = `url(${require('../../res/img/over/overexpand.svg')})`
        dom.appendChild(this.overexpand)
        this.overexpand.addEventListener('mousedown', () => {
            this.show()
        })
    }
    /**
     *
     */
    draw = (alwaysDraw = false) => {
        if (this.overcontract.style.display == 'none' && !alwaysDraw) {
            return
        }
        let ctx = this.canvasEagleEye.getContext('2d')
        Util.clearCanvasDrawBack(ctx, this.canvasEagleEye.width, this.canvasEagleEye.height, 'rgba(26,29,36,1)')
        this.main.chart.drawEles(ctx, this.scaleNum, false)
        this.resizeEagle(this.canvasEagleEye, this.canvasEagleEyeCover)
    }
    /**
     *
     */
    resizeEagle = (canvasEagleEye, canvasEagleEyeCover) => {
        let ctx = canvasEagleEye.getContext('2d')
        let datas = this.main.datas
        let eWidth = this.main.param.node.nodeStyle.eWidth
        let eHeight = this.main.param.node.nodeStyle.eHeight
        let canvasWidth = canvasEagleEye.width
        let canvasHeight = canvasEagleEye.height
        //获得最小矩形
        let { minX, minY, maxX, maxY } = Util.getExtent(datas, eWidth, eHeight)
        if (
            typeof minX == 'undefined' ||
            typeof minY == 'undefined' ||
            typeof maxX == 'undefined' ||
            typeof maxY == 'undefined'
        ) {
            return false
        }
        let centerX = minX + (maxX - minX) / 2
        let centerY = minY + (maxY - minY) / 2
        //判断长宽比
        let bl = canvasWidth / canvasHeight
        let dagBl = (maxX - minX) / (maxY - minY)
        let num = 1
        //宽为主
        if (dagBl > bl) {
            num = (maxX - minX) / canvasWidth
        } else {
            //高为主
            num = (maxY - minY) / canvasHeight
        }
        //num值要进行翻转和大小缩放倍数
        num = (1 / num) * 0.8
        //解决只有单个时，导致的放大过量的问题,鹰眼中没有必要这样
        /*
        if (datas.length == 1){
            num = 1
        }
        */
        let panX = canvasWidth / 2 - centerX * num
        let panY = canvasHeight / 2 - centerY * num
        let scaleNum = num
        if (isNaN(scaleNum)) {
            scaleNum = 1
            panX = 0
            panY = 0
        }
        this.scaleNum = scaleNum
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.scale(scaleNum, scaleNum)
        ctx.translate(panX / scaleNum, panY / scaleNum)
        //画当前的可视区域
        let canvasF = this.main.chart.canvas
        let tminX = (0 - panX) / scaleNum
        let tminY = (0 - panY) / scaleNum
        let tmaxX = (canvasEagleEye.width - panX) / scaleNum
        let tmaxY = (canvasEagleEye.height - panY) / scaleNum
        let canvasScaleTranslate = {}
        this.main.triggerEvent(EVENTS['getCanvasScaleTranslate'], canvasScaleTranslate)
        let start = Util.leftRight2Canvas(
            0,
            0,
            canvasScaleTranslate.panX,
            canvasScaleTranslate.panY,
            canvasScaleTranslate.scaleNum
        )
        let end = Util.leftRight2Canvas(
            canvasF.width,
            canvasF.height,
            canvasScaleTranslate.panX,
            canvasScaleTranslate.panY,
            canvasScaleTranslate.scaleNum
        )
        let innerStart = {}
        let innerEnd = {}
        let isOnlyBlack = false
        //如果大图超出了范围，则不必绘制当前空白区域
        if (start.x > maxX || start.y > maxY || end.x < minX || end.y < minY) {
            //只绘制未覆盖区域
            isOnlyBlack = true
        }
        if (start.x < minX) {
            innerStart.x = tminX
        } else {
            innerStart.x = start.x
        }
        if (start.y < minY) {
            innerStart.y = tminY
        } else {
            innerStart.y = start.y
        }
        if (end.x < maxX) {
            innerEnd.x = end.x
        } else {
            innerEnd.x = tmaxX
        }
        if (end.y < maxY) {
            innerEnd.y = end.y
        } else {
            innerEnd.y = tmaxY
        }
        let ctxc = canvasEagleEyeCover.getContext('2d')
        Util.clearCanvasDrawBack(
            ctxc,
            this.canvasEagleEyeCover.width,
            this.canvasEagleEyeCover.height,
            'rgba(255,255,255,0)'
        )
        ctxc.setTransform(1, 0, 0, 1, 0, 0)
        ctxc.scale(scaleNum, scaleNum)
        ctxc.translate(panX / scaleNum, panY / scaleNum)
        if (isOnlyBlack) {
            //先绘制全部
            ctxc.fillStyle = 'rgba(155,155,155,0.3)'
            ctxc.fillRect(tminX, tminY, tmaxX - tminX, tmaxY - tminY)
        } else {
            ctxc.save()
            ctxc.fillStyle = 'rgba(155,155,155,0.3)'
            ctxc.fillRect(tminX, tminY, tmaxX - tminX, tmaxY - tminY)
            ctxc.globalCompositeOperation = 'destination-out'
            ctxc.fillStyle = 'yellow'
            ctxc.fillRect(innerStart.x, innerStart.y, innerEnd.x - innerStart.x, innerEnd.y - innerStart.y)
            ctxc.restore()
        }
    }
    show = () => {
        this.main.triggerEvent(EVENTS['saveCovers'], 'eye', {
            left: this.left,
            bottom: this.bottom,
            width: this.width,
            height: this.height
        })
        this.canvasEagleEye.style.display = 'block'
        this.canvasEagleEyeCover.style.display = 'block'
        this.overcontract.style.display = 'block'
        this.overexpand.style.display = 'none'
        setTimeout(() => {
            this.IsOpenDrag = true
        }, 100)
    }
    hide = () => {
        this.main.triggerEvent(EVENTS['deleteCovers'], 'eye')
        this.canvasEagleEye.style.display = 'none'
        this.canvasEagleEyeCover.style.display = 'none'
        this.overcontract.style.display = 'none'
        this.overexpand.style.display = 'block'
        this.IsOpenDrag = true
    }
    /**
     * 鹰眼拖拽功能
     */
    mousedown = e => {
        let dom = this.main.param.dom
        let height = dom.clientHeight - 0
        let maxx = this.left + this.width
        let maxy = height - this.bottom
        let minx = this.left
        let miny = maxy - this.height
        if (!this.IsOpenDrag || e.x < minx || e.x > maxx || e.y < miny || e.y > maxy) {
            return
        }
        //this.isHold = true
        this.start = {
            x: e.x,
            y: e.y
        }
    }
    mousemove = e => {
        if (!this.IsOpenDrag || this.isHold == false) {
            return
        }
        this.end = {
            x: e.x,
            y: e.y
        }
        let translateX = this.end.x - this.start.x
        let translateY = this.end.y - this.start.y

        this.main.chart.panType(translateX, translateY, this.scaleNum)
    }
    mouseup = () => {
        //this.isHold = false
        if (!this.IsOpenDrag) {
            return
        }
    }
}
export default EagleEye
