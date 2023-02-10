import React, { useState, useCallback, useEffect } from 'react'
import styles from './index.less'
import { Input, Popover } from 'antdForHik'
import { withRouter } from 'react-router-dom'
import { inject } from 'mobx-react'
import ConfirmModal from '@/components/confirmModal/confirmModal'
import addIcon from '@/assets/img/common_add.svg'
import reflash from '@/assets/img/common_reflash.svg'
import WithPaginationTable from '@/components/withSearchPaginationTable'
import CreateModal from './createModal'
import userEdit from '@/assets/img/common_edit.svg'
import start from '@/assets/img/common_start.svg'
import stop from '@/assets/img/ptz_play.svg'
// import play from '@/assets/img/common_disable.svg'
import more from '@/assets/img/common_more_hori.svg'
import deleteIcon from '@/assets/img/common_delete.svg'
const ProcessManagement = props => {
    // 删除确认
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const deleteModalHandle = useCallback(value => {
        setDeleteModalVisible(value)
    }, [])

    const renderDeleteModal = () => {
        return (
            <ConfirmModal
                title={'删除流程'}
                text={`确认删除流程吗？`}
                onConfirm={() => deleteModalHandle(true)}
                visible={deleteModalVisible}
                onCancel={() => deleteModalHandle(false)}
            />
        )
    }
    // 创建弹窗
    const [createModalVisible, setCreateModalVisible] = useState(false)
    // 修改流程信息
    const [modifyProcess, setModifyProcess] = useState(null)
    const renderCreateModal = () => {
        return (
            <CreateModal
                {...(modifyProcess || {})}
                visible={createModalVisible}
                onCancel={() => setCreateModalVisible(false)}
            />
        )
    }
    const { processList } = props.processStore
    const [tableLoading, setTableLoading] = useState(true)
    useEffect(() => {
        fetchProcessLists()
    })
    const fetchProcessLists = () => {
        props.processStore.getProcessLists(
            {
                pageNo: 1,
                pageSize: 10,
                sortby: [],
                order: [],
                processName: null,
                processEnable: null,
                betweenStart: null,
                betweenEnd: null
            },
            () => {
                setTableLoading(false)
            }
        )
    }
    const columns = [
        {
            title: '流程ID',
            dataIndex: 'processId',
            filters: [
                { text: 'Joe', value: 'Joe' },
                { text: 'Jim', value: 'Jim' }
            ],

            onFilter: (value, data) => {
                return true
            },
            filterMultiple: true
        },
        {
            title: '流程名称',
            dataIndex: 'processName',
            render: text => (
                <span
                    className={styles.processName}
                    onClick={() => {
                        // console.warn(props, '123')
                        props.history.push('/ProcessManagement/detail')
                    }}>
                    {text}
                </span>
            )
        },
        {
            title: '状态',
            dataIndex: 'processEnable'
        },
        {
            title: 'cron表达式',
            dataIndex: 'cronExpression'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime'
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime'
        },
        {
            title: '描述',
            dataIndex: 'description'
        },
        {
            title: '操作',
            dataIndex: 'handle',
            width: 200,
            render: (text, row) => {
                return (
                    <span className={styles.handle}>
                        <Popover content="编辑">
                            <img src={userEdit} alt={'edit'} />
                        </Popover>
                        <Popover content="运行">
                            <img src={start} alt={'运行'} />
                        </Popover>
                        <Popover content="启用/禁用">
                            <img src={stop} alt={'运行'} />
                            {/* <img src={play} alt={'运行'} /> */}
                        </Popover>
                        <Popover content="删除">
                            <img src={deleteIcon} alt={'删除'} />
                        </Popover>
                        <Popover
                            overlayClassName={styles.projPopover}
                            placement="bottom"
                            content={
                                <ul>
                                    <li
                                        onClick={() => {
                                            setModifyProcess({
                                                type: 'modify',
                                                initialValues: {
                                                    processName: row?.processName,
                                                    desc: 123
                                                }
                                            })
                                            setCreateModalVisible(true)
                                        }}>
                                        修改信息
                                    </li>
                                    <li>查看实例</li>
                                </ul>
                            }>
                            <img src={more} alt={'更多'} />
                        </Popover>
                    </span>
                )
            }
        }
    ]
    return (
        <div className={styles.container}>
            <header>
                <div>
                    <span className={styles.headerButton} onClick={() => setCreateModalVisible(true)}>
                        <img src={addIcon} alt="add" />
                        创建流程
                    </span>
                    <span
                        className={styles.headerButton}
                        onClick={() => {
                            setTableLoading(true)
                            fetchProcessLists()
                        }}>
                        <img src={reflash} alt="reflash" />
                        刷新
                    </span>
                </div>

                <Input.Search placeholder="请输入流程名称" />
            </header>
            {deleteModalVisible && renderDeleteModal()}
            {createModalVisible && renderCreateModal()}

            <WithPaginationTable
                columns={columns}
                total={100}
                rowKey={'processId'}
                loading={tableLoading}
                onPageChange={(page, pageSize) => {}}
                datas={processList}
            />
        </div>
    )
}

export default inject('processStore')(withRouter(ProcessManagement))
