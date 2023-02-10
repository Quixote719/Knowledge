/**
 * 事件声明
 * 方便各个模块查看事件及其对应监听
 */
const EVENTS = {
    //画布的运行状态变更
    changeStatus: 'changeStatus',
    //拓扑改变保存，包括新增、删除、连接
    topologyChange: 'topologyChange',
    //更新画布的平移和缩放存储
    updatePanScale: 'updatePanScale',
    //加载画布的存储坐标
    loadPanScale: 'loadPanScale',
    //加载画布的存储坐标回调
    loadPanScaleCallBack: 'loadPanScaleCallBack',
    //执行画布的放大 可传画布上的坐标
    scaleEnlarged: 'scaleEnlarged',
    //执行画布的缩小 可传画布上的坐标
    scaleReduce: 'scaleReduce',
    //执行框选
    extentSelect: 'extentSelect',
    //key DEL键的事件触发
    deleteEvent: 'deleteEvent',
    contextmenu: 'contextmenu',
    mousemove: 'mousemove',
    mousedown: 'mousedown',
    dblclick: 'dblclick',
    mouseup: 'mouseup',
    //通知消息,需要外面自己实现
    messageTip: 'messageTip',
    //通知信息，需要外面自己监听实现
    messageSuccess: 'messageSuccess',
    //存储画布的状态
    updateCanvasStatus: 'updateCanvasStatus',
    //工具条的显示
    toolbarShow: 'toolbarShow',
    //鹰眼的显示
    eagleEyeShow: 'eagleEyeShow',
    //关闭菜单 点击画布时有需求关闭菜单
    hideMenu: 'hideMenu',
    //选中节点
    selectElement: 'selectElement',
    //坐标改变
    positionChange: 'positionChange',
    //resize事件
    resizeChart: 'resizeChart',
    //获取画布的大小
    getCanvasSize: 'getCanvasSize',
    //获取画布的平移缩放信息
    getCanvasScaleTranslate: 'getCanvasScaleTranslate',
    //覆盖面的事件 获取全部
    getCovers: 'getCovers',
    //覆盖面的事件 保存或更新覆盖范围
    saveCovers: 'saveCovers',
    //覆盖面的事件 删除
    deleteCovers: 'deleteCovers',
    //自动更新全部的覆盖范围，在resize事件之后
    updateAllCovers: 'updateAllCovers',
    //停止执行
    _stopExecute: '_stopExecute',
    stopExecute: 'stopExecute',
    //导出DAG
    _export_dag: '_export_dag',
    export_dag: 'export_dag',
    //执行画布  全部  此节点 从此节点 到此节点
    _runCanvas: '_runCanvas', //内部的指向执行画布
    _runCurrent: '_runCurrent', //内部的指向 执行此节点
    _runToCurrent: '_runToCurrent', //内部的指向 执行至此节点
    _runFromCurrent: '_runFromCurrent', //内部的指向 从此节点开始执行
    runCanvas: 'runCanvas', //执行画布 EXECUTE_WHOLE_DAG
    runComponent: 'runComponent', //执行画布组件 EXECUTE_CURRENT_NODE EXECUTE_TIL_CURRENT_NODE EXECUTE_FROM_CURRENT_NODE
    //上下文相关的右键菜单事件
    _contextExport: '_contextExport',
    _contextViewData: '_contextViewData',
    _contextViewLog: '_contextViewLog',
    _exportView: '_exportView',
    _contextEditDes: '_contextEditDes',
    _contextRename: '_contextRename',
    _contextViewOptimalSolution: '_contextViewOptimalSolution',
    _contextEditOptimalSolution: '_contextEditOptimalSolution',
    _contextViewAnalysis: '_contextViewAnalysis',
    _contextViewModel: '_contextViewModel',
    contextEvent: 'contextEvent',
    //新增事件
    mouseDownAdd: 'mouseDownAdd',
    //新增视图
    mouseDownAdds: 'mouseDownAdds',
    //copy动作
    dagCopyEvent: 'dagCopyEvent',
    //copy传递外围
    dagCopy: 'dagCopy',
    //粘贴动作
    dagPasteEvent: 'dagPasteEvent',
    //粘贴传递外围
    dagPaste: 'dagPaste',

    //需要选中的消息传到changeCanvas那边
    selectElementAfter: 'selectElementAfter',
    //changeCanvas那边收到消息后判断有没有对应的id，有则调用选中
    selectElementCallback: 'selectElementCallback',
    //在选中一个元素后，会后台单独请求状态，然后再次刷新菜单
    showRefresh: 'showRefresh',
    //添加设节点状态事件
    setNodeStatus: 'setNodeStatus',
    //用户自定义事件
    userDefined: 'userDefined',
    //图标点击事件
    imageClick: 'imageClick',
    //鼠标移上事件
    mousemoveEle: 'mousemoveEle',
    //多选事件触发
    multSelect: 'multSelect',
    //搜索查询
    searchSelect: 'searchSelect',
    //双击事件通知
    dblClickNode: 'dblClickNode',
    //更新参数操作
    updataConfig: 'updataConfig',
    //数据为空
    _dataEmpty: '_dataEmpty'
}

export default EVENTS
