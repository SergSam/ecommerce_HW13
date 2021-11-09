import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Head from './head'
import Header from './header'
import Sorting from './sorting'
import { getProductsInCart, updateLogs, getTotalGoodsCountInCart } from '../redux/reducers/currency'

const Cart = () => {
  const dispatch = useDispatch()
  const productsList = useSelector((s) => s.currency.productsInCart)
  const price = useSelector((s) => s.currency.rate)
  const currency = useSelector((s) => s.currency.currency)
  useEffect(() => {
    dispatch(getProductsInCart())
  }, [])

  const onClickRemove = async(obj) => {
    await axios.patch(`http://localhost:8090/api/cart/${obj.id}`, {count: obj.count} )
    dispatch(getProductsInCart())
    dispatch(getTotalGoodsCountInCart())
    updateLogs({ EVENT: `${obj.title} has been removed from the cart` })
  }
  return (
    <div>
      <Head title="Cart" />
      <Header />
      <Sorting productsList={productsList} />
      <div className="h-100 w-full flex flex-col items-center justify-center bg-teal-lightest font-sans bg-gray-300">
        <table className="table-auto flex items-center justify-center border-separate border border-green-900">
          <thead>
            <tr className="border-collapse border border-black ">
              <th className="border-collapse border border-black">Product description</th>
              <th className="border-collapse border border-black">Price</th>
              <th className="border-collapse border border-black">Currency</th>
              <th className="border-collapse border border-black">Amount</th>
              <th className="border-collapse border border-black">Total price</th>
              <th className="border-collapse border border-black">Remove</th>
            </tr>
            {productsList.map((item) => (
              <tr key={item.id} flex items-center justify-center>
                <td className="product__title border-collapse border border-black ">
                  <img className="product__image" src={item.image} alt="img" />
                  {item.title}
                </td>
                <td className="product__price border-collapse border border-black">
                  {(item.price * +price).toFixed(2)}
                </td>
                <td className="product__price border-collapse border border-black">{currency}</td>
                <td className="product__amout border-collapse border border-black">{item.count}</td>
                <td className="product__total_price border-collapse border border-black">
                  {(item.price * +price * item.count).toFixed(2)}
                </td>
                <td className="flex items-center border-collapse border border-black w-full h-full">
                  <button
                    type="button"
                    className="product__remove flex items-center justify-center border border-solid border-red-600 bg-red-300 font-bold w-full h-full"
                    onClick={() => onClickRemove(item)}
                  >
                    -
                  </button>
                </td>
              </tr>
            ))}
          </thead>
        </table>
        <h2 className="flex items-end justify-end bg-teal-lightest font-bold" id="total-amount">
          Total price:
          {productsList.reduce((acc, rec) => {
            return +(rec.price * +price * rec.count + acc).toFixed(2)
          }, 0)}
        </h2>
      </div>
    </div>
  )
}

Cart.propTypes = {}

export default React.memo(Cart)
