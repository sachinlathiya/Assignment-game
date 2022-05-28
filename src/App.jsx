import { useEffect, useState } from 'react'
import { equationToPick } from './equations'
import './App.css'

function keyIsInvalid (key) {
  return key.length > 1 || /[^0-9*\+-?{}=.]/i.test(key)
}

function getRandomEquation () {
  return equationToPick[Math.floor(Math.random() * equationToPick.length)]
}

function noMoreToDeletefun ({ attempts, position }) {
  const atBeginning = position.char === 0
  const charIsEmpty = attempts[position.attempt][position.char].value === ''
  return atBeginning && charIsEmpty
}

function noMoreToAddfun ({ attempts, position }) {
  const atEnd = position.char === 7
  const charIsNotEmpty = attempts[position.attempt][position.char].value !== ''
  return atEnd && charIsNotEmpty
}

function equationIsNotComplete ({ attempts, position }) {
  return attempts[position.attempt].some(char => char.value === '')
}


const initialnewGameState = {
  word: getRandomEquation(),
  position: {
    char: 0,
    attempt: 0
  },
  attempts: [
    [
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' }
    ],
    [
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' }
    ],
    [
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' }
    ],
    [
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' }
    ],
    [
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' }
    ],
    [
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' },
      { value: '', status: '' }
    ]
  ],
  status: 'playing',
  error: ''
}

function App () {
  const [{ word, attempts, position, error }, setGameState] = useState(
    initialnewGameState
  )

  function enterCharacterfun (char) {
    char = char
    if (position.attempt > 8) return
    if (keyIsInvalid(char)) return

    setGameState(gameState => {
      if (noMoreToAddfun(gameState)) return gameState

      const newGameState = JSON.parse(JSON.stringify(gameState))
      const { attempts, position } = newGameState

      attempts[position.attempt][position.char].value = char
      if (position.char < 7) position.char++

      return newGameState
    })
  }

  function eraseCharacterfun () {
    setGameState(gameState => {
      if (noMoreToDeletefun(gameState)) return gameState

      const newGameState = JSON.parse(JSON.stringify(gameState))
      const { attempts, position } = newGameState

      if (attempts[position.attempt][position.char].value !== '') {
        attempts[position.attempt][position.char].value = ''
      } else {
        if (position.char > 0) position.char--
      }

      return newGameState
    })
  }

  function guessEquationfun () {
    setGameState(gameState => {
      if (equationIsNotComplete(gameState)) {
        return { ...gameState, error: 'Equation Incomplete.' }
      }

      const newGameState = JSON.parse(JSON.stringify(gameState))
      const { attempts, position } = newGameState

      const currentAttempt = attempts[position.attempt]

      let equationCopy = word

      for (const index in currentAttempt) {
        const char = currentAttempt[index]
        if (equationCopy[index] === char.value) {
          char.status = 'at-location'
          equationCopy = equationCopy.replace(char.value, '_')
        }
      }

      for (const index in currentAttempt) {
        const char = currentAttempt[index]
        if (char.status !== '') continue

        if (equationCopy.includes(char.value)) {
          char.status = 'in-eqaution'
          equationCopy = equationCopy.replace(char.value, '_')
        }
      }

      for (const index in currentAttempt) {
        const char = currentAttempt[index]

        if (char.status === '') {
          char.status = 'not-in-equation'
        }
      }

      position.attempt += 1
      position.char = 0

      newGameState.error = ''

      return newGameState
    })
  }


  function updatePositionfun (newPosition) {
    setGameState(gameState => {
      if (newPosition.attempt !== gameState.position.attempt) return gameState
      return { ...gameState, position: newPosition }
    })
  }

  
  function goLeftfun () {
    setGameState(gameState => {
      if (gameState.position.char === 0) return gameState

      const newGameState = JSON.parse(JSON.stringify(gameState))
      newGameState.position.char--

      return newGameState
    })
  }

  function goRightfun () {
    setGameState(gameState => {
      if (gameState.position.char === 8) return gameState

      const newGameState = JSON.parse(JSON.stringify(gameState))
      newGameState.position.char++

      return newGameState
    })
  }

  function checkKeyfun (key) {
    key = key
    let status = ''
    for (const attempt of attempts) {
      for (const char of attempt) {
        if (char.value !== key) continue
        if (char.status === 'at-location') {
          return 'at-location'
        } else if (char.status === 'in-eqaution') {
          status = 'in-eqaution'
        } else if (char.status === 'not-in-equation' && status === '') {
          status = 'not-in-equation'
        }
      }
    }

    return status
  }

  useEffect(() => {
    if (position.attempt > 9) return

    const handleKeyDown = e => {
      if (e.key === 'Enter') guessEquationfun()
      if (e.key === 'ArrowLeft') goLeftfun()
      if (e.key === 'ArrowRight') goRightfun()
      if (e.key === 'Backspace') eraseCharacterfun()
      else enterCharacterfun(e.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [position.attempt])

  return (
    <div className='Apppwa'>
      <h1>PWA Game</h1>
      <div className='board'>
        {attempts.map((attempt, attemptIndex) => (
          <div
            key={attemptIndex}
            className={`attempt ${
              attemptIndex === position.attempt ? 'current' : ''
            }`}
          >
            {attempt.map((char, charIndex) => (
              <span
                key={`${attemptIndex}-${charIndex}`}
                id={`char-${attemptIndex}-${charIndex}`}
                className={`char ${char.status} ${
                  position.attempt === attemptIndex &&
                  position.char === charIndex
                    ? 'current'
                    : ''
                }`}
                style={{
                  transition: `background-color 0s ${charIndex * 400 +
                    200}ms ease`,
                  animationDelay: charIndex * 400 + 'ms'
                }}
                onClick={() => {
                  updatePositionfun({ attempt: attemptIndex, char: charIndex })
                }}
              >
                {char.value}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className='error'>{error}</div>
      <div className='keyboard'>
        {['1234567890', '+-*/=', ''].map((row, rowIndex) => (
          <div key={rowIndex} className={`row row-${rowIndex}`}>
            {row.split('').map(letter => (
              <button
                key={letter}
                className={`key ${checkKeyfun(letter)}`}
                onClick={() => enterCharacterfun(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
        <div className='row'>
          <button className='key delete' onClick={eraseCharacterfun}>
            <img
              src='https://www.svgrepo.com/show/48292/delete.svg'
              alt='delete'
            />
          </button>
          <button className='key enter' onClick={guessEquationfun}>
            <img
              src='https://www.svgrepo.com/show/258678/send.svg'
              alt='enter'
            />
          </button>
        </div>
      </div>
      <h2 style={{marginTop:'40px',textAlign:'center'}}>PWA Game Config and Rules:</h2>
      
        <div className='infobox'>
          <p style={{textAlign:'center'}}>Guess the Equation in 6 tries. After each guess, the color of the tiles will change to show how close your guess was to the solution.</p>
          
          <h3 style={{marginTop:'10px'}}>Rules:</h3>
          <ul>
            <li>Each guess is a calculation.</li>
            <li>You can use 0 1 2 3 4 5 6 7 8 9 + - * / or =.</li>
            <li>It must contain one “=”.</li>
            <li>It must only have a number to the right of the “=”, not another calculation.</li>
            <li>Standard order of operations applies, so <b>calculate</b> * and / before + and - eg. 3+2*5=13 <b>not</b> 25! </li>
            <li>If the answer we're looking for is 10+20=30, then we will accept 20+10=30 too (unless you turn off 'commutative answers' in settings).</li>
          </ul>

          <p style={{textAlign:'center'}}>If your guess includes, say, two 1s but the answer has only one, you will get one color tile and one black.</p>

          <p style={{textAlign:'center'}}>Tiles will only go green if the number is in the correct position or when a full guess is rearranged as a winning commutative answer.</p>
        </div>
      
    </div>
  )
}

export default App
