<template>
    <div class="app-container">
        <el-row :gutter="10" class="topDIv">
            <el-col :span="24">
                <h3>权限主体：{{ mainName }}</h3>
            </el-col>
        </el-row>

        <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true">
            <el-form-item label="角色编码" prop="roleKey">
                <el-input v-model="queryParams.roleKey" placeholder="请输入角色编码" clearable style="width: 240px"
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" clearable style="width: 240px"
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button v-hasPermi="['system:role:add']" type="primary" plain icon="Plus"
                    @click="openSelectUser">添加</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button v-hasPermi="['system:role:remove']" type="danger" plain icon="CircleClose" :disabled="multiple"
                    @click="cancelAuthUserAll">批量取消授权</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="Close" @click="handleClose">关闭</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selectionChange="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="角色编码" prop="roleKey" :show-overflow-tooltip="true" />
            <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" />
            <el-table-column label="创建人工号" prop="createBy" :show-overflow-tooltip="true" />
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
                    <el-button v-hasPermi="['system:role:remove']" link type="primary" icon="CircleClose"
                        @click="cancelAuthUser(scope.row)">取消授权</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
            :total="total" @pagination="getList" />
        <select-role ref="selectRef" :deptId="queryParams.deptId" @ok="handleAddDeptRole" :subAdmin="queryParams.subAdmin"/>
    </div>
</template>

<script setup name="AuthUser" lang="ts">
/* eslint-disable camelcase */
import selectRole from '../role/selectRole.vue';
import { listDeptRole, delDeptRole, addDeptRole } from '@/api/system/dept';
import { parseTime } from '@/utils/ruoyi';
import { getCurrentInstance, ComponentInternalInstance, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = proxy!.useDict('sys_normal_disable');

const userList = ref<any[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const multiple = ref(true);
const total = ref(0);
const roleIds = ref<any[]>([]);
const mainName = route.query.Name;
const queryParams = reactive<{
    pageNum: number;
    pageSize: number;
    deptId: any;
    roleName: any;
    roleKey: any;
    subAdmin: any;
}>({
    pageNum: 1,
    pageSize: 10,
    deptId: route.query.Id,
    roleName: undefined,
    roleKey: undefined,
    subAdmin: route.query.subAdmin?route.query.subAdmin:undefined,
});

/** 查询授权角色列表 */
function getList() {
    loading.value = true;
    listDeptRole(queryParams).then((response: any) => {
        userList.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
}
// 返回按钮
function handleClose() {
    let obj
    if(queryParams.subAdmin=='true'){
        obj = { path: '/system/subAdminDept' };
    }else{
        obj = { path: '/system/dept' };
    }

    proxy!.$tab.closeOpenPage(obj);
}
/** 搜索按钮操作 */
function handleQuery() {
    queryParams.pageNum = 1;
    getList();
}

//添加角色
async function handleAddDeptRole(roleIds: any) {
    const params={
        roleIds:roleIds,
        deptId:route.query.Id,
        subAdmin:true
    }
    await addDeptRole(params)
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
    roleIds.value = selection.map(item => item.roleId);
    multiple.value = !selection.length;
}
/** 打开授权角色表弹窗 */
function openSelectUser() {
    (proxy?.$refs['selectRef'] as any).show();
}
/** 取消授权按钮操作 */
function cancelAuthUser(row: any) {
    proxy!.$modal
        .confirm('确认要取消该角色"' + row.roleName + '"角色吗？')
        .then(function () {
            return delDeptRole({ roleIds: [row.roleId], deptId: queryParams.deptId });
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
    const deptId = queryParams.deptId;
    const uIds = roleIds.value;
    proxy!.$modal
        .confirm('是否取消选中角色授权数据项?')
        .then(function () {
            return delDeptRole({ deptId: deptId, roleIds: uIds });
        })
        .then(() => {
            getList();
            proxy!.$modal.msgSuccess('取消授权成功');
        })
        .catch((e: any) => {
            console.log(e);
        });
}

getList();
</script>
<style lang="scss" scoped>
.topDIv {
    margin-bottom: 15px;
    font-weight: 700;
    color: var(--el-text-color-regular);
}
</style>

