import React, { useCallback, useState } from 'react'
import { Layout, Menu } from 'antdForHik'
import { withRouter } from 'react-router-dom'
import styles from './PageSider.less'
import { routerConfig } from '@/commonConfig/router'
import fold from '@/assets/img/fold.svg'
import open from '@/assets/img/open.svg'
import dashboard from '@/assets/img/nav_dashboard.svg'
import instance from '@/assets/img/nav_instance.svg'
import process from '@/assets/img/nav_process.png'
import operation from '@/assets/img/nav_operation.svg'

const { Sider } = Layout

const menuMap = [
    {
        key: 'FinanceDashboard',
        text: 'Dashboard',
        path: routerConfig.financeDashboard.path,
        icon: <img src={dashboard} alt="dashboard" />
    },
    {
        key: 'InstanceManagement',
        text: '实例管理',
        path: routerConfig.instanceManage.path,
        icon: <img src={instance} alt="instanceManagement" />
    },
    {
        key: 'ProcessManagement',
        text: '流程管理',
        path: routerConfig.processManagement.path,
        icon: <img src={process} alt="processManagement" />
    },
    {
        key: 'OperationManage',
        text: '运维管理',
        path: routerConfig.operationManage.path,
        icon: <img src={operation} alt="operationManage" />
    }
]

const PageSider = props => {
    const pathname = props?.history?.location?.pathname || ''
    const selectedKeys = menuMap.findIndex(item => pathname?.includes(item.path))
    const [collapsed, setCollapsed] = useState(false)
    const handleCollapsed = useCallback(() => {
        setCollapsed(!collapsed)
    }, [collapsed])

    const handleJump = useCallback(
        path => {
            if (!pathname?.includes(path)) {
                props.history.push(path)
            }
            return
        },
        [pathname, props?.history]
    )

    return (
        <Sider collapsible className={styles.sider} trigger={null} collapsed={collapsed}>
            <Menu mode="inline" selectedKeys={selectedKeys >= 0 ? [menuMap[selectedKeys]?.key] : ['fold']}>
                <Menu.Item
                    key="fold"
                    onClick={handleCollapsed}
                    icon={<img src={collapsed ? open : fold} alt="logo" />}></Menu.Item>
                {menuMap.map(item => {
                    return (
                        <Menu.Item
                            key={item.key}
                            onClick={() => handleJump(item.path)}
                            icon={item.icon}
                            title={item.text}>
                            {!collapsed && item.text}
                        </Menu.Item>
                    )
                })}
            </Menu>
        </Sider>
    )
}

export default withRouter(PageSider)
