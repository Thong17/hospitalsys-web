import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListProduct = createAsyncThunk(
  'product/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/organize/product',
      params: query
    })
    return response?.data
  }
)

export const getDetailProduct = createAsyncThunk(
  'product/detail',
  async ({id, query, fields}: { id: string, query?: URLSearchParams, fields?: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/organize/product/detail/${id}`,
      params: query
    })
    let data = {}
    fields 
      ? fields?.forEach((field) => {
        data[field] = response?.data?.data?.[field]
      })
      : data = response?.data?.data
    
    return { ...response?.data, data }
  }
)

export const getProduct = createAsyncThunk(
  'product/single',
  async ({id, query}: { id: string, query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: `/organize/product/detail/${id}`,
      params: query
    })
    
    return response?.data
  }
)

export const getProductProperties = createAsyncThunk(
  'product/properties',
  async ({id}: { id: string }) => {
    const response = await Axios({
      method: 'GET',
      url: `/organize/product/property/list/${id}`,
    })
    
    return response?.data
  }
)

export const getProductOptions = createAsyncThunk(
  'product/options',
  async ({id}: { id: string }) => {
    const response = await Axios({
      method: 'GET',
      url: `/organize/product/options/${id}`,
    })
    
    return response?.data
  }
)

export const createProductProperty = createAsyncThunk(
  'productProperty/create',
  async ({ body }: { body: any }) => {
    const response = await Axios({
      method: 'POST',
      url: `/organize/product/property/create`,
      body
    })
    
    return response.data
  }
)

export const updateProductProperty = createAsyncThunk(
  'productProperty/update',
  async ({ id, body }: { id: string, body: any }) => {
    const response = await Axios({
      method: 'PUT',
      url: `/organize/product/property/update/${id}`,
      body
    })
    
    return response.data
  }
)

export const removeProductProperty = createAsyncThunk(
  'productProperty/remove',
  async ({ id }: { id: any }) => {
    const response = await Axios({
      method: 'DELETE',
      url: `/organize/product/property/remove/${id}`,
    })
    
    return response.data
  }
)

export const reorderProductProperty = createAsyncThunk(
  'productProperty/reorder',
  async ({ body }: { body: any }) => {
    const response = await Axios({
      method: 'PUT',
      url: `/organize/product/property/reorder`,
      body
    })
    
    return response.data
  }
)

export const createProductOption = createAsyncThunk(
  'productOption/create',
  async ({ body }: { body: any }) => {
    const response = await Axios({
      method: 'POST',
      url: `/organize/product/option/create`,
      body: body
    })
    
    return response.data
  }
)

export const updateProductOption = createAsyncThunk(
  'productOption/update',
  async ({ id, body }: { id: string, body: any }) => {
    const response = await Axios({
      method: 'PUT',
      url: `/organize/product/option/update/${id}`,
      body: body
    })
    
    return response.data
  }
)

export const removeProductOption = createAsyncThunk(
  'productOption/remove',
  async ({ id }: { id: any }) => {
    const response = await Axios({
      method: 'DELETE',
      url: `/organize/product/option/remove/${id}`,
    })
    
    return response.data
  }
)

export const toggleProductOption = createAsyncThunk(
  'productOption/toggle',
  async ({ id }: { id: string }) => {
    const response = await Axios({
      method: 'PUT',
      url: `/organize/product/option/toggle/${id}`,
    })
    
    return response.data
  }
)

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    createOption(state, action) {
      state.single.data.options = [...state.single.data.options, action.payload]
    },
    updateOption(state, action) {
      state.single.data.options = state.single.data.options.map((option) => {
        if (option._id === action.payload._id) {
          option = action.payload
        }
        return option
      })
    },
    deleteOption(state, action) {
      state.single.data.options = state.single.data.options?.filter((property) => property._id !== action.payload)
    },
    createProperty(state, action) {
      state.single.data.properties = [...state.single.data.properties, action.payload]
    },
    updateProperty(state, action) {
      state.single.data.properties = state.single.data.properties.map((property) => {
        if (property._id === action.payload._id) {
          property = action.payload
        }
        return property
      })
    },
    deleteProperty(state, action) {
      state.single.data.properties = state.single.data.properties?.filter((property) => property._id !== action.payload)
    },
    createColor(state, action) {
      state.single.data.colors = [...state.single.data.colors, action.payload]
    },
    updateColor(state, action) {
      state.single.data.colors = state.single.data.colors.map((color) => {
        if (color._id === action.payload._id) {
          color = action.payload
        }
        return color
      })
    },
    deleteColor(state, action) {
      state.single.data.colors = state.single.data.colors?.filter((color) => color._id !== action.payload)
    },
    createCustomerOption(state, action) {
      state.single.data.customers = [...state.single.data.customers, action.payload]
    },
    updateCustomerOption(state, action) {
      state.single.data.customers = state.single.data.customers.map((customer) => {
        if (customer._id === action.payload._id) {
          customer = action.payload
        }
        return customer
      })
    },
    deleteCustomerOption(state, action) {
      state.single.data.customers = state.single.data.customers?.filter((customer) => customer._id !== action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      // List product
      .addCase(getListProduct.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListProduct.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListProduct.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
        state.list.hasMore = action.payload.hasMore
      })

      // Detail product
      .addCase(getDetailProduct.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getDetailProduct.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getDetailProduct.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })

      // Get product
      .addCase(getProduct.pending, (state) => {
        state.single.status = 'LOADING'
      })
      .addCase(getProduct.rejected, (state) => {
        state.single.status = 'FAILED'
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.single.status = 'SUCCESS'
        state.single.data = action.payload.data
      })

      // Get properties
      .addCase(getProductProperties.pending, (state) => {
        state.properties.status = 'LOADING'
      })
      .addCase(getProductProperties.rejected, (state) => {
        state.properties.status = 'FAILED'
      })
      .addCase(getProductProperties.fulfilled, (state, action) => {
        state.properties.status = 'SUCCESS'
        state.properties.data = action.payload.data
      })

      // Get option
      .addCase(getProductOptions.pending, (state) => {
        state.options.status = 'LOADING'
      })
      .addCase(getProductOptions.rejected, (state) => {
        state.options.status = 'FAILED'
      })
      .addCase(getProductOptions.fulfilled, (state, action) => {
        state.options.status = 'SUCCESS'
        state.options.data = action.payload.data
      })

      // Update Property
      .addCase(updateProductProperty.pending, (state) => {
        state.form.status = 'LOADING'
      })
      .addCase(updateProductProperty.rejected, (state) => {
        state.form.status = 'FAILED'
      })
      .addCase(updateProductProperty.fulfilled, (state) => {
        state.form.status = 'SUCCESS'
      })

      // Create Property
      .addCase(createProductProperty.pending, (state) => {
        state.form.status = 'LOADING'
      })
      .addCase(createProductProperty.rejected, (state) => {
        state.form.status = 'FAILED'
      })
      .addCase(createProductProperty.fulfilled, (state) => {
        state.form.status = 'SUCCESS'
      })

      // Create Option
      .addCase(createProductOption.pending, (state) => {
        state.form.status = 'LOADING'
      })
      .addCase(createProductOption.rejected, (state) => {
        state.form.status = 'FAILED'
      })
      .addCase(createProductOption.fulfilled, (state) => {
        state.form.status = 'SUCCESS'
      })

      // Update Option
      .addCase(updateProductOption.pending, (state) => {
        state.form.status = 'LOADING'
      })
      .addCase(updateProductOption.rejected, (state) => {
        state.form.status = 'FAILED'
      })
      .addCase(updateProductOption.fulfilled, (state) => {
        state.form.status = 'SUCCESS'
      })
  },
})

export const selectProduct = (state: RootState) => state.product.single
export const selectListProduct = (state: RootState) => state.product.list
export const selectDetailProduct = (state: RootState) => state.product.detail
export const selectPropertiesProduct = (state: RootState) => state.product.properties
export const selectOptionsProduct = (state: RootState) => state.product.options
export const { updateOption, deleteOption, createOption, updateProperty, deleteProperty, createProperty, updateColor, deleteColor, createColor, createCustomerOption, updateCustomerOption, deleteCustomerOption } = productSlice.actions

export default productSlice.reducer
