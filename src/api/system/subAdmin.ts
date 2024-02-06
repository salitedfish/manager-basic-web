import request from '@/utils/request';

// 分级管理-添加分配的业务列表
export function addSubAdminBusiness(data: any) {
    return request({
        url: '/system/subAdmin/business/add',
        method: 'post',
        data: data,
    });
}

// 分级管理-删除分配的业务列表
export function delSubAdminBusiness(userId: any) {
    return request({
        url: '/system/subAdmin/business/delete',
        method: 'delete',
        data:userId
    });
}

// 分级管理-查询分配的业务列表
export function subAdminBusinessList(query: any) {
    return request({
        url: '/system/subAdmin/business/list',
        method: 'get',
        params: query,
    });
}

// 分级管理-添加分配的部门列表
export function addSubAdminDept(data: any) {
    return request({
        url: '/system/subAdmin/dept/add',
        method: 'post',
        data: data,
    });
}

// 分级管理-删除分配的部门列表
export function delSubAdminDept(userId: any) {
    return request({
        url: '/system/subAdmin/dept/delete',
        method: 'delete',
        data:userId
    });
}

// 分级管理-查询分配的部门列表
export function subAdminDeptList(query: any) {
    return request({
        url: '/system/subAdmin/dept/list',
        method: 'get',
        params: query,
    });
}

// 分级管理-添加分配的岗位列表
export function addSubAdminPost(data: any) {
    return request({
        url: '/system/subAdmin/post/add',
        method: 'post',
        data: data,
    });
}

// 分级管理-删除分配的岗位列表
export function delSubAdminPost(userId: any) {
    return request({
        url: '/system/subAdmin/post/delete',
        method: 'delete',
        data:userId
    });
}

// 分级管理-查询分配的岗位列表
export function subAdminPostList(query: any) {
    return request({
        url: '/system/subAdmin/post/list',
        method: 'get',
        params: query,
    });
}

// 分级管理-添加分配的业务列表
export function addSubAdminRole(data: any) {
    return request({
        url: '/system/subAdmin/role/add',
        method: 'post',
        data: data,
    });
}

// 分级管理-删除分配的角色列表
export function delSubAdminRole(userId: any) {
    return request({
        url: '/system/subAdmin/role/delete',
        method: 'delete',
        data:userId
    });
}

// 分级管理-查询分配的角色列表
export function subAdminRoleList(query: any) {
    return request({
        url: '/system/subAdmin/role/list',
        method: 'get',
        params: query,
    });
}


