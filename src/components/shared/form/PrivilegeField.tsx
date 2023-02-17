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
  returnPrivilege?: (value) => void,
  returnNavigation?: (value) => void,
  isReadOnly?: boolean
}

export const PrivilegeField: FC<IPrivilegeField> = ({ label, preRole, preMenu, role, menu, returnPrivilege, returnNavigation, isReadOnly }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  const [checkSection, setCheckSection] = useState({})
  const [checkNavigationSection, setCheckNavigationSection] = useState({})
  const [privilege, setPrivilege] = useState({ ...preRole, ...role })
  const [navigation, setNavigation] = useState({ ...preMenu, ...menu })
  const [checkAll, setCheckAll] = useState(false)
  const [checkAllNavigation, setCheckAllNavigation] = useState(false)

  // Navigation
  const handleCheckAllNavigation = (event) => {
    const checked = event.target.checked
    let newNavigation = Object.assign({}, navigation)

    Object.keys(preMenu).forEach((route) => {
      Object.keys(preMenu[route]).forEach((action) => {
        newNavigation = {
          ...newNavigation,
          [route]: {
            ...newNavigation[route],
            [action]: checked
          }
        }
      })
    })
    setNavigation(newNavigation)
    if (returnNavigation) {
      return returnNavigation(newNavigation)
    }
  }

  const handleChangeNavigation = (event) => {
    const names = event.target.name.split('.')
    const checked = event.target.checked
    const [menu, navbar] = names

    const newNavigation = Object.assign({}, { ...navigation, [menu]: { ...navigation[menu], [navbar]: checked } })
    
    Object.keys(newNavigation[menu]).find(navbar => !newNavigation[menu][navbar])
      ? setCheckSection({ ...checkSection, [menu]: false }) 
      : setCheckSection({ ...checkSection, [menu]: true })
    setNavigation(newNavigation)
    if (returnNavigation) {
      return returnNavigation(newNavigation)
    }
  }

  const handleChangeAllNavigation = (event) => {
    const names = event.target.name.split('.')
    const checked = event.target.checked
    const [menu] = names
    let newNavigation = Object.assign({}, navigation)

    Object.keys(preMenu[menu]).forEach((action) => {
      newNavigation = {
        ...newNavigation,
        [menu]: {
          ...newNavigation[menu],
          [action]: checked
        }
      }
    })
    setNavigation(newNavigation)
    if (returnNavigation) {
      return returnNavigation(newNavigation)
    }
  }

  useEffect(() => {
    setNavigation({ ...preMenu, ...menu })
  }, [menu, preMenu])

  useEffect(() => {
      // Check Parent if all value is checked
    let checkedAll = {}
    Object.keys(navigation).forEach((menu) => {
      Object.keys(navigation[menu]).find(navbar => !navigation[menu][navbar]) 
        ? checkedAll = { ...checkedAll, [menu]: false }
        : checkedAll = { ...checkedAll, [menu]: true }
    })

    Object.keys(checkedAll).find(navbar => !checkedAll[navbar]) 
        ? setCheckAllNavigation(false)
        : setCheckAllNavigation(true)

    setCheckNavigationSection(checkedAll)
  }, [navigation])
  // End Navigation

  // Privilege
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
    if (returnPrivilege) {
      return returnPrivilege({ privilege: newPrivilege })
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
    if (returnPrivilege) {
      return returnPrivilege({ privilege: newPrivilege })
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
    if (returnPrivilege) {
      return returnPrivilege({ privilege: newPrivilege })
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
   // End Privilege

  return <div style={{ display: 'flex', flexDirection: 'column' }}>
    {/* Navigation */}
    <CustomPrivilege styled={theme} device={device}>
      <span className='label'>{label || language['NAVIGATION']}</span>
      <div className='checkAll-container'>
        <CheckboxField disabled={isReadOnly} label={language['CHECK_ALL']} defaultChecked={checkAllNavigation} onChange={handleCheckAllNavigation} />
      </div>
      {Object.keys(preMenu).map((menu, i) => {
        return <div key={i} className='privilege-container'>
          <CheckboxField disabled={isReadOnly} label={menu} name={menu} defaultChecked={checkNavigationSection[menu] || false} onChange={handleChangeAllNavigation} />
          <div>
            {
              Object.keys(preMenu[menu]).map((navbar, j) => {
                return <CheckboxField disabled={isReadOnly} key={j} label={navbar} name={`${menu}.${navbar}`} defaultChecked={navigation?.[menu]?.[navbar]} onChange={handleChangeNavigation} />
              })
            }
          </div>
        </div>
      })}
    </CustomPrivilege>

    {/* Privilege */}
    <CustomPrivilege styled={theme} device={device}>
      <span className='label'>{label || language['PRIVILEGE']}</span>
      <div className='checkAll-container'>
        <CheckboxField disabled={isReadOnly} label={language['CHECK_ALL']} defaultChecked={checkAll} onChange={handleCheckAll} />
      </div>
      {Object.keys(preRole).map((role, i) => {
        let isChecked = false
        Object.keys(navigation).forEach(nav => {
          if (isChecked) return
          if (navigation[nav].hasOwnProperty(role) && navigation[nav][role]) isChecked = true
        })
        return <div key={i} className='privilege-container' style={{ display: isChecked ? 'block' : 'none' }}>
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
  </div>
}