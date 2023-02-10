import React from 'react'
import { Button, Modal } from 'antdForHik'
import styles from './confirmModal.less'
import question from '@/assets/img/question.svg'

const ConfirmModal = props => {
    const { visible, onConfirm = () => {}, onCancel = () => {}, text = '', title = '', icon } = props

    return (
        <Modal
            visible={visible}
            centered
            width={360}
            footer={
                <div className={styles.btnContainer}>
                    <Button onClick={onConfirm} className={styles.confirm} type="primary">
                        确定
                    </Button>
                    <Button onClick={onCancel}>取消</Button>
                </div>
            }
            className={styles.confirmModal}>
            <div className={styles.container}>
                <div className={styles.contentContainer}>
                    <div className={styles.icon}>
                        {icon || <img src={question} type="image/svg+xml" alt="question" />}
                    </div>
                    <div>
                        <div className={styles.title}>{title}</div>
                        <div className={styles.text}>{text}</div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmModal
