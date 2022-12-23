import { useEffect, useState, useRef } from 'react'

export const useCountDown = ({
  start,
}: {
  start?: number
}): {
  timer: number
  startTimer: (time: number) => void
  stopTimer: () => void
} => {
  const [timer, setTimer] = useState(start || 0)
  const intervalRef = useRef<NodeJS.Timer>()

  const stopTimer = () => {
    intervalRef.current && clearInterval(intervalRef.current)
  }

  const startTimer = (time: number) => {
    setTimer(time)
  }

  useEffect(() => {
    if (timer <= 0) return stopTimer()

    intervalRef.current = setInterval(() => {
      setTimer((t) => t - 1)
    }, 1000)

    return () => {
      intervalRef.current && clearInterval(intervalRef.current)
    }
  }, [timer])

  return { timer, startTimer, stopTimer }
}
