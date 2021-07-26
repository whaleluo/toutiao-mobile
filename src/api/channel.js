/**
 * 频道请求模块
 */
import request from '@/utils/request'

/**
 * 获取所有频道列表
 */
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: 'channels'// '/app/v1_0/channels'
  })
}
/**
 * 添加用户频道
 */
export const addUserChannel = channel => {
  return request({
    method: 'GET', // PATCH
    url: 'channels', // '/app/v1_0/user/channels
    data: {
      channels: [channel]
    }
  })
}
/**
 * 删除用户指定频道
 */
export const deleteUserChannel = channelId => {
  return request({
    method: 'GET', // 'DELETE'
    url: 'channels'// `/app/v1_0/user/channels/${channelId}`
  })
}
