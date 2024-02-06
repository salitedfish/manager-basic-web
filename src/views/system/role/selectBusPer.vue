<template>
    <!-- 授权业务权限 -->
    <el-dialog v-model="visible" title="选择业务权限" width="800px" top="5vh" append-to-body>
        <el-form ref="queryRef" :model="queryParams" :inline="true">
            <el-form-item label="业务权限名称" prop="businessName">
                <el-input
                    v-model="queryParams.businessName"
                    placeholder="请输入业务权限名称"
                    clearable
                    style="width: 200px"
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row>
            <el-table
                ref="refTable"
                :data="List"
                height="260px"
                @rowClick="clickRow"
                @selectionChange="handleSelectionChange"
            >
                <el-table-column type="selection" width="55"></el-table-column>
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
            </el-table>
            <pagination
                v-show="total > 0"
                v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize"
                :total="total"
                @pagination="getList"
            />
        </el-row>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleSelectUser">确 定</el-button>
                <el-button @click="visible = false">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup name="selectBusPer" lang="ts">
/* eslint-disable camelcase */
import { listBusiness } from '@/api/system/business';
import { parseTime } from '@/utils/ruoyi';
import { getCurrentInstance, ComponentInternalInstance, ref, reactive } from 'vue';


const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { sys_normal_disable } = proxy!.useDict('sys_normal_disable');

const List = ref<any[]>([]);
const visible = ref(false);
const total = ref(0);
const businessIds = ref<any[]>([]);

const queryParams = reactive<{
    pageNum: number;
    pageSize: number;
    roleId?: any;
    businessName: any;
    status: any;
}>({
    pageNum: 1,
    pageSize: 10,
    roleId: undefined,
    businessName: undefined,
    status: '1',
});

// 显示弹框
function show() {
    getList();
    visible.value = true;
}
/**选择行 */
function clickRow(row: any) {
    (proxy?.$refs['refTable'] as any).toggleRowSelection(row);
}
// 多选框选中数据
function handleSelectionChange(selection: any[]) {
    businessIds.value = selection.map(item => item.businessId);
}
// 查询表数据
function getList() {
    listBusiness(queryParams).then((res: any) => {
        List.value = res.rows;
        total.value = res.total;
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
const emit = defineEmits(['ok']);
/** 选择授权业务权限操作 */
function handleSelectUser() {
    // const roleId = queryParams.roleId;
    if (businessIds.value.length == 0) {
        proxy!.$modal.msgError('请选择要分配的业务权限');
        return;
    }
    visible.value = false;
    emit('ok',businessIds.value);
}

defineExpose({
    show,
});
</script>
