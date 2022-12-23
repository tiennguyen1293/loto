import cls from 'classnames'

import { Loto } from './pages'

import styles from './App.module.scss'

function App() {
  return (
    <main className={cls(styles.main, styles.light)}>
      <Loto />
    </main>
  )
}

export default App
