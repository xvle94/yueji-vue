<template>
  <div class="overview" style="z-index:1001">
    <div class="hd-box">
      <router-link :to="'/dashboard'">
        <button class="back-btn">返回</button>
      </router-link>
      <h1 class="title">岳戟</h1>
      <div class="time">{{nowTime}}</div>
    </div>
    <div class="hd-bd-box">
      <div class="lf">
        <div class="middle">
          <p class="num">{{midrisk_vuln}}</p>
          <p class="label">中危漏洞</p>
          <div class="bar">
            <span class="label">漏洞占比</span>
          <span class="percentage">{{total_vuln!=0?(midrisk_vuln/total_vuln*100).toFixed(2):0}}%</span>
          <div class="bar-num" :style="{right:100-(total_vuln!=0?(midrisk_vuln/total_vuln)*100:0)+'%'}"></div>
          </div>
        </div>
        <div class="low">
          <p class="num">{{lowrisk_vuln}}</p>
          <p class="label">低危漏洞</p>
          <div class="bar">
            <span class="label">漏洞占比</span>
          <span class="percentage">{{total_vuln!=0?(lowrisk_vuln/total_vuln*100).toFixed(2):0}}%</span>
          <div class="bar-num" :style="{right:100-(total_vuln!=0?(lowrisk_vuln/total_vuln)*100:0)+'%'}"></div>
          </div>
        </div>
      </div>
      <div class="mid">
        <div class="total-bg">
          <span class="num">{{total_vuln}}</span>
          <p class="title">漏洞总数</p>
        </div>
      </div>
      <div class="rt">
        <div id="chart_example" style="width: 100%; height: 100%;"></div>
      </div>
    </div>
    <div class="bd-box">
      <div class="bd-lf" :style="{'background-image':'url('+(highrisk_vuln==0?bgGreen:bgRed)+')'}">
        <p class="num" :style="{'color':''+(highrisk_vuln==0?'#00D38E':'#ec6f5a')+''}">{{highrisk_vuln}}</p>
        <p class="label">高危漏洞</p>
        <div class="bar">
          <span class="pro">漏洞占比</span>
          <span class="percentage">{{total_vuln!=0?(highrisk_vuln/total_vuln*100).toFixed(2):0}}%</span>
          <div class="bar-num" :style="{right:100-(total_vuln!=0?(highrisk_vuln/total_vuln)*100:0)+'%'}"></div>
        </div>
      </div>
      <div class="bd-mid">
        <p class="ip" v-for="(item,index) in ipList" v-show="num==index">IP:{{item.target}}</p>
        <div class="lf-tp" v-for="(item,index) in ipList" v-show="num==index">
          <el-tooltip :content="item.data[0]" placement="top" effect="light">
            <span class="name">{{item.data[0] | midEllipsis}}</span>
          </el-tooltip>
        </div>
        <div class="rt-tp" v-for="(item,index) in ipList" v-show="num==index">
          <el-tooltip :content="item.data[1]" placement="top" effect="light">
            <span class="name">{{item.data[1] | midEllipsis}}</span>
          </el-tooltip>
        </div>
        <div class="lf-bt" v-for="(item,index) in ipList" v-show="num==index">
          <el-tooltip :content="item.data[2]" placement="top" effect="light">
            <span class="name">{{item.data[2] | midEllipsis}}</span>
          </el-tooltip>
        </div>
        <div class="rt-bt" v-for="(item,index) in ipList" v-show="num==index">
          <el-tooltip :content="item.data[3]" placement="top" effect="light">
            <span class="name">{{item.data[3] | midEllipsis}}</span>
          </el-tooltip>
        </div>
      </div>
      <div class="bd-rt">
        <p class="lf-title">最新事件</p>
        <div class="newList">
          <vue-seamless :data="newList" class="seamless-warp" :class-option="defaultOption">
            <ul>
              <li v-for="(item,index) in newList" :key="index">
                <img class="warn-icon" :src="warn" alt="">
                <el-tooltip :content="item.vuln_name" placement="top" effect="light">
                  <p class="title">{{item.vuln_name | newEllipsis}}</p>
                </el-tooltip>
                <p class="time">{{item.time}}</p>
              </li>
            </ul>
          </vue-seamless>
        </div>
      </div>
    </div>
    <div class="ft-box">
      <div class="ft-lf">
        <p class="lf-title">高风险漏洞</p>
        <ul class="ul">
          <li class="li" v-for="item in lfList">
            <div class="name">
              <el-tooltip :content="item.label" placement="top" effect="light">
                <!-- <span class="name">{{item.label | ellipsis}}</span> -->
                <span>{{item.label}}</span>
              </el-tooltip>
            </div>
            <span class="value">{{item.value}}</span>
          </li>
        </ul>
      </div>
      <div class="ft-mid">
        <p class="lf-title">漏洞趋势</p>
        <div id="myChart" ref="myChart" style="width: 100%; height: 100%;" />
      </div>
      <div class="ft-rt">
        <p class="lf-title">易攻击目标</p>
        <ul class="ul">
          <li class="li" style="text-align:center" v-for="item in rtList">
            <span>{{item.label}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTaskslatest, getNewList, getCharts } from '@/api/overview'
import axios from 'axios'
import "@/views/overview/index.scss"
import vueSeamless from 'vue-seamless-scroll'
let echarts = require("echarts/lib/echarts")

export default {
  name: 'Overview',
  data() {
    return {
      nowTime:"",
      bgRed:require('@/assets/loophole2.png'),
      bgGreen:require('@/assets/loopholeGreen.png'),
      warn:require('@/assets/warn.png'),
      num:0,
      loading:true,
      total_vuln:0,
      highrisk_vuln:0,
      midrisk_vuln:0,
      lowrisk_vuln:0,
      scan_count:0,
      pause_count:0,
      scan_count:0,
      finish_count:0,
      lfList:[],
      rtList: [],
      newList:[],
      ipList:[],
      option: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          // formatter(params){
          //   console.log(params);
          //   let res = '';
          //   for(var i=0;i<params.length;i++){
          //     res = '数量：'+params[i].data
          //   }
          //   return res
          // }
        },
        legend: {
          data: ['2019年','2020年'],
          top:30,
          right:70,
          textStyle:{
            color:'#fff',
          }
        },
        grid:{
          x:50,
          y:80,
          x2:80,
          y2:50,
        },
        xAxis: {
          name:'月份',
          axisLine:{
            lineStyle:{
              color:'#fff',
              width:1,
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: ['1','2','3','4','5','6','7','8','9','10','11','12']
        },
        yAxis: {
          name:'风险数',
          axisLine:{
            lineStyle:{
              color:'#fff',
              width:1,
            }
          },
          splitLine: {
            show: true,
            lineStyle:{
              color:'#39435E'
            }
          },
          axisTick: {
            show: false
          },
        },
        series: []
      },
    }
  },
  components: {
    vueSeamless
  },
  computed: {
    defaultOption () {
      return {
        step: 0.4, //步长 越大滚动速度越快
        limitMoveNum: 5, //启动无缝滚动最小数据量 this.dataList.length
        hoverStop: true, //是否启用鼠标hover控制
        direction: 1, //1 往上 0 往下
        openWatch: true, //开启data实时监听
        singleHeight: 0, //单条数据高度有值hoverStop关闭
        waitTime: 1000 //单步停止等待时间
      }
    }
  },
  created() {
  },
  mounted() {
    this.fetchData();
    // this.initCharts();
    // this.play();
    this.getDate();
    setInterval(this.getDate,1000);
  },
  watch: {
    option: {
      handler(newVal, oldVal) {
      if (this.chart) {
        if (newVal) {
        this.chart.setOption(newVal);
        } else {
        this.chart.setOption(oldVal);
        }
      } else {
        this.initCharts();
      }

      },
      deep: true //对象内部属性的监听，关键。
    },
  },
  filters: {
    ellipsis(value) {
      if (value.length > 20) {
        return value.slice(0, 20) + "...";
      }
      return value;
    },
    midEllipsis(value) {
      if (!value) return "";
      if (value.length > 6) {
        return value.slice(0, 6) + "...";
      }
      return value;
    },
    newEllipsis(value) {
      if (!value) return "";
      if (value.length > 15) {
        return value.slice(0, 15) + "...";
      }
      return value;
    },
  },
  methods: {
    fetchData() {
      this.loading = true
      getTaskslatest().then(response => {
        console.log(response)
        this.loading = false
        this.total_vuln = response.data.data.total_vuln||0;
        this.highrisk_vuln = response.data.data.highrisk_vuln||0;
        this.midrisk_vuln = response.data.data.midrisk_vuln||0;
        this.lowrisk_vuln = response.data.data.lowrisk_vuln||0;
        this.scan_count = response.data.data.scan_count||0;
        this.pause_count = response.data.data.pause_count||0;
        this.finish_count = response.data.data.finish_count||0;
        this.lfList = response.data.data.high_risk_top5;
        this.rtList = response.data.data.easy_attack_top5;
      }).catch(error => {
        this.loading = false
      });
      getNewList().then(response => {
        console.log(response);
        this.newList = response.data.items;
      }).catch(error => {
        this.loading = false
      });
      getCharts().then(response => {
        console.log(response);
        this.ipList = response.data.center;
        let arr = response.data.trend;
        let series = [];
        for(let i=0;i<arr.length;i++){
          series.push({
            name: response.data.trend[i].year+'年',
            type: 'line',
            data: response.data.trend[i].data,
            symbolSize: 10,//折点大小
            itemStyle : {  
              normal : {  
                color:response.data.trend[i]==0?'#25BBFF':'#FFB323',
                lineStyle:{  
                  color:response.data.trend[i]==0?'#25BBFF':'#FFB323' 
                }  
              }  
            }, 
          })
        }
        console.log(series);
        this.option.series = series;
        let myChart2 = echarts.init(document.getElementById('myChart'));
        window.addEventListener('resize',function() {myChart2.resize()});

        //右上图表
        let seriesData = response.data.resource;
        let yData = [];
        let yData2 = [];
        let xData = [];
        let topSeries = [];
        let key1 = '';
        let key2 = '';
        seriesData.map(item => {
          yData.push(item.net_in);
          yData2.push(item.net_out);
          key1 = Object.keys(item)[0];
          key2 = Object.keys(item)[1];
          xData.push(this.dateFormat('MM:SS',item.create_now));
        })
        console.log(key1);
        let this_ = this;
        let myChart = echarts.init(document.getElementById('chart_example'));
        let option = {
          tooltip : {
            trigger: 'axis',
            // axisPointer : {
            //   type : 'shadow'
            // }
          },
          legend: {
            data: [key1,key2],
            top:10,
            right:70,
            textStyle:{
              color:'#fff',
            }
          },
          grid:{
            x:50,
            y:40,
            x2:60,
            y2:50,
          },
          xAxis : [
            {
              name:'时间',
              axisLine:{
                lineStyle:{
                  color:'#fff',
                  width:1,
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              },
              axisLabel: {  
                interval:0,  
                rotate:40  
              } ,
              data : xData,
            },
          ],
          yAxis : [
            {
              name:'KB',
              axisLine:{
                lineStyle:{
                  color:'#fff',
                  width:1,
                }
              },
              splitLine: {
                show: true,
                lineStyle:{
                  color:'#39435E'
                }
              },
              axisTick: {
                show: false
              },
            }
          ],
          series : [
            {
              name:key1,
              type:'line',
              symbolSize: 6,//折点大小
              itemStyle : {  
                normal : {  
                  color:'#25BBFF',
                  lineStyle:{  
                    color:'#25BBFF' 
                  }  
                }  
              }, 
              data: yData
            },
            {
              name:key2,
              type:'line',
              symbolSize: 6,//折点大小
              itemStyle : {  
                normal : {  
                  color:'#FFB323',
                  lineStyle:{  
                    color:'#FFB323' 
                  }  
                }  
              }, 
              data: yData2
            }
          ]
        };
        myChart.setOption(option);
  
        //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
        window.addEventListener('resize',function() {myChart.resize()});
        }).catch(error => {
        this.loading = false
      });
    },
    autoPlay:function(){//num递增，定时器实现
      const _self=this;
      _self.num++;
      if(_self.num == this.ipList.length){
          _self.num=0;
      }
    },
    play:function(){//每隔一秒执行autoPlay，使得num递增
        setInterval(this.autoPlay,3000);
    },
    initCharts() {
      this.chart = echarts.init(this.$refs.myChart);
      this.chart.setOption(this.option,true);
      this.chart = echarts.init(this.$refs.myChart2);
      this.chart.setOption(this.topOption,true);
    },
    dateFormat(fmt, date) {
        let ret="";
        date=new Date(date);
        const opt = {
          'Y+': date.getFullYear().toString(), // 年
          'm+': (date.getMonth() + 1).toString(), // 月
          'd+': date.getDate().toString(), // 日
          'H+': date.getHours().toString(), // 时
          'M+': date.getMinutes().toString(), // 分
          'S+': date.getSeconds().toString() // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
        }
        for (let k in opt) {
          ret = new RegExp('(' + k + ')').exec(fmt)
          if (ret) {
            fmt = fmt.replace(
              ret[1],
              ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
            )
          }
        }
        return fmt
    },
    getDate(){
      var date = new Date();
      this.nowTime = date.toLocaleString();
    }
  }
   
}
</script>
