import request from '@/utils/request'
//目标详情
export function getDetailInfo(params) {
  return request({
    url: '/permeate/getvulndetail/',
    method: 'get',
    params
  })
}
//漏洞详情列表
export function getDetailList(params) {
  return request({
    url: '/vuln/scan/result/list/name',
    method: 'get',
    params
  })
}
//任务详情
export function getTaskDetail(params) {
  return request({
    url: '/vuln/scan/task/'+params+'/info',
    method: 'get',
  })
}

//基础扫描详情
export function getBaseDetailList(id,tag,params) {
  return request({
    url: '/vuln/scan/base/result/'+id+'/info?tag='+tag,
    method: 'get',
    params
  })
}