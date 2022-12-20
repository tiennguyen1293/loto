import cls from 'classnames'
import { Children } from 'react'

import { ReactComponent as CloseIcon } from '../../assets/close-icon.svg'

import styles from './Popup.module.scss'

export const Popup: React.FunctionComponent<{
  isOpen: boolean
  children: any
  isShowFooter?: boolean
  onClose: () => void
  onConfirm?: () => void
}> = ({ isOpen, children, isShowFooter = true, onClose, onConfirm }) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.popup}>
      <div className={styles.overplay} />
      <div className={styles.popupContainer}>
        <div className={styles.popupWrapper}>
          <div className={styles.popupHeader}>
            <h3 className={styles.popupTitle}>Thông báo</h3>

            <button
              type='button'
              className={styles.popupClose}
              onClick={onClose}
            >
              <CloseIcon />
            </button>
          </div>

          <div className={styles.popupBody}>{children}</div>

          {isShowFooter && (
            <div className={styles.popupFooter}>
              <button
                type='button'
                className={cls(styles.button, styles.okButton)}
                onClick={onConfirm}
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
