import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ApolloProvider } from '@apollo/client/react'
import App from './App.jsx'
import client from './lib/apollo.js'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './css/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
)
