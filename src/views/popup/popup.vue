<template>
  <el-dialog
    title="新增"
    :visible.sync="popVisible"
    width="781px"
    confirmButtonClass = 'blue-button'
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
            <el-button class="default-button" type="info" @click="popVisible = false">取 消</el-button>
            <el-button class="blue-button" type="primary" @click="submitForm(dateList)">开 始</el-button>
        </span>
  </el-dialog>
</template>
<script>
    import { addTask } from '@/api/systemSet' 
    import { Message } from 'element-ui'
    export default {
        data() {
            return {
                popVisible: false,
                dateList:[],
                timeList:[],
                submitList:[],
                name:'',
            };
        },
        created() {
        for(let i=0;i<24;i++){
            this.timeList.push(i<10?'0'+i:i)
        }
        this.createArr();
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
                            Message.success(res.data);
                            this.popVisible = false;
                        }else{
                            Message.error(res.data)
                        }
                    })
                }
            },
            dateClick(item,index) {
                console.log(item);
                console.log(index);
                this.dateList[index].isCheched = !this.dateList[index].isCheched
            }
        },
    };
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
    </style>