import fetchProxy from '@/utils/fetchProxy'
import { getProjectId } from '@/utils/auth'
// 查询流程列表
export const getInstanceLists = async params => {
    return fetchProxy(`/api/v1/project/${getProjectId()}/process/instance/search`, {
        method: 'post',
        payload: params
    })
}
