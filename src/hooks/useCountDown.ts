import { useEffect, useState, useRef } from 'react'

export const useCountDown = ({
  start,
}: {
  start?: number
}): {
  timer: number
  isPaused: boolean
  startTimer: (time: number) => void
  pauseTimer: () => void
  stopTimer: () => void
} => {
  const [timer, setTimer] = useState(start || 0)
  const [isPaused, setIsPaused] = useState(true)
  const intervalRef = useRef<any>()

  const stopTimer = () => {
    intervalRef.current && clearInterval(intervalRef.current)
  }

  const pauseTimer = () => {
    setIsPaused(true)
  }

  const startTimer = (time: number) => {
    setIsPaused(false)
    setTimer(time)
  }

  useEffect(() => {
    if (timer <= 0 || isPaused) return stopTimer()

    intervalRef.current = setInterval(() => {
      setTimer((t) => t - 1)
    }, 1000)

    return () => {
      intervalRef.current && clearInterval(intervalRef.current)
    }
  }, [timer, isPaused])

  return { timer, isPaused, startTimer, pauseTimer, stopTimer }
}
