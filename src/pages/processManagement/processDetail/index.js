import React from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import styles from './index.less'
import { Breadcrumb, Button, Popover, message } from 'antdForHik'
import FlowChart from '@/components/flowchart/src/main'
import DAGTemplate from './DAGTemplate'
import classnames from 'classnames'
import {
    // getConnDescMapAsArray,
    loadDAGData
} from '@/utils/DAG'
@inject('processStore')
@observer
class ProcessDetail extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            // 显示右侧设置区
            showRight: false,
            // 显示左侧菜单
            showLeft: true
        }
    }
    onWindowResize = () => {
        if (typeof this.flowChart != 'undefined' && this.flowChart && typeof this.flowChart.resize != 'undefined') {
            this.flowChart.resize()
        }
    }
    messageTip = data => {
        message.warning(data)
    }

    onDagDidMount = () => {
        window.addEventListener('resize', this.onWindowResize)
        this.onWindowResize()

        // this.props.componentStore.buildMenu().then(() => {
        //在获取组件接口数据之后再初始化DAG的设置
        let param = {
            dom: document.getElementById('canvasBody'),
            canvasName: {
                isShow: false
            },
            eagleEye: {
                isCreate: true,
                alwaysDraw: false
            },
            // 节点配置
            node: {
                nodeStyle: {
                    image: {
                        // urlPrefix: `assets/img/menutype/dag_icon_`,
                        urlSuffix: '.svg'
                    }
                },
                //设定何状态下使用图标点击事件
                imageClick: {
                    runStatus: ['EDITSTATUS']
                }
            },
            //组件类描述信息
            classInfomation: {
                // classInfo: getConnDescMapAsArray()
                classInfo: this.props.processStore.classInfomation
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
                    isShowTip: false,
                    tipText: '画布运行中...',
                    isShowMenu: true,
                    //是否支持编辑 主要是图形的位置及图形的拓扑关系,特殊情况，可以保存节点位置
                    isEditPosition: true,
                    isEditTopology: false,
                    isPanScale: true
                }
                // //浏览状态
                // VIEW: {
                //     name: 'VIEW',
                //     isShowTip: false,
                //     //是否支持菜单
                //     isShowMenu: true,
                //     //是否支持编辑 主要是图形的位置及图形的拓扑关系
                //     isEditPosition: false,
                //     isEditTopology: false,
                //     isPanScale: true
                // }
            },
            //按钮排，使用用户定义的dom，接收用户传入的宽高，使用相对于主DOM的位置 left top bottom right 调用默认的事件 框选、删除选中、画布自适应、放大、缩小
            toolbar: {
                //是否显示，决定了是否进行初始化
                isShow: true,
                // 是否分区域
                isDivide: true,
                image: {
                    size: 24,
                    //单个的左右间距
                    margin: 8,
                    //前缀和后缀

                    // urlPrefix: '../../res/img/dagImg/',
                    urlSuffix: '.svg',
                    isHover: false,
                    hoverSuffix: '_hover',
                    isActive: false,
                    activeSuffix: '_active'
                },
                list: [
                    {
                        img: 'search', //图片url
                        title: '查询',
                        //可显示状态 和下面的是并集的关系
                        show: {
                            // 编辑、运行中可见
                            runStatus: ['EDITSTATUS', 'VIEW', 'EXECUTING']
                        },
                        //不可显示状态
                        unShow: {},
                        //业务来决定的是否显示
                        showFun: function () {},
                        event: 'searchSelect'
                    },
                    {
                        img: 'delete', //图片url
                        title: '删除选中',
                        //可显示状态 和下面的是并集的关系
                        show: {
                            //运行状态：在编辑状态
                            runStatus: ['EDITSTATUS', 'EXECUTING']
                        },
                        //不可显示状态
                        unShow: {},
                        //业务来决定的是否显示
                        showFun: function () {},
                        event: 'deleteEvent',
                        // 分割线标记
                        divider: true
                    },
                    {
                        img: 'extent', //图片url
                        title: '框选',
                        //可显示状态 和下面的是并集的关系
                        show: {
                            //
                            runStatus: ['EDITSTATUS', 'EDITPREDSTATUS', 'MODEL', 'VIEW', 'EXECUTING', 'WAIT_TO_EXECUTE']
                        },
                        //不可显示状态
                        unShow: {},
                        //业务来决定的是否显示
                        showFun: function () {},
                        event: 'extentSelect'
                    },
                    {
                        img: 'self-adaption', //图片url
                        title: '画布自适应',
                        //可显示状态 和下面的是并集的关系
                        show: {
                            //运行状态：在编辑状态
                            runStatus: ['EDITSTATUS', 'EDITPREDSTATUS', 'MODEL', 'VIEW', 'EXECUTING', 'WAIT_TO_EXECUTE']
                        },
                        //不可显示状态
                        unShow: {},
                        //业务来决定的是否显示
                        showFun: function () {},
                        event: 'resizeChart'
                    },
                    {
                        img: 'enlarge', //图片url
                        title: '放大',
                        //可显示状态 和下面的是并集的关系
                        show: {
                            //运行状态：在编辑状态
                            runStatus: ['EDITSTATUS', 'EDITPREDSTATUS', 'MODEL', 'VIEW', 'EXECUTING', 'WAIT_TO_EXECUTE']
                        },
                        //不可显示状态
                        unShow: {},
                        //业务来决定的是否显示
                        showFun: function () {},
                        event: 'scaleEnlarged' //通过判断事件依赖，来判定是否显示，，需要定义事件对应的执行依赖
                    },
                    {
                        img: 'narrow', //图片url
                        title: '缩小',
                        //可显示状态 和下面的是并集的关系
                        show: {
                            runStatus: ['EDITSTATUS', 'EDITPREDSTATUS', 'MODEL', 'VIEW', 'EXECUTING', 'WAIT_TO_EXECUTE']
                        },
                        //不可显示状态
                        unShow: {},
                        //业务来决定的是否显示
                        showFun: function () {},
                        event: 'scaleReduce'
                    }
                ]
            },
            //不传表示菜单为false
            menu: {
                isShow: true, //默认false
                runStatus: ['EDITSTATUS', 'EXECUTING'],
                image: {
                    isImage: false,
                    isFront: true,
                    imageW: 24,
                    imageH: 24,
                    //前缀和后缀
                    // urlPrefix: `${window.basename}/img/menucanvas/`,
                    urlSuffix: '.svg'
                },
                // 右键菜单
                menuList: [
                    {
                        img: 'pop_icon_export',
                        name: '拷贝', //名称
                        type: 'button',
                        show: [
                            {
                                runStatus: ['EDITSTATUS', 'EDITPREDSTATUS'],
                                //节点要求：1个 或者 n表示多个
                                node: '1' //对单个操作
                            },
                            {
                                runStatus: ['EDITSTATUS'],
                                //节点要求：1个 或者 n表示多个
                                node: 'n' //对单个操作
                            }
                        ],
                        //不可显示状态
                        unShow: [{}],
                        event: 'dagCopyEvent'
                    },
                    {
                        img: 'pop_icon_export',
                        name: '粘贴', //名称
                        type: 'button',
                        show: [
                            {
                                runStatus: ['EDITSTATUS', 'EDITPREDSTATUS'],
                                node: 0,
                                link: 0
                            }
                        ],
                        //不可显示状态
                        unShow: [{}],
                        event: 'dagPaste'
                    },

                    {
                        img: 'pop_icon_delet',
                        name: '删除', //名称
                        type: 'button',
                        show: [
                            {
                                runStatus: ['EDITSTATUS', 'EDITPREDSTATUS'],
                                //节点要求：1个 或者 n表示多个
                                node: '1' //对单个操作
                            },
                            {
                                runStatus: ['EDITSTATUS', 'EDITPREDSTATUS'],
                                //连线要求：1个 或者 n表示多个
                                link: '1' //对单个操作
                            }
                        ],
                        //不可显示状态
                        unShow: [{}],
                        event: 'deleteEvent'
                    }
                ]
            }
        }
        this.flowChart = new FlowChart(param)
        window.FLOWCHART = this.flowChart
        this.flowChart.bind('selectElement', data => {
            // console.log(data, 'data')
            // this.props.appStore.selectComponentsFromCanvas(data)
        })
        // 绑定画布提示事件
        this.flowChart.bind('messageTip', data => {
            this.messageTip(data)
        })

        this.flowChart.bind('messageSuccess', data => {
            message.success(data)
        })

        window.addEventListener('resize', () => {
            this.onWindowResize(this)
        })
        const currentDag = this.props.processStore.currentDag
        if (currentDag) {
            loadDAGData(currentDag, {
                loadFrom: 'SELECT_EXPR'
            })
        }
    }

    onDagDidUnmount = () => {
        window.FLOWCHART = undefined
        if (typeof this.flowChart != 'undefined' && this.flowChart) {
            this.flowChart.removeAll()
        }
        // this.props.appStore.dagDidMount = false
    }

    showLeftHandle = () => {
        this.setState(
            {
                showLeft: !this.state.showLeft
            },
            () => {
                this.flowChart.resize()
            }
        )
    }
    showRightHandle = () => {
        this.setState(
            {
                showRight: !this.state.showRight
            },
            () => {
                this.flowChart.resize()
            }
        )
    }
    render() {
        const { showRight, showLeft } = this.state
        // const classInfomation = this.props.processStore.classInfomation
        // const dagWidth = showRight ? 'calc(100% - 400px)' : '100%'
        // console.log(classInfomation, 'classInfomation')
        return (
            <div className={styles.container}>
                <header>
                    <Breadcrumb className={styles.breadcrumbBlock} separator=">">
                        <Breadcrumb.Item
                            className={styles.breadcrumbRoute}
                            onClick={() => this.props.history.push('/ProcessManagement')}>
                            流程管理
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>xxx流程画布</Breadcrumb.Item>
                    </Breadcrumb>
                    <Button type="primary">调度设置</Button>
                </header>
                <article
                    style={{
                        paddingLeft: showLeft ? '256px' : '0',
                        paddingRight: showRight ? '400px' : '0'
                    }}>
                    <div className={classnames(styles.column, styles.center)}>
                        <DAGTemplate
                            onDagDidMount={this.onDagDidMount}
                            onDagDidUnmount={this.onDagDidUnmount}
                            style={{ width: '100%', height: '100%' }}
                        />
                        <Popover content={showLeft ? '收起' : '展开'} placement="right">
                            <div
                                className={classnames(styles.toggleLeft, { [styles.toggleShowLeft]: !showLeft })}
                                onClick={() => this.showLeftHandle()}></div>
                        </Popover>
                        <Popover content={showRight ? '收起' : '展开'} placement="left">
                            <div
                                className={classnames(styles.toggleRight, {
                                    [styles.toggleShowRight]: !showRight,
                                    [styles.toggleFoldRight]: showRight
                                })}
                                onClick={() => this.showRightHandle()}></div>
                        </Popover>
                    </div>
                    <aside
                        className={classnames(styles.column, styles.left)}
                        style={{
                            display: showLeft ? 'inherit' : 'none'
                        }}>
                        创建任务
                    </aside>
                    <div
                        className={classnames(styles.column, styles.right)}
                        style={{
                            display: showRight ? 'inherit' : 'none'
                        }}>
                        设置
                    </div>
                </article>
            </div>
        )
    }
}
export default withRouter(ProcessDetail)
