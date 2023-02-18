import useWeb from 'hooks/useWeb'
import { FC, ReactElement } from 'react'
import { NAVBAR_HEIGHT } from 'styles/constant'

interface IContainer {
  children: any
  header?: ReactElement
}

const Container: FC<IContainer> = ({ children, header }) => {
  const { device } = useWeb()
  const HEADER_HEIGHT = header ? 30 : 0
  const SPACE_SIDE = device !== 'mobile' ? 30 : 10
  const SPACE_TOP = device !== 'mobile' ? 10 : 10
  const MOBILE_HEIGHT = header
    ? `calc(100vh - ${180 + NAVBAR_HEIGHT - HEADER_HEIGHT - SPACE_TOP}px + 20px)`
    : `calc(100vh - ${110 + NAVBAR_HEIGHT - HEADER_HEIGHT - SPACE_TOP}px + 20px)`
  const CONTAINER_HEIGHT = header
    ? `calc(100vh - ${190 + NAVBAR_HEIGHT}px + 60px)`
    : `calc(100vh - ${150 + NAVBAR_HEIGHT}px + 60px)`

  return (
    <>
      <div
        style={{
          padding: device !== 'mobile' ? '0 40px' : '0 20px',
          height: HEADER_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {header}
      </div>
      <div
        style={{
          padding: 0,
          margin: header
            ? `${SPACE_TOP}px ${SPACE_SIDE}px 0 ${SPACE_SIDE}px`
            : `0 ${SPACE_SIDE}px 0 ${SPACE_SIDE}px`,
          minHeight: device !== 'mobile' ? CONTAINER_HEIGHT : MOBILE_HEIGHT,
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        {children}
      </div>
    </>
  )
}

export default Container
