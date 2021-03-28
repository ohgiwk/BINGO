import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classNames from 'classnames'

/**
 *
 * @param props
 * @returns
 */
const RippleNumber: React.FC<{
  value: string
  open: boolean
  ripple: boolean
  className?: string
}> = (props) => {
  const classes = useStyles()
  return (
    <div
      className={classNames(props.className, classes.num, classes.ripple, {
        [`${classes.onRipple}`]: props.open && props.ripple,
        [`${classes.open}`]: props.open,
      })}
    >
      {props.value}
    </div>
  )
}
export default RippleNumber

const useStyles = makeStyles((theme) => ({
  num: {
    fontSize: '2rem',
    color: 'gray',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    lineHeight: '40px',
    textAlign: 'center',
    userSelect: 'none',
    transition: 'color 0.5s, transform 0.4s',
    '&:hover': {
      transform: 'scale(1.4)',
    },
  },
  open: { color: theme.palette.primary.main },
  ripple: {
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: theme.palette.primary.main,
      borderRadius: '50%',
      width: 0,
      height: 0,
      opacity: 1,
      transition: 'opacity 1s, width 1s, height 1s',
    },
  },
  onRipple: {
    '&:after': {
      content: '',
      width: '150px',
      height: '150px',
      opacity: 0,
      transition: 'opacity 1s, width 1s, height 1s',
      pointerEvents: 'none',
    },
  },
}))
