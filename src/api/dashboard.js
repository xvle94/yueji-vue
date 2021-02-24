import request from '@/utils/request'

export function getTaskslatest(params) {
  return request({
    url: '/permeate/datatotal/',
    method: 'get',
    params
  })
}

export function getNewList(params) {
    return request({
      url: '/permeate/taskslatest/',
      method: 'get',
      params
    })
  }

export function delListItem(params) {
    return request({
      url: '/vuln/scan/task/del',
      method: 'post',
      data:params
    })
}