import { nodeStyle, linkStyle, inPortStyle, outPortStyle, canvasName } from './style'
const paramModel = {
    //必填的参数
    dom: null,
    canvas: {
        //每次缩放的倍数
        scaleValue: 0.97,
        //自动缩放范围 放大6倍体验很差
        scaleExtentAuto: [0.001, 1.2],
        //缩放范围
        scaleExtent: [0.001, 6],
        //是否使用动作缩放,不使用则画布锁死 即鼠标滚轮缩放和按钮缩放（按钮暂时不管，由按钮）
        isScaleAction: true,
        //是否存储画布的范围
        isSavePanScale: true,
        //默认chart，画布存储，还有app自己存储，实现方式不管，由业务管理，业务可以监听，画布自己使用localStorage
        //画布存储，当刷新页面时，则进行清空重置，没有刷新时则进行存储和读取
        panScaleSaveType: 'chart',
        //配置样式，2020/05/21
        background: '#2A2D38'
    },
    canvasName: {
        isShow: false, //默认不显示画布名称
        style: canvasName,
        tipText: '请选择画布'
    },
    //连接线定义
    link: {
        //是否强制接口类型 默认为true，接口类型固定了以后则使用强制类
        isPortType: true,
        //是否输入必须一个，默认为true，针对接口无限连接的
        isInPortOne: true,
        //是否为不可循环流程图,用于连接验证
        isDAG: true,
        linkStyle
        //连接样式 后置
        //inputStyle outputStyle
    },
    //节点定义
    node: {
        //是否有class
        //isClass:true,强制添加class，没有class也要造一个
        nodeStyle,
        inPortStyle,
        outPortStyle,
        runStatus: {
            invalid: {
                img: 'invalid',
                tip: '参数无效'
            },
            EXEC_FINISH: {
                img: 'complete',
                tip: '运行完毕'
            },
            EXEC_FAILED: {
                img: 'invalid',
                tip: '运行错误'
            },
            EXECUTING: {
                img: 'executing',
                tip: '运行中'
            },
            WAIT_TO_EXECUTE: {
                img: 'wait',
                tip: '等待运行'
            },
            NON_EXECUTE: {
                img: 'none', //none
                tip: '没有运行'
            },
            READY: {
                img: 'ready',
                tip: '准备执行'
            }
        },
        //是否进行删除确认 deleteConfirm:null 表示删除不确认 deleteConfirm:()=>{//写confirm的确认框，成功调用 deleteEles事件，第一个参数为false,第二个参数为true }
        deleteConfirm: null,
        //node为空时的显示提示
        empty: {
            //默认空的时候不显示提示
            isShowTip: false,
            img: window.basename + '/img/nodata/default_no_data_d.svg',
            tipmsg: ['', '']
        }
    },
    //鹰眼设定
    eagleEye: {
        isCreate: true
        //默认显示
        //方位角
    },
    //按钮排，使用用户定义的dom，接收用户传入的宽高，使用相对于主DOM的位置 left top bottom right 调用默认的事件 框选、删除选中、画布自适应、放大、缩小
    toolbar: {
        //是否显示，决定了是否进行初始化
        isShow: true,
        image: {
            size: 24,
            //单个的左右间距
            margin: 8,
            //前缀和后缀
            urlPrefix: window.basename + '/img/toolbar/',
            urlSuffix: '.svg',
            isHover: false,
            hoverSuffix: '_hover',
            isActive: false,
            activeSuffix: '_active'
        },
        list: [
            /*
            {
                img:'execute',//图片url
                title:'执行画布',
                //可显示状态（等于） 和下面的（不等于）是并集的关系
                show:{
                    //运行状态：在编辑状态
                    runStatus:['EDITSTATUS'],
                },
                //不可显示状态
                unShow:{
                    runStatus:['MODEL','EXECUTING','WAIT_TO_EXECUTE'],
                },
                //业务来决定的是否显示
                showFun:function(){

                },
                event:'_runCanvas'
            },
            {
                img:'stop',//图片url
                title:'停止执行',
                //可显示状态 和下面的是并集的关系
                show:{
                    //运行状态：执行状态和 等待执行状态
                    runStatus:['EXECUTING','WAIT_TO_EXECUTE'],
                },
                //不可显示状态
                unShow:{
                    //运行状态：在编辑状态
                    runState:['EDITSTATUS','MODEL'],
                },
                //业务来决定的是否显示
                showFun:function(){

                },
                event:'_stopExecute'
            },
            */
            // {
            //     img: 'search', //图片url
            //     title: '查询',
            //     //可显示状态 和下面的是并集的关系
            //     show: {
            //         //
            //         runStatus: ['EDITSTATUS', 'MODEL', 'VIEW', 'EXECUTING', 'WAIT_TO_EXECUTE']
            //     },
            //     //不可显示状态
            //     unShow: {},
            //     //业务来决定的是否显示
            //     showFun: function() {},
            //     event: 'searchSelect'
            // },
            // {
            //     img: 'extent', //图片url
            //     title: '框选',
            //     //可显示状态 和下面的是并集的关系
            //     show: {
            //         //
            //         runStatus: ['EDITSTATUS', 'MODEL', 'VIEW', 'EXECUTING', 'WAIT_TO_EXECUTE']
            //     },
            //     //不可显示状态
            //     unShow: {},
            //     //业务来决定的是否显示
            //     showFun: function() {},
            //     event: 'extentSelect'
            // },
            // {
            //     img: 'delete', //图片url
            //     title: '删除选中',
            //     //可显示状态 和下面的是并集的关系
            //     show: {
            //         //运行状态：在编辑状态
            //         runStatus: ['EDITSTATUS']
            //     },
            //     //不可显示状态
            //     unShow: {},
            //     //业务来决定的是否显示
            //     showFun: function() {},
            //     event: 'deleteEvent'
            // },
            // {
            //     img: 'self-adaption', //图片url
            //     title: '画布自适应',
            //     //可显示状态 和下面的是并集的关系
            //     show: {
            //         //运行状态：在编辑状态
            //         runStatus: ['EDITSTATUS', 'MODEL', 'VIEW', 'EXECUTING', 'WAIT_TO_EXECUTE']
            //     },
            //     //不可显示状态
            //     unShow: {},
            //     //业务来决定的是否显示
            //     showFun: function() {},
            //     event: 'resizeChart'
            // },
            // {
            //     img: 'enlarge', //图片url
            //     title: '放大',
            //     //可显示状态 和下面的是并集的关系
            //     show: {
            //         //运行状态：在编辑状态
            //         runStatus: ['EDITSTATUS', 'MODEL', 'VIEW', 'EXECUTING', 'WAIT_TO_EXECUTE']
            //     },
            //     //不可显示状态
            //     unShow: {},
            //     //业务来决定的是否显示
            //     showFun: function() {},
            //     event: 'scaleEnlarged' //通过判断事件依赖，来判定是否显示，，需要定义事件对应的执行依赖
            // },
            // {
            //     img: 'narrow', //图片url
            //     title: '缩小',
            //     //可显示状态 和下面的是并集的关系
            //     show: {
            //         runStatus: ['EDITSTATUS', 'MODEL', 'VIEW', 'EXECUTING', 'WAIT_TO_EXECUTE']
            //     },
            //     //不可显示状态
            //     unShow: {},
            //     //业务来决定的是否显示
            //     showFun: function() {},
            //     event: 'scaleReduce'
            // }
        ]
    },
    //不传表示菜单为false
    menu: {
        isShow: true,
        runStatus: ['EDITSTATUS', 'EXECUTING', 'WAIT_TO_EXECUTE'],
        image: {
            isImage: true,
            isFront: true,
            imageW: 24,
            imageH: 24,
            //前缀和后缀
            urlPrefix: window.basename + '/img/menucanvas/',
            urlSuffix: '.svg'
        },
        menuList: [
            /*
            {
                //没有image则不使用图片
                img:'pop_icon_from',
                name:'从节点开始执行',//名称
                type:'button',
                handle:function(){},//回调函数
                //显示条件 多个条件的and 如果没有条件则 什么状态（状态是固定的）选中单个元素还是多个元素时  只有一个元素的是否是固定类型

                //可显示状态 和下面的是并集的关系
                show:{
                    //运行状态：在编辑状态
                    runStatus:['EDITSTATUS'],
                    //节点要求：1个 或者 n表示多个
                    node:'1',//对单个操作
                    //节点属性要求
                    nodeAttribute:[{
                        //status:'EXEC_FINISH',
                        //classname:'读数据表',
                        canExecuteFromThisNode:true,

                    }]
                },
                //不可显示状态
                unShow:{},
                event:'_runFromCurrent'
            },
            {
                img:'pop_icon_to',
                name:'执行至此节点',//名称
                type:'button',
                show:{
                    runStatus:['EDITSTATUS'],
                    //节点要求：1个 或者 n表示多个
                    node:'1',//对单个操作
                    //节点属性要求
                    nodeAttribute:[{
                        canExecuteToThisNode:true
                    }]
                },
                //不可显示状态
                unShow:{},
                event:'_runToCurrent'
            },
            {
                img:'pop_icon_point',
                name:'执行此节点',//名称
                type:'button',
                show:{
                    runStatus:['EDITSTATUS'],
                    //节点要求：1个 或者 n表示多个
                    node:'1',//对单个操作
                    //节点属性要求
                    nodeAttribute:[{
                        isExecutable:true
                    }]
                },
                //不可显示状态
                unShow:{},
                event:'_runToCurrent'
            },
            {
                img:'pop_icon_export',
                name:'导出此节点DAG',//名称
                type:'button',
                show:{
                    runStatus:['EDITSTATUS'],
                    //节点要求：1个 或者 n表示多个
                    node:'1',//对单个操作
                    //节点属性要求
                    nodeAttribute:[{
                        //导出节点要求是运行完毕
                        status:'EXEC_FINISH',
                    }]
                },
                //不可显示状态
                unShow:{
                    //节点属性要求
                    nodeAttribute:[{
                        classname:['读数据表','写数据表'],
                    }]
                },
                event:'_contextExport'
            },
            {
                img:'pop_icon_date',
                name:'查看数据',//名称
                type:'button',
                show:{
                    runStatus:['EDITSTATUS'],
                    //节点要求：1个 或者 n表示多个
                    node:'1',//对单个操作
                    //节点属性要求
                    nodeAttribute:[
                        {
                            classname:['读数据表'],
                        },
                        {
                            //或者导出节点要求是运行完毕
                            status:'EXEC_FINISH',
                        },

                    ]
                },
                //不可显示状态
                unShow:{},
                event:'_contextViewData'
            },
            {
                img:'pop_icon_cookies',
                name:'查看日志',//名称
                type:'button',
                show:{
                    runStatus:['EDITSTATUS'],
                },
                //不可显示状态
                unShow:{},
                event:'_contextViewLog'
            },
            {
                img:'pop_icon_note',
                name:'添加注释',//名称
                type:'button',
                show:{
                    runStatus:['EDITSTATUS','EXECUTING','WAIT_TO_EXECUTE'],
                    //节点要求：1个 或者 n表示多个
                    node:'1',//对单个操作
                },
                //不可显示状态
                unShow:{},
                event:'_contextEditDes'
            },
            {
                //cut-off 分割线
                type:'line'
            },
            {
                img:'pop_icon_rename',
                name:'重命名',//名称
                type:'button',
                show:{
                    runStatus:['EDITSTATUS'],
                    //节点要求：1个 或者 n表示多个
                    node:'1',//对单个操作
                },
                //不可显示状态
                unShow:{},
                event:'_contextRename'
            },
            {
                img:'pop_icon_delet',
                name:'删除',//名称
                type:'button',
                show:{
                    runStatus:['EDITSTATUS'],
                    //节点要求：1个 或者 n表示多个
                    node:'1',//对单个操作
                },
                //不可显示状态
                unShow:{},
                event:'deleteEvent'
            },
            */
        ]
    },
    //运行状态,相关菜单和按钮的显示相关
    runStatus: {
        //编辑状态，默认 必须要配置一个isDefault
        EDITSTATUS: {
            name: 'EDITSTATUS',
            isDefault: true,
            //此状态下是否进行显示状态
            isShowTip: false,
            tipText: '画布可编辑...',
            //是否支持菜单
            isShowMenu: true,
            //是否支持编辑
            isEditPosition: true,
            isEditTopology: true,
            //是否平移和缩放
            isPanScale: true
        },
        //运行状态
        EXECUTING: {
            name: 'EXECUTING',
            isShowTip: true,
            tipText: '画布运行中...',
            isShowMenu: true,
            //是否支持编辑 主要是图形的位置及图形的拓扑关系,特殊情况，可以保存节点位置
            isEditPosition: true,
            isEditTopology: false,
            isPanScale: true
        },
        //等待运行状态
        WAIT_TO_EXECUTE: {
            name: 'WAIT_TO_EXECUTE',
            isShowTip: true,
            tipText: '画布等待运行中...',
            //是否支持菜单
            isShowMenu: true,
            //是否支持编辑 主要是图形的位置及图形的拓扑关系,特殊情况，可以保存节点位置
            isEditPosition: true,
            isEditTopology: false,
            isPanScale: true
        },
        //模型状态
        MODEL: {
            name: 'MODEL',
            isShowTip: false,
            //是否支持菜单
            isShowMenu: true,
            //是否支持编辑 主要是图形的位置及图形的拓扑关系
            isEditPosition: false,
            isEditTopology: false,
            isPanScale: true
        },
        //浏览状态
        VIEW: {
            name: 'VIEW',
            isShowTip: false,
            //是否支持菜单
            isShowMenu: true,
            //是否支持编辑 主要是图形的位置及图形的拓扑关系
            isEditPosition: false,
            isEditTopology: false,
            isPanScale: true
        }
    }
}
export default paramModel
