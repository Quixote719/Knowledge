import Util from '../util'
import EVENTS from '../event/eventdeclara'
class Menu {
    constructor(main) {
        this.main = main
        this.config = main.param.menu
        this.position = {
            x: 0,
            y: 0
        }
        //判断是否全程不显示的
        if (!this.config.isShow) {
            return
        }
        this.isCopy = false

        main.bind(EVENTS['dagCopyEvent'], () => {
            this.isCopy = true
        })
        this.initMenu(main)
        //if(!)
        //runStatus
        //监听右键
        main.bind(EVENTS['contextmenu'], this.contextmenu)
        //监听状态改变
        main.bind(EVENTS['changeStatus'], this.hideMenu)
        //隐藏菜单
        main.bind(EVENTS['hideMenu'], this.hideMenu)

        //菜单状态
        this.isShowIng = false
        //菜单刷新
        main.bind(EVENTS['showRefresh'], this.showRefresh)
    }
    /**
     * 初始化绘制菜单
     */
    initMenu(main) {
        //初始化底部div
        this.content = document.createElement('div')
        this.content.setAttribute(
            'style',
            'display:none;position:absolute;width:170px;left:0px;top:0px;background:#000000;border:1px solid rgba(0,0,0,1);box-shadow:3px 3px 3px 0 rgba(0,0,0,.51);cursor:pointer'
        )
        main.param.dom.appendChild(this.content)
        //初始化各个按钮
        this.btns = []
        for (let i = 0; i < this.config.menuList.length; i++) {
            let cfg = this.config.menuList[i]
            let type = cfg.type
            //分割线
            if (type == 'line') {
                let lineContent = document.createElement('div')
                lineContent.setAttribute('style', 'width:166px;height:2px;float:left;padding-left:2px;')
                let line = document.createElement('div')
                line.setAttribute(
                    'style',
                    'width:166px;height:2px;border:0px;border-top:1px solid  rgba(255,255,255,0.12);'
                )
                lineContent.appendChild(line)
                this.content.appendChild(lineContent)
                continue
            }
            //一行按钮
            let btn = document.createElement('div')
            btn.setAttribute(
                'style',
                'display:block;float:left;height:32px;width:100%;padding-left:12px;padding-top:6px;'
            )

            let imageCfg = this.config.image
            //是否显示图片 前置
            if (imageCfg.isImage) {
                if (imageCfg.isFront && cfg.img != '') {
                    this.addImg(btn, imageCfg, cfg.img)
                }
            }
            let textCtx = document.createElement('div')
            textCtx.setAttribute(
                'style',
                'float:left;padding-left:10px;margin-top:2px;font-family:MicrosoftYaHei;font-size:14px;color: rgba(255,255,255,0.70);letter-spacing:-0.21px;line-height:20px;'
            )
            textCtx.innerHTML = cfg.name
            btn.appendChild(textCtx)
            //设置事件
            btn.addEventListener('mouseup', () => {
                this.mousedown(cfg)
                //覆盖范围上
                this.hideMenu(false)
            })
            //设置事件
            btn.addEventListener('mouseover', () => {
                btn.style.border = '1px solid rgba(255,255,255,0.12)'
                btn.style.borderRadius = '5px'
                btn.style.backgroundColor = '#000'
            })
            btn.addEventListener('mouseout', () => {
                btn.style.border = '0px'
                btn.style.borderRadius = '5px'
                btn.style.backgroundColor = '#000'
            })
            //字体显示
            //是否显示图片 后置
            if (imageCfg.isImage) {
                if (!imageCfg.isFront && cfg.img != '') {
                    this.addImg(this.content, imageCfg, cfg.img)
                }
            }
            this.content.appendChild(btn)
            this.btns.push(btn)
        }
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
    /**
     *
     */
    addImg = (content, imgCfg, url) => {
        let imgCtx = document.createElement('div')
        imgCtx.setAttribute(
            'style',
            'float:left;width:' +
                imgCfg.imageW +
                'px;height:' +
                imgCfg.imageH +
                'px;margin-top:0px;background-image:url(' +
                imgCfg.urlPrefix +
                url +
                imgCfg.urlSuffix +
                ')'
        )
        content.appendChild(imgCtx)
    }
    /**
     * 上下文菜单
     */
    contextmenu = event => {
        //this.hideMenu(false)
        //实际在浏览器中的坐标
        //event.clientX
        //判断当前是否是空画布
        if (!this.main.isInitCanvas) {
            this.main.triggerEvent(EVENTS['messageTip'], '没有初始化画布')
            return
        }
        //判断是否点击在画布范围内
        let canvasMsg = {}
        this.main.triggerEvent(EVENTS['getCanvasSize'], canvasMsg)
        let pointX = event.clientX
        let pointY = event.clientY
        let xy = Util.windowToCanvasLeftRight(this.main.chart.canvas, pointX, pointY)
        let left = xy.x
        let top = xy.y
        if (left < 0 || top < 0 || left > canvasMsg.width || top > canvasMsg.height) {
            return
        }
        //根据状态决定要不要显示
        if (typeof this.config.runStatus != 'undefined') {
            let status = this.main.runStatus
            let statusName = status.name
            if (!Util.isContain(this.config.runStatus, statusName)) {
                this.main.triggerEvent(EVENTS['messageTip'], '当前状态没有菜单')
                return
            }
        }
        this.showMenu(left, top, pointX, pointY)
    }
    /**
     * caidan
     *
     */
    showMenu = (left, top) => {
        let canvasScaleTranslate = {}
        this.main.triggerEvent(EVENTS['getCanvasScaleTranslate'], canvasScaleTranslate)
        let posMoveXY = Util.leftRight2Canvas(
            left,
            top,
            canvasScaleTranslate.panX,
            canvasScaleTranslate.panY,
            canvasScaleTranslate.scaleNum
        )
        let x = posMoveXY.x
        let y = posMoveXY.y
        this.position = {
            x,
            y
        }
        this.main.chart.currentMenuId = null
        let ele = this.main.chart.findNode(x, y)
        if (ele) {
            this.main.chart.currentMenuId = ele.id
            //选中的节点不包含在数组中，则需要改变节点选中状态
            if (!Util.isContain(this.main.chart.statusNode.selected, ele.id)) {
                this.main.chart.statusNode.selected = [ele.id]
                //更新被选中的节点
                this.main.triggerEvent(EVENTS['selectElement'], [ele.id])
            }
        } else {
            let oneLink = this.main.chart.findLink(x, y)
            if (oneLink) {
                this.main.chart.isClickLink = true
                this.main.chart.statusLink.selected = [oneLink]
                this.main.chart.statusOutPort.selected = []
                this.main.chart.statusInPort.selected = []
                this.main.chart.statusNode.selected = []
                this.main.chart.changeNodes = []
                //更新被选中的节点
                this.main.triggerEvent(EVENTS['selectElement'], [])
            }
        }
        let menuHeight = 0
        let menuWidth = 170
        let oneMenuHeight = 32
        let runStatus = this.main.runStatus.name
        //计数对应的分割线
        let num = 0
        for (let i = 0; i < this.config.menuList.length; i++) {
            let cfgArr = this.config.menuList[i].show
            if (this.config.menuList[i].type == 'line') {
                num++
                continue
            }
            let btn = this.btns[i - num]
            let isShow = false
            let isShowArr = []
            for (let n = 0; n < cfgArr.length; n++) {
                let cfg = cfgArr[n]
                isShowArr[n] = true
                //状态要求
                if (Util.isContain(cfg, 'runStatus')) {
                    if (!Util.isContain(cfg.runStatus, runStatus)) {
                        isShowArr[n] = false
                        continue
                    }
                }

                //选中的节点数目要求
                if (Util.isContain(cfg, 'node')) {
                    let isNode = false
                    //一个也没右键选中
                    if (cfg.node == 0 && !this.main.chart.currentMenuId) {
                        isNode = true
                    }
                    //选中一个
                    if (cfg.node == 1 && this.main.chart.currentMenuId) {
                        isNode = true
                    }
                    //多个选中
                    if (
                        cfg.node == 'n' &&
                        this.main.chart.currentMenuId &&
                        this.main.chart.statusNode.selected.length > 1
                    ) {
                        isNode = true
                    }
                    if (!isNode) {
                        isShowArr[n] = false
                        continue
                    }
                }
                //选中的线数目要求
                if (Util.isContain(cfg, 'link')) {
                    let isLink = false
                    if (cfg.link == 0 && !this.main.chart.isClickLink) {
                        isLink = true
                    }
                    if (
                        cfg.link == 1 &&
                        this.main.chart.isClickLink &&
                        this.main.chart.statusLink.selected.length == 1
                    ) {
                        isLink = true
                    }
                    if (cfg.link == 'n' && this.main.chart.statusLink.selected.length > 1) {
                        isLink = true
                    }
                    if (!isLink) {
                        isShowArr[n] = false
                        continue
                    }
                }
                //属性要求
                if (Util.isContain(cfg, 'nodeAttribute')) {
                    for (let j = 0; j < this.main.datas.length; j++) {
                        let data = this.main.datas[j]
                        if (data.id == this.main.chart.currentMenuId) {
                            //for(let m=0; m<cfg.nodeAttribute.length;m++){
                            for (let attrname in cfg.nodeAttribute) {
                                let attr = cfg.nodeAttribute[attrname]
                                if (
                                    !(
                                        Util.isContain(data, attrname) &&
                                        (attr === data[attrname] || Util.isContain(attr, data[attrname]))
                                    )
                                ) {
                                    isShowArr[n] = false
                                    break
                                }
                            }
                            //}
                        }
                    }
                }
                //针对copy这种情况对粘贴进行单独判断
                if (this.config.menuList[i].name == '粘贴') {
                    //判断是否启用了拷贝
                    if (!this.isCopy) {
                        isShowArr[n] = false
                    }
                }
            }
            //只要有一个属性true就行，
            if (Util.isContain(isShowArr, true)) {
                isShow = true
            }
            if (!isShow) {
                btn.style.display = 'none'
                continue
            }
            //unShow 属性
            let cfgUnArr = this.config.menuList[i].unShow
            //类型要求
            //反向属性要求,只要有一个反向成立，则不能显示了
            let isUnShowArr = []
            for (let n = 0; n < cfgUnArr.length; n++) {
                isUnShowArr[n] = true
                let cfgUn = cfgUnArr[n]
                if (Util.isContain(cfgUn, 'nodeAttribute')) {
                    for (let j = 0; j < this.main.datas.length; j++) {
                        let data = this.main.datas[j]
                        //属性要求是对多个还是单个
                        let nodeAttributeType = '1'
                        if (Util.isContain(cfgUn, 'nodeAttributeType')) {
                            nodeAttributeType = cfgUn.nodeAttributeType
                        }
                        if (nodeAttributeType == '1') {
                            if (data.id == this.main.chart.currentMenuId) {
                                //只要有一个属性对象是false
                                for (let attrname in cfgUn.nodeAttribute) {
                                    let attr = cfgUn.nodeAttribute[attrname]
                                    //Util.isContain(attr,data[attrname]) 支持定义的数组枚举
                                    if (
                                        Util.isContain(data, attrname) &&
                                        (attr === data[attrname] || Util.isContain(attr, data[attrname]))
                                    ) {
                                        isUnShowArr[n] = false
                                        break
                                    }
                                }
                            }
                        } else {
                            if (Util.isContain(this.main.chart.statusNode.selected, data.id)) {
                                //只要有一个属性对象是false
                                for (let attrname in cfgUn.nodeAttribute) {
                                    let attr = cfgUn.nodeAttribute[attrname]
                                    //Util.isContain(attr,data[attrname]) 支持定义的数组枚举
                                    if (
                                        Util.isContain(data, attrname) &&
                                        (attr === data[attrname] || Util.isContain(attr, data[attrname]))
                                    ) {
                                        isUnShowArr[n] = false
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //只要有一个属性true就行，
            if (Util.isContain(isUnShowArr, false)) {
                btn.style.display = 'none'
                continue
            }
            btn.style.display = 'block'
            menuHeight += oneMenuHeight
        }
        if (menuHeight > 0) {
            menuHeight += 5
        } else {
            //tip 没有可使用的菜单项
            this.main.triggerEvent(EVENTS['messageTip'], '没有可使用的菜单项')
            return
        }
        //判断是否点击在画布范围内
        let canvasMsg = {}
        this.main.triggerEvent(EVENTS['getCanvasSize'], canvasMsg)
        let canvasWidth = canvasMsg.width
        let canvasHeight = canvasMsg.height
        //右边不够放
        if (canvasWidth - left < menuWidth) {
            x = left - menuWidth
        } else {
            x = left
        }
        //下面不够放
        if (canvasHeight - top < menuHeight) {
            y = top - menuHeight
        } else {
            y = top
        }
        this.content.style.width = menuWidth + 'px'
        this.content.style.height = menuHeight + 'px'
        this.content.style.left = x + 'px'
        this.content.style.top = y + 'px'
        this.content.style.display = 'block'
        //添加对应的范围
        let height = menuHeight
        let width = menuWidth
        this.main.triggerEvent(EVENTS['saveCovers'], 'menu', {
            left: x,
            top: y,
            width,
            height
        })
        this.isShowIng = true
        this.left = left
        this.top = top
    }
    hideMenu = isHideNow => {
        this.content.style.display = 'none'
        if (typeof isHideNow == 'undefined') {
            isHideNow = true
        }
        if (isHideNow) {
            this.main.triggerEvent(EVENTS['deleteCovers'], 'menu')
            this.isShowIng = false
        } else {
            setTimeout(() => {
                this.main.triggerEvent(EVENTS['deleteCovers'], 'menu')
                this.isShowIng = false
            }, 200)
        }
    }
    /**
     * 刷新显示
     */
    showRefresh = () => {
        if (!this.isShowIng) {
            return false
        }
        this.showMenu(this.left, this.top)
    }
}
export default Menu
