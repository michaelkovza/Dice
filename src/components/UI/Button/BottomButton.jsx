import React from 'react'
import classes from './BottomButton.module.css'

function BottomButton({ text, ...props }) {
  return (
    <div>
      <button {...props} className={classes.BottomButton}>
        {text}
      </button>
    </div>
  )
}

export default BottomButton
