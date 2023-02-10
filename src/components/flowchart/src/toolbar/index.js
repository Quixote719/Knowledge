import Util from '../util'
import EVENTS from '../event/eventdeclara'
class Toolbar {
    constructor(main) {
        this.main = main
        this.config = main.param.toolbar
        //判断是否全程不显示的
        if (!this.config.isShow) {
            return
        }
        this.initToolbar(main)
        //监听状态改变
        main.bind(EVENTS['changeStatus'], this.changeStatus)
        main.bind(EVENTS['toolbarShow'], this.showToolbar)
    }
    //初始化工具条
    initToolbar = main => {
        //清空无效的占位对象
        for (let i = this.config.list.length - 1; i > -1; i--) {
            let btncfg = this.config.list[i]
            if (!Util.isContain(btncfg, 'title')) {
                this.config.list.splice(i, 1)
            }
        }
        //重复的进行删除
        for (let i = this.config.list.length - 1; i > -1; i--) {
            let btncfg = this.config.list[i]
            for (let j = i - 1; j > -1; j--) {
                let btncfg2 = this.config.list[j]
                if (btncfg.img == btncfg2.img) {
                    this.config.list.splice(i, 1)
                }
            }
        }
        //初始化底部div
        // 如果需要分开区域展示
        this.contentLeft = document.createElement('div')
        if (this.config.isDivide) {
            this.contentLeft.setAttribute(
                'style',
                'display:block;position:absolute;left:16px;top:16px;background: #3E4354;border-radius: 2px;padding-left: 8px;'
            )

            this.contentLeft.style.height = this.config.image.size + 8 + 'px'
            main.param.dom.appendChild(this.contentLeft)
        }

        this.content = document.createElement('div')

        this.content.setAttribute(
            'style',
            'display:block;position:absolute;right:16px;top:16px;background: #3E4354;border-radius: 2px;padding-left: 8px;'
        )
        this.content.style.height = this.config.image.size + 8 + 'px'
        main.param.dom.appendChild(this.content)
        this.btns = []
        let imageCfg = this.config.image

        for (let i = 0; i < this.config.list.length; i++) {
            let btncfg = this.config.list[i]
            let btnDiv = document.createElement('div')
            //设置基础样式流动布局
            btnDiv.setAttribute(
                'style',
                'display:block;cursor:pointer;position:relative;width:' +
                    imageCfg.size +
                    'px;height:' +
                    imageCfg.size +
                    'px;float:left;' +
                    'margin-right:' +
                    imageCfg.margin +
                    'px;margin-top:4px;'
            )
            //设置背景图片样式 修改成require
            // btnDiv.style.background = 'url(' + imageCfg.urlPrefix + btncfg.img + imageCfg.urlSuffix + ')'
            btnDiv.style.background = `url(${require('../../res/img/dagImg/' + btncfg.img + imageCfg.urlSuffix)})`
            //设置提示信息
            btnDiv.setAttribute('title', btncfg.title)
            //设置事件
            btnDiv.addEventListener('mousedown', () => {
                this.mousedown(btncfg)
            })

            this.btns.push(btnDiv)
            // list标记为左侧显示
            if (btncfg.float == 'left') {
                //添加至左侧外框
                this.contentLeft.appendChild(btnDiv)
            } else {
                //添加至右侧外框
                this.content.appendChild(btnDiv)
                // 设置分割线
                if (btncfg.divider) {
                    this.content.appendChild(this.dividerDom())
                }
            }
        }
        this.hideToolbar()
    }
    /**
     * 点击事件
     */
    mousedown = btncfg => {
        if (Util.isContain(EVENTS, btncfg.event)) {
            this.main.triggerEvent(EVENTS[btncfg.event])
        } else {
            this.main.triggerEvent(EVENTS['userDefined'], btncfg.event)
        }
    }
    //显示工具条（全部）
    showToolbar = () => {
        this.content.style.display = 'block'
        this.contentLeft.style.display = 'block'
        this.changeStatus()
    }
    //隐藏工具条（全部）
    hideToolbar = () => {
        this.content.style.display = 'none'
        this.contentLeft.style.display = 'none'
        this.main.triggerEvent(EVENTS['deleteCovers'], 'toolbar')
    }

    // 分割线
    dividerDom = () => {
        let imageCfg = this.config.image
        let divider = document.createElement('div')
        divider.setAttribute(
            'style',
            'display:block;cursor:pointer;position:relative;width:' +
                1 +
                'px;height:' +
                16 +
                'px;float:left;' +
                'margin-right:' +
                imageCfg.margin +
                'px;margin-top:' +
                imageCfg.margin +
                'px;' +
                'background: rgba(255,255,255,0.40);'
        )
        return divider
    }
    changeStatus = () => {
        let status = this.main.runStatus
        let name = status.name
        let count = 0
        let leftButtons = []
        for (let i = 0; i < this.btns.length; i++) {
            let btn = this.btns[i]
            let btncfg = this.config.list[i]
            let runStatus = btncfg.show.runStatus
            if (Util.isContain(runStatus, name)) {
                btn.style.display = 'block'
                if (btncfg.float == 'left') {
                    //添加至左侧按钮列表
                    leftButtons.push(btn)
                }
                count++
            } else {
                btn.style.display = 'none'
            }
        }
        if (leftButtons.length < 1) {
            this.contentLeft.style.display = 'none'
        } else {
            this.contentLeft.style.display = 'block'
        }

        if (count == 0) {
            this.main.triggerEvent(EVENTS['deleteCovers'], 'toolbar')
        } else {
            let imageCfg = this.config.image
            let right = 16
            let top = 16
            let height = imageCfg.size
            let width = count * (imageCfg.size + 2 * imageCfg.margin)
            this.main.triggerEvent(EVENTS['saveCovers'], 'toolbar', {
                right,
                top,
                width,
                height
            })
        }
    }
}
export default Toolbar
