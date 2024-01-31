<template>
    <!-- 授权用户 -->
    <el-dialog v-model="visible" title="新增业务权限" width="500px" top="5vh" append-to-body>
        <el-form ref="business" :model="form" label-width="120px" :rules="rules" :inline="true">
            <el-form-item label="业务权限名称" prop="businessId">
                <el-select v-model="form.businessId" clearable filterable placeholder="请选择">
                    <el-option v-for="item in businessList" :key="item.businessId" :label="item.businessName"
                        :value="item.businessId" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据权限范围">
                <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
                <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
                <el-checkbox v-model="form.menuCheckStrictly"
                    @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
                <el-tree ref="menuRef" class="tree-border" :data="menuOptions" show-checkbox node-key="id"
                    :check-strictly="!form.menuCheckStrictly" empty-text="加载中，请稍候"
                    :props="{ label: 'label', children: 'children' }"></el-tree>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup name="Role" lang="ts">

import { listBusiness, addBusinessAuth } from '@/api/system/business';
import { listDeptTreeWithUser } from '@/api/system/dept';
import { getCurrentInstance, ComponentInternalInstance, ref, reactive, toRefs, nextTick } from 'vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const businessList = ref<any[]>([]);
const visible = ref(false);
const loading = ref(true);
const total = ref(0);
const menuOptions = ref<any[]>([]);
const menuExpand = ref(false);
const menuNodeAll = ref(false);
const deptExpand = ref(true);
const deptNodeAll = ref(false);
const deptOptions = ref<any[]>([]);
const menuRef = ref<any>(null);
const deptRef = ref<any>(null);

const emit = defineEmits(['ok']);
const props = defineProps({
    orgId: {
        type: [Number, String],
    },
    orgType: {
        type: [Number, String],
    },
});
const data = reactive<{
    form: any;
    roleId?: any;
    rules: any;
}>({
    form: {
        businessId: '',
        menuIds: [],
    },
    rules: {
        businessId: [
            { required: true, message: '业务权限名称不能为空', trigger: 'blur' },
        ],
    },
});


const { form,rules } = toRefs(data);

// 显示弹框
function show() {
    getList();
    getMenuTreeselect();
    visible.value = true;
}

/** 查询业务权限 */
function getList() {
    loading.value = true;
    listBusiness().then((response: any) => {
        businessList.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
}


/** 查询部门以及人 */
function getMenuTreeselect() {
    listDeptTreeWithUser().then(response => {
        menuOptions.value = response.data;
    });
}
/** 重置新增的表单以及其他数据  */
function reset() {
    if (menuRef.value) {
        menuRef.value.setCheckedKeys([]);
    }
    menuExpand.value = false;
    menuNodeAll.value = false;
    deptExpand.value = true;
    deptNodeAll.value = false;
    form.value = {
        businessId: undefined,
        menuIds: [],
    };
    proxy!.resetForm('business');
}

/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value: any, type: any) {
    if (type === 'menu') {
        let treeList = menuOptions.value;
        for (let i = 0; i < treeList.length; i++) {
            menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
        }
    } else if (type === 'dept') {
        let treeList = deptOptions.value;
        for (let i = 0; i < treeList.length; i++) {
            deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
        }
    }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value: any, type: string) {
    if (type === 'menu') {
        menuRef.value.setCheckedNodes(value ? menuOptions.value : []);
    } else if (type === 'dept') {
        deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
    }
}
/** 树权限（父子联动） */
function handleCheckedTreeConnect(value: any, type: string) {
    if (type === 'menu') {
        form.value.menuCheckStrictly = value ? true : false;
    } else if (type === 'dept') {
        form.value.deptCheckStrictly = value ? true : false;
    }
}
/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
    // 目前被选中的菜单节点
    let checkedKeys = menuRef.value.getCheckedNodes();
    // 半选中的菜单节点
    // let halfCheckedKeys = menuRef.value.getCheckedNodes();
    // checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
    return checkedKeys;
}
/** 提交按钮 */
function submitForm() {
    (proxy?.$refs['business'] as any).validate((valid: any) => {
        if (valid) {
            // if (form.value.roleId !== undefined) {
            //     form.value.menuIds = getMenuAllCheckedKeys();
            //     updateRole(form.value).then(response => {
            //         proxy!.$modal.msgSuccess('修改成功');
            //         visible.value = false;
            //         getList();
            //     });
            // } else {
            form.value.menuIds = getMenuAllCheckedKeys();
            const params: {}[] = [];
            form.value.menuIds.forEach((ele: any) => {
                params.push({
                    manageOrgId: ele.id,
                    manageOrgType: ele.type,
                    businessId: form.value.businessId,
                    orgId: props.orgId,
                    orgType: props.orgType,
                })
            });
            addBusinessAuth(params).then((res: any) => {
                proxy!.$modal.msgSuccess(res.msg);
                if (res.code === 200) {
                    visible.value = false;
                    emit('ok');
                }
            });
        }
        // }
    });
}
/** 取消按钮 */
function cancel() {
    visible.value = false;
    reset();
}
defineExpose({
    show,
});
</script>
