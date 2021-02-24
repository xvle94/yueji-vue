import Cookies from 'js-cookie'
import store from 'store'

const TokenKey = 'vue_admin_template_token'
const roleKey = 'role'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRole() {
  return Cookies.get(roleKey)
}

export function setRole(role) {
  return Cookies.set(roleKey, role)
}

export function removeRole() {
  return Cookies.remove(roleKey)
}