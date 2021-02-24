<template>
    <div class="user">
        <div class="btn-box">
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                @click="dialogVisible = true">新增</el-button>
            <el-button
                size="small"
                type="danger"
                class="red-button"
                :disabled="disabled"
                @click="handelDelete">删除</el-button>
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                :disabled="disabled"
                @click="handelEnable">启用</el-button>
            <el-button
                size="small"
                type="danger"
                class="red-button"
                :disabled="disabled"
                @click="handelDisable">禁用</el-button>
            <el-button
                size="small"
                type="warning"
                class="yellow-button"
                :disabled="resetDisabled"
                @click="handelOpenPwd">重置密码</el-button>
        </div>
        <div v-loading="loading">
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                 :header-cell-style="{background:'#E6E6E6',color:'#555',textAlign:'center'}"
                 :cell-style="{textAlign:'center'}"
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                :selectable="selectable"  
                width="55">
                </el-table-column>
                <el-table-column
                label="姓名"
                >
                    <template slot-scope="scope">
                        <span style="color:rgb(75, 137, 220)">{{ scope.row.username }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="role"
                label="角色类别"
                >
                </el-table-column>
                <el-table-column
                prop="email"
                label="邮箱"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="phone"
                label="手机"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                label="是否启用"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.is_active==true?'已启用':'已禁用' }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            title="新增"
            :visible.sync="dialogVisible"
            width="510px"
            class="dialog"
            >
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="left" class="demo-ruleForm">
                    <el-form-item label="姓名" prop="username">
                        <el-input v-model="ruleForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="ruleForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="角色类别" prop="group">
                        <el-select style="width:250px" v-model="ruleForm.role" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model.number="ruleForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="ruleForm.email"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button class="default-button" type="default" @click="dialogVisible = false">取 消</el-button>
                    <el-button class="blue-button" type="primary" @click="submitForm('ruleForm')">确定</el-button>
                </span>
        </el-dialog>
        <el-dialog
            title="重置密码"
            :visible.sync="pwdVisible"
            width="510"
            >
                <el-form :model="resetFrom" :rules="resetRules" ref="resetFrom" label-width="100px" label-position="left" class="demo-ruleForm">
                    <el-form-item label="旧密码" prop="old">
                        <el-input type="old" v-model="resetFrom.old" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="pwd">
                        <el-input type="pwd" v-model="resetFrom.pwd" show-password></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button class="default-button" type="default" @click="pwdVisible = false">取 消</el-button>
                    <el-button class="blue-button" type="primary" @click="handelResetPwd('resetFrom')">确定</el-button>
                </span>
        </el-dialog>
    </div>
</template>
<script>
    import { getUserList, createUser, getRoleUserList, deleteUser, disabledUser, enableUser, resetPwd } from '@/api/systemSet' 
    import { Message } from 'element-ui'
    import { message } from '@/utils/resetMessage';
    export default {
        data() {
            // 手机号验证
            var checkPhone = (rule, value, callback) => {
                const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/
                if (!value) {
                return callback(new Error('请输入手机号码'))
                }
                setTimeout(() => {
                
                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'))
                } else {
                    if (phoneReg.test(value)) {
                    callback()
                    } else {
                    callback(new Error('手机号码格式不正确'))
                    }
                }
                }, 100)
            };
            return {
                loading:true,
                disabled:true,
                resetDisabled:true,
                tableData: [],
                multipleSelection: [],
                dialogVisible: false,
                pwdVisible: false,
                ruleForm: {
                    username: '',
                    password:'',
                    role: '',
                    email: '',
                    phone: '',
                },
                rules: {
                    username: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    phone: [
                        { required: true, validator: checkPhone, trigger: 'blur' },
                    ],
                    role: [
                        { required: true, message: '请选择角色类别', trigger: 'change' }
                    ],
                },
                options:[],
                resetFrom: {
                    user:'',
                    old:'',
                    pwd:''
                },
                resetRules: {
                    old: [
                        { required: true, message: '请输入旧密码', trigger: 'blur' },
                    ],
                    pwd: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                    ],
                }
            }
        },
        created() {
            
        },
        methods: {
            fetchUserList() {
                this.loading = true
                getUserList().then(res => {
                    console.log(res);
                    if(res.code == 200){
                        this.tableData = res.data;
                    }else{
                        Message.error(res.data)
                    }
                    this.loading = false
                }).catch(error => {
                    this.loading = false
                })
            },
            fetchRoleUserList() {
                getRoleUserList().then(res => {
                    if(res.code == 200){
                        this.options = res.data;
                    }
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const params = this.ruleForm;
                        createUser(params).then(res => {
                            if(res.code == 200){
                                Message.success(res.data);
                                this.dialogVisible = false;
                                this.fetchUserList();
                            }else{
                                Message.error(res.data)
                            }
                        }).catch(error => {
                            
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if(val.length>0){
                    this.disabled = false
                }else{
                    this.disabled = true
                }
                if(val.length==1){
                    this.resetDisabled = false
                }else{
                    this.resetDisabled = true
                }
            },
            selectable(row,index){
                if(row.id==1){
                    return false
                }else{
                    return true
                }
            },
            handelDelete() {
                console.log(this.multipleSelection);
                let id = this.multipleSelection.map(item => item.id);
                console.log(id);
                deleteUser({uid:id}).then(res => {
                    if(res.code == 200){
                        this.fetchUserList();
                        message.success(res.data);
                    }else{
                        message.error(res.data);
                    }
                })
            },
            handelDisable(){
                let id = this.multipleSelection.map(item => item.id);
                console.log(id);
                disabledUser({uid:id}).then(res => {
                    if(res.code == 200){
                        this.fetchUserList();
                        message.success(res.data);
                    }else{
                        message.error(res.data);
                    }
                })
            },
            handelEnable(){
                let id = this.multipleSelection.map(item => item.id);
                console.log(id);
                enableUser({uid:id}).then(res => {
                    if(res.code == 200){
                        this.fetchUserList();
                        message.success(res.data);
                    }else{
                        message.error(res.data);
                    }
                })
            },
            handelOpenPwd() {
                console.log(this.multipleSelection);
                this.pwdVisible = true;
                this.resetFrom.user = this.multipleSelection[0].username;
            },
            handelResetPwd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const params = this.resetFrom;
                        resetPwd(params).then(res => {
                            if(res.code == 200){
                                Message.success(res.data);
                                this.pwdVisible = false;
                                this.fetchUserList();
                            }else{
                                Message.error(res.data)
                            }
                        }).catch(error => {
                            
                        })
                    } else {
                        return false;
                    }
                });
            },
        }
    }
</script>
<style lang="scss" scoped>
.user{
    margin-top: 30px;
    .demo-ruleForm{
        margin: 0 60px;
    }
}
</style>