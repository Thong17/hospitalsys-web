import Breadcrumb from 'components/shared/Breadcrumbs'
import Container from 'components/shared/Container'
import { useParams } from 'react-router-dom'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import NotFound from 'components/shared/NotFound'
import useLanguage from 'hooks/useLanguage'

const Header = ({ stages }) => {
  return <Breadcrumb stages={stages} title={<AdminPanelSettingsIcon />} />
}

export const UserInfo = () => {
  const { id, action } = useParams()
  const { language } = useLanguage()

  if (action !== 'create' && action !== 'update') return <NotFound />

  const propertyBreadcrumb = [
    {
      title: language['ADMIN'],
      path: '/admin',
    },
    {
      title: language['USER'],
      path: '/admin/user',
    },
    {
      title: action === 'create' ? language['CREATE'] : language['UPDATE'],
      path:
        action === 'create'
          ? '/admin/user/create'
          : `/admin/user/update/${id}`,
    },
    {
      title: language['INFO'],
    },
  ]

  return (
    <Container header={<Header stages={propertyBreadcrumb} />}>
      Detail {action}
    </Container>
  )
}
