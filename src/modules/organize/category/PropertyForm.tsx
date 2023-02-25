import { AlertDialog } from 'components/shared/table/AlertDialog'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { DetailField, LocaleField } from 'components/shared/form'
import { propertySchema } from './schema'
import useWeb from 'hooks/useWeb'
import { useEffect, useState } from 'react'
import { DialogTitle } from 'components/shared/DialogTitle'
import { IOptions, SelectField } from 'components/shared/form/SelectField'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { createCategoryProperty, selectFormCategory, updateCategoryProperty } from './redux'
import useNotify from 'hooks/useNotify'
import useLanguage from 'hooks/useLanguage'
import Button from 'components/shared/Button'

export const choiceOptions: IOptions[] = [
  {
    value: 'SINGLE',
    label: 'Single',
  },
  {
    value: 'MULTIPLE',
    label: 'Multiple',
  },
]

export const requireOptions: IOptions[] = [
  {
    value: false,
    label: 'Optional',
  },
  {
    value: true,
    label: 'Require',
  },
]

export const PropertyForm = ({
  dialog,
  setDialog,
  defaultValues,
  onUpdate,
  theme,
}: any) => {
  const {
    watch,
    reset,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(propertySchema), defaultValues })

  const { width } = useWeb()
  const { notify } = useNotify()
  const { language } = useLanguage()
  const [choice, setChoice] = useState('SINGLE')
  const [isRequire, setIsRequire] = useState(false)
  const choiceValue = watch('choice')
  const isRequireValue = watch('isRequire')
  const dispatch = useAppDispatch()
  const { status } = useAppSelector(selectFormCategory)

  useEffect(() => {
    const selectedOption = requireOptions.find(
      (key) => key.value === isRequireValue
    )

    setIsRequire(selectedOption?.value || false)
  }, [isRequireValue])

  useEffect(() => {
    const selectedChoice = choiceOptions.find(
      (key) => key.value === choiceValue
    )

    setChoice(selectedChoice?.value || 'SINGLE')
  }, [choiceValue])

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const handleLocaleChange = (data) => {
    setValue('name', data)
  }

  const handleCloseDialog = () => {
    setDialog({ ...dialog, propertyId: null, open: false })
  }

  const submit = (data) => {
    if (!dialog.categoryId) return notify(language['ERROR:NO_CATEGORY'], 'error')
    dialog.propertyId
      ? dispatch(
          updateCategoryProperty({
            id: dialog.propertyId,
            body: { ...data, category: dialog.categoryId },
          })
        )
          .unwrap()
          .then((response) => {
            if (response.code !== 'SUCCESS') return notify(language[response?.msg], 'error')
            onUpdate()
            notify(language[response?.msg], 'success')
          })
          .catch(err => notify(err?.response?.msg, 'error'))
      : dispatch(
          createCategoryProperty({
            body: { ...data, category: dialog.categoryId },
          })
        )
          .unwrap()
          .then((response) => {
            if (response.code !== 'SUCCESS') return notify(language[response?.msg], 'error')
            onUpdate()
            notify(language[response?.msg], 'success')
          })
          .catch(err => notify(err?.response?.msg, 'error'))
  }

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <DialogTitle title='Property Form' onClose={handleCloseDialog} />
      <form
        style={{
          fontFamily: theme.font.family,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          width: width < 1024 ? '80vw' : '60vw',
          padding: 20,
          gridColumnGap: 20,
          gridTemplateAreas: `
                            'property property property'
                            'choice choice isRequire'
                            'description description description'
                            'action action action'
                        `,
        }}
      >
        <div style={{ gridArea: 'property', marginBottom: '20px' }}>
          <LocaleField
            name='name'
            err={errors?.name}
            describe='Property'
            defaultValue={getValues('name')}
            onChange={handleLocaleChange}
          />
        </div>
        <div style={{ gridArea: 'choice' }}>
          <SelectField
            value={choice}
            options={choiceOptions}
            label='Choice'
            err={errors?.choice?.message}
            {...register('choice')}
          />
        </div>
        <div style={{ gridArea: 'isRequire' }}>
          <SelectField
            value={isRequire}
            options={requireOptions}
            label='Option'
            err={errors?.isRequire?.message}
            {...register('isRequire')}
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
            {dialog.propertyId ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </AlertDialog>
  )
}
