import React, { useEffect, useState } from 'react'
import {
  LocaleField,
  FileField,
  DetailField,
  SelectField,
} from 'components/shared/form'
import Button from 'components/shared/Button'
import useWeb from 'hooks/useWeb'
import { useForm } from 'react-hook-form'
import { categorySchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios from 'constants/functions/Axios'
import { IImage } from 'components/shared/form/UploadField'
import useTheme from 'hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import useLanguage from 'hooks/useLanguage'
import { useAppDispatch } from 'app/hooks'
import { getCategory, createCategory, updateCategory } from './redux'
import useNotify from 'hooks/useNotify'
import PropertyOptionForm from 'components/shared/form/PropertyOptionForm'

const statusOption = [
  { label: 'Enabled', value: true },
  { label: 'Disable', value: false },
]

const CategoryForm = ({ defaultValues, id }: any) => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const {
    reset,
    watch,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(categorySchema), defaultValues })
  const { width } = useWeb()
  const dispatch = useAppDispatch()
  const { notify } = useNotify()
  const { language } = useLanguage()
  const [status, setStatus] = useState(defaultValues?.status)
  const [iconPath, setIconPath] = useState<IImage>(defaultValues?.icon)
  const statusValue = watch('status')
  const [categoryId, setCategoryId] = useState(undefined)
  const [optionDialog, setOptionDialog] = useState({
    open: false,
    propertyId: null,
    categoryId: id,
    optionId: null,
  })
  const [propertyDialog, setPropertyDialog] = useState({
    open: false,
    propertyId: null,
    categoryId: id,
  })

  const getCategoryDetail = (id) => {
    if (!id) return
    dispatch(
      getCategory({
        id,
        fields: ['name', 'icon', 'status', 'description'],
      })
    )
      .unwrap()
      .then((response) => {
        if (response.code !== 'SUCCESS' || !response?.data)
          return notify(language[response?.msg], 'error')
        reset(response?.data)
      })
  }

  useEffect(() => {
    getCategoryDetail(id)
    setCategoryId(id)
    // eslint-disable-next-line
  }, [id])

  useEffect(() => {
    const selectedStatus = statusOption.find((key) => key.value === statusValue)
    setStatus(selectedStatus?.value)
  }, [statusValue])

  const handleChangeCategory = (category) => {
    setValue('name', category)
  }

  const handleChangeFile = (event) => {
    const image = event.target.files[0]
    const formData = new FormData()
    formData.append('icon', image)
    const response = Axios({
      method: 'POST',
      url: `/shared/upload/icon`,
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    response.then((data) => {
      const filename: IImage = data.data.data as IImage
      const fileId = data.data.data._id
      setValue('icon', fileId)
      setIconPath(filename)
    })
  }

  const submit = async (data) => {
    id
      ? dispatch(updateCategory({ id, body: data }))
          .unwrap()
          .then((response) => {
            notify(language[response?.msg], 'success')
            const id = response.data?._id
            setPropertyDialog({
              ...propertyDialog,
              categoryId: id,
            })
            setOptionDialog({
              ...optionDialog,
              categoryId: id,
            })
          })
          .catch((err) => notify(language[err?.message], 'error'))
      : dispatch(createCategory({ body: data }))
          .unwrap()
          .then((response) => {
            notify(language[response?.msg], 'success')
            const id = response.data?._id
            setCategoryId(id)
            setPropertyDialog({
              ...propertyDialog,
              categoryId: id,
            })
            setOptionDialog({
              ...optionDialog,
              categoryId: id,
            })
          })
          .catch((err) => notify(language[err?.message], 'error'))
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(submit)}
        style={{
          display: 'grid',
          gridTemplateColumns: width > 1024 ? '600px 1fr' : '1fr',
          gridGap: 20,
        }}
      >
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridColumnGap: 20,
              gridTemplateAreas: `
                              'category category category'
                              'status icon icon'
                              'description description description'
                              'action action action'
                              `,
            }}
          >
            <div style={{ gridArea: 'category' }}>
              <LocaleField
                onChange={handleChangeCategory}
                err={errors?.name}
                describe={language['NAME']}
                name='name'
                defaultValue={getValues('name')}
              />
            </div>
            <div style={{ gridArea: 'status' }}>
              <SelectField
                options={statusOption}
                label={language['STATUS']}
                value={status}
                err={errors?.status?.message}
                {...register('status')}
              />
            </div>
            <div style={{ gridArea: 'icon' }}>
              <FileField
                images={iconPath && [iconPath]}
                selected={getValues('icon')?._id}
                name='icon'
                label={language['ICON']}
                accept='image/png, image/jpeg'
                onChange={handleChangeFile}
              />
            </div>
            <div style={{ gridArea: 'description' }}>
              <DetailField
                type='text'
                label={language['DESCRIPTION']}
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
          </div>
        </div>
        <PropertyOptionForm
          categoryId={categoryId}
          optionDialog={optionDialog}
          propertyDialog={propertyDialog}
          setOptionDialog={setOptionDialog}
          setPropertyDialog={setPropertyDialog}
        />
      </form>
    </div>
  )
}

export default CategoryForm
