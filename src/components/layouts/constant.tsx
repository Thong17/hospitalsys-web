import SettingsIcon from '@mui/icons-material/Settings'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'

export const sideNav: any = [
  {
    route: '/home',
    title: 'HOME',
    icon: <HomeRoundedIcon />,
  },
  {
    route: '/admin',
    title: 'ADMIN',
    icon: <AdminPanelSettingsIcon />,
    permission: 'admin',
    children: [
      {
        route: '/admin/role',
        title: 'ROLE',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'brand'
      },
      {
        route: '/admin/user',
        title: 'USER',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'category'
      },
    ]
  },
  {
    route: '/config',
    title: 'CONFIG',
    icon: <SettingsIcon />,
    permission: 'config'
  },
]
