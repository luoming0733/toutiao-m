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

// 获取搜索结果
export const getSearchReslut = params => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}

// 删除搜索结果
// export const deleteHistory = params => {
//   return request({
//     method: 'DELETE',
//     url: '/v1_0/search/histories',
//     params
//   })
// }
