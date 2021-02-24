import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vuln/scan/base/result',
    method: 'get',
    params
  })
}

export function add(params) {
  return request({
    url: '/vuln/scan/base/new',
    method: 'post',
    data:params
  })
}

export function getDetail(params) {
  return request({
    url: '/vuln/scan/base/result/'+params+'/info',
    method: 'get',
  })
}