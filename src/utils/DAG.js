let connDescMap = {}
export const getConnDescMapAsArray = () => {
    const res = []
    for (let key in connDescMap) {
        res.push(connDescMap[key])
    }
    // console.log(res, 'res')
    return res
}

/*
 * 加载dagData
 * loadFrom 调用方式
 *  'SELECT_EXPR' 选择切换流程图或初始化
 *  'URL_CHANGE' 非流程图的切换,产生原因，单页面应用问题，切换了页面，但是画布状态要保持
 *  'SAVE_FAIL' 'SAVE_SUCCESS' 更新结果
 *  'UPDATE_STATE' 更新状态信息
 */

export const loadDAGData = (dag = {}, { loadFrom }) => {
    const dagData = dag
    if (typeof window.FLOWCHART != 'undefined') {
        //这里需要改动
        // dagData.metadata.status = status
        window.FLOWCHART.changeCanvas({
            metadata: dagData.metadata,
            components: dagData.components,
            loadFrom
        })
        window.CHANGE_CANVAS_PARAMS = null
    } else {
        window.CHANGE_CANVAS_PARAMS = {
            metadata: dagData.metadata,
            components: dagData.components,
            loadFrom
        }
    }
}
