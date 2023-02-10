import React from 'react'
import { withRouter } from 'react-router-dom'
import { inject } from 'mobx-react'
import ProjectCard from 'src/pages/projectManagement/components/projectCard'
import WithPaginationTable from '@/components/withSearchPaginationTable'
import styles from '@/pages/projectManagement/index.less'
import { Breadcrumb, Input } from 'antdForHik'
import listIcon from '@/assets/img/common_list.svg'
import cardIcon from '@/assets/img/common_menu_sm.svg'
import refresh from '@/assets/img/common_reflash.svg'
const { Search } = Input

class ProjectManage extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            projectViewType: 'card'
        }
    }
    componentDidMount = () => {
        this.props.projectStore.getprojectLists(
            {
                projectName: '',
                sortBy: 'createTime',
                order: 'DESC',
                pageNo: 1,
                pageSize: 10
            },
            () => {
                this.setState({ receiveProjectInfo: true })
            }
        )
    }
    setProjectView = param => {
        this.setState({ projectViewType: param })
    }
    render() {
        const { projectList = [] } = this.props.projectStore
        const { projectViewType, receiveProjectInfo } = this.state
        const btnActiveStyle = { background: '#4863E4', borderColor: '#4863E4' }
        console.warn(666, projectList)
        return (
            <div className={styles.pageContent}>
                <Breadcrumb className={styles.breadcrumbBlock} separator=">">
                    <Breadcrumb.Item
                        className={styles.breadcrumbRoute}
                        onClick={() => this.props.history.push('/ProjectManage')}>
                        我的项目
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>全部项目</Breadcrumb.Item>
                </Breadcrumb>

                <div style={{ marginTop: 10 }}>
                    <div className={styles.operateBtn}>
                        <img className={styles.btnImage} src={refresh} alt="refresh" />
                        <div className={styles.btnText}>刷新</div>
                    </div>
                    <div style={{ float: 'right' }}>
                        <div style={{ width: 300, marginRight: 8, display: 'inline-block' }}>
                            <Search />
                        </div>
                        <div style={{ display: 'inline-block' }}>
                            <div
                                onClick={() => {
                                    this.setProjectView('table')
                                }}
                                style={projectViewType === 'table' ? { ...btnActiveStyle } : {}}
                                className={styles.iconDiv}>
                                <img alt="" src={listIcon} />
                            </div>
                            <div
                                onClick={() => {
                                    this.setProjectView('card')
                                }}
                                style={projectViewType === 'card' ? { ...btnActiveStyle } : {}}
                                className={styles.iconDiv}>
                                <img alt="" src={cardIcon} />
                            </div>
                        </div>
                    </div>
                </div>
                {projectViewType === 'card' && (
                    <div className={styles.cardFlexBox}>
                        {receiveProjectInfo &&
                            projectList.map(item => {
                                return <ProjectCard title={item.name} content={item.description} />
                            })}
                    </div>
                )}
                {projectViewType === 'table' && (
                    <div style={{ margin: 20 }}>
                        <WithPaginationTable
                            // columns={columns}
                            // total={80}
                            rowKey={'processId'}
                            loading={!receiveProjectInfo}
                            onPageChange={(page, pageSize) => {}}
                            // datas={processList}
                        />
                    </div>
                )}
            </div>
        )
    }
}

export default inject('projectStore')(withRouter(ProjectManage))
