import { RouteObject } from 'react-router'
import AuthGuard from '../auth/AuthGuard'
import { Login } from 'modules/auth/Login'
import { Register } from 'modules/auth/Register'
import {
  Admin,
  Roles,
  CreateRole,
  UpdateRole,
  DetailRole,
  Users,
  CreateUser,
  UpdateUser,
  DetailUser,
} from 'modules/admin'
import {
  Organize,
  Brands,
  Categories,
  CreateCategory,
  DetailCategory,
  UpdateCategory,
  CreateBrand,
  DetailBrand,
  UpdateBrand,
  Products,
  CreateProduct,
  DetailProduct,
  UpdateProduct,
  ProductSetup,
  Store,
  UpdateStore,
  LayoutForm,
} from 'modules/organize'
import { Home } from 'modules/home'
import Config from 'modules/config/Config'
import NotFound from 'components/shared/NotFound'
import { UserProfile } from 'modules/auth/UserProfile'
import { UserChangePassword } from 'modules/auth/UserChangePassword'
import { HintButton } from 'components/shared/HintButton'
import { PaymentStore } from 'modules/organize/store/Payment'
import { UserInfo } from 'modules/admin/user/UserInfo'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/user/:id',
    element: <UserProfile />,
  },
  {
    path: '/change-password/:id',
    element: <UserChangePassword />,
  },
  {
    path: '/admin',
    element: (
      <AuthGuard role={{ route: 'menu', action: 'admin' }}>
        <Admin />
      </AuthGuard>
    ),
    children: [
      {
        path: 'user',
        element: (
          <AuthGuard role={{ route: 'user', action: 'list' }}>
            <Users />
            <HintButton playlistId='PLHX_VLeC9D-7V5WOxVhHQ6xDFSqHNh2OC' />
          </AuthGuard>
        ),
      },
      {
        path: 'user/create',
        element: (
          <AuthGuard role={{ route: 'user', action: 'create' }}>
            <CreateUser />
          </AuthGuard>
        ),
      },
      {
        path: 'user/update/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'update' }}>
            <UpdateUser />
          </AuthGuard>
        ),
      },
      {
        path: 'user/detail/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'detail' }}>
            <DetailUser />
          </AuthGuard>
        ),
      },
      {
        path: 'user/:action/info/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'detail' }}>
            <UserInfo />
          </AuthGuard>
        ),
      },
      {
        path: 'role',
        element: (
          <AuthGuard role={{ route: 'role', action: 'list' }}>
            <Roles />
            <HintButton playlistId='PLHX_VLeC9D-7V5WOxVhHQ6xDFSqHNh2OC' />
          </AuthGuard>
        ),
      },
      {
        path: 'role/create',
        element: (
          <AuthGuard role={{ route: 'role', action: 'create' }}>
            <CreateRole />
          </AuthGuard>
        ),
      },
      {
        path: 'role/update/:id',
        element: (
          <AuthGuard role={{ route: 'role', action: 'update' }}>
            <UpdateRole />
          </AuthGuard>
        ),
      },
      {
        path: 'role/detail/:id',
        element: (
          <AuthGuard role={{ route: 'role', action: 'detail' }}>
            <DetailRole />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/organize',
    element: (
      <AuthGuard role={{ route: 'menu', action: 'organize' }}>
        <Organize />
      </AuthGuard>
    ),
    children: [
      // Category
      {
        path: 'category',
        element: (
          <AuthGuard role={{ route: 'category', action: 'list' }}>
            <Categories />
            <HintButton playlistId='PLHX_VLeC9D-6Ikbr2cQThon9FadJEz6sP' />
          </AuthGuard>
        ),
      },
      {
        path: 'category/create',
        element: (
          <AuthGuard role={{ route: 'category', action: 'create' }}>
            <CreateCategory />
          </AuthGuard>
        ),
      },
      {
        path: 'category/update/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'update' }}>
            <UpdateCategory />
          </AuthGuard>
        ),
      },
      {
        path: 'category/detail/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'detail' }}>
            <DetailCategory />
          </AuthGuard>
        ),
      },

      // Brand
      {
        path: 'brand',
        element: (
          <AuthGuard role={{ route: 'brand', action: 'list' }}>
            <Brands />
            <HintButton playlistId='PLHX_VLeC9D-6Ikbr2cQThon9FadJEz6sP' />
          </AuthGuard>
        ),
      },
      {
        path: 'brand/create',
        element: (
          <AuthGuard role={{ route: 'category', action: 'create' }}>
            <CreateBrand />
          </AuthGuard>
        ),
      },
      {
        path: 'brand/update/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'update' }}>
            <UpdateBrand />
          </AuthGuard>
        ),
      },
      {
        path: 'brand/detail/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'detail' }}>
            <DetailBrand />
          </AuthGuard>
        ),
      },

      // Product
      {
        path: 'product',
        element: (
          <AuthGuard role={{ route: 'product', action: 'list' }}>
            <Products />
            <HintButton playlistId='PLHX_VLeC9D-78msvumaCBdk2x668hpA0x' />
          </AuthGuard>
        ),
      },
      {
        path: 'product/create',
        element: (
          <AuthGuard role={{ route: 'category', action: 'create' }}>
            <CreateProduct />
            <HintButton playlistId='PLHX_VLeC9D-78msvumaCBdk2x668hpA0x' />
          </AuthGuard>
        ),
      },
      {
        path: 'product/update/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'update' }}>
            <UpdateProduct />
            <HintButton playlistId='PLHX_VLeC9D-78msvumaCBdk2x668hpA0x' />
          </AuthGuard>
        ),
      },
      {
        path: 'product/detail/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'detail' }}>
            <DetailProduct />
          </AuthGuard>
        ),
      },
      {
        path: 'product/:action/property/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'detail' }}>
            <ProductSetup />
            <HintButton playlistId='PLHX_VLeC9D-78msvumaCBdk2x668hpA0x' />
          </AuthGuard>
        ),
      },

      // Store
      {
        path: 'store',
        element: <>
          <Store />
          <HintButton playlistId='PLHX_VLeC9D-7KeYZ8xcW3cUdTm_3xcnhH' />
        </>,
      },
      {
        path: 'store/update/:id',
        element: (
          <AuthGuard role={{ route: 'store', action: 'update' }}>
            <UpdateStore />
            <HintButton playlistId='PLHX_VLeC9D-7KeYZ8xcW3cUdTm_3xcnhH' />
          </AuthGuard>
        ),
      },
      {
        path: 'store/:id/payment',
        element: (
          <AuthGuard role={{ route: 'store', action: 'update' }}>
            <PaymentStore />
            <HintButton playlistId='PLHX_VLeC9D-7KeYZ8xcW3cUdTm_3xcnhH' />
          </AuthGuard>
        ),
      },
      {
        path: 'store/:id/layout',
        element: (
          <AuthGuard role={{ route: 'store', action: 'update' }}>
            <LayoutForm />
            <HintButton playlistId='PLHX_VLeC9D-7KeYZ8xcW3cUdTm_3xcnhH' />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/config',
    element: <Config />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

export default routes
