import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { RoleForm } from './Form'
import { useParams } from 'react-router-dom'
import { getRole } from './redux'
import { useAppDispatch } from 'app/hooks'
import { useEffect, useState } from 'react'
import useNotify from 'hooks/useNotify'
import { StatusType } from 'shared/interface'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='roleUpdate' title='Table' />
    </>
  )
}

export const UpdateRole = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const [defaultValues, setDefaultValues] = useState({})
  const [status, setStatus] = useState<StatusType>('INIT')
  const { notify } = useNotify()

  useEffect(() => {
    if (id) {
      dispatch(
        getRole({
          id,
          query: {},
          fields: ['name', 'privilege', 'description', 'navigation'],
        })
      )
        .unwrap()
        .then(data => {
          setDefaultValues(data?.data)
          setStatus('SUCCESS')
        })
        .catch(err => {
          notify(err?.message, 'error')
          setStatus('FAILED')
        })
    }
    // eslint-disable-next-line
  }, [dispatch, id])

  return (
    <Container header={<Header />}>
      {status === 'SUCCESS' && (
        <RoleForm id={id} defaultValues={defaultValues} />
      )}
    </Container>
  )
}
