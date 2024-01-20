<template>
     <el-config-provider :locale="appStore.locale" >
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings';
import { handleThemeStyle } from '@/utils/theme';
import { nextTick, onMounted } from 'vue';
import  useAppStore  from "@/store/modules/app";
const appStore = useAppStore();

onMounted(() => {
    nextTick(() => {
        // 初始化主题样式
        handleThemeStyle(useSettingsStore().theme);
    });
});
</script>
