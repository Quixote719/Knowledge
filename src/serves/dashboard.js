import fetchProxy from '@/utils/fetchProxy'
import { getProjectId } from '@/utils/auth'
// 查询流程列表
export const getDashboardStatistics = async params => {
    return fetchProxy(`/api/v1/project/${getProjectId()}/resource/statistics`, {
        method: 'get',
        payload: params
    })
}

export const getProcessTotal = async params => {
    return fetchProxy(`/api/v1/project/${getProjectId()}/process/total`, {
        method: 'get',
        payload: params
    })
}

export const getInstanceTotal = async params => {
    return fetchProxy(`/api/v1/project/${getProjectId()}/process/instance/total`, {
        method: 'get',
        payload: params
    })
}

export const getInstanceStatistics = async params => {
    return fetchProxy(`/api/v1/project/${getProjectId()}/process/instance/status/statistics`, {
        method: 'get',
        payload: params
    })
}
