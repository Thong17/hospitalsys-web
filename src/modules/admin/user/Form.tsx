import { TextField, SelectField, PrivilegeField } from 'components/shared/form'
import { useForm } from 'react-hook-form'
import { createUserSchema, updateUserSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { IOptions } from 'components/shared/form/SelectField'
import { getListRole, getPreMenu, getPreRole, selectListRole } from 'shared/redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListUser } from './redux'
import useWeb from 'hooks/useWeb'
import Button from 'components/shared/Button'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useLanguage from 'hooks/useLanguage'
import Loading from 'components/shared/Loading'
import useTheme from 'hooks/useTheme'
import { useNavigate } from 'react-router-dom'

const segmentOption = [
  { label: 'General', value: 'GENERAL' },
  { label: 'Doctor', value: 'DOCTOR' },
  { label: 'Patient', value: 'PATIENT' },
]

export const RoleForm = ({ defaultValues, id }: any) => {
  const dispatch = useAppDispatch()
  const { data: listRole, status: statusListRole } = useAppSelector(selectListRole)
  const {
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(id ? updateUserSchema : createUserSchema), defaultValues })
  const { device } = useWeb()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { notify } = useNotify()
  const { lang, language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('')
  const [permission, setPermission] = useState<any>({ label: '', privilege: {}, navigation: {} })
  const [roleOption, setRoleOption] = useState<IOptions[]>([])
  const [segment, setSegment] = useState(defaultValues?.segment || 'GENERAL')
  const roleId = watch('role')
  const segmentValue = watch('segment')

  const [preRole, setPreRole] = useState({})
  const [preMenu, setPreMenu] = useState({})

  useEffect(() => {
    const selectedSegment = segmentOption.find((key) => key.value === segmentValue)
    setSegment(selectedSegment?.value || 'GENERAL')
  }, [segmentValue])

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
    setLoading(true)
    Axios({
      method: id ? 'PUT' : 'POST',
      url: id ? `/admin/user/update/${id}` : `/admin/user/create`,
      body: data,
    })
      .then((data) => {
        dispatch(getListUser({}))
        notify(data?.data?.msg, 'success')
        if (!id) {
          reset(defaultValues)
          navigate(`/admin/user/create/info/${data?.data?.data?._id}`)
        }
      })
      .catch((err) => notify(err.response?.data?.[0]?.path || err.response?.data?.msg, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const role = listRole.find((value) => value._id === roleId)
    
    setRole(role?._id || '')
    setPermission({ privilege: role?.privilege || {}, navigation: role?.navigation || {}, label: role?.name?.[lang] || role?.name?.['English'] || '' })
  }, [roleId, listRole, lang])

  useEffect(() => {
    if (statusListRole !== 'INIT') return
    dispatch(getListRole())
  }, [dispatch, statusListRole])

  useEffect(() => {
    let options: IOptions[] = []
    listRole.forEach((role) => {
      options = [...options, { label: role.name?.[lang] || role.name?.['English'], value: role._id }]
    })

    setRoleOption(options)
  }, [listRole, lang])

  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={{
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
      }}
    >
      <div style={{ gridArea: 'form', }}>
        <div
          style={{
            position: 'relative',
            gridArea: 'form',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridColumnGap: 20,
            gridTemplateAreas:
              device === 'mobile'
                ? ` 
                  'username username role' 
                  'segment password password'
                  'email email email'
                  'action action action'
                `
                : ` 
                  'username username role' 
                  'segment password password'
                  'email email email'
                  'action action action'
                `,
          }}
        >
          
          <div style={{ gridArea: 'username' }}>
            <TextField
              type='text'
              label='Username'
              err={errors.username?.message}
              {...register('username')}
            />
          </div>
          <div style={{ gridArea: 'role' }}>
            <SelectField
              value={role}
              label='Role'
              options={roleOption}
              err={errors.role?.message}
              loading={statusListRole === 'LOADING' ? true : false}
              {...register('role')}
            />
          </div>
          <div style={{ gridArea: 'segment' }}>
            <SelectField
              value={segment}
              label='Segment'
              options={segmentOption}
              err={errors.segment?.message}
              {...register('segment')}
            />
          </div>
          <div style={{ gridArea: 'password' }}>
            <TextField
              type='password'
              label={id ? 'Update Password' : 'Password'}
              err={errors.password?.message}
              {...register('password')}
            />
          </div>
          
          <div style={{ gridArea: 'email' }}>
            <TextField
              type='email'
              label='Email'
              err={errors.email?.message}
              {...register('email')}
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
            <Button variant='contained' style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }} onClick={() => navigate(-1)}>
              {language['CANCEL']}
            </Button>
            <Button
              loading={loading}
              type='submit'
              variant='contained'
              style={{ marginLeft: 10, backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
            >
              { id ? language['SAVE'] : language['CREATE'] }
            </Button>
          </div>
        </div>
      </div>
      <div style={{ gridArea: 'privilege' }}>
        {!loading ? <PrivilegeField label={`${permission.label} Privilege Preview`} preRole={preRole} preMenu={preMenu} menu={permission.navigation} role={permission.privilege} isReadOnly={true} /> : <Loading />}
      </div>
    </form>
  )
}
