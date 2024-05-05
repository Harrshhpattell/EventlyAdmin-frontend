import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <>
      <CFooter className="px-4">
        <div>
          <a
            href="https://evently-harsh-patel.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Evently
          </a>
          <span className="ms-1">&copy; 2024 ( Harsh Patel 200020116055) </span>
        </div>
        <div className="ms-auto">
          <span className="me-1">Admin Panel</span>
          <a
            href="https://evently-harsh-patel.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Evently Website ( user / organizer)
          </a>
        </div>
      </CFooter>
      <CFooter>
        <div style={{ margin: 'auto', color: 'green' }}>
          <p>This project is created for internship purposes only.</p>
        </div>
      </CFooter>
    </>
  )
}

export default React.memo(AppFooter)
