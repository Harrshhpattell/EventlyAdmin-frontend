/* eslint-disable */
import React, { useContext, useEffect, useState } from 'react'
import "./styles.css"
import Cookies from "js-cookie"
import {
    CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSwitch,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CToast,
  CToastBody,
  CToastHeader,
} from '@coreui/react'
import { deleteAdmin, getAdmin, toggleAdminStatus } from '../../api';
import logo from '../../assets/brand/logo.png';
import CIcon from '@coreui/icons-react';
import { cilPeople, cilTrash } from '@coreui/icons';
import AuthContext from '../../authContext';


const Admin = () => {

  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState([]);
  const [deleteModel, setDeleteModel] = useState(false)
  const [reqDeleteAdminId, setReqDeleteAdminId] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const fetchAdminList = async () => {
    setLoading(true)
    try {
      const fetchedAdmin = await getAdmin()
      setAdmin(fetchedAdmin)
    } catch (error) {
      // Handle error
      console.error('Error fetching list of admin:', error)
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
      fetchAdminList()
    }, [])

    const handleToggleAdminStatus = async (id, checked) => {
        try {
          await toggleAdminStatus(id, checked);
          // Refresh admin list after toggle
          fetchAdminList();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                // Handle access denied error
                setToastMessage("Access denied. You don't have permission to perform this action.");
                logout()
            } else {
                console.error('Error toggling admin status:', error);
            }
        }
      };

      const handleDeleteAdmin = async (adminId) => {
        try {
          await deleteAdmin(adminId);
          // After successful deletion, fetch the updated events and update the state
          fetchAdminList()
          setDeleteModel(false)
          setReqDeleteAdminId(null)
          setToastMessage('Admin deleted successfully')
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setToastMessage("Access denied. You don't have permission to perform this action.");
                logout();
            } else {
                console.error('Error deleting admin:', error);
            }
        }
      };

      const handleCloseToast = (index) => {
        setToastMessage(null)
      }

const isMasterAdmin =  Cookies.get("masterAdmin")
  return (
    <>
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: '99999' }}>
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
      <CRow> 
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                    Admin Master
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              <br />
              {loading ? (
                <div className="loaderSection">
                  <div className="loaders"></div>
                </div>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        <CIcon icon={cilPeople} />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Master Admin Name</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Master Admin Email</CTableHeaderCell>
                      {/* <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell> */}
                    </CTableRow>
                    </CTableHead>
                    <CTableBody>
                  {admin
                    .filter(item => item.masterAdmin === 'active')
                    .map((item, index) => (
                        <CTableRow v-for="item in tableItems" key={index}>
                        <CTableDataCell className="text-center">
                            <CAvatar size="md" src={logo} />
                        </CTableDataCell>
                        <CTableDataCell>
                            <div>{item.name}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                            <div>{item.email}</div>
                        </CTableDataCell>
                        </CTableRow>
                    ))
                  }
                </CTableBody>

                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow> 
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                    Admin
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              <br />
              {loading ? (
                <div className="loaderSection">
                  <div className="loaders"></div>
                </div>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        <CIcon icon={cilPeople} />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Admin Name</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Admin Email</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Temporary Block</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
                      {/* <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell> */}
                    </CTableRow>
                    </CTableHead>
                    <CTableBody>
                  {admin
                    .filter(item => item.masterAdmin === 'notactive')
                    .map((item, index) => (
                        <CTableRow v-for="item in tableItems" key={index}>
                        <CTableDataCell className="text-center">
                            <CAvatar size="md" src={logo} />
                        </CTableDataCell>
                        <CTableDataCell>
                            <div>{item.name}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                            <div>{item.email}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                            <CFormSwitch
                                label={item.status === "blocked" ? "Blocked" : "Active"}
                                id={`formSwitchCheckChecked${index}`}
                                defaultChecked={item.status !== "blocked"}
                                onChange={(e) => handleToggleAdminStatus(item._id, e.target.checked)}
                                disabled={isMasterAdmin === 'notactive' ? true : false}
                            />
                        </CTableDataCell>
                        <CTableDataCell>
                              <div style={{ display: 'flex', gap: '10px' }}>
                              <div
                                className={`deteleButton ${isMasterAdmin === 'notactive' ? 'disabledButton' : ''}`}
                                onClick={() => {
                                    if (isMasterAdmin === 'active') {
                                    setDeleteModel(!deleteModel);
                                    setReqDeleteAdminId(item._id);
                                    }
                                }}
                                >
                                  <CIcon style={{ color: 'white' }} icon={cilTrash} />
                                </div>
                              </div>
                            </CTableDataCell>
                        </CTableRow>
                    ))
                  }
                </CTableBody>

                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
                  {/* ********************* delete modal ***********************  */}
                  <CModal
        visible={deleteModel}
        onClose={() => {
          setDeleteModel(false)
          setReqDeleteAdminId(null)
        }}
      >
        <CModalHeader>
          <CModalTitle>Delete Admin</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure want to delete this admin.</p>
        </CModalBody>
        <CModalFooter>
          <CButton
            onClick={() => {
              setDeleteModel(false)
              setReqDeleteAdminId(null)
            }}
            color="secondary"
          >
            Close
          </CButton>
          <CButton
            color="danger"
            style={{ color: 'white' }}
            onClick={() => handleDeleteAdmin(reqDeleteAdminId)}
          >
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Admin
