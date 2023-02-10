import { observable } from 'mobx'

import * as dashboardAPI from '@/serves/dashboard'
class DashboardStore {
    @observable
    resourceStatistics = {}
    @observable
    processTotal = {}
    @observable
    InstanceTotal = {}
    @observable
    instanceStatistics = {}

    getdashboardLists(params = {}, callBack) {
        dashboardAPI.getDashboardStatistics(params).then(res => {
            console.warn('res', res)
            if (res?.data) {
                this.resourceStatistics = res?.data
            }
            if (callBack) {
                callBack()
            }
        })
    }

    getProcessTotal(params = {}, callBack) {
        dashboardAPI.getProcessTotal(params).then(res => {
            console.warn('res', res)
            if (res?.data) {
                this.processTotal = res?.data
            }
            if (callBack) {
                callBack()
            }
        })
    }

    getInstanceTotal(params = {}, callBack) {
        dashboardAPI.getInstanceTotal(params).then(res => {
            console.warn('res', res)
            if (res?.data) {
                this.InstanceTotal = res?.data
            }
            if (callBack) {
                callBack()
            }
        })
    }

    getInstanceStatistics(params = {}, callBack) {
        dashboardAPI.getInstanceStatistics(params).then(res => {
            console.warn('res', res)
            if (res?.data) {
                this.instanceStatistics = res?.data
            }
            if (callBack) {
                callBack()
            }
        })
    }
}

const dashboardStore = new DashboardStore()

export default dashboardStore
