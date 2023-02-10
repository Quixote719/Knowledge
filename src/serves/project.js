import fetchProxy from '@/utils/fetchProxy'
import { getProjectId } from '@/utils/auth'

// 查询流程列表
const getProjectLists = async params => {
    return fetchProxy(`/api/v1/project/search`, {
        method: 'post',
        payload: params
    })
}

const getProjectDetail = async params => {
    return fetchProxy(`/api/v1/project/${getProjectId()}/get`, {
        method: 'get',
        payload: params
    })
}

export { getProjectLists, getProjectDetail }
