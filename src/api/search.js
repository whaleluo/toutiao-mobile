/**
 * 用户相关请求模块
 */
import request from '@/utils/request'

/**
 * 用户相关请求模块
 */
export const getSearchSuggestions = q => {
  return request({
    method: 'GET',
    url: 'suggestion', // '/app/v1_0/suggestion'
    params: {
      q
    }
  })
}
export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: 'search/', // '/app/v1_0/search'
    params
  })
}
