<template>
    <div class="box">
        <div class="form-box">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="域名" prop="host">
                    <el-input v-model="ruleForm.host"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="port">
                    <el-input v-model="ruleForm.port"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="path">
                    <el-input v-model="ruleForm.path"></el-input>
                </el-form-item>
                <el-form-item label="协议" prop="scheme">
                    <el-input v-model="ruleForm.scheme"></el-input>
                </el-form-item>
                <el-form-item label="HTTP版本" prop="http_version">
                    <el-input v-model="ruleForm.http_version"></el-input>
                </el-form-item>
                <el-form-item label="method" prop="method">
                    <el-input v-model="ruleForm.method"></el-input>
                </el-form-item>
                <el-form-item label="是否验证ssl" prop="verify">
                    <el-radio-group v-model="ruleForm.verify">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="headers" prop="headers">
                    <el-input
                        type="textarea"
                        :rows="5"
                        :autosize="{ minRows: 5}"
                        placeholder="请输入内容"
                        v-model="ruleForm.headers">
                    </el-input>
                </el-form-item>
                <el-form-item label="body" prop="body">
                    <el-input
                        type="textarea"
                        :rows="5"
                        :autosize="{ minRows: 5}"
                        placeholder="请输入内容"
                        v-model="ruleForm.body">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">发送</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tabs-box">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="Response" name="first">{{response}}</el-tab-pane>
                <el-tab-pane label="显示结果" name="second">
                    <p>状态码：{{code}}</p>
                    <p v-for="item in header" style="line-height:26px">{{item}}</p>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui'
import { repeaterFn, getInfo } from '@/api/repeater'
  export default {
    data() {
      return {
        id:this.$route.params.id,
        ruleForm: {
          host: '',
          port: '',
          path: '',
          scheme: '',
          http_version: '',
          method: '',
          headers: '',
          body: '',
          verify:false,
        },
        rules: {
          host: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          port: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          path: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          scheme: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          http_version: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          method: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          headers: [
            { required: false, message: '请输入', trigger: 'blur' }
          ],
          body: [
            { required: false, message: '请输入', trigger: 'blur' }
          ],
          verify: [
            { required: true, message: '请选择是否验证ssl', trigger: 'change' }
          ],
        },
        activeName: 'first',
        response:'',
        header:'',
        code:'',
      };
    },
    props:['psMsg'],
    created() {
        this.getInfoObj();
    },
    methods: {
        getInfoObj(){
            const params = {
                id: this.id||this.psMsg,
                style:'repeater'
            }
            getInfo(params).then(res => {
                if(res.code == 200){
                    this.ruleForm.host = res.data.host;
                    this.ruleForm.port = res.data.port;
                    this.ruleForm.path = res.data.path;
                    this.ruleForm.scheme = res.data.scheme;
                    this.ruleForm.http_version = res.data.http_version;
                    this.ruleForm.method = res.data.method;
                    this.ruleForm.headers = res.data.headers;
                    this.ruleForm.body = res.data.body;
                }
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                const params = this.ruleForm;
                repeaterFn(params).then(res => {
                    console.log(res);
                    if(res.code == 200){
                        this.response = res.data.result;
                        this.header = res.data.header;
                        this.code = res.data.code;
                    }else{
                        Message.error(res.data);
                    }
                }).catch(error => {
                    
                })
            } else {
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
}
</script>

<style lang="scss" scoped>
.box{
    display: flex;
    flex-direction: row;
    .form-box{
        flex: 1;
    }
    .tabs-box{
        flex: 1;
        margin-left: 20px;
        width: 50%;
    }
}
</style>
