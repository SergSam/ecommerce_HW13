import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Head from './head'
import Header from './header'
import Sorting from './sorting'
import {
  getGoodsList,
  getExactCountOfProductInCart,
  getTotalGoodsCountInCart,
  updateLogs
} from '../redux/reducers/currency'




const Home = () => {
  const price = useSelector((s) => s.currency.rate)
  const currency = useSelector((s) => s.currency.currency)
  const content = useSelector((s) => s.currency.goodsList)
  const productCountInCart = useSelector((s) => s.currency.specificProductCount)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getGoodsList())
  }, [productCountInCart])


  const onClick = async(obj) => {
    await axios.post('http://localhost:8090/api/cart', obj)
    dispatch(getExactCountOfProductInCart(obj.id))
    dispatch(getTotalGoodsCountInCart())
    updateLogs({ EVENT: `${obj.title} has been added to cart` })
  }
  return (
    <div>
      <Header />
      <Sorting goodsList = {content} />
      <Head title="Bla-Bla Shop" />
      <div className="grid grid-cols-4 justify-between bg-gray-300 p-4 space-x-3 space-y-3">
        {content.map((obj) => {
          return (
            <div
              key={obj.id}
              className="card flex items-center justify-between flex-col bg-green-100 text-black font-bold"
            >
              <div className="card__title">{obj.title}</div>
              <img className="card__image" src={obj.image} alt="img" />

              <div className="card__price">
                Price: {(obj.price * +price).toFixed(2)} {currency}
              </div>
              <div className="card__product-amount">

                {productCountInCart.map((item) => {
                  let count
                  if (item.id === obj.id) {
                    count = item.count
                  }
                  return typeof count === 'undefined' ? count : `Products in the cart: ${count}`
                })}
              </div>
              <button
                type="button"
                className="border-2 rounded border-solid border-black font-bold "
                onClick={() => onClick(obj)}
              >
                Add to Cart
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )

}

Home.propTypes = {}

export default Home
