import React, { memo, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Input, Checkbox } from 'antdForHik'
import styles from './index.less'
import logo from '@/assets/img/loginlogo.png'
import user from '@/assets/img/user.png'
import password from '@/assets/img/password.png'

const Login = memo(props => {
    const fackLogin = useCallback(() => {
        props.history.push('/ProcessManagement')
    }, [props.history])
    return (
        <div className={styles.bg}>
            <div className={styles.header}>
                <img src={logo} alt="logo" className={styles.logo} onClick={fackLogin} />
                金融算法引擎
            </div>
            <div className={styles.container}>
                <header>欢迎登录</header>
                <Input
                    placeholder="请输入用户名"
                    className={styles.input}
                    prefix={<img src={user} alt="user" />}></Input>
                <Input.Password
                    placeholder="请输入密码"
                    className={styles.input}
                    prefix={<img src={password} alt="password" />}></Input.Password>
                <Checkbox>记住密码</Checkbox>
                <Button type={'primary'} className={styles.button}>
                    登录
                </Button>
            </div>
            <div className={styles.footer}>
                <p> 杭州海康威视数字技术股份有限公司 版权所有</p>
            </div>
        </div>
    )
})

export default withRouter(Login)
