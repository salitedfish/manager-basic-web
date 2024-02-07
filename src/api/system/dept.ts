import request from '@/utils/request';

// 查询部门列表
export function listDept(query?: any) {
    return request({
        url: '/system/dept/list',
        method: 'get',
        params: query,
    });
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId: any,query?: any) {
    return request({
        url: '/system/dept/list/exclude/' + deptId,
        method: 'get',
        params: {subAdmin: query},
    });
}

// 查询包含人员的部门树
export function listDeptTreeWithUser(data?:any) {
    return request({
        url: '/system/dept/treeWithUser',
        method: 'get',
        params: data,
    });
}

// 查询部门详细
export function getDept(deptId: any) {
    return request({
        url: '/system/dept/' + deptId,
        method: 'get',
    });
}

// 新增部门
export function addDept(data: any) {
    return request({
        url: '/system/dept',
        method: 'post',
        data: data,
    });
}

// 修改部门
export function updateDept(data: any) {
    return request({
        url: '/system/dept',
        method: 'put',
        data: data,
    });
}

// 删除部门
export function delDept(deptId: any) {
    return request({
        url: '/system/dept/' + deptId,
        method: 'delete',
    });
}


// 新增部门关联的角色列表
export function addDeptRole(data: any) {
    return request({
        url: '/system/dept/role/add',
        method: 'post',
        data: data,
    });
}

// 删除部门关联的角色列表
export function delDeptRole(data: any) {
    return request({
        url: '/system/dept/role/delete',
        method: 'delete',
        data: data,
    });
}

// 查询部门关联的角色列表
export function listDeptRole(query?: any) {
    return request({
        url: '/system/dept/role/list',
        method: 'get',
        params: query,
    });
}
