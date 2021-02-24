<template>
    <div class="update" v-loading="loading">
        <el-radio-group v-model="auto_update" @change="changeSetUpdate">
            <el-radio :label="'1'">自动下载并安装更新</el-radio>
            <el-radio :label="'2'">新版本更新时通知我</el-radio>
            <el-radio :label="'3'">不要自动检查更新（不推荐）</el-radio>
        </el-radio-group>
        <div class="version-box">
            <div style="flex:1">
                <p style="margin:6px 0">当前版本：<span style="color:rgb(75, 137, 220);">{{version}}</span></p>
                <p style="color:#aaa;font-size:14px;margin-bottom:20px">{{check}}</p>
                <p style="margin:6px 0">当前插件版本：<span style="color:rgb(75, 137, 220);">{{version_plugin}}</span></p>
                <p style="color:#aaa;font-size:14px">{{check_p}}</p>
            </div>
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                style="height:40px"
                @click="checkUpdate">检查更新</el-button>
            <el-upload
                class="upload-demo"
                :action="actionIp"
                :headers="headers"
                name="file"
                :data="file"
                multiple
                :limit="3"
                :file-list="fileList">
                <el-button size="small" type="primary" class="blue-button" style="height:40px">手动更新</el-button>
            </el-upload>
        </div>
    </div>
</template>
<script>
    import { getUpdateInfo, setUpdate } from '@/api/systemSet' 
    import { Message } from 'element-ui'
    export default {
        data() {
            return {
                actionIp:window.PLATFROM_CONFIG.baseUrl+'/user/conf/update/up',
                loading:true,
                version:'',
                auto_update:'',
                version_deploy:'',
                version_plugin:'',
                check:'',
                check_p:'',
                fileList:[],
                headers:{token:localStorage.getItem('token')},
                file: {
                    style:'offline',
                    module:'p',
                    // file:this.fileList
                }
            }
        },
        created() {
            this.fetchUpdate()
        },
        methods: {
            fetchUpdate() {
                this.loading = true;
                getUpdateInfo().then(res=>{
                    console.log(res);
                    if(res.code == 200){
                        this.version = res.data.version_deploy;
                        this.auto_update = res.data.auto_update;
                        this.version_deploy = res.data.version_deploy;
                        this.version_plugin = res.data.version_plugin;
                        this.check = res.data.check==true?'您当前不是最新版本':'您正在使用最新版本';
                        this.check_p = res.data.check_p==true?'您当前插件不是最新版本':'您正在使用最新插件';
                    }
                    this.loading = false;
                }).catch(error => {
                    this.loading = false;
                })
            },
            checkUpdate() {
                this.fetchUpdate()
            },
            changeSetUpdate(value) {
                console.log(value);
                setUpdate({'auto_update':value}).then(res => {
                    console.log(res);
                    if(res.code == 200){
                        Message.success(res.data);
                    }else{
                        Message.error(res.data);
                    }
                }).catch(error => {
                    
                })
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            }
        }
    }
</script>
<style lang="scss" scoped>
.update{
    margin: 30px 0 0 100px;
    .version-box{
        margin-top: 80px;
        display: flex;
        flex-direction: row;
        width: 500px;
        padding:20px 0;
    }
}
</style>