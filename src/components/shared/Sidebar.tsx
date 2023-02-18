import { Link, NavLink, useLocation } from 'react-router-dom'
import { sideNav } from '../layouts/constant'
import useTheme from 'hooks/useTheme'
import { CustomMenubar, CustomSideNav, SideNavContainer } from 'styles'
import useConfig from 'hooks/useConfig'
import useLanguage from 'hooks/useLanguage'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import { useEffect, useRef, useState } from 'react'
import useAuth from 'hooks/useAuth'
import useWeb from 'hooks/useWeb'
import { Box } from '@mui/material'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import Profile from './Profile'

export const MenuBar = ({ theme, open, toggleSidebar }) => {
  return (
    <CustomMenubar styled={theme} open={open} onClick={() => toggleSidebar()}>
      {open ? (
        <KeyboardArrowLeftRoundedIcon />
      ) : (
        <KeyboardArrowRightRoundedIcon />
      )}
    </CustomMenubar>
  )
}

const Sidebar = () => {
  const [navbar, setNavbar] = useState(false)
  const { user } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { sidebar, tabs, resetTabs, toggleSidebar } = useConfig()
  const [expandTabs, setExpandTabs] = useState<string[]>(tabs)
  const { width } = useWeb()
  const navRef = useRef<HTMLDivElement>(document.createElement('div'))
  const location = useLocation()

  const openNavbar = () => {
    setNavbar(true)
  }

  const closeNavbar = (event) => {
    !navRef.current.contains(event.target) && setNavbar(false)
  }

  useEffect(() => {
    setNavbar(false)
  }, [location])

  useEffect(() => {
    navbar && document.addEventListener('mousedown', closeNavbar)
    return () => {
      document.removeEventListener('mousedown', closeNavbar)
    }
  }, [navbar])

  const handleExpandLessTabs = (event, tab) => {
    const newTabs = expandTabs.filter((item) => item !== tab)
    setExpandTabs(newTabs)
    resetTabs(newTabs)
    event.preventDefault()
  }

  const handleExpandMoreTabs = (event, tab) => {
    const newTabs = [...expandTabs, tab]
    setExpandTabs(newTabs)
    resetTabs(newTabs)
    event.preventDefault()
  }

  return (
    <SideNavContainer open={sidebar}>
      <Box sx={{ position: 'absolute', right: '-16px', top: '66px' }}>
        {width < 1024 ? (
          <MenuBar
            theme={theme}
            open={navbar}
            toggleSidebar={openNavbar}
          ></MenuBar>
        ) : (
          <MenuBar
            theme={theme}
            open={sidebar}
            toggleSidebar={toggleSidebar}
          ></MenuBar>
        )}
      </Box>
      <Box sx={{ position: 'absolute', top: '-20px', left: '16px' }}>
        {user?.id ? (
          <Profile sidebar={sidebar} id={user.id} username={user.username} picture={user.photo} />
        ) : (
          <Link to='/login'>{language['LOGIN']}</Link>
        )}
      </Box>
      <CustomSideNav
        direction='column'
        justifyContent='start'
        alignItems='start'
        className='side-nav'
        styled={theme}
      >
        {sideNav.map((nav, index) => {
          const permission = nav.permission
            ? user?.privilege?.menu?.[nav.permission]
            : true
          if (permission) {
            if (!nav.children) {
              return (
                <NavLink key={index} to={nav.route}>
                  {nav.icon}
                  <span>{language?.[nav.title] || nav.title}</span>
                </NavLink>
              )
            }

            return (
              <div key={index} className='link'>
                <NavLink
                  key={index}
                  to={nav.route}
                  style={{
                    width: 'calc(100% - 22px)',
                    paddingRight: 7,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {nav.icon}
                    <span>{language?.[nav.title] || nav.title}</span>
                  </div>
                  {expandTabs.includes(nav.title) ? (
                    <ExpandLessRoundedIcon
                      className='toggle'
                      onClick={(event) =>
                        handleExpandLessTabs(event, nav.title)
                      }
                    />
                  ) : (
                    <ExpandMoreRoundedIcon
                      className='toggle'
                      onClick={(event) =>
                        handleExpandMoreTabs(event, nav.title)
                      }
                    />
                  )}
                </NavLink>
                {expandTabs.includes(nav.title) && (
                  <div style={{ paddingLeft: 10, boxSizing: 'border-box' }}>
                    {nav.children.map((sub, subIndex) => {
                      const permission = sub.permission
                        ? user?.privilege.menu?.[sub.permission]
                        : true
                      if (permission) {
                        return (
                          <NavLink key={subIndex} to={sub.route}>
                            {sub.icon}
                            <span>{language?.[sub.title] || sub.title}</span>
                          </NavLink>
                        )
                      } else {
                        return (
                          <span
                            key={subIndex}
                            style={{ display: 'none' }}
                          ></span>
                        )
                      }
                    })}
                  </div>
                )}
              </div>
            )
          } else {
            return <span key={index} style={{ display: 'none' }}></span>
          }
        })}
      </CustomSideNav>
    </SideNavContainer>
  )
}

export default Sidebar
