import axios from 'axios'

const RATES = 'RATES'
const GOODS = 'GOODS'
const CARTSTOTAL = 'CARTSTOTAL'
const CARTSLIST = 'CARTSLIST'
const SPECIFICPRODUCTCOUNT = 'SPECIFICPRODUCTCOUNT'
const ADD_LOGS = 'ADD_LOGS'

const initialState = {
  rate: 1,
  currency: 'USD',
  goodsList: [],
  totalCountInCart: 0,
  specificProductCount: [],
  productsInCart: [],
  logs: []
}


export function getCurrency(param) {
  return (dispatch) =>
    axios(`http://localhost:8090/api/rates/${param}`).then(({ data }) =>
      dispatch({ type: RATES, rate: data, currency: param })
    )
}

export default (state = initialState, action) => {
  let updatedList = []
  if(state.specificProductCount.find((object) => object?.id === action.specificProductCount?.id))
  {
    updatedList = state.specificProductCount.map((item) =>
      item.id === action.specificProductCount.id
        ? { ...item, ...action.specificProductCount }
        : item
    )
  } else {
       updatedList = [...state.specificProductCount, ...action.specificProductCount]
  }
  switch (action.type) {
    case RATES:
      return {
        ...state,
        rate: action.rate,
        currency: action.currency
      }
    case GOODS:
      return {
        ...state,
        goodsList: action.list
      }
    case CARTSTOTAL:
      return {
        ...state,
        totalCountInCart: action.totalCountInCart
      }
    case SPECIFICPRODUCTCOUNT:
      return {
        ...state,
        specificProductCount: updatedList
      }
    case CARTSLIST:
      return {
        ...state,
        productsInCart: action.productsInCart
      }
    case ADD_LOGS:
      return {
        ...state,
        logs: action.logs
      }
    default:
      return state
  }
}


export function getGoodsList() {
  return (dispatch) =>
    axios('http://localhost:8090/api/goodsList').then(({ data }) =>
      dispatch({ type: GOODS, list: data })
    )
}

// export function updateGoodsList(list) {
//   return axios.post('http://localhost:8090/goodsList', list)

// }

export function getTotalGoodsCountInCart() {
  return (dispatch) =>
    axios('http://localhost:8090/api/cart').then(({ data }) =>
      dispatch({ type: CARTSTOTAL, totalCountInCart: data })
    )
}

export function getProductsInCart() {
  return (dispatch) =>
    axios('http://localhost:8090/api/cart/list').then(({ data }) =>
      dispatch({ type: CARTSLIST, productsInCart: data })
    )
}

export function getExactCountOfProductInCart(id) {
  return (dispatch) => {
    // const state = getState()
    axios(`http://localhost:8090/api/cart/${id}`).then(({ data }) =>
      dispatch({ type: SPECIFICPRODUCTCOUNT, specificProductCount: {id, count: data}})
    )
  }
}

export function getLogs() {
  return (dispatch) =>
    axios('http://localhost:8090/api/logs').then(({ data }) =>
      dispatch({ type: ADD_LOGS, logs: data })
    )
}

export function updateLogs (event) {
    axios.post('http://localhost:8090/api/logs', event)
}

export function deleteLogs() {
  axios.delete('http://localhost:8090/api/logs')
}