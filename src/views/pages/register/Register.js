import React, { useContext, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
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
import Cookies from 'js-cookie'
import { cilLockLocked, cilUser } from '@coreui/icons'
// import { ToastContainer, toast } from 'react-toastify'
import { signup } from '../../../api'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../../../authContext'
import logo from '../../../assets/brand/logo.png'

const Register = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: ``,
    email: ``,
    password: ``,
    passwordConfirm: ``,
  })
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
      const formDatas = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      }
      console.log(`toastMessage:`, toastMessage)
      const response = await signup(formDatas)
      console.log(`User signed up successfully:`, response)

      // toast(`User signed up successfully`)
      setToastMessage('User signed up successfully')
      if (response.success) {
        const token = response.result.token
        const isMasterAdmin = response.result.newUser.masterAdmin
        Cookies.set(`authorizationAdmin`, token, { expires: 7 })
        Cookies.set('masterAdmin', isMasterAdmin, { expires: 7 })
        login()
        navigate(`/dashboard`)
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error.error.details[0].message
        // toast(errorMessage)
        setToastMessage(errorMessage)
      } else {
        // toast(`User already exist`)
        setToastMessage('Failed to sign up user')
        console.error(`Failed to sign up user:`, error)
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
            <CCol md={9} lg={7} xl={6}>
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm>
                    <h1>Register</h1>
                    <p className="text-body-secondary">Create new admin account ( Evently )</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        name="name"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        name="email"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        name="password"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        name="passwordConfirm"
                      />
                    </CInputGroup>
                    <div className="d-grid">
                      <CButton style={{ color: '#fff' }} color="success" onClick={handleSubmit}>
                        Create Account
                      </CButton>
                    </div>
                    <p className="text-body-secondary mt-4">
                      Already have an account? <Link to="/login">Login</Link>
                    </p>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Register
