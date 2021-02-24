<template>
    <div class="task">
        <div class="input-box">
            <div class="input-item">
                <span class="input-label">目标</span>
                <el-input style="width:50%" v-model="target" placeholder="请输入内容"></el-input>
            </div>
            <div class="input-item">
                <span class="input-label">扫描模式</span>
                <el-select style="width:55%" v-model="style" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input-item">
                <span class="input-label">扫描时间</span>
                <el-date-picker
                    v-model="create_time"
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
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                :disabled="disabled"
                @click="handlePause">暂停任务</el-button>
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                :disabled="disabled"
                @click="handleResume">恢复任务</el-button>
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                :disabled="disabled"
                @click="handleStop">停止扫描</el-button>
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                :disabled="disabled"
                @click="handleRescan">重新扫描</el-button>
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
                    label="目标"
                >
                    <template slot-scope="scope">
                        <el-link v-if="scope.row.target.search('http')!=-1" :href="scope.row.target" target="_blank" type="primary" :underline="false">{{scope.row.target}}</el-link>
                        <span v-if="scope.row.target.search('http')==-1">{{scope.row.target}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="style"
                label="扫描模式"
                >
                </el-table-column>
                <el-table-column
                prop="create_time"
                label="扫描时间"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="status"
                label="状态"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.mod==1">{{scope.row.status==1?'扫描中':scope.row.status==2?'暂停':scope.row.status==0?'结束':scope.row.status}}</span>
                        <span v-else-if="scope.row.mod==2">专家级渗透</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                <template slot-scope="scope">
                <el-popconfirm
                    title="确定删除这条记录吗？"
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
                    @click="handleSee(scope.$index, scope.row)">查看</el-button>
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
import "@/views/task/index.scss"
import { getList } from '@/api/task'
import { delListItem, stopFn, rescanFn, pauseFn, resumeFn } from '@/api/infiltration'
import { Message } from 'element-ui'
export default {
  data() {
    return {
        loading:true,
        disabled:true,
        target: '',
        style: '',
        create_time:'',
        options: [{
          value: '渗透测试',
          label: '渗透测试'
        }, {
          value: '基础扫描',
          label: '基础扫描'
        }],
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
        tableData:[],
        multipleSelection: [],
        total:0,
        pageSize:10,
        page:1
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
        var that = this;
        this.loading = true
        const params = {
            page:this.page,
            pageSize:this.pageSize,
            target:this.target,
            style:this.style,
            create_time:this.create_time==null?'':this.create_time.toString()
        }
        getList(params).then(res => {
            if(res.code == 200){
                console.log(res)
                that.tableData = res.data;
                that.total = res.count;
            }
            this.loading = false;
        }).catch(error => {
            this.loading = false
        })
    },
    //暂停任务
    handlePause() {
        const params = {
            tasks: this.multipleSelection.map(item => {return item.id})
        }
        pauseFn(params).then(res => {
            console.log(res)
            if(res.code == 200){
                Message.success(res.data);
                this.fetchData();
            }else{
                Message.error(res.data);
            }
        })
    },
    //恢复任务
    handleResume() {
        const params = {
            tasks: this.multipleSelection.map(item => {return item.id})
        }
        resumeFn(params).then(res => {
            console.log(res)
            if(res.code == 200){
                Message.success(res.data);
                this.fetchData();
            }else{
                Message.error(res.data);
            }
        })
    },
    //停止任务
    handleStop(){
        const params = {
            tasks: this.multipleSelection.map(item => {return item.id})
        }
        stopFn(params).then(res => {
            console.log(res)
            if(res.code == 200){
                Message.success(res.data);
                this.fetchData();
            }else{
                Message.error(res.data);
            }
        })
    },
    //重新扫描
    handleRescan(){
        const params = {
            tasks: this.multipleSelection.map(item => {return item.id})
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
    delFn(id) {
        this.loading = true
        const params = [id]
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
        this.create_time = '';
        this.fetchData();
    },
    handleDelete(index,row) {
        console.log(index);
        console.log(row.id);
        this.delFn(row.id)
    },
    handleSee(index,row) {
        if(row.mod == 2){
            this.$router.push({ path: `/infiltration/add`, query:{id:row.id} });
        }else{
            if(row.style == '渗透测试'){
                this.$router.push({ path: `/infiltration/targetDetail/${row.id}` })
            }else if(row.style == '基础扫描'){
                this.$router.push({ path: `/basic/targetDetail/${row.id}` })
            }
        }
    }
  }
}
</script>