<template>
  <el-dialog
    :title="headerTitle"
    :visible.sync="tempVisible"
    width="781px"
    confirmButtonClass = 'blue-button'
    >
        <el-steps :active="active" finish-status="finish" simple>
            <el-step style="font-size:12px" title="信息搜集组件"></el-step>
            <el-step title="exploit组件"></el-step>
            <el-step title="管道设置"></el-step>
            <el-step title="参数设置"></el-step>
        </el-steps>
        <div class="dialog-body">
            <div style="text-align: center" v-if="active == 0">
                <div class="input-box" style="margin:0 0 40px 0">
                    <div class="input-item">
                        <span style="margin-right:20px;display:inline-block;width:100px;text-align:right;">请输入模板名</span>
                        <el-input style="width:50%" v-model="templateName" placeholder="请输入内容"></el-input>
                    </div>
                    
                </div>
                <!-- <el-checkbox-group v-model="checkedLevel" @change="handleCheckedCitiesChange" style="margin-bottom:40px">
                    <el-checkbox label="低危" name="type"></el-checkbox>
                    <el-checkbox label="中危" name="type"></el-checkbox>
                    <el-checkbox label="高危" name="type"></el-checkbox>
                </el-checkbox-group> -->
                <tree-transfer 
                    name="transfer"
                    :title="title"               
                    :from_data='fromData'       
                    :to_data='toData'          
                    :defaultProps="{label:'label',level:'level'}" 
                    @addBtn='add'                
                    @removeBtn='remove'      
                    :mode='mode'                
                    height='400px'             
                    filter                     
                    openAll
                    :filterNode="filterNode"
                    >           
                </tree-transfer>
            </div>
            <div v-if="active == 1">
                <tree-transfer 
                    name="transfer"
                    :title="title"               
                    :from_data='fromData'       
                    :to_data='expToData'          
                    :defaultProps="{label:'label',level:'level'}" 
                    @addBtn='expAdd'                
                    @removeBtn='expRemove'      
                    :mode='mode'                
                    height='400px'             
                    filter                     
                    openAll>           
                </tree-transfer>
            </div>
            <div v-if="active == 2">
                <div class="input-box" style="margin:0 0 40px 0">
                    <div class="input-item">
                        <span style="margin-right:20px;display:inline-block;width:100px;text-align:right;">选择管道</span>
                        <el-select style="width:50%" v-model="pipeArr" multiple placeholder="请选择">
                            <el-option
                            v-for="item in pipeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div v-if="active == 3">
                <div class="currency" v-loading="loading">
                    <el-form
                        :model="ruleForm"
                        ref="ruleForm"
                        label-width="100px"
                        label-position="left"
                        class="demo-ruleForm"
                        >
                        <el-form-item
                            v-for="(key, index) in common"
                            :label="key.description"
                            :key="key.key"
                            :prop="key.id + '-' + index"
                        >
                            <div v-if="key.style == 'input'">
                            <el-input v-model="key.value"></el-input>
                            </div>
                            <div v-if="key.style == 'list'">
                            <el-input
                                class="input-new-tag"
                                v-model="key.value"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm"
                            >
                            </el-input>
                            <el-tag
                                :key="tag"
                                v-for="tag in typeResolution(key)"
                 
                                :disable-transitions="false"
                            
                            >
                                {{ tag }}
                            </el-tag>
                            </div>
                            <div v-if="key.style == 'choice'">
                            <el-radio-group v-model="key.value">
                                <el-radio
                                v-for="item in typeResolution(key)"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value"
                                >
                                {{ item.key }}
                                </el-radio>
                            </el-radio-group>
                            </div>
                            <div v-if="key.style == 'select'">
                            <el-select
                                style="width: 250px"
                                v-model="key.value"
                                placeholder="请选择"
                            >
                                <el-option
                                v-for="item in typeResolution(key)"
                                :key="item.value"
                                :label="item.key"
                                :value="item.value"
                                >
                                </el-option>
                            </el-select>
                            </div>
                            <div v-if="key.style == 'wordlist'">
                            <el-select
                                style="width: 250px"
                                v-model="key.value"
                                placeholder="请选择"
                            >
                                <el-option
                                v-for="item in typeResolution(key)"
                                :key="item.file"
                                :label="item.file"
                                :value="item.file"
                                >
                                </el-option>
                            </el-select>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer" v-if="active !=3">
            <el-button class="blue-button" type="primary" @click="prev" :disabled="active == 0">上一步</el-button>
            <el-button class="blue-button" type="primary" @click="next">下一步</el-button>
        </span>
        <span slot="footer" class="dialog-footer" v-if="active ==3">
            <el-button class="blue-button" type="primary" @click="prev">上一步</el-button>
            <el-button class="default-button" type="info" @click="tempVisible = false">取 消</el-button>
            <el-button class="blue-button" type="primary" @click="submitForm()">确 定</el-button>
        </span>
  </el-dialog>
</template>
<script>
    import treeTransfer from 'el-tree-transfer';
    import { getPipeList, getPluginList, addTemplate, updateTemplate } from '@/api/mineTemplate';
    import { getCurrency, setCurrency } from "@/api/systemSet";
    import { getUploadList } from "@/api/repeater";
    // import { option } from 'runjs';
    import { Message } from 'element-ui'
    import { message } from '@/utils/resetMessage';
    export default {
        components:{ treeTransfer }, // 注册
        data() {
            return {
                tempVisible: false,
                active: 0,
                res:'',
                //模板名称
                templateName:'',
                //管道名
                pipeArr:[],
                //管道下拉框
                pipeList:[],
                title: ["所有插件","启动插件"],    //标题 类型：Array 必填：false 默认：["源列表", "目标列表"]
                mode: "transfer", //设置模式，字段可选值为transfer|addressList 类型：String 必填：false 补充：mode默认为transfer模式，即树形穿梭框模式，可配置字段为addressList改为通讯录模式，通讯录模式时按钮不可自定义名字，如要自定义标题名在title数组传入四个值即可，addressList模式时标题默认为通讯录、收件人、抄送人、密送人
                fromData:[],
                toData:[] ,   //目标数据 类型：Array 必填：true 补充：数据格式同element-ui tree组件，但必须有id和pid
                expToData:[],
                //通用设定字段
                loading:true,
                ruleForm: {},
                common: {},
                options: [],
                wordlistOptions: [],
                headerTitle:'新增',
                updateId:'',
                expArrList:[],
                checkedLevel: []
            };
        },
        created() {
            this.fetchPluginList();
            this.fetchPipeList();
            this.fetchCurrency();
            this.fetchUploadList();
        },
        methods: {
            handleCheckedCitiesChange(){

            },
            filterNode(value, data, where){
                if (!value) return true
                console.log(data);
                if(value == '中危'){
                    const list = data.children.filter(item => item.level.indexOf(0) != -1);
                    console.log(list);
                }
                return data.label.indexOf(value) !== -1
            },
            //通用设定
            typeResolution(value) {
                var options = [];
                if (value.style == "choice" || value.style == "select") {
                    // options = JSON.parse(value.default);
                    options = eval("(" + value.default + ")");
                } else if (value.style == "list") {
                    options = value.value.split(";");
                } else if (value.style == "wordlist") {
                    console.log(value);   
                    console.log(this.common);
                    options = this.wordlistOptions;
                }
                return options;
            },
            fetchCurrency() {
                this.loading = true;
                getCurrency().then((res) => {
                    console.log(res);
                    if (res.code == 200) {
                        this.common = res.data;
                        for (let item in res.data) {
                        this.ruleForm[res.data[item].key] = "";
                        }
                    } else {
                        Message.error(res.data);
                    }
                        this.loading = false;
                    })
                .catch((error) => {
                    this.loading = false;
                });
            },
            fetchUploadList() {
                getUploadList().then(res => {
                    if (res.code == 200) {
                        this.wordlistOptions = res.data;
                    } else {
                        Message.error(res.data);
                    }
                })
            },
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
            handleInputConfirm() {
                let inputValue = this.ruleForm.whitelist;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.ruleForm.whitelist = "";
            },
            //获取所有插件
            fetchPluginList() {
                getPluginList().then(res => {
                    var arr = [];
                    var num = 0;
                    for(var i=0;i<res.data.length;i++){
                        num++;
                        arr.push({
                            id:i+1,
                            label:res.data[i].category,
                            children:res.data[i].children.map(function(obj,index,array) { var rObj = {}; rObj['pid'] = num;rObj['id'] = num+'-'+obj.id;rObj['label'] = obj.vuln_name;rObj['value'] = obj.plugin_name;rObj['level'] = obj.level; return rObj; })})
                        
                    }
                    this.fromData = arr;
                    console.log(arr);

                    let leftArr = [];
                    let data = res.data;
                    for(let i in data){
                        for(let key in data[i].children){
                            num++;
                            leftArr.push({name:data[i].children[key].vuln_name,iconClassName: 'el-icon-collection-tag',form: { details: data[i].children[key].plugin_name, num: num, key: key  }})
                        }
                    }
                    this.initNodesBasic = leftArr;

                    if(this.res != ''){
                        this.templateName = this.res.data.name;
                        this.updateId = this.res.data.id;
                        this.headerTitle = '修改';
                        let collect = this.res.data.collect;
                        let vuln = this.res.data.vuln;
                        let toArr = [];
                        let expArr = [];
                        let formArr = [];
                        let num = 0;
                        let num2 = 0;
                        for(var i=0;i<collect.length;i++){
                            num++;
                            toArr.push({
                                id:i+1,
                                label:collect[i].category,
                                children:collect[i].chuilder.map(function(obj,index,array) { var rObj = {}; rObj['pid'] = num;rObj['id'] = num+'-'+obj.id;rObj['label'] = obj.vuln_name;rObj['value'] = obj.plugin_name; return rObj; })
                            }) 
                        }
                        for(var i=0;i<vuln.length;i++){
                            num2++;
                            expArr.push({
                                id:i+1,
                                label:vuln[i].category,
                                children:vuln[i].chuilder.map(function(obj,index,array) { var rObj = {}; rObj['pid'] = num2;rObj['id'] = num+'-'+obj.id;rObj['label'] = obj.vuln_name;rObj['value'] = obj.plugin_name; return rObj; })
                            }) 
                        }
                        this.toData = toArr;
                        this.expToData = expArr;
                        console.log(toArr);
                        arr.map(item => {
                            toArr.map(info => {
                                if(item.children.map(arrItem => arrItem.value) == info.children.map(toItem => toItem.value)){
                                    formArr.push({
                                        id:item.id,
                                        label:item.label,
                                        children:item.children,
                                    })
                                }
                            })
                        })
                        console.log(formArr);
                        // this.fromData = formArr;
                    }
                    console.log(this.fromData)
                    console.log(this.toData)
                    console.log(this.initNodesBasic)
                })
                
            },
            getArrDifference(arr1, arr2) {
                return arr1.concat(arr2).filter(function(v, i, arr) {
                return arr.indexOf(v) === arr.lastIndexOf(v);
                });
            },
            // 监听穿梭框组件添加
            add(fromData,toData,obj){
                this.toData = toData;
                var arrList = [];
                for(var i=0;i<toData.length;i++){
                    for(var j=0;j<toData[i].children.length;j++){
                        arrList.push(toData[i].children[j].value)
                    }
                }
                this.arrList = arrList;
            },
            // 监听穿梭框组件移除
            remove(fromData,toData,obj){
                var arrList = [];
                for(var i=0;i<fromData.length;i++){
                    for(var j=0;j<fromData[i].children.length;j++){
                        arrList.push(fromData[i].children[j].value)
                    }
                }
                this.arrList = arrList;
                this.toData = toData;
            },
            //exploit组件添加
            expAdd(fromData,toData,obj){
                this.expToData = toData;
                var arrList = [];
                for(var i=0;i<toData.length;i++){
                    for(var j=0;j<toData[i].children.length;j++){
                        arrList.push(toData[i].children[j].value)
                    }
                }
                this.expArrList = arrList;
            },
            // exploit组件移除
            expRemove(fromData,toData,obj){
                var arrList = [];
                for(var i=0;i<fromData.length;i++){
                    for(var j=0;j<fromData[i].children.length;j++){
                        arrList.push(fromData[i].children[j].value)
                    }
                }
                this.expArrList = arrList;
                this.expToData = toData;
            },
            //下一步
            next() {
                if(this.templateName == ''){
                    message.error('请输入模板名称');
                }else{
                    if (this.active++ > 3) this.active = 3;
                }
            },
            //上一步
            prev(){
                if (this.active-- < 0) this.active = 0;
            },
            //获取管道下拉框数据
            fetchPipeList() {
                getPipeList().then(res => {
                    this.pipeList = res.data;
                })
            },
            //提交
            submitForm() {
                let arr = [];
                this.common.map((item) => {
                    arr.push({key:item.key,value:item.value}); 
                })
                const params = {
                    collect: this.arrList,
                    vuln: this.expArrList,
                    pipe: this.pipeArr,
                    common: arr,
                    name: this.templateName,
                }
                if(this.headerTitle == '新增'){
                    addTemplate(params).then(res => {
                        if(res.code == 200){
                            Message.success(res.data)
                            this.tempVisible = false;
                        }else{
                            Message.error(res.data)
                        }
                    })
                }else{
                    let collect = [];
                    let vuln = [];
                    this.toData.map(item => item.children.map(items => {collect.push(items.value)}));
                    this.expToData.map(item => item.children.map(items => {vuln.push(items.value)}));
                    let data = {
                        collect: collect,
                        vuln: vuln,
                        pipe: this.pipeArr,
                        common: arr,
                        name: this.templateName,
                        id: this.updateId
                    }
                    updateTemplate(data).then(res => {
                        if(res.code == 200){
                            Message.success(res.data)
                            this.tempVisible = false;
                        }else{
                            Message.error(res.data)
                        }
                    })
                }
            },
        },
    };
</script>
<style lang="scss" scoped>
    .dialog-body{
        margin-top: 20px;
    }
    .currency {
        width: 350px;
        margin: 30px 0 0 100px;
    }
</style>