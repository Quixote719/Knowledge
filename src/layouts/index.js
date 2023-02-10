import React, { useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Popover } from 'antdForHik'
import { routerConfig } from '@/commonConfig/router'

import logo from '@/assets/img/logo.svg'
import ArrowDownIcon from '@/assets/img/common_angle_down_sm.svg'
import UserIcon from '@/assets/img/common_user.svg'
import UserEdit from '@/assets/img/common_edit.svg'
import UserExport from '@/assets/img/common_export.svg'
import PageSider from './PageSider'
import { HOME_PAGE } from '@/constants'

import styles from './index.less'

const { Header, Content } = Layout

// 设置需要显示sider的页面url
export const needSiderPage = [
    routerConfig.operationManage.path,
    routerConfig.financeDashboard.path,
    routerConfig.processManagement.path,
    routerConfig.instanceManage.path
]

const Home = React.memo(props => {
    const pathname = props?.location?.pathname
    const showSider = needSiderPage.find(item => pathname?.includes(item))

    const jumpToHome = useCallback(() => {
        if (!pathname.startsWith(HOME_PAGE)) {
            props.history.push(HOME_PAGE)
        }
    }, [pathname, props.history])
    return (
        <Layout className={styles.container}>
            <Header className={styles.header}>
                <div>
                    <img onClick={jumpToHome} src={logo} alt="logo" className={styles.logo} />
                    <span className={styles.title}>金融算法引擎</span>
                </div>
                <Popover
                    title={null}
                    trigger="click"
                    overlayClassName={styles.projPopover}
                    placement="bottom"
                    content={
                        <ul>
                            <li>
                                <img src={UserEdit} alt={'edit'} /> 修改密码
                            </li>
                            <li>
                                <img src={UserExport} alt={'export'} /> 退出登录
                            </li>
                        </ul>
                    }>
                    <div className={`${styles.rightItem}`}>
                        <img src={UserIcon} alt={'user'} />
                        张三 <img src={ArrowDownIcon} alt={'arrowDown'} />
                    </div>
                </Popover>
            </Header>
            <Layout>
                {showSider && <PageSider />}
                <Content className={styles.content}>{props.children}</Content>
            </Layout>
        </Layout>
    )
})

export default withRouter(Home)
