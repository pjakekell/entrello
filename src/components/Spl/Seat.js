import React, { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import {
  getSelectedShapeIDs,
  toggleSelectedShapes,
} from './logic'
// import { setupDragging } from './drag'

export default function Seat({ seat, spl, svgRef }) {
  const ref = useRef()
  const { seatId, secId, sgrId } = useSelector(getSelectedShapeIDs)
  const pct = spl.price_categories.find(pct => pct.id === seat.price_id)
  let color
  if (pct) color = pct.color
  const dispatch = useDispatch()
  const handleClick = () => {
    if (sgrId === seat.seat_group_id) return dispatch(toggleSelectedShapes({ seatId: seat.id }))
    if (secId === seat.section_id) return dispatch(toggleSelectedShapes({ sgrId: seat.seat_group_id }))
    dispatch(toggleSelectedShapes({ secId: seat.section_id}))
  }

  useEffect(() => {
    if (seatId !== seat.id) return
    // setupDragging(svgRef.current, ref.current)
    return
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seatId])
  
  return (
    <g
      className={classNames('seat', { active: seatId === seat.id })}
      onClick={handleClick}
      ref={ref}
    >
      <circle
        cx={seat.location[0]}
        cy={seat.location[1]}
        style={{ stroke: color, fill: 'white', strokeWidth: 40, margin: 30 }}
        r={440 / 2}
      />
    </g>
  )
}
