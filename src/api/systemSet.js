import request from '@/utils/request'

export function getUpdateInfo() {
    return request({
        url: '/user/conf/update/',
        method: 'get',
    })
}

export function setUpdate(params) {
    return request({
        url: '/user/conf/update/set',
        method: 'post',
        data:params
    })
}

export function getCurrency() {
    return request({
        url: '/plugin/common',
        method: 'get',
    })
}

export function setCurrency(params) {
    return request({
        url: '/plugin/common/set',
        method: 'post',
        data:params
    })
}

export function getNotice() {
    return request({
        url: '/user/conf/smtp/',
        method: 'get',
    })
}

export function setNotice(params) {
    return request({
        url: '/user/conf/smtp/update',
        method: 'post',
        data:params
    })
}

export function getUserList(params) {
    return request({
        url: '/user/list',
        method: 'get',
        params
    })
}

export function getRoleUserList(params) {
    return request({
        url: '/user/role',
        method: 'get',
        params
    })
}

export function createUser(params) {
    return request({
        url: '/user/create',
        method: 'post',
        data:params
    })
}

export function deleteUser(params) {
    return request({
        url: '/user/delete',
        method: 'post',
        data:params
    })
}

export function disabledUser(params) {
    return request({
        url: '/user/disabled',
        method: 'post',
        data:params
    })
}

export function enableUser(params) {
    return request({
        url: '/user/enable',
        method: 'post',
        data:params
    })
}

export function getAuditList(params) {
    return request({
        url: '/user/audit',
        method: 'get',
        params
    })
}

export function getSafe(params) {
    return request({
        url: '/user/conf/security',
        method: 'get',
        params
    })
}

export function setSafe(params) {
    return request({
        url: '/user/conf/security/update',
        method: 'post',
        data:params
    })
}

export function getExcludeTime() {
    return request({
        url: '/user/conf/time/exclude/',
        method: 'get',
    })
}

export function addExcludeTime(params) {
    return request({
        url: '/user/conf/time/exclude/add',
        method: 'post',
        data:params
    })
}

export function changeExcludeTime(params) {
    return request({
        url: '/user/conf/time/exclude/set',
        method: 'post',
        data:params
    })
}

export function updateExcludeTime(params) {
    return request({
        url: '/user/conf/time/exclude/update',
        method: 'post',
        data:params
    })
}

export function delExcludeTime(params) {
    return request({
        url: '/user/conf/time/exclude/del',
        method: 'post',
        data:params
    })
}

export function getTaskList() {
    return request({
        url: '/user/conf/time/schedule/',
        method: 'get',
    })
}

export function addTask(params) {
    return request({
        url: '/user/conf/time/schedule/add',
        method: 'post',
        data:params
    })
}

export function updateTask(params) {
    return request({
        url: '/user/conf/time/schedule/update',
        method: 'post',
        data:params
    })
}

export function delTask(params) {
    return request({
        url: '/user/conf/time/schedule/del',
        method: 'post',
        data:params
    })
}

export function getDeviceStatus() {
    return request({
        url: '/permeate/devicestatus/',
        method: 'get',
    })
}

export function getDay() {
    return request({
        url: '/user/license',
        method: 'get',
    })
}

export function licenseAuth(params) {
    return request({
        url: '/user/license/auth',
        method: 'post',
        data:params
    })
}

export function licenseMid(params) {
    return request({
        url: '/user/license/mid',
        method: 'post',
        data:params
    })
}

export function resetPwd(params) {
    return request({
        url: '/user/passwd/update',
        method: 'post',
        data:params
    })
}

export function exportList() {
    return request({
        url: '/user/audit/backup',
        method: 'get',
    })
}

export function deleteList(params) {
    return request({
        url: '/user/audit/clear',
        method: 'post',
        data:params
    })
}

export function getUid(params) {
    return request({
        url: '/user/audit/uuid',
        method: 'post',
        data:params
    })
}