import request from '@/utils/request';

// 查询业务权限列表
export function listBusinessAuth(query: any) {
    return request({
        url: '/system/businessAuth/list',
        method: 'get',
        params: query,
    });
}

// 新增业务权限列表
export function addBusinessAuth(data: any) {
    return request({
        url: '/system/businessAuth/add',
        method: 'post',
        data: data,
    });
}
// 删除业务权限
export function delBusinessAuth(roleIds: any) {
    return request({
        url: '/system/businessAuth/delete' ,
        method: 'delete',
        data:roleIds,
    });
}

// 查询业务权限列表
export function listBusiness() {
    return request({
        url: '/system/business/list',
        method: 'get',
    });
}




