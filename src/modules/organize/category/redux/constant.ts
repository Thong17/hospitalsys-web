import { IBody } from 'shared/interface'

export interface ICategoryBody {
  name: Object,
  status: boolean,
  icon: any,
  description: string,
  properties: any[]
}

export const initState: ICategoryBody = {
  name: {},
  status: true,
  icon: null,
  description: '',
  properties: []
}

export interface CategoryState {
  list: IBody<any[]>
  detail: IBody<ICategoryBody>
}

export const initialState: CategoryState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: initState,
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