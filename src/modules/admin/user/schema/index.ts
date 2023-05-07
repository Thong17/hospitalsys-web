import * as yup from 'yup'

export const createUserSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
  email: yup.string().email().required(),
  role: yup.string().required()
})

export const updateUserSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().optional(),
  email: yup.string().email().required(),
  role: yup.string().required()
})

export const updateUserDetailSchema = yup.object().shape({
  lastName: yup.string().optional(),
  firstName: yup.string().optional(),
  address: yup.string().optional(),
  contact: yup.string().optional(),
  gender: yup.string().optional(),
  dateOfBirth: yup.string().optional(),
})