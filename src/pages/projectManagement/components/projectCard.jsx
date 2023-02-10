import React, { useState } from 'react'
import styles from '../index.less'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons'

const ProjectCard = props => {
    const [showIconBtn, setShowIconBtn] = useState(false)
    const onMouseOver = () => {
        setShowIconBtn(true)
    }
    const onMouseLeave = () => {
        setShowIconBtn(false)
    }
    const cardClick = () => {
        const { cardClick } = props
        if (typeof cardClick === 'function') {
            cardClick()
        }
    }
    const editCard = () => {
        const { editCard } = props
        if (typeof editCard === 'function') {
            editCard(props.info)
        }
    }
    const deleteCard = () => {
        const { deleteCard } = props
        if (typeof deleteCard === 'function') {
            deleteCard(props.info)
        }
    }

    return (
        <div
            onClick={() => cardClick()}
            onMouseOver={() => onMouseOver()}
            onMouseLeave={() => onMouseLeave()}
            className={styles.projectCard}>
            <div className={styles.cardTitle}>{props.title || 'title'}</div>
            <div className={styles.cardContent}>{props.content || 'content'}</div>
            {showIconBtn && (
                <div className={styles.actionIconBlock}>
                    <FormOutlined onClick={editCard} style={{ fontSize: 25, marginRight: 25 }} />
                    <DeleteOutlined onClick={deleteCard} style={{ fontSize: 25, marginRight: 25 }} />
                </div>
            )}
        </div>
    )
}

export default ProjectCard
