<template>
  <div class="dashbord" v-loading="loading">
    <ul class="bd-hd">
      <li class="li">
        <div class="hd-box" :style="totalImg">
          <p class="desc">{{total_vuln}}</p>
          <p class="title">漏洞总数</p>
        </div>
      </li>
      <li class="li">
        <div class="hd-box" :style="highImg">
          <p class="desc">{{highrisk_vuln}}</p>
          <p class="title">高危漏洞</p>
        </div>
      </li>
      <li class="li">
        <div class="hd-box" :style="middleImg">
          <p class="desc">{{midrisk_vuln}}</p>
          <p class="title">中危漏洞</p>
        </div>
      </li>
      <li class="li">
        <div class="hd-box" :style="lowImg">
          <p class="desc">{{lowrisk_vuln}}</p>
          <p class="title">低危漏洞</p>
        </div>
      </li>
    </ul>
    <div class="bd-bd">
      <div class="bd-box">
        <p>扫描中</p>
        <p class="num">{{scan_count}}</p>
        <p class="bg-num">{{scan_count}}</p>
      </div>
      <el-divider class="divider" direction="vertical"></el-divider>
      <div class="bd-box">
        <p>暂停扫描</p>
        <p class="num">{{pause_count}}</p>
        <p class="bg-num">{{pause_count}}</p>
      </div>
      <el-divider class="divider" direction="vertical"></el-divider>
      <div class="bd-box">
        <p>完成扫描</p>
        <p class="num">{{finish_count}}</p>
        <p class="bg-num">{{finish_count}}</p>
      </div>
    </div>
    <div class="bd-list">
      <div class="lf-list">
        <p class="title">高风险漏洞<span style="float:right">TOP5</span></p>
        <ul class="ul">
          <li class="li" v-for="item in lfList">
            <el-tooltip :content="item.label" placement="top">
              <span style="cursor:pointer;color:#4a89dc" @click="goLoophole(item.label)">{{item.label | ellipsis}}</span>
            </el-tooltip>
            <span class="value">{{item.value}}</span>
          </li>
        </ul>
      </div>
      <div class="rt-list">
        <p class="title">易攻击目标<span style="float:right">TOP5</span></p>
        <ul class="ul">
          <li class="li" v-for="item in rtList">
            <span class="name" @click="goInfo(item.label)" style="cursor:pointer">{{item.label}}</span>
            <span class="info">信息：{{item.info}}</span>
            <span class="low">低危：{{item.low_risk}}</span>
            <span class="middle">中危：{{item.mid_risk}}</span>
            <span class="high">高危：{{item.high_risk}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="bt-list">
      <p class="title">最新任务</p>
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
          >
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
          prop="scan_style"
          label="扫描类型"
          >
        </el-table-column>
        <el-table-column
          prop="scan_time"
          label="扫描时间"
          show-overflow-tooltip>
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
            @click="handleSee(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTaskslatest, getNewList, delListItem } from '@/api/dashboard'
import axios from 'axios'
import "@/views/dashboard/index.scss"
import { Message } from 'element-ui'
import { message } from '@/utils/resetMessage'
export default {
  name: 'Dashboard',
  // computed: {
  //   ...mapGetters([
  //     'name',
  //     'total',
  //     'high',
  //     'middle',
  //     'low',
  //   ])
  // },
  data() {
    return {
      loading:true,
      total_vuln:0,
      highrisk_vuln:0,
      midrisk_vuln:0,
      lowrisk_vuln:0,
      scan_count:0,
      pause_count:0,
      scan_count:0,
      finish_count:0,
      totalImg:{
        backgroundImage: "url(" + require("@/icons/svg/total.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        height:'100px',
        marginRight:'16px'
      },
      highImg:{
        backgroundImage: "url(" + require("@/icons/svg/high.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        height:'100px',
        marginRight:'16px'
      },
      middleImg:{
        backgroundImage: "url(" + require("@/icons/svg/middle.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        height:'100px',
        marginRight:'16px'
      },
      lowImg:{
        backgroundImage: "url(" + require("@/icons/svg/low.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        height:'100px',
      },
      lfList: [],
      rtList: [],
      tableData: [],
      multipleSelection: [],
      otal:0,
      pageSize:10,
      page:1
    }
  },
  filters: {
    ellipsis: function(value) {
      if (!value) return "";
      if (value.length > 50) {
        return value.slice(0, 50) + "...";
      }
      return value;
    }
  },
  created() {
    this.fetchData()
    // this.$popup({
    //     // imgUrl: require('../assets/imgs/test_result.png'), // 顶部图片
    //     imgLoadTip:'图片加载中...',
    //     title: '我是标题',
    //     content: '我是内容',
    //     btnText: '我是按钮',
    //     click: () => {
    //       // 点击按钮事件
    //       //   this.$router.push('……')
    //       console.log(`点击按钮了！`)
    //     },
    //   })
  },
  methods: {
    fetchData() {
      this.loading = true
      getTaskslatest().then(response => {
        if(response.code == 200){
          this.total_vuln = response.data.data.total_vuln||0;
          this.highrisk_vuln = response.data.data.highrisk_vuln||0;
          this.midrisk_vuln = response.data.data.midrisk_vuln||0;
          this.lowrisk_vuln = response.data.data.lowrisk_vuln||0;
          this.scan_count = response.data.data.scan_count||0;
          this.pause_count = response.data.data.pause_count||0;
          this.finish_count = response.data.data.finish_count||0;
          this.lfList = response.data.data.high_risk_top5;
          this.rtList = response.data.data.easy_attack_top5;
        }else{
          message.error(res.data)
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
      });
      const params = {
        page:this.page,
        pageSize:this.pageSize,
      }
      getNewList(params).then(response => {
        console.log(response);
        this.tableData = response.data.items;
      })
    },
    handleSee(row) {
      console.log(row);
      if(row.scan_style == '渗透测试'){
          this.$router.push({ path: `/infiltration/targetDetail/${row.id}` })
      }else if(row.scan_style == '基础扫描'){
          this.$router.push({ path: `/basic/targetDetail/${row.id}` })
      }
    },
    delFn(id) {
        this.loading = true
        const params = [id]
        delListItem({ids:params}).then(res => {
            if(res.code == 200){
                console.log(res)
                this.fetchData();
                message.success(res.data)
            }else{
                message.error(res.data)
            }
            this.loading = false;
        }).catch(error => {
            this.loading = false
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(index,row) {
        this.delFn(row.id)
    },
    goLoophole(name) {
      this.$router.push({ 
        path: `/loophole/targetDetail/${encodeURIComponent(name)}` ,
      })
    },
    goInfo(name){
      // this.$router.push({ path: `/loophole/targetDetail/${name}` })
    }
  },
}
</script>
