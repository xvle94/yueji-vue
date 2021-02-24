import { login, logout, getInfo, getverify } from '@/api/user'
import { getToken, setToken, removeToken, getRole, setRole, removeRole } from '@/utils/auth'
import { resetRouter } from '@/router'
import { licenseAuth } from '@/api/systemSet' 
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    role: getRole()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
    localStorage.setItem('token',token)
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
    localStorage.setItem('role',role)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, code, codeId } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, code: code, codeId: codeId }).then(response => {
        const { data } = response
        console.log(response)
        console.log(data.token)
        console.log(data.role)
        console.log(state)
        
        commit('SET_TOKEN', data.token)
        commit('SET_ROLE', data.role)

        setToken(data.token)
        setRole(data.role)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getverify() {
    return new Promise((resolve, reject) => {
      getverify().then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response
  //       console.log(response)
  //       console.log(state)
  //       // if (!data) {
  //       //   return reject('验证失败，请重新登录.')
  //       // }

  //       const { name, avatar } = data

  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        removeToken() // must remove  token  first
        removeRole()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeRole()
      commit('RESET_STATE')
      resolve()
    })
  },

  licenseAuth({commit},value) {
    return new Promise((resolve, reject) => {
      licenseAuth({ license: value}).then(response => {
        commit('RESET_STATE')
        resolve(response)
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

