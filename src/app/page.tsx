'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@progress/kendo-react-buttons'
import { Input, RadioButton, Switch } from '@progress/kendo-react-inputs'
import { DropDownList } from '@progress/kendo-react-dropdowns'
import { Label } from '@progress/kendo-react-labels'
import { Card, CardHeader, CardBody, CardImage } from '@progress/kendo-react-layout'
import { Notification, NotificationGroup } from '@progress/kendo-react-notification'
import { Fade } from '@progress/kendo-react-animation'
import { Typography } from '@progress/kendo-react-common'
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs'
import '@progress/kendo-theme-default/dist/all.css'

const THEME_COLORS = {
  primary: '#1976d2',
  primaryDark: '#1565c0',
  textGray: '#666'
}

const FONT_SIZES = {
  large: '2.5rem',
  medium: '1.25rem',
  small: '0.875rem'
}

const SPACING = {
  small: '8px',
  medium: '16px',
  large: '24px',
  xlarge: '32px'
}

const COMPONENT_STYLES = {
  card: {
    marginBottom: SPACING.large
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: THEME_COLORS.textGray
  },
  heading: {
    margin: 0,
    textAlign: 'center' as const,
    fontSize: FONT_SIZES.medium
  }
}

const customStyles = `
  :root {
    --kendo-color-primary: ${THEME_COLORS.primary};
    --kendo-color-primary-hover: ${THEME_COLORS.primaryDark};
  }

  .k-button.k-button-solid-primary,
  .k-button[themeColor="primary"],
  button[themeColor="primary"] {
    background-color: ${THEME_COLORS.primary} !important;
    border-color: ${THEME_COLORS.primary} !important;
    color: white !important;
  }

  .k-button.k-button-solid-primary:hover,
  .k-button[themeColor="primary"]:hover,
  button[themeColor="primary"]:hover {
    background-color: ${THEME_COLORS.primaryDark} !important;
    border-color: ${THEME_COLORS.primaryDark} !important;
    color: white !important;
  }

  .k-input .k-input-inner {
    color: ${THEME_COLORS.primary} !important;
  }
`

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = customStyles
  document.head.appendChild(styleSheet)
}


const NUMBER_LENGTH_OPTIONS = [
  { text: '4 digits', value: 4 },
  { text: '5 digits', value: 5 },
  { text: '6 digits', value: 6 },
  { text: '7 digits', value: 7 },
  { text: '8 digits', value: 8 }
]


const gameRules = (
  <div style={{ maxWidth: '300px', padding: SPACING.small }}>
    <Typography.p style={{ fontWeight: 'bold', margin: `0 0 ${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>How to Play:</Typography.p>
    <Typography.p style={{ margin: `${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>1. Memorize the starting number shown for 2 seconds</Typography.p>
    <Typography.p style={{ margin: `${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>2. A new digit will appear with shift instructions</Typography.p>
    <Typography.p style={{ margin: `${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>3. Apply the shift operation and add the new digit</Typography.p>
    <Typography.p style={{ margin: `${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>4. Type the resulting number in the input field</Typography.p>
    <Typography.p style={{ margin: `${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>5. The game auto-submits when you complete the number</Typography.p>

    <Typography.p style={{ fontWeight: 'bold', margin: `${SPACING.medium} 0 ${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>Shift Operations:</Typography.p>
    <Typography.p style={{ margin: `${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>• Left Shift: Remove leftmost digit, add new digit at end</Typography.p>
    <Typography.p style={{ margin: `${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>• Right Shift: Remove rightmost digit, add new digit at start</Typography.p>
    <Typography.p style={{ margin: `${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>• 2 Left/Right: Same but remove/add 2 digits</Typography.p>

    <Typography.p style={{ fontWeight: 'bold', margin: `${SPACING.medium} 0 ${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>Example (Default Settings (Left Shift, Shift Count 1, Number Length 4)):</Typography.p>
    <Typography.p style={{ margin: `${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>Start: 4259</Typography.p>
    <Typography.p style={{ margin: `${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>Step 1: Left Shift + 5 → 2595</Typography.p>
    <Typography.p style={{ margin: `${SPACING.small} 0`, fontSize: FONT_SIZES.small }}>Step 2: Left Shift + 7 → 5957</Typography.p>
  </div>
)

const GameTitle = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SPACING.medium, marginBottom: SPACING.xlarge }}>
    <Typography.h1 style={{ ...COMPONENT_STYLES.title, margin: 0, textAlign: 'center', lineHeight: 1.2 }}>
      Muscle Brain<br />
      (Ultimate Working Memory Training)
    </Typography.h1>
  </div>
)

const ScoreDisplay = ({ score, bestScore, isPracticeMode }: { score: number; bestScore: number; isPracticeMode: boolean }) => {
  const [brainImage, setBrainImage] = useState('/brain_up.png')

  useEffect(() => {
    const interval = setInterval(() => {
      setBrainImage(prev => prev === '/brain_up.png' ? '/brain_down.png' : '/brain_up.png')
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card style={{ ...COMPONENT_STYLES.card, width: '100%', maxWidth: '300px', margin: '0 auto' }}>
      <CardImage src={brainImage} alt="Brain icon" style={{ width: '100%', height: '120px', objectFit: 'contain', backgroundColor: '#f5f5f5' }} />
      <CardHeader>
        <Typography.h3 style={COMPONENT_STYLES.heading}>Current Session</Typography.h3>
      </CardHeader>
      <CardBody>
        <div style={{ textAlign: 'center' }}>
          {isPracticeMode ? (
            <Typography.p style={{ fontSize: FONT_SIZES.medium, color: THEME_COLORS.textGray, margin: `${SPACING.small} 0` }}>
              Practice Mode
            </Typography.p>
          ) : (
            <>
              <Typography.p style={{ fontSize: FONT_SIZES.medium, color: THEME_COLORS.textGray, margin: `${SPACING.small} 0` }}>Score: <span style={{ color: THEME_COLORS.primary }}>{score}</span></Typography.p>
              <Typography.p style={{ fontSize: FONT_SIZES.medium, color: THEME_COLORS.textGray, margin: `${SPACING.small} 0` }}>Best Score: <span style={{ color: THEME_COLORS.primary }}>{bestScore}</span></Typography.p>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default function MemoryGame() {
  const [startNumber, setStartNumber] = useState('')
  const [currentNumber, setCurrentNumber] = useState('')
  const [currentDigit, setCurrentDigit] = useState('')
  const [userInput, setUserInput] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [showingStart, setShowingStart] = useState(false)
  const [step, setStep] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'success' | 'info' | 'none'>('success')
  const [showHelp, setShowHelp] = useState(false)
  const [isPracticeMode, setIsPracticeMode] = useState(false)

  const toggleDialog = () => {
    setShowHelp(!showHelp)
  }
  const [numberLength, setNumberLength] = useState(4)
  const [shiftDirection, setShiftDirection] = useState('left')
  const [shiftCount, setShiftCount] = useState(1)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const inputRef = useRef<any>(null)
  const startScreenRoot = useRef<HTMLDivElement>(null)

  const shiftAndAdd = (num: string, newDigits: string, direction: string = shiftDirection) => {
    if (direction === 'right') {
      return newDigits + num.slice(0, -shiftCount)
    } else {
      return num.slice(shiftCount) + newDigits
    }
  }

  const generateRandomDigits = (count: number = 1) => {
    let digits = ''
    for (let i = 0; i < count; i++) {
      digits += Math.floor(Math.random() * 10).toString()
    }
    return digits
  }

  const generateNumber = (length: number = numberLength) => {
    const min = Math.pow(10, length - 1)
    const max = Math.pow(10, length) - 1
    const result = (Math.floor(min + Math.random() * (max - min + 1))).toString()
    return result
  }

  const getDigitCount = () => {
    return shiftCount
  }

  const handleSwitchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault()
      setShiftDirection(shiftDirection === 'left' ? 'right' : 'left')
    }
  }, [shiftDirection])

  const handleRadioKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault()
      const currentValue = shiftCount
      const nextValue = currentValue === 3 ? 1 : currentValue + 1
      setShiftCount(nextValue)
    }
  }, [shiftCount])

  const handleDropdownKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault()
      const currentIndex = NUMBER_LENGTH_OPTIONS.findIndex(item => item.value === numberLength)
      const nextIndex = (currentIndex + 1) % NUMBER_LENGTH_OPTIONS.length
      setNumberLength(NUMBER_LENGTH_OPTIONS[nextIndex].value)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [numberLength])


  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !gameStarted && !showingStart) {
      const target = e.target as Element
      if (target && target.closest('.dropdown-wrapper')) {
        return
      }
      e.preventDefault()
      setIsPracticeMode(false)
      startGame()
    }
  }, [gameStarted, showingStart])

  useEffect(() => {
    if (!gameStarted && !showingStart) {
      document.addEventListener('keydown', handleGlobalKeyDown)
      return () => document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [gameStarted, showingStart, handleGlobalKeyDown])


  const startGame = () => {
    const newNumber = generateNumber()
    setStartNumber(newNumber)
    setShowingStart(true)
    setGameStarted(false)
    setStep(0)
    setScore(0)
    setUserInput('')

    setTimeout(() => {
      setShowingStart(false)
      setGameStarted(true)
      const digitCount = getDigitCount()
      const newDigits = generateRandomDigits(digitCount)
      const nextNumber = shiftAndAdd(newNumber, newDigits)
      setCurrentNumber(nextNumber)
      setCurrentDigit(newDigits)
      setTimeout(() => inputRef.current?.focus(), 100)
    }, 2000)
  }

  const showNotificationMessage = (message: string, type: 'success' | 'info' | 'none') => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)

    setTimeout(() => {
      setShowNotification(false)
    }, 2000)
  }

  const handleSubmit = (inputValue = userInput) => {
    if (inputValue === currentNumber) {
      if (!isPracticeMode) {
        const newScore = score + 1
        setScore(newScore)
        if (newScore > bestScore) {
          setBestScore(newScore)
        }
      }
      showNotificationMessage('Correct!', 'info')
      setTimeout(() => {
        const digitCount = getDigitCount()
        const newDigits = generateRandomDigits(digitCount)
        const nextNumber = shiftAndAdd(currentNumber, newDigits)
        setCurrentNumber(nextNumber)
        setCurrentDigit(newDigits)
        setStep(step + 1)
        setUserInput('')
        setTimeout(() => inputRef.current?.focus(), 100)
      }, 1000)
    } else {
      showNotificationMessage(`Wrong! It was ${currentNumber}`, 'none')
      setTimeout(() => {
        setGameStarted(false)
        setShowingStart(false)
        setStep(0)
        setUserInput('')
        setIsPracticeMode(false)
      }, 2000)
    }
  }

  const getInstructionText = () => {
    const digitText = shiftCount === 1 ? 'digit' : 'digits'
    const countText = shiftCount === 1 ? '' : ` by ${shiftCount}`
    
    if (shiftDirection === 'left') {
      return `Shift left${countText} and add ${shiftCount === 1 ? 'this' : 'these'} ${digitText} at the end:`
    } else {
      return `Shift right${countText} and add ${shiftCount === 1 ? 'this' : 'these'} ${digitText} at the beginning:`
    }
  }

  if (showingStart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2 sm:p-4">
        <Card style={{ width: '90vw', maxWidth: '400px', margin: '0 auto' }}>
          <CardHeader>
            <Typography.h3 style={COMPONENT_STYLES.heading}>Remember This Number</Typography.h3>
          </CardHeader>
          <CardBody>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: FONT_SIZES.large, fontFamily: 'monospace', fontWeight: 'bold', color: THEME_COLORS.primary }}>
                {startNumber}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <div ref={startScreenRoot} tabIndex={0} className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-2 sm:p-4">

        {showHelp && (
          <Dialog title="Game Rules" onClose={toggleDialog} width={400}>
            <div style={{ padding: SPACING.large }}>
              {gameRules}
            </div>
            <DialogActionsBar>
              <Button
                type="button"
                themeColor="primary"
                onClick={toggleDialog}
              >
                Close
              </Button>
            </DialogActionsBar>
          </Dialog>
        )}

        <GameTitle />

        <ScoreDisplay score={score} bestScore={bestScore} isPracticeMode={isPracticeMode} />

        <Card style={{ marginBottom: '24px', width: '95vw', maxWidth: '600px', margin: '0 auto 24px auto' }}>
          <CardHeader>
            <Typography.h3 style={COMPONENT_STYLES.heading}>Settings</Typography.h3>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', justifyContent: 'center', gap: SPACING.medium, marginBottom: SPACING.large }}>
              <Button
                type="button"
                onClick={toggleDialog}
                themeColor="primary"
                size="large"
                style={{
                  fontSize: FONT_SIZES.medium,
                  padding: `${SPACING.medium} ${SPACING.xlarge}`
                }}
              >
                How to Play
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsPracticeMode(true)
                  startGame()
                }}
                themeColor="primary"
                size="large"
                style={{
                  fontSize: FONT_SIZES.medium,
                  padding: `${SPACING.medium} ${SPACING.xlarge}`
                }}
              >
                Practice Mode
              </Button>
            </div>
            <div className="flex flex-col items-center md:flex-row md:justify-center gap-8 mb-6 px-4">

              <div className="w-full md:w-auto text-center">
                <Label style={{
                  fontSize: FONT_SIZES.medium,
                  fontWeight: '500',
                  color: 'black',
                  marginBottom: SPACING.small,
                  display: 'block'
                }}>
                  Shift Direction:
                </Label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SPACING.medium }}>
                  <span style={{ fontSize: FONT_SIZES.medium, color: THEME_COLORS.textGray }}>Left</span>
                  <div onKeyDown={handleSwitchKeyDown} tabIndex={0} style={{ display: 'inline-block' }}>
                    <Switch
                      checked={shiftDirection === 'right'}
                      onChange={(e) => setShiftDirection(e.value ? 'right' : 'left')}
                      onLabel=""
                      offLabel=""
                    />
                  </div>
                  <span style={{ fontSize: FONT_SIZES.medium, color: THEME_COLORS.textGray }}>Right</span>
                </div>
              </div>

              <div className="w-full md:w-auto text-center">
                <Label style={{
                  fontSize: FONT_SIZES.medium,
                  fontWeight: '500',
                  color: 'black',
                  marginBottom: SPACING.small,
                  display: 'block'
                }}>
                  Shift Count:
                </Label>
                <div style={{ display: 'flex', justifyContent: 'center', gap: SPACING.large }}>
                  <RadioButton
                    name="shiftCount"
                    value={1}
                    checked={shiftCount === 1}
                    label="1"
                    onChange={(e) => setShiftCount(e.value)}
                    onKeyDown={handleRadioKeyDown}
                  />
                  <RadioButton
                    name="shiftCount"
                    value={2}
                    checked={shiftCount === 2}
                    label="2"
                    onChange={(e) => setShiftCount(e.value)}
                    onKeyDown={handleRadioKeyDown}
                  />
                  <RadioButton
                    name="shiftCount"
                    value={3}
                    checked={shiftCount === 3}
                    label="3"
                    onChange={(e) => setShiftCount(e.value)}
                    onKeyDown={handleRadioKeyDown}
                  />
                </div>
              </div>

              <div className="w-full md:w-auto text-center">
                <Label style={{
                  fontSize: FONT_SIZES.medium,
                  fontWeight: '500',
                  color: 'black',
                  marginBottom: SPACING.small,
                  display: 'block'
                }}>
                  Number Length:
                </Label>
                <div onKeyDown={handleDropdownKeyDown} tabIndex={0} className="dropdown-wrapper" style={{ display: 'inline-block' }}>
                  <DropDownList
                    data={NUMBER_LENGTH_OPTIONS}
                    textField="text"
                    dataItemKey="value"
                    value={NUMBER_LENGTH_OPTIONS.find(item => item.value === numberLength) || NUMBER_LENGTH_OPTIONS[0]}
                    onChange={(e) => setNumberLength(e.target.value.value)}
                    style={{ fontSize: FONT_SIZES.medium, minWidth: '120px' }}
                  />
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button
                themeColor="primary"
                size="large"
                onClick={() => {
                  setIsPracticeMode(false)
                  startGame()
                }}
                style={{
                  fontSize: FONT_SIZES.medium,
                  padding: `${SPACING.medium} ${SPACING.xlarge}`
                }}
              >
                Start Game
              </Button>
            </div>
          </CardBody>
        </Card>

      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-2 sm:p-4">
      <GameTitle />

      <ScoreDisplay score={score} bestScore={bestScore} isPracticeMode={isPracticeMode} />

      <Card style={{ ...COMPONENT_STYLES.card, width: '90vw', maxWidth: '500px', margin: '0 auto' }}>
        <CardHeader>
          <Typography.h3 style={COMPONENT_STYLES.heading}>Game</Typography.h3>
        </CardHeader>
        <CardBody>
          <div style={{ textAlign: 'center', marginBottom: SPACING.xlarge }}>
            <div style={{ fontSize: FONT_SIZES.large, fontFamily: 'monospace', fontWeight: 'bold', color: THEME_COLORS.primary, marginBottom: SPACING.medium }}>
              {currentDigit.length === 1 ? currentDigit :
               <span>{currentDigit.split('').join(' ')}</span>
              }
            </div>
            <Typography.p style={{ fontSize: FONT_SIZES.medium, color: THEME_COLORS.textGray, margin: `0 0 ${SPACING.small} 0` }}>
              {getInstructionText()}
            </Typography.p>
            <Typography.p style={{ fontSize: FONT_SIZES.small, color: THEME_COLORS.textGray, margin: `0 0 ${SPACING.small} 0` }}>
              Input the number (auto-submits when complete)
            </Typography.p>
            {isPracticeMode && (
              <Typography.p style={{ fontSize: FONT_SIZES.small, color: THEME_COLORS.textGray, margin: `0 0 ${SPACING.small} 0` }}>
                Input the wrong number to exit
              </Typography.p>
            )}
          </div>

          <div style={{ textAlign: 'center', marginBottom: SPACING.large }}>
            <Input
              ref={inputRef}
              value={userInput}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              name={`game-input-${step}`}
              onChange={(e) => {
                const targetLength = currentNumber ? currentNumber.length : numberLength
                const newValue = String(e.target.value || '').slice(0, targetLength)
                setUserInput(newValue)
                if (newValue.length === targetLength) {
                  setTimeout(() => handleSubmit(newValue), 100)
                }
              }}
              placeholder={isPracticeMode ? currentNumber : '0'.repeat(currentNumber ? currentNumber.length : numberLength)}
              style={{
                fontSize: FONT_SIZES.large,
                padding: SPACING.medium,
                textAlign: 'center',
                width: 'min(256px, 80vw)',
                fontFamily: 'monospace',
                color: THEME_COLORS.primary
              }}
              maxLength={currentNumber ? currentNumber.length : numberLength}
            />
          </div>

        </CardBody>
      </Card>

      <NotificationGroup
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: '100%',
          maxWidth: '800px'
        }}
      >
        <Fade>
          {showNotification && (
            <Notification
              type={{ style: notificationType, icon: false }}
              closable={false}
              style={{
                width: '100%',
                fontSize: FONT_SIZES.medium,
                padding: SPACING.medium,
                textAlign: 'center',
                backgroundColor: notificationType === 'info' ? THEME_COLORS.primary : THEME_COLORS.textGray,
                color: 'white',
                border: 'none'
              }}
            >
              <span style={{ fontSize: FONT_SIZES.medium, fontWeight: 'bold' }}>{notificationMessage}</span>
            </Notification>
          )}
        </Fade>
      </NotificationGroup>

    </div>
  )
}
