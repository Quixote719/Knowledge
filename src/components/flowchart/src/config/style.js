//===================================
//不可连接主色 红色  由高到低
const unConnectAbelColor = '#B22222'
//已连接主色 绿色
const connectedColor = '#009E49'
//可连接主色 绿色
const connectAbelColor = '#009E49'
//选中（高亮）深蓝色
const selectedColor = '#2086BF'
//鼠标移上 深灰色
const mouseMoveedColor = '#808080'
//正常状态 浅灰色
const normalColor = '#B3B3B3'
//深灰色
const darkColor = '#888888'
//=====================================
//背景色 常规
const backgroundNormalColor = '#22252E'
//常规渐变色
const gradientNormal = [125, 0, '#32BAFF', 0.97, '#4E6DFF']
//节点样式
const nodeStyle = {
    //eWidth:300,//宽
    //eHeight:53,//高
    eWidth: 160, //宽
    eHeight: 36, //高
    radius: 6, //节点的圆角的大小
    image: {
        offsetX: 8,
        offsetY: 10,
        size: 16,
        //前缀和后缀
        urlPrefix: window.basename + '/img/menutype/', //dag_icon_
        urlSuffix: '.png' //svg
    },
    text: {
        offsetX: 32,
        offsetY: 23,
        textLength: 110,
        //添加显示的缩放值。当大于scaleNum值时才显示文字
        isScaleShow: true,
        scaleNum: 0.1,
        style: {
            font: '14px PingFangSC-Regular',
            lineWidth: 1.0,
            fillStyle: '#FFFFFF'
        }
    },
    statusImg: {
        size: 14,
        urlPrefix: window.basename + '/img/status/status-',
        urlSuffix: '.svg',
        left: 140,
        top: 12
    },
    status: {
        //不可连接
        unConnectAbel: {
            lineWidth: 6,
            strokeStyle: unConnectAbelColor,
            fillStyle: backgroundNormalColor,
            lineDash: []
        },
        //已连接
        connected: {
            lineWidth: 6,
            strokeStyle: connectedColor,
            fillStyle: backgroundNormalColor,
            lineDash: []
        },
        //可连接
        connectAbel: {
            lineWidth: 6,
            strokeStyle: connectAbelColor,
            fillStyle: backgroundNormalColor,
            lineDash: [10, 3]
        },
        //选中（高亮）
        selected: {
            lineWidth: 6,
            strokeStyle: gradientNormal,
            fillStyle: '#000000',
            lineDash: []
        },
        //鼠标移上
        mouseMoveed: {
            lineWidth: 6,
            strokeStyle: gradientNormal,
            fillStyle: '#000000',
            lineDash: []
        },
        //正常状态
        normal: {
            lineWidth: 2,
            strokeStyle: gradientNormal,
            fillStyle: backgroundNormalColor,
            lineDash: []
        }
    }
}
//输出接口样式，借用了上面的颜色
const outPortStyle = {
    //无数字时的圆的半径
    normalRadius: 3,
    //有数字时的圆的半径
    numberRadius: 7,
    //number的位置设置没用 drawPortNum方法里面-numberRadius/3
    //numberleft:1,
    //numbertop:1,
    //是否显示number，默认为true
    isNumber: true,
    //上三角时的宽,使用坐标-arrayWidth/2
    arrowWidth: 10,
    //上三角时的垂直高度
    arrowHeight: -7,
    //形状样式 输出默认使用圆
    shape: {
        connect: 'circle',
        unConnect: 'circle'
    },
    //填充样式
    status: {
        //被选中且鼠标移上
        selectedMouseMoveed: {
            lineWidth: 2,
            strokeStyle: '#FFFFFF',
            fillStyle: backgroundNormalColor,
            lineDash: [],
            font: {
                font: '7px Palatino',
                lineWidth: 1.0,
                fillStyle: '#FFFFFF'
            }
        },
        //只是选中没有鼠标移上
        selected: {
            lineWidth: 2,
            strokeStyle: '#FFFFFF',
            fillStyle: '#000000',
            lineDash: [],
            font: {
                font: '7px Palatino',
                lineWidth: 1.0,
                fillStyle: '#FFFFFF'
            }
        },
        //只是鼠标移上
        mouseMoveed: {
            lineWidth: 2,
            strokeStyle: '#FFFFFF',
            fillStyle: backgroundNormalColor,
            lineDash: [],
            font: {
                font: '7px Palatino',
                lineWidth: 1.0,
                fillStyle: '#FFFFFF'
            }
        },
        //拉线未连接不可连接状态
        unConnectAbel: {
            lineWidth: 1,
            strokeStyle: normalColor,
            fillStyle: unConnectAbelColor,
            lineDash: []
        },
        //拉线未连接可连接状态
        connectAbel: {
            lineWidth: 1,
            strokeStyle: normalColor,
            fillStyle: connectAbelColor,
            lineDash: []
        },
        //连接状态未拉线状态
        connected: {
            lineWidth: 0.00001,
            strokeStyle: normalColor,
            //数组则表示是个渐变的 从正北开始为0的[-180,180]
            fillStyle: gradientNormal,
            lineDash: []
        },
        /*
        //节点被移动上或选中
        nodeMoveOrSelected:{
            lineWidth:1,
            strokeStyle:mouseMoveedColor,
            fillStyle:backgroundNormalColor,
            lineDash:[]
        },
        //未连接未拉线状态，初始状态
        normal:{
            lineWidth:1,
            strokeStyle:'rgba(0,0,0,0)',
            fillStyle:'rgba(0,0,0,0)',
            lineDash:[]
        },
        */
        //未连接未拉线状态，初始状态，新样式使用填充为渐变色无框
        normal: {
            lineWidth: 1,
            strokeStyle: gradientNormal,
            fillStyle: backgroundNormalColor,
            lineDash: []
        }
    }
}
//输入接口样式，借用了上面的颜色
const inPortStyle = {
    //无数字时的圆的半径
    normalRadius: 3,
    //有数字时的圆的半径
    numberRadius: 7,
    //是否显示number
    isNumber: true,
    //下三角时的宽,使用坐标-arrayWidth/2
    arrowWidth: 7,
    //下三角时的垂直高度
    arrowHeight: 6,
    //形状样式 连接默认使用下三角
    shape: {
        connect: 'arrow',
        unConnect: 'circle'
    },
    status: {
        //鼠标移上 渲染使用文字
        mouseMoveed: {
            lineWidth: 2,
            strokeStyle: '#FFFFFF',
            fillStyle: backgroundNormalColor,
            lineDash: [],
            font: {
                font: '7px Palatino',
                lineWidth: 1.0,
                fillStyle: '#FFFFFF'
            }
        },
        //拉线未连接不可连接状态 selected
        unConnectAbel: {
            lineWidth: 1,
            strokeStyle: normalColor,
            fillStyle: unConnectAbelColor,
            lineDash: []
        },
        //拉线未连接可连接状态
        connectAbel: {
            lineWidth: 1,
            strokeStyle: normalColor,
            fillStyle: connectAbelColor,
            lineDash: []
        },
        //连接状态未拉线状态
        connected: {
            lineWidth: 1,
            strokeStyle: gradientNormal,
            fillStyle: gradientNormal,
            lineDash: []
        },
        /*
        //节点被移动上或选中
        nodeMoveOrSelected:{
            lineWidth:1,
            strokeStyle:mouseMoveedColor,
            fillStyle:backgroundNormalColor,
            lineDash:[]
        },
        //未连接未拉线状态，初始状态
        normal:{
            lineWidth:1,
            strokeStyle:'rgba(0,0,0,0)',
            fillStyle:'rgba(0,0,0,0)',
            lineDash:[]
        },
        */
        //未连接未拉线状态，初始状态
        normal: {
            lineWidth: 1,
            strokeStyle: gradientNormal,
            fillStyle: backgroundNormalColor,
            lineDash: []
        }
    }
}
//连接线
const linkStyle = {
    shape: {
        connected: 'bezierCurve', //曲线
        unConnect: 'straightLine' //直线 用于未连接的测试连接
    },
    status: {
        //选中状态
        selected: {
            lineWidth: 2,
            strokeStyle: '#FFFFFF',
            lineDash: []
        },
        //正常连接状态
        normal: {
            lineWidth: 1,
            strokeStyle: '#00A7FC', //加重的深灰
            lineDash: []
        }
    }
}
//画布名称样式
const canvasName = {
    //左上角位置
    left: 20,
    top: 30,
    //最长显示的长度，超出则省略
    lengthMax: 280,
    textHeight: 14,
    textStyle: {
        font: 'bold 14px MicrosoftYaHei-Bold',
        lineWidth: 2.0,
        fillStyle: '#1A1A1A'
    }
}
export { nodeStyle, linkStyle, inPortStyle, outPortStyle, canvasName }
