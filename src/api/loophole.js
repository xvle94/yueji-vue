import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vuln/scan/result/list',
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