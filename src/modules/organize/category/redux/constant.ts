import { Omit } from 'react-redux'
import { IBody } from 'shared/interface'

export interface ICategory {
  name: Object,
  status: boolean,
  icon: any,
  description: string,
  properties: []
}

export const initBody: Omit<ICategory, 'properties'> = {
  name: {},
  status: true,
  icon: null,
  description: '',
}

export const initState: ICategory = {
  name: {},
  status: true,
  icon: null,
  description: '',
  properties: []
}

export interface CategoryState {
  list: IBody<any[]>
  detail: IBody<ICategory>
  form: Omit<IBody<any>, 'data'>
}

export const initialState: CategoryState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: initState,
    status: 'INIT',
  },
  form: {
    status: 'INIT',
  }
}

export const initProperty = {
  name: {},
  description: '',
  isRequire: false,
  choice: 'SINGLE'
}

export const initOption = {
  name: {},
  currency: 'USD',
  price: 0,
  description: '',
}

export const mapPropertyBody = (body) => {
  return {
    name: body.name,
    description: body.description,
    isRequire: body?.isRequire,
    choice: body?.choice
  }
}