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

function generateColumns(length: number, arraysExisting: number[][]) {
  const array: number[] = []

  while (array.length < length) {
    const randomNumber = randomIntFromInterval(MIN_NUMBER, MAX_NUMBER)
    const isExisting = [array, ...arraysExisting].some((array) =>
      array.some((number: number) => number === randomNumber),
    )

    if (!isExisting) {
      array.push(randomNumber)
    }
  }

  return array.sort(comparator)
}

function generateLotoTicket(rows: number, columns: number) {
  let arrays = []

  for (let i = 0; i < rows; i++) {
    const array: number[] = generateColumns(columns, arrays)

    arrays.push(array)
  }

  return arrays
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
  const numberList = generateArrayNumbers(1, 90, 81)
  const result = [
    generateArrayNumbers(1, 9, randomIntFromInterval(4, 6)),
    generateArrayNumbers(10, 19, randomIntFromInterval(4, 6)),
    generateArrayNumbers(20, 29, randomIntFromInterval(4, 6)),
    generateArrayNumbers(30, 39, randomIntFromInterval(4, 6)),
    generateArrayNumbers(40, 49, randomIntFromInterval(4, 6)),
    generateArrayNumbers(50, 59, randomIntFromInterval(4, 6)),
    generateArrayNumbers(60, 69, randomIntFromInterval(4, 6)),
    generateArrayNumbers(70, 79, randomIntFromInterval(4, 6)),
    generateArrayNumbers(80, 90, randomIntFromInterval(4, 6)),
  ]
  const slots = Array(9)
    .fill(Array(9).fill(0))
    .map((array, rowIndex) => {
      const row = result[rowIndex]

      return array.map((number: number, index: number) => {
        return row[index] ? row[index] : number
      })
    })

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
        {numberList.map((number) => (
          <div
            key={number}
            className={cls({
              [styles.number]: true,
              // [styles.number10]: number > 0 && number < 10,
              // [styles.number20]: number > 9 && number < 20,
              // [styles.number30]: number > 19 && number < 30,
              // [styles.number40]: number > 29 && number < 40,
              // [styles.number50]: number > 39 && number < 50,
              // [styles.number60]: number > 49 && number < 60,
              // [styles.number70]: number > 59 && number < 70,
              // [styles.number80]: number > 69 && number < 80,
              // [styles.number90]: number > 79 && number <= 90,
            })}
          >
            {number}
          </div>
        ))}
      </div>

      <footer className={styles.footer}>Power by tiennm</footer>
    </main>
  )
}

export default App
