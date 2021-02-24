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
                    label="目标">
                    <template slot-scope="scope">
                        <el-link v-if="scope.row.target.search('http')!=-1" :href="scope.row.target" target="_blank" type="primary" :underline="false">{{scope.row.target}}</el-link>
                        <span v-if="scope.row.target.search('http')==-1">{{scope.row.target}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="style"
                label="扫描类型"
                >
                </el-table-column>
                <el-table-column prop="schedule" label="定时时间"></el-table-column>
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
                        @click="handleEdit(scope.$index, scope.row)">修改</el-button>
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

        <el-dialog :title="title" :visible.sync="dialogVisible" width="781px" class="dialog">
            <div class="title-box">
                名称
                <el-input
                    placeholder="请输入内容"
                    class="title"
                    v-model="name">
                </el-input>
            </div>
            <div class="dialog-body">
                <p style="margin:0 0 6px 101px">
                    <span class="time-txt" v-for="(item,index) in timeList" :key="index">{{item}}</span>
                </p>
                <div class="week-box">
                    <p>星期日</p>
                    <p>星期一</p>
                    <p>星期二</p>
                    <p>星期三</p>
                    <p>星期四</p>
                    <p>星期五</p>
                    <p>星期六</p>
                </div>
                <div class="date-box">
                    <span @click="dateClick(item,index)" :class="item.isCheched?'active':''" v-for="(item,index) in dateList" :key="index" class="date"></span>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button class="default-button" type="info" @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="title=='新增'" class="blue-button" type="primary" @click="submitForm(dateList)">开 始</el-button>
                <el-button v-if="title=='更新'" class="blue-button" type="primary" @click="update(dateList)">更 新</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getScheduleList ,delSchedule} from '@/api/task'
import {  addTask, updateTask } from '@/api/systemSet' 
import { Message } from 'element-ui'
export default {
  data() {
    return {
        loading:true,
        disabled:true,
        target: '',
        style: '',
        options: [{
          value: '渗透测试',
          label: '渗透测试'
        }, {
          value: '基础扫描',
          label: '基础扫描'
        }],
        tableData:[],
        multipleSelection: [],
        total:0,
        pageSize:10,
        page:1,
        dialogVisible: false,
        title:'',
        dateList:[],
        timeList:[],
        name:'',
        id:''
    }
  },
  created() {
    this.fetchData()
    for(let i=0;i<24;i++){
        this.timeList.push(i<10?'0'+i:i)
    }
  },
  methods: {
    fetchData() {
        var that = this;
        this.loading = true
        const params = {
            page:this.page,
            pageSize:this.pageSize,
            // target:this.target,
            // style:this.style,
        }
        getScheduleList(params).then(res => {
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
  
    delFn(id) {
        this.loading = true
        const params = id
        delSchedule({id:params}).then(res => {
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
        this.fetchData();
    },
    handleDelete(index,row) {
        console.log(index);
        console.log(row.id);
        this.delFn(row.id)
    },

    handleListFn(listArr) {
        let obj = {};
        listArr.forEach((item, index) => {
            let { week } = item;
            let { isCheched } = item;
            if (!obj[week]) {
                obj[week] = {
                    week,
                    data: []
                }
            }
            if(item.isCheched){
                obj[week].data.push(item.time);
            }
        });
        let data = Object.values(obj);
        let arr = [];
        data.map(item => {
            if(item.data.length!=0){
                arr.push(item)
            }
        })
        this.submitList = arr;
    },
    createArr() {
        let arr = [];
        for(let i=0;i<24;i++){
            arr.push({time:i,week:7,isCheched:false})
        }
        for(let i=0;i<24;i++){
            arr.push({time:i,week:1,isCheched:false})
        }
        for(let i=0;i<24;i++){
            arr.push({time:i,week:2,isCheched:false})
        }
        for(let i=0;i<24;i++){
            arr.push({time:i,week:3,isCheched:false})
        }
        for(let i=0;i<24;i++){
            arr.push({time:i,week:4,isCheched:false})
        }
        for(let i=0;i<24;i++){
            arr.push({time:i,week:5,isCheched:false})
        }
        for(let i=0;i<24;i++){
            arr.push({time:i,week:6,isCheched:false})
        }
        this.dateList = arr;
    },
    handleEdit(index,row) {
        this.title = '更新';
        this.createArr();
        this.dialogVisible = true;
        this.name = row.name;
        this.id = row.id;
        console.log(this.dateList)
        let arr = eval("("+row.period+")")
        console.log(arr);
        console.log(arr.length);
        this.dateList.map((items,indexs) => {
            arr.map((item,index) => {
                if(items.week == item.week){
                    console.log(item.data)
                    console.log(items.week)
                    item.data.map((data,sub) => {
                        if(data == items.time){
                            this.dateList[indexs].isCheched = true
                        }
                    })
                    
                }
            })
        })
    },
    submitForm(listArr) {
        if(this.name == ''){
            Message.error('请输入名称');
        }else{
            this.handleListFn(listArr);
            const params = {
                name:this.name,
                schedule:this.submitList
            }
            addTask(params).then(res => {
                if(res.code == 200){
                    Message.success(res.data)
                    this.fetchData();
                    this.dialogVisible = false;
                }else{
                    Message.error(res.data)
                }
            })
        }
    },
    update(listArr) {
        this.handleListFn(listArr);
        const params = {
            id: this.id,
            name: this.name,
            schedule:this.submitList
        }
        updateTask(params).then(res => {
            if(res.code == 200){
                Message.success(res.data)
                this.fetchData();
                this.dialogVisible = false;
            }else{
                Message.error(res.data)
            }
        })
    },
    dateClick(item,index) {
        console.log(item);
        console.log(index);
        this.dateList[index].isCheched = !this.dateList[index].isCheched
    }
  }
}
</script>
<style lang="scss" scoped>
    .dialog-body{
        position: relative;
        margin-left: 60px;
        .date-box{
            border-left: 1px solid #aaa;
            border-top: 1px solid #aaa;
            overflow: hidden;
            margin: 0 100px;
            .date{
                display: inline-block;
                width: 20px;
                height: 20px;
                border-bottom: 1px solid #aaa;
                border-right: 1px solid #aaa;
                float: left;
            }
        }
        .time-txt{
            display: inline-block;
            width: 20px;
            font-size: 12px;
            text-align: center;
        }
        .week-box{
            display: flex;
            flex-direction: column;
            position: absolute;
            left: 48px;
            top: 23px;
            p{
                flex: 1;
                line-height: 20px;
            }
        }
    }
    .active{
        background: #4B89DC;
    }
    .title-box{
        margin: 20px auto 60px auto;
        text-align: center;
        .title{
            display: inline-block;
            width: 60%;
        }
    }
</style>