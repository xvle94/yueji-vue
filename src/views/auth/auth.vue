<template>
  <el-dialog
    title="重新激活"
    :visible.sync="centerDialogVisible"
    width="500px"
    :show-close='false'
    :closeOnClickModal='false'
    :closeOnPressEscape	='false'
    confirmButtonClass = 'blue-button'
    modalClass = 'modal-bg'
    >
      
      <div class="title-box">
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="您的机器码为:" label-width="120px">
              <p>{{machineCode}}</p>
            </el-form-item>
            <el-form-item label="请输入激活码" prop="license" label-width="120px">
              <el-input
                width="200px"
                placeholder="请输入激活码"
                v-model="form.license">
              </el-input>
            </el-form-item>
          </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button class="blue-button" type="primary" @click="submitForm('form')">激 活</el-button>
      </span>
  </el-dialog>
</template>
<script>
  import { licenseAuth, licenseMid } from '@/api/systemSet' 
  import { Message } from 'element-ui'
  export default {
    data() {
      return {
        centerDialogVisible: false,
        machineCode:'',
        form:{
          license:'',
        },
        rules:{
          license: [
            { required: true, message: '请输入license', trigger: 'blur' },
          ],
        }
      };
    },
    created() {
      this.handleMachineCode();
      // this.submitForm();
      console.log('aaaaaa');
    },
    methods: {
      handleMachineCode() {
        licenseMid().then(res => {
            if(res.code == 200){
                this.machineCode = res.data
            }
        }).catch(error => {
            Message.error(error);
        })
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = {
              license: this.form.license
            }
            licenseAuth(params).then(res => {
              if(res.code == 200){
                  Message.success(res.data);
                  // this.centerDialogVisible = false;
                  location.reload();
              }else{
                  Message.error(res.data);
              }
            }).catch(error => {
              Message.error(error);
            })
          } else {
            return false;
          }
        });
      }
    },
  };
</script>
<style lang="scss" scoped>
  
</style>