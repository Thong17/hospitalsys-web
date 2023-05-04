import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { initState } from './constant'
import { UserForm } from './Form'

export const CreateUser = () => {
  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='userCreate' />
      </>
    )
  }

  return (
    <Container header={<Header />}>
      <UserForm defaultValues={initState} />
    </Container>
  )
}
