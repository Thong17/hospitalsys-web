import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import { Link, useLocation } from 'react-router-dom'
import Profile from './Profile'
import useConfig from 'hooks/useConfig'
import {
  CustomMenubar,
  ListNavbar,
  RowNavbar,
  CustomNavbar,
  NavbarContainer,
} from 'styles'
import Dialog from './Dialog'
import useWeb from 'hooks/useWeb'
import { useEffect, useRef, useState } from 'react'
import Footer from './Footer'
import useLanguage from 'hooks/useLanguage'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import { Box, Stack } from '@mui/material'

export const MenuBar = ({ theme, open, toggleSidebar }) => {
  return (
    <CustomMenubar styled={theme} open={open} onClick={() => toggleSidebar()}>
      {open ? <KeyboardArrowLeftRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
    </CustomMenubar>
  )
}

const Navbar = ({ children }) => {
  const [navbar, setNavbar] = useState(false)
  const { user } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { toggleSidebar, sidebar } = useConfig()
  const { device, width } = useWeb()
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

  return (
    <CustomNavbar
      className='navbar'
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      styled={theme}
      device={device}
      sidebar={
        device !== 'mobile' && device !== 'tablet' ? (sidebar ? 258 : 78) : 0
      }
    >
      {width < 1024 ? (
        <div style={{ display: 'flex', gap: 10 }}>
          <MenuBar
            theme={theme}
            open={navbar}
            toggleSidebar={openNavbar}
          ></MenuBar>
          <Stack flexDirection='column'>
            <img src="/logo.png" alt="logo" style={{ width: 32, height: 32 }} />
          </Stack>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 10 }}>
          <MenuBar
            theme={theme}
            open={sidebar}
            toggleSidebar={toggleSidebar}
          ></MenuBar>
          <Stack flexDirection='row' gap={1}>
            <img src="/logo.png" alt="logo" style={{ width: 32, height: 32 }} />
            <Stack flexDirection='column' justifyContent='center' sx={{ '& span': { lineHeight: 1 } }}>
              <Box component='span' sx={{ color: theme.text.secondary, fontSize: theme.responsive[device]?.text.secondary }}>Hospital System</Box>
              <Box component='span' sx={{ color: theme.text.quaternary, fontSize: theme.responsive[device]?.text.quaternary }}>Description</Box>
            </Stack>
          </Stack>
        </div>
      )}
      {width < 1024 ? (
        <Dialog display={navbar}>
          <NavbarContainer
            ref={navRef}
            styled={theme}
            style={{ height: navbar ? '50%' : 0 }}
          >
            {navbar && <RowNavbar>{children}</RowNavbar>}
            {navbar && <Footer></Footer>}
          </NavbarContainer>
        </Dialog>
      ) : (
        <ListNavbar>{children}</ListNavbar>
      )}
      {user?.id ? (
        <Profile id={user.id} username={user.username} picture={user.photo} />
      ) : (
        <Link to='/login'>{language['LOGIN']}</Link>
      )}
    </CustomNavbar>
  )
}

export default Navbar
