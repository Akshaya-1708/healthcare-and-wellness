import React, { useMemo, useState } from 'react'
import {
  Card,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Button,
  Typography,
  Space,
} from 'antd'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from 'react-redux'
import { saveEntry } from '../../../app/redux/goalSlice'
import { logEvent } from '../../../app/redux/auditSlice'

const { Title, Text } = Typography

const MOCK_PATIENT_ID = 'patient-demo-1'
const MOCK_PATIENT_NAME = 'Jane Doe'

function GoalTracker() {
  const dispatch = useDispatch()
  const goals = useSelector((state) => state.goals.goals)
  const entries = useSelector((state) => state.goals.entries)

  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [values, setValues] = useState({}) // goalId -> number | null (typed values)

  const dateKey = selectedDate.format('YYYY-MM-DD')

  // All stored values for this date from Redux
  const storedForDate = entries[dateKey] || {}

  // When date changes, reset local edited values so we show what's in Redux for that date
  const handleDateChange = (d) => {
    if (!d) return
    setSelectedDate(d)
    setValues({})
  }

  // Respect "empty" (null) values from the input
  const getCurrentValue = (goalId) => {
    // If user has typed something (including cleared to null), use local state
    if (Object.prototype.hasOwnProperty.call(values, goalId)) {
      return values[goalId] // number | null
    }

    // Else use value stored for this date from Redux
    return storedForDate[goalId] ?? null
  }

  const handleChangeValue = (goalId, v) => {
    // v can be number or null
    setValues((prev) => ({ ...prev, [goalId]: v }))
  }

  const handleSave = (goal) => {
    const rawVal = getCurrentValue(goal.id)
    if (rawVal === null || isNaN(rawVal)) return

    const val = Number(rawVal)

    const entry = {
      id: `entry-${Date.now()}-${goal.id}`,
      patientId: MOCK_PATIENT_ID,
      goalId: goal.id,
      date: dateKey,
      value: val,
    }

    dispatch(saveEntry(entry))

    dispatch(
      logEvent({
        action: 'GOAL_LOGGED',
        details: `Goal ${entry.goalId} logged for ${entry.date} with value ${entry.value}`,
      })
    )
  }

  const totalProgress = useMemo(() => {
    if (!goals.length) return 0
    let sum = 0
    goals.forEach((g) => {
      const current = getCurrentValue(g.id)
      const numericCurrent =
        typeof current === 'number' && !isNaN(current) ? current : 0
      if (numericCurrent > 0 && g.dailyTarget > 0) {
        sum += Math.min(100, Math.round((numericCurrent / g.dailyTarget) * 100))
      }
    })
    return Math.round(sum / goals.length)
  }, [goals, storedForDate, values, dateKey])

  const renderIcon = (goal) => {
    if (goal.type === 'steps') return '👣'
    if (goal.type === 'sleep') return '🌙'
    return '⏱️' // water -> Active Time icon
  }

  const renderTitle = (goal) => {
    if (goal.type === 'steps') return 'Steps'
    if (goal.type === 'sleep') return 'Sleep'
    return 'Active Time'
  }

  return (
    <div style={{ padding: 16 }}>
      {/* Top bar (date + overall status) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={4} style={{ marginBottom: 0 }}>
            Hi, {MOCK_PATIENT_NAME}
          </Title>
          <Text type="secondary">Here’s your wellness overview.</Text>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Text type="secondary" style={{ display: 'block' }}>
            Date
          </Text>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            allowClear={false}
            size="middle"
          />
          <div style={{ marginTop: 4, fontSize: 12 }}>
            Overall progress: <strong>{totalProgress}%</strong>
          </div>
        </div>
      </div>

      <Row gutter={[12, 12]}>
        {goals.map((goal) => {
          const rawCurrent = getCurrentValue(goal.id) // number | null
          const current =
            typeof rawCurrent === 'number' && !isNaN(rawCurrent)
              ? rawCurrent
              : null
          const target = goal.dailyTarget

          const numericCurrent = current !== null ? current : 0
          const percent =
            numericCurrent > 0 && target > 0
              ? Math.min(100, Math.round((numericCurrent / target) * 100))
              : 0

          const isSleep = goal.type === 'sleep'
          const isSteps = goal.type === 'steps'

          return (
            <Col xs={24} key={goal.id}>
              <Card
                bodyStyle={{ padding: 16 }}
                style={{
                  borderRadius: 22,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 5px 12px rgba(15,15,30,0.03)',
                }}
              >
                {/* Top row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 12,
                  }}
                >
                  <Space align="start">
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#fff5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                      }}
                    >
                      {renderIcon(goal)}
                    </div>
                    <div>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          display: 'block',
                        }}
                      >
                        {renderTitle(goal)}
                      </Text>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>
                        {isSleep ? (
                          <>
                            {Math.floor(numericCurrent)} hrs{' '}
                            {Math.round((numericCurrent % 1) * 60)} mins
                          </>
                        ) : (
                          numericCurrent
                        )}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        /{target} {goal.unit}
                      </Text>
                    </div>
                  </Space>

                  <div style={{ textAlign: 'right', fontSize: 11 }}>
                    {/* {!isSteps && !isSleep && (
                      <>
                        <Text type="secondary" style={{ display: 'block' }}>
                          {numericCurrent} mins
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          1712 Kcal · 1.23 km
                        </Text>
                      </>
                    )} */}
                    {isSleep && (
                      <Text type="secondary" style={{ display: 'block' }}>
                        11:30 pm – 06:00 am
                      </Text>
                    )}
                  </div>
                </div>

                {/* Middle: progress */}
                <div style={{ marginBottom: 12 }}>
                  {isSleep ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginTop: 4,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: 10,
                          borderRadius: 999,
                          overflow: 'hidden',
                          display: 'flex',
                        }}
                      >
                        <div style={{ flex: 2, background: '#ffd666' }} />
                        <div style={{ flex: 1, background: '#69c0ff' }} />
                        <div style={{ flex: 1.5, background: '#ff85c0' }} />
                        <div style={{ flex: 1, background: '#b7eb8f' }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          width: '100%',
                          height: 16,
                          borderRadius: 999,
                          background: '#ffe5e5',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${percent}%`,
                            height: '100%',
                            background: '#ff9f9f',
                          }}
                        />
                      </div>
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 12,
                          fontWeight: 500,
                          color: '#ff7875',
                          textAlign: 'center',
                        }}
                      >
                        {percent}%
                      </div>
                    </>
                  )}
                </div>

                {/* Bottom: input + save */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 12, color: '#999' }}>
                    Update value for {dateKey}
                  </span>
                  <Space>
                    <InputNumber
                      size="small"
                      value={current} // number or null
                      min={0}
                      onChange={(v) => handleChangeValue(goal.id, v)}
                    />
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleSave(goal)}
                    >
                      Save
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default GoalTracker
