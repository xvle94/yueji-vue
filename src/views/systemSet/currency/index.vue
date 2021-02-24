<template>
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
        v-show="selectHidden(key)"
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

      <el-form-item>
        <el-button
          class="blue-button"
          type="primary"
          @click="submitForm('ruleForm')"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getCurrency, setCurrency } from "@/api/systemSet";
import { getUploadList } from "@/api/repeater";
import { Message } from "element-ui";
import { option } from 'runjs';
export default {
  data() {
    return {
      ruleForm: {},
      common: {},
      options: [],
      wordlistOptions: [],
      loading: true,
    };
  },
  created() {
    // this.fetchData();
  },
  methods: {
    typeResolution(value) {
      console.log(value);
      var options = [];
      if (value.style == "choice" || value.style == "select") {
        // options = JSON.parse(value.default);
        options = eval("(" + value.default + ")");
      } else if (value.style == "list") {
        options = value.value.split(";");
      } else if (value.style == "wordlist") {
        options = this.wordlistOptions;
      }
      return options;
    },
    fetchCurrency() {
      this.loading = true;
      getCurrency()
        .then((res) => {
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
      console.log(this.ruleForm);
      let inputValue = this.ruleForm.whitelist;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.ruleForm.whitelist = "";
    },
    selectHidden(data){
      if (data.on==null){
        return true
      }
      for (const key in this.common) {
        if(this.common[key].key==data.on && this.common[key].value=='false'){
          return false
        }
      }
      return true
    },
    submitForm(formName) {
        let arr = [];
        this.common.map((item) => {
            console.log(item);
            arr.push({key:item.key,value:item.value}); 
        })
      setCurrency(arr)
        .then((res) => {
            console.log(res);
            if (res.code == 200) {
            Message.success(res.data);
            } else {
            Message.error(res.data);
            }
            this.loading = false;
        })
        .catch((error) => {
            this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.currency {
  width: 350px;
  margin: 30px 0 0 100px;
}
</style>
