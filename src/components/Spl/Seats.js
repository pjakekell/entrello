import React, { useRef, useEffect } from 'react'
import keys from 'lodash/keys'
import sortBy from 'lodash/sortBy'
import first from 'lodash/first'
import last from 'lodash/last'
import Seat from './Seat'
import classNames from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import {
  toggleSelectedShapes,
  getSelectedShapeIDs,
} from './logic'
import { setupDragging } from './drag'
import { FixtureText } from './Shapes/Fixture'

function SeatGroup({ sgrId, seats, spl, svgRef }) {
  const { sgrId: activeSgrId } = useSelector(getSelectedShapeIDs)
  const ref = useRef()

  useEffect(() => {
    if (sgrId !== activeSgrId) return
    setupDragging(svgRef.current, ref.current)
    return
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSgrId])

  return (
    <g
      ref={ref}
      className={classNames('sgr', { active: activeSgrId === sgrId })}
    >
      {seats.map(seat => (
        <Seat
          key={`seat-${seat.id}`}
          spl={spl}
          svgRef={svgRef} seat={seat}
        />
      ))}
    </g>
  )
}

function FreeStandingSection({ svgRef, spl, seats, section }) {
  const { secId: activeSecId } = useSelector(toggleSelectedShapes)
  const dispatch = useDispatch()
  const ref = useRef()
  useEffect(() => {
    if (section.id !== activeSecId) return
    setupDragging(svgRef.current, ref.current)
    return
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSecId])
  const sortedSeats = sortBy(seats, seat => seat.location[0] * seat.location[1])
  const firstSeat = { x: first(sortedSeats).location[0], y: first(sortedSeats).location[1] }
  const lastSeat = { x: last(sortedSeats).location[0], y: last(sortedSeats).location[1] }
  const pct = spl.price_categories.find(pct => pct.id === first(sortedSeats).price_category_id)
  const handleClick = () => dispatch(toggleSelectedShapes({ secId: section.id }))
  const coords = {
    x: firstSeat.x,
    y: firstSeat.y,
    width: lastSeat.x - firstSeat.x,
    height: lastSeat.y - firstSeat.y,
  }

  return (
    <g
      ref={ref}
      className={classNames('sec', { active: activeSecId === section.id })}
      onClick={handleClick}
    >
      <rect
        {...coords}
        style={{ fill: pct && pct.color }}
      />
      <FixtureText fixture={{ ...coords, desc: section.name }} />
    </g>
  )
}

function Section({ secId, sgrs, spl, svgRef }) {
  const { secId: activeSecId } = useSelector(toggleSelectedShapes)
  const ref = useRef()
  const seats = spl.seats.filter(seat => seat.section_id === secId)

  useEffect(() => {
    if (secId !== activeSecId) return
    setupDragging(svgRef.current, ref.current)
    return
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSecId])

  const section = spl.sections.find(sec => sec.id === secId)
  if (section && section.free_standing)
    return <FreeStandingSection svgRef={svgRef} seats={seats} spl={spl} section={section} />

  return (
    <g
      ref={ref}
      className={classNames('sec', { active: activeSecId === secId })}
    >
      {keys(sgrs).map(sgrId => (
        <SeatGroup
          key={`sgr-${sgrId}`}
          svgRef={svgRef}
          spl={spl}
          sgrId={sgrId}
          seats={sgrs[sgrId]}
        />
      ))}
    </g>
  )
}

export default function Seats({ spl, svgRef }) {

  const struct = {}

  const addSeat = seat => {
    struct[seat.section_id] = struct[seat.section_id] || {}
    struct[seat.section_id][seat.seat_group_id] = struct[seat.section_id][seat.seat_group_id] || []
    struct[seat.section_id][seat.seat_group_id].push(seat)
  }
  spl.seats.forEach(seat => addSeat(seat))

  return (
    <g className="seats">
      {keys(struct).map(secId => (
        <Section
          key={`sec-${secId}`}
          svgRef={svgRef}
          secId={secId}
          spl={spl}
          sgrs={struct[secId]}
        />
      ))}
    </g>
  )
}