import Util from '../util'
import EVENTS from '../event/eventdeclara'
class Link {
    constructor(chart) {
        this.chart = chart
        this.ctx = chart.ctx
        this.config = chart.main.param.link
        //线的连接偏移
        this.bezierOffset = 60
        this.chart.main.bind(EVENTS['updataConfig'], () => {
            this.config = chart.main.param.link
        })
    }
    /**
     * 绘制测试连接线
     * @param {*} isTestPortConnect 是否在做测试连接
     * @param {*} testPortStart 开始点
     * @param {*} testPortEnd 结束点
     * @param {*} testStatus 连接的状态  通过这个来设置连接样式 shape connected:'bezierCurve' unConnect straightLine
     */
    drawTestPortLine(ctx, isTestPortConnect, testPortStart, testPortEnd, testStatus) {
        if (!isTestPortConnect) {
            return false
        }
        if (testPortStart.length == 0 || testPortEnd.length == 0) {
            return false
        }
        this.setStyle(ctx)
        let start = { x: testPortStart[0], y: testPortStart[1] }
        let end = { x: testPortEnd[0], y: testPortEnd[1] }
        this.drawLink(ctx, testStatus, start, end)
    }
    /**
     * 绘制连接线
     */
    drawLinkedLine(ctx) {
        let links = this.chart.links
        let starts = this.chart.starts
        let ends = this.chart.ends
        //隐藏线，测试时使用
        let hide = this.chart.statusInPort.hide
        //连接线类型
        let shape = this.config.linkStyle.shape.connected
        for (let i = 0; i < links.length; i++) {
            let link = links[i]
            //设置样式
            this.setStyle(ctx, link)
            for (let startPort in link) {
                let start = starts[startPort]
                let end = ends[link[startPort]]
                //暂时不绘制的连接线
                if (hide.length > 0 && hide[0] == link[startPort]) {
                    continue
                }
                //判断连接类型
                this.drawLink(ctx, shape, start, end)
            }
        }
    }
    /**
     * 绘制线，根据配置的线的类型，并设置起点终点 x y
     * @param {*} ctx
     * @param {*} shape
     * @param {*} start
     * @param {*} end
     */
    drawLink(ctx, shape, start, end) {
        if (typeof start == 'undefined' || typeof end == 'undefined' || !start || !end) {
            return false
        }
        //贝塞尔曲线曲度
        let bezierOffset = this.bezierOffset
        if (shape == 'bezierCurve') {
            ctx.beginPath()
            ctx.moveTo(start.x, start.y)
            ctx.bezierCurveTo(start.x, start.y + bezierOffset, end.x, end.y - bezierOffset, end.x, end.y)
            ctx.stroke()
        } else {
            //straghtLine 直线
            ctx.beginPath()
            ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
        }
    }
    /**
     * 设置样式
     * @param {*} link
     */
    setStyle(ctx, link) {
        //默认线的样式
        let status = 'normal'
        let selected = this.chart.statusLink.selected
        let linkStyle = this.config.linkStyle.status
        let style
        if (link && selected.length > 0) {
            for (let linkOfStart in link) {
                let linkOfEnd = link[linkOfStart]
                for (let i = 0; i < selected.length; i++) {
                    let oneLink = selected[i]
                    for (let startPort in oneLink) {
                        let endPort = oneLink[startPort]
                        if (startPort == linkOfStart && endPort == linkOfEnd) {
                            style = linkStyle['selected']
                            Util.setStyle(ctx, style)
                            return
                        }
                    }
                }
            }
        }
        style = linkStyle[status]
        Util.setStyle(ctx, style)
    }
}

export default Link
