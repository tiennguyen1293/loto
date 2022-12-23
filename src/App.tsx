import { useEffect, useState } from 'react'
import cls from 'classnames'

import { ReactComponent as ReloadIcon } from './assets/reload-icon.svg'
import { ReactComponent as SettingsIcon } from './assets/settings-icon.svg'

import { Popup } from './components'

import styles from './App.module.scss'

const LOTO_TICKET = 'LOTO_TICKET'
const NUMBER_SELECTED = 'NUMBER_SELECTED'
const THEME = 'THEME'

const COLUMN_LENGTH = 9
const ROW_LENGTH = 9

function comparator(a: any, b: any) {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

function randomIntFromInterval(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}

function generateArrayNumbers(min: number, max: number, length: number) {
  let array = []

  while (array.length < length) {
    const randomNumber = randomIntFromInterval(min, max)
    const isExisting = array.some((number: number) => number === randomNumber)

    if (!isExisting) {
      array.push(randomNumber)
    }
  }

  return array
}

function transpose(matrix: number[][]) {
  let [row] = matrix

  return row.map((_, column) => matrix.map((row) => row[column]))
}

function generateLotoTicket({
  rows = ROW_LENGTH,
  columns = COLUMN_LENGTH,
}: {
  rows: number
  columns: number
}) {
  const conditionsGenerate = [
    generateArrayNumbers(1, 9, rows),
    generateArrayNumbers(10, 19, rows),
    generateArrayNumbers(20, 29, rows),
    generateArrayNumbers(30, 39, rows),
    generateArrayNumbers(40, 49, rows),
    generateArrayNumbers(50, 59, rows),
    generateArrayNumbers(60, 69, rows),
    generateArrayNumbers(70, 79, rows),
    generateArrayNumbers(80, 90, rows),
  ]

  const generateNumbers = Array(columns)
    .fill(1)
    .map((_, index) => conditionsGenerate[index])

  const transposeColumnToRow = transpose(generateNumbers)

  return transposeColumnToRow.map((row) => {
    const randomHidden = generateArrayNumbers(
      0,
      columns - 1,
      columns === 9 ? 4 : 1,
    )

    return row.map((number, numberIndex) =>
      randomHidden.includes(numberIndex) ? 0 : number,
    )
  })
}

function App() {
  const [lotoTicketFinal, setLotoTicketFinal] = useState<number[][]>([])
  const [numbersSelected, setNumbersSelected] = useState<number[]>([])
  const [isShowPopup, setIsShowPopup] = useState(false)
  const [isShowCustomColorPopup, setIsShowCustomColorPopup] = useState(false)
  const [theme, setTheme] = useState('color-1')

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

    setNumbersSelected(result)
    localStorage.setItem(NUMBER_SELECTED, JSON.stringify(result))
  }

  const handleReGenerateLotoTicket = (isCreateNew: boolean = true) => {
    const newTicket = generateLotoTicket({ rows: 9, columns: 9 })

    if (isCreateNew) {
      setLotoTicketFinal(newTicket)
      localStorage.setItem(LOTO_TICKET, JSON.stringify(newTicket))
    }

    setNumbersSelected([])
    localStorage.setItem(NUMBER_SELECTED, JSON.stringify([]))

    setIsShowPopup(false)
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

  useEffect(() => {
    const numberSelected = localStorage.getItem(NUMBER_SELECTED)
    const ticketDefault = localStorage.getItem(LOTO_TICKET)
    const themeDefault = localStorage.getItem(THEME)

    if (ticketDefault) {
      setLotoTicketFinal(JSON.parse(ticketDefault))
    } else {
      handleReGenerateLotoTicket()
    }

    if (numberSelected) {
      setNumbersSelected(JSON.parse(numberSelected))
    }

    if (themeDefault) {
      localStorage.setItem(THEME, themeDefault)

      setTheme(themeDefault)
    } else {
      localStorage.setItem(THEME, 'color-1')
    }
  }, [])

  return (
    <main className={cls(styles.wrapper, styles.light)}>
      <header className={styles.header}>
        <img src='/images/lucky.jpeg' className={styles.logo} alt='logo' />

        <div>
          <button
            type='button'
            className={cls(styles.button, styles.reloadButton)}
            onClick={() => setIsShowPopup(true)}
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

      <div className={styles.main}>
        {lotoTicketFinal.map((row, rowIndex) => {
          return (
            <div
              key={rowIndex}
              data-index={`row-${rowIndex}`}
              className={cls({
                [styles.row]: true,
              })}
            >
              {row.map((number, numberIndex) => {
                return (
                  <div
                    key={numberIndex}
                    data-index={`number-${numberIndex}`}
                    className={cls({
                      [styles.number]: true,
                      [styles[theme]]: true,
                      [styles.empty]: !number,
                      [styles.selected]: numbersSelected.includes(number),
                    })}
                    onClick={() => !!number && handleSelectNumber(number)}
                  >
                    <span className={styles.text}>{number ? number : ' '}</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <footer className={styles.footer}>
        <div className={styles.banner} />
        <span>Power by tiennm</span>
      </footer>

      {isShowPopup && (
        <Popup
          isOpen={isShowPopup}
          onClose={() => setIsShowPopup(false)}
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
                  className={cls(styles.color, styles[themeNumber])}
                  onClick={() => setTheme(themeNumber)}
                />
              )
            })}
          </div>
        </Popup>
      )}
    </main>
  )
}

export default App
