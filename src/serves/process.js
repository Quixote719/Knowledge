import fetchProxy from '@/utils/fetchProxy'
import { getProjectId } from '@/utils/auth'

// 查询流程列表
export const getProcessLists = async params => {
    return fetchProxy(`/api/v1/projects/${getProjectId()}/process/search`, {
        method: 'post',
        payload: params
    })
}

// export const get
