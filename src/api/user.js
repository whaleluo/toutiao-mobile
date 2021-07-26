/**
 * 用户相关的请求模块
 */
import request from '@/utils/request'
// import store from '@/store'
/**
 * 用户登录
 */
export const login = data => {
  return request({
    method: 'GET', // POST
    url: 'authorizations', // '/app/v1_0/authorizations',
    data
  })
}
/**
 * 验证码
 * 注意：每手机号每分钟1次
 */
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: 'sms'// `/app/v1_0/sms/codes/${mobile}`
  })
}
/**
 * 获取用户自己的信息
 */
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: 'user'// '/app/v1_0/user'
    // 发送请求头数据
    // headers: {
    //   // 注意：该接口需要授权才能访问
    //   //       token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
    //   Authorization: `Bearer ${store.state.user.token}
    // }
  })
}
/**
 * 获取用户频道列表
 */
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: 'userchannels'// '/app/v1_0/user/channels'
  })
}
/**
 *  关注用户
 */
export const addFollow = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target
    }
  })
}
/**
 * 取消关注
 */
export const deleteFollow = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${target}`
  })
}
/**
 * 获取当前登录用户的个人资料
 */
export const getUserProfile = target => {
  return request({
    method: 'GET',
    url: 'userprofile' // '/app/v1_0/user/profile
  })
}

/**
 * 更新用户资料
 */
export const updateUserProfile = data => {
  return request({
    method: 'GET', // PATCH
    url: 'updateuserprofile', // '/app/v1_0/user/profile',
    data
  })
}

/**
 * 更新用户照片资料
 */
 export function updateUserPhoto (formData) {
  return request({
    method: 'GET', // 'PATCH'
    url: 'updateuserphoto' // '/app/v1_0/user/photo',
    // Content-Type multipart/form-data
    // 必须传递 FormData 对象
    // data: formData
  })
}

/**
 * 获取指定用户信息
 */
 export function getUserById (userId) {
  return request({
    method: 'GET',
    url: `/app/v1_0/users/${userId}`
  })
}

/**
 * 获取用户的关注列表
 */
export function getFollowingsByUser (userId, params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/followings',
    params,
    data: {
      target: userId.toString()
    }
  })
}

/**
 * 获取用户的粉丝列表
 */
export function getFollowersByUser (userId, params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/followers',
    params,
    data: {
      target: userId.toString()
    }
  })
}
