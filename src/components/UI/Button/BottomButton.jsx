import React from 'react'
import css from './BottomButton.module.css'

function BottomButton({ text, ...props }) {
  return (
    <div>
      <button {...props} className={css.root}>
        {text}
      </button>
    </div>
  )
}

export default BottomButton
