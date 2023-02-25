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
import { PropertyForm } from './PropertyForm'
import { OptionForm } from './OptionForm'
import { initOption, initProperty, mapOptionBody, mapPropertyBody } from './redux/constant'
import useLanguage from 'hooks/useLanguage'
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'
import { Section } from 'components/shared/Section'
import { MenuDialog } from 'components/shared/MenuDialog'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { MenuItem } from '@mui/material'
import useAlert from 'hooks/useAlert'
import { CustomOptionContainer } from 'styles/container'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded'
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded'
import {
  DeleteButton,
  UpdateButton,
} from 'components/shared/table/ActionButton'
import { TextEllipsis } from 'components/shared/TextEllipsis'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getCategory, createCategory, selectCategory, updateCategory, reorderCategoryProperty, removeCategoryProperty, toggleCategoryOption, removeCategoryOption } from './redux'
import useNotify from 'hooks/useNotify'

const statusOption = [
  { label: 'Enabled', value: true },
  { label: 'Disable', value: false },
]

const CategoryForm = ({ defaultValues, id }: any) => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(categorySchema), defaultValues })
  const { width, device } = useWeb()
  const confirm = useAlert()
  const dispatch = useAppDispatch()
  const { notify } = useNotify()
  const { language, lang } = useLanguage()
  const [status, setStatus] = useState(defaultValues?.status)
  const [iconPath, setIconPath] = useState<IImage>(defaultValues?.icon)
  const statusValue = watch('status')
  const { data: category } = useAppSelector(selectCategory)
  const [properties, setProperties] = useState<any>([])
  const [propertyValue, setPropertyValue] = useState(initProperty)
  const [optionValue, setOptionValue] = useState(initOption)
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

  useEffect(() => {
    if (!category?.properties) return
    setProperties(category.properties)
  }, [category?.properties])

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
        .then(response => {
          notify(language[response?.msg], 'success')
          setPropertyDialog({ ...propertyDialog, categoryId: response.data.data?._id })
        })
        .catch(err => notify(language[err?.message], 'error'))
      : dispatch(createCategory({ body: data }))
        .unwrap()
        .then(response => {
          notify(language[response?.msg], 'success')
          setPropertyDialog({ ...propertyDialog, categoryId: response.data.data?._id })
        })
        .catch(err => notify(language[err?.message], 'error'))
  }

  const handleDropProperty = (event: any) => {
    if (!event.destination || event.destination?.index === event.source?.index)
      return

    const items = Array.from(properties)
    const [reorderItem] = items.splice(event?.source?.index, 1)
    items.splice(event?.destination?.index, 0, reorderItem)
    const reorderedItems = items.map((item: any, index) => {
      return { _id: item._id, order: index }
    })
    setProperties(items)
    dispatch(reorderCategoryProperty({ body: reorderedItems }))
      .unwrap()
      .then((response) => {
        notify(language[response?.msg], 'success')
      })
      .catch(err => notify(language[err?.message], 'error'))
  }

  const handleEditProperty = (prop) => {
    if (!prop) return
    setPropertyValue(mapPropertyBody(prop))
    setPropertyDialog({
      ...propertyDialog,
      propertyId: prop._id,
      open: true,
    })
  }

  const handleToggleDefault = (optionId) => {
    if (!optionId) return
    dispatch(toggleCategoryOption({ id: optionId }))
      .unwrap()
      .then((response) => {
        dispatch(getCategory({ id: optionDialog.categoryId, fields: ['name', 'icon', 'status', 'description', 'properties'] }))
        notify(language[response?.msg], 'success')
      })
      .catch(err => notify(language[err?.message], 'error'))
  }

  const handleEditOption = (option, propertyId) => {
    setOptionValue(mapOptionBody(option))
    setOptionDialog({
      ...optionDialog,
      propertyId,
      optionId: option._id,
      open: true,
    })
  }

  const handleDeleteOption = (id) => {
    confirm({
      title: 'Delete Option',
      description: 'Are you sure?',
      variant: 'error',
    })
      .then(() => {
        dispatch(removeCategoryOption({ id }))
          .unwrap()
          .then((response) => {
            dispatch(getCategory({ id: optionDialog.categoryId, fields: ['name', 'icon', 'status', 'description', 'properties'] }))
            notify(language[response?.msg], 'success')
          })
          .catch(err => notify(language[err?.message], 'error'))
      })
      .catch(() => null)
  }

  const handleDeleteProperty = (id) => {
    confirm({
      title: 'Delete Property',
      description: 'Are you sure?',
      variant: 'error',
    })
      .then(() => {
        dispatch(removeCategoryProperty({ id }))
          .unwrap()
          .then((response) => {
            dispatch(getCategory({ id: propertyDialog.categoryId, fields: ['name', 'icon', 'status', 'description', 'properties'] }))
            notify(language[response?.msg], 'success')
          })
          .catch(err => notify(language[err?.message], 'error'))
      })
      .catch(() => null)
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
          <div
            style={{ gridArea: 'category', marginTop: 20, marginBottom: 20 }}
          >
            <LocaleField
              onChange={handleChangeCategory}
              err={errors?.name}
              describe='Category'
              name='name'
              defaultValue={getValues('name')}
            />
          </div>
          <div style={{ gridArea: 'status' }}>
            <SelectField
              options={statusOption}
              label='Status'
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
              label='Icon'
              accept='image/png, image/jpeg'
              onChange={handleChangeFile}
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
              Cancel
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
              {id ? 'Save' : 'Create'}
            </Button>
          </div>
        </div>
        <div>
          <Button
            disabled={!propertyDialog.categoryId}
            fullWidth
            style={{
              marginTop: 20,
              backgroundColor: !propertyDialog.categoryId ? `${theme.text.secondary}22` : `${theme.color.info}22`,
              color: !propertyDialog.categoryId ? theme.text.secondary : theme.color.info,
              boxShadow: theme.shadow.secondary,
            }}
            onClick={() => {
              setPropertyValue(initProperty)
              setPropertyDialog({
                ...propertyDialog,
                open: true,
              })
            }}
          >
            {language['ADD_PROPERTY']}
          </Button>
          <DragDropContext onDragEnd={handleDropProperty}>
            <Droppable droppableId='properties'>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {properties?.map((property, index) => {
                    return (
                      <Draggable
                        key={property._id}
                        draggableId={property._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Section
                              style={{
                                position: 'relative',
                                boxSizing: 'border-box',
                                paddingTop: 20,
                              }}
                              boxShadow={theme.shadow.secondary}
                              describe={
                                property?.name?.[lang] ||
                                property?.name?.['English']
                              }
                            >
                              <div
                                className='action'
                                style={{
                                  position: 'absolute',
                                  top: -7,
                                  right: 0,
                                }}
                              >
                                <MenuDialog
                                  label={
                                    <MoreHorizIcon
                                      style={{
                                        color: theme.text.secondary,
                                      }}
                                    />
                                  }
                                >
                                  <MenuItem
                                    component='div'
                                    onClick={() =>
                                      handleEditProperty(property)
                                    }
                                  >
                                    {language['EDIT']}
                                  </MenuItem>
                                  <MenuItem
                                    component='div'
                                    onClick={() =>
                                      handleDeleteProperty(property?._id)
                                    }
                                  >
                                    {language['DELETE']}
                                  </MenuItem>
                                </MenuDialog>
                              </div>
                              <CustomOptionContainer
                                device={device}
                                styled={theme}
                                loading={'false'}
                              >
                                <Button
                                  className='create-button'
                                  onClick={() => {
                                    setOptionValue(initOption)
                                    setOptionDialog({
                                      ...optionDialog,
                                      propertyId: property?._id,
                                      open: true,
                                    })
                                  }}
                                >
                                  <AddRoundedIcon />
                                </Button>
                                {property?.options?.map((option, index) => {
                                  return (
                                    option.property === property._id && (
                                      <div
                                        key={index}
                                        className='option-container'
                                      >
                                        <div
                                          style={{
                                            position: 'absolute',
                                            bottom: 6,
                                            left: 10,
                                            color: theme.text.quaternary,
                                            zIndex: 10,
                                          }}
                                        >
                                          {option.isDefault ? (
                                            <RadioButtonCheckedRoundedIcon
                                              onClick={() =>
                                                handleToggleDefault(option._id)
                                              }
                                              style={{ cursor: 'pointer' }}
                                              fontSize='small'
                                            />
                                          ) : (
                                            <RadioButtonUncheckedRoundedIcon
                                              onClick={() =>
                                                handleToggleDefault(option._id)
                                              }
                                              style={{ cursor: 'pointer' }}
                                              fontSize='small'
                                            />
                                          )}
                                        </div>
                                        <div className='action'>
                                          <UpdateButton
                                            style={{ margin: 0 }}
                                            onClick={() =>
                                              handleEditOption(
                                                option,
                                                property._id
                                              )
                                            }
                                          />
                                          <DeleteButton
                                            onClick={() =>
                                              handleDeleteOption(option._id)
                                            }
                                          />
                                        </div>
                                        <div className='option-detail'>
                                          <TextEllipsis className='title'>
                                            {option.name?.[lang] ||
                                              option.name?.['English']}
                                          </TextEllipsis>
                                          <TextEllipsis className='description'>
                                            {option.description}
                                          </TextEllipsis>
                                        </div>
                                        <TextEllipsis className='option-price'>
                                          {option.price} {option.currency}
                                        </TextEllipsis>
                                      </div>
                                    )
                                  )
                                })}
                              </CustomOptionContainer>
                            </Section>
                          </div>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </form>
      <PropertyForm
        dialog={propertyDialog}
        setDialog={setPropertyDialog}
        theme={theme}
        defaultValues={propertyValue}
      />
      <OptionForm
        dialog={optionDialog}
        setDialog={setOptionDialog}
        theme={theme}
        defaultValues={optionValue}
      />
    </div>
  )
}

export default CategoryForm
