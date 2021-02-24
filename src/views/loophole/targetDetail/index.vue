<template>
    <div class="targetDetail">
        <el-button
            size="small"
            type="default"
            class="blue-button"
            @click="goBack">返回</el-button>
        <div class="table-list" v-loading="loading">
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                 :header-cell-style="{background:'#E6E6E6',color:'#555',textAlign:'center'}"
                 :cell-style="{textAlign:'center'}"
                >
                <el-table-column
                    prop="name"
                    label="任务名称"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <p @click="handleTask(scope.row)" style="color:#4A8ADB;cursor:pointer;">{{scope.row.name}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="target"
                    label="目标"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="t_create_time"
                    label="扫描时间"
                    show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    layout="prev, pager, next"
                    :total="total"
                    @current-change="handlePageChange"
                    :page-size="pageSize" 
                    :current-page="page">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import { getDetailList } from '@/api/targetDetail'
    export default {
        name: 'targetDetail',
        data() {
            return {
                name: this.$route.params.name,
                loading: true,
                tableData: [],
                page: 1,
                pageSize: 10,
                total: 0
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                const params = {
                    name: this.name,
                    page: this.page,
                    pageSize: this.pageSize
                }
                getDetailList(params).then(res => {
                    console.log(res)
                    if(res.code == 200){
                        this.tableData = res.data;
                        this.total = res.count;
                    }
                    this.loading = false
                }).catch(error => {
                    this.loading = false
                })
            },
            handlePageChange:function(page){
                this.page = page;
                this.fetchData()
            },
            goBack() {
                this.$router.go(-1);
            },
            handleTask(row) {
                console.log(row)
                this.$router.push({ path: `/loophole/taskDetail/${row.id}/${row.tid_id}` })
            },
        },
    }
</script>
<style scoped>
    .targetDetail{
        padding: 30px 20px 0 20px;
    }
    .table-list{
        margin-top: 20px;  
    }
</style>