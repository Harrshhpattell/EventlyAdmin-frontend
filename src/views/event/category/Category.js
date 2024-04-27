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
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilLocationPin,
  cilNotes,
  cilPeople,
  cilTrash,
} from '@coreui/icons'

import WidgetsDropdown from '../../widgets/WidgetsDropdown'
import { deleteEventById, getAllUsers, getallevents, getallorders } from '../../../api'

const Dashboard = () => {
    const customTooltipStyle = {
        '--cui-tooltip-bg': 'var(--cui-primary)',
      }

    const linkIcon = (
    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
    </svg>
    )

  const [events, setEvents] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true);
  const [deleteModel, setDeleteModel] = useState(false)
  const [reqDeleteEventId, setReqDeleteEventId] = useState(null)
  const [viewModel, setViewModel] = useState(false)
  const [viewEventId, setViewEventId] = useState({})
  console.log("viewEventId", viewEventId)
  console.log("users", users)
  
    useEffect(() => {
      const fetchUsers = async () => {
        setLoading(true)
        try {
          const fetchedEvents = await getallevents()
          const fetchOrders = await getallorders()
          const fetchedUsers = await getAllUsers()
          setUsers(fetchedUsers)
          setOrders(fetchOrders)
          setEvents(fetchedEvents)
        } catch (error) {
          // Handle error
          console.error('Error fetching users:', error)
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsers()
    }, [])

    const handleDeleteEvent = async (eventId) => {
      try {
        await deleteEventById(eventId);
        // After successful deletion, fetch the updated events and update the state
        const updatedEvents = await getallevents();
        setEvents(updatedEvents);
        setDeleteModel(false)
        setReqDeleteEventId(null)
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric', 
          hour: 'numeric', 
          minute: 'numeric',
          hour12: true
        };
        return date.toLocaleString('en-US', options);
      }

      console.log("reqDeleteEventId",reqDeleteEventId)

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              Category ({' '}
              {
                events
                  .filter((item) => new Date(item.startDateTime) >= new Date())
                  .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)).length
              }{' '}
              )
            </CCardHeader>
            <CCardBody>
              <br />
              {loading ? (
                <div className="loaderSection">
                  <div className="loaders"></div>
                </div>
              ) : events.length === 0 ? (
                <div>NO DATA FOUND</div>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary">Category</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {events
                      .filter((item) => new Date(item.startDateTime) >= new Date())
                      .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
                      .map((item, index) => {
                        const ordersForEvent = orders?.filter((order) => order.event === item._id)
                        const orderCount = ordersForEvent.length

                        const organizer = users.find((user) => user._id === item.organizer)
                        return (
                          <CTableRow v-for="item in tableItems" key={index}>
                            <CTableDataCell>
                              <div>{item.title}</div>
                              <CTooltip
                                content={item.description}
                                placement="top"
                                style={customTooltipStyle}
                              >
                                <div className="small text-body-secondary text-nowrap">
                                  <span>{item.location}</span> |{' '}
                                  {item.description.length > 40
                                    ? `${item.description.slice(0, 40)}...`
                                    : item.description}
                                </div>
                              </CTooltip>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <div
                                  className="deteleButton"
                                  onClick={() => {
                                    setDeleteModel(!deleteModel)
                                    setReqDeleteEventId(item._id)
                                  }}
                                >
                                  <CIcon style={{ color: 'white' }} icon={cilTrash} />
                                </div>
                                <div
                                  className="viewBtn"
                                  onClick={() => {
                                    setViewModel(!viewModel)
                                    setViewEventId({
                                      id: item._id,
                                      title: item.title,
                                      location: item.location,
                                      description: item.description,
                                      image: item.imageUrl,
                                      organizerfn: organizer.firstName,
                                      organizerln: organizer.lastName,
                                      organizerEmail: organizer.email,
                                      start: item.startDateTime,
                                      end: item.endDateTime,
                                      price: item.isFree ? 'Free' : `$ ${item.price}`,
                                      eventurl: item.url,
                                      ordersForEvent,
                                    })
                                  }}
                                >
                                  <CIcon style={{ color: 'white' }} icon={cilNotes} />
                                </div>
                              </div>
                            </CTableDataCell>
                            {/* <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Updated At</div>
                        <div className="fw-semibold text-nowrap">{item.updatedAt && new Date(item.updatedAt).toLocaleString('en-IN', options)}</div>
                      </CTableDataCell> */}
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
    </>
  )
}

export default Dashboard
