<template>
    <div>
        <SelectPageTable :width="400"  keyProp="userId" labelProp="nickName" placeholder="请选择" language="zh-chs" v-model="data.selected"
            :columns="columns" @fetch-data="fetchData"  @selection-change="fetchSelectedData" />
    </div>
</template>

<script setup lang="ts">
import { watch,reactive } from 'vue'
import { SelectPageTable } from 'v-selectpage'
import {listUser} from '@/api/system/user';
import type {PageParameters, FetchDataCallback, SelectPageTableColumn
} from 'v-selectpage'

const data: any = reactive({
    selected: null,
})
const emit = defineEmits(['ok']);
const columns: SelectPageTableColumn[] =  [
    { title: '用户名称', data: 'userName'},
    { title: '姓名', data: 'nickName' },
    { title: '部门',  data: (row: { dept: { deptName: any; }; }) => `${row.dept?.deptName}` }
]
function fetchData(data: PageParameters, callback: FetchDataCallback) {
    const { search, pageNumber, pageSize } = data
        const params={
            searchValue:search,
            pageNum: pageNumber,
            pageSize: pageSize,
            status: "1"
        }
    listUser(params).then((res: any) => {
        callback(
            res.rows,
            res.total
    )
    });

}
function fetchSelectedData(val: any){
    emit('ok',val);
}
</script>
