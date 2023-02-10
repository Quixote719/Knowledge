import React from 'react'
import { inject } from 'mobx-react'
import { Button, Modal } from 'antdForHik'
import { withRouter } from 'react-router-dom'
import ProjectCard from 'src/pages/projectManagement/components/projectCard'
import styles from '@/pages/projectManagement/index.less'
import { QuestionCircleFilled } from '@ant-design/icons'

class ProjectManage extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
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
    createProject = () => {
        this.props.history.push('/ProjectManage/createProject')
    }
    onEditCard(param) {
        this.props.history.push({ pathname: '/ProjectManage/createProject', state: param?.id })
    }
    deleteCard(param) {
        console.warn('destroyAll', param)
    }
    confirmDeleteCard = param => {
        const deleteText = '请确认是否删除信用卡开卡风险算法项目。仅删除项目业务数据，请谨慎操作！'
        Modal.confirm({
            icon: <QuestionCircleFilled style={{ fontSize: 40 }} />,
            content: deleteText,
            onOk: () => {
                this.deleteCard(param)
                // return false
            },
            onCancel: () => {
                return false
            }
        })
    }
    render() {
        const { receiveProjectInfo } = this.state
        const { projectList = [] } = this.props.projectStore
        return (
            <div>
                <div className={styles.topSection}>
                    <div className={styles.FMtitle}>金融算法引擎</div>
                    <div className={styles.FMDescription}>金融算法引擎简介</div>
                    <Button onClick={this.createProject} type={'primary'}>
                        创建项目
                    </Button>
                </div>
                <div className={styles.bottomSection}>
                    <div>
                        <div className={styles.textBar}>找到4个结果</div>
                        <div
                            onClick={() => this.props.history.push('/ProjectManage/ProjectListPage')}
                            className={`${styles.textBar} ${styles.rightRedirectText}`}>
                            查看更多
                        </div>
                    </div>
                    <div>
                        {receiveProjectInfo &&
                            projectList.map(item => {
                                return (
                                    <ProjectCard
                                        title={item.name}
                                        content={item.description}
                                        info={item}
                                        editCard={params => this.onEditCard(params)}
                                        deleteCard={params => this.deleteCard(params)}
                                    />
                                )
                            })}
                        {/* <ProjectCard content={'fake news'} deleteCard={this.confirmDeleteCard} /> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default inject('projectStore')(withRouter(ProjectManage))
