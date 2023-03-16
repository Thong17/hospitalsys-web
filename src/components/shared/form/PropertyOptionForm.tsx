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
import Button from '../Button'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { useAppDispatch } from 'app/hooks'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import {
  getCategory,
  removeCategoryOption,
  removeCategoryProperty,
  reorderCategoryProperty,
  toggleCategoryOption,
} from 'modules/organize/category/redux'
import {
  initOption,
  initProperty,
  mapOptionBody,
  mapPropertyBody,
} from 'modules/organize/category/redux/constant'
import useLanguage from 'hooks/useLanguage'
import { OptionForm } from 'modules/organize/category/OptionForm'
import { PropertyForm } from 'modules/organize/category/PropertyForm'

const PropertyOptionForm = ({
  categoryId,
  optionDialog,
  setOptionDialog,
  propertyDialog,
  setPropertyDialog,
}: {
  categoryId?: string
  propertyDialog: any
  setPropertyDialog: any
  optionDialog: any
  setOptionDialog: any
}) => {
  const { device } = useWeb()
  const confirm = useAlert()
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const { notify } = useNotify()
  const { language, lang } = useLanguage()
  const [properties, setProperties] = useState<any>([])
  const [propertyValue, setPropertyValue] = useState(initProperty)
  const [optionValue, setOptionValue] = useState(initOption)

  const getCategoryDetail = (id) => {
    if (!id) return
    dispatch(
      getCategory({
        id,
        fields: ['properties'],
      })
    )
      .unwrap()
      .then((response) => {
        if (response.code !== 'SUCCESS' || !response?.data)
          return notify(language[response?.msg], 'error')
        const { properties } = response?.data
        setProperties(properties)
      })
  }

  useEffect(() => {
    getCategoryDetail(categoryId)
    // eslint-disable-next-line
  }, [categoryId])

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
      .catch((err) => notify(language[err?.message], 'error'))
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
        getCategoryDetail(categoryId)
        notify(language[response?.msg], 'success')
      })
      .catch((err) => notify(language[err?.message], 'error'))
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
      title: language['TITLE:DELETE_OPTION'],
      description: language['DESCRIPTION:DELETE_OPTION'],
      variant: 'error',
    })
      .then(() => {
        dispatch(removeCategoryOption({ id }))
          .unwrap()
          .then((response) => {
            getCategoryDetail(categoryId)
            notify(language[response?.msg], 'success')
          })
          .catch((err) => notify(language[err?.message], 'error'))
      })
      .catch(() => null)
  }

  const handleDeleteProperty = (id) => {
    confirm({
      title: language['TITLE:DELETE_PROPERTY'],
      description: language['DESCRIPTION:DELETE_PROPERTY'],
      variant: 'error',
    })
      .then(() => {
        dispatch(removeCategoryProperty({ id }))
          .unwrap()
          .then((response) => {
            getCategoryDetail(categoryId)
            notify(language[response?.msg], 'success')
          })
          .catch((err) => notify(language[err?.message], 'error'))
      })
      .catch(() => null)
  }

  return (
    <div>
      <Button
        disabled={!propertyDialog.categoryId}
        fullWidth
        style={{
          marginTop: 20,
          backgroundColor: !propertyDialog.categoryId
            ? `${theme.text.quaternary}22`
            : `${theme.color.info}22`,
          color: !propertyDialog.categoryId
            ? theme.text.quaternary
            : theme.color.info,
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
                            paddingTop: 30,
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
                                onClick={() => handleEditProperty(property)}
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
                                  <div key={index} className='option-container'>
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
                                          handleEditOption(option, property._id)
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
      <PropertyForm
        dialog={propertyDialog}
        setDialog={setPropertyDialog}
        theme={theme}
        onUpdate={() => getCategoryDetail(categoryId)}
        defaultValues={propertyValue}
      />
      <OptionForm
        dialog={optionDialog}
        setDialog={setOptionDialog}
        theme={theme}
        onUpdate={() => getCategoryDetail(categoryId)}
        defaultValues={optionValue}
      />
    </div>
  )
}

export default PropertyOptionForm
