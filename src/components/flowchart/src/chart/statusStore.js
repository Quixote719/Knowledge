import Util from '../util'
import EVENTS from '../event/eventdeclara'
/**
 * 状态信息存储
 * 配置使用
 */
class StatusStore {
    constructor(chart) {
        this.storageName = 'FLOWCHART'
        this.storage = {} //{window.localStorage}
        //初始化时，定义一个windows变量，当变量改变，则进行清除
        if (!Util.isContain(window, '_ISRELOAD')) {
            this.initStore()
            window._ISRELOAD = true
        }
        this.chart = chart
        this.chart.main.bind(EVENTS['updatePanScale'], this.updatePanScale)
        this.chart.main.bind(EVENTS['loadPanScale'], this.loadPanScale)
    }
    /**
     * 初始化存储
     */
    initStore() {
        this.clearStore()
        //画布平移对象，画布id为健
        this.storage[this.storageName] = {
            panScale: {}
        }
    }
    /**
     * 清空存储的状态信息
     */
    clearStore() {
        if (Util.isContain(this.storage, this.storageName)) {
            this.storage.removeItem(this.storageName)
        }
    }
    /**
     * 更新平移
     * @param {*} obj
     */
    updatePanScale = obj => {
        if (this.chart.main.param.canvas.isSavePanScale && obj && Util.isContain(obj, 'id')) {
            if (typeof this.storage[this.storageName] == 'undefined') {
                this.initStore()
            }
            this.storage[this.storageName].panScale[obj.id] = obj
        }
    }
    /**
     * 加载平移
     */
    loadPanScale = obj => {
        if (
            this.chart.main.param.canvas.isSavePanScale &&
            obj &&
            Util.isContain(obj, 'id') &&
            Util.isContain(this.storage[this.storageName], 'panScale') &&
            Util.isContain(this.storage[this.storageName].panScale, obj.id)
        ) {
            this.chart.main.triggerEvent(
                EVENTS['loadPanScaleCallBack'],
                this.storage[this.storageName].panScale[obj.id]
            )
        }
    }
}
export default StatusStore
