<template>
    <div class="systemSet">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="产品更新" name="1">
                <update ref="updateChild"></update>
            </el-tab-pane>
            <el-tab-pane label="通用设定" name="2">
                <currency ref="currencyChild"></currency>
            </el-tab-pane>
            <el-tab-pane label="通知设置" name="3">
                <notice ref="noticeChild"></notice>
            </el-tab-pane>
            <el-tab-pane label="用户管理" name="4">
                <user ref="userChild"></user>
            </el-tab-pane>
            <el-tab-pane label="审计日志" name="5">
                <audit ref="auditChild"></audit>
            </el-tab-pane>
            <el-tab-pane label="安全设置" name="6">
                <safe ref="safeChild"></safe>
            </el-tab-pane>
            <el-tab-pane label="排除时间" name="7">
                <excludeTime ref="timeChild"></excludeTime>
            </el-tab-pane>
            <el-tab-pane label="定时时间" name="8">
                <task ref="taskChild"></task>
            </el-tab-pane>
            <el-tab-pane label="设备状态" name="9">
                <status ref="statusChild"></status>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import "@/views/systemSet/index.scss"
    import update from '@/views/systemSet/update/index.vue'
    import currency from '@/views/systemSet/currency/index.vue'
    import notice from '@/views/systemSet/notice/index.vue'
    import user from '@/views/systemSet/user/index.vue'
    import audit from '@/views/systemSet/audit/index.vue'
    import safe from '@/views/systemSet/safe/index.vue'
    import excludeTime from '@/views/systemSet/excludeTime/index.vue'
    import task from '@/views/systemSet/task/index.vue'
    import status from '@/views/systemSet/status/index.vue'
    export default {
        data() {
            return {
                activeName: this.$route.query.dialogVisible?'8':'1',
            }
        },
        components: {
            update,
            currency,
            notice,
            user,
            audit,
            safe,
            excludeTime,
            task,
            status
        },
        created() {
            
        },
        methods: {
            handleClick(tab, event) {
                if(tab.name=='1'){
                    this.$refs.updateChild.fetchUpdate();
                }else if(tab.name=='2'){
                    this.$refs.currencyChild.fetchCurrency();
                    this.$refs.currencyChild.fetchUploadList();
                }else if(tab.name=='3'){
                    this.$refs.noticeChild.fetchNotice();
                }else if(tab.name=='4'){
                    this.$refs.userChild.fetchUserList();
                    this.$refs.userChild.fetchRoleUserList();
                }else if(tab.name=='5'){
                    this.$refs.auditChild.fetchAuditList();
                }else if(tab.name=='6'){
                    this.$refs.safeChild.fetchSafe();
                }else if(tab.name=='7'){
                    this.$refs.timeChild.fetchExcludeTimeList();
                    this.$refs.timeChild.createArr();
                }else if(tab.name=='8'){
                    this.$refs.taskChild.fetchTaksList();
                    this.$refs.taskChild.createArr();
                }else if(tab.name=='9'){
                    this.$refs.statusChild.fetchDeviceStatus();
                }
            }
        }
    }
</script>
<style scoped>
.systemSet{
    margin: 0 auto;
    padding: 20px 20px 0 20px;
}
</style>