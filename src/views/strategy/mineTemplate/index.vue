<template>
    <div class="mineTemplate">
        <div class="input-box">
            <div class="input-item">
                <span class="input-label">模板名称</span>
                <el-input style="width:50%" v-model="name" placeholder="请输入内容"></el-input>
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
            <div class="input-item"></div>
        </div>
        <div class="search-box">
            <el-button
                size="mini"
                type="default"
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
                @click="goTemplate">新建模板</el-button>
            <el-button
                size="small"
                type="primary"
                class="blue-button"
                @click="conduitVisible = true">定义管道</el-button>
            <el-button
                size="small"
                type="warning"
                class="yellow-button"
                @click="handelMineConduit">我的管道</el-button>
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
                    prop="id"
                    label="ID"
                >
                    <template slot-scope="scope">
                        <span style="color:#4B89DC;">{{scope.row.id}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="模板名称"
                >
                </el-table-column>
                <el-table-column
                    prop="sun"
                    label="插件数量"
                >
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="创建时间"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-popconfirm
                            title="确定删除这条模板吗？"
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
                            @click="handleEdit(scope.row)">修改</el-button>
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
            title="定义管道"
            :visible.sync="conduitVisible"
            width="800px"
            class="dialogPipe"
            >
            <div style="text-align: center">
                <div class="input-box" style="margin:0 0 40px 0">
                    <div class="input-item">
                        <span style="margin-right:20px">请输入管道名</span>
                        <el-input style="width:50%" v-model="pipeName" placeholder="请输入内容"></el-input>
                    </div>
                </div>
                <!-- 最外层容器监mouse系列事件, 用来做节点拖拽 -->
                <div
                    class="diagramExample"
                    @mousedown="startNodesBus($event)"
                    @mousemove="moveNodesBus($event)"
                    @mouseup="endNodesBus($event)"
                >
                    <!-- 左侧导航 -->
                    <div class="page-left">
                    <div
                        class="basic-node"
                        v-for="(item, i) in initNodesBasic"
                        :key="'nodes_basic' + i"
                        @mousedown="dragIt(item)"
                    >{{item.name}}</div>
                    </div>

                    <!-- DAG-Diagram主体 -->
                    <DAGBoard
                    ref="DAGBoard"
                    :DataAll="yourJSONDataFillThere"
                    @updateDAG="updateDAG"
                    @editNodeDetails="editNodeDetails"
                    @doSthPersonal="doSthPersonal"
                    ></DAGBoard>

                    <!-- 用来模拟拖拽添加的元素 -->
                    <node-bus
                    v-show="dragBus"
                    :value="busValue.value"
                    :pos_x="busValue.pos_x"
                    :pos_y="busValue.pos_y"
                    />
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSubmit">确定</el-button>
                <el-button @click="conduitVisible = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import this_vue from '@/main';
import treeTransfer from 'el-tree-transfer'
import { getList, getPluginList, addTemplate, delListItem, getPluginInfo, getPipeList } from '@/api/mineTemplate'
import { Message } from 'element-ui'
import { diagramExampleData, JSONFromService, nodesBasic } from './data.js'
export default {
  data() {
    return {
        dialogVisible:this.$route.query.dialogVisible || false,
        conduitVisible:false,
        transferData:[],
        title: ["所有插件","启动插件"],    //标题 类型：Array 必填：false 默认：["源列表", "目标列表"]
        mode: "transfer", //设置模式，字段可选值为transfer|addressList 类型：String 必填：false 补充：mode默认为transfer模式，即树形穿梭框模式，可配置字段为addressList改为通讯录模式，通讯录模式时按钮不可自定义名字，如要自定义标题名在title数组传入四个值即可，addressList模式时标题默认为通讯录、收件人、抄送人、密送人
        fromData:[],
        toData:[] ,   //目标数据 类型：Array 必填：true 补充：数据格式同element-ui tree组件，但必须有id和pid
        vuln:[],
        common:'',
        templateName:'',
        pipeArr:[],
        loading:true,
        name: '',
        create_time:'',
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
        page:1,
        pipeList:[],

        //我的管道
        pipeName:'',
        data: this.diagramExampleData,
        defaultProps: {
            children: 'children',
            label: 'label'
        },
        initNodesBasic: nodesBasic,
        // 以下为svg必要内容
        dragBus: false, // 是否在拖拽,
        yourJSONDataFillThere: { // 用来展示的节点与连线
            nodes: [],
            sides: []
        },
        // 以下为拖拽方式添加节点必须内容
        busValue: {
            value: "name",
            pos_x: 100,
            pos_y: 100
        },
        // 以下为表单展示数据
        formDetail: {
            currentEditNodeId: null,
            form: {}
        },
        // 监听的事件
        onkeydown: null,
        // 复制的内容
        copyContent: [],
        subArr: [],
    }
  },
  created() {
    this.fetchData();
    this.fetchPluginList();
    this.fetchPipeList();
    this.loadJSON()
  },
  beforeDestroy() {
    this.onkeydown = null // 销毁事件
  },
  methods: {
    goTemplate() {
        this_vue.$template({
            tempVisible: true,
            click: () => {
                // 点击按钮事件
                console.log('sss');
            }
        })
    },
    updateDAG (data, action, id) {
      console.log(...arguments)
      console.log(JSON.stringify(arguments[0]))
      switch (action) {
        case 'selectNode':
            this.showNodeDetails(data.nodes.find(item => item.id === id))
            break;
        case 'addEdge':
            console.log(data);
            console.log(action);
            console.log(id);
            let obj = {};
            let key = '';
            let value = [];
            for(let i=0;i<data.nodes.length;i++){
                for(let j=0;j<data.edges.length;j++){
                    if(data.nodes[i].id == data.edges[j].src_node_id){
                        if(data.edges[j].length>1){
                            if(data.edges[j+1].src_node_id != data.edges[j].dst_node_id){
                                // key = data.nodes[i].form.details;
                                key = data.nodes[i].name;
                                console.log(key);
                            }
                        }else{
                            if(data.edges[j].src_node_id != data.edges[j].dst_node_id){
                                // key = data.nodes[i].form.details;
                                key = data.nodes[i].name;
                                console.log(key);
                            }
                        }

                    }
                    if(data.nodes[i].id == data.edges[j].dst_node_id){
                        // value = data.nodes[i].form.details;
                        value.push(data.nodes[i].name);
                        console.log(value);
                        obj[key] = value
                    }
                }
            }
            console.log(obj);
            break;
        default: () => {}
      }
    },
    editNodeDetails() {
      console.log(...arguments)
    },
    doSthPersonal() {
      console.log(...arguments)
    },
    loadJSON() {
      // 这里可以跟服务端交互获取数据
      setTimeout(() => {
              this.yourJSONDataFillThere = JSONFromService
            //   this.yourJSONDataFillThere = {}
      }, 500);
    },
    /**
     * 通过拖拽方式加入新节点必须的函数
     */
    startNodesBus(e) {
      /**
       *  别的组件调用时, 先放入缓存
       * dragDes: {
       *    drag: true,
       *    name: 组件名称
       *    type: 组件类型
       *    model_id: 跟后台交互使用
       * }
       **/
      console.log(e);
      let dragDes = null;
      if (sessionStorage["dragDes"]) {
        dragDes = JSON.parse(sessionStorage["dragDes"]);
      }
      if (dragDes && dragDes.drag) {
        const x = e.layerX;
        const y = e.layerY;
        this.busValue = Object.assign({}, this.busValue, {
          pos_x: x,
          pos_y: y,
          value: dragDes.name
        });
        this.dragBus = true;
      }
    },
    moveNodesBus(e) {
        console.log(e);
      // 移动模拟节点
      if (this.dragBus) {
        const x = e.clientX;
        const y = e.clientY;
        this.busValue = Object.assign({}, this.busValue, {
          pos_x: x,
          pos_y: y
        });
      }
    },
    endNodesBus (e) {
      // 节点放入svg
      let dragDes = null;
      if (sessionStorage["dragDes"]) {
        dragDes = JSON.parse(sessionStorage["dragDes"]);
      }
      if (dragDes && dragDes.drag && e.toElement.id === "svgContent") {
        const pos_x =
          (e.offsetX - 90 - (sessionStorage["svg_left"] || 0)) /
          (sessionStorage["svgScale"] || 1); // 参数修正
        const pos_y =
          (e.offsetY - 15 - (sessionStorage["svg_top"] || 0)) /
          (sessionStorage["svgScale"] || 1); // 参数修正
        delete dragDes.drag
        const params = {
          model_id: sessionStorage["newGraph"],
          desp: {
            pos_x,
            pos_y,
            name: this.busValue.value,
            ...dragDes
          }
        };
        console.log(this.yourJSONDataFillThere);
        this.yourJSONDataFillThere.nodes.push({
          ...params.desp,
          id: this.yourJSONDataFillThere.nodes.length, // 这里注意, 新增的id一定不能重复, 建议id交由后端处理
          in_ports: [0],
          out_ports: [0]
       })
      }
      window.sessionStorage["dragDes"] = null;
      this.dragBus = false;
    },
    dragIt(val) {
        console.log(val);
      val.form.createTime = new Date().toDateString()
      sessionStorage["dragDes"] = JSON.stringify({
        drag: true,
        ...val
      });
    },
    /**
     * 右侧form展示逻辑
     */
    showNodeDetails(val) { // 展示选中的节点
      const { id, form } = val
      console.log(val);
      if (!form) return
      this.formDetail = {
        currentEditNodeId: id,
        form
      }
    },
    onSubmit() { // 更新所选节点的信息
      let _data = this.yourJSONDataFillThere.nodes.map(item => item.form.details)
      console.log(this.yourJSONDataFillThere);
      console.log(_data);
    },
    fetchData() {
        var that = this;
        this.loading = true
        console.log(this.create_time)
        const params = {
            page:this.page,
            pageSize:this.pageSize,
            name:this.name,
            create_time:this.create_time!=null?this.create_time.toString():''
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
    fetchPluginList() {
        getPluginList().then(res => {
            console.log(res);
            var arr = [];
            var num = 0;
            for(var i=0;i<res.data.length;i++){
                num++;
                arr.push({id:i+1,label:res.data[i].category,children:res.data[i].children.map(function(obj,index,array) { var rObj = {}; rObj['pid'] = num;rObj['id'] = num+'-'+obj.id;rObj['label'] = obj.vuln_name;rObj['value'] = obj.plugin_name; return rObj; })})
                
            }
            this.fromData = arr;

            let leftArr = [];
            let data = res.data;
            for(let i in data){
                for(let key in data[i].children){
                    num++;
                    leftArr.push({name:data[i].children[key].vuln_name,iconClassName: 'el-icon-collection-tag',form: { details: data[i].children[key].plugin_name, num: num, key: key  }})
                }
            }
            console.log(leftArr);
            this.initNodesBasic = leftArr;
        })
    },
    fetchPipeList() {
        getPipeList().then(res => {
            console.log(res);
            this.pipeList = res.data;
        })
    },
    // 监听穿梭框组件添加
    add(fromData,toData,obj){
        console.log("fromData:", fromData);
        console.log("toData:", toData);
        console.log("obj:", obj);
        this.toData = toData;
        var arrList = [];
        for(var i=0;i<toData.length;i++){
            for(var j=0;j<toData[i].children.length;j++){
                arrList.push(toData[i].children[j].value)
            }
        }
        console.log(arrList);
        this.arrList = arrList;
    },
    // 监听穿梭框组件移除
    remove(fromData,toData,obj){
        console.log("fromData:", fromData);
        console.log("toData:", toData);
        console.log("obj:", obj);
        var arrList = [];
        for(var i=0;i<toData.length;i++){
            for(var j=0;j<toData[i].children.length;j++){
                arrList.push(toData[i].children[j].value)
            }
        }
        console.log(arrList);
        this.arrList = arrList;
    },
    //新建模板
    addFn() {
        console.log(this.toData)
        const params = {
            pipe: this.pipeArr,
            vuln: this.arrList,
            common: {},
            name: this.templateName,
        }
        addTemplate(params).then(res => {
            console.log(res);
            if(res.code == 200){
                Message.success(res.data);
                this.dialogVisible = false;
            }else{
                Message.error(res.data);
            }
        })
    },
    handleEdit(row) {
        console.log(row);
        getPluginInfo(row.id).then(res => {
            console.log(res);
            this_vue.$template({
                tempVisible: true,
                res:res,
                click: () => {
                    // 点击按钮事件
                    
                }
            })
            
        })
    },
    resetFn() {
        this.dialogVisible = false;
    },
    delFn(id) {
        this.loading = true
        const params = {
            id: id
        }
        delListItem(params).then(res => {
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
        this.create_time = '';
        this.fetchData();
    },
    handleDelete(index,row) {
        console.log(index);
        console.log(row.id);
        this.delFn(row.id)
    },
    //跳转我的管道页面
    handelMineConduit() {
        this.$router.push({ path: `/strategy/mineConduit` })
    }
  },
    components:{ treeTransfer } // 注册
}
</script>
<style lang="scss" scoped>
    .el-dialog__body{
        margin: 0 10%;
    }
    .wl-transfer .transfer-title{
        text-align: left;
        background: #F2F2F2;
    }
    .diagramExample {
        width: 100%;
        height: 50vh;
        overflow: hidden;
        position: relative;
        .basic-node {
            margin-top: 5px;
            background: #fff;
            color:black;
            border-radius: 15px;
            height: 30px;
            width: 140px;
            border: 1px solid #289de9;
            line-height:30px;
            display: inline-block;
            cursor: pointer;
            user-select: none;
        }
        .page-left {
            position: absolute;
            left: 0;
            top: 0;
            width: 200px;
            height: 50vh;
            background: #717171;
            .logo {
                font-size: 20px;
                line-height: 40px;
                font-weight: bold;
                border-bottom: 1px solid #ccc;
                background: #fff;
            }
        }
    }
/** 给svg添加格子背景 */
#svgContent {
  background-size: 50px 50px;
  background-image: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent);
  background-color: rgb(60, 60, 60) !important;
  margin-left:200px;
  margin-right: 200px;
}
</style>