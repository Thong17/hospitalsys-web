import Breadcrumb from 'components/shared/Breadcrumbs'
import Container from 'components/shared/Container'
import { useParams } from 'react-router-dom'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import NotFound from 'components/shared/NotFound'
import useLanguage from 'hooks/useLanguage'
import { useEffect, useState } from 'react'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import GeneralDetail from './components/GeneralDetail'
import PatientDetail from './components/PatientDetail'
import DoctorDetail from './components/DoctorDetail'

const Header = ({ stages }) => {
  return <Breadcrumb stages={stages} title={<AdminPanelSettingsIcon />} />
}

export const UserInfo = () => {
  const { id, action } = useParams()
  const { language } = useLanguage()
  const { notify } = useNotify()
  const [info, setInfo] = useState<any>(null)

  useEffect(() => {
    if (!id) return 
    Axios({
      method: 'GET',
      url: `/admin/user/detail/${id}`
    })
      .then(res => {
        setInfo(res.data.data)
      })
      .catch(err => notify(err?.response?.data?.msg, 'error'))
  
    return () => {
      setInfo(null)
    }
    // eslint-disable-next-line
  }, [id])

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

  const renderDetail = (segment) => {
    switch (segment) {
      case 'DOCTOR':
        return <DoctorDetail />
    
      case 'PATIENT':
        return <PatientDetail />

      default:
        return <GeneralDetail />
    }
  }

  return (
    <Container header={<Header stages={propertyBreadcrumb} />}>
      Detail {action}
      {renderDetail(info?.segment)}
    </Container>
  )
}
