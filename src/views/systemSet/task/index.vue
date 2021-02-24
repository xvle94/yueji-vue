<template>
    <div class="time">
        <div class="btn-box">
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                @click="add">新增</el-button>
            <el-button
                size="small"
                type="danger"
                class="red-button"
                :disabled="disabled"
                @click="handelDelete">删除</el-button>
        </div>
        <div v-loading="loading">
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
                prop="name"
                label="名称"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            class="blue-button"
                            @click="handleUpdate(scope.row)">更新</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="781px"
            class="dialog"
            >
                
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
    import { getTaskList, addTask, updateTask, delTask } from '@/api/systemSet' 
    import { Message } from 'element-ui'
    export default {
        data() {
            return {
                loading:false,
                disabled:true,
                tableData: [],
                multipleSelection: [],
                dialogVisible: this.$route.query.dialogVisible || false,
                ruleForm: {
                    date: '',
                },
                options:[],
                dateList:[],
                timeList:[],
                name:'',
                isCheched:false,
                submitList:[],
                title:'新增',
                id:''
            }
        },
        created() {
            for(let i=0;i<24;i++){
                this.timeList.push(i<10?'0'+i:i)
            }
        },
        methods: {
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
            fetchTaksList() {
                this.loading = true
                getTaskList().then(res => {
                    console.log(res);
                    if(res.code == 200){
                        this.tableData = res.data;
                    }else{
                        Message.error(res.data)
                    }
                    this.loading = false
                }).catch(error => {
                    this.loading = false
                })
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
                            this.fetchTaksList();
                            this.dialogVisible = false;
                        }else{
                            Message.error(res.data)
                        }
                    })
                }
            },
            add() {
                this.dialogVisible = true;
                this.name = '';
                this.title = '新增';
                this.createArr();
            },
            handleUpdate(row) {
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
                        this.fetchTaksList();
                        this.dialogVisible = false;
                    }else{
                        Message.error(res.data)
                    }
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
            handelDelete() {
                console.log(this.multipleSelection)
                let ids = [];
                this.multipleSelection.map(item => {
                    ids.push(item.id)
                })
                const params = {
                    id: ids
                }
                delTask(params).then(res => {
                    if(res.code == 200){
                        Message.success(res.data)
                        this.fetchTaksList();
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
.time{
    margin-top: 30px;
    .demo-ruleForm{
        margin: 0 60px;
    }
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
    .title-box{
        margin: 20px auto 60px auto;
        text-align: center;
        .title{
            display: inline-block;
            width: 60%;
        }
    }
    .active{
        background: #4B89DC;
    }
}
</style>