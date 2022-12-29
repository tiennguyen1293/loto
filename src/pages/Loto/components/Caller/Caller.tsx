import { useEffect, useState } from 'react'
import cls from 'classnames'

import { generateArrayNumbers } from '../../../../utils'
import { useCountDown } from '../../../../hooks'
import { ReactComponent as PlayIcon } from '../../../../assets/play-icon.svg'

import styles from './Caller.module.scss'

export const Caller: React.FunctionComponent<{
  isReload: boolean
  callCountDownTimes: number
  handleSelectNumber: (number: number) => void
  setIsReload: (isBoolean: boolean) => void
}> = ({ isReload, callCountDownTimes, handleSelectNumber, setIsReload }) => {
  const [numbersToCall, setNumbersToCall] = useState<number[]>([])
  const [numberCalled, setNumberCalled] = useState<number[]>([])
  const [isStartedCall, setIsStartedCall] = useState(false)
  const { timer, startTimer, pauseTimer, stopTimer } = useCountDown({
    start: callCountDownTimes,
  })

  const handlePauseCall = () => {
    pauseTimer()
    setIsStartedCall(false)
  }

  const handleStartCall = () => {
    startTimer(timer)
    setIsStartedCall(true)
  }

  const handleCallNewNumber = () => {
    const numbersToCallUpdated = [...numbersToCall]

    const number = numbersToCallUpdated.shift()

    if (isStartedCall && number) {
      setNumberCalled([number, ...numberCalled])
      handleSelectNumber(number)
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
          onClick={isStartedCall ? handlePauseCall : handleStartCall}
        >
          {isStartedCall ? timer + 's' : <PlayIcon />}
        </button>
      </div>
      <div className={styles.callerNumbers}>
        {numberCalled.length ? (
          numberCalled.map((number) => (
            <div
              key={number}
              className={cls({
                [styles.callerNumber]: true,
                [styles.justCalled]: number === numberCalled[0],
              })}
            >
              {number}
            </div>
          ))
        ) : (
          <div>{'Please click on play button to generate a number'}</div>
        )}
      </div>
    </div>
  )
}
