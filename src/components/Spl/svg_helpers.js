export const calcSelectionDims = (cursor, coords) => {
  let dims = {}
  if (!cursor && coords)
    return { ...coords, startX: coords.x, startY: coords.y }
  if (!cursor || !coords)
    return null

  dims = {...cursor, ...coords}

  dims.width = cursor.startX < coords.x
    ? coords.x - cursor.startX
    : cursor.startX - coords.x

  dims.height = cursor.startY < coords.y
    ? coords.y - cursor.startY
    : cursor.startY - coords.y

  return dims
}