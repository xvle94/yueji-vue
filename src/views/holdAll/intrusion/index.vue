<template>
    <div class="intrusion">
        <el-button size="small" type="primary" class="blue-button" @click.native="$router.back(-1)">返回</el-button>
        <div class="tabs-box" v-for="(item, index) in editableTabs" style="width:30%">
            <el-tabs v-model="subName" @tab-click="handleClick(style,item)">
                <el-tab-pane label="报文" name="positions">
                    <el-form ref="form" :model="item.content" label-width="80px">
                    <el-form-item label="攻击模式">
                        <el-select
                        v-model="style"
                        placeholder="请选择"
                        @change="styleChange($event,item.content.data)"
                        >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="协议">
                        <el-input v-model="item.content.scheme" @input="changeScheme(item.content.scheme)"></el-input>
                    </el-form-item>
                    <el-form-item label="域名">
                        <el-input v-model="item.content.host"></el-input>
                    </el-form-item>
                    <el-form-item label="端口">
                        <el-input v-model="item.content.port"></el-input>
                    </el-form-item>
                    <el-form-item label="报文">
                        <el-button size="mini" type="primary" @click="addSymbol">添加§</el-button>
                        <el-input type="textarea" v-model="item.content.data" rows="14"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit(item,item.content)">发送</el-button>
                    </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="有效荷载" name="payload">
                    <el-form ref="form" inline label-width="180px">
                    <el-form-item
                        label="变量设置"
                        v-if="style=='pitchfork' || style=='bomb'"
                        style="display='block'"
                    >
                        <el-select v-model="pitch" placeholder="请选择" @change="pitchChange($event,pitch)">
                        <el-option
                            v-for="item in pitch_option"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="爆破选项">
                        <el-select
                        v-model="payloadSettings[pitch].options"
                        placeholder="请选择"
                        @change="payloadChange($event,pitch)"
                        >
                        <el-option
                            v-for="item in payload_options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                        </el-select>
                    </el-form-item>
                    </el-form>
                    <el-form ref="form" :model="payloadSettings[pitch]" label-width="100px">
                    <el-form-item label="字典荷载" v-if="payloadSettings[pitch].options=='simple'">
                        <el-input  @input="onFirstNameInput($event,pitch)" type="textarea" v-model="objects.words" clearable rows="9"></el-input>
                    </el-form-item>
                    <el-form-item label="我的字典" v-if="payloadSettings[pitch].options=='file'">
                        <el-select v-model="payloadSettings[pitch].file" placeholder="请选择">
                        <el-option
                            v-for="item in myfilelist"
                            :key="item.value"
                            :label="item.file"
                            :value="item.id"
                        ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文件上传" v-if="payloadSettings[pitch].options=='file'">
                        <el-upload
                        drag
                        :action="actionIp"
                        multiple
                        name="file"
                        :data="file"
                        :headers="headers"
                        >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">只能上传文本文件</div>
                        </el-upload>
                    </el-form-item>
                    <div v-if="payloadSettings[pitch].options=='number'">
                        <el-form-item label="从">
                        <el-input v-model="payloadSettings[pitch].start"></el-input>
                        </el-form-item>
                        <el-form-item label="到">
                        <el-input v-model="payloadSettings[pitch].to"></el-input>
                        </el-form-item>
                        <el-form-item label="间隔">
                        <el-input v-model="payloadSettings[pitch].step"></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="日期组合" v-if="payloadSettings[pitch].options=='date'">
                      <el-date-picker
                        v-model="payloadSettings[pitch].date"
                        type="daterange"
                        align="left"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="设置" name="setting">
                    <el-form :model="setting">
                    <el-form-item label="是否自动更新Context-Length头部" label-width="250px">
                        <el-checkbox v-model="setting.chunk_length">自动更新</el-checkbox>
                    </el-form-item>
                    <el-form-item label="是否设置Connection close" label-width="200px">
                        <el-checkbox v-model="setting.close">设置</el-checkbox>
                    </el-form-item>
                    <el-form-item label="超时时间" label-width="100px">
                        <el-input-number v-model="setting.timeout" :step="1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="对这些URL字符进行编码（只会编码url和body）" label-width="340px">
                        <el-input v-model="setting.urlencode"></el-input>
                    </el-form-item>
                    <el-form-item label="要继承返回header中的字段" label-width="200px">
                        <el-input v-model="setting.inherit"></el-input>
                    </el-form-item>
                    <el-form-item label="忽略状态码" label-width="100px">
                        <el-input v-model="setting.igcode" placeholder="分号分隔"></el-input>
                    </el-form-item>
                    <el-form-item label="存储模式" label-width="100px">
                        <el-select v-model="setting.save" placeholder="请选择">
                        <el-option
                            v-for="item in save_option"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="包含字符" v-if="setting.save=='in'">
                        <el-input v-model="setting.code" placeholder="分号分隔"></el-input>
                    </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { getInfo, postProxyIntruder, getUploadList } from "@/api/repeater";
import "@/views/holdAll/intrusion/index.scss"
export default {
  data() {
    return {
      actionIp:window.PLATFROM_CONFIG.baseUrl+'/plugin/upload',
      title:'',
      pid: this.$route.params.id,
      editableTabsValue: "1",
      editableTabs: [],
      tabIndex: 0,
      file: {
        type: "word"
      },
      myfilelist: [],
      headers:{token:localStorage.getItem('token')},
      activeName: "result",
      subName: "positions",
      style: "sniper",
      identifier_sun: 0,
      pitch: 0,
      payloadSettings: [{ options: "simple" }],
      //   payloadSetting: {},
      setting: {
        inherit: "",
        igcode: "404;403",
        timeout: 2,
        save: "all",
        code: "",
        urlencode: './=<>?+&*;:"{}|^`',
        chunk_length: true,
        close: true
      },
      options: [
        {
          label: "依次破解",
          value: "sniper"
        },
        {
          label: "同时破解",
          value: "batter"
        },
        {
          label: "字典",
          value: "pitchfork"
        },
        {
          label: "笛卡尔积破解",
          value: "bomb"
        }
      ],
      payload_options: [
        {
          label: "简单字典",
          value: "simple"
        },
        {
          label: "数字组合",
          value: "number"
        },
        {
          label: "文件",
          value: "file"
        },
        {
          label: "日期组合",
          value: "date"
        }
      ],
      save_option: [
        {
          label: "全部存储",
          value: "all"
        },
        {
          label: "包含指定字符存储",
          value: "in"
        }
      ],
      pitch_option: [],
      objects:{},
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
    };
  },
  created() {
    this.fetchData(this.pid);
  },
  methods: {
    onFirstNameInput (value,pitch) {
      this.objects.words = value;
      this.objects.options = "simple";
      let obj = {};
      obj = this.objects;
      this.payloadSettings[pitch] = {words:value,options:"simple"};
    },
    addSymbol() {
        console.log(this.editableTabs);
        this.editableTabs[0].content.data = this.editableTabs[0].content.data+'§';
    },
    handleClick(name, item) {
      //   this.styleChange(name, item.content.data);
    },
    lookupFiled(tabIndex) {
      return this.$store.state.tabs[tabIndex].title;
    },
    updateFiled(tabIndex, value) {
      this.$store.dispatch("setTabTitle", { tabIndex, value });
    },
    fetchData(pid) {
        const params = {
            id: pid, 
            style: "intruder"
        }
      getInfo(params).then(response => {
        console.log(response);
        let newTabName = ++this.tabIndex + "";
        this.editableTabs.push({
          title: "Tab " + newTabName,
          name: newTabName,
          content: response.data
        });
        this.editableTabsValue = newTabName;
      });
    },
    onSubmit(item, data) {
      let post_data = data;
      post_data.style = this.style;
      post_data.payload = this.payloadSettings;
      post_data.settings = this.setting;
      console.log(data);
      post_data.payload.map(item=>{
        if(item.options=='date'){
          return item.date = item.date.toString()
        }
      })
      postProxyIntruder(post_data).then(response => {
        this.$message({
          message: response.data,
          type: "success"
        });
      });
    },
    handleTabsEdit(targetName, action) {
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        this.editableTabs.push({
          title: "New Tab",
          name: newTabName,
          content: {
            host: "",
            path: "",
            scheme: "",
            http_version: "",
            method: "",
            headers: "",
            body: ""
          },
          result: "",
          response: "",
          code: ""
        });
        this.editableTabsValue = newTabName;
      }
      if (action === "remove") {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    },
    styleChange(name, value) {
      console.log(value);
      console.log(this.payloadSettings);
      if (name == "pitchfork" || name == "bomb") {
        this.payloadSettings = [];
        this.pitch_option = [];
        let data = value.match(/\/?[\w-]+[:=]?[\s\w]?(?=§)/gi);
        this.identifier_sun = data / 2;
        let i = 0;
        for (let index = 0; index < data.length; index += 2) {
          this.pitch_option.push({
            label: data[index],
            value: i
          });
          this.payloadSettings[i] = { options: "simple" };
          i += 1;
        }
      }
    },
    payloadChange(value,pitch) {
      console.log(this.payloadSettings);
      this.objects = this.payloadSettings[pitch];
      this.$forceUpdate();
      if (value == "file") {
        getUploadList({ type: "word" }).then(response => {
          this.myfilelist = response.data;
        });
      }
    },
    changeTextarea(){
      console.log(this.payloadSettings);
    },
    pitchChange(value,pitch) {
      console.log(value, this.payloadSettings);
      this.objects = this.payloadSettings[pitch];
      //   this.payloadSettings[value].options = "simple";
    },
    changeScheme(val){
      if(val == 'https'){
        this.editableTabs[0].content.port = '43'
      }
    }
  }
};
</script>