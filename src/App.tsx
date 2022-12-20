import { useEffect, useState } from 'react'
import cls from 'classnames'

import { ReactComponent as ReactLogo } from './assets/react.svg'

import styles from './App.module.scss'

const MIN_NUMBER = 1
const MAX_NUMBER = 90

const COLUMNS_DEFAULT = 5
const ROWS_DEFAULT = 9

function comparator(a: any, b: any) {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

function randomIntFromInterval(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}

function generateNumber(min: number, max: number, times: number) {
  let number = 0
  let i = 0

  while (number !== 0 || i >= times) {
    number = randomIntFromInterval(min, max)
  }

  return number
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

  return array.sort(comparator)
}

function App() {
  const result = [
    generateArrayNumbers(1, 9, 6),
    generateArrayNumbers(10, 19, 6),
    generateArrayNumbers(20, 29, 6),
    generateArrayNumbers(30, 39, 6),
    generateArrayNumbers(40, 49, 6),
    generateArrayNumbers(50, 59, 6),
    generateArrayNumbers(60, 69, 6),
    generateArrayNumbers(70, 79, 6),
    generateArrayNumbers(80, 90, 6),
  ]

  const slots = Array(9)
    .fill(1)
    .map((_, index) => result[index])

  console.log('=== slots', slots)

  return (
    <main className={cls(styles.wrapper, styles.light)}>
      <header className={styles.header}>Header</header>

      {false && (
        <div>
          <div>
            <a href='https://vitejs.dev' target='_blank'>
              <img src='/lucky.jpeg' className={styles.logo} alt='Vite logo' />
            </a>
          </div>

          <button type='button' className={styles.button}>
            Chơi
          </button>
        </div>
      )}

      <div className={styles.main}>
        {slots.map((column, colIndex) => {
          const arrayRandomIndex = generateArrayNumbers(0, 5, 4)
          console.log('=== arrayRandomIndex', arrayRandomIndex)

          return (
            <div
              key={colIndex}
              data-index={`column-${colIndex}`}
              className={cls({
                [styles.column]: true,
              })}
            >
              {column.map((number, numberIndex) => {
                return (
                  <div
                    key={numberIndex}
                    data-index={`number-${numberIndex}`}
                    className={cls({
                      [styles.number]: true,
                    })}
                  >
                    <div className={styles.text}>
                      {arrayRandomIndex.includes(numberIndex) ? 0 : number}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <footer className={styles.footer}>Power by tiennm</footer>
    </main>
  )
}

export default App
