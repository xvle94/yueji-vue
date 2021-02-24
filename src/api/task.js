import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vuln/scan/task',
    method: 'get',
    params
  })
}

export function getScheduleList(params) {
  return request({
    url: '/vuln/scan/schedule',
    method: 'get',
    params
  })
}

export function delSchedule(data) {
  return request({
    url: '/vuln/scan/schedule/del',
    method: 'post',
    data:data
  })
}
