import React from 'react'
import CategoryForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useParams } from 'react-router-dom'
import { initBody } from './redux/constant'

const Header = () => {
    return <><StoreBreadcrumbs page='categoryUpdate' /></>
}

export const UpdateCategory = () => {
  const { id } = useParams()
    
  return (
    <Container header={<Header />}>
      <CategoryForm id={id} defaultValues={initBody} />
    </Container>
  )
}
