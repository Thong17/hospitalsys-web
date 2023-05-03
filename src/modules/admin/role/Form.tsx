import {
  DetailField,
  LocaleField,
  PrivilegeField,
} from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { roleSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { getPreRole, getListRole, getPreMenu } from 'shared/redux'
import { useAppDispatch } from 'app/hooks'
import Loading from 'components/shared/Loading'
import useWeb from 'hooks/useWeb'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import useTheme from 'hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import useLanguage from 'hooks/useLanguage'

export const RoleForm = ({ defaultValues, id }: any) => {
  const {
    reset,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(roleSchema), defaultValues })
  const { device } = useWeb()
  const { notify } = useNotify()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const dispatch = useAppDispatch()
  const [preRole, setPreRole] = useState({})
  const [preMenu, setPreMenu] = useState({})

  const handleSetPrivilege = (privilege) => {
    setValue('privilege', privilege)
  }

  const handleSetNavigation = (navigation) => {
    setValue('navigation', navigation)
  }

  const handleChangeRole = (role) => {
    setValue('name', role)
  }

  useEffect(() => {
    let isSubscribed = true
    const role = dispatch(getPreRole()).unwrap()
    const menu = dispatch(getPreMenu()).unwrap()
    Promise.all([role, menu])
      .then(data => {
        if (!isSubscribed) return
        if (data[0]?.code !== 'SUCCESS' || data[1]?.code !== 'SUCCESS') return
        setPreRole(data[0]?.data)
        setPreMenu(data[1]?.data)
        setLoading(false)
      })
      .catch(err => notify(err?.message, 'error'))
    return () => {
      isSubscribed = false
    }
    // eslint-disable-next-line
  }, [dispatch])

  const submit = async (data) => {
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/admin/role/update/${id}` : `/admin/role/create`,
      body: data,
    })
      .then((data) => {
        notify(data?.data?.msg, 'success')
        dispatch(getListRole())
        if (!id) {
          reset(defaultValues)
        }
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setLoading(false))
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridColumnGap: 40,
      gridTemplateAreas:
        device === 'mobile'
          ? ` 
          'form form form'
          'privilege privilege privilege'
        `
          : ` 
          'form privilege privilege'
        `,
    }}>
      <div style={{ gridArea: 'form', position: 'sticky', top: 20, height: '430px' }}>
        <form
          onSubmit={handleSubmit(submit)}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridColumnGap: 20,
            gridTemplateAreas:
            ` 
              'name name name' 
              'description description description'
              'action action action'
            `
          }}
        >
          <div style={{ gridArea: 'name' }}>
            <LocaleField
              onChange={handleChangeRole}
              err={errors?.name}
              describe='Role'
              name='name'
              defaultValue={getValues('name')}
            />
          </div>
          <div style={{ gridArea: 'description' }}>
            <DetailField
              type='text'
              label='Description'
              style={{ height: 70 }}
              {...register('description')}
            />
          </div>
          <div
            style={{
              gridArea: 'action',
              marginTop: 10,
              display: 'flex',
              justifyContent: 'end',
            }}
          >
            <Button
              variant='contained'
              style={{
                backgroundColor: `${theme.color.error}22`,
                color: theme.color.error,
              }}
              onClick={() => navigate(-1)}
            >
              {language['CANCEL']}
            </Button>
            <Button
              loading={loading}
              type='submit'
              variant='contained'
              style={{
                marginLeft: 10,
                backgroundColor: `${theme.color.info}22`,
                color: theme.color.info,
              }}
            >
              {id ? language['SAVE'] : language['CREATE']}
            </Button>
          </div>
        </form>
      </div>
      <div
        style={{ gridArea: 'privilege', minHeight: 42, position: 'relative' }}
      >
        {!loading ? (
          <PrivilegeField
            preRole={preRole}
            preMenu={preMenu}
            role={getValues('privilege')}
            menu={getValues('navigation')}
            returnPrivilege={handleSetPrivilege}
            returnNavigation={handleSetNavigation}
          />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  )
}
