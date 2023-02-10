import { observable, makeObservable } from 'mobx'

import * as projectAPI from '@/serves/project'
class ProjectStore {
    constructor() {
        // 添加makeObservable, mobx 6.0需要添加此代码才能触发视图渲染
        makeObservable(this)
    }
    @observable
    projectList = []
    @observable
    projectDetail = {}

    getprojectLists(params = {}, callBack) {
        projectAPI.getProjectLists(params).then(res => {
            if (res?.list) {
                this.projectList = res?.list
            }
            if (callBack) {
                callBack()
            }
        })
    }

    getprojectDetail(params = {}, callBack) {
        projectAPI.getProjectDetail(params).then(res => {
            if (res?.data) {
                this.projectDetail = res.data
            }
            if (callBack) {
                callBack()
            }
        })
    }
}

const projectStore = new ProjectStore()

export default projectStore
