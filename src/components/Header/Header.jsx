import React from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
  },
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  ]


  return (
    <header className='py-4 shadow-lg bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600'>
      <Container>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Link to='/' className='flex items-center space-x-2 hover:opacity-80 transition-opacity'>
              <Logo width='50px' />
              <span className='text-xl font-bold text-white hidden sm:block'>BlogHub</span>
            </Link>
          </div>
          <ul className='flex items-center space-x-1'>
            {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                onClick={() => navigate(item.slug)}
                className='px-4 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-600 rounded-lg transition-all duration-200 hover:scale-105'
                >{item.name}</button>
              </li>
            ) : null
            )}
            {authStatus && (
              <li className='ml-2'>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
        </Container>
    </header>
  )
}

export default Header