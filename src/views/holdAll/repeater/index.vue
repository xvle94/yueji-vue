<template>
    <div class="repeater">
        <el-button
            size="small"
            type="default"
            class="blue-button"
            @click="goBack">返回</el-button>
        <el-button
                size="small"
                type="default"
                class="blue-button"
                @click="addTab(editableTabsValue)"
            >
                添加标签页
            </el-button>
        <div class="tabs-box">
            <el-tabs tab-positio="left" v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
                <el-tab-pane
                    v-for="(item) in editableTabs"
                    :key="item.name"
                    :label="item.title"
                    :name="item.name"
                >
		            <TemplateRepeater></TemplateRepeater>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import TemplateRepeater from '@/components/TemplateRepeater/index.vue'
    export default {
        data() {
            return {
                id: this.$route.params.id,
                editableTabsValue: '1',
                editableTabs: [
                    {
                        title: 'Tab 1',
                        name: '1',
                        content: 'TemplateRepeater'
                    }, 

                ],
                tabIndex: 1
            }
        },
        components: {
            TemplateRepeater,
        },
        created() {
            console.log(this.id)
        },
        methods: {
            addTab(targetName) {
                let newTabName = ++this.tabIndex + '';
                this.editableTabs.push({
                    title: 'Tab '+newTabName,
                    name: newTabName,
                    content: ''
                });
                this.editableTabsValue = newTabName;
            },
            removeTab(targetName) {
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
            },
            goBack() {
                this.$router.go(-1);
            },
        }
    }
</script>
<style scoped>
    .repeater{
        padding: 30px 20px 0 20px;
    }
    .tabs-box{
        margin-top: 20px;
        
    }
</style>