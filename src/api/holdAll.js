import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/plugin/proxy/list',
    method: 'post',
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

export function getInfo(params) {
  return request({
    url: '/plugin/proxy/info',
    method: 'get',
    params
  })
}