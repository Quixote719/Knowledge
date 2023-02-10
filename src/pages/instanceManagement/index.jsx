import React from 'react'
import styles from './index.less'
import CompactInput from '@/components/compactInput'
import { withRouter } from 'react-router-dom'
import { inject } from 'mobx-react'
import { Popover } from 'antdForHik'
import WithPaginationTable from '@/components/withSearchPaginationTable'
import refresh from '@/assets/img/common_reflash.svg'
import detailIcon from '@/assets/img/common_export.svg'
import stopIcon from '@/assets/img/common_status_stop.svg'
import deleteIcon from '@/assets/img/common_delete.svg'

const SearchOpt = ['流程ID', '流程名称', '流程实例ID', '流程实例名称']
const instanceCols = [
    {
        title: '流程实例ID',
        dataIndex: 'dolphinProcessInstanceId',
        // filters: [
        //     { text: 'Joe', value: 'Joe' },
        //     { text: 'Jim', value: 'Jim' }
        // ],

        // onFilter: (value, data) => {
        //     return true
        // },
        filterMultiple: true
    },
    {
        title: '流程实例名称',
        dataIndex: 'processInstanceName'
    },
    {
        title: '流程ID',
        dataIndex: 'processId'
    },
    {
        title: '流程名称',
        dataIndex: 'processName'
    },
    {
        title: '状态',
        dataIndex: 'processInstanceStatus'
    },
    {
        title: '开始时间',
        dataIndex: 'beginTime'
    },
    {
        title: '结束时间',
        dataIndex: 'endTime'
    }
]
class InstanceManage extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { tableLoading: true }
        this.instanceCols = instanceCols.filter(item => item.title !== '操作')
        this.instanceCols.push({
            title: '操作',
            dataIndex: 'handle',
            width: 200,
            render: (text, row) => {
                return (
                    <span className={styles.handle}>
                        <Popover content="详情">
                            <img
                                src={detailIcon}
                                onClick={() => {
                                    this.props.history.push({
                                        pathname: '/InstanceManage/instanceDetail',
                                        state: row.dolphinProcessInstanceId
                                    })
                                }}
                                alt={'详情'}
                            />
                        </Popover>
                        <Popover content="暂停">
                            <img style={{ color: '#FFFFFF' }} src={stopIcon} alt={'暂停'} />
                        </Popover>
                        <Popover content="删除">
                            <img src={deleteIcon} alt={'删除'} />
                        </Popover>
                    </span>
                )
            }
        })
    }
    componentDidMount() {
        this.props.instanceStore.getinstanceLists(
            {
                beginTime: '2021-02-07 00:00:00',
                endTime: '2021-03-07 20:00:00',
                pageAndSortRequest: {
                    sortby: ['createTime'],
                    order: ['DESC']
                },
                searchKey: null,
                searchValue: null,
                statusEnum: 'ALL'
            },
            () => {
                this.setState({ tableLoading: false })
            }
        )
    }
    compactSearchChange = (val, type) => {
        if (type === 'select') {
            this.setState({ searchType: val })
        } else if (type === 'input') {
            this.setState({ searchText: val })
        }
    }
    render() {
        const { searchType, searchText, tableLoading } = this.state
        const { instanceList = [] } = this.props.instanceStore
        console.warn('instanceList', instanceList)
        return (
            <div className={styles.contentSection}>
                <div className={styles.operateBtn}>
                    <img className={styles.btnImage} src={refresh} alt="refresh" />
                    <div className={styles.btnText}>刷新</div>
                </div>
                <div className={styles.searchBlock}>
                    <CompactInput
                        placeholder={'搜索'}
                        selectVal={searchType}
                        inputVal={searchText}
                        compactInputCallback={this.compactSearchChange}
                        selectClassName={styles.featureSelect}
                        selectDefaultValue={SearchOpt[3]}
                        selectOptions={SearchOpt}
                    />
                </div>
                <WithPaginationTable
                    columns={this.instanceCols}
                    onPageChange={(page, pageSize) => {}}
                    datas={instanceList}
                    loading={tableLoading}
                />
            </div>
        )
    }
}

export default inject('instanceStore')(withRouter(InstanceManage))
