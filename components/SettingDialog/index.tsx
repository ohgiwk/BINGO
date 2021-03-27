import { useState, useContext } from 'react'
import * as MUI from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SettingsIcon from '@material-ui/icons/Settings'

import { AppContext } from 'contexts/AppContext'
import { THEME_COLORS } from 'common/constants'

const SettingDialog = (props: { className?: string }) => {
  const classes = useStyles()

  const { primaryColor, setPrimaryColor } = useContext(AppContext)

  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState(0)
  const [selectedColor, setSelectedColor] = useState(primaryColor)

  function onClickSave() {
    setOpen(false)
  }
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue)
  }

  function onClickColor(color: string) {
    setSelectedColor(color)
    setPrimaryColor(color)
  }

  return (
    <>
      <MUI.IconButton onClick={() => setOpen(true)} className={props.className}>
        <SettingsIcon />
      </MUI.IconButton>

      <MUI.Dialog open={open} fullWidth>
        <MUI.DialogContent>
          <MUI.Tabs
            value={tab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <MUI.Tab label="操作" />
            <MUI.Tab label="UI" />
          </MUI.Tabs>

          <div className={classes.label}>テーマカラー</div>
          <div className={classes.colors}>
            {THEME_COLORS.map((c, i) => (
              <div
                key={i}
                className={classes.color}
                onClick={() => onClickColor(c)}
                style={{
                  transform: `scale(${selectedColor === c ? 1.2 : 1})`,
                  zIndex: selectedColor === c ? 2 : 1,

                  background: c,
                }}
              ></div>
            ))}
          </div>
          <div className={classes.label}>マスの開け方</div>
          <MUI.RadioGroup>
            <MUI.FormControlLabel
              value="manual"
              control={<MUI.Radio color="primary" />}
              label="手動"
            />
            <MUI.FormControlLabel
              value="auto"
              control={<MUI.Radio color="primary" />}
              label="自動"
            />
          </MUI.RadioGroup>
        </MUI.DialogContent>

        <MUI.DialogActions>
          <MUI.Button color="primary" onClick={() => setOpen(false)}>
            キャンセル
          </MUI.Button>
          <MUI.Button
            variant="contained"
            color="primary"
            className={classes.save}
            onClick={onClickSave}
          >
            保存
          </MUI.Button>
        </MUI.DialogActions>
      </MUI.Dialog>
    </>
  )
}

const useStyles = makeStyles(() => ({
  label: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: '1rem',
  },
  colors: {
    margin: '1rem',
    textAlign: 'center',
  },
  color: {
    display: 'inline-block',
    width: '100px',
    height: '35px',
    margin: '0 10px',
    position: 'relative',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.4)',

    transitionDuration: '0.2s',
  },
  save: {
    color: '#fff',
    fontWeight: 'bold',
  },
}))
export default SettingDialog
