<template>
    <div class="infiltration">
        <div class="input-box">
            <div class="input-item">
                <span class="input-label">目标</span>
                <el-input style="width:50%" v-model="target" placeholder="请输入内容"></el-input>
            </div>
            <div class="input-item">
                <span class="input-label">风险级别</span>
                <el-select style="width:55%" v-model="level" placeholder="请选择">
                    <el-option
                    v-for="item in levelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input-item">
                <span class="input-label">扫描模式</span>
                <el-select style="width:55%" v-model="scan_mode" placeholder="请选择">
                    <el-option
                    v-for="item in scanningOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="input-box">
            <div class="input-item">
                <span class="input-label">状态</span>
                <el-select style="width:50%" v-model="status" placeholder="请选择">
                    <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input-item">
                <span class="input-label">扫描时间</span>
                <el-date-picker
                    style="width:55%"
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
            <el-dropdown @command="handleCommand">
                <el-button
                    size="small"
                    type="primary"
                    class="blue-button"
                    >新增</el-button>
                <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item v-for="item in buttonSelect" :key="item.value" :command="{value:item.value,label:item.label}">
                        {{item.label}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
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
                :disabled="genDisabled"
                @click="handleDownload">生成报告</el-button>
            <el-button
                size="small"
                type="warning"
                class="yellow-button"
                :disabled="difDisabled"
                @click="handleDownload">差异报告</el-button>
            <el-button
                size="small"
                type="warning"
                class="yellow-button"
                @click="templateVisible = true">导入任务</el-button>
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
                prop="scan_mod"
                label="扫描模式"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.scan_mod=== 1">自动</span>
                        <span v-if="scope.row.scan_mod=== 2">专家</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="name"
                label="名称"
                >
                </el-table-column>
                <el-table-column
                prop="scan_time"
                label="扫描时间"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="vuln_level_count"
                label="漏洞"
                >
                    <template slot-scope="scope"> 
                        高危:<span style="color:#EC6F59;margin-right:4px">{{scope.row.vuln_level_count.high}}</span>
                        中危:<span style="color:#F7C65F;margin-right:4px">{{scope.row.vuln_level_count.mid}}</span>
                        低危:<span style="color:#6FCA63;margin-right:4px">{{scope.row.vuln_level_count.low}}</span>
                        信息:<span style="color:#56B9E0;margin-right:4px">{{scope.row.vuln_level_count.info}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="status"
                label="状态"
                >
                <template slot-scope="scope"> 
                     <span v-if="scope.row.scan_mod=== 1">{{scope.row.status}}</span>
                     <span v-else>无状态</span>
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
                    @click="handlePermission(scope.row)">查看</el-button>
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
        <!-- 新增自动 -->
        <el-dialog
            title="新增-自动"
            :visible.sync="dialogVisible"
            width="580px"
            class="dialog"
            top="2%"
            >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="170px" label-position="right">
                <el-form-item label="任务名称" prop="name">
                    <el-input v-model="ruleForm.name" style="width:200px" placeholder="请输入任务名称"></el-input>
                </el-form-item>
                <el-form-item label="扫描模式" prop="scan_mode">
                    <el-radio-group v-model="ruleForm.scan_mode">
                        <el-radio label="1">自动</el-radio>
                        <el-radio label="2">手动</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="目标" prop="target">
                    <el-input v-model="ruleForm.target" style="width:200px" placeholder="请输入目标地址"></el-input>
                    <div class="tips">示例 http://192.168.1.1:8080<br/>示例 192.168.1.1<br/>示例 https://www.chinashiyue.cn/</div>
                </el-form-item>
                <el-form-item label="是否需要网站自动登录" prop="auto_login">
                    <el-radio-group v-model="ruleForm.auto_login" @change="changeRadio">
                        <el-radio label="1">需要</el-radio>
                        <el-radio label="2">不需要</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="ruleForm.auto_login==1" label="登录方式" prop="style_login">
                    <el-radio-group v-model="ruleForm.style_login">
                        <el-radio label="1">用户名密码</el-radio>
                        <el-radio label="2">cookie</el-radio>
                        <el-radio label="3">自定义</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-if="ruleForm.style_login==1">
                    <el-form-item style="margin-bottom:20px" label-width="170px" label-position="left" label="用户名" prop="username">
                        <el-input v-model="ruleForm.username" style="width:200px"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-bottom:20px" label-width="170px" label="密码" prop="password">
                        <el-input v-model="ruleForm.password" style="width:200px" show-password></el-input>
                    </el-form-item>
                    <el-form-item label-width="170px" label="图形验证码" prop="auto_verify">
                        <el-radio-group @change="changeVerifi" v-model="ruleForm.auto_verify">
                            <el-radio label="1">自动</el-radio>
                            <el-radio label="2">手动</el-radio>
                        </el-radio-group>
                        <el-link @click="innerVisible = true" style="margin-left:20px" type="info">找不到登录地址？</el-link>
                        <div v-for="item in imgUrl" style="width:95px;height:25px" v-if="ruleForm.auto_verify == '2'" v-loading="imgLoading">
                            <img style="display:block;width:100%" :src="'data:image/png;base64,'+item.data" alt="">
                        </div>
                        <el-form-item v-if="ruleForm.auto_verify == '2'" label-width="70px" label="验证码" prop="verify_code">
                            <el-input v-model="ruleForm.verify_code"></el-input>
                            <el-button size="mini" type="primary" @click="checkCode">校验</el-button>
                        </el-form-item>
                    </el-form-item>
                </div>
                <div v-if="ruleForm.style_login==2">
                    <el-form-item style="margin-bottom:20px" label-width="170px" label="cookie" prop="cookie">
                        <el-input v-model="ruleForm.cookie" style="width:200px"></el-input>
                    </el-form-item>
                </div>
                <div v-if="ruleForm.style_login==3">
                    <div
                        v-for="(item, index) in ruleForm.other" 
                        :key="item.key" 
                        style="overflow:hidden"
                    >
                        <el-form-item label="名称" :prop="'label.' + index">
                            <el-input v-model="item.label"  style="width:200px"></el-input>
                        </el-form-item>
                        <el-form-item label="值" :prop="'value.' + index">
                            <el-input v-model="item.value"  style="width:200px"></el-input>
                            <i class="el-icon-circle-plus-outline addBtn" @click="addRuleForm"></i>
                            <i class="el-icon-remove-outline addBtn" @click="removeRuleForm(item)" v-if="ruleForm.other.length !== 1"></i>
                        </el-form-item>
                    </div>
                </div>
                <el-form-item label="扫描类型" prop="scan_style">
                    <el-select v-model="ruleForm.scan_style" placeholder="请选择" @visible-change="tempChangeSelect">
                        <el-option
                            v-for="item in templateList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left:20px" size="mini" type="primary" @click="goTemplate">新增</el-button>
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
            </el-form>
            <el-dialog
                width="30%"
                :visible.sync="innerVisible"
                append-to-body>
                <span style="margin-left:20px">登录地址</span><el-input style="width:60%;margin-left:10px" v-model="address"></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button class="default-button" @click="innerVisible = false">取消</el-button>
                    <el-button class="blue-button" type="primary" @click="innerVisible = false">确定</el-button>
                </span>
            </el-dialog>
            <span slot="footer" class="dialog-footer">
                <el-button class="default-button" @click="resetForm('ruleForm')">取消</el-button>
                <el-button class="blue-button" type="primary" @click="submitForm('ruleForm')">开始</el-button>
            </span>
        </el-dialog>
        <!-- 下载模板 -->
        <el-dialog
            title="下载模板"
            :visible.sync="templateVisible"
            width="30%"
            >
            <el-button type="default" @click="handleDownTemplate">下载模板</el-button>
            <span slot="footer" class="dialog-footer">
                <el-upload
                    class="upload-demo"
                    :action="actionIp"
                    :headers="headers"
                    :on-success="handleImport"
                    multiple
                    :limit="3"
                    :file-list="fileList">
                    <el-button size="small" type="primary">导入</el-button>
                </el-upload>
                <!-- <el-button type="primary" @click="handleImport">导入</el-button> -->
                <!-- <el-button @click="templateVisible = false">取 消</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>
<script>
import this_vue from '@/main';
import { getTaskList } from '@/api/systemSet' 
import "@/views/infiltration/index.scss"
import { getList, download, add, delListItem, getTemplateList, stopFn, rescanFn, downTemplate, pauseFn, resumeFn, getVerifiCode, setLoginVerifi, sendCode } from '@/api/infiltration'
import { Message } from 'element-ui'
export default {
  data() {
    return {
        actionIp:window.PLATFROM_CONFIG.baseUrl+'/vuln/scan/task/import',
        loading:true,
        disabled:true,
        genDisabled:true,
        difDisabled:true,
        target: '',
        level:'',
        status:'',
        scan_mode: '',
        create_time:'',
        highColor:{
            color:'#f00'
        },
        buttonSelect: [
            {
                value:'自动',
                label:'自动'
            },
            {
                value:'手动',
                label:'手动'
            },
        ],
        levelOptions: [
            {
                value: '3',
                label: '高危及以上'
            },
            {
                value: '2',
                label: '中危及以上'
            },
            {
                value: '1',
                label: '低危及以上'
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
                label: '结束'
            },
        ],
        scanningOptions: [{
          value: '1',
          label: '自动'
        }, {
          value: '2',
          label: '手动'
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
        scheduleOptions:[],
        tableData:[],
        multipleSelection: [],
        total:0,
        pageSize:10,
        page:1,
        dialogVisible:false,
        innerVisible:false,
        templateVisible:false,
        ruleForm: {
            name: '',
            scan_mode: '1',
            target:'',
            auto_login:'2',
            scan_style: '',
            schedule:'',
            username:'',
            password:'',
            auto_verify:'',
            style_login:'',
            cookie:'',
            other:[{
                key: '',
                value: ''
            }],
            verify_code:'',
            verify_auth:''
        },
        rules: {
            name: [
                { required: true, message: '请输入名称', trigger: 'blur' },
                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            scan_mode: [
                { required: true, message: '请选择扫描模式', trigger: 'change' }
            ],
            target: [
                { required: true, message: '请输入域名地址或IP地址', trigger: 'blur' }
            ],
            auto_login: [
                { required: true, message: '是否需要网站自动登录', trigger: 'change' }
            ],
            scan_style: [
                {  required: true, message: '请至少选择一个扫描类型', trigger: 'change' }
            ],
            schedule: [
                { required: false, message: '请选择schedule', trigger: 'change' }
            ],
            username: [
                { required: false, message: '请输入用户名', trigger: 'blur' }
            ],
            password: [
                { required: false, message: '请输入密码', trigger: 'blur' }
            ],
            auto_verify: [
                { required: true, message: '请选择自动或手动', trigger: 'change' }
            ],
            style_login: [
                { required: true, message: '请选择登录方式', trigger: 'change' }
            ],
            cookie: [
                { required: false, message: '请输入cookie', trigger: 'blur' },
            ],
            other: [
                { required: true, message: '请输入token', trigger: 'blur' },
            ],
            verify_code: [
                { required: true, message: '请输入验证码', trigger: 'blur' }
            ],
        },
        templateList:[],
        fileList:[],
        headers:{token:localStorage.getItem('token')},
        address: '',
        imgUrl:'',
        imgLoading:false,
        uuid:'',
        feature:''
    }
  },
  created() {
    this.fetchData();
    this.fetchTemplate();
    this.fetchTaksList();
  },
  methods: {
    fetchData() {
        var that = this;
        this.loading = true
        const params = {
            page:this.page,
            pageSize:this.pageSize,
            target:this.target,
            level:this.level,
            scan_mode:this.scan_mode,
            status:this.status,
            s_time:this.create_time==null?'':this.create_time[0],
            e_time:this.create_time==null?'':this.create_time[1],
        }
        getList(params).then(res => {
            if(res.code == 200){
                console.log(res)
                that.tableData = res.data.data;
                that.total = res.data.total;
            }
            this.loading = false;
        }).catch(error => {
            this.loading = false
        })
    },
    //新增下拉菜单
    handleCommand(command){
        if(command.value == '自动'){
            this.dialogVisible = true;
        }else if(command.value == '手动'){
            this.$router.push({ path: `/infiltration/add` });
        }
    },
    fetchTemplate(){
        getTemplateList({style:'渗透测试'}).then(res => {
            if(res.code == 200){
                this.templateList = res.data
            }
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
            this.loading = false;
        })
    },
    //验证码校验
    checkCode(){
        const params = {
            uuid:this.uuid,
            feature:this.feature,
            code:this.ruleForm.verify_code,
            username:this.ruleForm.username,
            password:this.ruleForm.password
        }
        sendCode(params).then(res => {
            console.log(res);
            if(res.code == 200){
                this.ruleForm.verify_auth = res.data;
            }
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
                Message.success(res.data);
            }else{
                Message.error(res.data);
            }
            this.loading = false;
        }).catch(error => {
            this.loading = false;
        })
    },
    //添加自定义input
    addRuleForm(){
        this.ruleForm.other.push({
            label: '',
            value: '',
            key: Date.now()
        })
    },
    //删除自定义input
    removeRuleForm(item){
        var index = this.ruleForm.other.indexOf(item)
        if (index !== -1) {
            this.ruleForm.other.splice(index, 1)
        }
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
        if(val.length>0){
            this.disabled = false;
        }else{
            this.disabled = true;
        }
        if(val.length == 1){
            this.genDisabled = false;
        }else{
            this.genDisabled = true;
        }
        if(val.length > 1){
            this.difDisabled = false;
        }else{
            this.difDisabled = true;
        }
    },
    changeRadio(val){
        console.log(val);
        if(val == 2){
            this.ruleForm.style_login = '';
        }
    },
    handlePageChange:function(page){
        this.page = page;
        this.fetchData();
    },
    handleSearch() {
        this.page = 1;
        this.pageSize = 10;
        this.fetchData();
    },
    handleClear() {
        this.target = '';
        this.level = '';
        this.scan_mode = '';
        this.status = '';
        this.create_time = '';
        this.fetchData();
    },
    handleDelete(index,row) {
        this.delFn(row.id);
    },
    handleDownload(){
        const params = {
            tag:'2',
            id_list:this.multipleSelection.map(item => {return item.id.toString()})
        }
        this.loading = true;
        download(params).then(res => {
            if(res.code == 200 && res.data.path){
                window.open(res.data.path,'_blank');
            }else{
                Message.error(res.message);
            }
            this.loading = false;
        })
    },
    handlePermission(row) {
        if (row["scan_mod"]==2){
            this.$router.push({ path: `/infiltration/add`, query:{id:row.id} });
        }else{
            this.$router.push({ path: `/infiltration/targetDetail/${row.id}` });
        }
    },
    //下载模板
    handleDownTemplate() {
        window.open(''+window.PLATFROM_CONFIG.baseUrl+'/vuln/scan/task/import/template','_blank');
    },
    //导入模板
    handleImport(res) {
        console.log(res)
        if(res.code == 200){
            Message.success(res.data);
            this.fetchData();
        }else{
            Message.error(res.data);
        }
        this.templateVisible = false;
    },



    //新增弹窗function
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                let params = this.ruleForm;
                let arr = [];
                arr = params.other.map(item => {
                    return {key:item.label,value:item.value}
                })
                params.other = arr;
                // const params = {
                //     scan_mod: this.ruleForm.scan_mod,
                //     target: this.ruleForm.target,
                //     auto_login: this.ruleForm.auto_login,
                //     username: this.ruleForm.username,
                //     password: this.ruleForm.password,
                //     auto_verify: this.ruleForm.auto_verify,
                //     scan_style: this.ruleForm.scan_style,
                //     name: this.ruleForm.name,
                //     schedule: this.ruleForm.schedule,
                // }、
                this.templateList.map(item => {
                    if(item.id == params.scan_style){
                        if(item.is_ddos){
                            this.$confirm('可能攻击中含有DOS，DDOS等攻击手段，可能会对系统造成不良影响，确实是否继续攻击吗?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                                }).then(() => {
                                    add(params).then(res => {
                                        if(res.code == 200){
                                            this.fetchData();
                                            Message.success(res.message);
                                            this.$refs[formName].resetFields();
                                            this.dialogVisible = false;
                                        }else{
                                            Message.error(res.data);
                                        }
                                    }).catch(error => {
                                        this.dialogVisible = false;
                                    })
                                }).catch(() => {
                                        
                            });
                        }else{
                            add(params).then(res => {
                                if(res.code == 200){
                                    this.fetchData();
                                    Message.success(res.message);
                                    this.$refs[formName].resetFields();
                                    this.dialogVisible = false;
                                }else{
                                    Message.error(res.data);
                                }
                            }).catch(error => {
                                this.dialogVisible = false;
                            })
                        }
                    }
                })
                
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    resetForm(formName) {
        this.dialogVisible = false;
        this.$refs[formName].resetFields();
    },
    changeVerifi(value) {
        if(value == '2'){
            this.imgLoading = true;
            const params = {
                target: this.ruleForm.target,
                logUrl: this.address,
            }
            getVerifiCode(params).then(res => {
                if(res.code == 200){
                    this.imgUrl = res.data.images;
                    this.uuid = res.data.uuid,
                    this.feature = res.data.images[0].featureId
                    this.imgLoading = false;
                }
            }).catch(error => {
                this.imgLoading = false;
            })
        }
    },
    goTemplate() {
        this_vue.$template({
            tempVisible: true,
            click: () => {
                // 点击按钮事件
                
            }
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
    tempChangeSelect(flag){
        if(flag){
            this.fetchTemplate();
        }
    }
  }
}
</script>
<style>
    .addBtn{
        font-size:24px;
        cursor:pointer;
        vertical-align:middle;
        margin-left: 10px;
    }
    .tips{
        font-size: 12px;
        line-height: normal;
        color: #aaa;
    }
</style>