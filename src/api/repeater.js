import request from '@/utils/request'

export function repeaterFn(params) {
    return request({
        url: '/plugin/proxy/repeater',
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

export function postProxyIntruder(data) {
    return request({
      url: '/plugin/proxy/intruder',
      method: 'post',
      data: data
    })
  }

export function getUploadList(params) {
    return request({
        url: '/plugin/upload/list',
        method: 'get',
        params
    })
}