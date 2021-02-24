<template>
    <div class="taskDetail">
        <el-button
            size="small"
            type="default"
            class="blue-button"
            @click="goBack">返回</el-button>
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
    import { getPluginInfo } from '@/api/loopholeList'
    export default {
        name: 'taskDetail',
        data() {
            return {
                id: this.$route.params.pid,
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
                getPluginInfo(this.id).then(res => {
                    console.log(res)
                    if(res.code == 200){
                        this.vuln_name = res.data.vuln_name;
                        this.level = res.data.level==3?'高':res.data.level==2?'中':res.data.level==1?'低':'';
                        this.description = res.data.description;
                        this.result = res.data.result;
                        this.number = res.data.number;
                        this.category = res.data.category;
                        this.solution = res.data.solution;
                        this.influences = res.data.influences;
                        this.style.background = res.data.level==3?'#EC6F5A':res.data.level==2?'#F7C65F':res.data.level==1?'#70CA63':'';
                    }
                    this.loading = false
                }).catch(error => {
                    this.loading = false
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