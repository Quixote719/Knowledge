import Util from '../util'
import EVENTS from '../event/eventdeclara'
import Link from '../link'
import Node from '../node'
import StatusStore from './statusStore'
/**
 * 流程图
 * 节点、连线、端口组成
 *
 *
 */
class Chart {
    constructor(main) {
        let dom = main.param.dom
        this.main = main
        this.initVariabel()
        this.initBaseCanvas(dom)
        this.initNameContainer(dom)
        this.initStatusContainer(dom)
        this.initEvent()
        this.link = new Link(this)
        this.node = new Node(this)
        //画布存储
        if (main.param.canvas.isSavePanScale && main.param.canvas.panScaleSaveType == 'chart') {
            new StatusStore(this)
        }
    }
    /**
     * 事件监听
     */
    initEvent = () => {
        //运行状态
        this.main.bind(EVENTS['changeStatus'], this.changeStatus)
        //回调，加载画布的范围
        this.main.bind(EVENTS['loadPanScaleCallBack'], this.loadPanScaleCallBack)
        //键盘删除调用
        this.main.bind(EVENTS['deleteEvent'], this.deleteEles)
        //放大和缩小调用
        this.main.bind(EVENTS['scaleReduce'], this.scaleReduce)
        this.main.bind(EVENTS['scaleEnlarged'], this.scaleEnlarged)
        //框选
        this.main.bind(EVENTS['extentSelect'], () => {
            this.isBoxSelect = true
        })
        //鼠标事件 鼠标移上 鼠标
        this.main.bind(EVENTS['mousemove'], this.mousemove)
        this.main.bind(EVENTS['mousedown'], this.mousedown)
        this.main.bind(EVENTS['dblclick'], this.dblclick)
        this.main.bind(EVENTS['mouseup'], this.mouseup)
        //监听画布的父容器大小改变事件
        this.main.bind(EVENTS['resizeChart'], this.resizeChart)
        //监听画布的大小获得需求
        this.main.bind(EVENTS['getCanvasSize'], this.getCanvasSize)
        this.main.bind(EVENTS['getCanvasScaleTranslate'], this.getCanvasScaleTranslate)

        //新增绑定
        this.main.bind(EVENTS['mouseDownAdd'], this.mouseDownAdd)
        //新增视图绑定
        this.main.bind(EVENTS['mouseDownAdds'], this.mouseDownAdds)
        //拷贝动作，需要处理copy，然后分发
        this.main.bind(EVENTS['dagCopyEvent'], this.dagCopyEvent)
        //粘贴事件
        this.main.bind(EVENTS['dagPasteEvent'], this.dagPasteEvent)
        //查询选中
        this.main.bind(EVENTS['searchSelect'], this.searchSelect)

        //运行和停止相关的接口
        this.main.bind(EVENTS['_runCanvas'], this.runCanvas)
        this.main.bind(EVENTS['_stopExecute'], this.stopExecute)
        this.main.bind(EVENTS['_runCurrent'], () => {
            this.runComponent({
                type: 'EXECUTE_CURRENT_NODE'
            })
        })
        this.main.bind(EVENTS['_runToCurrent'], () => {
            this.runComponent({
                type: 'EXECUTE_TIL_CURRENT_NODE'
            })
        })
        this.main.bind(EVENTS['_runFromCurrent'], () => {
            this.runComponent({
                type: 'EXECUTE_FROM_CURRENT_NODE'
            })
        })
        //上下文的菜单执行
        this.main.bind(EVENTS['_contextExport'], () => {
            this.contextEvent({
                type: 'EXPORT_DAG'
            })
        })
        this.main.bind(EVENTS['_contextViewData'], () => {
            this.contextEvent({
                type: 'VIEW_DATA'
            })
        })
        this.main.bind(EVENTS['_contextViewLog'], () => {
            this.contextEvent({
                type: 'VIEW_LOG'
            })
        })
        this.main.bind(EVENTS['_exportView'], () => {
            this.contextEvent({
                type: 'VIEW_EXPORT'
            })
        })

        this.main.bind(EVENTS['_contextEditDes'], () => {
            this.contextEvent({
                type: 'EDIT_DESCRIPTION'
            })
        })
        this.main.bind(EVENTS['_contextRename'], () => {
            this.contextEvent({
                type: 'RENAME'
            })
        })
        this.main.bind(EVENTS['selectElementCallback'], this.selectElementCallback)
        //持续节点状态
        this.main.bind(EVENTS['setNodeStatus'], this.setNodeStatus)

        //输出dag的接口
        this.main.bind(EVENTS['_export_dag'], () => {
            this.main.triggerEvent(EVENTS['export_dag'])
        })

        this.main.bind(EVENTS['_contextEditOptimalSolution'], () => {
            this.contextEvent({
                type: 'EDIT_OPTIMAL_SOLUTION'
            })
        })

        this.main.bind(EVENTS['_contextViewOptimalSolution'], () => {
            this.contextEvent({
                type: 'VIEW_OPTIMAL_SOLUTION'
            })
        })

        this.main.bind(EVENTS['_contextViewAnalysis'], () => {
            this.contextEvent({
                type: 'VIEW_ANALYSIS'
            })
        })
        this.main.bind(EVENTS['_contextViewModel'], () => {
            this.contextEvent({
                type: 'VIEW_MODEL'
            })
        })
        //用户自定义事件
        this.main.bind(EVENTS['userDefined'], this.userDefined)

        this.main.bind(EVENTS['multSelect'], isMultSelect => {
            this.isMultSelect = isMultSelect
        })

        this.main.bind(EVENTS['_dataEmpty'], this.nodeEmpty)
    }
    /**
     * 初始化画布信息
     */
    initStatus() {
        //运行变量初始化
        this.initVariabel()
        //清空画布
        this.drawBackground()
        //清除提示的运行状态
        this.hideStatusContainer()
        //清空显示的名称
        this.clearNameContainer()
    }
    /**
     * 画布切换状态
     */
    changeStatus = () => {
        this.setStatus()
        this.drawCanvasName()
    }
    /**
     * 初始化变量
     */
    initVariabel() {
        //是否父元素被焦点
        this.isFocus = true
        //是否大小重新适配
        this.isResize = true
        //是否进行缩放
        this.isScale = false
        //画布平移
        this.panX = 0
        this.panY = 0
        //画布缩放
        this.scaleNum = 1
        //位移变化
        this.translateX = 0
        this.translateY = 0
        //框选范围
        this.isBoxSelect = false
        this.boxSelectStart = []
        this.boxSelectEnd = []
        //鼠标按压状态
        this.isHold = false
        //鼠标状态 canvas 鼠标在空画布上 node 鼠标在节点上   canvas node link inPort outPort add
        this.holdType = 'canvas'
        //鼠标临时坐标
        // this.mousePoint
        // this.mousePointStart
        //changeNode 选中的节点
        this.changeNodes = []
        //线的连接状态
        this.statusLink = {
            //已连接
            selected: [],
            error: []
        }
        //节点状态
        this.statusNode = new Proxy(
            {
                //鼠标移上 只有一个
                mouseMoveed: [],
                //选中的数组，零个（点击画布） 一个（框选或点击） 多个 （框选）
                selected: [],
                //可连接的用于测试连接
                connectAbel: [],
                //已连接的,只有一个，用于测试连接
                connected: [],
                //不可连接的，用于测试连接
                unConnectAbel: []
            },
            {
                get: (target, property) => {
                    //判断是否设置了默认的节点状态
                    if (this.isSetNodeStatus) {
                        //所取的状态就是节点的设置状态
                        if (this.setNodeStatusStr == property) {
                            //判断对应的状态是否包含这些组件，不包含则返回添加的
                            for (let i = 0; i < this.setNodeStatusArr.length; i++) {
                                let id = this.setNodeStatusArr[i]
                                //其它的属性没有此id的话进行赋值，不然鼠标状态全无
                                let isContain = false
                                for (let pro in target) {
                                    if (pro !== property) {
                                        if (Util.isContain(target[pro], id)) {
                                            isContain = true
                                        }
                                    }
                                }
                                if (!isContain && !Util.isContain(target[property], id)) {
                                    target[property].push(id)
                                }
                            }
                        }
                    }
                    return target[property]
                }
            }
        )
        //输入接口状态
        this.statusInPort = {
            //鼠标移上，只有一个
            mouseMoveed: [],
            //多个需求没有对应的输入选中
            selected: [],
            //可连接
            connectAbel: [],
            //不可连接
            unConnectAbel: [],
            //已连接
            connected: [],
            //因为测试连接暂时不连接的输入
            hide: []
        }
        //输出接口状态
        this.statusOutPort = {
            //鼠标移上，只有一个
            mouseMoveed: [],
            //选中
            selected: [],
            //可连接
            connectAbel: [],
            //不可连接
            unConnectAbel: [],
            //已连接
            connected: [],
            //因为测试连接暂时不连接的输入
            hide: []
        }
        //当前实际的连接状态
        this.links = []
        //连接的起点和终点
        this.starts = {}
        this.ends = {}
        //输入输出的参数变量
        this.inParams = []
        this.outParams = []
        //鼠标按下时的坐标
        this.posDown = null
        //鼠标按下时的坐标记录
        this.posDownStart = null
        this.isClickLink = false
        //是否添加
        this.isAddNode = false
        //是否正在添加
        this.isAdding = false
        //添加对象信息
        this.addStartMsg = null
        //添加对象信息
        this.addParam = null
        //添加坐标信息 x,y
        this.addPos = null
        //是否测试连接
        this.isTestPortConnect = false
        this.testPortStart = []
        this.testPortEnd = []
        this.testConnectType = null //'bezierCurve' 'straightLine'
        this.testPort = null
        //菜单相关
        this.currentMenuId = null
        //显示名称
        this.showCanvasName = null
        //运行的时间阻止连击
        this.run2Time = false
        //是否循环，防止重复运算
        this.isLoopInOut = ''
        this.isLoopInOutRet = null
        //是否执行节点的状态持续保持，满足展示的需求
        this.isSetNodeStatus = false
        //this.setNodeStatus([15511472514196],'connectAbel')
        //多选操作
        this.isMultSelect = false
    }
    /**
     * 初始化基本画布canvas
     */
    initBaseCanvas(dom) {
        //对父容器进行改造,方便后面的事件
        //解决鼠标关注
        dom.setAttribute('tabindex', '0')
        dom.style.position = 'relative'
        //初始化画布 生成对应的主展示canvas
        let height = dom.clientHeight - 0
        let width = dom.clientWidth - 0
        this.canvas = document.createElement('canvas')
        this.canvas.width = width
        this.canvas.height = height
        this.ctx = this.canvas.getContext('2d')
        dom.appendChild(this.canvas)
        this.canvasContent = dom
    }
    /**
     * 父容器大小改变
     * isResize 是否重置画布内容大小
     */
    resizeChart = isResize => {
        let dom = this.main.param.dom
        let height = dom.clientHeight - 0
        let width = dom.clientWidth - 0
        this.canvas.width = width
        this.canvas.height = height
        //重置大小，来调用scale
        this.isResize = isResize
        if (!isResize) {
            this.isInitScale = true
            this.isResize = true
        }
        this.main.triggerEvent(EVENTS['updateAllCovers'])
    }
    /**
     * 返回当前画布的高宽
     */
    getCanvasSize = obj => {
        Object.assign(obj, {
            width: this.canvas.width,
            height: this.canvas.height,
            minX: this.canvas.offsetLeft, //无效的数据
            minY: this.canvas.offsetTop,
            maxX: this.canvas.offsetLeft + this.canvas.width,
            maxY: this.canvas.offsetTop + this.canvas.height
        })
    }
    /**
     * 返回画布平移缩放信息
     */
    getCanvasScaleTranslate = obj => {
        Object.assign(obj, {
            panX: this.panX,
            panY: this.panY,
            scaleNum: this.scaleNum
        })
    }
    /**
     * 初始化画布名称容器，会根据名称长度高度自动记录到遮挡
     * 默认隐藏，有名字时开始计算宽高记录遮挡
     */
    initNameContainer(dom) {
        this.canvasName = document.createElement('canvas')
        this.canvasName.width = 300
        this.canvasName.height = 50
        this.canvasName.setAttribute('style', 'display:none;position:absolute;left:0px;top:0px;')
        dom.appendChild(this.canvasName)
    }
    /**
     * 清空名称，并隐藏
     */
    clearNameContainer() {
        let ctx = this.canvasName.getContext('2d')
        Util.clearCanvasDrawBack(ctx, this.canvasName.width, this.canvasName.height, 'rgba(255,255,255,0)')
        this.canvasName.style.display = 'none'
        //移除名称在覆盖中的占位
        //delete this.main.global.covers['name']
        this.main.triggerEvent(EVENTS['deleteCovers'], 'name')
    }
    /**
     * 绘制画布名称
     * @param {*} text
     */
    drawCanvasName(text) {
        //读取配置是否显示名称
        if (!this.main.param.canvasName.isShow && this.showCanvasName !== this.main.global.metadata.name) {
            return false
        }
        //从数据中得到名称
        if (!text) {
            text = Util.isContain(this.main.global.metadata, 'name') ? this.main.global.metadata.name : ''
            if (!text || text == '') {
                this.clearNameContainer()
                return false
            }
            //更换名称
            if (this.showCanvasName !== this.main.global.metadata.name) {
                this.clearNameContainer()
            } else {
                return false
            }
        }
        let config = this.main.param.canvasName
        // let ctx = this.canvasName.getContext('2d')

        if (!text) {
            text = config.tipText
        }
        // let x = config.style.left
        // let y = config.style.top
        // let textStyle = config.style.textStyle
        // let lengthMax = config.style.lengthMax
        // let coverMsg = Util.drawText(ctx, x, y, text, textStyle, lengthMax)
        this.canvasName.title = text
        this.canvasName.style.display = 'block'
        this.showCanvasName = text
        //由于名称导致了一定的遮盖，所以使用了透明色，且不加入覆盖层
        /*
        //添加至覆盖层
        let textHeight = config.style.textHeight
        this.main.triggerEvent(EVENTS['saveCovers'],'name',{
            left:x,
            top:y-textHeight,//吃惊。。x y 指向的是文字的左下角
            width:coverMsg.textLength,
            height:textHeight
        })
        */
    }
    /**
     * 初始化状态容器，
     */
    initStatusContainer(dom) {
        this.runStatus = document.createElement('div')
        this.runStatus.setAttribute(
            'style',
            'display:none;position:absolute;left:45%;top:20px;padding-top:8px;text-align:center;background:rgba(41,41,41,0.98);border-radius:20px;width:160px;height:36px;color:#FFFFFF;font-family:PingFangSC-Light;font-size:12px;'
        )
        dom.appendChild(this.runStatus)
    }

    /**
     * 显示运行状态
     * @param {*} text
     */
    showStatus(text) {
        this.runStatus.innerHTML = text
        this.runStatus.style.display = 'block'
        this.main.triggerEvent(EVENTS['saveCovers'], 'status', {
            left: '45%',
            top: 20,
            width: 160,
            height: 36
        })
    }
    /**
     * 隐藏状态显示容器
     */
    hideStatusContainer() {
        this.runStatus.style.display = 'none'
        this.main.triggerEvent(EVENTS['deleteCovers'], 'status')
    }
    /**
     * 设置运行的状态
     */
    setStatus = () => {
        let status = this.main.runStatus
        if (typeof status.isShowSelf !== 'undefined' && status.isShowSelf) {
            if (typeof status.showSelfEvent !== 'undefined') {
                this.main.triggerEvent(status.showSelfEvent, status)
            }
            return
        }
        if (status.isShowTip) {
            this.showStatus(status.tipText)
        } else {
            this.hideStatusContainer()
        }
    }
    /**
     * 数据重计算
     */
    initData() {
        let datas = this.main.datas
        //重置
        this.starts = {}
        this.ends = {}
        this.links = []
        this.inParams = {}
        this.outParams = {}
        let isUpdate = false
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i]
            let dataClass = this.node.getClass(data)
            if (!dataClass && this.main.isChangeDatas) {
                let tip = ''
                if (data.classname) {
                    tip = `${data.name}: clazzName为 [${data.classname}] 的类型信息缺失`
                    this.main.triggerEvent(EVENTS['messageTip'], tip)
                }
                if (data.compId) {
                    tip = `${data.name}: compId为 [${data.compId}] 的类型信息缺失`
                    this.main.triggerEvent(EVENTS['messageTip'], tip)
                }
                continue
            } else if (!dataClass) {
                continue
            }
            //如果确定是新增的数据则进行数据初始化，并付给心的id
            if (Util.isContain(data, 'isAdd') && data.isAdd) {
                data.isAdd = false
                data.id = Util.getUuid()
                data.position = { x: null, y: null }
                data.parents = []
                data.children = []
                isUpdate = true
            }
            //id都转为字符串,暂时服务端要求是整数，不转了
            //data.id += ''
            let x = data.position.x
            let y = data.position.y
            //如果没有坐标，则进行坐标初始化
            if (x == null || y == null) {
                let xy = this.initCreateDAGPosition(data)
                x = xy.x
                y = xy.y
                data.position = { x, y }
                this.isResize = true
            }

            let incount = dataClass.input.length
            let outcount = dataClass.output.length
            this.initInOut(incount, outcount, x, y, data.children, data.parents, data.id, dataClass)
        }
        if (isUpdate) {
            this.main.triggerEvent(EVENTS['topologyChange'], { components: this.main.datas })
        }
        this.main.isChangeDatas = false
    }
    /**
     * 初始化画布的输入输出数据
     * @param {*} incount
     * @param {*} outcount
     * @param {*} x
     * @param {*} y
     * @param {*} outLinkArrs
     * @param {*} inLinkArrs
     * @param {*} dataid
     * @param {*} dataClass
     */
    initInOut(incount, outcount, x, y, outLinkArrs, inLinkArrs, dataid, dataClass) {
        let links = this.links
        let w = this.main.param.node.nodeStyle.eWidth
        let h = this.main.param.node.nodeStyle.eHeight
        let inPortStyle = this.main.param.node.inPortStyle
        let outPortStyle = this.main.param.node.outPortStyle
        let numberRadiusIn = inPortStyle.numberRadius
        let numberRadiusOut = outPortStyle.numberRadius
        //几个入口则分N+1段，每段长度为
        let incountOneLength = w / (incount + 1)
        for (let i = 0; i < incount; i++) {
            let oneX = x + (i + 1) * incountOneLength
            let oneY = y
            //判断是否连接
            let islink = false
            for (let j = 0; j < inLinkArrs.length; j++) {
                let obj = inLinkArrs[j]
                if (typeof obj[i] !== 'undefined') {
                    islink = true
                    break
                }
            }
            if (islink) {
                this.ends[dataid + '-' + i] = { x: oneX, y: oneY }
            }
            //准备接口详情
            //Y上方便node连接的范围扩展
            let connectAdd = 3
            let inputParamClass = dataClass.input[i]
            let obj = {
                id: dataid,
                index: i,
                pid: dataid + '-' + i,
                x: oneX,
                y: oneY,
                hoverExtent: {
                    minX: oneX - numberRadiusIn,
                    minY: oneY - numberRadiusIn,
                    maxX: oneX + numberRadiusIn,
                    maxY: oneY + numberRadiusIn
                },
                connectExtent: {
                    minX: oneX - incountOneLength / 2,
                    minY: y - connectAdd,
                    maxX: oneX + incountOneLength / 2,
                    maxY: y + h + connectAdd
                },
                type: inputParamClass.type,
                des: inputParamClass.name + '-' + inputParamClass.description
            }
            //开头和结尾的长度需增加
            if (i == 0) {
                obj.connectExtent.minX -= incountOneLength / 2
            }
            if (i == incount - 1) {
                obj.connectExtent.maxX += incountOneLength / 2
            }
            this.inParams[dataid + '-' + i] = obj
        }
        let outcountOneLength = w / (outcount + 1)
        for (let i = 0; i < outcount; i++) {
            let oneX = x + (i + 1) * outcountOneLength
            let oneY = y + h
            let islink = false
            //多次循环，可能一个输出对应多个输入
            for (let j = 0; j < outLinkArrs.length; j++) {
                let obj = outLinkArrs[j]
                if (typeof obj[i] !== 'undefined') {
                    islink = true
                    let key = dataid + '-' + i
                    let objLink = {}
                    objLink[key] = obj[i]
                    links.push(objLink)
                }
            }
            if (islink) {
                this.starts[dataid + '-' + i] = { x: oneX, y: oneY }
            }
            //准备接口详情
            let connectAdd = 3
            let outputParamClass = dataClass.output[i]
            let obj = {
                id: dataid,
                index: i,
                pid: dataid + '-' + i,
                x: oneX,
                y: oneY,
                hoverExtent: {
                    minX: oneX - numberRadiusOut,
                    minY: oneY - numberRadiusOut,
                    maxX: oneX + numberRadiusOut,
                    maxY: oneY + numberRadiusOut
                },
                connectExtent: {
                    minX: oneX - outcountOneLength / 2,
                    minY: y - connectAdd,
                    maxX: oneX + outcountOneLength / 2,
                    maxY: y + h + connectAdd
                },
                type: outputParamClass.type,
                des: outputParamClass.name + '-' + outputParamClass.description
            }
            //开头和结尾的长度需增加
            if (i == 0) {
                obj.connectExtent.minX -= outcountOneLength / 2
            }
            if (i == incount - 1) {
                obj.connectExtent.maxX += outcountOneLength / 2
            }
            this.outParams[dataid + '-' + i] = obj
        }
    }
    /**
     * 放大
     * 不提供坐标则是画布中心放大
     */
    scaleEnlarged = pos => {
        if (!this.main.param.canvas.isScaleAction || this.scaleNum > this.main.param.canvas.scaleExtent[1]) {
            //
            return
        }
        let posXY
        if (!pos) {
            pos = { x: this.canvas.width / 2, y: this.canvas.height / 2 }
        }
        posXY = Util.leftRight2Canvas(pos.x, pos.y, this.panX, this.panY, this.scaleNum)
        let scaleValue = this.main.param.canvas.scaleValue
        let zoom = 1 / scaleValue
        this.panX = pos.x - posXY.x * (this.scaleNum * zoom)
        this.panY = pos.y - posXY.y * (this.scaleNum * zoom)
        this.scaleNum = this.scaleNum / scaleValue
        this.isScale = true
        this.updatePanScale()
    }
    /**
     * 缩小
     * 不提供坐标则是画布中心缩小
     */
    scaleReduce = pos => {
        if (!this.main.param.canvas.isScaleAction || this.scaleNum < this.main.param.canvas.scaleExtent[0]) {
            //
            return
        }
        let posXY
        if (!pos) {
            pos = { x: this.canvas.width / 2, y: this.canvas.height / 2 }
        }
        posXY = Util.leftRight2Canvas(pos.x, pos.y, this.panX, this.panY, this.scaleNum)
        let scaleValue = this.main.param.canvas.scaleValue
        let zoom = scaleValue
        this.panX = pos.x - posXY.x * (this.scaleNum * zoom)
        this.panY = pos.y - posXY.y * (this.scaleNum * zoom)
        this.scaleNum = this.scaleNum * scaleValue
        this.isScale = true
        this.updatePanScale()
    }
    /**
     * 画布重置
     */
    resize() {
        let isResize = this.isResize
        let datas = this.main.datas
        let eWidth = this.main.param.node.nodeStyle.eWidth
        let eHeight = this.main.param.node.nodeStyle.eHeight
        let canvasWidth = this.canvas.width
        let canvasHeight = this.canvas.height
        //判断是否resize
        if (!isResize || datas.length < 1) {
            return false
        }
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
        //设置最大最小
        let minExtent = this.main.param.canvas.scaleExtentAuto[0]
        let maxExtent = this.main.param.canvas.scaleExtentAuto[1]
        if (num > maxExtent) {
            num = maxExtent
        } else if (num < minExtent) {
            num = minExtent
        }
        //解决只有单个时，导致的放大过量的问题
        if (datas.length == 1) {
            num = 1
        }
        this.panX = canvasWidth / 2 - centerX * num
        this.panY = canvasHeight / 2 - centerY * num
        this.scaleNum = num
        if (isNaN(this.scaleNum)) {
            this.scaleNum = 1
            this.panX = 0
            this.panY = 0
        }
        this.isResize = false //通过方法改变变量
        this.isInitScale = true //启用初始化缩放
        this.updatePanScale()
    }
    /**
     * 存储当前画布的范围
     */
    updatePanScale() {
        //存储画布的平移缩放操作
        this.main.triggerEvent(EVENTS['updatePanScale'], {
            id: this.main.global.metadata.id,
            scaleNum: this.scaleNum,
            panX: this.panX,
            panY: this.panY
        })
    }
    /**
     * 平移缩放操作
     */
    scaleTranslate() {
        let isInitScale = this.isInitScale
        let isScale = this.isScale
        let ctx = this.ctx
        let scaleNum = this.scaleNum
        let panX = this.panX
        let panY = this.panY
        //问题：何种状态下才可以进行缩放  之前是 画布状态 或 不能编辑状态 且 平移发生了变化叠加 isScale
        if (isScale || isInitScale || this.translateX !== 0 || (this.translateY !== 0 && this.holdType == 'canvas')) {
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.scale(scaleNum, scaleNum)
            ctx.translate(panX / scaleNum, panY / scaleNum)
            this.isInitScale = false
            this.isScale = false
        }
        this.translateX = 0
        this.translateY = 0
    }
    /**
     * 加载当前画布的范围
     */
    loadPanScale() {
        let canvasId = this.main.global.metadata.id
        this.main.triggerEvent(EVENTS['loadPanScale'], { id: canvasId })
    }
    /**
     *
     * @param {*} status
     */
    loadPanScaleCallBack = status => {
        this.panX = status.panX
        this.panY = status.panY
        this.scaleNum = status.scaleNum
        this.isInitScale = true
        //关键，不再进行Resize了，而是直接使用缩放值
        this.isResize = false
    }
    /************画布绘制相关start*************/
    /**
     * 清空画布
     * todo,配置画布的底色
     */
    drawBackground() {
        let background = this.main.param.canvas.background
        Util.clearCanvasDrawBack(this.ctx, this.canvas.width, this.canvas.height, background)
    }
    /**
     * 绘制元素
     * todo 节点到node里面处理包括新增节点和数字接口。线到link处理，包括测试连接 ，然后鹰眼绘制时复用
     * isOnlyScreen 是否屏幕范围内绘制
     */
    drawEles(ctx, scaleNum, isOnlyScreen) {
        if (!ctx) {
            ctx = this.ctx
        }
        if (!scaleNum) {
            scaleNum = this.scaleNum
        }
        let runStatus = this.main.runStatus
        //let datas = this.main.datas
        if (runStatus.isEditTopology) {
            //绘制测试连接线
            this.link.drawTestPortLine(
                ctx,
                this.isTestPortConnect,
                this.testPortStart,
                this.testPortEnd,
                this.testConnectType
            )
        }
        //绘制连接线
        this.link.drawLinkedLine(ctx, isOnlyScreen)
        //绘制节点
        this.node.drawNode(ctx, scaleNum, isOnlyScreen)
        if (runStatus.isEditTopology) {
            //绘制新增
            this.node.drawAddNew(ctx, scaleNum)
        }
        //绘制带数字的接口
        this.node.drawPortNum(ctx, scaleNum, isOnlyScreen)
        //绘制框选
        this.drawBoxSelect(ctx)
    }
    /**
     * 绘制框选范围
     */
    drawBoxSelect(ctx) {
        let boxSelectStart = this.boxSelectStart
        let boxSelectEnd = this.boxSelectEnd
        if (boxSelectStart.length > 0 && boxSelectEnd.length > 0) {
            ctx.fillStyle = 'rgba(100,150,185,0.5)'
            let startX = boxSelectStart[0] <= boxSelectEnd[0] ? boxSelectStart[0] : boxSelectEnd[0]
            let startY = boxSelectStart[1] <= boxSelectEnd[1] ? boxSelectStart[1] : boxSelectEnd[1]
            let endX = boxSelectEnd[0] >= boxSelectStart[0] ? boxSelectEnd[0] : boxSelectStart[0]
            let endY = boxSelectEnd[1] >= boxSelectStart[1] ? boxSelectEnd[1] : boxSelectStart[1]
            ctx.fillRect(startX, startY, endX - startX, endY - startY)
        }
    }
    /************画布绘制相关end*************/
    /**
     * 删除节点 或 连接线
     * isForce 是否强力删除
     * isConfirm 在二次确认的情况下触发
     */
    deleteEles = (isForce, isConfirm) => {
        //只有父元素关注时才可以执行
        if (!this.isFocus && !isForce) {
            return
        }
        let status = this.main.runStatus
        //判断是否支持编辑
        if (!status.isEditTopology) {
            this.main.triggerEvent(EVENTS['messageTip'], '当前状态不支持删除')
            return
        }
        if (
            typeof this.main.param.node.deleteConfirm !== 'undefined' &&
            this.main.param.node.deleteConfirm &&
            !isConfirm &&
            this.statusNode.selected.length > 0
        ) {
            this.main.param.node.deleteConfirm(this.statusNode.selected)
            return
        }
        let datas = this.main.datas
        //删除节点及相连的线
        for (let i = 0; i < this.statusNode.selected.length; i++) {
            let rrid = this.statusNode.selected[i]
            //删除节点以及与节点连接的线
            for (let j = 0; j < datas.length; j++) {
                let data = datas[j]
                if (rrid == datas[j].id) {
                    datas.splice(j, 1)
                    break
                }
                let children = data.children
                for (let m = children.length - 1; m >= 0; m--) {
                    let c = children[m]
                    for (let cIndex in c) {
                        if (c[cIndex].split('-')[0] + '' == rrid + '') {
                            children.splice(m, 1)
                        }
                    }
                }
                let parents = data.parents
                for (let m = parents.length - 1; m >= 0; m--) {
                    let p = parents[m]
                    for (let pIndex in p) {
                        if (p[pIndex].split('-')[0] + '' == rrid + '') {
                            parents.splice(m, 1)
                        }
                    }
                }
            }
        }
        //删除选中的连接线
        if (this.statusLink.selected.length > 0) {
            //获得需要删除的元素的id和对应的 parents 和 children，然后执行清除
            let startRRId, startPortIndex, endRRId, endPortIndex
            for (let i = 0; i < this.statusLink.selected.length; i++) {
                let oneLink = this.statusLink.selected[i]
                //一条线
                for (let startPort in oneLink) {
                    let endPort = oneLink[startPort]
                    startRRId = startPort.split('-')[0]
                    startPortIndex = startPort.split('-')[1]
                    endRRId = endPort.split('-')[0]
                    endPortIndex = endPort.split('-')[1]
                    //一条线的删除
                    for (let j = 0; j < datas.length; j++) {
                        let data = datas[j]
                        if (data.id + '' == startRRId + '') {
                            let children = data.children
                            for (let m = 0; m < children.length; m++) {
                                let c = children[m]
                                for (let cIndex in c) {
                                    if (
                                        cIndex + '' == startPortIndex + '' &&
                                        c[cIndex] == endRRId + '-' + endPortIndex
                                    ) {
                                        children.splice(m, 1)
                                    }
                                }
                            }
                        } else if (data.id + '' == endRRId + '') {
                            let parents = data.parents
                            for (let m = 0; m < parents.length; m++) {
                                let p = parents[m]
                                for (let pIndex in p) {
                                    if (
                                        pIndex + '' == endPortIndex + '' &&
                                        p[pIndex] == startRRId + '-' + startPortIndex
                                    ) {
                                        parents.splice(m, 1)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (this.statusNode.selected.length > 0 || this.statusLink.selected.length > 0) {
            //数据变更派发
            this.main.triggerEvent(EVENTS['topologyChange'], { components: this.main.datas })
        }
        this.statusNode.selected = []
        this.statusInPort.selected = [] //虽然有的没有
        this.statusOutPort.selected = []
        this.statusLink.selected = []
        //选中节点 变更
        this.setSelectElement([])
        //更新画布状态???
    }
    /**
     * 提供的坐标是否没有覆盖层
     * pos 相对于画布左上角的坐标
     */
    isPosNoCover = pos => {
        let covers = {} // = this.main.global.covers
        this.main.triggerEvent(EVENTS['getCovers'], covers)
        let x = pos.x,
            y = pos.y
        for (let coverName in covers) {
            let coverRange = covers[coverName].extent
            if (x >= coverRange[0] && x <= coverRange[1] && y >= coverRange[2] && y <= coverRange[3]) {
                return false
            }
        }
        return true
    }
    /**
     * 查询输入端口
     */
    findInPortByPid = pid => {
        if (Util.isContain(this.inParams, pid)) {
            return this.inParams[pid]
        }
        return null
    }
    /**
     * 查询输入端口
     */
    findOutPortByPid = pid => {
        if (Util.isContain(this.outParams, pid)) {
            return this.outParams[pid]
        }
        return null
    }
    /**
     * 根据画布坐标查找输入接口
     */
    findInPort = (x, y) => {
        let param
        for (let pid in this.inParams) {
            param = this.inParams[pid]
            if (
                x <= param.hoverExtent.maxX &&
                x >= param.hoverExtent.minX &&
                y <= param.hoverExtent.maxY &&
                y >= param.hoverExtent.minY
            ) {
                return param
            }
        }
    }
    /**
     * 根据画布坐标查找输出接口
     */
    findOutPort = (x, y) => {
        let param
        for (let pid in this.outParams) {
            param = this.outParams[pid]
            if (
                x <= param.hoverExtent.maxX &&
                x >= param.hoverExtent.minX &&
                y <= param.hoverExtent.maxY &&
                y >= param.hoverExtent.minY
            ) {
                return param
            }
        }
    }
    /**
     * 根据画布坐标查找节点
     */
    findNode = (x, y) => {
        let eHeight = this.main.param.node.nodeStyle.eHeight
        let eWidth = this.main.param.node.nodeStyle.eWidth
        for (let i = this.main.datas.length - 1; i >= 0; i--) {
            let data = this.main.datas[i]
            let nodeClass = this.node.getClass(data)
            if (!nodeClass) {
                continue
            }
            let minx = data.position.x
            let miny = data.position.y
            let maxx = minx + eWidth
            let maxy = miny + eHeight
            if (x <= maxx && x > minx && y <= maxy && y >= miny) {
                return data
            }
        }
    }
    /**
     * 根据画布坐标查找线
     */
    findLink = (x, y) => {
        for (let i = 0; i < this.links.length; i++) {
            let oneLink = this.links[i]
            for (let startPort in oneLink) {
                let start = this.starts[startPort]
                if (typeof start !== 'undefined') {
                    let end = this.ends[oneLink[startPort]]
                    //异常过滤
                    if (typeof end == 'undefined') {
                        continue
                    }
                    //判断是否在两点矩形范围内
                    let minX, minY, maxX, maxY
                    if (start.x <= end.x) {
                        minX = start.x
                        maxX = end.x
                    } else {
                        minX = end.x
                        maxX = start.x
                    }
                    if (start.y <= end.y) {
                        minY = start.y
                        maxY = end.y
                    } else {
                        minY = end.y
                        maxY = start.y
                    }
                    if (
                        typeof end !== 'undefined' &&
                        minX - 10 <= x &&
                        maxX + 10 >= x &&
                        minY - 10 <= y &&
                        maxY + 10 >= y
                    ) {
                        //绘制线判断
                        let lineWidth = 10
                        if (start && end) {
                            //使用不实时重绘的名称图层做测试连接，且不绘制
                            let ctx = this.canvasName.getContext('2d')
                            ctx.beginPath()
                            ctx.moveTo(start.x - lineWidth, start.y)
                            ctx.lineTo(start.x + lineWidth, start.y)
                            ctx.bezierCurveTo(
                                start.x + lineWidth,
                                start.y + 60,
                                end.x + lineWidth,
                                end.y - 60,
                                end.x + lineWidth,
                                end.y
                            )
                            ctx.lineTo(end.x - lineWidth, end.y)
                            ctx.bezierCurveTo(
                                end.x - lineWidth,
                                end.y - 60,
                                start.x - lineWidth,
                                start.y + 60,
                                start.x - lineWidth,
                                start.y
                            )
                            ctx.closePath()
                            let isIn = ctx.isPointInPath(parseInt(x), parseInt(y))
                            if (isIn) {
                                return oneLink
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     * 排序到最后
     */
    sortDatasToEnd = id => {
        let datas = this.main.datas
        for (let i = datas.length - 1; i >= 0; i--) {
            let data = datas[i]
            if (data.id + '' == id + '') {
                datas.splice(i, 1)
                datas.push(data)
                return
            }
        }
    }
    /**
     * 设置连接输入状态
     */
    setConnectAbelStatusIn = outPort => {
        let datas = this.main.datas
        this.statusNode.connectAbel = []
        this.statusInPort.connectAbel = []
        this.statusInPort.unConnectAbel = []
        let portType = outPort.type
        let nodeId = outPort.id
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i]
            let nodeClass = this.node.getClass(data)
            if (!nodeClass) {
                continue
            }
            let inputs = nodeClass.input
            let isLoop = false
            for (let j = 0; j < inputs.length; j++) {
                let input = inputs[j]
                if (input.type == portType && data.id !== nodeId) {
                    if (!Util.isContain(this.statusInPort.connectAbel, data.id + '-' + j)) {
                        if (datas.length <= 50) {
                            isLoop = this.isLoopDAG(data.id, j, outPort.id, outPort.index)
                        }
                        if (!isLoop) {
                            this.statusInPort.connectAbel.push(data.id + '-' + j)
                            if (!Util.isContain(this.statusNode.connectAbel, nodeId)) {
                                this.statusNode.connectAbel.push(data.id)
                            }
                        } else {
                            this.statusInPort.unConnectAbel.push(data.id + '-' + j)
                        }
                    }
                } else {
                    this.statusInPort.unConnectAbel.push(data.id + '-' + j)
                }
            }
        }
    }
    /**
     * 设置连接输出状态
     */
    setConnectAbelStatusOut = inPort => {
        let datas = this.main.datas
        this.statusNode.connectAbel = []
        this.statusOutPort.connectAbel = []
        this.statusOutPort.unConnectAbel = []
        let portType = inPort.type
        let nodeId = inPort.id
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i]
            let nodeClass = this.node.getClass(data)
            if (!nodeClass) {
                continue
            }
            let outputs = nodeClass.output
            let isLoop = false
            for (let j = 0; j < outputs.length; j++) {
                let output = outputs[j]
                if (output.type == portType && data.id !== nodeId) {
                    if (!Util.isContain(this.statusOutPort.connectAbel, data.id + '-' + j)) {
                        if (datas.length <= 50) {
                            isLoop = this.isLoopDAG(inPort.id, inPort.index, data.id, j)
                        }
                        if (!isLoop) {
                            this.statusOutPort.connectAbel.push(data.id + '-' + j)
                            if (!Util.isContain(this.statusNode.connectAbel, nodeId)) {
                                this.statusNode.connectAbel.push(data.id)
                            }
                        } else {
                            this.statusOutPort.unConnectAbel.push(data.id + '-' + j)
                        }
                    }
                } else {
                    this.statusOutPort.unConnectAbel.push(data.id + '-' + j)
                }
            }
        }
    }
    /**
     * 判断是否循环
     */
    isLoopDAG = (inId, inIndex, outId, outIndex) => {
        //let time0 = new Date()
        //虚构连接
        let inventedLinks = this.links.slice(0) //克隆
        let inPid = inId + '-' + inIndex
        let outPid = outId + '-' + outIndex
        //相同的输入和输出直接返回是循环，针对多次移动的情况
        if (inId == outId) {
            return true
        }
        //判断是否已经有最近一次的，和当前的一致，一致则直接返回结果
        if (this.isLoopInOut !== '' && this.isLoopInOut == outId + '-' + inId) {
            return this.isLoopInOutRet
        }
        this.isLoopInOut = outId + '-' + inId
        //删除被覆盖的连接线
        if (Util.isContain(this.ends, inPid)) {
            //暂时不显示连接内容
            for (let i = 0; i < inventedLinks.length; i++) {
                let oneLink = inventedLinks[i]
                let isBreak = false
                for (let startPort in oneLink) {
                    let endPort = oneLink[startPort]
                    if (endPort == inPid) {
                        if (startPort == outPid) {
                            //已经连接
                        } else {
                            //清除对应的连接信息  在此，如果输入是支持多个连接的话。则不清除
                            if (this.main.param.link.isInPortOne) {
                                inventedLinks.splice(i, 1)
                            }
                        }
                        isBreak = true
                    }
                }
                if (isBreak) {
                    break
                }
            }
        }
        //let time1 = new Date()

        //console.log('time1-time0:',time1-time0)
        //添加新的连接线
        let children = {}
        children[outPid] = inPid
        inventedLinks.push(children)
        //简化连接只保留输入的 节点id和输出的节点id
        let simplifyLinks = []
        let childsObj = {}
        for (let i = 0; i < inventedLinks.length; i++) {
            let startRRId, endRRId
            let oneLink = inventedLinks[i]
            for (let startPort in oneLink) {
                let endPort = oneLink[startPort]
                startRRId = startPort.split('-')[0]
                endRRId = endPort.split('-')[0]
            }
            let sl = startRRId + '-' + endRRId
            if (!Util.isContain(simplifyLinks, sl)) {
                simplifyLinks.push(sl)
                if (!Util.isContain(childsObj, startRRId)) {
                    childsObj[startRRId] = []
                }
                childsObj[startRRId].push(endRRId)
            }
        }
        // let time2 = new Date()

        //console.log('time2-time1:',time2-time1)
        //优化数据，不使用数组循环，而使用键值对取值
        //判断是否循环
        this.countLoop1 = 0
        //判断是否循环
        this.countLoop2 = 0
        //let isLoop = this.getLinkAndIsLoop(outId,childsObj,outId)
        let isLoop = this.topoSort(childsObj)
        // let time3 = new Date()
        //console.log('time3-time2:',time3-time2)
        //console.log('调用loop：'+this.countLoop1,'调用循环次数：'+this.countLoop2)

        if (typeof isLoop !== 'undefined' && isLoop) {
            this.isLoopInOutRet = true
            return true
        } else {
            this.isLoopInOutRet = false
            return false
        }
    }
    /**
     * 拓扑排序法找循环
     * 寻找一个入度为0的顶点，将该顶点从图中删除（放进队列里存着，队列顺序就是拓扑排序顺序）
     * 并将该节点，及其所有的出边从图中删除（即该节点指向的结点的入度减一）
     * 最终若图中全为入度为1的点，这些点至少组成一个回路
     * @param childsObj 包含所有已有的连接 为对象的数组连接
     */
    topoSort = childsObj => {
        // let time1 = new Date()
        let datas = this.main.datas
        //邻接矩阵 二维数组
        let graph = []
        //结点个数 int
        let vNum = datas.length
        //边的个数 int  暂时用不到，为了生成graph
        //let eNum = 0
        //记录每个节点的入度，初始化为0 一维数组
        let count = {}
        //保存拓扑队列 一维数组
        let linkList = []
        //生成二维矩阵，矩阵还是用对象来表示了，读取速度快
        for (let i = 0; i < vNum; i++) {
            let data = datas[i]
            let rrid = data.id + ''
            graph[rrid] = {}
            count[rrid] = 0
            for (let j = 0; j < vNum; j++) {
                let data = datas[j]
                let rridj = data.id + ''
                graph[rrid][rridj] = 0
            }
        }
        // let time2 = new Date()
        //console.log('time2-time1:',time2-time1)
        //有连接的 二维表变为1
        for (let i = 0; i < vNum; i++) {
            let data = datas[i]
            let rrid = data.id + ''
            //获取对应的子RRID 数组
            let childs = childsObj['' + rrid]
            //graph[rrid] = {}
            //count[rrid] = 0
            if (childs) {
                let childLength = childs.length
                for (let i = 0; i < childLength; i++) {
                    let endRRId = childs[i]
                    graph[rrid][endRRId] = 1
                }
            }
        }

        //console.log('time3-time2:',time3-time2)
        //计算每个结点的入度
        for (let i = 0; i < vNum; i++) {
            let data = datas[i]
            let rrid = data.id + ''
            for (let j = 0; j < vNum; j++) {
                let dataj = datas[j]
                let rridj = dataj.id + ''
                if (Util.isContain(graph[rrid], rridj) && graph[rrid][rridj] == 1) {
                    count[rridj] += 1
                }
            }
        }

        //console.log('time4-time3:',time4-time3)
        //遍历图中所有结点，找入度为0的结点放进数组
        for (let i = 0; i < vNum; i++) {
            let data = datas[i]
            let rrid = data.id + ''
            if (count[rrid] == 0) {
                linkList.push(rrid)
            }
        }

        ///console.log('time5-time4:',time5-time4)
        //暂时存放拓扑序列
        let number = 0
        let temp = []
        //删除被删除结点的出边，对应结点入度减1
        while (!linkList.length == 0) {
            //linkList头部查询1个元素
            //linkList头部删除1个元素
            let rrid = linkList[0]
            temp.push(rrid)
            linkList.splice(0, 1)
            number++
            for (let j = 0; j < vNum; j++) {
                let data = datas[j]
                let rridj = data.id + ''
                if (Util.isContain(graph[rrid], rridj) && graph[rrid][rridj] == 1) {
                    //Util.isContain(graph[rrid],rridj) &&
                    count[rridj] -= 1
                    //出现新的入度为0的结点，删除放入队列
                    if (count[rridj] == 0) {
                        linkList.push(rridj)
                    }
                }
            }
        }

        // let time6 = new Date()
        //console.log('time6-time5:',time6-time5)
        if (number !== vNum) {
            return true
        } else {
            return false
        }
    }
    /**
     * 判断是否有和开始的Id相同，只要走它自己的输出就好了，
     * 从输入的点开始跟踪
     * 如果没有输出则没有循环
     * 有输出则一步步的

    getLinkAndIsLoop = (startRRIdo,childsObj,currentRRId)=>{
        let isLoop = false
        //获取currentRRId对应的子RRID 数组
        let childs = childsObj[''+currentRRId]
        //this.countLoop1++
        if(childs){
            let childLength = childs.length
            for(let i=0;i<childLength;i++){
                //this.countLoop2++
                let endRRId = childs[i]
                if(startRRIdo+'' == endRRId+''){
                    isLoop = true
                    return isLoop
                }else{
                    isLoop = this.getLinkAndIsLoop(startRRIdo,childsObj,endRRId)
                    if(isLoop){
                        return isLoop
                    }
                }
            }
        }
    }
    */
    /**
     * 判断是否有和开始的Id相同

    getLinkAndIsLoop = (startRRIdo,sls,currentRRId)=>{
        let isLoop = false
        for(let i=sls.length-1;i>=0;i--){
            let startRRId = sls[i][0]
            if(currentRRId+''==startRRId+''){
                let endRRId = sls[i][1]
                if(startRRIdo+'' == endRRId+''){
                    isLoop = true
                    return isLoop
                }else{
                    isLoop = this.getLinkAndIsLoop(startRRIdo,sls,endRRId)
                    if(isLoop){
                        return isLoop
                    }
                }
            }
        }
    }
     */
    /**
     * 测试绘制时判断重绘冲突
     */
    setTestLinkConflict = (inPid, outPid) => {
        if (Util.isContain(this.ends, inPid)) {
            //暂时不显示连接的内容
            for (let i = 0; i < this.links.length; i++) {
                let oneLink = this.links[i]
                let isBreak = false
                for (let startPort in oneLink) {
                    let endPort = oneLink[startPort]
                    if (endPort == inPid) {
                        if (startPort == outPid) {
                            //和连接相同
                        } else {
                            this.statusInPort.hide = [inPid]
                            this.statusOutPort.hide = [startPort]
                        }
                        isBreak = true
                    }
                }
                if (isBreak) {
                    break
                }
            }
        }
    }
    /**
     * 鼠标移上
     * event 相对于画布的坐标位置
     */
    mousemove = event => {
        //todo 框选提炼出去
        if (this.isBoxSelect) {
            this.canvas.style.cursor = 'crosshair'
        } else {
            this.canvas.style.cursor = 'move'
        }
        //画布左上角坐标
        let posMove = event
        let left = posMove.x
        let top = posMove.y
        //画布坐标
        let posMoveXY = Util.leftRight2Canvas(left, top, this.panX, this.panY, this.scaleNum)
        let x = posMoveXY.x
        let y = posMoveXY.y
        this.mouseX = x
        this.mouseY = y
        //鼠标在覆盖范围上无作用
        if (!this.isPosNoCover(event)) {
            return false
        }
        let status = this.main.runStatus
        let datas = this.main.datas
        //一定会产生 posDown按下的坐标 鼠标按压状态的移动，拖拽（节点新增、画布拖拽、画矩形、连接节点接口、移动节点）
        if (this.isHold) {
            if (this.holdType == 'add') {
                if (!this.isAddNode) {
                    //只在画布范围内进行绘制
                    if (Util.isInCanvas(this.canvas, left, top) && this.addStartMsg) {
                        //只有移动坐标才判定提示
                        if (this.addStartMsg && (this.addStartMsg.x !== event.x || this.addStartMsg.y !== event.y)) {
                            if (!this.main.isInitCanvas) {
                                this.addStartMsg = null
                                this.main.triggerEvent(EVENTS['messageTip'], '未创建画布！')
                                this.isHold = false
                                return false
                            }
                            if (!status.isEditTopology || !this.main.isInitCanvas) {
                                this.addStartMsg = null
                                this.main.triggerEvent(EVENTS['messageTip'], '当前状态不能新增')
                                this.isHold = false
                                return false
                            }
                            if (this.isAdding) {
                                this.addStartMsg = null
                                this.main.triggerEvent(EVENTS['messageTip'], '正在新增不能新增')
                                this.isHold = false
                                return false
                            }
                            //新增类型不确定
                            if (
                                !Util.isContain(this.addParam, 'classname') &&
                                !Util.isContain(this.addParam, 'compId')
                            ) {
                                this.addStartMsg = null
                                this.main.triggerEvent(EVENTS['messageTip'], '新增类型不确定')
                                this.isHold = false
                                return false
                            }
                            //新增类型找不到
                            let dataClass = this.node.getClass(this.addParam)
                            if (!dataClass) {
                                let tip = ''
                                if (this.addParam.classname) {
                                    let name = ''
                                    if (Util.isContain(this.addParam, 'name')) {
                                        name = this.addParam.name
                                    }
                                    tip = `${name}: clazzName为 [${this.addParam.classname}] 的类型信息缺失`
                                    this.main.triggerEvent(EVENTS['messageTip'], tip)
                                }
                                if (this.addParam.compId) {
                                    let name = ''
                                    if (Util.isContain(this.addParam, 'name')) {
                                        name = this.addParam.name
                                    }
                                    tip = `${name}: compId为 [${this.addParam.compId}] 的类型信息缺失`
                                    this.main.triggerEvent(EVENTS['messageTip'], tip)
                                }
                                this.isHold = false
                                return false
                            }
                        }
                        this.isAddNode = true
                        //焦点获得才可以执行快捷键动作
                        this.canvasContent.focus()
                    }
                }
                if (this.isAddNode && !this.isAdding) {
                    let w = this.main.param.node.nodeStyle.eWidth
                    let h = this.main.param.node.nodeStyle.eHeight
                    this.addPos = {
                        x: x - w / 2,
                        y: y - h / 2
                    }
                }
            }
            if (this.holdType == 'adds') {
                if (!this.isAddNode) {
                    //只在画布范围内进行绘制
                    if (Util.isInCanvas(this.canvas, left, top) && this.addStartMsg) {
                        //只有移动坐标才判定提示
                        if (this.addStartMsg && (this.addStartMsg.x !== event.x || this.addStartMsg.y !== event.y)) {
                            if (!this.main.isInitCanvas) {
                                this.addStartMsg = null
                                this.main.triggerEvent(EVENTS['messageTip'], '未创建画布！')
                                this.isHold = false
                                return false
                            }
                            if (!status.isEditTopology || !this.main.isInitCanvas) {
                                this.addStartMsg = null
                                this.main.triggerEvent(EVENTS['messageTip'], '当前状态不能新增')
                                this.isHold = false
                                return false
                            }
                            if (this.isAdding) {
                                this.addStartMsg = null
                                this.main.triggerEvent(EVENTS['messageTip'], '正在新增不能新增')
                                this.isHold = false
                                return false
                            }
                            /*
                            //新增类型不确定
                            if(!Util.isContain(this.addParam,'classname') && !Util.isContain(this.addParam,'compId')){
                                this.addStartMsg = null
                                this.main.triggerEvent(EVENTS['messageTip'],'新增类型不确定')
                                this.isHold = false
                                return false
                            }
                            //新增类型找不到
                            let dataClass = this.node.getClass(this.addParam)
                            if(!dataClass){
                                let tip = ''
                                if(this.addParam.classname){
                                    let name = ''
                                    if(Util.isContain(this.addParam,'name')){
                                        name = this.addParam.name
                                    }
                                    tip = `${name}: clazzName为 [${data.classname}] 的类型信息缺失`
                                    this.main.triggerEvent(EVENTS['messageTip'],tip)
                                }
                                if(this.addParam.compId){
                                    let name = ''
                                    if(Util.isContain(this.addParam,'name')){
                                        name = this.addParam.name
                                    }
                                    tip = `${name}: compId为 [${this.addParam.compId}] 的类型信息缺失`
                                    this.main.triggerEvent(EVENTS['messageTip'],tip)
                                }
                                this.isHold = false
                                return false
                            }
                            */
                        }
                        //todo
                        //选择最小的坐标，直接添加至datas，选中的是这群数据，重新init连接配置
                        this.isAddNode = true
                        //相对坐标的一次改变
                        this.addParam = this.getViewPosition(this.addParam, { x, y })
                        let param
                        let selectArr = []
                        for (let i = 0; i < this.addParam.length; i++) {
                            param = this.addParam[i]
                            datas.push(param)
                            selectArr.push(param.id)
                        }
                        //数据进行重新配置
                        this.initData()
                        //触发事件，收到后关闭变量，然后设置选中
                        this.statusNode.selected = selectArr
                        this.setSelectElement(this.statusNode.selected)
                        //只要有对应的selected id的线就选中此线

                        this.statusLink.selected = []
                        for (let i = 0; i < this.links.length; i++) {
                            let oneLink = this.links[i]
                            for (let startPort in oneLink) {
                                let startId = startPort.split('-')[0]
                                let endId = oneLink[startPort].split('-')[0]
                                if (Util.isContain(selectArr, startId) || Util.isContain(selectArr, endId)) {
                                    this.statusLink.selected.push(oneLink)
                                }
                            }
                        }
                        //鼠标在最左侧的节点上hold
                        this.holdType = 'node'
                        status.isEditPosition = true
                        //this.isAddNode = true
                        this.changeNodes = this.addParam
                        this.isHold = true
                        //焦点获得才可以执行快捷键动作
                        this.canvasContent.focus()
                    }
                }
            } else {
                if (!this.posDown || !this.posDown.x) {
                    return
                }
                //产生位移
                this.translateX = left - this.posDown.x
                this.translateY = top - this.posDown.y
                //可编辑状态 且 鼠标当前在节点上
                if (
                    status.isEditPosition &&
                    this.holdType == 'node' &&
                    this.changeNodes.length > 0 &&
                    (this.translateX !== 0 || this.translateY !== 0)
                ) {
                    for (let i = 0; i < this.changeNodes.length; i++) {
                        this.changeNodes[i].position.x =
                            this.changeNodes[i].position.x + this.translateX / this.scaleNum
                        this.changeNodes[i].position.y =
                            this.changeNodes[i].position.y + this.translateY / this.scaleNum
                    }
                }
            }
            //框选
            if (this.holdType == 'boxSelect') {
                this.boxSelectEnd = [x, y]
                //尝试扩展框选视觉范围
                this.extendView(left, top)
            }
            //画布平移
            if (this.holdType == 'canvas' && this.main.param.canvas.isScaleAction && status.isPanScale) {
                this.translateX = left - this.posDown.x
                this.translateY = top - this.posDown.y
                this.panX = this.panX + this.translateX
                this.panY = this.panY + this.translateY
            }
            //输入
            if (this.holdType == 'inPort') {
                this.statusOutPort.connected = []
                this.statusNode.connected = []
                this.statusNode.unConnectAbel = []
                this.statusInPort.hide = []
                this.statusOutPort.hide = []
                //使用测试连接
                this.isTestPortConnect = true
                //判断所有的输出范围
                let out = null
                let param
                for (let pid in this.outParams) {
                    param = this.outParams[pid]
                    //判断连接的范围节点连接范围+接口范围
                    if (
                        (x <= param.connectExtent.maxX &&
                            x >= param.connectExtent.minX &&
                            y <= param.connectExtent.maxY &&
                            y >= param.connectExtent.minY) ||
                        (x <= param.hoverExtent.maxX &&
                            x >= param.hoverExtent.minX &&
                            y <= param.hoverExtent.maxY &&
                            y >= param.hoverExtent.minY)
                    ) {
                        out = param
                        break
                    }
                }
                //连接到输出的范围上
                if (out) {
                    //大量的情况下
                    if (datas.length > 50) {
                        let isLoop = this.isLoopDAG(this.testPort.id, this.testPort.index, out.id, out.index)
                        if (!isLoop && this.testPort.type == out.type) {
                            this.statusOutPort.connectAbel.push(out.id + '-' + out.index)
                            if (!Util.isContain(this.statusNode.connectAbel, out.id)) {
                                this.statusNode.connectAbel.push(out.id)
                            }
                        } else {
                            if (Util.isContain(this.statusNode.connectAbel, out.id)) {
                                this.statusNode.connectAbel.splice(this.statusNode.connectAbel.indexOf(out.id), 1)
                            }
                            if (Util.isContain(this.statusOutPort.connectAbel, out.pid)) {
                                this.statusOutPort.connectAbel.splice(
                                    this.statusOutPort.connectAbel.indexOf(out.pid),
                                    1
                                )
                            }
                            if (!Util.isContain(this.statusOutPort.unConnectAbel, out.id + '-' + out.index)) {
                                this.statusOutPort.unConnectAbel.push(out.id + '-' + out.index)
                            }
                        }
                    }
                    if (Util.isContain(this.statusOutPort.connectAbel, out.pid) && out.id !== this.testPort.id) {
                        this.statusNode.connected = [out.id]
                        this.statusOutPort.connected = [out.pid]
                        this.testConnectType = 'bezierCurve'
                        this.testPortStart = [out.x, out.y]
                        //检查当前入口已经有的连接线，并阻止显示。。。。这里需要读取配置，是否只能单连接 todo
                        if (this.main.param.link.isInPortOne) {
                            this.setTestLinkConflict(this.testPort.pid, out.pid)
                        }
                    } else {
                        if (out.id !== this.testPort.id) {
                            this.statusNode.unConnectAbel = [out.id]
                        }
                        this.testConnectType = 'straightLine'
                        this.testPortStart = [posMoveXY.x, posMoveXY.y]
                    }
                } else {
                    //没有连接到输出的范围上
                    this.testConnectType = 'straightLine'
                    this.testPortStart = [posMoveXY.x, posMoveXY.y]
                    //尝试扩展框选视觉范围
                    this.extendView(left, top)
                }
                this.main.triggerEvent(EVENTS['updateCanvasStatus'])
            }
            //输出
            if (this.holdType == 'outPort') {
                this.statusInPort.connected = []
                this.statusNode.connected = []
                this.statusNode.unConnectAbel = []
                this.statusInPort.hide = []
                this.statusOutPort.hide = []
                //使用测试连接
                this.isTestPortConnect = true
                //判断所有的输出范围
                let inParam = null
                let param
                for (let pid in this.inParams) {
                    param = this.inParams[pid]
                    //判断连接的范围节点连接范围+接口范围
                    if (
                        (x <= param.connectExtent.maxX &&
                            x >= param.connectExtent.minX &&
                            y <= param.connectExtent.maxY &&
                            y >= param.connectExtent.minY) ||
                        (x <= param.hoverExtent.maxX &&
                            x >= param.hoverExtent.minX &&
                            y <= param.hoverExtent.maxY &&
                            y >= param.hoverExtent.minY)
                    ) {
                        inParam = param
                        break
                    }
                }
                //连接到输入的范围上
                if (inParam) {
                    //大量的情况下,移动上去才判断是否连接
                    if (datas.length > 50) {
                        let isLoop = this.isLoopDAG(inParam.id, inParam.index, this.testPort.id, this.testPort.index)
                        if (!isLoop && inParam.type == this.testPort.type) {
                            this.statusInPort.connectAbel.push(inParam.id + '-' + inParam.index)
                            if (!Util.isContain(this.statusNode.connectAbel, inParam.id)) {
                                this.statusNode.connectAbel.push(inParam.id)
                            }
                        } else {
                            if (Util.isContain(this.statusNode.connectAbel, inParam.id)) {
                                this.statusNode.connectAbel.splice(this.statusNode.connectAbel.indexOf(inParam.id), 1)
                            }
                            if (Util.isContain(this.statusInPort.connectAbel, inParam.pid)) {
                                this.statusInPort.connectAbel.splice(
                                    this.statusInPort.connectAbel.indexOf(inParam.pid),
                                    1
                                )
                            }
                            if (!Util.isContain(this.statusInPort.unConnectAbel, inParam.id + '-' + inParam.index)) {
                                this.statusInPort.unConnectAbel.push(inParam.id + '-' + inParam.index)
                            }
                        }
                    }
                    if (Util.isContain(this.statusInPort.connectAbel, inParam.pid) && inParam.id !== this.testPort.id) {
                        this.statusNode.connected = [inParam.id]
                        this.statusInPort.connected = [inParam.pid]
                        this.testConnectType = 'bezierCurve'
                        this.testPortEnd = [inParam.x, inParam.y]
                        //检查当前入口已经有的连接线，并阻止显示。。。。这里需要读取配置，是否只能单连接 todo
                        if (this.main.param.link.isInPortOne) {
                            this.setTestLinkConflict(inParam.pid, this.testPort.pid)
                        }
                    } else {
                        if (inParam.id !== this.testPort.id) {
                            this.statusNode.unConnectAbel = [inParam.id]
                        }
                        this.testConnectType = 'straightLine'
                        this.testPortEnd = [posMoveXY.x, posMoveXY.y]
                    }
                } else {
                    //没有连接到输出的范围上
                    this.testConnectType = 'straightLine'
                    this.testPortEnd = [posMoveXY.x, posMoveXY.y]
                    //尝试扩展框选视觉范围
                    this.extendView(left, top)
                }
                this.main.triggerEvent(EVENTS['updateCanvasStatus'])
            }
            //平移后鼠标的结束位置置为鼠标移动到的位置，否则平移会滑动
            this.posDown = posMove
        }
        //鼠标移上判断元素
        let ele = this.findInPort(x, y)
        if (ele) {
            let isUpdateMouseStatus = false
            if (
                this.statusNode.mouseMoveed.length > 0 ||
                this.statusInPort.mouseMoveed.length > 0 ||
                this.statusOutPort.mouseMoveed.length > 0 ||
                this.statusInPort.mouseMoveed[0] !== ele.pid
            ) {
                isUpdateMouseStatus = true
            }
            this.statusNode.mouseMoveed = []
            this.statusInPort.mouseMoveed = [ele.pid]
            this.statusOutPort.mouseMoveed = []
            this.canvas.title = ele.des
            if (isUpdateMouseStatus) {
                this.main.triggerEvent(EVENTS['updateCanvasStatus'])
            }
            return true
        } else {
            ele = this.findOutPort(x, y)
            if (ele) {
                let isUpdateMouseStatus = false
                if (
                    this.statusNode.mouseMoveed.length > 0 ||
                    this.statusInPort.mouseMoveed.length > 0 ||
                    this.statusOutPort.mouseMoveed.length > 0 ||
                    this.statusOutPort.mouseMoveed[0] !== ele.pid
                ) {
                    isUpdateMouseStatus = true
                }
                this.statusNode.mouseMoveed = []
                this.statusInPort.mouseMoveed = []
                this.statusOutPort.mouseMoveed = [ele.pid]
                this.canvas.title = ele.des
                if (isUpdateMouseStatus) {
                    this.main.triggerEvent(EVENTS['updateCanvasStatus'])
                }
                return true
            } else {
                ele = this.findNode(x, y)
                if (ele) {
                    let isUpdateMouseStatus = false
                    if (
                        this.statusNode.mouseMoveed.length > 0 ||
                        this.statusInPort.mouseMoveed.length > 0 ||
                        this.statusOutPort.mouseMoveed.length > 0 ||
                        this.statusNode.mouseMoveed[0] !== ele.id
                    ) {
                        isUpdateMouseStatus = true
                    }
                    this.statusNode.mouseMoveed = [ele.id]
                    this.statusInPort.mouseMoveed = []
                    this.statusOutPort.mouseMoveed = []
                    this.canvas.title = ele.des
                    if (isUpdateMouseStatus) {
                        this.main.triggerEvent(EVENTS['updateCanvasStatus'])
                    }
                    //状态信息提示
                    let title =
                        Util.isContain(ele, 'description') && ele.description && ele.description !== ''
                            ? ele.description
                            : ele.name
                    //判断状态是否在图标上
                    /*
                    let imageSize = this.main.param.node.nodeStyle.image.size
                    let textOffSetX = this.main.param.node.nodeStyle.image.offsetX
                    let textLength = this.main.param.node.nodeStyle.text.textLength
                    let eHeight = this.main.param.node.nodeStyle.eHeight
                    */
                    let imgHeight = this.main.param.node.nodeStyle.statusImg.size
                    let imgWidth = this.main.param.node.nodeStyle.statusImg.size
                    let minx = ele.position.x + 270
                    let miny = ele.position.y + 20 //(eHeight -  imgHeight)/2
                    let maxx = minx + imgWidth
                    let maxy = miny + imgHeight
                    if (x <= maxx && x >= minx && y <= maxy && y >= miny) {
                        this.canvas.title = Util.isContain(ele, 'runStatus') ? ele.runStatus : title
                    } else {
                        this.canvas.title = title
                    }
                    //派发鼠标移上事件，由外围实现气泡
                    this.main.triggerEvent(EVENTS['mousemoveEle'], { ele, left, top })
                    if (typeof ele.messageTip !== 'undefined' && ele.messageTip !== '') {
                        let w = this.main.param.node.nodeStyle.eWidth
                        let h = this.main.param.node.nodeStyle.eHeight
                        let posXY = Util.canvas2LeftRight(
                            ele.position.x,
                            ele.position.y,
                            this.panX,
                            this.panY,
                            this.scaleNum
                        )
                        let posXY2 = Util.canvas2LeftRight(
                            ele.position.x + w,
                            ele.position.y + h,
                            this.panX,
                            this.panY,
                            this.scaleNum
                        )
                        this.main.tip.createTip({
                            ele: ele,
                            minx: posXY.x,
                            miny: posXY.y,
                            maxx: posXY2.x,
                            maxy: posXY2.y
                        })
                    }

                    return true
                }
            }
        }
        //清空全部状态
        let isUpdateMouseStatus = false
        if (
            this.statusNode.mouseMoveed.length > 0 ||
            this.statusInPort.mouseMoveed.length > 0 ||
            this.statusOutPort.mouseMoveed.length > 0
        ) {
            isUpdateMouseStatus = true
        }
        this.statusNode.mouseMoveed = []
        this.statusInPort.mouseMoveed = []
        this.statusOutPort.mouseMoveed = []
        this.canvas.title = ''
        if (isUpdateMouseStatus) {
            this.main.triggerEvent(EVENTS['updateCanvasStatus'])
        }
    }
    /**
     * 鼠标点击
     * event 相对于画布的坐标位置
     */
    mousedown = event => {
        //画布左上角坐标
        this.posDown = event
        this.posDownStart = { x: event.x, y: event.y }
        let left = event.x
        let top = event.y
        //画布坐标
        let posDownXY = Util.leftRight2Canvas(left, top, this.panX, this.panY, this.scaleNum)
        let x = posDownXY.x
        let y = posDownXY.y
        //鼠标在覆盖范围上无作用
        if (!this.isPosNoCover(this.posDown)) {
            return false
        }
        //菜单不显示
        this.main.triggerEvent(EVENTS['hideMenu'])
        this.isHold = true
        //框选发起
        if (this.isBoxSelect) {
            this.canvas.style.cursor = 'crosshair'
            this.holdType = 'boxSelect'
            this.boxSelectStart = [x, y]
            //清除已选中的节点和输入输出以及 已选中的线
            this.statusNode.selected = []
            this.statusInPort.selected = [] //in不一定有
            this.statusOutPort.selected = []
            this.statusLink.selected = []
            // this.main.triggerEvent(EVENTS['updateCanvasStatus'])
            return
        }
        //初始化按压状态 默认画布移动
        this.holdType = 'canvas'
        let status = this.main.runStatus
        let datas = this.main.datas
        let ele = this.findInPort(x, y)
        if (ele && status.isEditTopology) {
            this.holdType = 'inPort'
            this.testPort = ele
            //设置节点的可连接状态 和 可连接输出接口
            this.setConnectAbelStatusOut(ele)
            this.testPortEnd = [ele.x, ele.y]
        } else {
            let ele = this.findOutPort(x, y)
            if (ele && status.isEditTopology) {
                this.holdType = 'outPort'
                this.testPort = ele
                //设置节点的可连接状态 和 可连接输入接口
                this.setConnectAbelStatusIn(ele)
                this.testPortStart = [ele.x, ele.y]
            } else {
                let ele = this.findNode(x, y)
                if (ele) {
                    //if(status.isEditTopology){}
                    this.holdType = 'node'
                    //已经有被选中的节点 多个 且此点已经被选中的情况下
                    if (this.statusNode.selected.length >= 2 && Util.isContain(this.statusNode.selected, ele.id)) {
                        this.changeNodes = []
                        for (let i = 0; i < datas.length; i++) {
                            let data = datas[i]
                            for (let j = 0; j < this.statusNode.selected.length; j++) {
                                if (data.id + '' == this.statusNode.selected[j] + '') {
                                    this.changeNodes.push(data)
                                }
                            }
                        }
                    } else {
                        //单个节点被选中
                        if (!this.isMultSelect) {
                            this.statusLink.selected = []
                            this.statusOutPort.selected = []
                            this.statusInPort.selected = [] //可能不存在的selected
                            this.statusNode.selected = [ele.id]
                            this.sortDatasToEnd(ele.id)
                            this.changeNodes = [ele]
                            //单个被选中要设置被选中的输出接口,在这里已经进行了一次class不存在的过滤
                            let dataClass = this.node.getClass(ele)
                            let outcount = dataClass.output.length
                            for (let m = 0; m < outcount; m++) {
                                this.statusOutPort.selected.push(ele.id + '-' + m)
                            }
                            //设定什么状态可以点击,其实也可以不做配置，只要判断可以编辑画布即可
                            if (
                                typeof this.main.param.node.imageClick !== 'undefined' &&
                                Util.isContain(this.main.param.node.imageClick.runStatus, status.name)
                            ) {
                                let imageConfig = this.main.param.node.nodeStyle.image
                                let imgHeight = imageConfig.size
                                let imgWidth = imageConfig.size
                                let minx = ele.position.x + imageConfig.offsetX
                                let miny = ele.position.y + imageConfig.offsetY
                                let maxx = minx + imgWidth
                                let maxy = miny + imgHeight
                                if (x <= maxx && x >= minx && y <= maxy && y >= miny) {
                                    this.main.triggerEvent(EVENTS['imageClick'], ele)
                                }
                            }
                        } else {
                            //多选
                            //已经选中了
                            let isHaveSelected = false
                            for (let j = 0; j < this.statusNode.selected.length; j++) {
                                if (ele.id + '' == this.statusNode.selected[j] + '') {
                                    isHaveSelected = true
                                }
                            }
                            this.sortDatasToEnd(ele.id)
                            if (!isHaveSelected) {
                                this.changeNodes.push(ele)
                                //单个被选中要设置被选中的输出接口,在这里已经进行了一次class不存在的过滤
                                let dataClass = this.node.getClass(ele)
                                let outcount = dataClass.output.length
                                for (let m = 0; m < outcount; m++) {
                                    this.statusOutPort.selected.push(ele.id + '-' + m)
                                }
                                this.statusNode.selected.push(ele.id)
                                //this.setSelectElement([ele.id])  先传一个当前的，但是不保存，后面再传一个多选真实的
                                this.main.triggerEvent(EVENTS['selectElement'], [ele.id])
                            }
                        }
                    }
                    //更新被选中的节点
                    this.setSelectElement(this.statusNode.selected)
                } else {
                    //单个节点被选中

                    let oneLink = this.findLink(x, y)
                    if (oneLink) {
                        if (!this.isMultSelect) {
                            this.isClickLink = true
                            this.statusLink.selected = [oneLink]
                            this.statusOutPort.selected = []
                            this.statusInPort.selected = []
                            this.statusNode.selected = []
                            this.changeNodes = []
                            //更新被选中的节点
                            this.setSelectElement([])
                        } else {
                            this.isClickLink = true
                            let isHaveSelected = false
                            let start, end
                            //获取开始和结束字符串
                            for (let startPort in oneLink) {
                                start = startPort
                                end = oneLink[start]
                            }
                            for (let j = 0; j < this.statusLink.selected.length; j++) {
                                let oneL = this.statusLink.selected[j]
                                let oneS, oneE
                                for (let startPort in oneL) {
                                    oneS = startPort
                                    oneE = oneL[startPort]
                                    if (oneS == start && end == oneE) {
                                        isHaveSelected = true
                                    }
                                }
                            }
                            this.isClickLink = true
                            if (!isHaveSelected) {
                                this.statusLink.selected.push(oneLink)
                            }
                        }
                    }
                }
            }
        }
        this.main.triggerEvent(EVENTS['updateCanvasStatus'])
    }
    /**
     * 鼠标点击
     * event 相对于画布的坐标位置
     */
    dblclick = event => {
        //画布左上角坐标
        this.posDown = event
        this.posDownStart = { x: event.x, y: event.y }
        let left = event.x
        let top = event.y
        //画布坐标
        let posDownXY = Util.leftRight2Canvas(left, top, this.panX, this.panY, this.scaleNum)
        let x = posDownXY.x
        let y = posDownXY.y
        //鼠标在覆盖范围上无作用
        if (!this.isPosNoCover(this.posDown)) {
            return false
        }
        //菜单不显示
        this.main.triggerEvent(EVENTS['hideMenu'])
        this.isHold = true

        //初始化按压状态 默认画布移动
        this.holdType = 'canvas'
        let ele = this.findNode(x, y)
        //取消其它选中的内容
        if (ele) {
            this.holdType = 'node'
            //单个节点被选中
            this.statusLink.selected = []
            this.statusOutPort.selected = []
            this.statusInPort.selected = [] //可能不存在的selected
            this.statusNode.selected = [ele.id]
            this.sortDatasToEnd(ele.id)
            this.changeNodes = [ele]
            //单个被选中要设置被选中的输出接口,在这里已经进行了一次class不存在的过滤
            let dataClass = this.node.getClass(ele)
            let outcount = dataClass.output.length
            for (let m = 0; m < outcount; m++) {
                this.statusOutPort.selected.push(ele.id + '-' + m)
            }
            //派发出去
            this.main.triggerEvent(EVENTS['dblClickNode'], ele)
            // console.log('dblClickNode')
            //更新被选中的节点
            this.setSelectElement(this.statusNode.selected)
        }
        this.main.triggerEvent(EVENTS['updateCanvasStatus'])
    }
    /**
     * 鼠标抬起
     * event 相对于画布的坐标位置
     */
    mouseup = event => {
        let status = this.main.runStatus
        this.isHold = false
        //鼠标在覆盖范围上无作用
        if (!this.isPosNoCover(event)) {
            return false
        }
        //新增
        if (
            this.isAddNode &&
            typeof this.addParam.length == 'undefined' &&
            !this.isAdding &&
            !Util.isContain(this.addParam, 'length')
        ) {
            let dataClass = this.node.getClass(this.addParam)
            let x = this.addPos.x
            let y = this.addPos.y
            let name = this.addParam.name
            if (typeof name == 'undefined' || name == '') {
                name = dataClass.name
            }
            let id = this.addParam.id
            if (typeof id == 'undefined' || !id) {
                id = Util.getUuid() //todo训练平台不能用,要变成整形的
            }
            let data = {
                id,
                name,
                compId: this.addParam.compId,
                classname: dataClass.name,
                status: 'preparing',
                complete: false,
                position: {
                    x,
                    y
                },
                url: dataClass.url,
                execute_status: 'preparing',
                param: [],
                parents: [],
                children: []
            }
            let datas = this.main.datas
            //如果画布没有任何元素，则不会画布居中，首个居中很别扭
            if (datas.length == 0) {
                this.isResize = false
            }
            datas.push(data)
            this.isAddNode = false
            this.isAdding = false
            this.addPos = null
            this.statusLink.selected = []
            this.statusOutPort.selected = []
            this.statusNode.selected = [data.id]
            this.sortDatasToEnd(data.id)
            this.changeNodes = [data]
            let outcount = dataClass.output.length
            for (let m = 0; m < outcount; m++) {
                this.statusOutPort.selected.push(data.id + '-' + m)
            }
            this.main.triggerEvent(EVENTS['updateCanvasStatus'])
            this.main.triggerEvent(EVENTS['topologyChange'], { components: datas })
            this.setSelectElement(this.statusNode.selected)
        }
        //新增视图
        if (
            this.isAddNode &&
            typeof this.addParam.length !== 'undefined' &&
            !this.isAdding &&
            !Util.isContain(this.addParam, 'length')
        ) {
            let datas = this.main.datas
            this.isAddNode = false
            this.isAdding = false
            this.addPos = null
            this.statusOutPort.selected = []
            /*
            this.statusNode.selected = [data.id]
            this.sortDatasToEnd(data.id)
            this.changeNodes = [data]
            let outcount = dataClass.output.length
            for(let m=0;m<outcount;m++){
                this.statusOutPort.selected.push(data.id+'-'+m)
            }
            */
            this.main.triggerEvent(EVENTS['updateCanvasStatus'])
            this.main.triggerEvent(EVENTS['topologyChange'], { components: datas })
            this.setSelectElement(this.statusNode.selected)
        }
        //框选
        if (this.isBoxSelect && this.boxSelectEnd.length > 0 && this.boxSelectStart.length > 0) {
            this.isBoxSelect = false
            //获得框选范围
            let startX = this.boxSelectStart[0] <= this.boxSelectEnd[0] ? this.boxSelectStart[0] : this.boxSelectEnd[0]
            let startY = this.boxSelectStart[1] <= this.boxSelectEnd[1] ? this.boxSelectStart[1] : this.boxSelectEnd[1]
            let endX = this.boxSelectEnd[0] >= this.boxSelectStart[0] ? this.boxSelectEnd[0] : this.boxSelectStart[0]
            let endY = this.boxSelectEnd[1] >= this.boxSelectStart[1] ? this.boxSelectEnd[1] : this.boxSelectStart[1]
            //设置被选中的圆角矩形和连接线
            let datas = this.main.datas
            let w = this.main.param.node.nodeStyle.eWidth
            let h = this.main.param.node.nodeStyle.eHeight
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i]
                let x = data.position.x
                let y = data.position.y
                let x1 = x + w
                let y1 = y + h
                //设置被选中的输出接口
                let dataClass = this.node.getClass(data)
                if (!dataClass) {
                    continue
                }
                if (x >= startX && y >= startY && x1 <= endX && y1 <= endY) {
                    this.statusNode.selected.push(data.id)
                    let outcount = dataClass.output.length
                    for (let m = 0; m < outcount; m++) {
                        this.statusOutPort.selected.push(data.id + '-' + m)
                    }
                }
            }
            if (this.statusNode.selected.length > 0) {
                for (let i = 0; i < this.statusNode.selected.length; i++) {
                    this.sortDatasToEnd(this.statusNode.selected[i])
                }
            }
            for (let i = 0; i < this.links.length; i++) {
                let oneLink = this.links[i]
                for (let startPort in oneLink) {
                    let start = this.starts[startPort]
                    if (typeof start !== 'undefined') {
                        let end = this.ends[oneLink[startPort]]
                        if (
                            typeof end !== 'undefined' &&
                            start.x >= startX &&
                            start.y >= startY &&
                            start.x <= endX &&
                            start.y <= endY &&
                            end.x >= startX &&
                            end.y >= startY &&
                            end.x <= endX &&
                            end.y <= endY
                        ) {
                            this.statusLink.selected.push(oneLink)
                        }
                    }
                }
            }
            //清除框选绘制
            this.boxSelectStart = []
            this.boxSelectEnd = []
            this.setSelectElement(this.statusNode.selected)
        }
        //确认连接
        if (this.statusNode.connected.length > 0) {
            let inNodeId, inIndex, outNodeId, outIndex
            //需要删除的
            let delInNodeId, delInIndex, delOutNodeId, delOutIndex
            if (this.holdType == 'inPort') {
                inNodeId = this.testPort.id
                inIndex = this.testPort.index
                outNodeId = this.statusNode.connected[0]
                outIndex = this.statusOutPort.connected[0].split('-')[1]
            } else if (this.holdType == 'outPort') {
                outNodeId = this.testPort.id
                outIndex = this.testPort.index
                inNodeId = this.statusNode.connected[0]
                inIndex = this.statusInPort.connected[0].split('-')[1]
            }
            //判断入库已有的连接线，并修改连接线，说明 这里读配置,已经读取了hide为0，是否入口可以连接多线
            if (this.statusInPort.hide.length > 0) {
                delInNodeId = inNodeId
                delInIndex = inIndex
                delOutNodeId = this.statusOutPort.hide[0].split('-')[0]
                delOutIndex = this.statusOutPort.hide[0].split('-')[1]
            }
            let datas = this.main.datas
            //清除之前的连接线 和 新增连接线
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i]
                if (this.statusInPort.hide.length > 0) {
                    if (data.id + '' == delInNodeId + '') {
                        for (let j = 0; j < data.parents.length; j++) {
                            let parent = data.parents[j]
                            for (let inIndex in parent) {
                                if (inIndex + '' == delInIndex + '') {
                                    data.parents.splice(j, 1)
                                }
                            }
                        }
                    }
                }
                if (this.statusOutPort.hide.length > 0) {
                    if (data.id + '' == delOutNodeId + '') {
                        for (let j = 0; j < data.children.length; j++) {
                            let children = data.children[j]
                            for (let outIndex in children) {
                                if (outIndex + '' == delOutIndex + '') {
                                    if (data.children[j][outIndex] == delInNodeId + '-' + delInIndex) {
                                        data.children.splice(j, 1)
                                    }
                                }
                            }
                        }
                    }
                }
                if (data.id + '' == inNodeId + '') {
                    let key = inIndex
                    let parent = {}
                    parent[key] = outNodeId + '-' + outIndex
                    //防止多次连线
                    let isContain = false
                    for (let m = 0; m < data.parents.length; m++) {
                        let p = data.parents[m]
                        if (typeof p[key] !== 'undefined' && p[key] == outNodeId + '-' + outIndex) {
                            isContain = true
                            break
                        }
                    }
                    if (!isContain) {
                        data.parents.push(parent)
                    }
                }
                if (data.id + '' == outNodeId + '') {
                    let key = outIndex
                    let children = {}
                    children[key] = inNodeId + '-' + inIndex
                    //防止多次连线
                    let isContain = false
                    for (let m = 0; m < data.children.length; m++) {
                        let p = data.children[m]
                        if (typeof p[key] !== 'undefined' && p[key] == inNodeId + '-' + inIndex) {
                            isContain = true
                            break
                        }
                    }
                    if (!isContain) {
                        data.children.push(children)
                    }
                }
            }
            this.main.triggerEvent(EVENTS['topologyChange'], { components: this.main.datas })
        }
        //空白处点击
        if (this.holdType == 'canvas') {
            if (Util.isContain(this.posDownStart, 'x')) {
                let posDownEnd = { x: event.x, y: event.y }
                //todo 菜单的隐藏跟这个有关？？？
                if (!this.isClickLink && this.posDownStart.x == posDownEnd.x && this.posDownStart.y == posDownEnd.y) {
                    this.statusInPort.selected = []
                    this.statusOutPort.selected = []
                    this.statusLink.selected = []
                    //更新被选中的节点
                    this.setSelectElement([])
                } else {
                    if (this.isClickLink) {
                        this.isClickLink = false
                    }
                    this.updatePanScale()
                }
            }
        } else if (this.holdType == 'node') {
            let posDownEnd = { x: event.x, y: event.y }
            if (
                (this.posDownStart.x !== posDownEnd.x || this.posDownStart.y !== posDownEnd.y) &&
                status.isEditPosition
            ) {
                this.main.triggerEvent(EVENTS['positionChange'], { components: this.main.datas })
            }
        }
        //还原状态，清除测试连接线状态
        this.holdType = 'canvas'
        this.isTestPortConnect = false
        this.testPortStart = []
        this.testPortEnd = []
        this.testConnectType = null
        this.testPort = null
        this.statusNode.connectAbel = []
        this.statusNode.unConnectAbel = []
        this.statusNode.connected = []
        this.statusInPort.connectAbel = []
        this.statusInPort.unConnectAbel = []
        this.statusInPort.connected = []
        this.statusInPort.hide = []
        this.statusOutPort.connectAbel = []
        this.statusOutPort.unConnectAbel = []
        this.statusOutPort.connected = []
        this.statusOutPort.hide = []
        this.canvas.style.cursor = 'move'
        this.main.triggerEvent(EVENTS['updateCanvasStatus'])
    }
    /**
     * 停止运行
     */
    stopExecute = () => {
        this.main.triggerEvent(EVENTS['stopExecute'])
    }
    runCanvas = () => {
        if (!this.run2Time) {
            this.main.triggerEvent(EVENTS['runCanvas'], { type: 'EXECUTE_WHOLE_DAG' })
            this.run2Time = true
            setTimeout(() => {
                this.run2Time = false
            }, 2000)
        } else {
            this.main.triggerEvent(EVENTS['messageTip'], '运行处理中！')
        }
    }
    runComponent = data => {
        if (!this.run2Time) {
            if (!Util.isContain(data, 'id')) {
                data.id = this.currentMenuId
            }
            this.main.triggerEvent(EVENTS['runComponent'], data, this.statusNode.selected)
            this.run2Time = true
            setTimeout(() => {
                this.run2Time = false
            }, 2000)
        } else {
            this.main.triggerEvent(EVENTS['messageTip'], '运行处理中！')
        }
    }
    contextEvent = data => {
        if (!Util.isContain(data, 'id')) {
            data.id = this.currentMenuId
        }
        this.main.triggerEvent(EVENTS['contextEvent'], data)
    }
    /**
     *  自动生成没有坐标的元素坐标
     */
    initCreateDAGPosition = data => {
        let x = 0
        let y = 0
        //获得父元素数组 获得子元素的数组
        let parents = []
        let children = []
        let datas = this.main.datas
        let eWidth = this.main.param.node.nodeStyle.eWidth
        let eHeight = this.main.param.node.nodeStyle.eHeight
        for (let m = data.parents.length - 1; m >= 0; m--) {
            let c = data.parents[m]
            for (let cIndex in c) {
                let parentsId = c[cIndex].split('-')[0]
                //去重
                if (!Util.isContain(parents, parentsId)) {
                    parents.push(parentsId)
                }
            }
        }
        for (let m = data.children.length - 1; m >= 0; m--) {
            let c = data.children[m]
            for (let cIndex in c) {
                let childrenId = c[cIndex].split('-')[0]
                //去重
                if (!Util.isContain(children, childrenId)) {
                    children.push(childrenId)
                }
            }
        }
        let pxys = []
        let cxys = []
        //获得父子坐标，没有坐标的要移除
        for (let j = 0; j < datas.length; j++) {
            let data = datas[j]
            for (let i = 0; i < parents.length; i++) {
                if (data.id == parents[i] && data.position.x && data.position.y) {
                    pxys.push([data.position.x, data.position.y])
                }
            }
            for (let i = 0; i < children.length; i++) {
                if (data.id == children[i] && data.position.x && data.position.y) {
                    cxys.push([data.position.x, data.position.y])
                }
            }
        }
        //无父无子，则第一个为 画布的中心坐标
        if (pxys.length == 0 && cxys.length == 0) {
            //获得最小矩形
            let minX, minY, maxX, maxY
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i]
                let x = data.position.x
                let y = data.position.y
                //没有坐标的异常过滤
                if (x == null || y == null) {
                    continue
                }
                if (i == 0) {
                    minX = x
                    maxX = x
                    minY = y
                    maxY = y
                } else {
                    if (x < minX) {
                        minX = x
                    }
                    if (x > maxX) {
                        maxX = x
                    }
                    if (y < minY) {
                        minY = y
                    }
                    if (y > maxY) {
                        maxY = y
                    }
                }
            }
            //获得中心的坐标
            if (
                typeof minX == 'undefined' ||
                typeof minY == 'undefined' ||
                typeof maxX == 'undefined' ||
                typeof maxY == 'undefined'
            ) {
                x = 0
                y = 0
            } else {
                x = minX + (maxX - minX) / 2 - eWidth / 2
                y = minY + (maxY - minY) / 2
            }
        }
        //如果没有子元素，则在父元素的下面y值确定,x值是父元素的中心值
        if (pxys.length !== 0 && cxys.length == 0) {
            // x 为 父元素们X值的中心值// -1/2长度
            if (pxys.length == 1) {
                x = pxys[0][0]
            } else {
                //获取最小和最大X值
                let minx = pxys[0][0],
                    maxx = pxys[0][0]
                for (let i = 1; i < pxys.length; i++) {
                    if (minx > pxys[i][0]) {
                        minx = pxys[i][0]
                    }
                    if (maxx < pxys[i][0]) {
                        maxx = pxys[i][0]
                    }
                }
                x = minx + ((maxx - minx) / 2 - eWidth / 2)
            }
            //y为父元素们最大y的下面
            y = pxys[0][1]
            for (let i = 1; i < pxys.length; i++) {
                if (y < pxys[i][1]) {
                    y = pxys[i][1]
                }
            }
            y += 3 * eHeight
        }
        //如果没有父元素，则在子元素的下面y值确定
        if (pxys.length == 0 && cxys.length !== 0) {
            //x 为 子元素们x值的中心值//-1/2长度
            if (cxys.length == 1) {
                x = cxys[0][0]
            } else {
                //获取最小和最大x值
                let minx = cxys[0][0],
                    maxx = cxys[0][0]
                for (let i = 1; i < cxys.length; i++) {
                    if (minx > cxys[i][0]) {
                        minx = cxys[i][0]
                    }
                    if (maxx < cxys[i][0]) {
                        maxx = cxys[i][0]
                    }
                }
                x = minx + ((maxx - minx) / 2 - eWidth / 2)
            }
            //y 为子元素们最小y的上面
            y = cxys[0][1]
            for (let i = 1; i < cxys.length; i++) {
                if (y < cxys[i][1]) {
                    y = cxys[i][1]
                }
            }
            y -= 3 * eHeight
        }
        //有父有子，则在第一个子和第一个父之间的y ， 和对应的x值中心值 - eWidth/2
        if (pxys.length !== 0 && cxys.length !== 0) {
            // x 为 父子元素们x值的中心值// -1/2 长度
            //获取最小和最大值
            let minx = cxys[0][0],
                maxx = cxys[0][0]
            for (let i = 1; i < cxys.length; i++) {
                if (minx > cxys[i][0]) {
                    minx = cxys[i][0]
                }
                if (maxx < cxys[i][0]) {
                    maxx = cxys[i][0]
                }
            }
            for (let i = 1; i < pxys.length; i++) {
                if (minx > pxys[i][0]) {
                    minx = pxys[i][0]
                }
                if (maxx < pxys[i][0]) {
                    maxx = pxys[i][0]
                }
            }
            x = minx + ((maxx - minx) / 2 - eWidth / 2)
            // y 第一个子和第一个父之间的y
            y =
                cxys[0][1] > pxys[0][1]
                    ? pxys[0][1] + (cxys[0][1] - pxys[0][1]) / 2
                    : cxys[0][1] + (pxys[0][1] - cxys[0][1]) / 2
        }
        //最后得到的 xy值判断一次是否在其他元素上，在的话则在其元素的左侧或右侧添加
        return this.findNodeAndPanX(x, y, eWidth, eHeight)
    }
    /**
     * 查找并进行偏移
     */
    findNodeAndPanX = (x, y, eWidth, eHeight) => {
        let ele = this.findNode(x, y)
        if (!ele) {
            ele = this.findNode(x + eWidth, y)
        }
        if (!ele) {
            ele = this.findNode(x, y + eHeight)
        }
        if (!ele) {
            ele = this.findNode(x, y - eHeight)
        }
        if (!ele) {
            ele = this.findNode(x - eWidth, y)
        }
        if (ele) {
            return { x: x - eWidth - eWidth / 4, y }
        } else {
            return { x, y }
        }
    }
    /**
     * 添加时点击
     */
    mouseDownAdd = (event, obj) => {
        this.isHold = true
        this.holdType = 'add'
        this.isAddNode = false
        this.addStartMsg = { x: event.clientX, y: event.clientY }
        this.addParam = obj
    }
    /**
     * 添加一组
     */
    mouseDownAdds = (event, objs) => {
        this.isHold = true
        this.holdType = 'adds'
        this.isAddNode = false
        this.addStartMsg = { x: event.clientX, y: event.clientY }
        this.addParam = objs
    }
    /**
     * 执行copy
     */
    dagCopyEvent = () => {
        if (this.statusNode.selected.length > 0) {
            this.main.triggerEvent(EVENTS['dagCopy'], this.statusNode.selected)
            this.main.triggerEvent(EVENTS['messageSuccess'], this.statusNode.selected.length + '个组件可跨画布粘贴')
        }
    }
    /**
     * 接收到粘贴信息
     * 数组进行坐标处理，添加，然后全部选中，平移操作
     */
    dagPasteEvent = () => {
        this.main.triggerEvent(EVENTS['dagPaste'])
    }
    /**
     * 根据当前鼠标的位置设置对应数组的经纬度
     */
    getViewPosition = (arr, position) => {
        //取消其他的选中
        this.setSelectElement([])
        //鼠标的坐标对应左上角的坐标。还是中心的坐标

        //获得最小矩形
        let w = this.main.param.node.nodeStyle.eWidth
        let h = this.main.param.node.nodeStyle.eHeight
        let { minX, minY, maxX, maxY } = Util.getExtent(arr, w, h)
        //设置中心点为原点，而此时的中心原点为 position
        let centerX = (maxX - minX) / 2 + minX
        let centerY = (maxY - minY) / 2 + minY
        //根据相对位置改变坐标
        for (let i = 0; i < arr.length; i++) {
            let obj = arr[i]
            //获得坐标差，然后和鼠标右键的坐标向加
            let offsetX = centerX - obj.position.x
            let offsetY = centerY - obj.position.y
            obj.position.x = position.x - offsetX
            obj.position.y = position.y - offsetY
        }

        return arr
    }
    /**
     * 根据当前鼠标的位置设置对应数组的经纬度
     */
    getPastePosition = arr => {
        //取消其他的选中
        this.statusInPort.selected = []
        this.statusOutPort.selected = []
        this.statusLink.selected = []
        this.setSelectElement([])
        let position
        if (this.main.menu.isShowIng) {
            position = this.main.menu.position
        } else {
            position = {
                x: this.mouseX,
                y: this.mouseY
            }
        }

        //鼠标的坐标对应左上角的坐标。还是中心的坐标

        //获得最小矩形
        let w = this.main.param.node.nodeStyle.eWidth
        let h = this.main.param.node.nodeStyle.eHeight
        let { minX, minY, maxX, maxY } = Util.getExtent(arr, w, h)
        //设置中心点为原点，而此时的中心原点为 position
        let centerX = (maxX - minX) / 2 + minX
        let centerY = (maxY - minY) / 2 + minY
        let selectArr = []
        //根据相对位置改变坐标
        for (let i = 0; i < arr.length; i++) {
            let obj = arr[i]
            //获得坐标差，然后和鼠标右键的坐标向加
            let offsetX = centerX - obj.position.x
            let offsetY = centerY - obj.position.y
            obj.position.x = position.x - offsetX
            obj.position.y = position.y - offsetY
            selectArr.push(obj.id)
        }
        //触发事件，收到后关闭变量，然后设置选中
        this.main.triggerEvent(EVENTS['selectElementAfter'], selectArr)
        return arr
    }
    /**
     * 用于回调选中事件
     */
    selectElementCallback = arr => {
        this.setSelectElement(arr)
        //数据进行重新配置,不然没有对应的连接线
        this.initData()
        this.statusLink.selected = []
        for (let i = 0; i < this.links.length; i++) {
            let oneLink = this.links[i]
            for (let startPort in oneLink) {
                let startId = startPort.split('-')[0]
                let endId = oneLink[startPort].split('-')[0]
                if (Util.isContain(arr, startId) || Util.isContain(arr, endId)) {
                    this.statusLink.selected.push(oneLink)
                }
            }
        }
    }
    /**
     * 统一的设置来追踪选中的问题
     */
    setSelectElement = arr => {
        this.statusNode.selected = arr
        this.main.triggerEvent(EVENTS['selectElement'], this.statusNode.selected)
    }
    /**
     * 设置节点默认的强制状态
     * arr 节点的id数组
     * status 状态类型
     */
    setNodeStatus = (arr, status) => {
        this.isSetNodeStatus = true
        this.setNodeStatusArr = arr
        this.setNodeStatusStr = status
    }
    /**
     * 执行设置节点状态
     */
    setNodeStatusFun = () => {}
    /**
     * 用户自定义事件
     * 传递当前右键菜单的组件和被选中的组件数组
     */
    userDefined = eventStr => {
        this.main.triggerEvent(eventStr + 'CallBack', this.currentMenuId, this.statusNode.selected)
    }
    /**
     * 扩展视野，目前有连线的时候进行扩展，框选的时候进行扩展
     */
    isExtendView = false
    extendView = (left, top) => {
        if (this.isExtendView) {
            return
        }
        //距离多远后，实行视觉扩展
        let distance = 20
        let extendDis = 0.3
        let w = this.canvas.width
        let h = this.canvas.height
        let isExtend = false
        //视野左移
        if (left < distance) {
            this.panX = this.panX + extendDis * w * this.scaleNum
            isExtend = true
        }
        //视野右移
        if (w - left < distance) {
            this.panX = this.panX - extendDis * w * this.scaleNum
            isExtend = true
        }
        //视野上移
        if (top < distance) {
            this.panY = this.panY + extendDis * h * this.scaleNum
            isExtend = true
        }
        //视野下移
        if (h - top < distance) {
            this.panY = this.panY - extendDis * h * this.scaleNum
            isExtend = true
        }
        if (isExtend) {
            this.isScale = true
            this.updatePanScale()
            this.isExtendView = true
            setTimeout(() => {
                this.isExtendView = false
            }, 500)
        }
    }
    searchSelect = () => {
        //没有创建的话，创建文本框
        this.initSearchText()
        //执行显示，且聚焦
    }
    initSearchText = () => {
        //创建文本框及容器
        //定义事件，文本框停止多少秒就进行搜索
        //加个x可以关闭（设定如果失去焦点的话就隐藏，简单一点儿吧，或找个替代也行）

        // const args = {
        //     title: '搜索组件',
        //     content: '',
        //     autoFocusButton: null,
        //     //closable:true,
        //     okText: '关闭',
        //     footer: null,
        //     style: { top: 140, left: 410 },
        //     width: 300
        // }
        //popover.open(args)

        //自己创建
        this.contentDom = document.getElementsByClassName('ant-modal-confirm-content')[0]
        this.overcontract = document.createElement('div')
        this.overcontract.style.width = '250px'
        this.overcontract.style.height = '25px'
        this.searchInput = document.createElement('input')
        this.searchInput.style.width = '170px'
        this.searchInput.style.height = '24px'
        this.contentDom.innerHTML = ''
        this.overcontract.appendChild(this.searchInput)
        this.contentDom.appendChild(this.overcontract)
        this.searchInput.addEventListener('input', () => {
            this.searchSelectExe()
        })
    }
    searchSelectExe = () => {
        //查找名字中含有搜索的内容数组,没有的话进行提示
        //选中
        //居中
        let input = this.searchInput.value
        let selectArr = []
        let selectIdArr = []
        let datas = this.main.datas
        if (!input == '') {
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i]
                if (data.name.toLowerCase().indexOf(input.toLowerCase()) > -1) {
                    selectArr.push(data)
                    selectIdArr.push(data.id)
                }
            }
        }
        if (selectArr.length == 0) {
            this.setSelectElement([])
            this.resize()
        } else {
            //选中
            this.setSelectElement(selectIdArr)
            let dataso = selectArr
            let eWidth = this.main.param.node.nodeStyle.eWidth
            let eHeight = this.main.param.node.nodeStyle.eHeight
            let canvasWidth = this.canvas.width
            let canvasHeight = this.canvas.height
            //获得最小矩形
            let { minX, minY, maxX, maxY } = Util.getExtent(dataso, eWidth, eHeight)
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
            //设置最大最小
            let minExtent = this.main.param.canvas.scaleExtentAuto[0]
            let maxExtent = this.main.param.canvas.scaleExtentAuto[1]
            if (num > maxExtent) {
                num = maxExtent
            } else if (num < minExtent) {
                num = minExtent
            }
            //解决只有单个时，导致的放大过量的问题
            if (dataso.length == 1) {
                num = 1
            }
            this.panX = canvasWidth / 2 - centerX * num
            this.panY = canvasHeight / 2 - centerY * num
            this.scaleNum = num
            if (isNaN(this.scaleNum)) {
                this.scaleNum = 1
                this.panX = 0
                this.panY = 0
            }
            this.isResize = false //通过方法改变变量
            this.isInitScale = true //启用初始化缩放
            this.updatePanScale()
        }
    }
    /**
     * 鹰眼的拖拽动作，导致的画布拖拽动作
     */
    panType = (translateX, translateY, scaleNum) => {
        this.translateX = (translateX * scaleNum) / this.scaleNum
        this.translateY = (translateY * scaleNum) / this.scaleNum
        this.panX = this.panX - this.translateX
        this.panY = this.panY - this.translateY
        this.isScale = true
        this.updatePanScale()
    }
    /**
     * 显示提示
     */
    nodeEmpty = (isEmpty = true) => {
        // empty:{
        //     //默认空的时候不显示提示
        //     isShowTip:false,
        //     img:'/img/nodata/default_no_data_d.svg',
        //     tipmsg:[]
        // }
        if (typeof this.main.param.node.empty == 'undefined') {
            return
        }
        let config = this.main.param.node.empty
        if (!config.isShowTip) {
            return
        }
        //进入逻辑
        //创建显示内容
        if (typeof this.emptyDiv == 'undefined') {
            this.emptyDiv = document.createElement('div')
            this.emptyDiv.setAttribute(
                'style',
                'width:100%;height:100%;background-color:' +
                    this.main.param.canvas.background +
                    ';position: absolute;left: 0px;top: 0px;text-align: center;display: flex;align-items: center;justify-content: center;'
            )
            let centerTip = document.createElement('div')
            centerTip.setAttribute('style', 'width: 210px;height: 120px;position: relative;')
            let topImg = document.createElement('div')
            topImg.setAttribute(
                'style',
                "position: absolute;left: 50%;top: 0px;transform: translateX(-50%);width: 56px;height: 56px;background-repeat: no-repeat;;background-image: url('" +
                    config.img +
                    "');"
            )
            let bottomTip = document.createElement('div')
            bottomTip.setAttribute('style', 'width: 210px;height: 40px;position: absolute;bottom: 0px;left: 0px;')
            for (let i = 0; i < config.tipmsg.length; i++) {
                let minText = document.createElement('div')
                minText.setAttribute(
                    'style',
                    'font-family: PingFangSC-Regular;font-size: 14px;color: rgba(255, 255, 255, 0.2);letter-spacing: 0;text-align: center;line-height: 20px;'
                )
                minText.innerHTML = config.tipmsg[i]
                bottomTip.appendChild(minText)
            }
            centerTip.appendChild(topImg)
            centerTip.appendChild(bottomTip)
            this.emptyDiv.appendChild(centerTip)
            this.main.param.dom.appendChild(this.emptyDiv)
            this.emptyDiv.style.display = 'none'
        }
        if (!isEmpty) {
            //判断隐藏
            this.emptyDiv.style.display = 'none'
        } else {
            this.emptyDiv.style.display = 'flex'
        }
    }
}

export default Chart
