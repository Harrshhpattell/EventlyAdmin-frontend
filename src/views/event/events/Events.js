/* eslint-disable */
import React, { useEffect, useState } from 'react'

import {
  CAvatar,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
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
  cilPeople,
} from '@coreui/icons'

import WidgetsDropdown from '../../widgets/WidgetsDropdown'
import { getAllUsers, getallevents, getallorders } from '../../../api'

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

  
    useEffect(() => {
      const fetchUsers = async () => {
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
        }
      };
  
      fetchUsers()
    }, [])

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

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Upcomings Events ( {events.filter(item => new Date(item.startDateTime) >= new Date()).sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)).length} )</CCardHeader>
            <CCardBody>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Title</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Organizer</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Start Date, Time</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">End Date, Time</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Price</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">URL</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {events.filter(item => new Date(item.startDateTime) >= new Date()).sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)).map((item, index) => {
                    const ordersForEvent = orders.filter(order => order.event === item._id);
                    const orderCount = ordersForEvent.length;

                    const organizer = users.find(user => user._id === item.organizer);
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
                            style={customTooltipStyle}>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{item.location}</span> | {item.description.length > 40 ? `${item.description.slice(0, 40)}...` : item.description}
                        </div>
                          </CTooltip>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{organizer ? organizer.firstName : "Unknown"} {organizer ? organizer.lastName : "Unknown"}</div>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{organizer ? organizer.email : "Unknown"}</span>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                      <div>{formatDate(item.startDateTime)}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                      <div>{formatDate(item.endDateTime)}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                      <div>{item.isFree ? "Free" : `$ ${item.price}`}</div>
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
                      {/* <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Updated At</div>
                        <div className="fw-semibold text-nowrap">{item.updatedAt && new Date(item.updatedAt).toLocaleString('en-IN', options)}</div>
                      </CTableDataCell> */}
                    </CTableRow>
                  )})}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Past Events ( {events.filter(item => new Date(item.startDateTime) <= new Date()).length} )</CCardHeader>
            <CCardBody>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Title</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Organizer</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Start Date, Time</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">End Date, Time</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Price</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">URL</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {events.filter(item => new Date(item.startDateTime) <= new Date()).sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)).map((item, index) => {
                    const ordersForEvent = orders.filter(order => order.event === item._id);
                    const orderCount = ordersForEvent.length;
                    const organizer = users.find(user => user._id === item.organizer);
                    return(
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.imageUrl} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.title}</div>
                        <CTooltip
                            content={item.description}
                            placement="top"
                            style={customTooltipStyle}>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{item.location}</span> | {item.description.length > 40 ? `${item.description.slice(0, 40)}...` : item.description}
                        </div>
                          </CTooltip>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{organizer ? organizer.firstName : "Unknown"} {organizer ? organizer.lastName : "Unknown"}</div>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{organizer ? organizer.email : "Unknown"}</span>
                        </div>
                      </CTableDataCell> 
                      <CTableDataCell>
                      <div>{formatDate(item.startDateTime)}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                      <div>{formatDate(item.endDateTime)}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                      <div>{item.isFree ? "Free" : `$ ${item.price}`}</div>
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
                      {/* <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Updated At</div>
                        <div className="fw-semibold text-nowrap">{item.updatedAt && new Date(item.updatedAt).toLocaleString('en-IN', options)}</div>
                      </CTableDataCell> */}
                    </CTableRow>
                  )})}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
