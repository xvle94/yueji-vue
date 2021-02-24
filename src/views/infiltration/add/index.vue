<template>
    <div id="container">
        <el-row>
            <el-col :span="14">
                <div class="left-box">
                    <p class="title">
                        <el-steps :active="active" finish-status="success" process-status="process" simple>
                            <el-step title="基础信息" icon="el-icon-edit"></el-step>
                            <el-step title="参数设置" icon="el-icon-upload"></el-step>
                            <el-step title="漏洞校验" icon="el-icon-aim"></el-step>
                        </el-steps>
                    </p>
                    <div v-if="active == 0">
                        <el-form ref="form" :model="form" class="form-box"  label-width="80px" label-position="left">
                            <el-form-item label="任务名称">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="IP地址">
                                <el-input v-model="form.target"></el-input>
                            </el-form-item>
                            <el-form-item label="端口">
                                <el-input v-model="form.port_filter"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="active == 1" v-loading="loading">
                        <el-form 
                        ref="secondForm" 
                        :model="secondForm"  
                        label-width="130px" 
                        label-position="left" 
                        style="width:90%;margin: 60px auto 0 auto">
                            <el-row :gutter="20">
                                <el-col :span="12"
                                    v-for="(key, index) in common"
                                    :label="key.description"
                                    :key="key.key"
                                    :prop="key.id + '-' + index"
                                >
                                    <el-form-item
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
                                            style="width:100%"
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
                                            style="width:100%"
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
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div v-if="active == 2">
                        <el-input
                            style="margin-top:30px"
                            placeholder="输入关键字进行过滤"
                            v-model="filterText">
                        </el-input>
                        <el-tree
                            style="height:400px;overflow:auto;"
                            :data="searchData"
                            node-key="label"
                            show-checkbox
                            :filter-node-method="filterNode"
                            ref="tree"
                            >
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span>{{ node.label }}</span>
                                    <span v-if="!node.data.children">
                                        <el-button
                                            type="text"
                                            size="mini"
                                            @click="() => setPluginArgs(data)">
                                            参数设置
                                        </el-button>
                                    </span>
                                </span>
                        </el-tree>
                        
                    </div>
                    <div class="btn-box" v-if="active !=2">
                        <el-button size="mini" type="info" class="default-button" @click="goBack">取 消</el-button>
                        <el-button size="mini" class="blue-button" type="primary" @click="prev" :disabled="active == 0">上一步</el-button>
                        <el-button size="mini" type="primary" class="blue-button" @click="next">下一步</el-button>
                    </div>
                    <div class="btn-box" v-if="active ==2">
                        <el-button size="mini" class="default-button" type="info" @click="goBack">取 消</el-button>
                        <el-button size="mini" class="blue-button" type="primary" @click="prev">上一步</el-button>
                        <el-button size="mini" class="blue-button" type="primary" @click="submitForm()">开 始</el-button>
                    </div>
                    
                </div>
                <div class="bottom-box" v-if="active == 2">
                    <div class="tab-box">
                        <div class="tab tab1" :style="cur == 1?tabStyle:''" @click="tabClick(1)">扫描日志</div>
                        <div class="tab tab2" :style="cur == 2?tabStyle:''" @click="tabClick(2)">DNS log</div>
                        <div class="tab tab3" :style="cur == 3?tabStyle:''" @click="tabClick(3)">反向shell</div>
                        <div class="tab tab4" :style="cur == 4?tabStyle:''" @click="tabClick(4)">端口信息</div>
                        <div class="tab tab5" :style="cur == 5?tabStyle:''" @click="tabClick(5)">请求载荷</div>
                    </div>
                    <div class="tab-content">
                        <div v-show="cur == 1">
                            <div class="scan-log">
                                <ul>
                                    <li v-for="info in gridData">
                                        {{info.create_time | formatDate}} - {{info.plugin_name}} - {{info.msg}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div v-show="cur == 2">
                            <el-table
                                :header-cell-style="headerStyle"
                                :row-style="rowStyle"
                                :data="dnsData"
                                style="width: 96%;margin:20px auto 0 auto">
                                <el-table-column
                                label="目标地址"
                                >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.host }}</span>
                                </template>
                                </el-table-column>
                                <el-table-column
                                label="源IP"
                                >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.ip }}</span>
                                </template>
                                </el-table-column>
                                <el-table-column
                                label="类型"
                                >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.type }}</span>
                                </template>
                                </el-table-column>
                                <el-table-column
                                label="数据"
                                >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.host | formatDnsLog }}</span>
                                </template>
                                </el-table-column>
                                <el-table-column
                                label="创建时间"
                                >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.create_time }}</span>
                                </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div v-show="cur == 3">
                            <div v-if="session_id==null">
                                <el-table
                                    :header-cell-style="headerStyle"
                                    :row-style="rowStyle"
                                    :data="shellTableData"
                                    style="width: 96%;margin:20px auto 0 auto">
                                    <el-table-column
                                    label="session ID"
                                    >
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.session_id }}</span>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                    label="IP"
                                    >
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.ip }}</span>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                    label="创建时间"
                                    >
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.create_time }}</span>
                                    </template>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button
                                        size="mini"
                                        type="text"
                                        @click="connShell(scope.$index, scope.row)">连接</el-button>
                                        <el-popconfirm
                                            title="确认要删除吗？"
                                            @onConfirm="deleteShell(scope.$index, scope.row)"
                                            >
                                            <el-button slot="reference" size="mini" type="text" style="color:#EC6F5A">删除</el-button>
                                        </el-popconfirm>
                                    </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div v-else class="shell">
                                <div class="shell_head">
                                    <span width="200px">远程连接 SESSION ID {{session_id}}</span>
                                    <el-button slot="reference" size="mini" type="text" style="color:#909399" @click="backShell">返回</el-button>
                                </div>
                                <ul>
                                    <li v-for="info in shell_log[session_id]">
                                        {{info}}
                                    </li>
                                </ul>
                                <el-divider></el-divider>
                                <el-input
                                    @keyup.enter.native="runShell(session_id)"
                                    placeholder="请输入内容"
                                    v-model="shell_input[session_id]"
                                    clearable>
                                </el-input>
                            </div>
                        </div>
                        <div v-show="cur == 4">
                            <el-table
                                :header-cell-style="headerStyle"
                                :row-style="rowStyle"
                                :data="portData"
                                style="width: 96%;margin:20px auto 0 auto">
                                <el-table-column
                                label="端口"
                                >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.port }}</span>
                                </template>
                                </el-table-column>
                                <el-table-column
                                label="服务"
                                >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.service }}</span>
                                </template>
                                </el-table-column>
                                <el-table-column
                                label="版本"
                                >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.version }}</span>
                                </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div v-show="cur == 5">
                            <el-table
                                :header-cell-style="headerStyle"
                                :row-style="rowStyle"
                                :data="requestData"
                                style="width: 96%;margin:20px auto 0 auto">
                                <el-table-column
                                label="域名"
                                >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.request.host }}</span>
                                </template>
                                </el-table-column>
                                <el-table-column
                                label="请求类型"
                                >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.request.method }}</span>
                                </template>
                                </el-table-column>
                                <el-table-column
                                label="路径"
                                >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.request.path }}</span>
                                </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button
                                        size="mini"
                                        type="text"
                                        @click="handleTest(scope.row)">手动测试</el-button>
                                    </template>
                                    </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="10" v-if="active == 2">
                <div class="right-box">
                    <p class="rt-title">基础信息</p>
                    <div class="rt-info">
                        <el-row>
                            <el-col :span="6" v-if="this.judge==1">
                                <svg-icon icon-class="linux"/>
                                <p class="info-title">Linux</p>
                            </el-col>
                            <el-col :span="6" v-else-if="this.judge==2">
                                <svg-icon icon-class="windows"/>
                                <p class="info-title">Win</p>
                            </el-col>
                            <el-col :span="6" v-else>
                                <svg-icon icon-class="windows"/>
                                <p class="info-title">Unknown</p>
                            </el-col>
                            <el-col :span="18">
                                <div class="line"><span class="list-title">目标地址:</span><span class="list-data">{{testInfo.target}}</span></div>
                                <div class="line">
                                    <span class="list-title">IP:</span><span class="list-data">{{testInfo.ip}}</span>
                                    <span class="list-title">归属地:</span><span class="list-data">{{testInfo.place}}</span>
                                    <span class="list-title">服务器版本:</span><span class="list-data">{{testInfo.server}}</span>
                                </div>
                                <div class="line">
                                    <span class="list-title">开始:</span><span class="list-data">{{testInfo.create_time}}</span>
                                    <span class="list-title">总用时:</span><span class="list-data">{{totalTime}}</span>
                                </div>
                            </el-col>
                            <el-col :span="18">
                                <div class="line"><span class="list-title">DNSLOG地址:</span><span class="list-data">{{testInfo.dnslog}}</span></div>
                            </el-col>
                        </el-row>
                    </div>
                    <!-- 渗透结果 -->
                    <div class="rt-osmosis">
                        <div class="tab-top">
                            <span>渗透结果</span>
                            <div>
                                <el-input v-model="result_search" placeholder="请输入内容"></el-input>
                            </div>
                        </div>
                        <div class="tab-body">
                            <el-table
                                :header-cell-style="headerStyle"
                                :row-style="rowStyle"
                                :data="res_list"
                                style="width:96%;margin:0px auto 0 auto">
                                <el-table-column label="严重程度" min-width="40">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.risk }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="漏洞名称">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.info }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="目标地址" min-width="60">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.target }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" min-width="30">
                                    <template slot-scope="scope">
                                        <el-button
                                        size="mini"
                                        type="text"
                                        @click="handleDetail(scope.row)">查看</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <!--网站拓扑  -->
                    <div class="rt-web">
                        <p class="w-title">网站拓扑</p>
                        <div class="w-left">
                            <el-tree :data="tree_data" ref="web_tree" node-key="label" icon-class="tree-icon" default-expand-all @node-click="getNodes">
                            </el-tree>
                        </div>
                        <div class="w-right">
                            <div class="tab-body">
                                <el-table
                                    :header-cell-style="headerStyle"
                                    :row-style="rowStyle"
                                    :data="topologyData"
                                    style="width:96%;margin:0px auto 0 auto">
                                    <el-table-column label="URL">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.url }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="方法">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.method }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="参数">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.params }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button
                                            size="mini"
                                            type="text"
                                            @click="handleDelete(scope.$index, scope.row)">手动测试</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!-- 设置参数弹框 -->
        <el-dialog :title="dialogInfo.title" :visible.sync="dialogFormVisible" width="500px">
            <div>
                <el-divider>插件详情</el-divider>
                <span>{{ dialogInfo.info }}</span>
                <el-divider>参数设置</el-divider>
            </div>
            <el-form :model="pluginForm" label-width="120px" ref="pluginForm" >
                <el-row v-for="(key, index) in pluginForm.options" :key="key.name">
                    <el-form-item :label="key.name" :prop="'options.' + index + '.default'" :rules="pluginRule[key.name]">
                        <el-tooltip class="item" effect="dark" :content="key.description" :disabled="key.description==''" placement="top">
                            <div v-if="key.style != 'wordlist'">
                                <el-input v-model="key.default"></el-input>
                            </div>
                            <div v-if="key.style == 'wordlist'">
                                <el-select
                                    style="width:100%"
                                    v-model="key.default"
                                    placeholder="请选择"
                                >
                                    <el-option
                                    v-for="item in wordlistOptions"
                                    :key="item.id"
                                    :label="item.file"
                                    :value="item.file"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </el-tooltip>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="runPlugin">启 动</el-button>
            </div>
        </el-dialog>
        <!-- 查看弹框 -->
        <el-dialog :title="detailTitle" :visible.sync="detailVisible" width="700px">
            <div class="info-box">
                <div class="level" :style="borderStyle">{{level}}</div>
                <p class="title">漏洞描述</p>
                <div>{{detailData.description}}</div>
                <p class="title">攻击细节</p>
                <div>{{detailData.result}}</div>
                <p class="title">此漏洞的影响</p>
                <div>{{detailData.influences}}</div>
                <p class="title">如何修复此漏洞</p>
                <div>{{detailData.solution}}</div>
                <p class="title">分类</p>
                <div>
                    <el-tag v-for="i in detailData.category">{{i}}</el-tag>
                </div>
            </div>
        </el-dialog>
        <!-- 手动测试 -->
        <el-dialog :title="testTitle" :visible.sync="testVisible" width="1000px">
            <el-form :model="testForm" label-width="80px" ref="testForm">
                <div class="testForm">
                    <el-form-item>
                        <el-radio-group v-model="testForm.resource">
                            <el-radio label="查看"></el-radio>
                            <el-radio label="手动请求"></el-radio>
                            <el-radio label="爆破"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 查看 -->
                    <div class="checkBox" v-if="testForm.resource=='查看'">
                        <el-row>
                            <el-col :span="14">
                                <div class="c-top">
                                    <label>UUID</label>
                                    <span>{{this.UUID}}</span>
                                </div>
                                <div class="c-middle">
                                    <p>证书</p>
                                    <div class="left-ul">
                                        <ul>
                                            <li>
                                                <span class="s-left">颁布者：</span><span class="s-right">{{checkForm.certificate.issuer}}</span>
                                            </li>
                                            <li>
                                                <span class="s-left">协议：</span><span class="s-right">{{checkForm.certificate.protocol}}</span>
                                            </li>
                                            <li>
                                                <span class="s-left">发行期：</span><span class="s-right">{{checkForm.certificate.validFrom}}</span>
                                            </li>
                                            <li>
                                                <span class="s-left">签名算法：</span><span class="s-right">{{checkForm.certificate.cipher}}</span>
                                            </li>
                                            <li>
                                                <span class="s-left">公钥：</span>
                                                <span class="s-right">{{checkForm.certificate.keyExchange}}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="right-ul">
                                        <ul>
                                            <li>
                                                <span class="s-left">颁发给：</span>
                                                <span class="s-right">{{checkForm.certificate.subjectName}}</span>
                                            </li>
                                            <li>
                                                <span class="s-left">证书透明度合规性：</span>
                                                <span class="s-right">{{checkForm.certificate.certificateTransparencyCompliance}}</span>
                                            </li>
                                            <li>
                                                <span class="s-left">有效期至：</span>
                                                <span class="s-right">{{checkForm.certificate.validTo}}</span>
                                            </li>
                                            <li>
                                                <span class="s-left">签名哈希算法：</span>
                                                <span class="s-right">{{checkForm.certificate.keyExchangeGroup}}</span>
                                            </li>
                                            <li></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="c-bottom">
                                    <p>查看</p>
                                    <div class="head">
                                        <div>协议:{{checkForm.request.scheme}}</div>
                                        <div>HTTP版本:{{checkForm.request.http_version}}</div>
                                        <div>端口:{{checkForm.request.port}}</div>
                                        <div>请求类型:{{checkForm.request.method}}</div>
                                        <div>HOST:{{checkForm.request.host}}</div>
                                    </div>
                                    <div>
                                        <el-form-item label="路径">
                                            <el-input v-model="checkForm.request.path"></el-input>
                                        </el-form-item>
                                        <el-form-item label="cookie">
                                            <el-input v-model="checkForm.request.cookie"></el-input>
                                        </el-form-item>
                                        <el-form-item label="头部">
                                            <el-input v-model="checkForm.request.headers"></el-input>
                                        </el-form-item>
                                        <el-form-item label="body">
                                            <el-input type="textarea" v-model="checkForm.request.body"></el-input>
                                        </el-form-item>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="10">
                                <div class="left">
                                    <p>响应</p>
                                    <el-form-item label="头部">
                                        <el-input type="textarea" rows="23" v-model="checkForm.response.headers"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <!-- 手动请求 -->
                    <div class="handleBox" v-else-if="testForm.resource=='手动请求'">
                        <el-button
                            size="small"
                            type="default"
                            class="blue-button"
                            @click="addTab(handleTabsValue)"> 添加标签页</el-button>
                        <el-tabs tab-positio="left" v-model="handleTabsValue" type="card" closable @tab-remove="removeTab">
                            <el-tab-pane
                                v-for="(item) in handleTabs"
                                :key="item.name"
                                :label="item.title"
                                :name="item.name">
                                <TemplateRepeater :psMsg="UUID"> </TemplateRepeater>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <!-- 爆破 -->
                    <div class="blastBox" v-else>
                        <template>
                            <div class="tabs-box" v-for="(item, index) in editableTabs" style="width: 90%;margin: auto;">
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
                        </template>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="testVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>
<script>
import moment from 'moment'
import { getDetailInfo, getTaskDetail} from '@/api/targetDetail'
import { searchExploit, shellList, dnsList, taskExportInfo, runPluginOne, shellExploit, getExprtInfo, newExprt, getExprtTree, getInfos, postProxyIntruder, getUploadList} from "@/api/infiltration";
import { getList, getInfo } from '@/api/holdAll'
import { getCurrency, setCurrency } from "@/api/systemSet";
import { Message } from "element-ui";
import { option } from 'runjs';
import { message } from '@/utils/resetMessage';
import TemplateRepeater from '@/components/TemplateRepeater/index.vue'
import "@/views/infiltration/add/index.scss"
export default {
    data(){
        return {
            active: 0,
            form: {
                name:'',
                target:'',
                port_filter:'',
            },
            secondForm: {

            },
            result_search:"",
            pluginForm:{},
            common: {},
            options: [],
            wordlistOptions: [],
            loading: true,
            //search exploit
            searchData:[],
            filterText: '',
            tabStyle: {
                background: '#4B89DC'
            },
            cur:1,
            id: this.$route.query.id,
            rowStyle:{
                backgroundColor: '#2E3D52',
                color: '#fff',
            },
            headerStyle: {
                backgroundColor: '#3C4B62',
                color: '#fff',
                border: 'none'
            },
            shellTableData: [],
            websock: null,
            gridData:[],
            scanData:[],
            // 渗透测试基本信息
            totalTime:"",
            testInfo:{},
            judge:null,
            // 渗透结果
            result_search:"",
            res_list:[],
            dialogFormVisible: false,
            dialogInfo:{},
            isMsf: false,
            gridData: [],
            scanData: [],
            portData: [],
            requestData: [],
            dnsData: [],
            session_id:null,
            shell_log: [],
            shell_input: {},
            pluginRule: {},
            //网站拓扑
            tree_data: [],
            topologyData:[],
            // 查看
            detailVisible:false,
            detailTitle:"",
            level:"",
            detailData:{},
            borderStyle:{
                background: '#F14F4F'
            },
            // 手动response
            UUID:"",
            checkForm:{request:{},response:{},certificate:{}},
            testVisible:false,
            testTitle:"手动response",
            testForm:{
                resource:'查看'
            },
            // 手动请求
            handleTabsValue: '1',
            handleTabs: [
                {
                    title: 'Tab 1',
                    name: '1',
                    content: 'TemplateRepeater'
                }, 

            ],
            tabIndex: 2,
            activeName:"Response",
            

            // 爆破
            blastName:"first",
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
        }
    },
    components: {
        TemplateRepeater,
    },
    created() {
        if (this.id != undefined){
            this.active = 2;
        }
        this.fetchCurrency();
        this.fetchUploadList();
        this.fetchSearchFn();
        this.initWebSocket();
        this.selectBaseData();
    },
    mounted() {

    },
    destroyed() {
        this.websock.close() //离开路由之后断开websocket连接
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    filters: {
        formatDate: function (value) {
            return moment.unix(value).format('YYYY-MM-DD hh:mm:ss')
        },
        formatDnsLog: function (value) {
            return value.split(".").slice(0,-3).join(".")
        }
    },
    methods: {
        addTab(targetName) {
            let newTabName = ++this.tabIndex + '';
            this.handleTabs.push({
                title: 'Tab '+newTabName,
                name: newTabName,
                content: ''
            });
            this.handleTabsValue = newTabName;
        },
        removeTab(targetName) {
            let tabs = this.handleTabs;
            let activeName = this.handleTabsValue;
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
            
            this.handleTabsValue = activeName;
            this.handleTabs = tabs.filter(tab => tab.name !== targetName);
        },
        initWebSocket(){ //初始化weosocket
            const wsuri = "ws://"+window.location.host+"/ws/log/"+this.id+"";
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
            // console.log(redata);
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
        fetchSearchFn(){
            searchExploit().then(res => {
                if(res.code == 200){
                    console.log(res)
                    var arr = [];
                    var num = 0;
                    for(var i=0;i<res.data.length;i++){
                        arr.push({
                            id:i+1,
                            label:res.data[i].category,
                            children:res.data[i].children.map(function(obj,index,array) { var rObj = {}; rObj['label'] = obj.vuln_name;rObj['value'] = obj.plugin_name;rObj['msf']=obj.msf; return rObj; })})
                        
                    }
                    this.searchData = arr;
                }
            })
        },
        tabClick(tab){
            this.cur = tab;
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        typeResolution(value) {
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
                    this.secondForm[res.data[item].key] = "";
                    }
                } else {
                    Message.error(res.data);
                }
                console.log(this.secondForm)
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
        selectBaseData(){
            if (this.id!= undefined){
                taskExportInfo(this.id,'').then(res => {
                    this.testInfo=res.data
                    var time=res.data.create_time;
                    var date1 = new Date(res.data.create_time)
                    var date2 = new Date()
                    var s1 = date1.getTime(),s2 = date2.getTime();
                    var total = (s2 - s1)/1000;
                    var day = parseInt(total / (24*60*60));//计算整数天数
                    var afterDay = total - day*24*60*60;//取得算出天数后剩余的秒数
                    var hour = parseInt(afterDay/(60*60));//计算整数小时数
                    var afterHour = total - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数
                    var min = parseInt(afterHour/60);//计算整数分
                    var afterMin = total - day*24*60*60 - hour*60*60 - min*60;//取得算出分后剩余的秒数
                    this.totalTime=day+"天"+hour+"小时"+min+"分"

                    var str = this.testInfo.os;
                    this.form.name=this.testInfo.name;
                    this.form.target=this.testInfo.target;
                    this.form.port_filter=this.testInfo.port;
                    if(str.indexOf("linux") !== -1){
                        this.judge=1;
                    }else if(str.indexOf("win") !== -1){
                        this.judge=2
                    }else{
                        this.judge=3;
                    }
                })
                taskExportInfo(this.id,'port').then(res => {
                    this.portData = res.data;
                    // console.log("xxxxxxxxx",res);

                })
                shellList(this.id).then(res => {
                    console.log(res);
                    this.shellTableData = res.data;
                    // this.shellTableData = [{create_time:'2020-04-04',session_id:'123',ip:'192.168.1.1'},{create_time:'2020-04-04',session_id:'1235',ip:'192.168.1.1'}];
                })
                dnsList(this.id).then(res => {
                    if(res.code == 200){
                        this.dnsData=res.data
                    }
                })
                const param = {
                    id:this.id,
                    tag:2
                }
                getDetailInfo(param).then(res => {
                    console.log(res)
                    this.res_list = res.data.data.res_list;
                })
                getList({tid: this.id}).then(res=>{
                    this.requestData=res.data;
                })
                const query={
                    tid:this.id
                }
                getExprtTree(query).then(res=>{  
                    let arr=[]
                    let childArr=[]
                    for (let node in res.data.tree) {
                        this.tree_data.push({
                            label: node,
                            children: arr,
                        });
                        this.topologyData=res.data.data[node]
                        for (let key in res.data.tree[node]){
                            if(JSON.stringify(res.data.tree[node][key]) == "{}"){
                                arr.push({
                                    label: key,
                                });
                            }else{
                                for (let keys in res.data.tree[node][key]){
                                    childArr.push({
                                        label: keys,
                                    });
                                }
                                arr.push({
                                    label: key,
                                    children:childArr
                                });
                            }
                        }
                    }
                    console.log(this.tree_data)
                })
            }
        },
        getNodes(data, node, obj){
            console.log(checkNode)
        },
        lookRequest(rid){
            console.log(rid)
        },
        connShell(index, row){
            this.session_id = row.session_id;

            console.log(row)
        },
        deleteShell(index, row){
            console.log(row)
            this.shellTableData.splice(index,1);
        },
        pushShell(session_id,msg){
            if (session_id in this.shell_log){
                // console.log(session_id,msg)
                // this.shell_log.push(msg)
                this.shell_log[session_id].push(msg)
            }else{
                this.shell_log[session_id] = [msg]
            }
        },
        runShell(session_id){
            console.log(session_id)
            if (this.shell_input[session_id]!=''){ 
                shellExploit({tid:this.id,session:session_id,message:this.shell_input[session_id]}).then(res=>{
                    this.pushShell(session_id,"> "+ this.shell_input[session_id])
                    if(res.code==200){
                        this.pushShell(session_id, res.data)
                    }
                    console.log(this.shell_log[session_id])
                })
            }
        },
        backShell(){
            this.session_id = null;
        },
        //下一步
        next() {
            console.log(this.active)
            if(this.active == 1 && this.id == undefined){
                console.log(this.secondForm)
                console.log(this.common)
                let arr = [];
                this.common.map((item) => {
                    console.log(item);
                    arr.push({key:item.key,value:item.value});
                })
                const params = {
                    name: this.form.name,
                    target: this.form.target,
                    common: arr
                }
                newExprt(params).then(res => {
                    console.log(res);
                    if(res.code == 200){
                        this.id = res.data.id;
                        message.success(res.data.msg);
                        // const param = {
                        //     // id: this.id,
                        //     id:32,
                        //     tag:2
                        // }
                        // getDetailInfo(param).then(res => {
                        //     console.log("Ass")
                        //     console.log(res)
                        //     this.res_list = res.data.data.res_list;
                        // })
                        selectBaseData();
                    }
                })
            }
            if (this.active++ > 3) this.active = 3;
        },
        //上一步
        prev(){
            if (this.active-- < 0) this.active = 0;
        },
        goBack(){
            this.$router.go(-1);
        },
        // 参数设置弹框
        setPluginArgs(data){
            console.log(this.wordlistOptions)
            this.dialogFormVisible = true;
            this.isMsf = data.msf;
            this.pluginRule = {};
            this.dialogInfo = {title: data.label, plugin_name: data.value},
            getExprtInfo({tid: this.id, exp: data.value}).then(res => {
                this.dialogInfo['info'] = res.data.information;
                console.log(res)
                if (data.msf){
                    this.pluginForm = {options:{}}
                    for(var p in res.data.options){
                        this.pluginForm.options[res.data.options[p]] = {name:res.data.options[p], description:"", style:"str", default:""}
                    }
                }
                else{
                    this.pluginForm = res.data;
                }
                for(var p in res.data.required){
                    this.pluginRule[res.data.required[p]]=[{ required: true, message: '缺失该参数', trigger: 'change' }]
                }
                this.dialogFormVisible = true;
            })
        },
        // 运行插件
        runPlugin(){
            let form={}
            for(var p in this.pluginForm.options){
                form[this.pluginForm.options[p].name] = this.pluginForm.options[p].default;
            }
            this.$refs['pluginForm'].validate((valid) => {
                if (valid) {
                    runPluginOne({plugin_name: this.dialogInfo.plugin_name, tid: this.id, msf: this.isMsf, common: form}).then(res=>{
                        if (res.code == 200){
                            this.dialogFormVisible = false;
                            this.$message.error('扫描成功');
                        }
                    })
                }else {
                    this.$message.error('参数错误，请重新填写');
                }
            })
        },
        // 查看
        handleDetail(row){
            const params = this.id+'/'+row.id
            // const params =32+'/'+440
            console.log(params)
            getTaskDetail(params).then(res => {
                console.log(res)
                if(res.code == 200){
                    this.detailTitle = res.data[0].vuln_name;
                    this.detailData=res.data[0];
                    this.level = res.data[0].level==3?'高':res.data[0].level==2?'中':res.data[0].level==1?'低':'';
                    this.borderStyle.background = res.data[0].level==3?'#EC6F5A':res.data[0].level==2?'#F7C65F':res.data[0].level==1?'#70CA63':'';
                    this.detailVisible=true
                }else if(res.code == 404){
                    this.$message({
                        message:res.data,
                        type: 'warning'
                    });
                }else{
                    console.log(res)
                }
                this.loading = false
            }).catch(error => {
                this.loading = false
            })
        },

        // 手动测试
        handleTest(row){
            console.log(row)
            this.checkForm=row
            this.checkForm.cookie=row.request.headers?row.request.headers.split("Cookie=")[1].split(/[\n]/g)[0]:'';
            let response_headers=[]
            for (let [key, value] of Object.entries(row.response.headers)) {
                response_headers.push(key+"="+value);
            }
            this.checkForm.response.headers=response_headers.join("\n");
            this.UUID=row.id;
            // 爆破
            this.fetchData(row.id)
            this.testVisible=true
        },
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
        fetchData(id) {
            const params = {
                id: id, 
                style: "intruder"
            }
            getInfos(params).then(response => {
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
                this.editableTabs[0].content.port = '443'
            }
        }
    }
}
</script>
<style lang="less" scoped>
    #container{
        min-height: calc(100vh - 50px);
    }
    .title{
        font-size: 14px;
        color: #606266;
    }
    .left-box{
        padding: 20px 40px;
        position: relative;
    }
    .form-box{
        width: 300px;
        margin: 60px auto 0 auto;
    }
    .btn-box{
        text-align: center;
        margin-top: 20px
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .bottom-box{
        background: #1E2B3B;
        position: absolute;
        bottom: 0;
        height: 300px;
        width: 58.33%;
    }
    .tab-box{
        color: #fff;
        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: center;
        width: 60%;
        font-size: 14px;
        margin-left: 10px;
    }
    .tab{
        flex: 1;
        background: #2E3D52;
        height: 20px;
        line-height: 20px;
        margin: 6px 2px 6px 0;
        cursor: pointer;
    }
    .tab-content{
        color: #fff;
        background: #2E3D52;
        position: absolute;
        bottom: 10px;
        top: 30px;
        left: 10px;
        right: 10px;
        height: 100%;
        overflow-y: auto;
    }
    .tab-content::-webkit-scrollbar {
        display: none;
    }
    .scan-log li{
        margin-bottom: 5px;
    }
    .right-box{
        background: #2F363E;
        min-height: calc(100vh - 50px);
        
    }
    .rt-title{
        color: #fff;
        font-size: 16px;
        text-align: center;
        padding: 20px 0;
    }
    .svg-icon[data-v-c8a70580]{
        width: 4rem;
        height: 4rem;
    }
    .info-title{
        color:#4B89DC
    }
    .list-title{
        color: #4B89DC;
        font-size:14px;
        margin-right: 6px;
    }
    .list-data{
        color: #fff;
        font-size:14px;
        margin-right:10px;
    }
    .rt-info .el-col-6{
        text-align: center
    }
    .rt-info .line{
        line-height: 22px
    }
    .shell button{
        float: right;
    }
    .shell .shell_head{
        position: relative;
    }
    .shell .shell_head span{
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0%);
    }
    .shell .el-divider{
        position: absolute;
    }
    ::v-deep .el-table tbody tr:hover > td {
        background-color: transparent;
    }
    .rt-osmosis{
        margin-top: 20px;
        background: #2E3D52;
    }
    .tab-body{
        height:250px;
        overflow-y: auto;
    }
    .tab-body::-webkit-scrollbar {
        display: none;
    }
    .tab-top{
        padding:10px 20px 10px 20px;
        display: flex;
        align-items: center;
    }
    .tab-top div{
        float: right;
        width: 90%
    }
    .tab-top input{
        width: 90%
    }
    #container .el-input__inner{
        background: #3C4B62
    }
    .tab-top span{
        color: #fff;
        font-size: 14px;
        width: 10%;
        padding-right: 10px;
    }
    .tab-top .el-input{
        width: auto
    }
    .w-title{
        color: #fff;
        font-size: 14px
    }
    .rt-web{
        background: #2E3D52;
        min-height: 400px;
        margin-top: 20px;
        padding: 10px 20px
    }
    .w-right{
        width: 64%;
        display: inline-block;
        float: right;
        margin-top: 10px;
    }

    .info-box{
        color: #777877;
    }
    .info-box .level{
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #fff;
        font-size: 12px;
    }
    .info-box .title{
        border-bottom: 1px solid #F14F4F;
        margin-top: 20px;
        padding-bottom: 5px;
        margin-bottom:5px;

    }
    .el-table{
        background:#2E3D52
    }
    .el-table {
        background:#2E3D52;
    }
    .el-steps--simple{
        background:none;
    }
    
</style>
    