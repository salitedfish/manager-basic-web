<template>
    <div class="app-container">
        <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true">
            <el-form-item label="权限主体类型" >
             <el-select v-model="queryParams.orgType" clearable filterable placeholder="请选择">
                    <el-option v-for="(item,index) in ['部门','人员','岗位']" :key="index" :label="item"
                        :value="index" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="业务权限名称" >
             <el-select v-model="queryParams.businessId" clearable filterable placeholder="请选择">
                    <el-option v-for="item in businessList" :key="item.businessId" :label="item.businessName"
                        :value="item.businessId" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="权限主体名称" >
                <el-input v-model="queryParams.orgName" placeholder="请输入权限主体名称" clearable
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="userList" @selectionChange="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="权限主体编码" prop="manageOrgId" :show-overflow-tooltip="true" />
            <el-table-column label="权限主体名称" prop="orgName" :show-overflow-tooltip="true" />
            <el-table-column label="业务权限名称" prop="businessName" :show-overflow-tooltip="true" />
            <el-table-column label="管理组织编码" prop="manageOrgCode" :show-overflow-tooltip="true" />
            <el-table-column label="管理组织名称" prop="manageOrgName" :show-overflow-tooltip="true" />
            <el-table-column label="创建人工号" prop="orgCode" :show-overflow-tooltip="true" />
            <el-table-column label="创建人" prop="createByNickName" :show-overflow-tooltip="true" />
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button
                        v-hasPermi="['system:permissionQuery:remove']"
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

    </div>
</template>

<script setup name="permissionQuery" lang="ts">
import { listBusinessAuth, delBusinessAuth ,listBusiness} from '@/api/system/business';
import { parseTime } from '@/utils/ruoyi';
import { getCurrentInstance, ComponentInternalInstance, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const userList = ref<any[]>([]);
const businessList = ref<any[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const multiple = ref(true);
const total = ref(0);
const userIds = ref<any[]>([]);
const queryParams = reactive<{
    pageNum: number;
    pageSize: number;
    orgName: any;
    orgType: any;
    businessId: any;
}>({
    pageNum: 1,
    pageSize: 10,
    orgName: undefined,
    orgType: undefined,
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

/** 查询业务权限 */
function getBusinessList() {
    listBusiness().then((response: any) => {
        businessList.value = response.rows;
    });
}
getList();
getBusinessList();
</script>
