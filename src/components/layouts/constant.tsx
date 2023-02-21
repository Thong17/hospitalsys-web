
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'

export const sideNav: any = [
  {
    route: '/home',
    title: 'HOME',
    icon: <HomeRoundedIcon />,
  },
  {
    route: '/organize',
    title: 'ORGANIZE',
    icon: <WidgetsRoundedIcon />,
    children: [
      {
        route: '/organize/brand',
        title: 'BRAND',
        icon: <ArrowRightAltRoundedIcon />,
      },
      {
        route: '/organize/category',
        title: 'CATEGORY',
        icon: <ArrowRightAltRoundedIcon />,
      },
      {
        route: '/organize/product',
        title: 'PRODUCT',
        icon: <ArrowRightAltRoundedIcon />,
      },
    ]
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
      },
      {
        route: '/admin/user',
        title: 'USER',
        icon: <ArrowRightAltRoundedIcon />,
      },
    ]
  },
]
