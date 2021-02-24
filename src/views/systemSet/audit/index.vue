<template>
    <div class="audit">

        <div class="input-box">
            <div class="input-item">
                <span class="input-label">操作用户</span>
                <el-input style="width:50%" v-model="user" placeholder="请输入内容"></el-input>
            </div>
            <div class="input-item">
                <span class="input-label">操作类型</span>
                <!-- <el-input style="width:55%" v-model="action" placeholder="请输入内容"></el-input> -->
                <el-select style="width:55%" v-model="action" placeholder="请选择" clearable>
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input-item">
                <span class="input-label">时间</span>
                <el-date-picker
                    v-model="create_date"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
        </div>
        <div class="search-box" style="margin: 30px 60px 30px 0;">
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

        <div class="btn-box">
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                :disabled="exportDisabled"
                @click="handleExport">导出</el-button>
            <el-button
                size="small"
                type="danger"
                class="red-button"
                :disabled="disabled"
                @click="handleDelete">删除</el-button>
        </div>
        <div v-loading="loading">
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                 :header-cell-style="{background:'#E6E6E6',color:'#555',textAlign:'center'}"
                 :cell-style="{textAlign:'center'}"
                 @selection-change="handleSelectionChange"
                >
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                label="ID"
                width="120">
                    <template slot-scope="scope">
                        <span style="color:rgb(75, 137, 220)">{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                label="操作类型" :formatter="actionFormat" >
                    <!-- <template slot-scope="scope"> -->
                        <!-- <span style="color:rgb(75, 137, 220)">{{ scope.row.action_flag }}</span> -->
                    <!-- </template> -->
                </el-table-column>
                <el-table-column
                prop="user"
                label="操作用户"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="ip"
                label="访问者IP地址"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="change_message"
                label="操作详情"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="create_date"
                label="操作时间"
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
    import { getAuditList, exportList, deleteList, getUid } from '@/api/systemSet' 
    import { Message } from 'element-ui'
    import { message } from '@/utils/resetMessage';
    export default {
        data() {
            return {
                loading:true,
                tableData: [],
                total:0,
                pageSize:10,
                page:1,
                disabled:true,
                exportDisabled:false,
                user:'',
                action:'',
                create_date:'',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                options: [{
                    value: '1',
                    label: '新增'
                    }, {
                    value: '2',
                    label: '更新'
                    }, {
                    value: '3',
                    label: '删除'
                    }, {
                    value: '0',
                    label: '其他操作'
                    }
                ],
            }
        },
        created() {
            
        },
        methods: {
            fetchAuditList() {
                this.loading = true;
                const params = {
                    page:this.page,
                    pageSize:this.pageSize,
                    user:this.user,
                    action:this.action,
                    create_date:this.create_date==null?'':this.create_date.toString()
                }
                getAuditList(params).then(res => {
                    if(res.code == 200){
                        this.tableData = res.data;
                        this.total = res.count;
                    }
                    this.loading = false;
                }).catch(error => {
                    this.loading = false;
                })
            },
            handlePageChange:function(page){
                this.page = page;
                this.fetchAuditList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if(val.length>0){
                    this.disabled = false;
                }else{
                    this.disabled = true;
                    
                }
                if(val.length==0){
                    this.exportDisabled = false;
                }else{
                    this.exportDisabled = true;
                }
            },
            handleDelete() {
                this.loading = true;
                let id = this.multipleSelection.map(item => item.id);
                deleteList({ids:id}).then(res => {
                    if(res.code == 200){
                        this.fetchAuditList();
                        message.success(res.data);
                    }else{
                        message.error(res.data);
                    }
                    this.loading = false;
                }).catch(error => {
                    this.loading = false;
                })
            },
            handleExport() {
                const params = {
                    tag: 'audit',
                    v: ''
                }
                getUid(params).then(res => {
                    console.log(res);
                    window.open(''+window.PLATFROM_CONFIG.baseUrl+'/user/audit/backup?key='+res.data+'','_blank');
                })
            },
            handleSearch() {
                this.page = 1;
                this.pageSize = 10;
                this.fetchAuditList();
            },
            handleClear() {
                this.user = '';
                this.action = '';
                this.create_date = '';
                this.fetchAuditList();
            },
            actionFormat(row, column) {
                if (row.action_flag === 0) {
                    return '其他操作'
                } else if (row.action_flag === 1) {
                    return '新增'
                } else if (row.action_flag === 2) {
                    return '更新'
                } else if (row.action_flag === 3) {
                    return '删除'
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.audit{
    margin-top: 30px;
}
</style>