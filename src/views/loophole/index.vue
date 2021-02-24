<template>
    <div class="loophole">
        <div class="input-box">
            <div class="input-item">
                <span class="input-label">漏洞名称</span>
                <el-input style="width:50%" v-model="name" placeholder="请输入内容"></el-input>
            </div>
            <div class="input-item">
                <span class="input-label">严重程度</span>
                <el-select style="width:55%" v-model="level" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input-item">
                <div class="search-box">
                    <el-button
                        size="mini"
                        type="info"
                        class="default-button"
                        @click="handleClear">清空</el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        class="blue-button"
                        @click="handleSearch">搜索</el-button>
                </div>
            </div>
        </div>
        <div class="btn-box">
            <el-button
                :disabled="disabled2"
                size="small"
                type="warning"
                class="yellow-button"
                @click="handleAllExport">全部导出</el-button>
            <el-button
                :disabled="disabled"
                size="small"
                type="warning"
                class="yellow-button"
                @click="handleBatchExport">批量导出</el-button>
        </div>
        <div class="table-list" v-loading="loading">
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
                    width="55">
                </el-table-column>
                <el-table-column
                prop="level"
                label="严重程度"
                >
                    <template slot-scope="scope">
                        <span style="color:#409EFF" v-if="scope.row.level=== 0">信息</span>
                        <span style="color:#6FCA63" v-if="scope.row.level=== 1">低危</span>
                        <span style="color:#F7C65F" v-if="scope.row.level=== 2">中危</span>
                        <span style="color:#EC6F59" v-if="scope.row.level=== 3">高危</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="vuln_name"
                    label="漏洞名称"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <p @click="handleDetail(scope.row)" style="color:#4A8ADB;cursor:pointer;">{{scope.row.vuln_name}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                prop="count"
                label="数量"
                >
                    <template slot-scope="scope">
                        <p @click="handleDetail(scope.row)" style="color:#4A8ADB;width:50px;margin:0 auto;cursor:pointer;">{{scope.row.count}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                prop="create_time"
                label="最近出现时间"
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
import "@/views/loophole/index.scss"
import { getList } from '@/api/loophole'
    import { getUid } from '@/api/systemSet' 
export default {
    data() {
        return {
            loading:true,
            page:1,
            pageSize:10,
            name:'',
            level:'',
            options: [{
                value: '3',
                label: '高危'
            }, {
                value: '2',
                label: '中危'
            }, {
                value: '1',
                label: '低危'
            }, {
                value: '0',
                label: '信息'
            }],
            disabled:true,
            disabled2:false,
            tableData:[],
            total:0,
            multipleSelection:[],
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.loading = true
            const params = {
                page:this.page,
                pageSize:this.pageSize,
                name:this.name,
                level:this.level
            }
            getList(params).then(res => {
                if(res.code == 200){
                    console.log(res)
                    this.tableData = res.data;
                    this.total = res.count;
                }
                this.loading = false;
            }).catch(error => {
                this.loading = false
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            if(val.length>0){
                this.disabled = false
                this.disabled2 = true
            }else{
                this.disabled = true
                this.disabled2 = false
            }
        },
        handlePageChange:function(page){
            this.page = page;
            this.fetchData()
        },
        handleSearch() {
            this.page = 1;
            this.pageSize = 10;
            this.fetchData();
        },
        handleClear() {
            this.name = '';
            this.level = '';
            this.fetchData();
        },
        handleDetail(row) {
            console.log(row)
            this.$router.push({ path: `/loophole/targetDetail/${encodeURIComponent(row.vuln_name)}` })
        },
        //批量导出
        handleBatchExport() {
            const params = {
                tag: 'vuln',
                v: this.multipleSelection.map(item => item.vuln_name)
            }
            getUid(params).then(res => {
                console.log(res);
                window.open(''+window.PLATFROM_CONFIG.baseUrl+'/vuln/scan/result/export?key='+res.data+'','_blank');
            })
        },
        //全部导出
        handleAllExport() {
            const params = {
                tag: 'vuln',
                v: ''
            }
            getUid(params).then(res => {
                console.log(res);
                window.open(''+window.PLATFROM_CONFIG.baseUrl+'/vuln/scan/result/export?key='+res.data+'','_blank');
            })
        }
    }
}
</script>