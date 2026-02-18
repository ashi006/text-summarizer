import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [health, setHealth] = useState<string>('checking...')

  useEffect(() => {
    axios.get('/api/health')
      .then(res => setHealth(res.data.status))
      .catch(err => {
        console.error(err)
        setHealth('error')
      })
  }, [])

  return (
    <div className="App">
      <header>
        <h1>Transcript Summarizer</h1>
      </header>
      <main>
        <p>Backend Status: <strong>{health}</strong></p>
        <p>Dashboard coming soon...</p>
      </main>
    </div>
  )
}

export default App
