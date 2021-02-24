import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vuln/scan/report/list',
    method: 'get',
    params
  })
}

export function delListItem(params) {
    return request({
      url: '/vuln/scan/report/del',
      method: 'post',
      data:params
    })
}