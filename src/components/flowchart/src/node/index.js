import Util from '../util'
import EVENTS from '../event/eventdeclara'
class Node {
    constructor(chart) {
        this.chart = chart
        this.ctx = chart.ctx
        this.updataConfig()
        this.STARTEXEARC = 0
        this.chart.main.bind(EVENTS['updataConfig'], this.updataConfig)
    }
    /**
     * 更新参数配置，方便改样式
     */
    updataConfig = () => {
        this.config = this.chart.main.param.node
        this.nodeStyle = this.chart.main.param.node.nodeStyle
        this.inPortStyle = this.chart.main.param.node.inPortStyle
        this.outPortStyle = this.chart.main.param.node.outPortStyle
        this.classInfo = this.chart.main.param.classInfomation.classInfo
        this.IMGS = this.chart.main.global.IMGS
    }
    /**
     * 绘制新增
     */
    drawAddNew(ctx) {
        if (this.chart.isAddNode && this.chart.addParam && this.chart.addPos) {
            let dataClass = this.getClass(this.chart.addParam)
            let x = this.chart.addPos.x
            let y = this.chart.addPos.y
            //设置id为空
            let id = ''
            //绘制 传空id
            this.setStyleNode(ctx, id)
            //画边框
            this.drawNodeBorderBack(ctx, x, y)
            let incount = dataClass.input.length
            let outcount = dataClass.output.length
            //先绘制类型图
            this.drawTypeImg(ctx, x, y, dataClass.image)
            let name = this.chart.addParam.name
            if (typeof name == 'undefined' || name == '') {
                name = dataClass.name
            }
            //绘制中间的名称 //不过要根据是否有状态来设置名称的动态长度
            let textConfig = this.config.nodeStyle.text
            Util.drawText(
                ctx,
                x + textConfig.offsetX,
                y + textConfig.offsetY,
                name,
                textConfig.style,
                textConfig.textLength
            )
            //绘制输入输出
            this.drawinout(ctx, incount, outcount, x, y, id)
        }
    }
    /**
     * 绘制节点
     */
    drawNode(ctx, scaleNum, isOnlyScreen) {
        this.STARTEXEARC = (new Date().getMilliseconds() * 2) / 1000
        let datas = this.chart.main.datas
        let textConfig = this.config.nodeStyle.text
        //获得外框范围
        let canvasScaleTranslate = {}
        this.chart.main.triggerEvent(EVENTS['getCanvasScaleTranslate'], canvasScaleTranslate)
        let start = Util.leftRight2Canvas(
            0,
            0,
            canvasScaleTranslate.panX,
            canvasScaleTranslate.panY,
            canvasScaleTranslate.scaleNum
        )
        let end = Util.leftRight2Canvas(
            this.chart.canvas.width,
            this.chart.canvas.height,
            canvasScaleTranslate.panX,
            canvasScaleTranslate.panY,
            canvasScaleTranslate.scaleNum
        )
        let w = this.nodeStyle.eWidth
        let h = this.nodeStyle.eHeight
        let startN, endN
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i]
            let id = data.id
            let x = data.position.x
            let y = data.position.y
            let dataClass = this.getClass(data)
            if (!dataClass) {
                continue
            }
            if (isOnlyScreen) {
                startN = { x: x, y: y }
                endN = { x: x + w, y: y + h }
                //判断组件是否和屏幕相交,逻辑修复
                if (
                    !(
                        Math.max(startN.x, start.x) <= Math.min(endN.x, end.x) &&
                        Math.max(startN.y, start.y) <= Math.min(endN.y, end.y)
                    )
                ) {
                    continue
                }
            }
            let incount = dataClass.input.length
            let outcount = dataClass.output.length
            //test 测试自定义的覆盖样式
            // data.fixedStyle = {
            //     fillStyle : '#CCCCCC'
            // }
            //设置固定样式
            let fixedStyle = typeof data.fixedStyle == 'undefined' ? null : data.fixedStyle
            let image = typeof data.fixedImage == 'undefined' ? dataClass.image : data.fixedImage
            let style = this.setStyleNode(ctx, id, scaleNum, fixedStyle)
            //渐变色支持
            if (Util.isContain(style, 'fillStyle') && Array.isArray(style.fillStyle)) {
                let r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2))
                let x0 = x + w / 2
                let y0 = y + h / 2
                //起点角度
                let startDeg = style.fillStyle[0]
                //终点角度
                let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                //获得起点和终点
                let start = Util.getCirclePoint(x0, y0, r, startDeg)
                let end = Util.getCirclePoint(x0, y0, r, endDeg)
                Util.setStyle(ctx, { fillStyle: style.fillStyle }, start, end)
            }
            if (Util.isContain(style, 'strokeStyle') && Array.isArray(style.strokeStyle)) {
                let r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2))
                let x0 = x + w / 2
                let y0 = y + h / 2
                //起点角度
                let startDeg = style.strokeStyle[0]
                //终点角度
                let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                //获得起点和终点
                let start = Util.getCirclePoint(x0, y0, r, startDeg)
                let end = Util.getCirclePoint(x0, y0, r, endDeg)
                Util.setStyle(ctx, { strokeStyle: style.strokeStyle }, start, end)
            }

            //画边框
            this.drawNodeBorderBack(ctx, x, y)

            //绘制中间的名称 //不过要根据是否有状态来设置名称的动态长度
            let isShowText = false
            if (this.nodeStyle.text.isScaleShow) {
                //添加显示的缩放值。当大于scaleNum值时才显示文字
                if (scaleNum > this.nodeStyle.text.scaleNum) {
                    isShowText = true
                }
            } else {
                isShowText = true
            }
            if (isShowText) {
                //先绘制类型图
                this.drawTypeImg(ctx, x, y, image)
                Util.drawText(
                    ctx,
                    x + textConfig.offsetX,
                    y + textConfig.offsetY,
                    data.name,
                    textConfig.style,
                    textConfig.textLength
                )
                //绘制状态
                this.drawStatus(ctx, x, y, data)
                //绘制输入输出
                this.drawinout(ctx, incount, outcount, x, y, id)
            }
        }
    }
    /**
     * 绘制状态
     */
    drawStatus(ctx, x, y, data) {
        let imageCfg = this.nodeStyle.statusImg
        let runStatusCfg = this.config.runStatus
        let runStatus = null
        let status = data.status
        let isParamValid = data.isParamValid
        if (typeof runStatusCfg[status] != 'undefined') {
            runStatus = runStatusCfg[status]
        } else if (typeof isParamValid != 'undefined') {
            if (!isParamValid) {
                runStatus = runStatusCfg['invalid']
                //提示不能运行 参数无效
                data.runStatus = runStatus.tip
            }
        } else {
            runStatus = runStatusCfg['NON_EXECUTE']
        }
        let url = runStatus.img

        // let urlPrefix = imageCfg.urlPrefix
        let urlSuffix = imageCfg.urlSuffix
        let size = imageCfg.size
        let left = imageCfg.left
        let top = imageCfg.top
        let IMGS = this.IMGS
        //提示
        data.runStatus = runStatus.tip
        //绘制动画
        if (url == 'executing') {
            this.drawExeing(
                ctx,
                x + left + 6,
                y + top + 6,
                6,
                this.STARTEXEARC * Math.PI,
                this.STARTEXEARC * Math.PI + 0.7 * Math.PI
            )
            return
        }

        if (typeof IMGS[url] == 'undefined') {
            let img = new Image()
            if (url.indexOf('.') > -1) {
                url = url.substring(0, url.indexOf('.'))
            }
            //使用图片的前缀后缀, 修改成require
            // img.src = urlPrefix + url + urlSuffix
            img.src = `${require('../../res/img/status/status-' + url + urlSuffix)}`
            img.onload = function (e) {
                ctx.drawImage(img, x + left, y + top, size, size)
                IMGS[url] = img
            }
            img.onerror = function (e) {
                img.src = ''
                IMGS[url] = img
            }
        } else {
            ctx.drawImage(IMGS[url], x + left, y + top, size, size)
        }
    }
    drawExeing(ctx, x, y, r, start, end) {
        ctx.beginPath()
        ctx.arc(x, y, r, start, end)
        ctx.stroke()
    }
    /**
     * 绘制图标
     * @param {*} x
     * @param {*} y
     * @param {*} url
     */
    drawTypeImg(ctx, x, y, url) {
        //对于没有配置图标的组件，不渲染对于的图片
        if (!url || url == '') {
            return false
        }
        let IMGS = this.IMGS
        let image = this.nodeStyle.image
        let offsetX = image.offsetX
        let offsetY = image.offsetY
        let size = image.size
        // let urlPrefix = image.urlPrefix
        let urlSuffix = image.urlSuffix
        //去除所有图片的格式
        if (url.indexOf('.') > -1) {
            url = url.substring(0, url.indexOf('.'))
        }
        if (typeof IMGS[url] == 'undefined') {
            let img = new Image()
            if (url.indexOf('.') > -1) {
                url = url.substring(0, url.indexOf('.'))
            }
            //使用图片的前缀后缀, 修改成require
            // img.src = urlPrefix + url + urlSuffix
            img.src = `${require('../../res/img/menutype/' + url + urlSuffix)}`
            // console.log(img.src, urlPrefix, 'img.src ')
            img.onload = function (e) {
                ctx.drawImage(img, x + offsetX, y + offsetY, size, size)
                IMGS[url] = img
            }
            img.onerror = function (e) {
                img.src = ''
                IMGS[url] = img
            }
        } else {
            ctx.drawImage(IMGS[url], x + offsetX, y + offsetY, size, size)
        }
    }
    /**
     * 绘制输入输出接口
     * @param {*} incount
     * @param {*} outcount
     * @param {*} x
     * @param {*} y
     * @param {*} dataid
     */
    drawinout(ctx, incount, outcount, x, y, dataid) {
        let w = this.nodeStyle.eWidth
        let h = this.nodeStyle.eHeight
        let starts = this.chart.starts
        let ends = this.chart.ends
        //几个入口则分N+1段，每段长度为
        let incountOneLength = w / (incount + 1)
        let inPortStyle = this.chart.main.param.node.inPortStyle
        let outPortStyle = this.chart.main.param.node.outPortStyle
        for (let i = 0; i < incount; i++) {
            let oneX = x + (i + 1) * incountOneLength
            let oneY = y
            let pid = dataid + '-' + i
            let style = this.setStyleInPort(ctx, pid)
            if (Util.isContain(ends, pid)) {
                if (inPortStyle.shape.connect == 'arrow') {
                    //为背景渐变做准备

                    if (Util.isContain(style, 'fillStyle') && Array.isArray(style.fillStyle)) {
                        //做为三角的话也是换算为圆处理
                        let r = inPortStyle.arrowHeight / 2
                        let x0 = x
                        let y0 = y + inPortStyle.arrowHeight / 2
                        //起点角度
                        let startDeg = style.fillStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { fillStyle: style.fillStyle }, start, end)
                    }
                    //为边框渐变做准备
                    if (Util.isContain(style, 'strokeStyle') && Array.isArray(style.strokeStyle)) {
                        //做为三角的话也是换算为圆处理
                        let r = inPortStyle.arrowHeight / 2
                        let x0 = x
                        let y0 = y + inPortStyle.arrowHeight / 2
                        //起点角度
                        let startDeg = style.strokeStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { strokeStyle: style.strokeStyle }, start, end)
                    }
                    //画下箭头
                    Util.drawArrow(ctx, oneX, oneY, inPortStyle.arrowWidth, inPortStyle.arrowHeight)
                } else {
                    //为渐变做准备
                    if (Util.isContain(style, 'fillStyle') && Array.isArray(style.fillStyle)) {
                        //做为圆
                        let r = inPortStyle.normalRadius
                        let x0 = oneX
                        let y0 = oneY
                        //起点角度
                        let startDeg = style.fillStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { fillStyle: style.fillStyle }, start, end)
                    }
                    //为边框渐变做准备
                    if (Util.isContain(style, 'strokeStyle') && Array.isArray(style.strokeStyle)) {
                        let r = inPortStyle.normalRadius
                        let x0 = oneX
                        let y0 = oneY
                        //起点角度
                        let startDeg = style.strokeStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { strokeStyle: style.strokeStyle }, start, end)
                    }
                    //画圆
                    Util.drawCircle(ctx, oneX, oneY, inPortStyle.normalRadius, 0, 360)
                }
            } else {
                if (inPortStyle.shape.unConnect == 'arrow') {
                    if (Util.isContain(style, 'fillStyle') && Array.isArray(style.fillStyle)) {
                        //做为三角的话也是换算为圆处理
                        let r = inPortStyle.arrowHeight / 2
                        let x0 = x
                        let y0 = y + inPortStyle.arrowHeight / 2
                        //起点角度
                        let startDeg = style.fillStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { fillStyle: style.fillStyle }, start, end)
                    }
                    //为边框渐变做准备
                    if (Util.isContain(style, 'strokeStyle') && Array.isArray(style.strokeStyle)) {
                        //做为三角的话也是换算为圆处理
                        let r = inPortStyle.arrowHeight / 2
                        let x0 = x
                        let y0 = y + inPortStyle.arrowHeight / 2
                        //起点角度
                        let startDeg = style.strokeStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { strokeStyle: style.strokeStyle }, start, end)
                    }
                    //画下箭头
                    Util.drawArrow(ctx, oneX, oneY, inPortStyle.arrowWidth, inPortStyle.arrowHeight)
                } else {
                    //为渐变做准备
                    if (Util.isContain(style, 'fillStyle') && Array.isArray(style.fillStyle)) {
                        //做为圆
                        let r = inPortStyle.normalRadius
                        let x0 = oneX
                        let y0 = oneY
                        //起点角度
                        let startDeg = style.fillStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { fillStyle: style.fillStyle }, start, end)
                    }
                    //为边框渐变做准备
                    if (Util.isContain(style, 'strokeStyle') && Array.isArray(style.strokeStyle)) {
                        let r = inPortStyle.normalRadius
                        let x0 = oneX
                        let y0 = oneY
                        //起点角度
                        let startDeg = style.strokeStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { strokeStyle: style.strokeStyle }, start, end)
                    }
                    //画圆
                    Util.drawCircle(ctx, oneX, oneY, inPortStyle.normalRadius, 0, 360)
                }
            }
        }
        let outcountOneLength = w / (outcount + 1)
        for (let i = 0; i < outcount; i++) {
            let oneX = x + (i + 1) * outcountOneLength
            let oneY = y + h
            let pid = dataid + '-' + i
            let style = this.setStyleOutPort(ctx, pid)
            if (Util.isContain(starts, pid)) {
                if (outPortStyle.shape.connect == 'arrow') {
                    //为背景渐变做准备

                    if (Util.isContain(style, 'fillStyle') && Array.isArray(style.fillStyle)) {
                        //做为三角的话也是换算为圆处理
                        let r = outPortStyle.arrowHeight / 2
                        let x0 = x
                        let y0 = y + outPortStyle.arrowHeight / 2
                        //起点角度
                        let startDeg = style.fillStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { fillStyle: style.fillStyle }, start, end)
                    }
                    //为边框渐变做准备
                    if (Util.isContain(style, 'strokeStyle') && Array.isArray(style.strokeStyle)) {
                        //做为三角的话也是换算为圆处理
                        let r = outPortStyle.arrowHeight / 2
                        let x0 = x
                        let y0 = y + outPortStyle.arrowHeight / 2
                        //起点角度
                        let startDeg = style.strokeStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { strokeStyle: style.strokeStyle }, start, end)
                    }
                    //画上箭头
                    Util.drawArrow(ctx, oneX, oneY, outPortStyle.arrowWidth, outPortStyle.arrowHeight)
                } else {
                    //为渐变做准备
                    if (Util.isContain(style, 'fillStyle') && Array.isArray(style.fillStyle)) {
                        //做为圆
                        let r = outPortStyle.normalRadius
                        let x0 = oneX
                        let y0 = oneY
                        //起点角度
                        let startDeg = style.fillStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { fillStyle: style.fillStyle }, start, end)
                    }
                    //为边框渐变做准备
                    if (Util.isContain(style, 'strokeStyle') && Array.isArray(style.strokeStyle)) {
                        let r = outPortStyle.normalRadius
                        let x0 = oneX
                        let y0 = oneY
                        //起点角度
                        let startDeg = style.strokeStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { strokeStyle: style.strokeStyle }, start, end)
                    }
                    //画圆
                    Util.drawCircle(ctx, oneX, oneY, outPortStyle.normalRadius, 0, 360)
                }
            } else {
                if (outPortStyle.shape.unConnect == 'arrow') {
                    //为渐变做准备
                    if (Util.isContain(style, 'fillStyle') && Array.isArray(style.fillStyle)) {
                        //做为三角的话也是换算为圆处理
                        let r = outPortStyle.arrowHeight / 2
                        let x0 = x
                        let y0 = y + outPortStyle.arrowHeight / 2
                        //起点角度
                        let startDeg = style.fillStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { fillStyle: style.fillStyle }, start, end)
                    }
                    //为边框渐变做准备
                    if (Util.isContain(style, 'strokeStyle') && Array.isArray(style.strokeStyle)) {
                        //做为三角的话也是换算为圆处理
                        let r = outPortStyle.arrowHeight / 2
                        let x0 = x
                        let y0 = y + outPortStyle.arrowHeight / 2
                        //起点角度
                        let startDeg = style.strokeStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { strokeStyle: style.strokeStyle }, start, end)
                    }
                    //画上箭头
                    Util.drawArrow(ctx, oneX, oneY, outPortStyle.arrowWidth, outPortStyle.arrowHeight)
                } else {
                    //为渐变做准备
                    if (Util.isContain(style, 'fillStyle') && Array.isArray(style.fillStyle)) {
                        //做为圆
                        let r = outPortStyle.normalRadius
                        let x0 = oneX
                        let y0 = oneY
                        //起点角度
                        let startDeg = style.fillStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { fillStyle: style.fillStyle }, start, end)
                    }
                    //为边框渐变做准备
                    if (Util.isContain(style, 'strokeStyle') && Array.isArray(style.strokeStyle)) {
                        //做为三角的话也是换算为圆处理
                        let r = outPortStyle.normalRadius
                        let x0 = oneX
                        let y0 = oneY
                        //起点角度
                        let startDeg = style.strokeStyle[0]
                        //终点角度
                        let endDeg = startDeg > 0 ? startDeg - 180 : startDeg + 180
                        //获得起点和终点
                        let start = Util.getCirclePoint(x0, y0, r, startDeg)
                        let end = Util.getCirclePoint(x0, y0, r, endDeg)
                        Util.setStyle(ctx, { strokeStyle: style.strokeStyle }, start, end)
                    }
                    //画圆
                    Util.drawCircle(ctx, oneX, oneY, outPortStyle.normalRadius, 0, 360)
                }
            }
        }
    }
    /**
     * 绘制端口带数字
     */
    drawPortNum(ctx) {
        //判断是否配置不显示number，且兼容之前的版本设置
        if (
            !Util.isContain(this.inPortStyle, 'isNumber') ||
            (Util.isContain(this.inPortStyle, 'isNumber') && this.inPortStyle.isNumber)
        ) {
            //输入接口，鼠标移上
            for (let i = 0; i < this.chart.statusInPort.mouseMoveed.length; i++) {
                let pid = this.chart.statusInPort.mouseMoveed[i]
                this.setStyleInPort(ctx, pid)
                let param = this.chart.findInPortByPid(pid)
                if (!param) {
                    return false
                }
                ctx.beginPath()
                ctx.arc(param.x, param.y, this.inPortStyle.numberRadius, 0, 2 * Math.PI)
                ctx.closePath()
                ctx.stroke()
                ctx.fill()
                this.setFontStyleInPort(ctx, pid)
                ctx.fillText(
                    param.index + 1,
                    param.x - this.inPortStyle.numberRadius / 3,
                    param.y + this.inPortStyle.numberRadius / 2
                )
            }
        }
        if (
            !Util.isContain(this.outPortStyle, 'isNumber') ||
            (Util.isContain(this.outPortStyle, 'isNumber') && this.outPortStyle.isNumber)
        ) {
            //输出接口，鼠标移上
            for (let i = 0; i < this.chart.statusOutPort.mouseMoveed.length; i++) {
                let pid = this.chart.statusOutPort.mouseMoveed[i]
                this.setStyleOutPort(ctx, pid)
                let param = this.chart.findOutPortByPid(pid)
                if (!param) {
                    return false
                }
                ctx.beginPath()
                ctx.arc(param.x, param.y, this.outPortStyle.numberRadius, 0, 2 * Math.PI)
                ctx.closePath()
                ctx.stroke()
                ctx.fill()
                this.setFontStyleOutPort(ctx, pid)
                ctx.fillText(
                    param.index + 1,
                    param.x - this.outPortStyle.numberRadius / 3,
                    param.y + this.outPortStyle.numberRadius / 2
                )
            }
            //输出接口，被动选中
            for (let i = 0; i < this.chart.statusOutPort.selected.length; i++) {
                let pid = this.chart.statusOutPort.selected[i]
                this.setStyleOutPort(ctx, pid)
                let param = this.chart.findOutPortByPid(pid)
                if (!param) {
                    return false
                }
                ctx.beginPath()
                ctx.arc(param.x, param.y, this.outPortStyle.numberRadius, 0, 2 * Math.PI)
                ctx.closePath()
                ctx.stroke()
                ctx.fill()
                this.setFontStyleOutPort(ctx, pid)
                ctx.fillText(
                    param.index + 1,
                    param.x - this.outPortStyle.numberRadius / 3,
                    param.y + this.outPortStyle.numberRadius / 2
                )
            }
        }
    }
    /**
     * 获得类，同时兼容特殊的compId需求
     * @param {*} data
     */
    getClass(data) {
        let classname = data.classname
        let compId = data.compId
        let dataClass = this.classInfo
        for (let i = 0; i < dataClass.length; i++) {
            let oneClass = dataClass[i]
            if ((compId && oneClass.compId + '' == compId + '') || oneClass.name == classname) {
                return oneClass
            }
        }
    }
    /**
     * 绘制节点的背景和边框
     * @param {*} x
     * @param {*} y
     */
    drawNodeBorderBack(ctx, x, y) {
        let w = this.nodeStyle.eWidth
        let h = this.nodeStyle.eHeight
        let r = this.nodeStyle.radius
        Util.drawRoundRect(ctx, x, y, w, h, r)
    }

    /**
     * 设置node 样式,改变背景色，覆盖原背景色
     * @param {*} id
     */
    setStyleNode(ctx, id, scaleNum, fixedStyle) {
        let status = this.chart.statusNode
        let nodeStyle = this.nodeStyle.status
        let style
        //不可连接
        if (Util.isContain(status.unConnectAbel, id)) {
            style = Util.deepClone(nodeStyle['unConnectAbel'])
            //使用应用传递的样式，覆盖之前的设定
            if (fixedStyle) {
                style = Util.deepCover(style, fixedStyle)
            }
            //加粗显示
            if (scaleNum && scaleNum < this.nodeStyle.text.scaleNum) {
                style.lineWidth = 3 * style.lineWidth
            }
            Util.setStyle(ctx, style)
            return style
        }
        //已连接
        if (Util.isContain(status.connected, id)) {
            style = Util.deepClone(nodeStyle['connected'])
            //使用应用传递的样式，覆盖之前的设定
            if (fixedStyle) {
                style = Util.deepCover(style, fixedStyle)
            }
            //加粗显示
            if (scaleNum && scaleNum < this.nodeStyle.text.scaleNum) {
                style.lineWidth = 3 * style.lineWidth
            }
            Util.setStyle(ctx, style)
            return style
        }
        //可连接
        if (Util.isContain(status.connectAbel, id)) {
            style = Util.deepClone(nodeStyle['connectAbel'])
            //使用应用传递的样式，覆盖之前的设定
            if (fixedStyle) {
                style = Util.deepCover(style, fixedStyle)
            }
            //加粗显示
            if (scaleNum && scaleNum < this.nodeStyle.text.scaleNum) {
                style.lineWidth = 3 * style.lineWidth
            }
            Util.setStyle(ctx, style)
            return style
        }
        //选中
        if (Util.isContain(status.selected, id)) {
            style = Util.deepClone(nodeStyle['selected'])
            //使用应用传递的样式，覆盖之前的设定
            if (fixedStyle) {
                style = Util.deepCover(style, fixedStyle)
            }
            //加粗显示
            if (scaleNum && scaleNum < this.nodeStyle.text.scaleNum) {
                style.lineWidth = 3 * style.lineWidth
            }
            Util.setStyle(ctx, style)
            return style
        }
        //鼠标移上
        if (Util.isContain(status.mouseMoveed, id)) {
            style = Util.deepClone(nodeStyle['mouseMoveed'])
            //使用应用传递的样式，覆盖之前的设定
            if (fixedStyle) {
                style = Util.deepCover(style, fixedStyle)
            }
            //加粗显示
            if (scaleNum && scaleNum < this.nodeStyle.text.scaleNum) {
                style.lineWidth = 3 * style.lineWidth
            }
            Util.setStyle(ctx, style)
            return style
        }
        style = Util.deepClone(nodeStyle['normal'])
        //使用应用传递的样式，覆盖之前的设定
        if (fixedStyle) {
            style = Util.deepCover(style, fixedStyle)
        }
        //加粗显示
        if (scaleNum && scaleNum < this.nodeStyle.text.scaleNum) {
            style.lineWidth = 3 * style.lineWidth
        }
        if (scaleNum < 0.01) {
            style.lineWidth = 2 * style.lineWidth
        }
        Util.setStyle(ctx, style)
        return style
    }
    /**
     * 设置输出样式
     * @param {*} pid 端口id
     */
    setStyleOutPort(ctx, pid) {
        let status = this.chart.statusOutPort
        let outPortStyle = this.chart.main.param.node.outPortStyle.status
        let style
        //被动选中  且  移上状态
        if (Util.isContain(status.selected, pid) && Util.isContain(status.mouseMoveed, pid)) {
            style = outPortStyle['selectedMouseMoveed']
            Util.setStyle(ctx, style)
            return style
        }
        //选中
        if (Util.isContain(status.selected, pid)) {
            style = outPortStyle['selected']
            Util.setStyle(ctx, style)
            return style
        }
        //鼠标移上
        if (Util.isContain(status.mouseMoveed, pid)) {
            style = outPortStyle['mouseMoveed']
            Util.setStyle(ctx, style)
            return style
        }
        //不可连接 拉线未连接
        if (Util.isContain(status.unConnectAbel, pid)) {
            style = outPortStyle['unConnectAbel']
            Util.setStyle(ctx, style)
            return style
        }
        //可连接 拉线未连接
        if (Util.isContain(status.connectAbel, pid)) {
            style = outPortStyle['connectAbel']
            Util.setStyle(ctx, style)
            return style
        }
        //连接状态 未拉线状态  这里使用connected
        let starts = this.chart.starts
        if (Util.isContain(starts, pid) && status.connectAbel.length == 0 && status.unConnectAbel.length == 0) {
            style = outPortStyle['connected']
            Util.setStyle(ctx, style)
            return style
        }
        //增加一种样式移动或点击到Node上才显示
        let statusNode = this.chart.statusNode
        let nodeId = pid.split('-')[0]
        if (
            Util.isContain(outPortStyle, 'nodeMoveOrSelected') &&
            (Util.isContain(statusNode.mouseMoveed, nodeId) || Util.isContain(statusNode.selected, nodeId))
        ) {
            style = outPortStyle['nodeMoveOrSelected']
            Util.setStyle(ctx, style)
            return style
        }
        style = outPortStyle['normal']
        Util.setStyle(ctx, style)
        return style
    }
    /**
     * 设置输出样式文本
     * @param {*} pid 端口id
     */
    setFontStyleOutPort(ctx, pid) {
        let status = this.chart.statusOutPort
        let outPortStyle = this.chart.main.param.node.outPortStyle.status
        let style
        //被动选中  且  移上状态
        if (Util.isContain(status.selected, pid) && Util.isContain(status.mouseMoveed, pid)) {
            style = outPortStyle['selectedMouseMoveed']
            if (Util.isContain(style, 'font')) {
                Util.setStyle(ctx, style.font)
            }
            return true
        }
        //选中
        if (Util.isContain(status.selected, pid)) {
            style = outPortStyle['selected']
            if (Util.isContain(style, 'font')) {
                Util.setStyle(ctx, style.font)
            }
            return true
        }
        //鼠标移上
        if (Util.isContain(status.mouseMoveed, pid)) {
            style = outPortStyle['mouseMoveed']
            if (Util.isContain(style, 'font')) {
                Util.setStyle(ctx, style.font)
            }
            return true
        }
        //不可连接 拉线未连接
        if (Util.isContain(status.unConnectAbel, pid)) {
            style = outPortStyle['unConnectAbel']
            if (Util.isContain(style, 'font')) {
                Util.setStyle(ctx, style.font)
            }
            return true
        }
        //可连接 拉线未连接
        if (Util.isContain(status.connectAbel, pid)) {
            style = outPortStyle['connectAbel']
            if (Util.isContain(style, 'font')) {
                Util.setStyle(ctx, style.font)
            }
            return true
        }
        //连接状态 未拉线状态  这里使用connected
        let starts = this.chart.starts
        if (Util.isContain(starts, pid) && status.connectAbel.length == 0 && status.unConnectAbel.length == 0) {
            style = outPortStyle['connected']
            if (Util.isContain(style, 'font')) {
                Util.setStyle(ctx, style.font)
            }
            return true
        }
        style = outPortStyle['normal']
        if (Util.isContain(style, 'font')) {
            Util.setStyle(ctx, style.font)
        }
        return true
    }
    /**
     * 设置输入样式
     * @param {*} pid 端口id
     */
    setStyleInPort(ctx, pid) {
        let status = this.chart.statusInPort
        let inPortStyle = this.chart.main.param.node.inPortStyle.status
        let style
        /*
        //被动选中  且  移上状态   有的模块不需要输入移上和被动选中
        if(Util.isContain(status.selected,pid) && Util.isContain(status.mouseMoveed,pid)){
            style = inPortStyle['selectedMouseMoveed']
            Util.setStyle(ctx,style)
            return true
        }
        //选中  有的模块不需要输入移上和被动选中
        if(Util.isContain(status.selected,pid)){
            style = inPortStyle['selected']
            Util.setStyle(ctx,style)
            return true
        }
        */
        //鼠标移上
        if (Util.isContain(status.mouseMoveed, pid)) {
            style = inPortStyle['mouseMoveed']
            Util.setStyle(ctx, style)
            return style
        }
        //不可连接 拉线未连接
        if (Util.isContain(status.unConnectAbel, pid)) {
            style = inPortStyle['unConnectAbel']
            Util.setStyle(ctx, style)
            return style
        }
        //可连接 拉线未连接
        if (Util.isContain(status.connectAbel, pid)) {
            style = inPortStyle['connectAbel']
            Util.setStyle(ctx, style)
            return style
        }
        //连接状态 未拉线状态  这里使用connected
        let ends = this.chart.ends
        if (Util.isContain(ends, pid) && status.connectAbel.length == 0 && status.unConnectAbel.length == 0) {
            style = inPortStyle['connected']
            Util.setStyle(ctx, style)
            return style
        }
        //增加一种样式移动或点击到Node上才显示
        let statusNode = this.chart.statusNode
        let nodeId = pid.split('-')[0]
        if (
            Util.isContain(inPortStyle, 'nodeMoveOrSelected') &&
            (Util.isContain(statusNode.mouseMoveed, nodeId) || Util.isContain(statusNode.selected, nodeId))
        ) {
            style = inPortStyle['nodeMoveOrSelected']
            Util.setStyle(ctx, style)
            return style
        }
        style = inPortStyle['normal']
        Util.setStyle(ctx, style)
        return style
    }
    /**
     * 设置输入文本样式
     * @param {*} pid 端口id
     */
    setFontStyleInPort(ctx, pid) {
        let status = this.chart.statusInPort
        let inPortStyle = this.chart.main.param.node.inPortStyle.status
        let style
        /*
        //被动选中  且  移上状态   有的模块不需要输入移上和被动选中
        if(Util.isContain(status.selected,pid) && Util.isContain(status.mouseMoveed,pid)){
            style = inPortStyle['selectedMouseMoveed']
            Util.setStyle(ctx,style)
            return true
        }
        //选中  有的模块不需要输入移上和被动选中
        if(Util.isContain(status.selected,pid)){
            style = inPortStyle['selected']
            Util.setStyle(ctx,style)
            return true
        }
        */
        //鼠标移上
        if (Util.isContain(status.mouseMoveed, pid)) {
            style = inPortStyle['mouseMoveed']
            if (Util.isContain(style, 'font')) {
                Util.setStyle(ctx, style.font)
            }
            return style
        }
        //不可连接 拉线未连接
        if (Util.isContain(status.unConnectAbel, pid)) {
            style = inPortStyle['unConnectAbel']
            if (Util.isContain(style, 'font')) {
                Util.setStyle(ctx, style.font)
            }
            return style
        }
        //可连接 拉线未连接
        if (Util.isContain(status.connectAbel, pid)) {
            style = inPortStyle['connectAbel']
            if (Util.isContain(style, 'font')) {
                Util.setStyle(ctx, style.font)
            }
            return style
        }
        //连接状态 未拉线状态  这里使用connected
        let ends = this.chart.ends
        if (Util.isContain(ends, pid) && status.connectAbel.length == 0 && status.unConnectAbel.length == 0) {
            style = inPortStyle['connected']
            if (Util.isContain(style, 'font')) {
                Util.setStyle(ctx, style.font)
            }
            return style
        }
        style = inPortStyle['normal']
        if (Util.isContain(style, 'font')) {
            Util.setStyle(ctx, style.font)
        }
        return style
    }
}

export default Node
