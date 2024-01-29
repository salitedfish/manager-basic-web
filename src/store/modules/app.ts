import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import { useStorage } from "@vueuse/core";
import defaultSettings from "@/settings";

// 导入 Element Plus 中英文语言包
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";

const useAppStore = defineStore('app', {

    state: () => ({
        sidebar: {
            opened: Cookies.get('sidebarStatus') ? !!+(Cookies.get('sidebarStatus') ?? '') : true,
            withoutAnimation: false,
            hide: false,
        },
        device: 'desktop',
        size: Cookies.get('size') || 'default',
        language:useStorage("language", defaultSettings.language),

        locale:Cookies.get('language')==='en'?en:zhCn
    }),

    actions: {
        toggleSideBar(withoutAnimation?: boolean) {
            if (this.sidebar.hide) {
                return false;
            }
            this.sidebar.opened = !this.sidebar.opened;
            this.sidebar.withoutAnimation = Boolean(withoutAnimation);
            if (this.sidebar.opened) {
                Cookies.set('sidebarStatus', '1');
            } else {
                Cookies.set('sidebarStatus', '0');
            }
        },
        closeSideBar({ withoutAnimation }: { withoutAnimation: boolean }) {
            Cookies.set('sidebarStatus', '0');
            this.sidebar.opened = false;
            this.sidebar.withoutAnimation = withoutAnimation;
        },
        toggleDevice(device: string) {
            this.device = device;
        },
        setSize(size: string) {
            this.size = size;
            Cookies.set('size', size);
        },
        toggleSideBarHide(status: boolean) {
            this.sidebar.hide = status;
        },
        changeLanguage(val: string) {
            this.language = val;
            Cookies.set('language', val);
        },

    },
});

export default useAppStore;
