//import Node from './component/node'
import Util from './util'
//import EventEmitter from 'eventemitter3'
import paramMode from './config'
import Chart from './chart'
import Covers from './chart/Covers'
import global from './variabel'
import { EventEmitter } from 'events'
import EventManage from './event'
import EVENTS from './event/eventdeclara'
import Toolbar from './toolbar'
import Menu from './menu'
import EagleEye from './eagleEye'
import Tip from './tooltip'
/**
 * 主类
 * 公共的事件对象
 * 公共的中间变量参数
 * 公共的数据处理
 * 公共的唯一ID，由工具自己提供
 */
class FlowChart {
    /**
     *
     */
    constructor(param) {
        //console.log('FlowChart')
        //console.log(JSON.stringify(paramMode));
        //console.log(JSON.stringify(param));
        //step.初始化参数 针对简化参数添加参数 //深度拷贝然后深度覆盖
        this.param = Util.deepCover(paramMode, param)
        //console.log(JSON.stringify(this.param));

        //step.事件监听初始化
        this.emitter = new EventEmitter()
        //step.全局变量初始化   一个是变量 另一个就是参数传递
        this.global = global
        //step.初始化状态
        this.initRunStatus()

        this.datas = []
        //step.初始化画布 及事件
        this.chart = new Chart(this)
        //step.初始化按钮 及事件
        this.toolbar = new Toolbar(this)
        //step.初始化右键 及事件  推后
        this.menu = new Menu(this)
        //初始化提示
        this.tip = new Tip(this)
        //step.初始化鹰眼
        //监听covers的新增和删除
        this.initCovers(this)
        if (this.param.eagleEye.isCreate) {
            this.eye = new EagleEye(this)
        }
        this.eventManage = new EventManage(this)
        //没有初始化过画布
        this.isInitCanvas = false
        //是否可能改变过画布数据
        this.isChangeDatas = false

        //更新后才执行选中事件
        this.selectAfter = false
        this.selectArr = null
        this.bind(EVENTS['selectElementAfter'], this.selectElementAfter)

        this.animateHandle = null
        //是否截图
        this.isCut = false
    }
    /**
     * 初始化运行状态
     */
    initRunStatus() {
        for (let key in this.param.runStatus) {
            let status = this.param.runStatus[key]
            if (typeof status.isDefault != 'undefined' && status.isDefault == true) {
                this.runStatus = status
                //触发事件状态改变
                this.triggerEvent(EVENTS['changeStatus'])
                return
            }
        }
    }
    /**
     * 初始化状态
     */
    initStatus = () => {
        //没有初始化过画布
        this.isInitCanvas = false
        this.datas = []
        //画布状态重置初始化
        this.chart.initStatus()
        //this.triggerEvent(EVENTS['changeStatus'])
        //画布名称绘制

        //鹰眼状态
        //工具条状态
        //右键菜单状态
    }
    /**
     * 初始化覆盖事件
     */
    initCovers = main => {
        new Covers(main)
    }
    /**
     * 
    主要业务逻辑为
    1.判断传空则重置和清空状态
    2.判断运行状态（） 根据不同的状态执行对应的状态变动  包括（按钮变化 按钮范围变化 文字提示）
    3.判断实验画布的名称变化
    4.执行对应的固定变化
     * metadata 画布的信息
     * components 组件
     * loadFrom 调用方式 
     *  'SELECT_EXPR' 选择切换流程图或初始化
     *  'URL_CHANGE' 非流程图的切换,产生原因，单页面应用问题，切换了页面，但是画布状态要保持
     *  'SAVE_FAIL' 'SAVE_SUCCESS' 更新结果
     *  'UPDATE_STATE' 更新状态信息
     */
    changeCanvas = param => {
        let _metadata = param.metadata
        let _components = param.components
        let _loadFrom = param.loadFrom
        //设置状态 一定会执行，否则则执行初始化状态 _metadata.status EXECUTING WAIT_TO_EXECUTE
        let isSetStatus = false
        //判断是否无效的流程图信息，则清空
        if (
            typeof _metadata == 'undefined' ||
            (typeof _metadata.id == 'undefined' && typeof _metadata.dagOrigId == 'undefined')
        ) {
            this.initStatus()
            this.chart.drawCanvasName(this.param.canvasName.tipText)
            return
        }
        //let canvasId = _metadata.id
        //工具条显示
        //初始化画布信息
        if (Util.isContain(_metadata, 'id') || Util.isContain(_metadata, 'dagOrigId')) {
            this.global.metadata = _metadata
        }
        //显示对应的界面以及开始绘制
        if (!this.isInitCanvas) {
            //显示必要的信息
            //this.triggerEvent(EVENTS['eagleEyeShow'])
            this.triggerEvent(EVENTS['toolbarShow'])
            //step.启用绘制循环
            this.animate()
        }
        //test git submodule update
        switch (_loadFrom) {
            case 'SELECT_EXPR':
                //切换画布，加载由外围全局变量保存的上一次经纬度坐标（不需要可以不提供保存）
                this.switchCanvas()
                this.chart.canvasContent.focus()
                this.chart.isFocus = true
                break

            case 'SELECT_MODEL':
                this.switchCanvas()
                this.setStatus('MODEL')
                isSetStatus = true
                break

            case 'SAVE_FAIL':
            case 'SAVE_SUCCESS':
                this.chart.loadPanScale()
                break

            case 'UPDATE_PARAMS':
            case 'UPDATE_STATE':
                //只是数据变化，数据初始化会更新对应的状态
                break
        }
        //数据更新
        this.datas = _components

        //如果数据为空，则进行一次坐标初始化
        if (this.datas.length == 0) {
            this.chart.isInitScale = true
            this.triggerEvent(EVENTS['_dataEmpty'])
        } else {
            this.triggerEvent(EVENTS['_dataEmpty'], false)
        }
        //执行状态
        if (!isSetStatus && Util.isContain(_metadata, 'status')) {
            // && _metadata.status == 'EXECUTING' || _metadata.status == 'WAIT_TO_EXECUTE'
            this.setStatus(_metadata.status)
            isSetStatus = true
        }
        //状态初始化
        if (!isSetStatus) {
            this.initRunStatus()
        }
        this.isChangeDatas = true
        if (this.selectAfter == true) {
            if (!this.selectArr || this.selectArr.length == 0) {
                return false
            }
            //let isCallback = false
            //判断是否有选中的组件
            for (let i = 0; i < this.selectArr.length; i++) {
                let ishave = false
                let oneid = this.selectArr[i]
                for (let j = 0; j < this.datas.length; j++) {
                    let obj = this.datas[j]
                    if (obj.id == oneid) {
                        ishave = true
                    }
                }
                if (!ishave) {
                    return false
                }
            }

            //确认可以select了
            this.triggerEvent('selectElementCallback', this.selectArr)
            this.selectAfter = false
        }
    }
    /**
     * 选中组件
     * @param {*} arr
     */
    selectElementAfter = arr => {
        this.selectAfter = true
        this.selectArr = arr
    }
    /**
     * 切换画布的执行动作
     *
     */
    switchCanvas() {
        //确定初始过画布
        this.initStatus()
        this.isInitCanvas = true
        this.chart.loadPanScale()
    }
    /**
     * 设置运行状态，添加运行提示
     * @param {*} key
     */
    setStatus(key) {
        let status = this.param.runStatus[key]
        this.runStatus = status
        //触发事件状态改变  工具条，菜单，都需要监听事件
        this.triggerEvent('changeStatus')
    }
    animate = () => {
        //画布重置
        this.chart.resize()
        //画布缩放
        this.chart.scaleTranslate()
        //画布背景清空
        this.chart.drawBackground()
        //根据data动态初始化数据  接口数据  连接线数据
        this.chart.initData()
        //绘制元素，使用默认的画布ctx和比例，并使用
        this.chart.drawEles(null, null, true)
        //鹰眼绘制
        if (this.param && this.param.eagleEye && this.param.eagleEye.isCreate) {
            // 引入alwaysDraw 参数，鹰眼保持持续绘制
            this.eye.draw(this.param.eagleEye.alwaysDraw)
        }
        if (this.isCut) {
            let img = this.chart.canvas.toDataURL('image/jpeg', 1.0)
            this.isCut = false
            this.triggerEvent('cutImgCallBack', img)
        }
        this.animateHandle = requestAnimationFrame(this.animate)
    }
    /**
     * 截图
     */
    cutImg() {
        this.isCut = true
    }
    /**
     * 事件绑定
     * @param {*} eventName
     * @param {*} fun
     */
    bind(eventName, fun) {
        this.emitter.addListener(eventName, fun)
    }
    /**
     * 事件监听
     */
    triggerEvent() {
        this.emitter.emit(...arguments)
    }
    /**
     *
     */
    removeAll() {
        this.eventManage.removeAll()
        if (this.animateHandle) {
            cancelAnimationFrame(this.animateHandle)
        }
        this.isInitCanvas = false
    }
    /**
     * 画布外围重置时
     */
    resize(isResize) {
        //默认的页面是内部内容重置大小
        if (typeof isResize == 'undefined') {
            isResize = true
        }
        this.chart.resizeChart(isResize)
    }
    /**
     * 更新组件信息，且不必重新渲染,不更新坐标
     * @param {*} arr
     */
    updateComponents(components) {
        //this.datas = components
        for (let i = 0; i < this.datas.length; i++) {
            let obj = this.datas[i]
            let objAttr = components[i]
            if (obj.id != objAttr.id) {
                for (let j = 0; j < components.length; j++) {
                    if (components[j].id == obj.id) {
                        objAttr = components[j]
                    }
                }
            }
            if (obj.id != objAttr.id) {
                return false
            }
            for (let attr in objAttr) {
                if (attr != 'position') {
                    obj[attr] = objAttr[attr]
                }
            }
        }
        //发起菜单的更新重绘，如果菜单还在的话
        this.triggerEvent(EVENTS['showRefresh'])
    }
    /**
     * 获得对应的坐标
     */
    getPastePosition(arr) {
        return this.chart.getPastePosition(arr)
    }
    /**
     * 切换样式配置参数
     * @param {*} param
     */
    changeStyleConfig(param) {
        //this.param = Util.merge(this.param,param)
        /*
        this.param.link.linkStyle = param.link.linkStyle
        this.param.node.nodeStyle.radius = param.node.nodeStyle.radius
        this.param.node.inPortStyle.isNumber = param.node.inPortStyle.isNumber
        this.param.node.outPortStyle.isNumber = param.node.outPortStyle.isNumber
        this.param.node.inPortStyle.status = param.node.inPortStyle.status
        this.param.node.outPortStyle.status = param.node.outPortStyle.status
        */
        this.param = Util.merge(this.param, param)
        //因为数组是合并的问题，所以要直接覆盖
        if (param.link && param.link.linkStyle) {
            this.param.link.linkStyle = param.link.linkStyle
        }
        //类的话全覆盖就好了
        if (param.classInfomation) {
            this.param.classInfomation = param.classInfomation
        }
        this.triggerEvent(EVENTS['updataConfig'])
    }
}

export default FlowChart
