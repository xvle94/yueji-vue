import request from '@/utils/request'

export function getPluginList(params) {
  return request({
    url: '/plugin/all',
    method: 'get',
    params
  })
}

export function getPluginInfo(params) {
  return request({
    url: '/plugin/info/'+params+'',
    method: 'get',
  })
}

export function setPlugin(id,params) {
  return request({
    url: '/plugin/info/'+id+'/update',
    method: 'post',
    data:params
  })
}