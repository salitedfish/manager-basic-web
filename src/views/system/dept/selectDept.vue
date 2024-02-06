<template>
    <!-- 授权部门 -->
    <el-dialog v-model="visible" title="选择部门" width="600px" top="5vh" append-to-body>
        <el-table v-if="refreshTable" v-loading="loading" :data="List" row-key="deptId" @rowClick="clickRow"
                @selectionChange="handleSelectionChange"
            :default-expand-all="isExpandAll" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="deptName" label="部门名称"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                    <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="200">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
        </el-table>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleSelectUser">确 定</el-button>
                <el-button @click="visible = false">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup name="selectDept" lang="ts">
/* eslint-disable camelcase */
import { listDept } from '@/api/system/dept';
import { parseTime } from '@/utils/ruoyi';
import { getCurrentInstance, ComponentInternalInstance, ref, reactive } from 'vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { sys_normal_disable } = proxy!.useDict('sys_normal_disable');

const List = ref<any[]>([]);
const visible = ref(false);
const deptIds = ref<any[]>([]);
const refreshTable = ref(true);
const isExpandAll = ref(true);
const loading = ref(true);

const queryParams = reactive<{
    pageNum: number;
    pageSize: number;
    deptId?: any;
    roleName: any;
    phonenumber: any;
    status: any;
}>({
    pageNum: 1,
    pageSize: 10,
    deptId: undefined,
    roleName: undefined,
    phonenumber: undefined,
    status: '1',
});

// 显示弹框
function show() {
    getList();
    visible.value = true;
}
/** 展开/折叠操作 */
function toggleExpandAll() {
    refreshTable.value = false;
    isExpandAll.value = !isExpandAll.value;
    nextTick(() => {
        refreshTable.value = true;
    });
}
/**选择行 */
function clickRow(row: any) {
    (proxy?.$refs['refTable'] as any).toggleRowSelection(row);
}
// 多选框选中数据
function handleSelectionChange(selection: any[]) {
    deptIds.value = selection.map(item => item.deptId);
}
// 查询表数据
function getList() {
    listDept(queryParams).then(response => {
        List.value = proxy!.handleTree(response.data, 'deptId');
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
const emit = defineEmits(['ok']);
/** 选择授权部门操作 */
function handleSelectUser() {
    if (deptIds.value.length == 0) {
        proxy!.$modal.msgError('请选择要分配的部门');
        return;
    }
    visible.value = false;
    emit('ok',deptIds.value);
}


defineExpose({
    show,
});
</script>
