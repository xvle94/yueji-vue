<template>
    <div class="report">
        <div class="input-box">
            <div class="input-item">
                <span class="input-label">目标</span>
                <el-input style="width:50%" v-model="target" placeholder="请输入内容"></el-input>
            </div>
            <div class="input-item">
                <span class="input-label">报告类型</span>
                <el-select style="width:55%" v-model="style" placeholder="请选择">
                    <el-option
                    v-for="item in reportOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input-item">
                <span class="input-label">状态</span>
                <el-select style="width:55%" v-model="status" placeholder="请选择">
                    <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
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
        <div class="btn-box">
            <el-dropdown @command="handleCommand">
                <el-button
                    size="small"
                    type="primary"
                    class="blue-button"
                    >新增报告</el-button>
                <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item v-for="item in buttonSelect" :key="item.value" :command="{value:item.value,label:item.label}">
                        {{item.label}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button
                size="small"
                type="danger"
                class="red-button"
                :disabled="disabled"
                @click="handleMultipleDelete">删除</el-button>
            <el-button
                size="small"
                type="warning"
                class="yellow-button"
                :disabled="disabled"
                @click="handleDownload">合并报告导出</el-button>
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
                    prop="target"
                    label="报告模板"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span style="color:#4B89DC;">{{scope.row.target}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="style"
                label="报告类型"
                >
                </el-table-column>
                <el-table-column
                prop="target"
                label="目标"
                >
                </el-table-column>
                <el-table-column
                prop="create_date"
                label="时间"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="status"
                label="状态"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.status===1">已完成</span>
                        <span v-if="scope.row.status===0">未完成</span>
                        <span v-if="scope.row.status===-1">失败</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="400">
                    <template slot-scope="scope">
                        <el-link :href="downLoad+'/upload/'+scope.row.filename" type="primary" target="_blank">word下载</el-link>
                        <!-- <el-divider direction="vertical"></el-divider>
                        <el-link :href="scope.row.target" type="primary" target="_blank">HTML下载</el-link>
                        <el-divider direction="vertical"></el-divider>
                        <el-link :href="scope.row.target" type="primary" target="_blank">PDF下载</el-link>
                        <el-divider direction="vertical"></el-divider>
                        <el-link :href="scope.row.target" type="primary" target="_blank">XLS下载</el-link>
                        <el-divider direction="vertical"></el-divider>
                        <el-link :href="scope.row.target" type="primary" target="_blank">DOC下载</el-link>
                        <el-divider direction="vertical"></el-divider>
                        <el-link :href="scope.row.target" type="primary" target="_blank">CSV下载</el-link> -->
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
import { getList, delListItem } from '@/api/report'
import { Message } from 'element-ui'
export default {
  data() {
    return {
        downLoad: window.PLATFROM_CONFIG.baseUrl,
        loading:true,
        target: '',
        style: '',
        status: '',
        reportOptions: [{
          value: '渗透测试',
          label: '渗透测试报告'
        }, {
          value: '基础扫描',
          label: '基础扫描报告'
        }, {
          value: '合并扫描',
          label: '合并扫描报告'
        }],
        statusOptions: [{
          value: 1,
          label: '已完成'
        }, {
          value: 0,
          label: '进行中'
        }, {
          value: -1,
          label: '失败'
        }],
        tableData:[],
        multipleSelection: [],
        total:0,
        pageSize:10,
        page:1,
        disabled:true,
        buttonSelect: [
            {
                value:'渗透测试',
                label:'渗透测试'
            },
            {
                value:'基础扫描',
                label:'基础扫描'
            },
        ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
        var that = this;
        this.loading = true;
        const params = {
            page:this.page,
            pageSize:this.pageSize,
            target:this.target,
            style:this.style,
            status:this.status
        }
        getList(params).then(res => {
            if(res.code == 200){
                console.log(res)
                that.tableData = res.data;
                that.total = res.count;
            }
            this.loading = false;
        }).catch(error => {
            this.loading = false;
        })
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
        if(val.length>0){
            this.disabled = false
        }else{
            this.disabled = true
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
        this.target = '';
        this.style = '';
        this.status = '';
        this.fetchData();
    },
    //批量删除
    handleMultipleDelete() {
        this.loading = true
        const params = this.multipleSelection.map(item => {return item.id})
        delListItem({ids:params}).then(res => {
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
    handleDownload() {
        
    },
    handleCommand(command) {
        console.log(command);
        if(command.value == '渗透测试'){
            this.$router.push({ path: `/infiltration/infiltration` })
        }else if(command.value == '基础扫描'){
            this.$router.push({ path: `/basic/basic` })
        }


    },
  }
}
</script>