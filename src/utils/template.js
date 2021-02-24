import Vue from 'vue'
import Template from '@/views/template/template.vue'
const TemplateBox = Vue.extend(Template)
 
Template.install = function (data) {
 let instance = new TemplateBox({
  data
 }).$mount()
 
 document.body.appendChild(instance.$el)
 
 Vue.nextTick(() => {
  instance.show = true
  // show 和弹窗组件里的show对应，用于控制显隐
 })
}
export default Template