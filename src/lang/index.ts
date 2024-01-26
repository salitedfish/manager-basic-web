import { createI18n } from "vue-i18n";
import { useStorage } from "@vueuse/core";
import defaultSettings from "@/settings";
// 本地语言包
import enLocale from "./package/en";
import zhCnLocale from "./package/zh-cn";


// const appStore = useAppStore();
const language = useStorage("language", defaultSettings.language);

const messages = {
    "zh-cn": {
        ...zhCnLocale,
    },
    en: {
        ...enLocale,
    },
};

const i18n = createI18n({
    legacy: false,
    locale: language.value,
    messages: messages,
    globalInjection: true,
});

export default i18n;
