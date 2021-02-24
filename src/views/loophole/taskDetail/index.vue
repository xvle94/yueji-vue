<template>
    <div class="taskDetail">
        <el-button
            size="small"
            type="default"
            class="blue-button"
            @click="goBack">返回</el-button>
        <el-button
            size="small"
            type="default"
            class="blue-button"
            @click="handleRescan">重新扫描</el-button>
        <div class="info-box">
            <p>{{vuln_name}}</p>
            <div class="level" :style="style">{{level}}</div>
            <p class="title">漏洞描述</p>
            <div>{{description}}</div>
            <p class="title">攻击细节</p>
            <div>{{result}}</div>
            <p class="title">此漏洞的影响</p>
            <div>{{influences}}</div>
            <p class="title">如何修复此漏洞</p>
            <div>{{solution}}</div>
            <p class="title">分类</p>
            <div>
                <el-tag v-for="i in category">{{i}}</el-tag>
            </div>
        </div>
    </div>
</template>
<script>
    import { getTaskDetail } from '@/api/targetDetail'
    import { rescanFn } from '@/api/infiltration'
    import { Message } from 'element-ui'
    export default {
        name: 'taskDetail',
        data() {
            return {
                id: this.$route.params.id,
                tid_id: this.$route.params.tid_id,
                loading: true,
                vuln_name:'',
                level:'',
                result:'',
                solution:'',
                description:'',
                influences:'',
                number:'',
                category:'',
                style:{
                    background: '#F14F4F'
                }
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                const params = this.tid_id+'/'+this.id
                getTaskDetail(params).then(res => {
                    console.log(res)
                    if(res.code == 200){
                        this.vuln_name = res.data[0].vuln_name;
                        this.level = res.data[0].level==3?'高':res.data[0].level==2?'中':res.data[0].level==1?'低':'';
                        this.description = res.data[0].description;
                        this.result = res.data[0].result;
                        this.number = res.data[0].number;
                        this.category = res.data[0].category;
                        this.solution = res.data[0].solution;
                        this.influences = res.data[0].influences;
                        this.style.background = res.data[0].level==3?'#EC6F5A':res.data[0].level==2?'#F7C65F':res.data[0].level==1?'#70CA63':''
                    }
                    this.loading = false
                }).catch(error => {
                    this.loading = false
                })
            },
            //重新扫描
            handleRescan(){
                const params = {
                    tasks: [this.tid_id]
                }
                rescanFn(params).then(res => {
                    console.log(res)
                    if(res.code == 200){
                        Message.success(res.data);
                        this.fetchData();
                    }else{
                        Message.error(res.data);
                    }
                })
            },
            goBack() {
                this.$router.go(-1);
            }
        },
    }
</script>
<style scoped>
    .taskDetail{
        padding: 30px 20px 0 20px;
        line-height: 30px;
    }
    .info-box{
        margin: 30px 100px;
        color: #777877;
    }
    .level{
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        /* background: #F14F4F; */
        color: #fff;
        font-size: 12px;
    }
    .title{
        border-bottom: 1px solid #F14F4F;
        margin-top: 20px;
    }
</style>