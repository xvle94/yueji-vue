import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/permeate/percolationtest/',
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

export function download(params) {
  return request({
    url: '/permeate/vulnreport/',
    method: 'post',
    data:params
  })
}

export function add(params) {
  return request({
    url: '/permeate/newscantemp/',
    method: 'post',
    data:params
  })
}

export function getTemplateList(params) {
  return request({
    url: '/plugin/template/list',
    method: 'get',
    params
  })
}
//暂停任务
export function pauseFn(params) {
  return request({
    url: '/vuln/scan/task/pause',
    method: 'post',
    data:params
  })
}
//恢复任务
export function resumeFn(params) {
  return request({
    url: '/vuln/scan/task/resume',
    method: 'post',
    data:params
  })
}
//停止任务
export function stopFn(params) {
  return request({
    url: '/vuln/scan/task/stop',
    method: 'post',
    data:params
  })
}
//重新扫描
export function rescanFn(params) {
  return request({
    url: '/vuln/scan/task/rescan',
    method: 'post',
    data:params
  })
}

export function downTemplate(params) {
  return request({
    url: '/vuln/scan/task/import/template',
    method: 'get',
    params
  })
}

export function getVerifiCode(params) {
  return request({
    url: '/vuln/scan/verifi/find',
    method: 'post',
    data:params
  })
}

export function setLoginVerifi(params) {
  return request({
    url: '/vuln/scan/verifi/set/login',
    method: 'post',
    data:params
  })
}

//发送识别的验证码
export function sendCode(params) {
  return request({
    url: '/vuln/scan/verifi/fuck',
    method: 'post',
    data:params
  })
}

//专家级渗透 search exploit
export function searchExploit() {
  return request({
    url: '/vuln/scan/task/exprt/modules',
    method: 'get',
  })
}

//专家级渗透，shell列表
export function shellList(params) {
  return request({
    url: '/vuln/msf/exploit/session?tid='+params+'',
    method: 'get',
  })
}

//专家级渗透，运行shell命令
export function shellExploit(params) {
  console.log("xxxx",params)
  return request({
    url: '/vuln/msf/exploit/session/shell',
    method: 'post',
    data: params
  })
}

//dnslog地址
export function dnsList(params) {
  return request({
    url: '/vuln/scan/dnslog?tid='+params+'',
    method: 'get',
  })
}

//专家级渗透，获取渗透测试基本信息，和端口信息
export function taskExportInfo(id,tag) {
  return request({
    url: '/vuln/scan/task/exprt/info?id='+id+'&tag='+tag+'',
    method: 'get',
  })
}

//专家级新增第一步
export function newExprt(params) {
  return request({
    url: '/vuln/scan/task/exprt/new',
    method: 'post',
    data:params
  })
}

//专家级渗透，获取参数信息和详情
export function getExprtInfo(params) {
  return request({
    url: '/vuln/scan/task/exprt/modules/info',
    method: 'get',
    params:params
  })
}

// 专家级渗透，运行单个插件
export function runPluginOne(params){
  return request({
    url: '/vuln/scan/task/exprt/scan',
    method: 'post',
    data: params
  })
}

// 专家级渗透，tree树
export function getExprtTree(params) {
  return request({
    url: '/vuln/scan/task/exprt/tree',
    method: 'get',
    params:params
  })
}


export function getInfos(params) {
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
