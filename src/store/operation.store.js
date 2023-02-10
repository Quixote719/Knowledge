import { observable, makeObservable } from 'mobx'

import * as operationAPI from '@/serves/operation'
class OperationStore {
    constructor() {
        // 添加makeObservable, mobx 6.0需要添加此代码才能触发视图渲染
        makeObservable(this)
    }
    @observable yarnConfig = null
    @observable kubernetesConfig = null

    getYarnConfig(params = {}, callBack) {
        operationAPI.getYarnConfig(params).then(res => {
            if (res?.data) {
                this.yarnConfig = res?.data
            }
            if (callBack) {
                callBack()
            }
        })
    }

    getKubernetesConfig(params = {}, callBack) {
        operationAPI.getKubernetesConfig(params).then(res => {
            if (res?.data) {
                this.kubernetesConfig = res?.data
            }
            if (callBack) {
                callBack()
            }
        })
    }
}

const operationStore = new OperationStore()

export default operationStore
