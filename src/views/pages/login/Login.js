import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToastHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import AuthContext from '../../../authContext'
import Cookies from 'js-cookie'
import { loginApi } from '../../../api'
import logo from '../../../assets/brand/logo.png'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [toastMessage, setToastMessage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await loginApi(formData)
      console.log('User logged in successfully:', response)
      // toast('User logged in successfully')
      setToastMessage('User logged in successfully')
      if (response.success) {
        const token = response.result.token
        Cookies.set('authorizationAdmin', token, { expires: 7 })
        login()
        navigate('/dashboard')
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error.error.details[0].message
        // toast(errorMessage)
        setToastMessage(errorMessage)
      } else if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.result.message
        // toast(errorMessage)
        setToastMessage(errorMessage)
      } else {
        console.error('Failed to login:', error.message)
        setToastMessage('Failed to login')
      }
    }
  }

  const handleCloseToast = (index) => {
    // Handle closing the toast here
    setToastMessage(null) // For example, set toastMessage state to null
  }
  return (
    <>
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        {toastMessage && (
          <CToast animation={true} autohide={true} visible={true} onClose={handleCloseToast}>
            <CToastHeader closeButton>
              <CImage rounded thumbnail src={logo} width={30} height={30} />
              <div className="fw-bold me-auto ms-2">Evently Admin Panel</div>
              {/* <small>7 min ago</small> */}
            </CToastHeader>
            <CToastBody>{toastMessage}</CToastBody>
          </CToast>
        )}
      </div>
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>Login</h1>
                      <p className="text-body-secondary">
                        Sign In to your account ( Evently Admin Panel )
                      </p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={handleChange}
                          name="email"
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          value={formData.password}
                          onChange={handleChange}
                          name="password"
                        />
                      </CInputGroup>
                      <CRow>
                        <CCol xs={6}>
                          <CButton color="primary" className="px-4" onClick={handleSubmit}>
                            Login
                          </CButton>
                        </CCol>
                        <CCol xs={6} className="text-right">
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Event Management System ( Evently )</p>
                      <p>Admin Panel</p>
                      <Link to="/register">
                        <CButton color="primary" className="mt-3" active tabIndex={-1}>
                          Register Now!
                        </CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Login
