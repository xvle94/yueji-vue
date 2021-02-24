<template>
    <div class="detail">
        <div class="btn-box">
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                @click="goBack">返回</el-button>
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                @click="handleStop">停止扫描</el-button>
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                @click="handlePause">暂停扫描</el-button>
            <el-button
                size="small"
                type="danger"
                class="yellow-button"
                @click="handleDownload">生成报告</el-button>
        </div>
        <div @click="drawer = true" class="journal-btn" :style="journalStyle">扫<br/>描<br/>日<br/>志</div>
        <el-drawer
            title="扫描日志"
            size="600px"
            :append-to-body="true"
            :modal="false"
            :visible.sync="drawer"
            :with-header="false">
                <div class="drawer-box">
                    <p class="title">扫描日志</p>
                    <el-table :data="scanData" border>
                        <el-table-column property="0" label="名称"></el-table-column>
                        <el-table-column property="1" label="消耗时间(s)"></el-table-column>
                    </el-table>
                    <el-divider></el-divider>
                    <div class="scan-log">
                        <ul>
                            <li v-for="info in gridData">
                                {{info.create_time | formatDate}} - {{info.plugin_name}} - {{info.msg}}
                            </li>
                        </ul>
                    </div>
                </div>
        </el-drawer>
        <div class="tabs-box" v-loading="loading">
            <el-tabs tab-position="top" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="扫描统计信息" name="1">
                    <div class="tabs-info">
                        <el-card class="box-card safe">
                            <div slot="header" class="clearfix">
                                <span class="title">安全评价</span>
                            </div>
                            <div class="card-bd">
                                <p class="number" :style="color">{{count}}</p>
                                <div class="number-info">
                                    <p class="info-evaluate">综合评价：<span :style="color">{{level}}</span></p>
                                    <el-tooltip
                                        placement="top-start"
                                        popper-class="single-tooltip"
                                        >
                                        <div class="text-wrapper" slot="content">
                                        {{content}}
                                        </div>
                                        <div class="multiple-wrap">
                                            <div class="multiple-content">
                                                {{content}}
                                            </div>
                                        </div>
                                    </el-tooltip>
                                </div>
                            </div>
                        </el-card>
                        <el-card class="box-card process">
                            <div slot="header" class="clearfix">
                                <span class="title">进程</span>
                            </div>
                            <div class="process-box">
                                <p>总体进度</p>
                                <el-progress style="margin:10px 0" :text-inside="false" :stroke-width="20" :percentage="scan_percent*100"></el-progress>
                                <p>开始扫描{{scan_now_info}}<span style="float:right;padding-right:5%">{{scan_now_time}}</span></p>
                            </div>
                        </el-card>
                    </div>
                    <div class="tabs-info">
                        <el-card class="box-card process">
                            <div class="time-box">
                                <div class="time-body">
                                    <div class="time-hd">扫描持续时间</div>
                                    <div class="time-bt">{{continue_time}}</div>
                                </div>
                                <div class="time-body">
                                    <div class="time-hd">请求</div>
                                    <div class="time-bt">{{request_count}}</div>
                                </div>
                                <div class="time-body">
                                    <div class="time-hd">平均响应时间</div>
                                    <div class="time-bt">{{response_time}}</div>
                                </div>
                                <!-- <div class="time-body">
                                    <div class="time-hd">位置</div>
                                    <div class="time-bt">{{location}}</div>
                                </div> -->
                            </div>
                        </el-card>
                    </div>
                    <div class="tabs-info">
                        <el-card class="box-card safe">
                            <div slot="header" class="clearfix">
                                <span class="title">目标信息</span>
                            </div>
                            <div class="target-info">
                                <p>目标地址<span style="float:right">{{scan_now_info}}</span></p>
                                <p>服务器<span style="float:right">{{server}}</span></p>
                                <p>操作系统<span style="float:right">{{os}}</span></p>
                                <!-- <p>识别技术<span style="float:right">{{identify}}</span></p> -->
                                <!-- <p>反应灵敏<span style="float:right">{{reaction}}</span></p> -->
                            </div>
                        </el-card>
                        <el-card class="box-card process">
                            <div slot="header" class="clearfix">
                                <span class="title">最新警报</span>
                                <div class="alert-hd">
                                    <span style="color:#EA5740">高危：{{vuln_level_count.high || 0}}</span>
                                    <span style="color:#F7C65F">中危：{{vuln_level_count.mid || 0}}</span>
                                    <span style="color:#6FCA63">低危：{{vuln_level_count.low || 0}}</span>
                                    <span style="color:#56B9E0">信息：{{vuln_level_count.info || 0}}</span>
                                </div>
                            </div>
                            <div class="alert-bd" v-for="item in vuln_detail">
                                <span style="width:10%;vertical-align:top">{{item.risk_level+'：'}}</span>
                                <!-- <span>{{item.content}}</span> -->
                                <el-tooltip
                                    style="display:inline-block;width:60%;"
                                    placement="top-start"
                                    popper-class="single-tooltip"
                                    >
                                    <span class="text-wrapper" slot="content">
                                    {{item.content}}
                                    </span>
                                    <div class="multiple-content" @click="goBlank(item)" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;cursor:pointer;">
                                        <!-- {{item.content.length>50?item.content.slice(0,50)+'...':item.content}} -->
                                        {{item.content}}
                                    </div>
                                </el-tooltip>
                                <span style="float:right;width:30%;text-align:right">{{item.create_time}}</span>
                            </div>
                        </el-card>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="漏洞" name="2">
                    <div class="loophole-box">
                        <div class="loophole-lf">
                            <el-tree :data="tree_data" node-key="id" icon-class="tree-icon" default-expand-all >
                                
                            </el-tree>
                        </div>
                        <div class="loophole-rt">
                            <div class="header">{{target}}</div>
                            <div class="info">
                                <span style="color:#EA5740">高危：{{vuln_level_count.high || 0}}</span>
                                <span style="color:#F7C65F">中危：{{vuln_level_count.mid || 0}}</span>
                                <span style="color:#6FCA63">低危：{{vuln_level_count.low || 0}}</span>
                                <span style="color:#56B9E0">信息：{{vuln_level_count.info || 0}}</span>
                            </div>
                            <el-table
                                ref="multipleTable"
                                :data="res_list"
                                tooltip-effect="dark"
                                style="width: 100%"
                                height="450"
                                :header-cell-style="{background:'#E6E6E6',color:'#555',textAlign:'center'}"
                                :cell-style="{textAlign:'center'}"
                                >
                                <el-table-column
                                    prop="risk"
                                    label="严重程度"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="info"
                                    label="漏洞名称"
                                    show-overflow-tooltip
                                >
                                    <template slot-scope="scope">
                                        <span style="cursor:pointer;color:#4a89dc" @click="goDetail(scope.row)">{{scope.row.info}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="target"
                                    label="目标地址"
                                    show-overflow-tooltip
                                >
                                </el-table-column>
                                <!-- <el-table-column
                                    prop="status"
                                    label="状态"
                                >
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.status== true">打开</span>
                                        <span v-if="scope.row.status== false">关闭</span>
                                    </template>
                                </el-table-column> -->
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="网络结构" name="3">
                    <div style="width:100%;height:100%">
                        <div ref="myChart" style="width:1300px;height:650px;margin:0 auto"></div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="事件" name="4">
                    <el-table
                        :data="eventTableData"
                        style="width: 100%;margin-bottom: 20px;"
                        row-key="id"
                        border
                        default-expand-all
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                        <el-table-column
                        prop="label"
                        label="事件"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="time"
                        label="创建时间"
                        >
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import moment from 'moment'
    import $ from 'jquery'
    import Vue from 'vue'
    import echarts from 'echarts'
    // require('echarts/extension/dataTool')
    import "@/views/infiltration/targetDetail/index.scss"
    import { getDetailInfo } from '@/api/targetDetail'
    import { stopFn, pauseFn, download } from '@/api/infiltration'
    import { Message } from 'element-ui'
    // let echarts = require("echarts/lib/echarts")
    import dataTool from "../../../utils/dataTool.js"
    export default {
        name: 'targetDetail',
        
        data() {
            return {
                loading:true,
                id: this.$route.params.id,
                tag:1,
                activeName: '1',
                color:{
                    color:'#EA5740'
                },
                content:'',
                level:'',
                count:'',
                scan_percent:'',
                scan_now_info:'',
                scan_now_time:'',
                continue_time:'',
                request_count:'',
                response_time:'',
                identify:'',
                server:'',
                reaction:'',
                os:'',
                vuln_level_count:'',
                vuln_detail:[],
                target:'',
                //漏洞
                tree_data: [],
                res_list:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                //事件列表
                eventTableData:[],
                graph:'',

                charts: null,
                legend:[],
                categories: [],
                nodes: [],
                links: [],
                nid:0,
                last_id:0,
                link_id:0,
                option: {},
                echartData:[],
                drawer: false,
                journalStyle:{
                    right:0
                },
                websock: null,
                gridData:[],
                scanData:[]
            }
        },
        created() {
            this.initWebSocket();
        },
        destroyed() {
            this.websock.close() //离开路由之后断开websocket连接
        },
        mounted() {
            this.fetchData();
            // this.renderChart(this.echartData[0]);
        },
        watch: {
            drawer: {
                handler(newVal, oldVal) {
                    if(newVal){
                        this.journalStyle.right = '600px'
                    }else{
                        this.journalStyle.right = '0'
                    }
                },
                deep: true //对象内部属性的监听，关键。
            },
        },
        filters: {
            formatDate: function (value) {
                return moment.unix(value).format('YYYY-MM-DD hh:mm:ss')
            },
        },
        methods: {
            initWebSocket(){ //初始化weosocket
                const wsuri = "wss://"+window.location.host+"/ws/log/"+this.id+"";
                this.websock = new WebSocket(wsuri);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen(){ //连接建立之后执行send方法发送数据
                console.log('成功');
                let actions = {"action":"scaning"};
                let actions2 = {"action":"log"};
                let actions3 = {"action":"login","data":localStorage.getItem('token')};
                this.websocketsend(JSON.stringify(actions3));
                this.websocketsend(JSON.stringify(actions));
                this.websocketsend(JSON.stringify(actions2));
                
            },
            websocketonerror(){//连接建立失败重连
                console.log('失败');
                this.initWebSocket();
            },
            websocketonmessage(e){ //数据接收
                const redata = JSON.parse(e.data);
                console.log(redata);
                if(redata.type == 'log'){
                    this.gridData = redata.data;
                }else if(redata.type == 'scaning'){
                    this.scanData = redata.data;
                }
            },
            websocketsend(Data){//数据发送
                this.websock.send(Data);
            },
            websocketclose(e){  //关闭
                console.log('断开连接',e);
            },
            fetchData() {
                this.loading = true
                const params = {
                    id: this.id,
                    tag:this.tag
                }
                getDetailInfo(params).then(res => {
                    console.log(res)
                    if(res.code == 200){
                        if(this.tag == 1){
                            this.content = res.data.data.evaluate_content;
                            this.level = res.data.data.evaluate_level;
                            this.count = res.data.data.score;
                            this.scan_percent = res.data.data.scan_percent;
                            this.scan_now_info = res.data.data.scan_now_info;
                            this.scan_now_time = res.data.data.scan_now_time;
                            this.continue_time = res.data.data.continue_time+'s';
                            this.request_count = res.data.data.request_count;
                            this.response_time = res.data.data.response_time.toFixed(2)+'ms';
                            this.identify = res.data.data.identify;
                            this.server = res.data.data.server;
                            this.reaction = res.data.data.reaction;
                            this.os = res.data.data.os;
                            this.vuln_detail = res.data.data.vuln_detail.slice(0,5);
                            this.color.color = res.data.data.evaluate_level=='高危'?'#EA5740':res.data.data.evaluate_level=='中危'?'#F7C65F':res.data.data.evaluate_level=='低危'?'#6FCA63':'';
                            this.vuln_level_count = res.data.data.vuln_level_count;
                            this.clearChart();
                        }else if(this.tag == 2){
                            this.res_list = res.data.data.res_list;
                            this.tree_data = res.data.tree_data;
                            this.target = res.data.data.target;
                            this.clearChart();
                        }else if(this.tag == 3){
                            this.echartData = res.data.data;
                            this.renderChart(res.data.data[0])
                        }else if(this.tag == 4){
                            this.eventTableData = res.data.data;
                            this.clearChart();
                        }
                        this.loading = false
                    }else{
                        Message.error(res.data);
                        this.loading = false
                    }

                }).catch(error => {
                    this.loading = false
                })
            },
            //暂停任务
            handlePause() {
                this.$confirm('是否暂停当前扫描?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                    }).then(() => {
                        const params = {
                            tasks: [this.id]
                        }
                        pauseFn(params).then(res => {
                            console.log(res)
                            if(res.code == 200){
                                Message.success(res.data);
                            }else{
                                Message.error(res.data);
                            }
                        })
                    }).catch(function() {});
            },
            //停止任务
            handleStop(){
                this.$confirm('是否停止当前扫描?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                    }).then(() => {
                        const params = {
                            tasks: [this.id]
                        }
                        stopFn(params).then(res => {
                            if(res.code == 200){
                                Message.success(res.data);
                            }else{
                                Message.error(res.data);
                            }
                        })
                    }).catch(function() {});
            },
            handleDownload(){
                this.$confirm('是否生成当前扫描结果报告?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                    }).then(() => {
                        const params = {
                            tag:'2',
                            id_list: [this.id]
                        }
                        download(params).then(res => {
                            console.log(res);
                            if(res.code == 200 && res.data.path){
                                // window.location.href = res.data.path;
                                // window.open(''+window.PLATFROM_CONFIG.baseUrl+'/user/audit/backup','_blank');
                                window.open(res.data.path,'_blank');
                            }else{
                                Message.error(res.message);
                            }
                        })
                    }).catch(function() {});
            },
            handleClick(tab, event) {
                console.log(tab);
                this.tag = tab.name;
                this.fetchData();
            },
            goBack() {
                this.$router.go(-1);
            },
            goDetail(row){
                console.log(row);
                this.$router.push({path: '/loophole/taskDetail/'+row.id+'/'+this.id});
            },
            renderChart(data) {
                const _this = this;
                var data = data;
                this.charts = echarts.init(this.$refs.myChart);
                for (let key in data) {
                    this.nodes.push({
                        category: key,
                        id: this.nid,
                        symbolSize: 30,
                        name: key,
                    });
                    
                    this.legend.push(key);
                    this.categories.push({ name: key });
                    this.loop_nodes(data[key], this.nid, this.last_id, this.link_id);
                }
                this.option = {
                    title: {
                        text: " ",
                        subtext: "Default layout",
                        top: "bottom",
                        left: "right",
                    },
                    tooltip: {},
                    legend: [this.legend],
                    animationDuration: 1500,
                    animationEasingUpdate: "quinticInOut",
                    series: [
                        {
                            name: "渗透站点拓扑图",
                            type: "graph",
                            layout: "force",
                            data: this.nodes,
                            links: this.links,
                            categories: this.categories,
                            roam: true,
                            focusNodeAdjacency: true,
                            itemStyle: {
                                borderColor: "#fff",
                                borderWidth: 1,
                                shadowBlur: 10,
                                shadowColor: "rgba(0, 0, 0, 0.3)",
                            },
                            label: {
                                position: "right",
                                formatter: "{a}",
                            },
                            force : { //力引导图基本配置
                                //initLayout: ,//力引导的初始化布局，默认使用xy轴的标点
                                repulsion : 100,//节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
                                gravity : 0.03,//节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                                edgeLength :80,//边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
                                layoutAnimation : true
                            },
                            lineStyle: {
                                color: "source",
                                curveness: 0.3,
                            },
                            emphasis: {
                                lineStyle: {
                                    width: 10,
                                },
                            },
                        },
                    ],
                };
                console.log(this.option);
                this.charts.setOption(this.option,true);
            },
            clearChart() {
                this.option = {}
                this.charts =  null,
                this.legend = [],
                this.categories =  [],
                this.nodes =  [],
                this.links =  [],
                this.nid = 0,
                this.last_id = 0,
                this.link_id = 0,
                this.option =  {},
                this.echartData = []
            },
            isEmptyObject(obj) {
                for (var key in obj) {
                    return true;
                }
                return false;
            },
            loop_nodes(
                data,
                root,
                last_id,
                link_id
            ) {
                for (let value in data) {
                    this.nid++;
                    this.legend.push(value);
                    this.categories.push({ name: value });
                    this.nodes.push({
                        category: value,
                        id: this.nid,
                        name: value,
                        symbolSize: 20,
                    });
                    this.links.push({
                        id: link_id,
                        name: null,
                        source: this.nid,
                        target: root,
                    });
                    if (this.isEmptyObject(data[value])) {
                        link_id = this.loop_nodes(
                            data[value],
                            this.nid,
                            this.nid,
                            link_id
                        );
                        link_id++;
                    }
                    
                    link_id++;
                }
                return link_id;
            },
            goBlank(item) {
                this.$router.push({ path: `/loophole/taskDetail/${item.id}/${item.tid_id}` })
            }
        },
    }
    // var Ctor = Vue.extend(Main)
    // new Ctor().$mount('#app')
</script>
<style scoped>
    .multiple-wrap{
    position: relative;
    cursor: pointer;
    font-size: 14px;
    line-height: 18px; 
    max-height: 54px; 
    overflow: hidden;
    word-break: break-all;
    }
    .el-table--border th{
        background: rgb(230, 230, 230);
        color: rgb(85, 85, 85);
    }
    .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
        border-right: none;
    }
    .journal-btn{
        width: 30px;
        height: 80px;
        background: #4A89DC;
        color: #fff;
        border-radius: 5px 0 0 5px;
        word-wrap: break-word;
        padding: 8px 0 0 8px;
        position: fixed;
        top: 12%;
        cursor: pointer;
        transition: 0.3s;
    }
    .drawer-box{
        padding: 30px;
    }
    .drawer-box .title{
        text-align: center;
        color: #606266;
        margin-bottom: 20px;
    }
    .scan-log li{
        margin-bottom: 5px;
    }
    ::v-deep .el-drawer__body{
        overflow: hidden;
    }
    .scan-log ul{
        overflow-y: auto;
        height: calc(100vh - 240px);
    }
    .scan-log ul::-webkit-scrollbar {
        display: none;
    }
</style>