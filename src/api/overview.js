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
    url: '/permeate/latestevent/',
    method: 'get',
    params
  })
}

export function getCharts(params) {
  return request({
    url: '/vuln/statis/overview',
    method: 'get',
    params
  })
}