import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListCategory = createAsyncThunk(
  'category/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/organize/category',
      params: query
    })
    return response?.data
  }
)

export const getCategory = createAsyncThunk(
  'category/detail',
  async ({id, query, fields}: { id: string, query?: URLSearchParams, fields: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/organize/category/detail/${id}`,
      params: query
    })
    let data = {}
    fields.forEach((field) => {
      data[field] = response?.data?.data?.[field]
    })
    
    return { ...response?.data, data }
  }
)

export const createCategory = createAsyncThunk(
  'category/create',
  async ({ body }: { body: any }) => {
    const response = await Axios({
      method: 'POST',
      url: `/organize/category/create`,
      body: body
    })
    
    return response.data
  }
)

export const updateCategory = createAsyncThunk(
  'category/update',
  async ({ id, body }: { id: string, body: any }) => {
    const response = await Axios({
      method: 'PUT',
      url: `/organize/category/update/${id}`,
      body: body
    })
    
    return response.data
  }
)

export const createCategoryProperty = createAsyncThunk(
  'categoryProperty/create',
  async ({ body }: { body: any }) => {
    const response = await Axios({
      method: 'POST',
      url: `/organize/category/property/create`,
      body
    })
    
    return response.data
  }
)

export const updateCategoryProperty = createAsyncThunk(
  'categoryProperty/update',
  async ({ id, body }: { id: string, body: any }) => {
    const response = await Axios({
      method: 'PUT',
      url: `/organize/category/property/update/${id}`,
      body
    })
    
    return response.data
  }
)

export const createCategoryOption = createAsyncThunk(
  'categoryOption/create',
  async ({id, body}: { id: string, body: any }) => {
    const response = await Axios({
      method: 'POST',
      url: `/organize/category/${id}/option`,
      body: body
    })
    
    return response.data
  }
)

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List Category
      .addCase(getListCategory.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListCategory.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListCategory.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
      })

      // Detail Category
      .addCase(getCategory.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getCategory.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })

      // Update Property
      .addCase(updateCategoryProperty.pending, (state) => {
        state.form.status = 'LOADING'
      })
      .addCase(updateCategoryProperty.rejected, (state) => {
        state.form.status = 'FAILED'
      })
      .addCase(updateCategoryProperty.fulfilled, (state) => {
        state.form.status = 'SUCCESS'
      })

      // Create Property
      .addCase(createCategoryProperty.pending, (state) => {
        state.form.status = 'LOADING'
      })
      .addCase(createCategoryProperty.rejected, (state) => {
        state.form.status = 'FAILED'
      })
      .addCase(createCategoryProperty.fulfilled, (state) => {
        state.form.status = 'SUCCESS'
      })
  },
})

export const selectCategory = (state: RootState) => state.category.detail
export const selectListCategory = (state: RootState) => state.category.list
export const selectFormProperty = (state: RootState) => state.category.form

export default categorySlice.reducer
