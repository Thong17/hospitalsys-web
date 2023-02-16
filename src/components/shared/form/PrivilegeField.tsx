import { CustomPrivilege } from "styles"
import useWeb from 'hooks/useWeb'
import useTheme from 'hooks/useTheme'
import { FC, useEffect, useState } from "react"
import { CheckboxField } from "./CheckField"
import useLanguage from "hooks/useLanguage"

interface IPrivilegeField {
  label?: string,
  preRole: Object,
  preMenu: Object,
  role: Object,
  menu: Object,
  returnValue?: (value) => void,
  isReadOnly?: boolean
}

export const PrivilegeField: FC<IPrivilegeField> = ({ label, preRole, preMenu, role, menu, returnValue, isReadOnly }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  const [checkSection, setCheckSection] = useState({})
  const [privilege, setPrivilege] = useState({ ...preRole, ...role })
  const [checkAll, setCheckAll] = useState(false)

  const handleCheckAll = (event) => {
    const checked = event.target.checked
    let newPrivilege = Object.assign({}, privilege)

    Object.keys(preRole).forEach((route) => {
      Object.keys(preRole[route]).forEach((action) => {
        newPrivilege = {
          ...newPrivilege,
          [route]: {
            ...newPrivilege[route],
            [action]: checked
          }
        }
      })
    })
    setPrivilege(newPrivilege)
    if (returnValue) {
      return returnValue(newPrivilege)
    }
  }

  const handleChangePrivilege = (event) => {
    const names = event.target.name.split('.')
    const checked = event.target.checked
    const [route, action] = names

    const newPrivilege = Object.assign({}, { ...privilege, [route]: { ...privilege[route], [action]: checked } })
    
    Object.keys(newPrivilege[route]).find(action => !newPrivilege[route][action]) 
      ? setCheckSection({ ...checkSection, [route]: false }) 
      : setCheckSection({ ...checkSection, [route]: true })
    setPrivilege(newPrivilege)
    if (returnValue) {
      return returnValue(newPrivilege)
    }
  }

  const handleChangeAllPrivilege = (event) => {
    const names = event.target.name.split('.')
    const checked = event.target.checked
    const [route] = names
    let newPrivilege = Object.assign({}, privilege)

    Object.keys(preRole[route]).forEach((action) => {
      newPrivilege = {
        ...newPrivilege,
        [route]: {
          ...newPrivilege[route],
          [action]: checked
        }
      }
    })
    setPrivilege(newPrivilege)
    if (returnValue) {
      return returnValue(newPrivilege)
    }
  }

  useEffect(() => {
    setPrivilege({ ...preRole, ...role })
  }, [role, preRole])
  

  useEffect(() => {
      // Check Parent if all value is checked
    let checkedAll = {}
    Object.keys(privilege).forEach((route) => {
      Object.keys(privilege[route]).find(action => !privilege[route][action]) 
        ? checkedAll = { ...checkedAll, [route]: false }
        : checkedAll = { ...checkedAll, [route]: true }
    })

    Object.keys(checkedAll).find(action => !checkedAll[action]) 
        ? setCheckAll(false)
        : setCheckAll(true)

    setCheckSection(checkedAll)
  }, [privilege])

  return <CustomPrivilege styled={theme} device={device}>
    <span className='label'>{label || language['PRIVILEGE']}</span>
    <div className='checkAll-container'>
      <CheckboxField disabled={isReadOnly} label='Super Admin' defaultChecked={checkAll} onChange={handleCheckAll} />
    </div>
    {Object.keys(preRole).map((role, i) => {
      return <div key={i} className='privilege-container'>
        <CheckboxField disabled={isReadOnly} label={role} name={role} defaultChecked={checkSection[role] || false} onChange={handleChangeAllPrivilege} />
        <div>
          {
            Object.keys(preRole[role]).map((action, j) => {
              return <CheckboxField disabled={isReadOnly} key={j} label={action} name={`${role}.${action}`} defaultChecked={privilege?.[role]?.[action]} onChange={handleChangePrivilege} />
            })
          }
        </div>
      </div>
    })}
  </CustomPrivilege>
}