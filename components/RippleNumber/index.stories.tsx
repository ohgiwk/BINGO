import React from 'react'
import RippleNumber from './'

const config = {
  title: 'RippleNumber',
}
export default config

export const defaultRippleNumber = () => (
  <RippleNumber
    {...{
      open: false,
      value: '0',
      ripple: false,
    }}
  />
)
export const openRippleNumber = () => (
  <RippleNumber
    {...{
      open: false,
      value: '0',
      ripple: false,
    }}
  />
)
