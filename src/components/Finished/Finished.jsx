import React from 'react';
import css from './Finished.module.css';
import BottomButton from '../UI/Button/BottomButton';

export const Finished = ({ title, className, scoreY, scoreX }) => {
  return (
    <div className={css.root}>
      <div className={`${css.textContainer} ${className}`}>
        <h1>{title}</h1>

        <p className={css.discription}>
            Ваш результат: {scoreX}
            <br/>
            Результат соперника: {scoreY}
        </p>
      </div>

      <BottomButton
        onClick={
          // TODO сделать клик по кнопке, который перезапускает игру с этими же пользователями (подумать об изменении или выборе ставки)
          () => null
        }
        text="Сыграть еще раз"
      />

    </div>
  );
};


