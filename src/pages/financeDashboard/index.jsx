import React from 'react'
import StatisticsBar from './components/statisticsBar'
import { inject } from 'mobx-react'
import ReactEcharts from 'echarts-for-react'
import { Checkbox } from 'antdForHik'
import styles from './index.less'

class financeDashboard extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount = () => {
        const { dashboardStore } = this.props
        dashboardStore.getdashboardLists()
        dashboardStore.getProcessTotal()
        dashboardStore.getInstanceTotal()
        dashboardStore.getInstanceStatistics()
    }
    getOption() {
        let barModeSettings = [
            {
                name: '成功',
                type: 'bar',
                barCategoryGap: '55%',
                itemStyle: { barBorderRadius: [5] },
                data: [43, 25, 19, 48, 55, 42, 7]
            },
            {
                name: '等待',
                type: 'bar',
                barCategoryGap: '55%',
                itemStyle: { barBorderRadius: [5] },
                data: [17, 98, 32, 66, 77, 49, 18]
            },
            {
                name: '失败',
                type: 'bar',
                barCategoryGap: '55%',
                itemStyle: { barBorderRadius: [5] },
                data: [32, 75, 24, 41, 34, 74, 30]
            }
        ]
        let lineModeSettings = [
            {
                name: '成功',
                type: 'line',
                data: [43, 25, 19, 48, 55, 42, 7]
            },
            {
                name: '等待',
                type: 'line',
                data: [17, 98, 32, 66, 77, 49, 18]
            },
            {
                name: '失败',
                type: 'line',
                data: [32, 75, 24, 41, 34, 74, 30]
            }
        ]
        let opt = {
            color: ['#02BF0F', '#2949F0', '#F73748'],
            tooltip: {},
            textStyle: {
                fontSize: 14,
                // fontWeight: 'bolder',
                color: '#9A9A9A' // 主标题文字颜色
            },
            subtextStyle: {
                color: '#9A9A9A' // 副标题文字颜色
            },
            bar: {
                itemStyle: {
                    normal: {
                        // color: '各异',
                        barBorderColor: '#9A9A9A', // 柱条边线
                        barBorderRadius: 7
                    }
                }
            },
            legend: {
                itemGap: 70,
                data: ['成功', '等待', '失败'],
                textStyle: {
                    color: '#B4B4B4' // 图例文字颜色
                }
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    lineStyle: { color: ['#555555'] }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#555555'],
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            yAxis: {
                axisLine: {
                    lineStyle: { color: ['#555555'] }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#555555'],
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            series: this.state.lineModeChart ? lineModeSettings : barModeSettings
        }
        return opt
    }

    onChartClick = param => {
        console.warn(param)
    }

    chartModeChange = e => {
        this.setState({ lineModeChart: e.target.checked })
    }

    onEvents = {
        click: this.onChartClick.bind(this)
    }

    render() {
        let statisticsArray = [
            { attribute: '流程总数', figure: 21, popover: '统计已启用的流程' },
            { attribute: '流程实例总数', figure: 150, popover: '统计已启用的流程' },
            { attribute: 'Yarn 内存', figure: 36, popover: '统计已启用的流程' },
            { attribute: 'Yarn CPU', figure: 18, popover: '统计已启用的流程' },
            { attribute: 'Kubernetes 内存', figure: 12, popover: '统计已启用的流程' },
            { attribute: 'Kubernetes CPU', figure: 8, popover: '统计已启用的流程' }
        ]
        return (
            <div>
                <div className={styles.dashBoardTopSection}>
                    <StatisticsBar statistics={statisticsArray} />
                </div>
                <div className={styles.bottomSection}>
                    <div className={styles.chartTitle}>七日流程状态实例统计</div>
                    <div className={styles.trendSwitchBlock}>
                        <Checkbox size="small" className={styles.trendSwitch} onChange={this.chartModeChange} />
                        <div className={styles.trendSwitchTitle}>趋势线</div>
                    </div>
                    <ReactEcharts
                        option={this.getOption()}
                        notMerge={true}
                        lazyUpdate={true}
                        onEvents={this.onEvents}
                        style={{ width: '100%', minHeight: 'calc(100vh - 420px)' }}
                    />
                </div>
            </div>
        )
    }
}

export default inject('dashboardStore')(financeDashboard)
