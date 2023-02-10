import React, { useState, useEffect } from 'react'
import { Breadcrumb, Input, Form, Button, Radio, Tabs, Upload, Popover } from 'antdForHik'
import { inject } from 'mobx-react'
import { validateRules } from './constant'
import { withRouter } from 'react-router-dom'
import styles from '@/pages/projectManagement/index.less'
import {
    InfoCircleOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    UploadOutlined,
    SettingOutlined
} from '@ant-design/icons'

const FormItem = Form.Item
const { TabPane } = Tabs
const { TextArea } = Input
const CreateProject = props => {
    const [HDAuthMethod, updateHDAuthMethod] = useState(null)
    const [KBAuthMethod, updateKBAuthMethod] = useState(null)
    const [keytabFileList, updateKeytabFileList] = useState([])
    const [krb5FileList, updateKrb5FileList] = useState([])
    const [resConfigFileList, updateResConfigFileList] = useState([])

    useEffect(() => {
        console.warn('history', props.history.location.state)
        if (props.history.location.state) {
            props.projectStore.getprojectDetail(props.history.location.state)
        }
    })

    const keytabUploadProps = {
        fileList: keytabFileList,
        headers: {
            authorization: 'authorization-text'
        },
        beforeUpload: file => {
            console.warn(0, file, file.status)
            return true
        },
        onChange: info => {
            // file.status is empty when beforeUpload return false
            info.fileList.forEach(file => {
                if (file.status === 'error') {
                    file.status = 'success'
                }
            })
            updateKeytabFileList(info.fileList.filter(file => !!file.status))
        }
    }
    const krb5UploadProps = {
        fileList: krb5FileList,
        headers: {
            authorization: 'authorization-text'
        },
        beforeUpload: file => {
            console.warn(0, file, file.status)
            return true
        },
        onChange: info => {
            // file.status is empty when beforeUpload return false
            console.warn(1, info.fileList)
            info.fileList.forEach(file => {
                if (file.status === 'error') {
                    file.status = 'success'
                }
            })
            updateKrb5FileList(info.fileList.filter(file => !!file.status))
        }
    }
    const resourceConfigProps = {
        fileList: resConfigFileList,
        headers: {
            authorization: 'authorization-text'
        },
        beforeUpload: file => {
            console.warn(0, file, file.status)
            return true
        },
        onChange: info => {
            // file.status is empty when beforeUpload return false
            console.warn(1, info.fileList)
            info.fileList.forEach(file => {
                if (file.status === 'error') {
                    file.status = 'success'
                }
            })
            updateResConfigFileList(info.fileList.filter(file => !!file.status))
        }
    }
    const saveProjectConfig = form => {
        console.warn('success', form)
    }
    const manageConfigError = form => {
        console.warn('error', form)
    }
    const changeHBAuthMethod = e => {
        updateHDAuthMethod(e.target.value)
    }
    const changeKBAuthMethod = e => {
        console.warn('info', e, e.target, e.target.value)
        updateKBAuthMethod(e.target.value)
    }
    const initialFormVals = { department: 'finance', authenticationMethod: 'Kerberos' }
    const renderHadoopForm = () => {
        console.warn('projectDetail', props.projectStore.projectDetail)
        return (
            <div>
                <FormItem
                    label={'鉴权方式'}
                    name="hadoopAuthenticationMethod"
                    rules={[{ required: true, message: '必选' }]}>
                    <Radio.Group onChange={changeHBAuthMethod}>
                        <Radio value={'Kerberos'}>Kerberos</Radio>
                        <Radio value={'Simple'}>Simple</Radio>
                    </Radio.Group>
                </FormItem>
                {HDAuthMethod === 'Kerberos' && (
                    <FormItem label={'Principal'} name="Principal" rules={[{ required: true, message: '必填' }]}>
                        <Input maxLength={100} />
                    </FormItem>
                )}
                {HDAuthMethod === 'Simple' && (
                    <FormItem
                        label={'用户名'}
                        name="HDUserName"
                        rules={[{ required: true, message: '必填' }, validateRules.letterNumSpace]}>
                        <Input maxLength={30} />
                    </FormItem>
                )}
                {HDAuthMethod === 'Kerberos' && (
                    <FormItem label={'Keytab'} name="Keytab" rules={[{ required: true, message: '必填' }]}>
                        <Upload {...keytabUploadProps}>
                            <Button>
                                <UploadOutlined />
                                上传
                            </Button>
                        </Upload>
                    </FormItem>
                )}
                {HDAuthMethod === 'Kerberos' && (
                    <FormItem label={'Krb5.conf'} name="Krb5.conf" rules={[{ required: true, message: '必填' }]}>
                        <Upload {...krb5UploadProps}>
                            <Button>
                                <UploadOutlined />
                                上传
                            </Button>
                        </Upload>
                    </FormItem>
                )}
                <FormItem label={'资源配置'} name="resourceConfig">
                    <Upload {...resourceConfigProps}>
                        <Button>
                            <UploadOutlined />
                            上传
                        </Button>
                    </Upload>
                </FormItem>
                <FormItem
                    label={
                        <span>
                            <Popover placement={'left'} content={'yarn.resourcemanager.address'}>
                                <InfoCircleOutlined className={styles.formInfoIcon} />
                            </Popover>
                            ResourceManager
                        </span>
                    }
                    name="ResourceManager"
                    rules={[{ required: true, message: '必填' }]}>
                    <Input placeholder="node115.bigdata.hikvision.com:8088" maxLength={100} />
                    <Button style={{ marginTop: 20 }}>
                        <SettingOutlined />
                        获取配置
                    </Button>
                </FormItem>
                <FormItem
                    label={
                        <span>
                            <Popover placement={'left'} content={'yarn.resourcemanager.scheduler.address'}>
                                <InfoCircleOutlined className={styles.formInfoIcon} />
                            </Popover>
                            ResourceManager Scheduler
                        </span>
                    }
                    name="ResourceManager_Scheduler"
                    rules={[{ required: true, message: '必填' }]}>
                    <Input placeholder="node115.bigdata.hikvision.com:8088" maxLength={100} />
                </FormItem>
                {HDAuthMethod === 'Kerberos' && (
                    <FormItem
                        label={
                            <span>
                                <Popover placement={'left'} content={'yarn.resourcemanager.principal'}>
                                    <InfoCircleOutlined className={styles.formInfoIcon} />
                                </Popover>
                                ResourceManager Principle
                            </span>
                        }
                        name="ResourceManager_Principle"
                        rules={[{ required: true, message: '必填' }, validateRules.letterNumSpace]}>
                        <Input placeholder="hdfs/_HOST@HIKVISION.COM" maxLength={30} />
                    </FormItem>
                )}
                <FormItem
                    label={
                        <span>
                            <Popover placement={'left'} content={'Yarn其他配置'}>
                                <InfoCircleOutlined className={styles.formInfoIcon} />
                            </Popover>
                            其他配置
                        </span>
                    }
                    name="YarnOtherConfig">
                    <TextArea placeholder="key=value" />
                </FormItem>
                <FormItem label={'计算队列'} name="computeQueue" rules={[{ required: true, message: '必填' }]}>
                    <Input placeholder="root.awaken.streaming" />
                </FormItem>
                <FormItem
                    label={
                        <span>
                            <Popover placement={'left'} content={'dfs.namenode.rpc-address'}>
                                <InfoCircleOutlined className={styles.formInfoIcon} />
                            </Popover>
                            NameNode
                        </span>
                    }
                    name="nameNode"
                    rules={[{ required: true, message: '必填' }]}>
                    <Input placeholder="node115.bigdata.hikvision.com:8088" />
                </FormItem>
                {HDAuthMethod === 'Kerberos' && (
                    <FormItem
                        label={
                            <span>
                                <Popover placement={'left'} content={'dfs.namenode.kerberos.principal'}>
                                    <InfoCircleOutlined className={styles.formInfoIcon} />
                                </Popover>
                                NameNode Principal
                            </span>
                        }
                        name="nameNodePrincipal"
                        rules={[{ required: true, message: '必填' }]}>
                        <Input placeholder="hdfs/_HOST@HIKVISION.COM" />
                    </FormItem>
                )}
                <FormItem
                    label={
                        <span>
                            <Popover placement={'left'} content={'HDFS其他配置'}>
                                <InfoCircleOutlined className={styles.formInfoIcon} />
                            </Popover>
                            其他配置
                        </span>
                    }
                    name="HDFSOtherConfig">
                    <TextArea placeholder="key=value" />
                </FormItem>
                <FormItem
                    label={'HDFS存储目录'}
                    name="HDFS_store_catalog"
                    rules={[{ required: true, message: '必填' }]}>
                    <Input maxLength={100} />
                </FormItem>
                <FormItem label={'Hive数据库'} name="hiveDatasource">
                    <Input maxLength={100} placeholder="awaken_db1" />
                </FormItem>
            </div>
        )
    }

    const renderKubernetesForm = () => {
        return (
            <div>
                <FormItem
                    label={'鉴权方式'}
                    name="kubernetesAuthenticationMethod"
                    onChange={changeKBAuthMethod}
                    rules={[{ required: true, message: '必选' }]}>
                    <Radio.Group>
                        <Radio value={'token'}>Token</Radio>
                        <Radio value={'user'}>用户名/密码</Radio>
                    </Radio.Group>
                </FormItem>
                {KBAuthMethod === 'token' && (
                    <FormItem label={'Token'} name="Token" rules={[{ required: true, message: '必填' }]}>
                        <Input maxLength={100} />
                    </FormItem>
                )}
                {KBAuthMethod === 'user' && (
                    <FormItem
                        label={'用户名'}
                        name="username"
                        rules={[{ required: true, message: '必填' }, validateRules.letterNumSpace]}>
                        <Input maxLength={64} />
                    </FormItem>
                )}
                {KBAuthMethod === 'user' && (
                    <FormItem
                        label={'密码'}
                        name="password"
                        rules={[{ required: true, message: '必填' }, validateRules.letterNumSpace]}>
                        <Input.Password
                            maxLength={64}
                            iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                        />
                    </FormItem>
                )}
                <FormItem
                    label={
                        <span>
                            <Popover placement={'left'} content={'api server对应的IP：port'}>
                                <InfoCircleOutlined className={styles.formInfoIcon} />
                            </Popover>
                            API服务器地址
                        </span>
                    }
                    name="API_Server_Address"
                    rules={[{ required: true, message: '必填' }]}>
                    <Input placeholder="10.3.71.120:6443" />
                </FormItem>
                <FormItem
                    label={
                        <span>
                            <Popover placement={'left'} content={'namespace'}>
                                <InfoCircleOutlined className={styles.formInfoIcon} />
                            </Popover>
                            命名空间
                        </span>
                    }
                    name="nameSpace"
                    rules={[{ required: true, message: '必填' }]}>
                    <Input maxLength={64} />
                </FormItem>
            </div>
        )
    }

    return (
        <div className={styles.pageContent}>
            <Breadcrumb className={styles.breadcrumbBlock} separator=">">
                <Breadcrumb.Item
                    className={styles.breadcrumbRoute}
                    onClick={() => props.history.push('/ProjectManage')}>
                    我的项目
                </Breadcrumb.Item>
                <Breadcrumb.Item>创建项目</Breadcrumb.Item>
            </Breadcrumb>
            <Form
                className={styles.formSection}
                layout={'vertical'}
                initialValues={initialFormVals}
                onFinish={saveProjectConfig}
                onFinishFailed={manageConfigError}>
                <FormItem
                    label={'项目名称'}
                    name="projectName"
                    required={true}
                    rules={[{ required: true, message: '必填' }, validateRules.letterNumSpace]}>
                    <Input maxLength={30} />
                </FormItem>
                <FormItem label={'需求部门'} name="department" rules={[validateRules.letterNumSpace]}>
                    <Input maxLength={30} />
                </FormItem>
                <FormItem label={'负责人'} name="responsiblePerson" rules={[validateRules.letterNumSpace]}>
                    <Input maxLength={30} />
                </FormItem>
                <FormItem label={'项目备注'} name="projectMemo" rules={[validateRules.letterNumSpace]}>
                    <Input maxLength={60} />
                </FormItem>
                <div>集群配置</div>
                <Tabs className={styles.tabSpace} defaultActiveKey="Yarn">
                    <TabPane tab="Hadoop集群" className={styles.darkTabPane} key="Hadoop">
                        {renderHadoopForm()}
                    </TabPane>
                    <TabPane tab="Kubernetes集群" className={styles.darkTabPane} key="Kubernetes">
                        {renderKubernetesForm()}
                    </TabPane>
                </Tabs>
                <Button type={'primary'} htmlType="submit">
                    保存
                </Button>
            </Form>
        </div>
    )
}

export default inject('projectStore')(withRouter(CreateProject))
