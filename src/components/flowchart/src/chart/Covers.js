import Util from '../util'
import EVENTS from '../event/eventdeclara'
/**
 * 覆盖面
 *  用于画布上的非拖动的内容位置记录如鹰眼、工具栏、右键菜单，产生对应的覆盖范围，来阻止事件向画布传递
 *  包含获取
 *  新增
 *  全部更新
 */
class Covers {
    constructor(main) {
        //覆盖坐标 使用相对位置，left top right bottom 高宽，可能有百分比，根据实际的宽高进行计算矩形范围 ，当resize后，全部需要重置
        this.covers = {}
        this.main = main
        //获得事件，传递covers对象
        main.bind(EVENTS['getCovers'], obj => {
            //不能把指针替换
            obj = Object.assign(obj, this.covers)
        })
        //新增覆盖范围,自动计算其范围
        main.bind(EVENTS['saveCovers'], (type, obj) => {
            this.covers[type] = obj
            let extent = this.getExtent(obj)
            this.covers[type].extent = extent
        })
        //移除覆盖范围
        main.bind(EVENTS['deleteCovers'], type => {
            if (Util.isContain(this.covers, type)) {
                delete this.covers[type]
            }
        })
        //更新全部的覆盖范围
        main.bind(EVENTS['updateAllCovers'], this.updateAllCovers)
    }
    /**
     * 更新全部的覆盖范围
     */
    updateAllCovers = () => {
        //JSON.stringify(this.covers);
        //循环获得各个范围对象，对应更新坐标范围
        for (let type in this.covers) {
            let cover = this.covers[type]
            let extent = this.getExtent(cover)
            cover.extent = extent
        }
    }
    getExtent = cover => {
        let extent
        //获得画布的范围大小
        let widthHeight = {}
        this.main.triggerEvent(EVENTS['getCanvasSize'], widthHeight)
        let canvasWidth = widthHeight.width
        let canvasHeight = widthHeight.height
        let width = cover.width
        let height = cover.height
        let left = cover.left
        let right = cover.right
        let top = cover.top
        let bottom = cover.bottom
        //必定存在两个
        let x = typeof left != 'undefined' ? left : right
        let y = typeof top != 'undefined' ? top : bottom
        if (typeof x == 'string' && x.indexOf('%') > 0) {
            x = parseInt(x) / 100.0
            x = canvasWidth * x
        }
        if (typeof y == 'string' && y.indexOf('%') > 0) {
            y = parseInt(y) / 100.0
            y = canvasHeight * y
        }
        let minX, maxX, minY, maxY
        if (typeof left != 'undefined') {
            minX = x
            maxX = x + width
        } else {
            maxX = canvasWidth - x
            minX = maxX - width
        }
        if (typeof top != 'undefined') {
            minY = y
            maxY = y + height
        } else {
            maxY = canvasHeight - y
            minY = maxY - height
        }
        extent = [minX, maxX, minY, maxY]
        return extent
    }
}
export default Covers
