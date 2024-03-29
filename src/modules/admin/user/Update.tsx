import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { UserForm } from './Form'
import { useParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { selectUser, getUser } from './redux'
import { useEffect } from 'react'

export const UpdateUser = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectUser)
  const { id } = useParams()
  
  useEffect(() => {
    if (id) {
      dispatch(getUser({ id, query: {}, fields: ['username', 'email', 'role', 'segment'] }))
    }
  }, [dispatch, id])

  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='userUpdate' userId={id} />
      </>
    )
  }

  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <UserForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
