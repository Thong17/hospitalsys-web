
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
// import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'
import HouseRoundedIcon from '@mui/icons-material/HouseRounded'

export const sideNav: any = [
  {
    route: '/home',
    title: 'HOME',
    icon: <HouseRoundedIcon />,
  },
  {
    route: '/admin',
    title: 'ADMIN',
    icon: <AdminPanelSettingsIcon />,
    // children: [
    //   {
    //     route: '/admin/role',
    //     title: 'ROLE',
    //     icon: <ArrowRightAltRoundedIcon />,
    //   },
    //   {
    //     route: '/admin/user',
    //     title: 'USER',
    //     icon: <ArrowRightAltRoundedIcon />,
    //   },
    // ]
  },
  // {
  //   route: '/config',
  //   title: 'SETTING',
  //   icon: <SettingsIcon />,
  // },
]
