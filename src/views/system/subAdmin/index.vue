<template>
    <div class="app-container">
        <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true">
            <el-form-item label="用户名称" prop="userName">
                <user-selectpage :Id="queryParams.userId" style="width: 240px" @ok="selectedUser" />
            </el-form-item>
            <el-form-item label="用户部门" prop="deptName">
                <el-input v-model="queryParams.deptName" placeholder="人员选择后自动带出" style="width: 240px" readonly />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <!-- <el-button icon="Refresh" @click="resetQuery">重置</el-button> -->
            </el-form-item>
        </el-form>
        <el-tabs v-model="activeId" type="border-card">
            <el-tab-pane label="分配部门" name="0">
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button :disabled="!queryParams.userId" v-hasPermi="['system:subAdmin:add']" type="primary" plain icon="Plus"
                            @click="openSelectUser">添加</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-hasPermi="['system:subAdmin:remove']" type="danger" plain icon="CircleClose"
                            :disabled="multiple" @click="cancelAuthUserAll">批量取消授权</el-button>
                    </el-col>
                    <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <el-table v-loading="loading" :data="userList" @selectionChange="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="部门编码" prop="deptCode" :show-overflow-tooltip="true" />
                    <el-table-column label="部门名称" prop="deptName" :show-overflow-tooltip="true" />
                    <el-table-column label="创建人" prop="createBy" :show-overflow-tooltip="true" />
                    <el-table-column label="状态" align="center" prop="status">
                        <template #default="scope">
                            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                        <template #default="scope">
                            <span>{{ parseTime(scope.row.createTime) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template #default="scope">
                            <el-button v-hasPermi="['system:subAdmin:remove']" link type="primary" icon="CircleClose"
                                @click="cancelAuthUser(scope.row)">取消授权</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
                    :total="total" @pagination="getList" />
                <select-user ref="selectRef" :roleId="queryParams.roleId" @ok="handleQuery" />
            </el-tab-pane>
            <el-tab-pane label="分配角色" name="1">
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button :disabled="!queryParams.userId" v-hasPermi="['system:subAdmin:add']" type="primary" plain
                            icon="Plus" @click="openSelectUser">添加</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-hasPermi="['system:subAdmin:remove']" type="danger" plain icon="CircleClose"
                            :disabled="multiple" @click="cancelAuthUserAll">批量取消授权</el-button>
                    </el-col>
                    <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <el-table v-loading="loading" :data="userList" @selectionChange="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="角色编码" prop="roleKey" :show-overflow-tooltip="true" />
                    <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" />
                    <el-table-column label="创建人" prop="createBy" :show-overflow-tooltip="true" />
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
                            <el-button v-hasPermi="['system:subAdmin:remove']" link type="primary" icon="CircleClose"
                                @click="cancelAuthUser(scope.row)">取消授权</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
                    :total="total" @pagination="getList" />
                <select-user ref="selectRef" :roleId="queryParams.roleId" @ok="handleQuery" />
            </el-tab-pane>
            <el-tab-pane label="分配岗位" name="2">
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button :disabled="!queryParams.userId" v-hasPermi="['system:subAdmin:add']" type="primary" plain icon="Plus"
                            @click="openSelectUser">添加</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-hasPermi="['system:subAdmin:remove']" type="danger" plain icon="CircleClose"
                            :disabled="multiple" @click="cancelAuthUserAll">批量取消授权</el-button>
                    </el-col>
                    <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <el-table v-loading="loading" :data="userList" @selectionChange="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="岗位编码" prop="postCode" :show-overflow-tooltip="true" />
                    <el-table-column label="岗位名称" prop="postName" :show-overflow-tooltip="true" />
                    <el-table-column label="状态" align="center" prop="status">
                        <template #default="scope">
                            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                        <template #default="scope">
                            <span>{{ parseTime(scope.row.createTime) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template #default="scope">
                            <el-button v-hasPermi="['system:subAdmin:remove']" link type="primary" icon="CircleClose"
                                @click="cancelAuthUser(scope.row)">取消授权</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
                    :total="total" @pagination="getList" />
                <select-user ref="selectRef" :roleId="queryParams.roleId" @ok="handleQuery" />
            </el-tab-pane>
            <el-tab-pane label="业务权限" name="3">
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button :disabled="!queryParams.userId" v-hasPermi="['system:subAdmin:add']" type="primary" plain icon="Plus"
                            @click="openSelectUser">添加</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button v-hasPermi="['system:subAdmin:remove']" type="danger" plain icon="CircleClose"
                            :disabled="multiple" @click="cancelAuthUserAll">批量取消授权</el-button>
                    </el-col>
                    <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <el-table v-loading="loading" :data="userList" @selectionChange="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="业务权限编码" prop="businessCode" :show-overflow-tooltip="true" />
                    <el-table-column label="业务权限名称" prop="businessName" :show-overflow-tooltip="true" />
                    <el-table-column label="状态" align="center" prop="status">
                        <template #default="scope">
                            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                        <template #default="scope">
                            <span>{{ parseTime(scope.row.createTime) }}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template #default="scope">
                            <el-button v-hasPermi="['system:subAdmin:remove']" link type="primary" icon="CircleClose"
                                @click="cancelAuthUser(scope.row)">取消授权</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > 0" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
                    :total="total" @pagination="getList" />
                <select-user ref="selectRef" :roleId="queryParams.roleId" @ok="handleQuery" />
                <select-role ref="selectRoleRef" @ok="handleAddDeptRole" />
                <select-post ref="selectPostRef" @ok="handleAddDeptRole" />
                <select-bus-per ref="selectBusPerRef" @ok="handleAddDeptRole" />
                <select-dept ref="selectDeptRef" @ok="handleAddDeptRole" />
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script setup name="subAdmin" lang="ts">
/* eslint-disable camelcase */
import selectUser from '../role/selectUser.vue';
import selectRole from '../role/selectRole.vue';
import selectPost from '../post/selectPost.vue';
import selectBusPer from '../role/selectBusPer.vue';
import selectDept from '../dept/selectDept.vue';
import {
    addSubAdminBusiness, delSubAdminBusiness, subAdminBusinessList,
    addSubAdminDept, delSubAdminDept, subAdminDeptList,
    addSubAdminPost, delSubAdminPost, subAdminPostList,
    addSubAdminRole, delSubAdminRole, subAdminRoleList,
} from '@/api/system/subAdmin';
import userSelectpage from '@/components/VSelectpage/userSelectpage.vue';
import { parseTime } from '@/utils/ruoyi';
import { getCurrentInstance, ComponentInternalInstance, ref, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = proxy!.useDict('sys_normal_disable');

const userList = ref<any[]>([]);
const activeId = ref('0');
const loading = ref(false);
const showSearch = ref(true);
const multiple = ref(true);
const total = ref(0);
const selIds = ref<any[]>([]);

const listArry = [subAdminDeptList, subAdminRoleList, subAdminPostList, subAdminBusinessList];
const delArry = [delSubAdminDept, delSubAdminRole, delSubAdminPost, delSubAdminBusiness];
const addArry = [addSubAdminDept, addSubAdminRole, addSubAdminPost, addSubAdminBusiness];
const selectArry = ["selectDeptRef", "selectRoleRef", "selectPostRef", "selectBusPerRef"];
const IdArry = ["deptId", "roleId", "postId", "businessId"];
const queryParams = reactive<{
    pageNum: number;
    pageSize: number;
    roleId: any;
    userId: any;
    deptId: any;
    deptName: any;
    phonenumber: any;
}>({
    pageNum: 1,
    pageSize: 10,
    roleId: undefined,
    userId: undefined,
    deptId: undefined,
    deptName: undefined,
    phonenumber: undefined,
});
function selectedUser(val: any) {
    queryParams.userId = val[0]?.userId;
    queryParams.deptName = val[0]?.dept?.deptName;
    queryParams.deptId = val[0]?.dept?.deptId;

}
watch(
  () => [activeId.value,queryParams.userId],
  () => {
    getList()
  }
);
/** 查询授权用户列表 */
function getList() {
    loading.value = true;
    listArry[Number(activeId.value)](queryParams).then((response: any) => {
        userList.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
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
    selIds.value = selection.map(item => item[IdArry[Number(activeId.value)]]);
    multiple.value = !selection.length;
}
/** 打开授权用户表弹窗 */
function openSelectUser() {
    (proxy?.$refs[selectArry[Number(activeId.value)]] as any).show();
}
//添加角色
async function handleAddDeptRole(Ids: any) {
    const params = {
        roleIds: Ids,
        postIds: Ids,
        businessIds: Ids,
        deptIds: Ids,
        userId: queryParams.userId
    }
    await addArry[Number(activeId.value)](params)
    queryParams.pageNum = 1;
    getList();
}
/** 取消授权按钮操作 */
function cancelAuthUser(row: any) {
    proxy!.$modal
        .confirm('确认要取消该用户授权数据吗？')
        .then(function () {
            return delArry[Number(activeId.value)]({
                userId: queryParams.userId, roleIds: [row.roleId], postIds: [row.postId], businessIds: [row.businessId], deptIds: [row.deptId]
            });
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
    const Ids = selIds.value;
    proxy!.$modal
        .confirm('是否取消选中用户授权数据项?')
        .then(function () {
            return delArry[Number(activeId.value)]({ userId: queryParams.userId, roleIds: Ids, postIds: Ids, businessIds: Ids, deptIds: Ids });
        })
        .then(() => {
            getList();
            proxy!.$modal.msgSuccess('取消授权成功');
        })
        .catch((e: any) => {
            console.log(e);
        });
}
</script>
