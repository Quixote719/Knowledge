import Util from '../util'
import EVENTS from '../event/eventdeclara'
import Tooltip from 'tooltip.js'
import './index.css'
class Tip {
    constructor(main) {
        this.main = main
        this.tip = null
        this.tipData = null
        main.bind(EVENTS['updatePanScale'], this.updatePanScale)
        //this.init(main)
    }
    init(main) {
        this.content = document.createElement('div')
        this.content.setAttribute('style', 'position:absolute;width:100%;height:100%;left:0px;top:0px;')
        main.param.dom.appendChild(this.content)
    }
    /**
     * 计算对应的位置进行变更
     */
    updatePanScale = param => {
        //如果没有tip则无需反应
        if (this.tip) {
            this.clearTip()
        }
    }
    /**
     * 创建提示
     */
    createTip = param => {
        //已经存在，且相等
        if (this.tipData && this.tipData.ele.id == param.ele.id && this.tipData.minx == param.minx) {
        } else {
            //清空重绘
            this.clearTip(this.tipData)
            this.tipcontent = document.createElement('div')
            let width = param.maxx - param.minx
            let height = param.maxy - param.miny
            this.tipcontent.setAttribute(
                'style',
                'position:absolute;width:' +
                    width +
                    'px;height:' +
                    height +
                    'px;left:' +
                    param.minx +
                    'px;top:' +
                    param.miny +
                    'px;'
            )
            this.main.param.dom.appendChild(this.tipcontent)
            this.tip = new Tooltip(this.tipcontent, {
                title: param.ele.messageTip
            })
        }
        this.tipData = param
        this.tip.show()
    }
    /**
     * 删除单个提示
     */
    deletTip = param => {}
    /**
     * 清空提示
     */
    clearTip = () => {
        this.tipData = null
        if (this.tip) {
            this.tip.dispose()
            this.tip = null
            this.main.param.dom.removeChild(this.tipcontent)
            this.tipcontent = null
        }
    }
}
export default Tip
