<template>
    <div class="loopholeList">
        <div class="input-box">
            <div class="input-item">
                <span class="input-label">漏洞名称</span>
                <el-input style="width:50%" v-model="name" placeholder="请输入内容"></el-input>
            </div>
            <div class="input-item">
                <span class="input-label">漏洞类型</span>
                <el-select style="width:55%" v-model="category" placeholder="请选择">
                    <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
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
        <div class="table-list" v-loading="loading">
            <el-table
                    :data="tableData"
                    style="width: 100%;margin-bottom: 20px;"
                    row-key="id"
                    default-expand-all
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column
                    prop="label"
                    label="漏洞名称"
                >
                </el-table-column>
                <el-table-column
                    prop="leak"
                    label="漏洞类型"
                >
                </el-table-column>
                <el-table-column
                    prop="desc"
                    label="插件详情"
                >
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                  <el-button
                      v-if="!scope.row.children"
                      size="mini"
                      type="primary"
                      class="blue-button"
                      @click="handlePermission(scope.row)">查看</el-button>
                  <el-button
                      v-if="!scope.row.children"
                      size="mini"
                      type="primary"
                      class="blue-button"
                      @click="handleEdit(scope.row)">修改</el-button>
                  </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
          title="修改"
          :visible.sync="dialogVisible"
          width="600px"
    
          >
            <el-form style="margin:0 40px 0 0" ref="form" :model="form" label-width="120px">
              <el-form-item label="漏洞名称">
                <el-input v-model="form.vuln_name"></el-input>
              </el-form-item>
              <el-form-item label="分类">
                <el-input v-model="form.category"></el-input>
              </el-form-item>
              <el-form-item label="风险程度">
                <el-select v-model="form.level" placeholder="请选择活动区域">
                  <el-option label="高危" :value="3"></el-option>
                  <el-option label="中危" :value="2"></el-option>
                  <el-option label="低危" :value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="漏洞编号">
                <el-input type="textarea" v-model="form.number"></el-input>
              </el-form-item>
              <el-form-item label="漏洞描述">
                <el-input type="textarea" v-model="form.description"></el-input>
              </el-form-item>
              <el-form-item label="此漏洞的影响">
                <el-input type="textarea" v-model="form.influences"></el-input>
              </el-form-item>
              <el-form-item label="如何修复此漏洞">
                <el-input type="textarea" v-model="form.solution"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getPluginList, getPluginInfo, setPlugin } from '@/api/loopholeList'
import { message } from '@/utils/resetMessage'
export default {
    data() {
        return {
            loading:true,
            tableData: [],
            name:'',
            category:'',
            level:'',
            typeOptions: [
              {
                value: 'web',
                label: 'web'
              },
              {
                value: '硬件设备',
                label: '硬件设备'
              }
            ],
            levelOptions: [
              {
                value: 3,
                label: '高危及以上'
              },
              {
                value: 2,
                label: '中危及以上'
              },
              {
                value: 1,
                label: '低危及以上'
              }
            ],
            dialogVisible:false,
            form: {
              vuln_name: '',
              category: '',
              level: '',
              number: '',
              description: '',
              influences: '',
              solution: ''
            },
            formId:''
        }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.loading = true;
        const params = {
          name: this.name,
          category: this.category,
          level: this.level
        }
        getPluginList(params).then(res => {
          console.log(res);
          if(res.code == 200){
            var arr = [];
            var num = 0;
            for(var i=0;i<res.data.length;i++){
                num++;
                arr.push({id:i+1,label:res.data[i].category,children:res.data[i].children.map(function(obj,index,array) { var rObj = {}; rObj['pid'] = obj.id;rObj['id'] = num+'-'+obj.id;rObj['label'] = obj.vuln_name;rObj['value'] = obj.plugin_name;rObj['desc'] = obj.desc;rObj['leak'] = res.data[i].category; return rObj; })})
                
            }
            console.log(arr);
            this.tableData = arr
          }
          this.loading = false;
        }).catch(error => {
          this.loading = false;
        })
      },
      handleSearch() {
        this.page = 1;
        this.pageSize = 10;
        this.fetchData();
      },
      handleClear() {
        this.name = '';
        this.category = '';
        this.level = '';
        this.fetchData();
      },
      handleEdit(row) {
        console.log(row)
        this.dialogVisible = true;
        getPluginInfo(row.pid).then(res => {
          console.log(res);
          if(res.code == 200){
            this.formId = res.data.id;
            this.form.vuln_name = res.data.vuln_name;
            this.form.category = res.data.category;
            this.form.level = res.data.level;
            this.form.number = res.data.number;
            this.form.description = res.data.description;
            this.form.influences = res.data.influences;
            this.form.solution = res.data.solution;
          }
        })
      },
      submit() {
        setPlugin(this.formId,this.form).then(res => {
          console.log(res);
          if(res.code == 200){
            message.success(res.data);
            this.dialogVisible = false;
          }else{
            message.error(res.data);
          }
        })
      },
      handlePermission(row) {
        console.log(row)
        this.$router.push({ path: `/strategy/taskDetail/${row.pid}` })
    },
    }
}
</script>
<style>
.el-table th{
  background: rgb(230, 230, 230);
  color: rgb(85, 85, 85);
}
.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
  border-right: none;
}
</style>