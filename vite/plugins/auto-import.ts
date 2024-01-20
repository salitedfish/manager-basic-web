import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

const resolvers = [];

const hookList = [];
for (const item of hookList) {
    resolvers.push((name: string) => {
        if (name === item) {
            return {
                name,
                from: `@/hook/${item}`,
            };
        }
    });
}

const toolHookList = ['useWebPrinter'];
resolvers.push((name: string) => {
    if (toolHookList.includes(name)) {
        return {
            name,
            from: '@ultra-man/noa',
        };
    }
});

export default function createAutoImport() {
    return AutoImport({
        dts: 'src/auto-imports.d.ts',
        imports: ['vue'],
        resolvers: [ElementPlusResolver(), ...resolvers],
    });
}
