<template>
    <div class="app-container">
        <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true">
            <el-form-item label="业务权限名称" >
             <el-select v-model="queryParams.businessId" clearable filterable placeholder="请选择">
                    <el-option v-for="item in businessList" :key="item.businessId" :label="item.businessName"
                        :value="item.businessId" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    v-hasPermi="['system:business:add']"
                    type="primary"
                    plain
                    icon="Plus"
                    @click="openSelectUser"
                    >添加业务权限</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    v-hasPermi="['system:business:remove']"
                    type="danger"
                    plain
                    icon="CircleClose"
                    :disabled="multiple"
                    @click="cancelAuthUserAll"
                    >批量取消授权</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="Close" @click="handleClose">关闭</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selectionChange="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="权限主体编码" prop="manageOrgId" :show-overflow-tooltip="true" />
            <el-table-column label="权限主体名称" prop="orgName" :show-overflow-tooltip="true" />
            <!-- <el-table-column label="权限主体类型" prop="email" :show-overflow-tooltip="true" /> -->
            <el-table-column label="业务权限名称" prop="businessName" :show-overflow-tooltip="true" />
            <el-table-column label="管理组织编码" prop="manageOrgCode" :show-overflow-tooltip="true" />
            <el-table-column label="管理组织名称" prop="manageOrgName" :show-overflow-tooltip="true" />
            <!-- <el-table-column label="管理组织类型" prop="phonenumber" :show-overflow-tooltip="true" /> -->
            <el-table-column label="创建人工号" prop="orgCode" :show-overflow-tooltip="true" />
            <el-table-column label="创建人" prop="createByNickName" :show-overflow-tooltip="true" />
            <!-- <el-table-column label="状态" align="center" prop="status">
                <template #default="scope">
                    <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
                </template>
            </el-table-column> -->
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button
                        v-hasPermi="['system:business:remove']"
                        link
                        type="primary"
                        icon="CircleClose"
                        @click="cancelAuthUser(scope.row)"
                        >取消授权</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            :total="total"
            @pagination="getList"
        />

        <select-business ref="selectRef"
        :orgId="queryParams.orgId" :orgType="queryParams.orgType" :subAdmin="queryParams.subAdmin"
        @ok="handleQuery" />
    </div>
</template>

<script setup name="authBusiness" lang="ts">
/* eslint-disable camelcase */
import selectBusiness from './selectBusiness.vue';
import { listBusinessAuth, delBusinessAuth } from '@/api/system/business';
import { listBusiness } from '@/api/system/business';
import { parseTime } from '@/utils/ruoyi';
import { getCurrentInstance, ComponentInternalInstance, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = proxy!.useDict('sys_normal_disable');

const userList = ref<any[]>([]);
const businessList = ref<any[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const multiple = ref(true);
const total = ref(0);
const userIds = ref<any[]>([]);
const closeOjb=[
{ path: '/system/dept' },
{ path: '/system/user' },
{ path: '/system/post' },
{ path: '/system/subAdminUser' },
{ path: '/system/subAdminDept' },
]
const queryParams = reactive<{
    pageNum: number;
    pageSize: number;
    orgId: any;
    orgType: any;
    subAdmin: any;
    businessId: any;
}>({
    pageNum: 1,
    pageSize: 10,
    orgId: route.query.orgId,
    orgType: route.query.orgType,
    subAdmin: route.query.subAdmin?route.query.subAdmin:undefined,
    businessId: undefined,
});

/** 查询授权业务列表 */
function getList() {
    loading.value = true;
    listBusinessAuth(queryParams).then((response: any) => {
        userList.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
}
// 返回按钮
function handleClose() {
    let obj
    if(queryParams.orgType ==1 && queryParams.subAdmin=='true'){
        obj = closeOjb[3];
    }else if(queryParams.orgType ==0 && queryParams.subAdmin=='true'){
        obj = closeOjb[4];
    }else{
        obj = closeOjb[queryParams.orgType];
    }

    proxy!.$tab.closeOpenPage(obj);
}
/** 搜索按钮操作 */
function handleQuery() {
    queryParams.pageNum = 1;
    getList();
}
/** 重置按钮操作 */
function resetQuery() {
    proxy!.resetForm('queryRef');
    handleQuery();
}
// 多选框选中数据
function handleSelectionChange(selection: any[]) {
    userIds.value = selection.map(item => item.id);
    multiple.value = !selection.length;
}
/** 打开授权业务表弹窗 */
function openSelectUser() {
    (proxy?.$refs['selectRef'] as any).show();
}
/** 取消授权按钮操作 */
function cancelAuthUser(row: any) {
    proxy!.$modal
        .confirm('确认要取消该业务权限？')
        .then(function () {
            return delBusinessAuth([row.id]);
        })
        .then(() => {
            getList();
            proxy!.$modal.msgSuccess('取消授权成功');
        })
        .catch((e: any) => {
            console.log(e);
        });
}
/** 批量取消授权按钮操作 */
function cancelAuthUserAll(row: any) {
    const Ids = userIds.value;
    proxy!.$modal
        .confirm('是否取消选中业务权限授权数据项?')
        .then(function () {
            return delBusinessAuth(Ids);
        })
        .then(() => {
            getList();
            proxy!.$modal.msgSuccess('取消授权成功');
        })
        .catch((e: any) => {
            console.log(e);
        });
}

/** 查询业务权限 */
function getBusinessList() {
    listBusiness({subAdmin:route.query.subAdmin?route.query.subAdmin:undefined}).then((response: any) => {
        businessList.value = response.rows;
    });
}
getList();
getBusinessList();
</script>
