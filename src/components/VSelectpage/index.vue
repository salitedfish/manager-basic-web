<template>
    <div>
        <SelectPageTable :width="500" placeholder="请选择" language="zh-chs" v-model="selected" :multiple="true"
            :columns="columns" @fetch-data="fetchData" @fetch-selected-data="fetchSelectedData" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SelectPageTable } from 'v-selectpage'
import type {
    SelectPageKey, FetchSelectedDataCallback,
    PageParameters, FetchDataCallback, SelectPageTableColumn
} from 'v-selectpage'

const selected = ref<SelectPageKey[]>([2])
const columns: SelectPageTableColumn[] = [
    { title: 'Id', data: 'id' },
    { title: 'Team name', data: (row: { abbr: any; name: any }) => `${row.abbr} - ${row.name}`, width: 250 },
    { title: 'Description', data: 'desc' }
]
const list = [
    { id: 1, name: 'Chicago Bulls', desc: '芝加哥公牛', abbr: 'CHI' },
    { id: 2, name: 'Cleveland Cavaliers', desc: '克里夫兰骑士', abbr: 'CLE' },
    { id: 3, name: 'Detroit Pistons', desc: '底特律活塞', abbr: 'DET' },

]
function fetchData(data: PageParameters, callback: FetchDataCallback) {
    const { search, pageNumber, pageSize } = data

    const start = (pageNumber - 1) * pageSize
    const end = start + pageSize - 1
    // filter by search keyword
    const filtered = search
        ? list.filter(val => val.name.includes(search))
        : list

    callback(
        // get current page items
        filtered.filter((val, index) => index >= start && index <= end),
        filtered.length
    )
}
// fetch selected items data
function fetchSelectedData(keys: SelectPageKey[], callback: FetchSelectedDataCallback) {
    callback(list.filter(val => keys.includes(val.id)))
    // get data models by keys

}
</script>
