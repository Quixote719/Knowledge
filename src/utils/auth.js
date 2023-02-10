const TOKEN = 'token'
const USERNAME = 'username'
const PASSWORD = 'password'
const PROJECTID = 'projectId'

export function getToken() {
    return localStorage[TOKEN]
}

export function removeToken() {
    localStorage.removeItem(TOKEN)
}

export function removeProjectId() {
    localStorage.removeItem(PROJECTID)
}

export function setToken(token) {
    if (token === getToken()) return
    localStorage.setItem(TOKEN, token)
}

export function getUserId() {
    try {
        const token = getToken()
        const info = JSON.parse(window.atob(token.split('.')[1]))
        return info.sub
    } catch (err) {
        return null
    }
}

export function getUserInfo() {
    return {
        userid: getUserId(),
        username: localStorage[USERNAME],
        password: localStorage[PASSWORD],
        projectId: localStorage[PROJECTID]
    }
}
export function getProjectId() {
    return localStorage[PROJECTID]
}

export function removeUserInfo(removeUser = true) {
    localStorage.removeItem(PROJECTID)
    if (removeUser) {
        localStorage.removeItem(PASSWORD)
        localStorage.removeItem(USERNAME)
    }
}

export function setUserInfo(username, password) {
    localStorage.setItem(USERNAME, username.toLowerCase())
    localStorage.setItem(PASSWORD, password)
}

export function setUserProjectInfo(projectId) {
    if (projectId === getUserInfo().projectId) return

    // fetchAccessDetail(projectId)
    localStorage.setItem(PROJECTID, projectId)
}

export function setCookie(name, value) {
    var Days = 30
    var exp = new Date()
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 30)
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

export function getCookie(name) {
    var arr,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if ((arr = document.cookie.match(reg))) {
        return unescape(arr[2])
    } else {
        return null
    }
}
