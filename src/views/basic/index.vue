<template>
    <div class="basic">
        <div class="input-box">
            <div class="input-item">
                <span class="input-label">目标</span>
                <el-input style="width:50%" v-model="target" placeholder="请输入内容"></el-input>
            </div>
            <div class="input-item">
                <span class="input-label">扫描类型</span>
                <el-select style="width:55%" v-model="tp_name" placeholder="请选择">
                    <el-option
                    v-for="item in scanOptions"
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
        <div class="input-box">
            <div class="input-item">
                <span class="input-label">扫描时间</span>
                <el-date-picker
                    style="width:50%"
                    v-model="create_time"
                    type="daterange"
                    align="left"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
            <div class="input-item"></div>
            <div class="input-item">
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
        <div class="btn-box">
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                @click="dialogVisible = true">新增</el-button>
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
                @click="handleDownload">生成报告</el-button>
            <el-button
                size="small"
                type="warning"
                class="yellow-button"
                :disabled="disabled"
                @click="handleSearch">差异报告</el-button>
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
                        <span style="color:#4B89DC;" v-if="scope.row.target.search('http')==-1">{{scope.row.target}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="tp_name"
                label="扫描类型"
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
                        <span>{{scope.row.status==1?'扫描中':scope.row.status==2?'暂停':scope.row.status==0?'已完成':scope.row.status}}</span>
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
                    @click="handlePermission(scope.row)"
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
        <el-dialog
            title="新增"
            :visible.sync="dialogVisible"
            width="580px"
            class="dialog"
            >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="170px" label-position="right">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="ruleForm.name" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="目标" prop="target">
                    <el-input v-model="ruleForm.target" style="width:200px" placeholder="请输入目标地址"></el-input>
                    <div class="tips">示例 http://192.168.1.1:8080<br/>示例 192.168.1.1<br/>示例 https://www.chinashiyue.cn/</div>
                </el-form-item>
                <el-form-item label="扫描类型" prop="style">
                    <el-radio-group v-model="ruleForm.style">
                        <el-radio
                            v-for="item in templateList"
                            :key="item.id"
                            :label="item.id">
                            {{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="定时计划" prop="schedule">
                    <el-select v-model="ruleForm.schedule" placeholder="请选择" @visible-change="changeSelect">
                        <el-option
                            v-for="item in scheduleOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left:20px" size="mini" type="primary" @click="goTime">新增</el-button>
                </el-form-item>
                <el-form-item label="是否使用本地dns" prop="dns">
                    <el-radio-group v-model="ruleForm.dns">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('ruleForm')">开始</el-button>
                <el-button @click="resetForm('ruleForm')">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="查看"
            :visible.sync="sawVisible"
            width="400px"
            class="dialog"
            >
                <el-form :model="detailForm" ref="detailForm" style="margin:0 20px" label-width="80px" label-position="right">
                    <el-form-item label="IP地址" prop="target">
                        <el-input v-model="detailForm.target" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="端口信息" prop="port">
                        <el-input v-model="detailForm.port" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="端口号" prop="port">
                        <el-input v-model="detailForm.port" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="系统版本" prop="version">
                        <el-input v-model="detailForm.version" disabled></el-input>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sawVisible = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import this_vue from '@/main';
import { getList, add, getDetail } from '@/api/basic'
import { download, delListItem, stopFn, rescanFn ,getTemplateList, pauseFn, resumeFn } from '@/api/infiltration'
import { getTaskList } from '@/api/systemSet' 
import { Message } from 'element-ui'
// import { ip } from '@/../public/ip.js'
console.log(window.PLATFROM_CONFIG.baseUrl);
    export default {
        data() {
            return {
                loading:true,
                disabled:true,
                tableData:[],
                multipleSelection: [],
                total:0,
                pageSize:10,
                page:1,
                target:'',
                tp_name:'',
                status:'',
                create_time:'',
                //扫描类型
                scanOptions: [
                    {
                        value: 'web',
                        label: 'web'
                    },
                    {
                        value: '基线检测',
                        label: '基线检测'
                    },
                    {
                        value: '端口扫描',
                        label: '端口扫描'
                    },
                ],
                statusOptions: [
                    {
                        value: '2',
                        label: '暂停'
                    },
                    {
                        value: '1',
                        label: '扫描中'
                    },
                    {
                        value: '0',
                        label: '已完成'
                    },
                ],
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
                scheduleOptions:[],
                dialogVisible:false,
                sawVisible:false,
                ruleForm: {
                    name: '',
                    target:'',
                    style:[],
                    schedule:'',
                    dns: '',
                },
                rules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    target: [
                        { required: true, message: '输入域名地址或IP地址', trigger: 'blur' }
                    ],
                    style: [
                        { required: true, message: '请选择扫描类型', trigger: 'change' }
                    ],
                    schedule: [
                        { required: false, message: '请选择schedule', trigger: 'change' }
                    ],
                    dns: [
                        { required: true, message: '请选择是否使用本地dns', trigger: 'change' }
                    ],
                },
                detailForm: {
                    target:'',
                    port:'',
                    version:'',
                },
                templateList:[]
            }
        },
        created() {
            this.fetchData();
            this.fetchTemplate();
            this.fetchTaksList();
        },
        methods: {
            fetchData() {
                this.loading = true;
                const params = {
                    page:this.page,
                    pageSize:this.pageSize,
                    target:this.target,
                    tp_name:this.tp_name,
                    status:this.status,
                    create_time:this.create_time==null?'':this.create_time.toString(),
                }
                getList(params).then(res => {
                    if(res.code == 200){
                        console.log(res)
                        this.tableData = res.data;
                        this.total = res.count;
                    }
                    this.loading = false;
                }).catch(error => {
                    this.loading = false;
                })
            },
            fetchTaksList() {
                getTaskList().then(res => {
                    if(res.code == 200){
                        console.log(res);
                        this.scheduleOptions = res.data
                    }else{
                        Message.error(res.data)
                    }
                }).catch(error => {
                    
                })
            },
            goTime() {
                this_vue.$popup({
                    popVisible: true,
                    click: () => {
                        // 点击按钮事件
                        
                    }
                })
            },
            changeSelect(flag) {
                if(flag){
                    this.fetchTaksList();
                }
            },
            fetchTemplate(){
                getTemplateList({style:'基础扫描'}).then(res => {
                    if(res.code == 200){
                        this.templateList = res.data
                    }
                })
            },
            handlePermission(row) {
                this.$router.push({ path: `/basic/targetDetail/${row.id}/${row.tp_name}` })
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
                this.tp_name = '';
                this.status = '';
                this.create_time = '';
                this.fetchData();
            },
            handleDelete(index,row) {
                console.log(index);
                console.log(row.id);
                this.delFn(row.id)
            },
            handleDownload(){
                const params = {
                    tag:'2',
                    id_list:this.multipleSelection.map(item => {return item.id})
                }
                download(params).then(res => {
                    console.log(res);
                    if(res.code == 200){
                        window.location.href = res.data.path
                    }else{
                        Message.error(res.data);
                    }
                })
            },

            //新增弹窗function
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const params = this.ruleForm;
                        add(params).then(res => {
                            console.log(params)
                            console.log(res);
                            if(res.code == 200){
                                let name = '';
                                this.templateList.map(item => {
                                    if(item.id == params.style){
                                        name = item.name
                                    }
                                })
                                if(name == '基线检测'){
                                    this.$alert('<p>linux使用 curl '+window.PLATFROM_CONFIG.baseUrl+'/vuln/scan/base/scan/'+res.id+'/basline?sys=linux | sh</p><p>windows<a href="'+window.PLATFROM_CONFIG.baseUrl+'/vuln/scan/base/scan/'+res.id+'/basline?sys=win" target="_blank" style="color:rgb(75, 137, 220)"> 下载 </a>后打开压缩包并运行</p>', '提示', {
                                        dangerouslyUseHTMLString: true,
                                        confirmButtonText: '确定',
                                        callback: action => {
                                            
                                        }
                                    });
                                }
                                this.fetchData();
                                Message.success(res.data);
                                this.$refs[formName].resetFields();
                            }else{
                                Message.error(res.data);
                            }
                            this.dialogVisible = false
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.dialogVisible = false
                this.$refs[formName].resetFields();
            }
                }
            }
</script>
<style>
    .basic{
        padding: 20px;
    }
    .tips{
        font-size: 12px;
        line-height: normal;
        color: #aaa;
    }
</style>