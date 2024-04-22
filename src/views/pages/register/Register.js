import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Cookies from 'js-cookie'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { ToastContainer, toast } from 'react-toastify'
import { signup } from '../../../api'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: ``,
    email: ``,
    password: ``,
    passwordConfirm: ``,
  })

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
      console.log(`formdata:`, formDatas)
      const response = await signup(formDatas)
      console.log(`User signed up successfully:`, response)

      toast(`User signed up successfully`)
      if (response.success) {
        const token = response.result.token
        Cookies.set(`authorizationAdmin`, token, { expires: 7 })
        navigate(`/`)
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error.error.details[0].message
        toast(errorMessage)
      } else {
        toast(`User already exist`)
        console.error(`Failed to sign up user:`, error)
      }
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <ToastContainer />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
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
                    <CButton color="success" onClick={handleSubmit}>
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
