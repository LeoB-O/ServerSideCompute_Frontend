import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/consumptions',
    method: 'get',
    params
  })
}

export function addConsumption(consumption) {
  return request({
    url: '/api/consumption',
    method: 'post',
    data: consumption
  })
}

export function getWeather(city) {
  return request({
    url: '/api/weather',
    method: 'get',
    params: {
      city: city,
      key: '3313f0f41b92d0fc19310f0204b77469'
    }
  })
}

export function deleteConsumption(id) {
  return request({
    url: '/api/consumption',
    method: 'delete',
    params: {
      id: id
    }
  })
}

export function editConsumption(consumption) {
  return request({
    url: '/api/consumption',
    method: 'put',
    data: {
      id: consumption._id,
      consumption: consumption
    }
  })
}
