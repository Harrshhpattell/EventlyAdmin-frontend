/* eslint-disable */
import React, { useEffect, useState } from 'react'
import "./styles.css"
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
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
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilLocationPin,
  cilNotes,
  cilPencil,
  cilPeople,
  cilPlus,
  cilTrash,
} from '@coreui/icons'

import WidgetsDropdown from '../../widgets/WidgetsDropdown'
import { categoryDeleteApi, categoryGetApi, categoryPostApi, categoryUpdateApi, deleteEventById, getAllUsers, getallevents, getallorders } from '../../../api'
import logo from '../../../assets/brand/logo.png';

const Dashboard = () => {


  const [loading, setLoading] = useState(true);
  const [viewAddModel, setViewAddModel] = useState(false)
  const [category, setCategory] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [toastMessage, setToastMessage] = useState(null)
  const [deleteModel, setDeleteModel] = useState(false)
  const [reqDeleteCategoryId, setReqDeleteCategoryId] = useState(null)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState({ id: null, name: '' });
  
  
  const fetchCategory = async () => {
    setLoading(true)
    try {
      const fetchedCategory = await categoryGetApi()
      setCategory(fetchedCategory)
    } catch (error) {
      // Handle error
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
      fetchCategory()
    }, [])

    function handleAddNewCategory(e) {
      e.preventDefault()
        categoryPostApi({ name: newCategory })
        .then(data => {
            console.log('Category added successfully:', data);
            fetchCategory()
            setViewAddModel(false)
            setNewCategory('')
            setToastMessage('Category added successfully')
        })
        .catch(error => {
            console.error('Error adding category:', error);
            setToastMessage('Category Already Exists')
        });
    }

    const handleCloseToast = (index) => {
      setToastMessage(null)
    }

    const handleDeleteCategory = async (categoryId) => {
      try {
        await categoryDeleteApi(categoryId);
        // After successful deletion, fetch the updated events and update the state
        fetchCategory()
        setDeleteModel(false)
        setReqDeleteCategoryId(null)
        setToastMessage('Category deleted successfully')
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    };

  // Function to handle opening the edit category modal
  const handleOpenEditModal = (categoryId, categoryName) => {
    setEditCategoryData({ id: categoryId, name: categoryName });
    setEditModalVisible(true);
  };

  const handleUpdateCategory = async () => {
    try {
      await categoryUpdateApi(editCategoryData.id, { name: editCategoryData.name });
  
      setEditModalVisible(false);
      fetchCategory();
      setToastMessage('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setToastMessage(error.response.data.message);
      } else {
        setToastMessage('An error occurred while updating category');
      }
    }
  };

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
      <WidgetsDropdown className="mb-4" />
      <CRow> 
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                    Category ({' '}
                  {
                    category.length
                  }{' '}
                  )
                </div>
                <div>
                <CButton color="primary" onClick={() => setViewAddModel(true)}><CIcon style={{ color: 'white' }} icon={cilPlus} /> Add New Category</CButton>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              <br />
              {loading ? (
                <div className="loaderSection">
                  <div className="loaders"></div>
                </div>
              ) : category.length === 0 ? (
                <div>NO DATA FOUND</div>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary">Category</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">EventCount</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {category.map((item, index) => {
                        return (
                          <CTableRow v-for="item in tableItems" key={index}>
                            <CTableDataCell>
                              <div>{item.name}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                            <div
                                  className="viewBtn1"
                                >
                                  {item.eventCount}
                                </div>
                              {/* <div>{item.eventCount}</div> */}
                            </CTableDataCell>
                            <CTableDataCell>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <div
                                  className="deteleButton"
                                  onClick={() => {
                                    setDeleteModel(!deleteModel)
                                    setReqDeleteCategoryId(item._id)
                                  }}
                                >
                                  <CIcon style={{ color: 'white' }} icon={cilTrash} />
                                </div>
                                <div
                                  className="viewBtn"
                                  onClick={() => handleOpenEditModal(item._id, item.name)}
                                >
                                  <CIcon style={{ color: 'white' }} icon={cilPencil} />
                                </div>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        )
                      })}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
            {/* ********************* Add New Category Modal ***********************  */}
            <CModal
        visible={viewAddModel}
        onClose={() => {
          setViewAddModel(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>Add new category</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CForm>
          <CFormInput
            type="text"
            id="FormControlInput1"
            // label="Email address"
            placeholder="category name"
            aria-describedby="exampleFormControlInputHelpInline"
            onChange={(e) => setNewCategory(e.target.value)}
            value={newCategory}
          />
        </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            disabled={newCategory.length < 2}
            onClick={handleAddNewCategory}
          >
            Add
          </CButton>
          <CButton
            color="danger"
            onClick={() => {
              setViewAddModel(false)
            }}
            style={{ color: 'white' }}
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
            {/* ********************* delete modal ***********************  */}
            <CModal
        visible={deleteModel}
        onClose={() => {
          setDeleteModel(false)
          setReqDeleteCategoryId(null)
        }}
      >
        <CModalHeader>
          <CModalTitle>Delete Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure want to delete.</p>
        </CModalBody>
        <CModalFooter>
          <CButton
            onClick={() => {
              setDeleteModel(false)
              setReqDeleteCategoryId(null)
            }}
            color="secondary"
          >
            Close
          </CButton>
          <CButton
            color="danger"
            style={{ color: 'white' }}
            onClick={() => handleDeleteCategory(reqDeleteCategoryId)}
          >
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
                  {/* ********************* Edit Category Modal ***********************  */}
                  <CModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false)
        }}
      >
        <CModalHeader>
          <CModalTitle>Edit category</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CForm>
          <CFormInput
            type="text"
            id="FormControlInput1"
            // label="Email address"
            placeholder="category name"
            aria-describedby="exampleFormControlInputHelpInline"
            onChange={(e) => setEditCategoryData({ ...editCategoryData, name: e.target.value })}
            value={editCategoryData.name}
          />
        </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            disabled={editCategoryData.name.length < 2}
            onClick={handleUpdateCategory}
          >
            Update
          </CButton>
          <CButton
            color="danger"
            onClick={() => setEditModalVisible(false)}
            style={{ color: 'white' }}
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Dashboard
