import { LANGUAGES } from '../constants'

let voiceList: any[] = speechSynthesis.getVoices()

export function getVoiceList() {
  let intervalFunc

  if (voiceList.length) {
    clearInterval(intervalFunc)

    intervalFunc = null

    return voiceList
  }

  if (!intervalFunc) {
    intervalFunc = setInterval(() => {
      voiceList = speechSynthesis.getVoices()
    }, 1000)
  }

  return voiceList
}

export function speakValue({ value = '', language = LANGUAGES.VIETNAM }) {
  if (!value) {
    return
  }

  let valueUpdated = value

  if (language === LANGUAGES.VIETNAM) {
    valueUpdated = 'Số ' + value
  }

  const valueToSpeak: any = new SpeechSynthesisUtterance(valueUpdated)

  if (valueToSpeak) {
    const voice = voiceList.find((voice) => voice.lang === language)

    valueToSpeak.voice = voice
    valueToSpeak.rate = 0.8

    speechSynthesis.speak(valueToSpeak)
  }
}
