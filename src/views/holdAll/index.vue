<template>
    <div class="holdAll">
        <div class="input-box">
            <div class="input-item">
                <span class="input-label">host</span>
                <el-input style="width:50%" v-model="host" placeholder="请输入内容"></el-input>
            </div>
            <div class="input-item">
                <span class="input-label">端口</span>
                <el-input style="width:50%" v-model="port" placeholder="请输入内容"></el-input>
            </div>
            <div class="input-item">
                <span class="input-label">路径</span>
                <el-input style="width:50%" v-model="path" placeholder="请输入内容"></el-input>
            </div>
        </div>
        <div class="input-box">
            <div class="input-item">
                <span class="input-label">协议</span>
                <el-select style="width:50%" v-model="scheme" placeholder="请选择">
                    <el-option
                    v-for="item in agreementOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input-item">
                <span class="input-label">请求类型</span>
                <el-select style="width:50%" v-model="method" placeholder="请选择">
                    <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="input-item">
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
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                 :header-cell-style="{background:'#E6E6E6',color:'#555',textAlign:'center'}"
                 :cell-style="{textAlign:'center'}"
                >
                <el-table-column
                    prop="id"
                    label="序号"
                >
                    <template slot-scope="scope">
                        <span style="color:#4B89DC;">{{scope.row.id}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="request.scheme"
                    label="协议"
                >
                </el-table-column>
                <el-table-column
                    prop="request.http_version"
                    label="HTTP版本"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="request.method"
                    label="请求类型"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="request.port"
                    label="端口"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="request.host"
                    label="HOST"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="request.path"
                    label="路径"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="request.body"
                    label="body"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <!-- <el-button
                            size="mini"
                            type="primary"
                            class="blue-button"
                            @click="handleEdit(scope.row)">扫描</el-button> -->
                        <el-button
                            size="mini"
                            type="warning"
                            class="yellow-button"
                            @click="handleRepeater(scope.row)">手动请求</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            class="red-button"
                            @click="handleIntrusion(scope.row)">爆破</el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            class="blue-button"
                            @click="handleSee(scope.row)">查看</el-button>
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
            <el-dialog title="详情" :visible.sync="dialogFormVisible" v-loading="formLoading">
                <el-form :model="form">
                    <el-form-item label="UUID">
                        <p>{{form.uuid}}</p>
                    </el-form-item>
                    <el-form-item>
                        <p>
                            协议：<span style="margin-right:20px">{{form.scheme}}</span>
                            HTTP版本：<span style="margin-right:20px">{{form.http_version}}</span>
                            端口：<span style="margin-right:20px">{{form.port}}</span>
                        </p>
                    </el-form-item>
                    <el-form-item label="请求类型">
                        <el-input v-model="form.method"></el-input>
                    </el-form-item>
                    <el-form-item label="HOST">
                        <el-input v-model="form.host"></el-input>
                    </el-form-item>
                    <el-form-item label="路径">
                        <el-input v-model="form.path"></el-input>
                    </el-form-item>
                    <el-form-item label="Cookie">
                        <el-input v-model="form.cookie" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="头部">
                        <el-input
                            type="textarea"
                            :rows="5"
                            :autosize="{ minRows: 5}"
                            placeholder="请输入内容"
                            v-model="form.headers">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="Body">
                        <el-input v-model="form.body" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import { getList, delListItem, getInfo } from '@/api/holdAll'
    import { Message } from 'element-ui'
    export default {
        name: 'holdAll',
        data() {
            return {
                loading: true,
                tableData:[],
                host:'',
                port:'',
                path:'',
                scheme:'',
                method:'',
                agreementOptions:[
                    {
                        value: 'http',
                        label: 'http'
                    },
                    {
                        value: 'https',
                        label: 'https'
                    },
                ],
                typeOptions:[
                    {
                        value: 'get',
                        label: 'get'
                    },
                    {
                        value: 'post',
                        label: 'post'
                    },
                    {
                        value: 'head',
                        label: 'head'
                    },
                    {
                        value: 'put',
                        label: 'put'
                    },
                    {
                        value: 'delete',
                        label: 'delete'
                    },
                ],
                total:0,
                pageSize:10,
                page:1,
                dialogFormVisible: false,
                form: {
                    uuid: '',
                    scheme: '',
                    http_version: '',
                    port: '',
                    method: '',
                    host: '',
                    path: '',
                    headers: '',
                    body: '',
                    cookie: '',
                },
                formLoading:false,
            }
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                this.loading = true;
                const params = {
                    page: this.page,
                    pageSize: this.pageSize,
                    host: this.host,
                    port: this.port,
                    path: this.path,
                    scheme: this.scheme,
                    method: this.method,
                }
                getList(params).then(res => {
                    console.log(res)
                    if(res.code == 200){
                        this.tableData = res.data;
                        this.total = res.count;
                    }
                    this.loading = false
                }).catch(error => {
                    this.loading = false
                })
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
                this.host = '';
                this.port = '';
                this.path = '';
                this.scheme = '';
                this.method = '';
                this.fetchData();
            },
            handleRepeater(row) {
                this.$router.push({ path: `/holdAll/repeater/${row.id}` })
            },
            handleIntrusion(row) {
                this.$router.push({ path: `/holdAll/intrusion/${row.id}` })
            },
            handleSee(row) {
                this.formLoading = true;
                const params = {
                    style: 'repeater',
                    id: row.id
                }
                this.dialogFormVisible = true
                getInfo(params).then(res => {
                    console.log(res)
                    if(res.code == 200){
                        this.form.uuid = res.data.uuid;
                        this.form.scheme = res.data.scheme;
                        this.form.http_version = res.data.http_version;
                        this.form.port = res.data.port;
                        this.form.method = res.data.method;
                        this.form.host = res.data.host;
                        this.form.path = res.data.path;
                        this.form.headers = res.data.headers;
                        this.form.body = res.data.body;
                        this.form.cookie = res.data.headers?res.data.headers.split("Cookie=")[1].split(/[\n]/g)[0]:'';
                    }else{
                        Message.error(res.data);
                    }
                    this.formLoading = false
                }).catch(error => {
                    this.formLoading = false
                })
            }
        },
    }
</script>
<style scoped>
    .mineConduit{
        padding: 30px 20px 0 20px;
        line-height: 30px;
    }
    .table-list{
        margin-top: 20px;
    }
</style>