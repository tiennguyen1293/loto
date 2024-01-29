import React from 'react'
import cls from 'classnames'

import styles from './Ticket.module.scss'

export const Ticket: React.FunctionComponent<{
  isCaller?: boolean
  numbers: number[][]
  numbersSelected: number[]
  theme: string
  onSelect: (number: number) => void
}> = ({ isCaller, numbers, numbersSelected, theme, onSelect }) => {
  return (
    <div
      className={cls({
        [styles.ticket]: true,
        [styles.haveCaller]: isCaller,
        [styles[theme]]:true
      })}
    >
      {numbers.map((row: number[], rowIndex: number) => (
        <div
          key={rowIndex}
          data-index={`row-${rowIndex}`}
          className={cls({
            [styles.row]: true,
          })}
        >
          {row.map((number, numberIndex) => (
            <div
              key={numberIndex}
              data-index={`number-${numberIndex}`}
              className={cls({
                [styles.number]: true,
                [styles[theme]]: true,
                [styles.empty]: !number,
                [styles.selected]: numbersSelected.includes(number),
              })}
              onClick={() => !!number && onSelect(number)}
            >
              <span className={styles.text}>{number ? number : ' '}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
