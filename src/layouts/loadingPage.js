import React from 'react'
import styles from './index.less'
import { Spin } from 'antdForHik'
const NotFoundPage = () => {
    return (
        <div className={styles.loadingPage}>
            <Spin tip={'页面加载中...'} />
        </div>
    )
}
export default NotFoundPage
