import { observable, makeObservable } from 'mobx'

import * as instanceAPI from '@/serves/instance'
class InstanceStore {
    constructor() {
        // 添加makeObservable, mobx 6.0需要添加此代码才能触发视图渲染
        makeObservable(this)
    }
    @observable
    instanceList = []
    @observable
    curProject = null

    getinstanceLists(params = {}, callBack) {
        this.fetchDataLoading = true
        instanceAPI.getInstanceLists(params).then(res => {
            console.warn('res', res)
            if (res?.list) {
                this.instanceList = res?.list
            }
            if (callBack) {
                callBack()
            }
        })
    }
}

const instanceStore = new InstanceStore()

export default instanceStore
