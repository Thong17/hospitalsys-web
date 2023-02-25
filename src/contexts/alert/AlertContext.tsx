import { createContext, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { DetailField } from 'components/shared/form'

export interface IAlertProps {
  title?: string
  description?: string
  reason?: boolean
  variant?: 'info' | 'warning' | 'error'
}

export const AlertContext = createContext<(options: IAlertProps) => Promise<void>>(Promise.reject)

const AlertProvider = ({ children }) => {
  const [dialog, setDialog] = useState<IAlertProps & { open: boolean }>({ open: false })
  const reasonRef = useRef(document.createElement('textarea'))

  const awaitingPromiseRef = useRef<{
    resolve: (data) => void
    reject: () => void
  }>()

  const closeDialog = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject()
    }
    setDialog({ ...dialog, open: false })
  }

  const confirmDialog = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve({ reason: reasonRef.current?.value })
    }
    setDialog({ ...dialog, open: false })
  }

  const confirm = (props: IAlertProps) => {
    setDialog({ ...props, open: true })

    return new Promise<void>((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject }
    })
  }

  return (
    <AlertContext.Provider value={confirm}>
      {children}
      <Dialog
        open={dialog.open}
        onClose={closeDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{dialog?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {dialog?.description}
          </DialogContentText>
          {dialog?.reason && <div>
            <DetailField
              ref={reasonRef}
              type='text'
              placeholder='Reason'
              style={{ height: 70, minWidth: '370px', color: '#111', borderColor: '#00000022' }}
            />
          </div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            onClick={confirmDialog}
            variant='contained'
            color={dialog?.variant || 'info'}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </AlertContext.Provider>
  )
}

export default AlertProvider
