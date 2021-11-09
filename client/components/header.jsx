import React  from 'react'
import { Link } from 'react-router-dom'
import Head from './head'
import { updateLogs } from '../redux/reducers/currency'


const Header = () => {
  const onClick = updateLogs({EVENT: "Navigated to Main page"})
  return (
    <div className=" bg-indigo-600 p-10 text-white">
      <Head title="Hello" />
      <nav className="flex items-center justify-center font-bold text-6xl">
        <Link to="/" onClick = {onClick}>Bla-Bla SHOP</Link>
      </nav>
    </div>
  )
}

Header.propTypes = {}

export default React.memo(Header)