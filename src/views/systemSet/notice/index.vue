<template>
    <div class="notice" v-loading="loading">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" label-position="left" class="demo-ruleForm">
            <el-form-item label="通知设置" prop="smtp_notice">
                <el-radio-group v-model="ruleForm.smtp_notice">
                    <el-radio label="yes">开启</el-radio>
                    <el-radio label="no">关闭</el-radio>
                </el-radio-group>
                <p style="color:#ccc;font-size:12px">用于用户创建，扫描和许可通知</p>
            </el-form-item>
            <div v-if="ruleForm.smtp_notice == 'yes'">
                <el-form-item label="SMTP服务器" prop="smtp_host">
                    <el-input v-model="ruleForm.smtp_host"></el-input>
                </el-form-item>
                <el-form-item label="port" prop="smtp_port">
                    <el-input v-model="ruleForm.smtp_port"></el-input>
                </el-form-item>
                <el-form-item label="收件人地址" prop="smtp_address">
                    <el-input v-model="ruleForm.smtp_address"></el-input>
                </el-form-item>
                <el-form-item label="安全" prop="smtp_scheme">
                    <el-select style="width:250px" v-model="ruleForm.smtp_scheme" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否需要身份验证" prop="smtp_auth">
                    <el-radio-group v-model="ruleForm.smtp_auth">
                        <el-radio label="yes">需要</el-radio>
                        <el-radio label="no">不需要</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="ruleForm.smtp_auth=='yes'" label="用户名" prop="smtp_user">
                    <el-input v-model="ruleForm.smtp_user"></el-input>
                </el-form-item>
                <el-form-item v-if="ruleForm.smtp_auth=='yes'" label="密码" prop="smtp_password">
                    <el-input type="password" v-model="ruleForm.smtp_password" autocomplete="off"></el-input>
                </el-form-item>
            </div>
            
            <el-form-item>
                <el-button class="blue-button" type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { getNotice, setNotice } from '@/api/systemSet' 
    import { Message } from 'element-ui'
    export default {
        data() {
            return {
                loading:true,
                options: [
                    {
                        value: 'auto',
                        label: '自动',
                    },
                    {
                        value: 'ssl',
                        label: 'SSL',
                    },
                    {
                        value: 'tls',
                        label: 'TLS',
                    },
                ],
                ruleForm: {
                    smtp_notice:'',
                    smtp_auth: '',
                    smtp_host: '',
                    smtp_port: '',
                    smtp_address: '',
                    smtp_scheme: '',
                    smtp_user: '',
                    smtp_password: '',
                },
                rules: {
                    smtp_host: [
                        { required: true, message: '请输入服务器地址', trigger: 'blur' },
                    ],
                    smtp_port: [
                        { required: true, message: '请输入端口', trigger: 'blur' },
                    ],
                    smtp_address: [
                        { required: true, message: '请输入发件人地址', trigger: 'blur' },
                    ],
                    smtp_notice: [
                        { required: true, message: '请选择通知设置', trigger: 'change' }
                    ],
                    smtp_auth: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                    smtp_scheme: [
                        { required: true, message: '请选择', trigger: 'change' }
                    ],
                    smtp_user: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    smtp_password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                }
            }
        },
        created() {
            
        },
        methods: {
            fetchNotice() {
                this.loading = true;
                getNotice().then(res => {
                    if(res.code == 200){
                        this.ruleForm.smtp_notice = res.data.smtp_notice;
                        this.ruleForm.smtp_auth = res.data.smtp_auth;
                        this.ruleForm.smtp_host = res.data.smtp_host;
                        this.ruleForm.smtp_port = res.data.smtp_port;
                        this.ruleForm.smtp_address = res.data.smtp_address;
                        this.ruleForm.smtp_scheme = res.data.smtp_scheme;
                        this.ruleForm.smtp_user = res.data.smtp_user;
                        this.ruleForm.smtp_password = res.data.smtp_password;
                    }else{
                        Message.error(res.data);
                    }
                    this.loading = false;
                }).catch(error => {
                    this.loading = false;
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    const params = this.ruleForm;
                    setNotice(params).then(res => {
                        if(res.code == 200){
                            Message.success(res.data);
                        }else{
                            Message.error(res.data);
                        }
                        this.loading = false;
                    }).catch(error => {
                        this.loading = false;
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
        }
    }
</script>
<style lang="scss" scoped>
.notice{
    width:400px;
    margin: 30px 0 0 100px;
}
</style>