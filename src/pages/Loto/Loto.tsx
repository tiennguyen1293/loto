import { useEffect, useState } from 'react'
import cls from 'classnames'

import { ReactComponent as ReloadIcon } from '../../assets/reload-icon.svg'
import { ReactComponent as SettingsIcon } from '../../assets/settings-icon.svg'
import { ReactComponent as QRCode } from '../../assets/qr-code.svg'

import { generateLotoTicket } from '../../utils'
import { Popup } from '../../components'

import { Ticket, Caller } from './components'

import styles from './Loto.module.scss'

const THEME = 'THEME'

const ROLE_TYPES = {
  PLAYER: 'PLAYER',
  CALLER: 'CALLER',
}

export const Loto = () => {
  const [lotoTicketFinal, setLotoTicketFinal] = useState<number[][]>([])
  const [numbersSelected, setNumbersSelected] = useState<number[]>([])
  const [isShowReloadPopup, setIsShowReloadPopup] = useState(false)
  const [isShowCustomColorPopup, setIsShowCustomColorPopup] = useState(false)
  const [isShowBingo, setIsShowBingo] = useState(false)
  const [isShowRolePopup, setIsShowRolePopup] = useState(true)
  const [theme, setTheme] = useState('color-1')
  const [roleType, setRoleType] = useState('')
  const [isReload, setIsReload] = useState(false)
  const isCaller = roleType === ROLE_TYPES.CALLER

  const handleSelectNumber = (number: number) => {
    const isExisting = numbersSelected.includes(number)
    let result = [...numbersSelected]

    if (isExisting) {
      result = numbersSelected.filter(
        (numberExisting) => numberExisting !== number,
      )
    } else {
      result = [...numbersSelected, number]
    }

    const isCheckBingo = lotoTicketFinal
      .map((row) =>
        row
          .filter((number) => !!number)
          .map((number) => result.includes(number)),
      )
      .some((row) => row.every(Boolean))

    setIsShowBingo(isCheckBingo)
    setNumbersSelected(result)
  }

  const handleReGenerateLotoTicket = (isCreateNew: boolean = true) => {
    const newTicket = generateLotoTicket({ rows: 9, columns: 9 })

    if (isCreateNew) {
      setLotoTicketFinal(newTicket)
    }

    setNumbersSelected([])
    setIsShowReloadPopup(false)
    setIsShowBingo(false)

    setIsReload(isCaller)
  }

  const handleCloseSelectTheme = () => {
    const themeDefault = localStorage.getItem(THEME)

    if (themeDefault) {
      setTheme(themeDefault)
    }

    setIsShowCustomColorPopup(false)
  }

  const handleSelectTheme = () => {
    if (theme) {
      localStorage.setItem(THEME, theme)
    } else {
      handleCloseSelectTheme()
    }

    setIsShowCustomColorPopup(false)
  }

  const handleSelectRole = (roleType: string) => {
    setRoleType(roleType)
    setIsShowRolePopup(false)
  }

  useEffect(() => {
    const themeDefault = localStorage.getItem(THEME)

    handleReGenerateLotoTicket()

    if (themeDefault) {
      localStorage.setItem(THEME, themeDefault)

      setTheme(themeDefault)
    } else {
      localStorage.setItem(THEME, 'color-1')
    }
  }, [])

  return (
    <>
      <header className={styles.header}>
        <img src='/images/lucky.jpeg' className={styles.logo} alt='logo' />

        <div>
          <button
            type='button'
            className={cls(styles.button, styles.reloadButton)}
            onClick={() => setIsShowReloadPopup(true)}
          >
            <ReloadIcon />
          </button>
          <button
            type='button'
            className={cls(styles.button, styles.settingsButton)}
            onClick={() => setIsShowCustomColorPopup(true)}
          >
            <SettingsIcon />
          </button>
        </div>
      </header>

      <div className={styles.body}>
        <Ticket
          isCaller={isCaller}
          numbers={lotoTicketFinal}
          numbersSelected={numbersSelected}
          theme={theme}
          onSelect={handleSelectNumber}
        />

        {isCaller && <Caller isReload={isReload} setIsReload={setIsReload} />}
      </div>

      <footer className={styles.footer}>
        <div className={styles.banner} />
        <span>Power by tiennm</span>

        <div className={styles.qrCode}>
          <QRCode />
        </div>
      </footer>

      {isShowRolePopup && (
        <Popup
          title={'Role Type?'}
          isOpen={isShowRolePopup}
          onClose={() => setIsShowRolePopup(false)}
          isShowFooter={false}
        >
          <div className={styles.popupCustom}>
            <button
              type='button'
              className={cls(styles.button, styles.roleButton)}
              onClick={() => handleSelectRole(ROLE_TYPES.PLAYER)}
            >
              Player
            </button>
            <button
              type='button'
              className={cls(styles.button, styles.roleButton)}
              onClick={() => handleSelectRole(ROLE_TYPES.CALLER)}
            >
              Caller
            </button>
          </div>
        </Popup>
      )}

      {isShowBingo && (
        <Popup
          title={'🎊 Congratulations !!!'}
          isOpen={isShowBingo}
          onClose={() => setIsShowReloadPopup(false)}
          isShowFooter={false}
        >
          <div className={styles.popupCustom}>
            <div className={styles.popupContent}>
              <span>You won 🎉</span>
            </div>

            <div className={styles.buttonsGroup}>
              <button
                type='button'
                className={cls(styles.button, styles.okButton)}
                onClick={() => setIsShowBingo(false)}
              >
                Skip
              </button>
              <button
                type='button'
                className={cls(styles.button, styles.okButton)}
                onClick={() => handleReGenerateLotoTicket()}
              >
                Create
              </button>
            </div>
          </div>
        </Popup>
      )}

      {isShowReloadPopup && (
        <Popup
          isOpen={isShowReloadPopup}
          onClose={() => setIsShowReloadPopup(false)}
          isShowFooter={false}
        >
          <div className={styles.popupCustom}>
            <div className={styles.popupContent}>
              <span>Create a new ticket?</span>
            </div>

            <div className={styles.buttonsGroup}>
              <button
                type='button'
                className={cls(styles.button, styles.okButton)}
                onClick={() => handleReGenerateLotoTicket(false)}
              >
                Keep & Clean
              </button>
              <button
                type='button'
                className={cls(styles.button, styles.okButton)}
                onClick={() => handleReGenerateLotoTicket()}
              >
                Create
              </button>
            </div>
          </div>
        </Popup>
      )}

      {isShowCustomColorPopup && (
        <Popup
          isOpen={isShowCustomColorPopup}
          title={'Settings'}
          onClose={handleCloseSelectTheme}
          onConfirm={handleSelectTheme}
        >
          <div className={styles.wrapperColors}>
            {[1, 2, 3, 4, 5, 6].map((colorNumber) => {
              const themeNumber = `color-${colorNumber}`

              return (
                <div
                  key={colorNumber}
                  className={cls(
                    styles.color,
                    styles[themeNumber],
                    theme === themeNumber && styles.colorSelected,
                  )}
                  onClick={() => setTheme(themeNumber)}
                />
              )
            })}
          </div>
        </Popup>
      )}
    </>
  )
}
