import { useEffect, useState } from 'react'
import cls from 'classnames'
import reactLogo from './assets/react.svg'
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

console.log('===', [
  generateArrayNumbers(1, 90, 81),
  generateArrayNumbers(1, 9, randomIntFromInterval(4, 6)),
  generateArrayNumbers(10, 19, randomIntFromInterval(4, 6)),
  generateArrayNumbers(20, 29, randomIntFromInterval(4, 6)),
  generateArrayNumbers(30, 39, randomIntFromInterval(4, 6)),
  generateArrayNumbers(40, 49, randomIntFromInterval(4, 6)),
  generateArrayNumbers(50, 59, randomIntFromInterval(4, 6)),
  generateArrayNumbers(60, 69, randomIntFromInterval(4, 6)),
  generateArrayNumbers(70, 79, randomIntFromInterval(4, 6)),
  generateArrayNumbers(80, 90, randomIntFromInterval(4, 6)),
])

function App() {
  return (
    <div className={styles.app}>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src='/vite.svg' className={styles.logo} alt='Vite logo' />
        </a>
        <a href='https://reactjs.org' target='_blank'>
          <img
            src={reactLogo}
            className={cls(styles.logo, styles.react)}
            alt='React logo'
          />
        </a>
      </div>
      <h1>Vite + React</h1>

      <div className={styles.card}>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={styles['read-the-docs']}>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
