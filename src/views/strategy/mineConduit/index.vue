<template>
    <div class="mineConduit">
        <el-button
            size="small"
            type="default"
            class="blue-button"
            @click="goBack">返回</el-button>
        <!-- <el-button
            size="small"
            type="default"
            class="blue-button"
            @click="goBack">定义管道</el-button> -->
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
                    prop="id"
                    label="ID"
                >
                    <template slot-scope="scope">
                        <span style="color:#4B89DC;">{{scope.row.id}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="管道名称"
                >
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="创建时间"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-popconfirm
                            title="确定删除这条管道吗？"
                            @onConfirm="handleDelete(scope.$index, scope.row)"
                            >
                            <el-button       
                                size="mini"
                                type="danger"
                                class="red-button" 
                                slot="reference"
                                >删除
                            </el-button>
                        </el-popconfirm>
                        <el-button
                            size="mini"
                            type="primary"
                            class="blue-button"
                            @click="handleEdit(scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination
                    layout="prev, pager, next"
                    :total="total"
                    @current-change="handlePageChange"
                    :page-size="pageSize" 
                    :current-page="page">
                </el-pagination>
            </div> -->
        </div>
    </div>
</template>
<script>
    import { getList, delListItem } from '@/api/mineConduit'
    export default {
        name: 'mineConduit',
        data() {
            return {
                loading: true,
                tableData:[],
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                getList().then(res => {
                    console.log(res)
                    if(res.code == 200){
                        this.tableData = res.data
                    }
                    this.loading = false
                }).catch(error => {
                    this.loading = false
                })
            },
            goBack() {
                this.$router.go(-1);
            },
            handleDelete(index,row) {
                console.log(index);
                console.log(row.id);
                this.delFn(row.id)
            },
            delFn(id) {
                this.loading = true
                const params = {
                    id: id
                }
                delListItem(params).then(res => {
                    if(res.code == 200){
                        console.log(res)
                        this.fetchData();
                        Message.success(res.data)
                    }else{
                        Message.error(res.data)
                    }
                    this.loading = false;
                }).catch(error => {
                    this.loading = false
                })
            },
        },
    }
</script>
<style scoped>
    .mineConduit{
        padding: 30px 20px 0 20px;
        line-height: 30px;
    }
    .table-list{
        margin-top: 20px;
    }
</style>