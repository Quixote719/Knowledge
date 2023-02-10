import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { createBrowserHistory } from 'history'

// 定义routerStore
const browserHistory = createBrowserHistory()
const routerStore = new RouterStore()
const history = syncHistoryWithStore(browserHistory, routerStore)

export { routerStore, history }
