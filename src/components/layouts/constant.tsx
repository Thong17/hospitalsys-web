
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded'

export const sideNav: any = [
  {
    route: '/home',
    title: 'HOME',
    icon: <HomeRoundedIcon />,
  },
  {
    route: '/sale',
    title: 'OPERATION',
    icon: <PriceChangeRoundedIcon />,
    permission: 'operation',
    children: [
      {
        route: '/sale/stock',
        title: 'STOCK',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'stock'
      },
      {
        route: '/sale/cashing',
        title: 'CASHING',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'cashing'
      },
      {
        route: '/sale/reservation',
        title: 'RESERVATION',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'reservation'
      },
    ]
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
