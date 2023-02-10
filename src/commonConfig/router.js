import React, { lazy, Suspense } from 'react'
import Loading from '@/layouts/loadingPage'

export const routerConfig = {
    // Dashboard
    financeDashboard: {
        path: '/FinanceDashboard',
        exact: true,
        component: lazy(() => import(/* webpackChunkName: "financeDashboard" */ '@/pages/financeDashboard'))
    },
    // 项目管理
    projectManage: {
        path: '/ProjectManage',
        exact: true,
        component: lazy(() =>
            import(/* webpackChunkName: "operationManagement" */ '@/pages/projectManagement/projectIntroduction')
        ),
        // 子路由示例
        children: [
            {
                path: '/ProjectManage/ProjectListPage',
                exact: true,
                component: lazy(() =>
                    import(/* webpackChunkName: "operationManagement" */ '@/pages/projectManagement/projectListPage')
                )
            },
            {
                path: '/ProjectManage/createProject',
                exact: true,
                component: lazy(() =>
                    import(/* webpackChunkName: "operationManagement" */ '@/pages/projectManagement/createProject')
                )
            }
        ]
    },
    // 实例管理
    instanceManage: {
        path: '/InstanceManage',
        exact: true,
        component: lazy(() => import(/* webpackChunkName: "instanceManage" */ '@/pages/instanceManagement')),
        children: [
            {
                path: '/InstanceManage/instanceDetail',
                exact: true,
                component: lazy(() =>
                    import(/* webpackChunkName: "instanceManage" */ '@/pages/instanceManagement/instanceDetail')
                )
            }
        ]
    },
    // 运维管理
    operationManage: {
        path: '/OperationManage',
        exact: true,
        component: lazy(() => import(/* webpackChunkName: "operationManagement" */ '@/pages/operationManagement'))
    },
    // 流程管理
    processManagement: {
        path: '/ProcessManagement',
        exact: true,
        component: lazy(() => import(/* webpackChunkName: "processManagement" */ '@/pages/processManagement')),
        children: [
            {
                path: '/ProcessManagement/detail',
                exact: true,
                component: lazy(() =>
                    import(
                        /* webpackChunkName: "operationManagement" */ '@/pages/processManagement/processDetail/index'
                    )
                )
            }
        ]
    }
}

export const SuspenseLoading = props => {
    const { Component } = props
    return (
        <Suspense fallback={<Loading />}>
            <Component />
        </Suspense>
    )
}
