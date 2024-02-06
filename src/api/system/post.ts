import request from '@/utils/request';

// 查询岗位列表
export function listPost(query: any) {
    return request({
        url: '/system/post/list',
        method: 'get',
        params: query,
    });
}

// 查询岗位详细
export function getPost(postId: any) {
    return request({
        url: '/system/post/' + postId,
        method: 'get',
    });
}

// 新增岗位
export function addPost(data: any) {
    return request({
        url: '/system/post',
        method: 'post',
        data: data,
    });
}

// 修改岗位
export function updatePost(data: any) {
    return request({
        url: '/system/post',
        method: 'put',
        data: data,
    });
}

// 删除岗位
export function delPost(postId: any) {
    return request({
        url: '/system/post/' + postId,
        method: 'delete',
    });
}
// 新增岗位关联的角色列表
export function addPostRole(data: any) {
    return request({
        url: '/system/post/role/add',
        method: 'post',
        data: data,
    });
}

// 删除岗位关联的角色列表
export function delPostRole(data: any) {
    return request({
        url: '/system/post/role/delete',
        method: 'delete',
        data: data,
    });
}

// 查询岗位关联的角色列表
export function listPostRole(query?: any) {
    return request({
        url: '/system/post/role/list',
        method: 'get',
        params: query,
    });
}
