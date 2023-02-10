import React from 'react'
import { Input, Select } from 'antdForHik'

const { Option } = Select
const { Group, Search } = Input
const CompactInput = props => {
    return (
        <Group compact>
            <Select
                className={props.selectClassName}
                onChange={val => props.compactInputCallback(val, 'select')}
                defaultValue={props.selectDefaultValue}>
                {props.selectOptions.map(item => (
                    <Option value={item}>{item}</Option>
                ))}
            </Select>
            <Search
                defaultValue={props.inputDefaultValue}
                onChange={e => props.compactInputCallback(e.target.value, 'input')}
                placeholder={props.placeholder}
            />
        </Group>
    )
}

export default CompactInput
