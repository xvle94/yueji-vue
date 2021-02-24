<template>
    <div class="safe" v-loading="loading">
        <div>
            <p style="margin:20px 0">系统登录安全设置</p>
            <el-select @change="handleChange" style="width:100px" size="small" v-model="login_tm" placeholder="请选择">
                <el-option
                v-for="item in lockOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
            </el-select> 秒之内，用户尝试登录的失败次数超过
            <el-select @change="handleChange" style="width:100px" size="small" v-model="login_n" placeholder="请选择">
                <el-option
                v-for="item in login_nOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
            </el-select> 次，锁定该用户
            <el-select @change="handleChange" style="width:100px" size="small" v-model="lock" placeholder="请选择">
                <el-option
                v-for="item in login_tmOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
            </el-select> 分钟
        </div>
        <div style="margin-top:60px">
            <p style="margin:20px 0">超时设置</p>
            <el-select @change="handleChange" style="width:100px" size="small" v-model="timeout" placeholder="请选择">
                <el-option
                v-for="item in timeoutOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
            </el-select> 分钟之内，用户无任何操作，系统将因超时而自动登出
        </div>
    </div>
</template>
<script>
    import { getSafe, setSafe } from '@/api/systemSet' 
    import { Message } from 'element-ui'
    export default {
        data() {
            return {
                loading:true,
                login_tmOptions: [{
                    value: '10',
                    label: '10'
                }, {
                    value: '30',
                    label: '30'
                }, {
                    value: '60',
                    label: '60'
                }],
                login_nOptions: [{
                    value: '3',
                    label: '3'
                }, {
                    value: '5',
                    label: '5'
                }, {
                    value: '10',
                    label: '10'
                }],
                lockOptions: [{
                    value: '5',
                    label: '5'
                }, {
                    value: '10',
                    label: '10'
                }, {
                    value: '15',
                    label: '15'
                }, {
                    value: '30',
                    label: '30'
                }, {
                    value: '60',
                    label: '60'
                }],
                timeoutOptions: [{
                    value: '30',
                    label: '30'
                }, {
                    value: '60',
                    label: '60'
                }, {
                    value: '1440',
                    label: '1440'
                }],
                lock: '',
                login_n: '',
                login_tm: '',
                timeout: '',
            }
        },
        created() {
            
        },
        methods: {
            fetchSafe() {
                this.loading = true;
                getSafe().then(res => {
                    if(res.code == 200){
                        this.lock = res.data.lock;
                        this.login_n = res.data.login_n;
                        this.login_tm = res.data.login_tm;
                        this.timeout = res.data.timeout;
                    }else{
                        Message.error(res.data);
                    }
                    this.loading = false;
                }).catch(error => {
                    this.loading = false;
                })
            },
            handleChange() {
                this.loading = true;
                const params = {
                    lock: this.lock,
                    login_n: this.login_n,
                    login_tm: this.login_tm,
                    timeout: this.timeout,
                }
                setSafe(params).then(res => {
                    if(res.code == 200){
                        Message.success(res.data)
                    }else{
                        Message.error(res.data)
                    }
                    this.loading = false;
                }).catch(error => {
                    this.loading = false;
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.safe{
    margin: 30px 0 0 100px;
    
}
</style>