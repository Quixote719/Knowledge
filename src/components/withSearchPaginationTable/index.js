import React from 'react'
import { Pagination, Table } from 'antdForHik'
import styles from './index.less'
const WithPaginationTable = props => {
    const {
        datas = [],
        columns = [],
        total = 0,
        showTotal = total => `共 ${total} 条`,
        showSizeChanger = true,
        showQuickJumper = true,
        onPageChange = () => {},
        loading = false,
        rowKey
    } = props
    return (
        <>
            <Table
                columns={columns}
                dataSource={datas}
                pagination={false}
                className={styles.table}
                loading={loading}
                rowKey={rowKey || 'uid'}
            />
            <Pagination
                total={total}
                showTotal={showTotal}
                showSizeChanger={showSizeChanger}
                showQuickJumper={showQuickJumper}
                className={styles.pageination}
                onChange={(page, pageSize) => {
                    onPageChange(page, pageSize)
                }}
            />
        </>
    )
}

export default WithPaginationTable
