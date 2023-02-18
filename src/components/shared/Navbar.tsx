import useTheme from 'hooks/useTheme'
import { useLocation } from 'react-router-dom'
import useConfig from 'hooks/useConfig'
import {
  ListNavbar,
  RowNavbar,
  CustomNavbar,
  NavbarContainer,
} from 'styles'
import Dialog from './Dialog'
import useWeb from 'hooks/useWeb'
import { useEffect, useRef, useState } from 'react'
import Footer from './Footer'
import { Box, Stack } from '@mui/material'

const Navbar = ({ children }) => {
  const [navbar, setNavbar] = useState(false)
  const { theme } = useTheme()
  const { sidebar } = useConfig()
  const { device, width } = useWeb()
  const navRef = useRef<HTMLDivElement>(document.createElement('div'))
  const location = useLocation()

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
        <Stack flexDirection='column'>
          <img src='/logo.png' alt='logo' style={{ width: 32, height: 32 }} />
        </Stack>
      ) : (
        <Stack flexDirection='row' gap={1}>
          <img src='/logo.png' alt='logo' style={{ width: 32, height: 32 }} />
          <Stack
            flexDirection='column'
            justifyContent='center'
            sx={{ '& span': { lineHeight: 1 } }}
          >
            <Box
              component='span'
              sx={{
                color: theme.text.secondary,
                fontSize: theme.responsive[device]?.text.secondary,
              }}
            >
              Hospital System
            </Box>
            <Box
              component='span'
              sx={{
                color: theme.text.quaternary,
                fontSize: theme.responsive[device]?.text.quaternary,
              }}
            >
              Description
            </Box>
          </Stack>
        </Stack>
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
    </CustomNavbar>
  )
}

export default Navbar
