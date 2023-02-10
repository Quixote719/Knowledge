import EVENTS from './eventdeclara'
import Util from '../util'
/**
 * 事件管理
 * 监听事件，派发，需要事件的进行监听
 */
class EventManage {
    constructor(main) {
        this.main = main
        this.chart = main.chart
        //渲染的主画布
        this.canvas = main.chart.canvas
        //提供的所有父元素
        this.canvasContent = main.param.dom
        this.addEvent()
    }
    addEvent = () => {
        let canvas = this.canvas
        let canvasContent = this.canvasContent
        //键盘事件 目前只有一个删除46 只有在 canvas focus时才执行  派发deleteEle事件
        window.addEventListener('keydown', this.keydown)
        window.addEventListener('keyup', this.keyup)
        //鼠标右键事件需要在（画布范围）内才执行 派发右键坐标菜单
        canvasContent.addEventListener('contextmenu', this.contextmenu)
        //鼠标的移上，需要在（画布范围，且覆盖范围去除）
        window.addEventListener('mousemove', this.mousemove)
        //鼠标的按键抬起，由于需要得到外围的新增事件的按键抬起，所以是为window添加
        window.addEventListener('mouseup', this.mouseup)
        //鼠标滚动执行放大缩小
        canvas.addEventListener('mousewheel', this.mousewheel)
        //鼠标点击canvas父元素添加事件 （画布不规则范围，需要去除覆盖范围）
        canvasContent.addEventListener('mousedown', this.mousedown)
        //鼠标双点击canvas父元素添加事件 （画布不规则范围，需要去除覆盖范围）
        canvasContent.addEventListener('dblclick', this.dblclick)
        //鼠标在父容器有焦点
        canvasContent.addEventListener('focus', this.focus)
        //鼠标在父容器失去焦点
        canvasContent.addEventListener('blur', this.blur)
    }
    removeAll = () => {
        let canvas = this.canvas
        let canvasContent = this.canvasContent
        window.removeEventListener('keydown', this.keydown)
        //鼠标右键事件需要在（画布范围）内才执行 派发右键坐标菜单
        window.removeEventListener('contextmenu', this.contextmenu)
        //鼠标的移上，需要在（画布范围，且覆盖范围去除）
        window.removeEventListener('mousemove', this.mousemove)
        //鼠标的按键抬起，由于需要得到外围的新增事件的按键抬起，所以是为window添加
        window.removeEventListener('mouseup', this.mouseup)
        //鼠标滚动执行放大缩小
        canvas.removeEventListener('mousewheel', this.mousewheel)
        //鼠标点击canvas父元素添加事件 （画布不规则范围，需要去除覆盖范围）
        canvasContent.removeEventListener('mousedown', this.mousedown)
        //鼠标双点击canvas父元素添加事件 （画布不规则范围，需要去除覆盖范围）
        canvasContent.removeEventListener('dblclick', this.dblclick)
        //鼠标在父容器有焦点
        canvasContent.removeEventListener('focus', this.focus)
        //鼠标在父容器失去焦点
        canvasContent.removeEventListener('blur', this.blur)
    }
    /**
     * 键盘事件
     * @param {*} event
     */
    keydown = event => {
        //键盘删除
        if (46 == event.keyCode) {
            //触发键盘删除按钮事件，需要监听的自己完成业务判断
            this.main.triggerEvent(EVENTS['deleteEvent'])
        }
        /*去除之前的ctrl进行框选
        if(event.keyCode == 17) {
            this.main.triggerEvent(EVENTS['extentSelect']);
            this.canvas.style.cursor = 'crosshair'
            this.main.triggerEvent(EVENTS['updateCanvasStatus'])
        }
        */
        //键盘拷贝
        if (event.ctrlKey && 67 == event.keyCode) {
            this.copy()
        }
        //键盘粘贴
        if (event.ctrlKey && 86 == event.keyCode) {
            this.paste()
        }
        //键盘多选
        if (event.ctrlKey && 67 != event.keyCode && 86 != event.keyCode) {
            this.main.triggerEvent(EVENTS['multSelect'], true)
        }
    }

    /**
     * 键盘keyup事件
     * @param {*} event
     */
    keyup = event => {
        if (event.keyCode == 17) {
            this.chart.isBoxSelect = false
            this.canvas.style.cursor = 'move'
            this.main.triggerEvent(EVENTS['updateCanvasStatus'])
        }
        //键盘多选
        if (!event.ctrlKey) {
            this.main.triggerEvent(EVENTS['multSelect'], false)
            //补发一个mousedown，不然鼠标不知道自己在那里up会触发清空选中
            let x = event.clientX
            let y = event.clientY
            //点击时的相对左上角坐标
            let pos = Util.windowToCanvasLeftRight(this.canvas, x, y)
            this.main.triggerEvent(EVENTS['mousedown'], pos)
        }
    }
    /**
     * 鼠标点击右键
     * @param {*} event
     */
    contextmenu = event => {
        event.preventDefault()
        //右键菜单触发
        this.main.triggerEvent(EVENTS['contextmenu'], event)
    }
    /**
     * 鼠标移上
     * @param {*} event
     */
    mousemove = event => {
        let x = event.clientX
        let y = event.clientY
        let pos = Util.windowToCanvasLeftRight(this.canvas, x, y)
        this.main.triggerEvent(EVENTS['mousemove'], pos)
    }
    /**
     * 鼠标点击后的抬起
     * @param {*} event
     */
    mouseup = event => {
        let x = event.clientX
        let y = event.clientY
        let pos = Util.windowToCanvasLeftRight(this.canvas, x, y)
        this.main.triggerEvent(EVENTS['mouseup'], pos)
    }
    /**
     * 鼠标点击事件
     * @param {*} event
     */
    mousedown = event => {
        //防止鼠标右键
        if (event.button !== 0) {
            return
        }
        let x = event.clientX
        let y = event.clientY
        //点击时的相对左上角坐标
        let pos = Util.windowToCanvasLeftRight(this.canvas, x, y)
        this.main.triggerEvent(EVENTS['mousedown'], pos)
    }
    /**
     * 鼠标双击事件
     * @param {*} event
     */
    dblclick = event => {
        //防止鼠标右键
        if (event.button !== 0) {
            return
        }
        let x = event.clientX
        let y = event.clientY
        //点击时的相对左上角坐标
        let pos = Util.windowToCanvasLeftRight(this.canvas, x, y)
        this.main.triggerEvent(EVENTS['dblclick'], pos)
    }
    /**
     * 滚轮事件
     * @param {*} event
     */
    mousewheel = event => {
        let pos = Util.windowToCanvasLeftRight(this.canvas, event.clientX, event.clientY)
        let eventWheelDelta = event.wheelDelta ? event.wheelDelta : event.deltaY * -40
        if (eventWheelDelta > 0) {
            this.main.triggerEvent(EVENTS['scaleEnlarged'], pos)
        } else {
            this.main.triggerEvent(EVENTS['scaleReduce'], pos)
        }
    }
    /**
     * 获得焦点
     * @param {*} event
     */
    focus = event => {
        this.chart.isFocus = true
    }
    /**
     * 失去焦点
     * @param {*} event
     */
    blur = event => {
        this.chart.isFocus = false
    }
    /**
     * 拷贝动作，只有在画布焦点时有用
     *
     */
    copy = event => {
        if (this.chart.isFocus) {
            this.main.triggerEvent(EVENTS['dagCopyEvent'])
        }
    }
    /**
     * 粘贴动作
     */
    paste = event => {
        if (this.chart.isFocus) {
            this.main.triggerEvent(EVENTS['dagPaste'])
        }
    }
}

export default EventManage
