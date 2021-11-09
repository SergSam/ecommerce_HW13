import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getLogs, deleteLogs } from '../redux/reducers/currency'
import Header from './header'

const Logs = () => {
const dispatch = useDispatch()
const logsList = useSelector((s) => s.currency.logs)


useEffect(() => {
  dispatch(getLogs())
}, [logsList])
const onClickRemove = () => deleteLogs()
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center bg-indigo-100 p-10 text-black">
        <table className="table-auto border-separate border border-black">
          <thead>
            <tr className="border-collapse border border-black font-bold">
              <th className="border-collapse border border-black">TIME</th>
              <th className="border-collapse border border-black">EVENT</th>
            </tr>
            {logsList.map((item) => (
              <tr key={item.time}>
                <td className=" border-collapse border border-black ">
                  {new Date(item.Time).toLocaleString()}
                </td>
                <td className=" border-collapse border border-black">{item.EVENT}</td>
              </tr>
            ))}
          </thead>
        </table>
        <button
          type="button"
          className="logs__remove border-black border-rounded border-solid font-bold bg-grey"
          onClick={onClickRemove}
        >
          Remove logs
        </button>
      </div>
    </>
  )
}

Logs.propTypes = {}

export default React.memo(Logs)
