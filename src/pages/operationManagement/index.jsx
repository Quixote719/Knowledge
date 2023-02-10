import React from 'react'
import styles from './index.less'
import { Tabs } from 'antdForHik'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import ReactEcharts from 'echarts-for-react'

const { TabPane } = Tabs
@inject('operationStore')
@observer
class OperationManage extends React.PureComponent {
    componentDidMount() {
        const { operationStore } = this.props
        operationStore.getYarnConfig()
        operationStore.getKubernetesConfig()
    }
    getMemoryOption = params => {
        const { operationStore } = this.props
        const { yarnConfig, kubernetesConfig } = operationStore
        let resStatistics = params === 'Hadoop' ? yarnConfig?.resourceStatistics : kubernetesConfig?.resourceStatistics
        let usedMemory = resStatistics.usedMemory,
            availableMemory = resStatistics.totalMemory - resStatistics.usedMemory
        let opt = {
            color: ['#3957F1', '#ABAFBA'],
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: 10,
                data: ['可用内存', '已用内存'],
                selectedMode: false,
                textStyle: {
                    color: '#B4B4B4', // 图例文字颜色
                    fontSize: 14
                },
                formatter: name => {
                    let legendMap = { 已用内存: usedMemory, 可用内存: availableMemory }
                    return `${name}   ${legendMap[name]}`
                }
            },
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    top: '44%',
                    style: {
                        text: ['总内存', usedMemory + availableMemory].join('\n'),
                        fill: '#BBBBBB',
                        width: 30,
                        height: 30,
                        fontSize: 18,
                        fontWeight: 500,
                        textAlign: 'center'
                    }
                }
            ],
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['35%', '52%'],
                    avoidLabelOverlap: false,
                    formatter: '总内存',
                    label: {
                        normal: {
                            show: false,
                            formatter: ['', '  {b}  ', '  {c}  '].join('\n')
                        },
                        emphasis: {
                            show: true,
                            fontSize: 17
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {
                            value: availableMemory,
                            name: '可用内存'
                        },
                        {
                            value: usedMemory,
                            name: '已用内存'
                        }
                    ]
                }
            ]
        }
        return opt
    }

    getCoreOption = params => {
        const { operationStore } = this.props
        const { yarnConfig, kubernetesConfig } = operationStore
        let resStatistics = params === 'Hadoop' ? yarnConfig?.resourceStatistics : kubernetesConfig?.resourceStatistics
        let usedCore = resStatistics.usedCore,
            availableCore = resStatistics.totalCores - resStatistics.usedCore
        let opt = {
            color: ['#FF753A', '#ABAFBA'],
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: 10,
                data: ['可用核数', '已用核数'],
                selectedMode: false,
                textStyle: {
                    color: '#B4B4B4', // 图例文字颜色
                    fontSize: 14
                },
                formatter: name => {
                    let legendMap = { 已用核数: usedCore, 可用核数: availableCore }
                    return `${name}   ${legendMap[name]}`
                }
            },
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    top: '44%',
                    style: {
                        text: ['总核数', usedCore + availableCore].join('\n'),
                        fill: '#BBBBBB',
                        width: 30,
                        height: 30,
                        fontSize: 18,
                        fontWeight: 500,
                        textAlign: 'center'
                    }
                }
            ],
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['35%', '52%'],
                    avoidLabelOverlap: false,
                    formatter: '总核数',
                    label: {
                        normal: {
                            show: false,
                            formatter: ['', '  {b}  ', '  {c}  '].join('\n')
                        },
                        emphasis: {
                            show: true,
                            fontSize: 17
                            // fontWeight: 'bold'
                        }
                    },

                    labelLine: {
                        show: false
                    },
                    data: [
                        {
                            value: availableCore,
                            name: '可用核数'
                        },
                        {
                            value: usedCore,
                            name: '已用核数'
                        }
                    ]
                }
            ]
        }
        return opt
    }

    tabChange = tab => {
        console.warn('tab', tab)
    }

    onChartClick = param => {
        console.warn(param)
    }

    onEvents = {
        click: this.onChartClick.bind(this)
    }

    renderYarnConfig = () => {
        const { operationStore } = this.props
        const { yarnConfig = {} } = operationStore
        const { hadoopConfig = {} } = yarnConfig
        console.warn('hadoopConfig', hadoopConfig)
        return (
            <div>
                <div>
                    <div className={styles.sectionTitle}>资源配置</div>
                    <div className={styles.configFlexBox}>
                        {Object.keys(hadoopConfig).map(key => {
                            if (typeof hadoopConfig[key] === 'string') {
                                return (
                                    <div className={styles.configBox}>
                                        <div>{key}</div>
                                        <div className={styles.configBoxContent}>{hadoopConfig[key]}</div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
                <div>
                    <div className={styles.sectionTitle}>Yarn</div>
                    <div className={styles.configFlexBox}></div>
                </div>
                <div>
                    <div className={styles.sectionTitle}>HDFS</div>
                    <div className={styles.configFlexBox}></div>
                </div>
            </div>
        )
    }

    renderKubernetesConfig = () => {
        const { operationStore } = this.props
        const { kubernetesConfig } = operationStore
        return (
            <div>
                <div>
                    <div>资源配置</div>
                    <div className={styles.configFlexBox}></div>
                </div>
                <div>
                    <div>Yarn</div>
                    <div className={styles.configFlexBox}></div>
                </div>
                <div>
                    <div>HDFS</div>
                    <div className={styles.configFlexBox}></div>
                </div>
            </div>
        )
    }
    renderTabSection = () => {
        const { operationStore } = this.props
        const { yarnConfig, kubernetesConfig } = operationStore
        console.warn('yarnConfig', toJS(yarnConfig), 'kubernetesConfig', toJS(kubernetesConfig))
        return (
            <Tabs className={styles.tabSpace} defaultActiveKey="Yarn" onChange={this.tabChange}>
                <TabPane tab="Hadoop集群" key="Yarn">
                    {yarnConfig && (
                        <div className={styles.chartSpace}>
                            <div className={styles.chartBlock}>
                                <div className={styles.chartTitle}>Yarn资源内存使用情况</div>
                                <ReactEcharts
                                    option={this.getMemoryOption('Hadoop')}
                                    notMerge={true}
                                    lazyUpdate={true}
                                    onEvents={this.onEvents}
                                    style={{ width: '100%', minHeight: 'calc(100vh - 700px)' }}
                                />
                            </div>
                            <div className={styles.chartBlock}>
                                <div className={styles.chartTitle}>Yarn资源CPU使用情况</div>
                                <ReactEcharts
                                    option={this.getCoreOption('Hadoop')}
                                    notMerge={true}
                                    lazyUpdate={true}
                                    onEvents={this.onEvents}
                                    style={{ width: '100%', minHeight: 'calc(100vh - 700px)' }}
                                />
                            </div>
                        </div>
                    )}

                    {yarnConfig && this.renderYarnConfig()}
                </TabPane>
                <TabPane tab="Kubernetes集群" key="Kubernetes">
                    {kubernetesConfig && (
                        <div className={styles.chartSpace}>
                            <div className={styles.chartBlock}>
                                <div className={styles.chartTitle}>Kubernetes资源内存使用情况</div>
                                <ReactEcharts
                                    option={this.getMemoryOption('Kubernetes')}
                                    notMerge={true}
                                    lazyUpdate={true}
                                    onEvents={this.onEvents}
                                    style={{ width: '100%', minHeight: 'calc(100vh - 700px)' }}
                                />
                            </div>
                            <div className={styles.chartBlock}>
                                <div className={styles.chartTitle}>Kubernetes资源CPU使用情况</div>
                                <ReactEcharts
                                    option={this.getCoreOption('Kubernetes')}
                                    notMerge={true}
                                    lazyUpdate={true}
                                    onEvents={this.onEvents}
                                    style={{ width: '100%', minHeight: 'calc(100vh - 700px)' }}
                                />
                            </div>
                        </div>
                    )}
                    {kubernetesConfig && this.renderKubernetesConfig()}
                </TabPane>
            </Tabs>
        )
    }
    render() {
        return (
            <div className={styles.contentSection}>
                <div>{this.renderTabSection()}</div>
            </div>
        )
    }
}

export default inject('operationStore')(OperationManage)
