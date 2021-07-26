/**
 * 评论请求模块
 */
import request from '@/utils/request'
/**
 * 获取文章评论列表
 */
export const getComment = params => {
  return request({
    methods: 'GEt',
    url: 'comments', // '/app/v1_0/comments',
    params
  })
}
/**
 * 评论点赞
 */
export const addCommentLike = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })
}

/**
 * 取消评论点赞
 */
export const deleteCommentLike = target => {
  return request({
    method: 'GET', // 'DELETE'
    url: 'comments'// `/app/v1_0/comment/likings/${target}`
  })
}
/**
 * 发布文章评论或评论回复
 */
export const addComment = data => {
  return request({
    method: 'GET', // 'POST',
    url: 'comments', // '/app/v1_0/comments',
    data
  })
}
