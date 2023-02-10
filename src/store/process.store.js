import { observable } from 'mobx'

import * as processAPI from '@/serves/process'
import { testData, classInfomation } from './dagTestData'
class ProcessStore {
    // 流程列表
    @observable
    processList = []
    // 当前流程画布
    @observable
    currentDag = testData
    // 任务种类
    @observable
    classInfomation = classInfomation
    // 获取流程列表
    getProcessLists(params = {}, callBack) {
        this.fetchDataLoading = true
        processAPI.getProcessLists(params).then(res => {
            if (res?.data?.list) {
                this.processList = res?.data?.list
            }
            if (callBack) {
                callBack()
            }
        })
    }
}

const processStore = new ProcessStore()

export default processStore
