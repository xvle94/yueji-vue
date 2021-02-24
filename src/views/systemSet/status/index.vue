<template>
    <div class="status" v-loading="loading">
        <div class="status-box">
            <p>持续运行时间</p>
            <span class="status-info">{{run_time.days}}天{{run_time.hours}}小时{{run_time.minutes}}分钟</span>
        </div>
        <div class="status-box">
            <p>授权期限</p>
            <span class="status-info">到期时间：<span style="color:#5BBEE1">{{expire}}</span>，剩余可用<span style="color:#5BBEE1">{{time}}</span>天</span>
            <el-button
                style="margin-left:20px"
                size="small"
                type="primary"
                class="blue-button"
                @click="dialogVisible = true">重新授权</el-button>
        </div>
        <div class="status-box">
            <p>CPU使用</p>
            <span class="status-info">核心数量{{logic_count}}，使用率{{cpu_percent}}</span>
            <el-progress class="progress" :percentage="cpu_percent" :format="format" :stroke-width="14" color="#EC6F59"></el-progress>
        </div>
        <div class="status-box">
            <p>硬盘状况</p>
            <span class="status-info">总空间{{disk_total}}，已使用{{disk_used}}，还剩{{disk_free}}</span>
            <el-progress class="progress" :percentage="disk_percent" :format="format" :stroke-width="14" color="#4B87DD"></el-progress>
        </div>
        <div class="status-box">
            <p>内存状况</p>
            <span class="status-info">物理内存{{memory_total}}，已使用{{memory_used}}，还剩{{memory_free}}</span>
            <el-progress class="progress" :percentage="memory_percent" :format="format" :stroke-width="14" color="#F6BB43"></el-progress>
        </div>
        <el-dialog
            title="重新激活"
            :visible.sync="dialogVisible"
            width="500px"
            >
                <div class="title-box">
                    激活码
                    <el-input
                        placeholder="请输入激活码"
                        class="title"
                        v-model="license">
                    </el-input>
                </div>
                <el-link type="info" style="margin:20px 0 0 114px" @click="handleMachineCode">获取机器码</el-link>
                <p style="margin:20px 0 0 114px">{{machineCode}}</p>
                <span slot="footer" class="dialog-footer">
                    <el-button class="default-button" type="info" @click="dialogVisible = false">取 消</el-button>
                    <el-button class="blue-button" type="primary" @click="submitForm">激 活</el-button>
                </span>
        </el-dialog>
    </div>
</template>
<script>
    import { getDeviceStatus, getDay, licenseAuth, licenseMid } from '@/api/systemSet' 
    import { Message } from 'element-ui'
    export default {
        data() {
            return {
                loading:true,
                run_time:'',
                expire:'',
                time:'',
                logic_count:'',
                cpu_percent:0,
                disk_total:'',
                disk_used:'',
                disk_free:'',
                disk_percent:0,
                memory_total:'',
                memory_used:'',
                memory_free:'',
                memory_percent:0,
                license:'',
                machineCode:'',
                dialogVisible:false
            }
        },
        methods: {
            fetchDeviceStatus() {
                this.loading = true;
                getDeviceStatus().then(res => {
                    console.log(res);
                    if(res.code == 200){
                        this.run_time = res.data.data.run_time
                        // this.expire = res.data.data.expire
                        this.logic_count = res.data.data.logic_count
                        this.cpu_percent = res.data.data.cpu_percent
                        this.disk_total = res.data.data.disk_total
                        this.disk_used = res.data.data.disk_used
                        this.disk_free = res.data.data.disk_free
                        this.disk_percent = res.data.data.disk_percent
                        this.memory_total = res.data.data.memory_total
                        this.memory_used = res.data.data.memory_used
                        this.memory_free = res.data.data.memory_free
                        this.memory_percent = res.data.data.memory_percent
                    }
                    this.loading = false;
                }).catch(error => {
                    this.loading = false;
                })
                getDay().then(res => {
                    console.log(res);
                    if(res.code == 200){
                        this.time = res.data.time;
                        this.expire = this.timeDate(res.data.time);
                    }
                })
            },
            timeDate(num) {
                let date = new Date();
                date.setDate(date.getDate() + num);
                return date.getFullYear() +"-"+ (date.getMonth()+1) +"-"+ date.getDate()
            },
            format(percentage) {
                return `${percentage}%`;
            },
            handleMachineCode() {
                licenseMid().then(res => {
                    if(res.code == 200){
                        this.machineCode = res.data
                    }
                }).catch(error => {
                    Message.error(error);
                })
            },
            submitForm(){
                if(this.license == ''){
                    Message.error('请输入激活码')
                }else{
                    const params = {
                        license: this.license
                    }
                    licenseAuth(params).then(res => {
                        if(res.code == 200){
                            Message.success(res.data);
                            this.dialogVisible = true;
                        }else{
                            Message.error(res.data);
                        }
                    }).catch(error => {
                        Message.error(error);
                    })
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.status{
    margin: 30px 0 0 100px;
    display: flex;
    flex-direction: column;
    .status-box{
        flex: 1;
        .status-info{
            display: inline-block;
            margin: 20px 0 20px 40px;
            color: #91989D;
        }
        .progress{
            margin: 0 0 40px 40px;
            width: 50%;
        }
    }
    .title-box{
        text-align: center;
        .title{
            display: inline-block;
            width: 60%;
        }
    }
}
</style>