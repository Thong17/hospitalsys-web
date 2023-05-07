import Button from 'components/shared/Button'
import { SelectField, TextField } from 'components/shared/form'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateUserDetailSchema } from '../schema'
import { genderOptions } from 'constants/variables'

const GeneralDetail = () => {
  const { device } = useWeb()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(updateUserDetailSchema) })
  const [gender, setGender] = useState('')
  const genderId = watch('gender')

  useEffect(() => {
    const gender = genderOptions.find((gender) => gender.value === genderId)
    setGender(gender?.value || '')
  }, [genderId])

  const submit = (data) => {
    console.log(data)
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={{ gridArea: 'form', position: 'sticky', top: 20, height: '430px' }}
    >
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
                  'lastName firstName firstName' 
                  'dateOfBirth dateOfBirth gender'
                  'email email email'
                  'action action action'
                `
              : ` 
                  'lastName firstName firstName' 
                  'dateOfBirth dateOfBirth gender'
                  'email email email'
                  'action action action'
                `,
        }}
      >
        <div style={{ gridArea: 'lastName' }}>
          <TextField
            type='text'
            label='LastName'
            err={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
        <div style={{ gridArea: 'firstName' }}>
          <TextField
            type='text'
            label='FirstName'
            err={errors.firstName?.message}
            {...register('firstName')}
          />
        </div>
        <div style={{ gridArea: 'dateOfBirth' }}>
          <TextField
            type='date'
            label='Date Of Birth'
            err={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />
        </div>
        <div style={{ gridArea: 'gender' }}>
          <SelectField
            value={gender}
            label='Gender'
            options={genderOptions}
            err={errors.gender?.message}
            {...register('gender')}
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
            type='submit'
            variant='contained'
            style={{
              marginLeft: 10,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
            }}
          >
            {language['SAVE']}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default GeneralDetail
