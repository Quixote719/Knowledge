import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Provider } from 'mobx-react'
import ReactDOM from 'react-dom'
import Layout from '@/layouts/index'
import { history } from '@/store/router.store.js'
import store from '@/store/index'
import { routerConfig, SuspenseLoading } from '@/commonConfig/router.js'
import { flatTree } from '@/utils/index'
import NotFoundPage from '@/layouts/notFoundPage'
import Login from '@/pages/login'
import { setUserProjectInfo } from '@/utils/auth'

import { BASENAME, HOME_PAGE } from '@/constants'
import './index.less'

const mapRouter = (array = []) => {
    return array.map(item => {
        return (
            <Route exact={item?.exact} path={item?.path} key={item?.path}>
                <SuspenseLoading Component={item?.component} />
            </Route>
        )
    })
}

const App = () => {
    const routers = Object.values(routerConfig)
    setUserProjectInfo('f7b4c2e8ad684bcb81927febe304a3b4')
    return (
        <BrowserRouter basename={BASENAME} history={history}>
            <Switch>
                <Route exact path="/404" component={NotFoundPage} />
                <Route exact path="/Login" component={Login} />
                <Layout needSiderPage={[]}>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to={HOME_PAGE} />
                        </Route>
                        {mapRouter(flatTree(routers))}
                        <Redirect to="/404" />
                    </Switch>
                </Layout>
            </Switch>
        </BrowserRouter>
    )
}

ReactDOM.render(
    <Provider {...store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
)
