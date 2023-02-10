import React from 'react'
import styles from '../index.less'
import { Popover } from 'antdForHik'
import { InfoCircleOutlined } from '@ant-design/icons'

class StatisticsBar extends React.PureComponent {
    renderStatisticsBar = () => {
        const { statistics } = this.props
        let res = []
        statistics.forEach((item, index) => {
            res.push(
                <div className={styles.statisticsCard}>
                    <div>
                        <span className={styles.stCardFigure}>{item.figure}</span>
                        {typeof item.popover === 'string' && (
                            <Popover content={item.popover}>
                                <InfoCircleOutlined className={styles.statisticsIcon} />
                            </Popover>
                        )}
                    </div>
                    <div>{item.attribute}</div>
                </div>
            )
            if (index < statistics.length - 1) {
                res.push(<div className={styles.seperator}></div>)
            }
        })
        return res
    }

    render() {
        return (
            <div className={styles.statisticsBar}>
                {this.renderStatisticsBar()}
                {/* <div className={styles.statisticsCard}>1</div>
                <div className={styles.seperator}></div>
                <div className={styles.statisticsCard}>2</div>
                <div className={styles.seperator}></div>
                <div className={styles.statisticsCard}>3</div> */}
            </div>
        )
    }
}

export default StatisticsBar
