import * as yup from 'yup'

export const categorySchema = yup.object().shape({
  name: yup.object({
    English: yup.string().required('English is required'),
  }),
  status: yup.boolean().optional(),
  icon: yup.mixed().optional(),
  description: yup.string().optional(),
})

export const optionSchema = yup.object().shape({
  name: yup.object({
    English: yup.string().required('English is required'),
  }),
  price: yup.number().optional(),
  currency: yup.string().optional(),
  profile: yup.string().optional().nullable(),
  description: yup.string().optional(),
})

export const propertySchema = yup.object().shape({
  name: yup.object({
    English: yup.string().required('English is required'),
  }),
  description: yup.string().optional(),
  isRequire: yup.boolean().required(),
  choice: yup.string().required(),
})
