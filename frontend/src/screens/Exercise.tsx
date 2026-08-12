import { useState, useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { compareText, saveProgress, uploadRecording } from '../api'

const exerciseData: Record<string, { emoji: string; label: string; sound: string; tip: string }> = {
  rabbit: { emoji: '🐰', label: 'Rabbit', sound: 'R', tip: 'Curl your tongue slightly and let air flow around it.' },
  rain: { emoji: '🌧️', label: 'Rain', sound: 'R', tip: 'Start with a gentle "rr" vibration at the back of your throat.' },
  red: { emoji: '🍎', label: 'Red', sound: 'R', tip: 'Keep your tongue tip raised slightly behind your upper teeth.' },
  road: { emoji: '🛣️', label: 'Road', sound: 'R', tip: 'Take a slow breath and relax your lips before starting.' },
  lion: { emoji: '🦁', label: 'Lion', sound: 'L', tip: 'Touch your tongue tip lightly to the spot behind your upper teeth.' },
  lamp: { emoji: '🕯️', label: 'Lamp', sound: 'L', tip: 'The "L" sound is made with the tongue tip up.' },
  R: { emoji: '🔤', label: 'R', sound: 'R', tip: 'Curl your tongue slightly. Air flows around the sides.' },
  L: { emoji: '🔤', label: 'L', sound: 'L', tip: 'Tongue tip touches the ridge behind upper teeth.' },
  S: { emoji: '🔤', label: 'S', sound: 'S', tip: 'Air streams over the tongue tip. Keep teeth close together.' },
  SH: { emoji: '🔤', label: 'SH', sound: 'SH', tip: 'Lips are slightly rounded. Tongue is raised.' },
  CH: { emoji: '🔤', label: 'CH', sound: 'CH', tip: 'Start with a T position then release air.' },
  TH: { emoji: '🔤', label: 'TH', sound: 'TH', tip: 'Tongue tip touches or nearly touches the upper front teeth.' },
  kamal: { emoji: '🌸', label: 'कमल', sound: 'क', tip: 'Tongue back touches the soft palate.' },
  sher: { emoji: '🦁', label: 'शेर', sound: 'श', tip: 'Tongue is raised toward the hard palate.' },
  rang: { emoji: '🎨', label: 'रंग', sound: 'र', tip: 'Tongue flaps briefly against the palate.' },
  surya: { emoji: '☀️', label: 'सूरज', sound: 'स', tip: 'Air flows over the tongue tip smoothly.' },
  'क': { emoji: '🌸', label: 'क', sound: 'क', tip: 'Tongue back touches soft palate. Short burst of air.' },
  'ग': { emoji: '🐄', label: 'ग', sound: 'ग', tip: 'Voiced version of क. Vibrate your vocal cords.' },
  'श': { emoji: '🦁', label: 'श', sound: 'श', tip: 'Tongue raised toward palate. Hissing sound.' },
  'र': { emoji: '🎨', label: 'र', sound: 'र', tip: 'Tongue flaps quickly against ridge behind upper teeth.' },
  'ल': { emoji: '💧', label: 'ल', sound: 'ल', tip: 'Tongue tip lightly touches behind upper teeth.' },
  'स': { emoji: '☀️', label: 'स', sound: 'स', tip: 'Like English "S". Smooth airflow over the tongue.' },
  s1: { emoji: '🐰', label: 'The rabbit is running rapidly.', sound: 'R', tip: 'Focus on each R sound. Take your time.' },
  s2: { emoji: '🌹', label: 'She likes red roses.', sound: 'R', tip: 'Smooth transitions between words.' },
  s3: { emoji: '☀️', label: 'The sun shines in the sky.', sound: 'S', tip: 'Keep the S sounds smooth and consistent.' },
  s4: { emoji: '🐔', label: 'The child chased the chicken.', sound: 'CH', tip: 'CH sound: tongue bunches up, quick release.' },
  hs1: { emoji: '🌙', label: 'राम रोज़ रात को खाना खाता है।', sound: 'र', tip: 'Focus on the र sounds. Speak slowly.' },
  hs2: { emoji: '🦁', label: 'शेर जंगल का राजा है।', sound: 'श', tip: 'Clear श sound with raised tongue.' },
  hs3: { emoji: '☀️', label: 'सूरज सुबह उगता है।', sound: 'स', tip: 'Smooth स sounds at the start of each word.' },
}

type Stage = 'listen' | 'record' | 'review'

const maxRecordingSeconds = 8

function getSpeechErrorMessage(error: string) {
  switch (error) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone access was blocked. Allow microphone access, then try again.'
    case 'no-speech':
      return 'We could not hear any speech. Move closer to your microphone and try again.'
    case 'audio-capture':
      return 'No microphone was found. Connect a microphone, then try again.'
    case 'network':
      return 'Live transcription could not connect. Brave may block this service; try Chrome or Edge, or turn off Brave Shields for this site. Your audio recording can still be saved.'
    case 'language-not-supported':
      return 'Live transcription is not available for this language in your browser. Your audio recording can still be saved.'
    default:
      return 'Live transcription is unavailable right now. Your audio recording can still be saved.'
  }
}

function getRecordingErrorMessage(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError') {
      return 'Microphone access was blocked, so audio could not be saved. Allow microphone access and try again.'
    }
    if (error.name === 'NotFoundError') {
      return 'No microphone was found. Connect one and try again.'
    }
  }

  return 'Your audio could not be saved in this browser. Try Chrome or Edge and allow microphone access.'
}

export default function Exercise() {
  const { selectedExercise, lang, category, sessionId, setLastPractice } = useApp()
  const navigate = useNavigate()

  const data = selectedExercise ? (exerciseData[selectedExercise] || exerciseData['rabbit']) : exerciseData['rabbit']
  const isSentence = ['s1', 's2', 's3', 's4', 'hs1', 'hs2', 'hs3'].includes(selectedExercise || '')
  const pronunciationText = data.label

  const [stage, setStage] = useState<Stage>('listen')
  const [playing, setPlaying] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const [playbackError, setPlaybackError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const recordingRef = useRef(false)
  const finalTranscriptRef = useRef('')
  const recordingUrlRef = useRef<string | null>(null)
  const recognitionSessionRef = useRef(0)
  const recordingSessionRef = useRef(0)
  const mediaChunksRef = useRef<Blob[]>([])
  const recordingBlobPromiseRef = useRef<Promise<Blob | null> | null>(null)
  const resolveRecordingBlobRef = useRef<((blob: Blob | null) => void) | null>(null)

  const speechRecognitionSupported =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  const localRecordingSupported =
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== 'undefined'
  const canRecord = speechRecognitionSupported || localRecordingSupported

  const playAudio = () => {
    const textToSpeak = pronunciationText
    const langCode = lang === 'hindi' ? 'hi-IN' : 'en-US'

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop()
    mediaStreamRef.current?.getTracks().forEach(track => track.stop())
    mediaStreamRef.current = null

    if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.lang = langCode
      utterance.rate = 0.95
      utterance.pitch = 1
      utterance.onend = () => setPlaying(false)
      utterance.onerror = () => setPlaying(false)
      utteranceRef.current = utterance
      setPlaying(true)
      window.speechSynthesis.speak(utterance)
    } else {
      setPlaying(true)
      setTimeout(() => setPlaying(false), 2000)
    }
  }

  const clearRecordingTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const stopRecognition = () => {
    const recognition = recognitionRef.current
    if (!recognition) return

    try {
      recognition.stop()
    } catch {
      // Recognition may already have stopped after a final result.
    }
  }

  const startRecording = async () => {
    if (recordingRef.current) return

    setSpeechError(null)
    setRecordingError(null)
    setSubmitError(null)

    let mediaRecorder: MediaRecorder | null = null

    if (localRecordingSupported) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaStreamRef.current = stream
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm'
        mediaRecorder = new MediaRecorder(stream, { mimeType })
        mediaChunksRef.current = []
        recordingBlobPromiseRef.current = new Promise(resolve => {
          resolveRecordingBlobRef.current = resolve
        })
        mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) mediaChunksRef.current.push(event.data)
        }
        mediaRecorder.onstop = () => {
          const blob = mediaChunksRef.current.length
            ? new Blob(mediaChunksRef.current, { type: mediaRecorder?.mimeType || 'audio/webm' })
            : null
          resolveRecordingBlobRef.current?.(blob)
          resolveRecordingBlobRef.current = null
          mediaRecorderRef.current = null
          stream.getTracks().forEach(track => track.stop())
          mediaStreamRef.current = null
        }
        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start(250)
      } catch (error) {
        setRecordingError(getRecordingErrorMessage(error))
        return
      }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const session = recognitionSessionRef.current + 1
    recognitionSessionRef.current = session

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.lang = lang === 'hindi' ? 'hi-IN' : 'en-US'
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        if (recognitionSessionRef.current === session) setIsListening(true)
      }

      recognition.onresult = event => {
        if (recognitionSessionRef.current !== session) return
        let nextTranscript = finalTranscriptRef.current
        let nextInterimTranscript = ''
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const result = event.results[index]
          const spokenText = result[0]?.transcript.trim() || ''
          if (result.isFinal) nextTranscript = `${nextTranscript} ${spokenText}`.trim()
          else nextInterimTranscript += `${spokenText} `
        }
        finalTranscriptRef.current = nextTranscript
        setTranscript(nextTranscript)
        setInterimTranscript(nextInterimTranscript.trim())
      }

      recognition.onerror = event => {
        if (recognitionSessionRef.current !== session || event.error === 'aborted') return
        setSpeechError(getSpeechErrorMessage(event.error))
        setIsListening(false)
      }

      recognition.onend = () => {
        if (recognitionSessionRef.current !== session) return
        if (recognitionRef.current === recognition) recognitionRef.current = null
        setIsListening(false)
      }

      recognitionRef.current = recognition
      try {
        recognition.start()
      } catch {
        recognitionRef.current = null
        setSpeechError('Speech recognition could not start. The audio recording can still be saved.')
      }
    } else if (!localRecordingSupported) {
      setSpeechError('This browser does not support speech recognition or microphone recording.')
      return
    }

    recordingRef.current = true
    finalTranscriptRef.current = ''
    setRecording(true)
    setRecorded(false)
    setRecordingTime(0)
    setTranscript('')
    setInterimTranscript('')
    timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
  }

  const stopRecording = () => {
    if (!recordingRef.current) return

    clearRecordingTimer()
    recordingRef.current = false
    setRecording(false)
    setIsListening(false)
    setInterimTranscript('')
    stopRecognition()

    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    } else {
      resolveRecordingBlobRef.current?.(null)
      resolveRecordingBlobRef.current = null
    }

    mediaStreamRef.current?.getTracks().forEach(track => track.stop())
    mediaStreamRef.current = null
    setRecorded(true)
    setAttempts(a => a + 1)
  }

  useEffect(() => {
    if (recording && recordingTime >= maxRecordingSeconds) stopRecording()
  }, [recordingTime, recording])

  useEffect(() => () => {
    clearRecordingTimer()
    recordingRef.current = false
    recognitionSessionRef.current += 1
    const recognition = recognitionRef.current
    if (recognition) {
      recognition.onstart = null
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      try {
        recognition.abort()
      } catch {
        // Recognition has already ended.
      }
    }

    if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
      window.speechSynthesis.cancel()
    }
  }, [])

  const submit = async () => {
    if (uploading) return

    setUploading(true)
    setSubmitError(null)

    try {
      const expectedText = pronunciationText
      const userText = transcript.trim()
      const comparison = await compareText(expectedText, userText)

      const recordingBlob = recordingBlobPromiseRef.current
        ? await recordingBlobPromiseRef.current
        : null

      let audioFileName: string | null = null
      if (recordingBlob) {
        const recording = await uploadRecording(recordingBlob, expectedText, userText)
        audioFileName = recording.audioFileName
      }

      const activity = await saveProgress({
        sessionId,
        exerciseId: selectedExercise || data.label,
        language: lang || 'english',
        category: category || 'letters',
        expectedText,
        userText,
        score: comparison.score,
        match: comparison.match,
        attempts,
        durationSeconds: recordingTime,
        audioFileName,
      })

      setLastPractice({
        comparison,
        activity,
        attempts,
        durationSeconds: recordingTime,
        expectedText,
        userText,
        exerciseId: selectedExercise || data.label,
      })
      navigate('/result')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not submit this practice.')
    } finally {
      setUploading(false)
    }
  }
  const tryAgain = () => {
    recognitionSessionRef.current += 1
    stopRecognition()
    recognitionRef.current = null
    finalTranscriptRef.current = ''
    setRecorded(false)
    setRecordingTime(0)
    setTranscript('')
    setInterimTranscript('')
    setSpeechError(null)
    setStage('record')
  }

  const handleRecordPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    startRecording()
  }

  const handleRecordPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    stopRecording()
  }

  const handleRecordKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    startRecording()
  }

  const handleRecordKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    stopRecording()
  }

  return (
    <div className="p-5 pb-24 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[var(--color-text-muted)] text-sm font-600 hover:text-[var(--color-text)]">
          ← Back
        </button>
        <div className="flex items-center gap-2 text-xs font-700 px-3 py-1.5 rounded-full"
          style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
          Target Sound: <span className="font-800 ml-1">{data.sound}</span>
        </div>
      </div>

      <div className="rounded-2xl p-6 mb-5 text-center"
        style={{ background: 'white', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {!isSentence ? (
          <>
            <div className="text-7xl mb-4">{data.emoji}</div>
            <div className="font-display font-800 text-3xl text-[var(--color-text)] mb-1">{data.label}</div>
            <div className="text-sm text-[var(--color-text-muted)] font-500">{data.tip}</div>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4">{data.emoji}</div>
            <div className="font-700 text-xl text-[var(--color-text)] mb-2 leading-relaxed">"{data.label}"</div>
            <div className="text-sm text-[var(--color-text-muted)] font-500">{data.tip}</div>
          </>
        )}
      </div>

      <div className="flex gap-2 mb-5">
        {(['listen', 'record', 'review'] as Stage[]).map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-full h-1.5 rounded-full transition-all ${
              stage === s ? 'opacity-100' : i < ['listen','record','review'].indexOf(stage) ? 'opacity-60' : 'opacity-20'
            }`} style={{ background: 'var(--color-primary)' }} />
            <span className="text-[10px] font-700 capitalize" style={{ color: stage === s ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
              {s === 'listen' ? '1. Listen' : s === 'record' ? '2. Record' : '3. Review'}
            </span>
          </div>
        ))}
      </div>

      {stage === 'listen' && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-5" style={{ background: 'var(--color-primary-light)' }}>
            <div className="font-display font-700 text-sm text-[var(--color-primary)] mb-3">
              Correct Pronunciation
            </div>
            <button
              onClick={playAudio}
              className={`w-full py-4 rounded-xl text-white font-display font-700 text-lg flex items-center justify-center gap-3 transition-all active:scale-95 ${playing ? 'opacity-80' : ''}`}
              style={{ background: playing ? 'var(--color-primary-dark)' : 'var(--color-primary)' }}
            >
              {playing ? (
                <>
                  <span className="animate-pulse">🔊</span>
                  <span>Playing...</span>
                  <span className="flex gap-0.5 items-end">
                    {[3,5,4,6,3].map((h,i) => (
                      <span key={i} className="w-1 rounded-full animate-pulse bg-white/70 inline-block"
                        style={{ height: h * 4, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </span>
                </>
              ) : (
                <>🔊 Play Pronunciation</>
              )}
            </button>
            <p className="text-xs text-[var(--color-primary)] mt-2 text-center font-500">
              Replay as needed before recording.
            </p>
          </div>
          <button
            onClick={() => setStage('record')}
            className="w-full py-4 rounded-2xl text-white font-display font-700 text-lg transition-all active:scale-95"
            style={{ background: 'var(--color-accent-green)', boxShadow: '0 4px 16px rgba(114,176,138,0.3)' }}
          >
            I'm Ready to Record →
          </button>
        </div>
      )}

      {stage === 'record' && !recorded && (
        <div className="flex flex-col items-center gap-5">
          <div className="text-center">
            <p className="font-display font-700 text-lg text-[var(--color-text)] mb-1">
              Your Turn to Speak
            </p>
            <p className="text-sm text-[var(--color-text-muted)] font-500">
              Press record and clearly say the sound.
            </p>
          </div>

          {recording && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-0.5 items-end h-12">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-1.5 rounded-full animate-pulse"
                    style={{
                      height: Math.random() * 36 + 8,
                      background: 'var(--color-accent-peach)',
                      animationDelay: `${i * 0.07}s`,
                    }} />
                ))}
              </div>
              <div className="font-display font-800 text-2xl" style={{ color: '#E55353' }}>
                {recordingTime}s / {maxRecordingSeconds}s
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={!canRecord || recording}
            onPointerDown={handleRecordPointerDown}
            onPointerUp={handleRecordPointerUp}
            onPointerCancel={stopRecording}
            onKeyDown={handleRecordKeyDown}
            onKeyUp={handleRecordKeyUp}
            className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl transition-all select-none disabled:cursor-not-allowed disabled:opacity-50 ${recording ? 'scale-110' : 'active:scale-95 hover:scale-105'}`}
            style={{
              background: recording ? '#FDECEA' : 'var(--color-primary-light)',
              border: `4px solid ${recording ? '#E55353' : 'var(--color-primary)'}`,
              boxShadow: recording ? '0 0 0 8px rgba(229,83,83,0.15)' : '0 6px 20px rgba(107,159,212,0.25)',
            }}
          >
            {recording ? '🔴' : '🎙️'}
          </button>
          <p className="text-xs text-[var(--color-text-muted)] font-500">
            {recording ? 'Release to stop recording' : 'Hold to record'}
          </p>

          {!speechRecognitionSupported && (
            <p role="alert" className="text-center text-xs font-600 px-3 py-2 rounded-xl" style={{ background: 'var(--color-accent-peach-light)', color: '#B65E34' }}>
              Speech recognition is not available in this browser. Try the latest Chrome or Edge.
            </p>
          )}

          {speechError && (
            <p role="alert" className="text-center text-xs font-600 px-3 py-2 rounded-xl" style={{ background: '#FDECEA', color: '#B54444' }}>
              {speechError}
            </p>
          )}

          {recording && (
            <div className="w-full rounded-2xl p-4" style={{ background: 'var(--color-primary-light)' }} aria-live="polite">
              <div className="flex items-center gap-2 text-xs font-700 mb-2" style={{ color: 'var(--color-primary)' }}>
                <span className={`w-2 h-2 rounded-full ${isListening ? 'animate-pulse' : ''}`} style={{ background: isListening ? '#E55353' : 'var(--color-primary)' }} />
                {isListening ? 'Listening…' : 'Preparing microphone…'}
              </div>
              <p className="text-sm font-600 text-[var(--color-text)] min-h-5">
                {transcript || interimTranscript || 'Start speaking to see your transcript.'}
              </p>
            </div>
          )}

          <button
            onClick={playAudio}
            className="text-sm font-600 px-4 py-2 rounded-xl"
            style={{ color: 'var(--color-primary)', background: 'var(--color-primary-light)' }}
          >
            🔊 Replay example
          </button>
        </div>
      )}

      {(stage === 'record' && recorded) && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-5" style={{ background: 'var(--color-accent-green-light)' }}>
            <p className="font-700 text-sm text-[var(--color-accent-green)] mb-3">
              Practice captured
            </p>
            <div className="rounded-xl p-4" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
              <p className="text-xs font-700 mb-1" style={{ color: 'var(--color-text-muted)' }}>Recognised speech</p>
              <p className="font-600 text-sm text-[var(--color-text)]" aria-live="polite">
                {transcript || 'No speech was recognised. Try again and speak clearly into your microphone.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-500">
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-green)' }} />
            Attempt {attempts} recorded
          </div>

          {recordingError && (
            <p role="alert" className="text-center text-xs font-600 px-3 py-2 rounded-xl" style={{ background: '#FDECEA', color: '#B54444' }}>{recordingError}</p>
          )}

          {submitError && (
            <p role="alert" className="text-center text-xs font-600 px-3 py-2 rounded-xl" style={{ background: '#FDECEA', color: '#B54444' }}>{submitError}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={tryAgain}
              className="py-3 rounded-xl font-700 text-sm"
              style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              🔄 Try Again
            </button>
            <button
              onClick={submit}
              className="py-3 rounded-xl text-white font-700 text-sm"
              style={{ background: 'var(--color-primary)' }}
            >
              {uploading ? 'Saving…' : 'Submit Practice ✓'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
