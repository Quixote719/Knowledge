import React from 'react'
import { Modal, Form, Input } from 'antdForHik'
import styles from './index.less'

const CreateModal = props => {
    const { visible, onCancel, type, initialValues } = props
    const [form] = Form.useForm()
    return (
        <Modal
            centered
            title={type === 'modify' ? '修改流程' : '创建流程'}
            visible={visible}
            width={592}
            onCancel={onCancel}>
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={initialValues}
                className={styles.form}>
                <Form.Item name="processName" label="流程名称" rules={[{ required: true, message: '请输入流程名称' }]}>
                    <Input placeholder={'请输入流程名称'} />
                </Form.Item>
                <Form.Item name="desc" label="描述">
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateModal
