import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import {
  getCurrency,
  getProductsInCart,
  getTotalGoodsCountInCart,
  getGoodsList,
  updateLogs
} from '../redux/reducers/currency'

const Sorting = (props) => {
  let list = []
  if(props.goodsList){
    list = props.goodsList
  }else {
    list = props.productsList
  }
  const totalCount = useSelector((s) => s.currency.totalCountInCart)
  const currency = useSelector((s) => s.currency.currency)
  const dispatch = useDispatch()
  const updateProductList = async (updatedlist) => {
    await axios.post('http://localhost:8090/api/goodsList', updatedlist)
  }

  const updateCartList = async (updatedlist) => {
    await axios.post('http://localhost:8090/api/cartList', updatedlist)
  }
  const onClick = (rate) => {
    dispatch(getCurrency(rate))
    updateLogs({ EVENT: `Currency has been changed from ${currency} to ${rate}` })
  }
  const onClickNameSorted = (value) => {
    const sorted = list.sort((a, b) => {
      if (a[value] > b[value]) {
        return 1
      }
      if (b[value] > a[value]) {
        return -1
      }
      return 0
    })
    if (props.goodsList) {
      updateProductList(sorted)
      dispatch(getGoodsList())
      updateLogs({ EVENT: 'Sorted by Name' })
    }else {
        updateCartList(sorted)
        dispatch(getProductsInCart())
        updateLogs({ EVENT: 'Sorted by Name' })
    }
  }

  const onClickPriceSorted = (value) => {
    const sorted = list.sort((a, b) => b[value] - a[value])
    if (props.goodsList) {
      updateProductList(sorted)
      dispatch(getGoodsList())
      updateLogs({ EVENT: 'Sorted by Price' })
    } else {
      updateCartList(sorted)
      dispatch(getProductsInCart())
      updateLogs({ EVENT: 'Sorted by Price' })
    }
  }

  useEffect(() => {
    dispatch(getTotalGoodsCountInCart())
  }, [totalCount])


  return (
    <div className=" bg-indigo-600 p-10 text-white">
      <div className="flex justify-end items-end">
        <button type="button" onClick={() => onClick('USD')}>
          USD
        </button>
        <button type="button" onClick={() => onClick('EUR')}>
          | EUR |
        </button>
        <button type="button" onClick={() => onClick('CAD')}>
          CAD
        </button>
      </div>
      <div className="flex flex-col justify-end items-end">
        <button type="button" onClick={() => onClickPriceSorted('price')}>
          Sort by price
        </button>
        <button type="button" onClick={() => onClickNameSorted('title')}>
          Sort by name
        </button>
      </div>
      <Link
        className="flex flex-col justify-end items-end text-red font-bold"
        to="/cart"
        onClick={() => updateLogs({ EVENT: 'Navigated to Cart page' })}
      >
        Cart: {totalCount}
      </Link>
    </div>
  )
}

Sorting.propTypes = {}

export default React.memo(Sorting)
