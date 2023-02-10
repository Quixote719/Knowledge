import fetchProxy from '@/utils/fetchProxy'
import { getProjectId } from '@/utils/auth'
// 查询流程列表
export const getYarnConfig = async params => {
    return fetchProxy(`/api/v1/project/${getProjectId()}/yarn/resource/config/get`, {
        method: 'get',
        payload: params
    })
}

export const getKubernetesConfig = async params => {
    return fetchProxy(`/api/v1/project/${getProjectId()}/kubernetes/resource/config/get`, {
        method: 'get',
        payload: params
    })
}
