<template>
    <div class="detail">
        <div class="btn-box">
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                @click="goBack">返回</el-button>
        </div>
        <h3 v-if="this.$route.params.tp_name == '基线检测'" style="padding-left:20px">目标信息</h3>
        <div v-if="this.$route.params.tp_name == '基线检测'" class="input-box" style="margin-left:40px">
            <div class="input-item" style="text-align:left">
                <span class="input-label">目标地址</span>
                <span>{{info.target}}</span>
            </div>
            <div class="input-item" style="text-align:left">
                <span class="input-label">操作系统</span>
                <span>{{info.os}}</span>
            </div>
        </div>
        <div v-if="this.$route.params.tp_name == '基线检测'" class="input-box" style="margin-left:40px">
            <div class="input-item" style="text-align:left">
                <span class="input-label">MAC地址</span>
                <span>{{info.mac}}</span>
            </div>
            <div class="input-item" style="text-align:left">
                <span class="input-label">主机名</span>
                <span>{{info.hostname}}</span>
            </div>
        </div>
        <div class="tabs-box" v-loading="loading">
            <div class="top-box" v-if="this.$route.params.tp_name != '基线检测'">
                <span>总体进度</span>
                <el-progress class="progress" :stroke-width="20" :percentage="info.schedule"></el-progress>
                <div class="bt-txt">
                    <p>{{info.create_date}}</p>
                    <p>开始扫描{{info.target}}</p>
                </div>
            </div>

            <el-table
                v-if="this.$route.params.tp_name == '漏扫检测'"
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                 :header-cell-style="{background:'#E6E6E6',color:'#555',textAlign:'center'}"
                 :cell-style="{textAlign:'center'}"
                >
                <el-table-column
                    prop="level"
                    label="严重程度"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.level == 3" style="color:#EC6F59;">高危</span>
                        <span v-if="scope.row.level == 2" style="color:#F7C65F;">中危</span>
                        <span v-if="scope.row.level == 1" style="color:#6FCA63;">低危</span>
                        <span v-if="scope.row.level == 0" style="color:#56B9E0;">信息</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="vuln_name"
                    label="名称"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="target"
                    label="目标地址"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            class="blue-button"
                            @click="handleDetail(scope.row)"
                            >查看</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-table
                v-if="this.$route.params.tp_name == '端口检测'"
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                 :header-cell-style="{background:'#E6E6E6',color:'#555',textAlign:'center'}"
                 :cell-style="{textAlign:'center'}"
                >
                <el-table-column
                    prop="port"
                    label="端口"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="服务名称"
                    show-overflow-tooltip
                >
                </el-table-column>
            </el-table>

            <el-table
                v-if="this.$route.params.tp_name == '基线检测'"
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                 :header-cell-style="{background:'#E6E6E6',color:'#555',textAlign:'center'}"
                 :cell-style="{textAlign:'center'}"
                >
                <el-table-column
                    prop="vuln_name"
                    label="名称"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            class="blue-button"
                            @click="handleDetail(scope.row)"
                            >查看</el-button>
                    </template>
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
    import $ from 'jquery'
    import Vue from 'vue'
    import echarts from 'echarts'

    import "@/views/infiltration/targetDetail/index.scss"
    import { getBaseDetailList } from '@/api/targetDetail'
    import { Message } from 'element-ui'
    export default {
        name: 'targetDetail',
        
        data() {
            return {
                loading:true,
                id: this.$route.params.id,
                tag: this.$route.params.tag,
                tableData:[],
                info:{},
                total:0,
                pageSize:10,
                page:1,
            }
        },
        created() {
            console.log(this.$route.params);
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                this.loading = true
                if(this.$route.params.tp_name == '端口检测'){
                    this.tag = 'port';
                }else if(this.$route.params.tp_name == '基线检测'){
                    this.tag = 'base';
                }else if(this.$route.params.tp_name == '漏扫检测'){
                    this.tag = 'vuln';
                }
                const params = {
                    page:this.page,
                    pageSize:this.pageSize,
                }
                getBaseDetailList(this.id,this.tag,params).then(res => {
                    console.log(res)
                    if(res.code == 200){
                        this.tableData = res.data.data;
                        this.info = res.data.info;
                        this.total = res.count;
                        this.loading = false
                    }else{
                        Message.error(res.data);
                        this.loading = false
                    }

                }).catch(error => {
                    this.loading = false
                })
            },
            handleDetail(row){
                this.$router.push({path: '/loophole/taskDetail/'+row.id+'/'+this.id});
            },
            handlePageChange:function(page){
                this.page = page;
                this.fetchData()
            },
            goBack() {
                this.$router.go(-1);
            },
        },
    }
</script>
<style scoped>
.el-table--border th{
    background: rgb(230, 230, 230);
    color: rgb(85, 85, 85);
}
.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-right: none;
}
.top-box{
    width: 70%;
    margin: 0 auto 60px auto;
}
.top-box .bt-txt{
    /* margin-top: 20px; */
}
.top-box .bt-txt p:first-child{
    float: left;
}
.top-box .bt-txt p:first-child{
    float: right;
    margin-right: 80px;
}
.top-box .progress{
    margin: 20px 0;
}
</style>