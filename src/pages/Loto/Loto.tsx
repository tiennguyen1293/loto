import { useEffect, useState } from 'react'
import cls from 'classnames'

import { ReactComponent as ReloadIcon } from '../../assets/reload-icon.svg'
import { ReactComponent as SettingsIcon } from '../../assets/settings-icon.svg'
import { ReactComponent as QRCode } from '../../assets/qr-code.svg'

import { ROLE_TYPES, SETTING_OPTION, LANGUAGES } from '../../constants'
import { generateLotoTicket } from '../../utils'
import { getVoiceList } from '../../utils/voices'
import { Popup } from '../../components'

import { Ticket, Caller } from './components'

import styles from './Loto.module.scss'

const THEME = 'THEME'
const LANGUAGE = 'LANGUAGE'
const CALL_COUNT_DOWN = '8'

export const Loto = () => {
  const [lotoTicketFinal, setLotoTicketFinal] = useState<number[][]>([])
  const [numbersSelected, setNumbersSelected] = useState<number[]>([])
  const [isShowReloadPopup, setIsShowReloadPopup] = useState(false)
  const [isShowSettingsPopup, setIsShowSettingsPopup] = useState(false)
  const [isShowBingo, setIsShowBingo] = useState(false)
  const [isShowRolePopup, setIsShowRolePopup] = useState(true)
  const [theme, setTheme] = useState('color-1')
  const [roleType, setRoleType] = useState('')
  const [settingOptionSelected, setSettingOptionSelected] = useState('')
  const [isReload, setIsReload] = useState(false)
  const [language, setLanguage] = useState(LANGUAGES.ENGLISH)
  const [termCallCountDownTimes, setTermCallCountDownTimes] =
    useState(CALL_COUNT_DOWN)
  const [callCountDownTimes, setCallCountDownTimes] = useState(CALL_COUNT_DOWN)
  const isCaller = roleType === ROLE_TYPES.CALLER

  let SETTING_OPTIONS = [
    {
      id: SETTING_OPTION.SETTING_THEME,
      name: 'Themes',
    },
  ]

  if (isCaller) {
    SETTING_OPTIONS = [
      ...SETTING_OPTIONS,
      {
        id: SETTING_OPTION.SETTING_CALLER,
        name: 'Caller Settings',
      },
    ]
  }

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

  const handleCloseSettings = () => {
    const themeDefault = localStorage.getItem(THEME)

    if (themeDefault) {
      setTheme(themeDefault)
    }

    setIsShowSettingsPopup(false)
    setSettingOptionSelected('')
  }

  const handleConfirmSettings = () => {
    const themeDefault = localStorage.getItem(THEME)
    const languageDefault = localStorage.getItem(LANGUAGE)

    theme !== themeDefault && localStorage.setItem(THEME, theme)
    language !== languageDefault && localStorage.setItem(LANGUAGE, language)

    termCallCountDownTimes !== CALL_COUNT_DOWN &&
      setCallCountDownTimes(termCallCountDownTimes)

    setIsShowSettingsPopup(false)
    setSettingOptionSelected('')
  }

  const handleSelectRole = (roleType: string) => {
    setRoleType(roleType)
    setIsShowRolePopup(false)
  }

  const handleSelectLanguage = (language: string) => {
    setLanguage(language)
    localStorage.setItem(LANGUAGE, language)
  }

  useEffect(() => {
    const themeDefault = localStorage.getItem(THEME)
    const languageDefault = localStorage.getItem(LANGUAGE)

    handleReGenerateLotoTicket()

    if (themeDefault) {
      setTheme(themeDefault)
    } else {
      localStorage.setItem(THEME, 'color-1')
    }

    if (languageDefault) {
      setLanguage(languageDefault)
    } else {
      localStorage.setItem(LANGUAGE, LANGUAGES.ENGLISH)
    }

    getVoiceList()
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
            onClick={() => setIsShowSettingsPopup(true)}
          >
            <SettingsIcon />
          </button>
        </div>
      </header>

      <div className={styles.body}>
        {isCaller && (
          <Caller
            language={language}
            isReload={isReload}
            setIsReload={setIsReload}
            handleSelectNumber={handleSelectNumber}
            callCountDownTimes={Number(callCountDownTimes)}
          />
        )}

        <Ticket
          isCaller={isCaller}
          numbers={lotoTicketFinal}
          numbersSelected={numbersSelected}
          theme={theme}
          onSelect={handleSelectNumber}
        />
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

      {isShowSettingsPopup && (
        <Popup
          isOpen={isShowSettingsPopup}
          title={'Settings'}
          onClose={handleCloseSettings}
          onConfirm={handleConfirmSettings}
        >
          <div className={styles.wrapperSettings}>
            {!settingOptionSelected &&
              SETTING_OPTIONS.map((option) => {
                return (
                  <button
                    key={option.id}
                    type='button'
                    className={styles.button}
                    onClick={() => setSettingOptionSelected(option.id)}
                  >
                    {option.name}
                  </button>
                )
              })}

            {settingOptionSelected === SETTING_OPTION.SETTING_THEME && (
              <>
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
              </>
            )}

            {settingOptionSelected === SETTING_OPTION.SETTING_CALLER && (
              <>
                <div className={styles.inputWrapper}>
                  <label htmlFor='countdown-input' className={styles.label}>
                    Countdown times
                  </label>
                  <input
                    id='countdown-input'
                    type='number'
                    className={cls(styles.input)}
                    value={termCallCountDownTimes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTermCallCountDownTimes(e.target.value)
                    }
                  />
                </div>

                <div className={styles.languages}>
                  {[
                    { value: LANGUAGES.VIETNAM, label: 'Vietnamese' },
                    { value: LANGUAGES.ENGLISH, label: 'English' },
                  ].map((voice) => (
                    <button
                      key={voice.value}
                      type='button'
                      className={cls({
                        [styles.button]: true,
                        [styles.selected]: language === voice.value,
                      })}
                      onClick={() => handleSelectLanguage(voice.value)}
                    >
                      {voice.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </Popup>
      )}
    </>
  )
}
