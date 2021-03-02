/**
 * 获取所有频道
 */
import request from '@/utils/request'

// 获取所有频道
export const getSearchSuggestions = q => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}
