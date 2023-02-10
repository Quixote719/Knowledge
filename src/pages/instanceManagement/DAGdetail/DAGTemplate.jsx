import React from 'react'
import styles from './DAGTemplate.less'

export default class ComponentData extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            this.props.onDagDidMount()
        })
    }
    componentWillUnmount() {
        setTimeout(() => {
            this.props.onDagDidUnmount()
        })
    }
    render() {
        return <div ref="canvasBody" id="canvasBody" style={this.props.style} className={styles.container}></div>
    }
}
