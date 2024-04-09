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
              Upcomings Events ({' '}
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
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        <CIcon icon={cilPeople} />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Title</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Organizer</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Start Date, Time
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        End Date, Time
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Price</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">URL</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        <CIcon icon={cilPeople} />
                      </CTableHeaderCell>
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
                            <CTableDataCell className="text-center">
                              <CAvatar size="md" src={item.imageUrl} />
                            </CTableDataCell>
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
                              <div>
                                {organizer ? organizer.firstName : 'Unknown'}{' '}
                                {organizer ? organizer.lastName : 'Unknown'}
                              </div>
                              <div className="small text-body-secondary text-nowrap">
                                <span>{organizer ? organizer.email : 'Unknown'}</span>
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{formatDate(item.startDateTime)}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{formatDate(item.endDateTime)}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{item.isFree ? 'Free' : `$ ${item.price}`}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                              {/* <div>{item.clerkId}</div> */}
                              <a href={`${item.url}`} target="_blank" rel="noopener noreferrer">
                                <span>{linkIcon}</span>
                              </a>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{orderCount}</div>
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
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              Past Events ({' '}
              {
                events
                  .filter((item) => new Date(item.startDateTime) <= new Date())
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
                      <CTableHeaderCell className="bg-body-tertiary text-center">
                        <CIcon icon={cilPeople} />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Title</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Organizer</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Start Date, Time
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        End Date, Time
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Price</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">URL</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        <CIcon icon={cilPeople} />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {events
                      .filter((item) => new Date(item.startDateTime) <= new Date())
                      .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
                      .map((item, index) => {
                        const ordersForEvent = orders.filter((order) => order.event === item._id)
                        const orderCount = ordersForEvent.length

                        const organizer = users.find((user) => user._id === item.organizer)
                        return (
                          <CTableRow v-for="item in tableItems" key={index}>
                            <CTableDataCell className="text-center">
                              <CAvatar size="md" src={item.imageUrl} />
                            </CTableDataCell>
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
                              <div>
                                {organizer ? organizer.firstName : 'Unknown'}{' '}
                                {organizer ? organizer.lastName : 'Unknown'}
                              </div>
                              <div className="small text-body-secondary text-nowrap">
                                <span>{organizer ? organizer.email : 'Unknown'}</span>
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{formatDate(item.startDateTime)}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{formatDate(item.endDateTime)}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{item.isFree ? 'Free' : `$ ${item.price}`}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                              {/* <div>{item.clerkId}</div> */}
                              <a href={`${item.url}`} target="_blank" rel="noopener noreferrer">
                                <span>{linkIcon}</span>
                              </a>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div>{orderCount}</div>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div style={{ display: 'flex' }}>
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
      {/* ********************* delete modal ***********************  */}
      <CModal
        visible={deleteModel}
        onClose={() => {
          setDeleteModel(false)
          setReqDeleteEventId(null)
        }}
      >
        <CModalHeader>
          <CModalTitle>Delete Event</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure want to delete.</p>
        </CModalBody>
        <CModalFooter>
          <CButton
            onClick={() => {
              setDeleteModel(false)
              setReqDeleteEventId(null)
            }}
            color="secondary"
          >
            Close
          </CButton>
          <CButton
            color="danger"
            style={{ color: 'white' }}
            onClick={() => handleDeleteEvent(reqDeleteEventId)}
          >
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
      {/* **************** View modal ************************ */}
      <CModal
        size="xl"
        visible={viewModel}
        onClose={() => {
          setViewModel(false)
          setViewEventId({})
        }}
      >
        <CModalHeader>
          <CModalTitle>
            <h4 style={{ textTransform: 'capitalize' }}>
              {viewEventId.title} ({viewEventId.price})
            </h4>
            <p>
              {formatDate(viewEventId.start)} To {formatDate(viewEventId.end)}
            </p>
          </CModalTitle>
          {/* <CModalTitle>{formatDate(viewEventId.start)} to {formatDate(viewEventId.end)}</CModalTitle> */}
        </CModalHeader>
        <CModalBody>
          <div style={{ marginBottom: '20px' }}>
            <CImage fluid src={viewEventId.image} />
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <CInputGroup className="has-validation">
                <CInputGroupText>Event Id</CInputGroupText>
                <CFormInput
                  type="text"
                  aria-describedby="inputGroupPrependFeedback"
                  id="validationCustomUsername"
                  value={viewEventId.id}
                  disabled
                  readOnly
                />
              </CInputGroup>
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <CInputGroup className="has-validation">
                <CInputGroupText>Title</CInputGroupText>
                <CFormInput
                  type="text"
                  aria-describedby="inputGroupPrependFeedback"
                  feedbackValid="Please choose a username."
                  value={viewEventId.title}
                  disabled
                  readOnly
                />
              </CInputGroup>
            </div>
          </div>
          {/* ------------------------ */}
          <div style={{ display: 'flex', gap: '20px', margin: '20px 0', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <CInputGroup className="has-validation">
                <CInputGroupText>Event Url</CInputGroupText>
                <CFormInput
                  type="text"
                  aria-describedby="inputGroupPrependFeedback"
                  id="validationCustomUsername"
                  value={viewEventId.eventurl}
                  disabled
                  readOnly
                />
              </CInputGroup>
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <CInputGroup className="has-validation">
                <CInputGroupText>
                  <CIcon icon={cilLocationPin} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  aria-describedby="inputGroupPrependFeedback"
                  value={viewEventId.location}
                  disabled
                  readOnly
                />
              </CInputGroup>
            </div>
          </div>
          <CInputGroup className="has-validation">
            <CInputGroupText>Description</CInputGroupText>
            <CFormInput
              type="text"
              aria-describedby="inputGroupPrependFeedback"
              value={viewEventId.description}
              disabled
              readOnly
            />
          </CInputGroup>
          <hr />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <h4>
              Organizer: {viewEventId.organizerfn} {viewEventId.organizerln}
            </h4>
            <p style={{ margin: 0 }}>{viewEventId.organizerEmail}</p>
          </div>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">name</CTableHeaderCell>
                <CTableHeaderCell scope="col">CreatedAt</CTableHeaderCell>
                <CTableHeaderCell scope="col">StripId</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
            {viewEventId.ordersForEvent?.length === 0 ? (
              <p>No Data Found</p>
            ) : (
              viewEventId.ordersForEvent?.map((parti)=>{
                const user = users.find(user => user._id === parti.buyer);
                console.log("user",user)
                return(
                  <CTableRow>
                  <CTableDataCell>{user.firstName}</CTableDataCell>
                  <CTableDataCell>{formatDate(parti.createdAt)}</CTableDataCell>
                  <CTableDataCell>{parti.stripeId}</CTableDataCell>
                </CTableRow>
                )
              })
            )}

            </CTableBody>
          </CTable>
        </CModalBody>
        <CModalFooter>
          <CButton
            onClick={() => {
              setViewModel(false)
              setViewEventId({})
            }}
            color="secondary"
          >
            Close
          </CButton>
          {/* <CButton color="danger" style={{color: "white"}}>View</CButton> */}
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Dashboard
