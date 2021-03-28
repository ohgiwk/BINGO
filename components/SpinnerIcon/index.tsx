import { makeStyles } from '@material-ui/core/styles'
import classNames from 'classnames'

export default function SpinnerIcon(props: { className?: string }) {
  const classes = useStyles()
  return (
    <div className={props.className}>
      <div className={classNames(classes.spinner)}>
        <div className={classNames(classes.inner, classes.bounce1)}></div>
        <div className={classNames(classes.inner, classes.bounce2)}></div>
        <div className={classNames(classes.inner)}></div>
      </div>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  spinner: {
    margin: '0 auto 0',
    width: '100px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  inner: {
    width: '18px',
    height: '18px',
    margin: '0.2rem 0.3rem 0',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '100%',
    display: 'inline-block',
    animation: '$bouncedelay 1.4s infinite ease-in-out both',
  },
  bounce1: { animationDelay: '-0.32s' },
  bounce2: { animationDelay: '-0.16s' },
  '@keyframes bouncedelay': {
    '0%, 80%, 100%': {
      transform: 'scale(0)',
    },
    '40%': {
      transform: 'scale(1.0)',
    },
  },
}))
