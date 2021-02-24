import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/plugin/pipe/list',
    method: 'get',
    params
  })
}

export function delListItem(params) {
  return request({
    url: '/plugin/pipe/delete',
    method: 'post',
    data:params
  })
}