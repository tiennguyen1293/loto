import { useEffect, useState } from 'react'
import cls from 'classnames'

import { generateArrayNumbers } from '../../../../utils'
import { useCountDown } from '../../../../hooks'

import styles from './Caller.module.scss'

export const Caller: React.FunctionComponent<{
  isReload: boolean
  callCountDownTimes: number
  setIsReload: (isBoolean: boolean) => void
}> = ({ isReload, callCountDownTimes, setIsReload }) => {
  const [numbersToCall, setNumbersToCall] = useState<number[]>([])
  const [numberCalled, setNumberCalled] = useState<number[]>([])
  const [isStartedCall, setIsStartedCall] = useState(false)
  const { timer, startTimer, stopTimer } = useCountDown({})

  const handlePauseCall = () => {
    setIsStartedCall(false)
  }

  const handleCallNewNumber = () => {
    const numbersToCallUpdated = [...numbersToCall]
    const number = numbersToCallUpdated.shift()

    if (!isStartedCall) {
      startTimer(callCountDownTimes)
    }

    setIsStartedCall(true)

    if (isStartedCall && number) {
      setNumberCalled([...numberCalled, number])
      setNumbersToCall(numbersToCallUpdated)
    }
  }

  useEffect(() => {
    setNumbersToCall(generateArrayNumbers(1, 90, 90))

    return () => {
      stopTimer()
    }
  }, [])

  useEffect(() => {
    if (isReload) {
      stopTimer()
      setIsStartedCall(false)
      setNumbersToCall(generateArrayNumbers(1, 90, 90))
      setNumberCalled([])
      setIsReload(false)
    }
  }, [isReload])

  useEffect(() => {
    if (!isStartedCall) {
      return
    }

    if (timer === 0) {
      startTimer(callCountDownTimes)
    }

    if (timer === callCountDownTimes) {
      handleCallNewNumber()
    }
  }, [isStartedCall, callCountDownTimes, timer])

  return (
    <div className={styles.caller}>
      <div className={styles.callerHeader}>
        <h3 className={styles.callerTitle}>Random Numbers:</h3>

        <button
          type='button'
          className={styles.button}
          onClick={isStartedCall ? handlePauseCall : handleCallNewNumber}
        >
          {isStartedCall ? timer + 's' : 'Call'}
        </button>
      </div>
      <div className={styles.callerNumbers}>
        {numberCalled.length ? (
          numberCalled.map((number) => (
            <div
              key={number}
              className={cls({
                [styles.callerNumber]: true,
                [styles.justCalled]:
                  number === numberCalled[numberCalled.length - 1],
              })}
            >
              {number}
            </div>
          ))
        ) : (
          <div>{'Please click on "Call" button to generate a number'}</div>
        )}
      </div>
    </div>
  )
}
