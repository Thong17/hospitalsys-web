
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
// import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'

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
    permission: 'admin'
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
