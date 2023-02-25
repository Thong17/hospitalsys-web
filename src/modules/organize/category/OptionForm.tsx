import { AlertDialog } from 'components/shared/table/AlertDialog'
import { optionSchema } from './schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import {
  DetailField,
  FileField,
  LocaleField,
  SelectField,
  TextField,
} from 'components/shared/form'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { currencyOptions } from 'constants/variables'
import { useEffect, useState } from 'react'
import { IImage } from 'components/shared/form/UploadField'
import useWeb from 'hooks/useWeb'
import { DialogTitle } from 'components/shared/DialogTitle'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { createCategoryOption, getCategory, selectFormCategory, updateCategoryOption } from './redux'
import useLanguage from 'hooks/useLanguage'
import Button from 'components/shared/Button'

export const OptionForm = ({
  dialog,
  setDialog,
  defaultValues,
  theme,
}: any) => {
  const {
    reset,
    watch,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(optionSchema), defaultValues })
  const dispatch = useAppDispatch()
  const { loadify } = useNotify()
  const { width } = useWeb()
  const { notify } = useNotify()
  const { language } = useLanguage()
  const { status } = useAppSelector(selectFormCategory)
  const [imagePath, setImagePath] = useState<IImage | undefined>(
    defaultValues?.imagePath
  )
  const [currency, setCurrency] = useState(defaultValues?.currency)
  const currencyValue = watch('currency')

  useEffect(() => {
    const selectedCurrency = currencyOptions.find(
      (key) => key.value === currencyValue
    )

    setCurrency(selectedCurrency?.value || 'USD')
  }, [currencyValue])

  useEffect(() => {
    reset(defaultValues)
    setImagePath(defaultValues?.imagePath)
  }, [defaultValues, reset])

  const handleLocaleChange = (data) => {
    setValue('name', data)
  }

  const handleChangeImages = (event) => {
    const profile = event.target.files[0]

    const formData = new FormData()
    formData.append('images', profile)

    const response = Axios({
      method: 'POST',
      url: `/shared/upload/image`,
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    loadify(response)
    response.then((data) => {
      const fileIds = data?.data?.data?.[0]?._id
      const file: IImage = {
        filename: data?.data?.data?.[0]?.filename,
        _id: data?.data?.data?.[0]?._id,
      }
      setValue('profile', fileIds)
      setImagePath(file)
    })
  }

  const handleCloseDialog = () => {
    setDialog({ ...dialog, propertyId: null, optionId: null, open: false })
  }

  const handleDeleteImage = () => {
    setValue('profile', null)
    setImagePath(undefined)
  }

  const submit = (data) => {
    const body = {
      ...data,
      category: dialog.categoryId,
      property: dialog.propertyId,
    }
    dialog.optionId
      ? dispatch(updateCategoryOption({ id: dialog.optionId, body }))
          .unwrap()
          .then((response) => {
            if (response.code !== 'SUCCESS') return notify(language[response?.msg], 'error')
            dispatch(getCategory({ id: dialog.categoryId, fields: ['name', 'icon', 'status', 'description', 'properties'] }))
            notify(language[response?.msg], 'success')
          })
          .catch(err => notify(err?.response?.msg, 'error'))
      : dispatch(createCategoryOption({ body }))
          .unwrap()
          .then((response) => {
            if (response.code !== 'SUCCESS') return notify(language[response?.msg], 'error')
            dispatch(getCategory({ id: dialog.categoryId, fields: ['name', 'icon', 'status', 'description', 'properties'] }))
            notify(language[response?.msg], 'success')
          })
          .catch(err => notify(err?.response?.msg, 'error'))
  }

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <DialogTitle title='Option Form' onClose={handleCloseDialog} />
      <form
        style={{
          fontFamily: theme.font.family,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          width: width < 1024 ? '80vw' : '60vw',
          padding: 20,
          gridColumnGap: 20,
          gridTemplateAreas: `
                            'option option option'
                            'price price currency'
                            'profile profile profile'
                            'description description description'
                            'action action action'
                          `,
        }}
      >
        <div style={{ gridArea: 'option', marginBottom: '20px' }}>
          <LocaleField
            name='name'
            err={errors?.name}
            describe='Option'
            defaultValue={getValues('name')}
            onChange={handleLocaleChange}
          />
        </div>
        <div style={{ gridArea: 'price' }}>
          <TextField
            type='number'
            step='any'
            label='Price'
            err={errors?.price?.message}
            {...register('price')}
          />
        </div>
        <div style={{ gridArea: 'currency' }}>
          <SelectField
            value={currency}
            options={currencyOptions}
            label='Currency'
            err={errors?.currency?.message}
            {...register('currency')}
          />
        </div>
        <div style={{ gridArea: 'profile' }}>
          <FileField
            height={130}
            images={imagePath && [imagePath]}
            name='profile'
            label='Profile'
            accept='image/png, image/jpeg'
            err={errors?.profile?.message}
            selected={getValues('profile')}
            onChange={handleChangeImages}
            handleDelete={handleDeleteImage}
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
          style={{ gridArea: 'action', display: 'flex', justifyContent: 'end' }}
        >
          <Button
            onClick={handleCloseDialog}
            style={{
              backgroundColor: `${theme.color.error}22`,
              color: theme.color.error,
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={status === 'LOADING'}
            loading={status === 'LOADING'}
            type='submit'
            style={{
              marginLeft: 10,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
            }}
            onClick={handleSubmit(submit)}
            autoFocus
          >
            {dialog.optionId ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </AlertDialog>
  )
}
