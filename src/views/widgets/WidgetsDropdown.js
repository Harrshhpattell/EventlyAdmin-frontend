/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { getAllUsers, getEventsCountByMonth, getUsersCountByMonth, getallevents } from '../../api'

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  const [users, setUsers] = useState([])
  const [getUsersMonthWise, setGetUsersMonthWise] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers()
        setUsers(fetchedUsers)
      } catch (error) {
        // Handle error
        console.error('Error fetching users:', error)
      }
    };
    const getUsersCounts = async () => {
      try {
        const getUsersCount = await getUsersCountByMonth()
        setGetUsersMonthWise(getUsersCount)
      } catch (error) {
        // Handle error
        console.error('Error fetching getUsersCountByMonth:', error)
      }
    };

    fetchUsers()
    getUsersCounts()
  }, [])


  const [events, setEvents] = useState([])
  const [getEventsMonthWise, setGetEventsMonthWise] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getallevents()
        setEvents(fetchedEvents)
      } catch (error) {
        // Handle error
        console.error('Error fetching users:', error)
      }
    };
    const getEventsCounts = async () => {
      try {
        const getEventsCount = await getEventsCountByMonth()
        setGetEventsMonthWise(getEventsCount)
      } catch (error) {
        // Handle error
        console.error('Error fetching getUsersCountByMonth:', error)
      }
    };

    fetchEvents()
    getEventsCounts()
  }, [])

  // calculating increasing or decreasing rate
  const eventsForCurrentMonth = events.filter(event => {
    const eventDate = new Date(event.startDateTime);
    return eventDate.getMonth() === new Date().getMonth();
  });
  const eventsCountForCurrentMonth = eventsForCurrentMonth.length;
  
  // Get the number of events for the previous month (March)
  const previousMonth = new Date().getMonth() - 1;
  const eventsForPreviousMonth = events.filter(event => {
    const eventDate = new Date(event.startDateTime);
    return eventDate.getMonth() === previousMonth;
  });
  const eventsCountForPreviousMonth = eventsForPreviousMonth.length;
  
  // Calculate the percentage increase
  const percentageIncrease = ((eventsCountForCurrentMonth - eventsCountForPreviousMonth) / eventsCountForPreviousMonth) * 100;
  const arrowIcon = percentageIncrease >= 0 ? cilArrowTop : cilArrowBottom;

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {users?.length}
              {/* <span className="fs-6 fw-normal">
                (-12.4% <CIcon icon={cilArrowBottom} />)
              </span> */}
            </>
          }
          title="Total Users"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '70px', color: "#5856D6" }}
              data={{
                labels: [`January ${getUsersMonthWise[0]}`, `February ${getUsersMonthWise[1]}`, `March ${getUsersMonthWise[2]}`, `April ${getUsersMonthWise[3]}`, `May ${getUsersMonthWise[4]}`, `June ${getUsersMonthWise[5]}`, `July ${getUsersMonthWise[6]}`, `August ${getUsersMonthWise[7]}`, `September ${getUsersMonthWise[8]}`, `October ${getUsersMonthWise[9]}`, `November ${getUsersMonthWise[10]}`, `December ${getUsersMonthWise[11]}`],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    // data: [65, 59, 84, 84, 51, 55, 40],
                    data: getUsersMonthWise,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -1,
                    // max: 10,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              {events.length}{" "}
              <span className="fs-6 fw-normal">
                ({percentageIncrease.toFixed(1)}% <CIcon icon={arrowIcon} />)
              </span>
            </>
          }
          title="Total Events"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '70px', color: "#4F99FF"  }}
              data={{
                labels: [`January ${getEventsMonthWise[0]}`, `February ${getEventsMonthWise[1]}`, `March ${getEventsMonthWise[2]}`, `April ${getEventsMonthWise[3]}`, `May ${getEventsMonthWise[4]}`, `June ${getEventsMonthWise[5]}`, `July ${getEventsMonthWise[6]}`, `August ${getEventsMonthWise[7]}`, `September ${getEventsMonthWise[8]}`, `October ${getEventsMonthWise[9]}`, `November ${getEventsMonthWise[10]}`, `December ${getEventsMonthWise[11]}`],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: getEventsMonthWise,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -1,
                    // max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      {/* <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              2.49%{' '}
              <span className="fs-6 fw-normal">
                (84.7% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title="Conversion Rate"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={
            <>
              44K{' '}
              <span className="fs-6 fw-normal">
                (-23.6% <CIcon icon={cilArrowBottom} />)
              </span>
            </>
          }
          title="Sessions"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                  'January',
                  'February',
                  'March',
                  'April',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol> */}
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
