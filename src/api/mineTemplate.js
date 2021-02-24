import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/plugin/template/list',
    method: 'get',
    params
  })
}

export function getPipeList(params) {
  return request({
    url: '/plugin/pipe/list',
    method: 'get',
    params
  })
}

export function getPluginList(params) {
  return request({
    url: '/plugin/all',
    method: 'get',
    params
  })
}

export function addTemplate(params) {
  return request({
    url: '/plugin/template/create',
    method: 'post',
    data:params
  })
}

export function updateTemplate(params) {
  return request({
    url: '/plugin/template/update',
    method: 'post',
    data:params
  })
}


export function delListItem(params) {
  return request({
    url: '/plugin/template/delete',
    method: 'post',
    data:params
  })
}

export function getPluginInfo(params) {
  return request({
    url: '/plugin/template/'+params+'/info',
    method: 'get',
  })
}