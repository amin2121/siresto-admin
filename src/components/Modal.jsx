import React from 'react';
import { ButtonLabelSecondary, ButtonSecondary } from './Button'

export const Modal = ({ 
  id, 
  children, 
  submitForm,
  titleModal,
  showButtonConfirm = true, 
  colorButtonConfirm = 'blue', 
  titleButtonConfirm = 'Simpan', 
  actionButtonConfirm,
  typeButtonConfirm,
  colorButtonClose = 'slate', 
  titleButtonClose = 'Tutup', 
  showButtonClose = false
}) => {
    let classNameButtonConfirm = `bg-${colorButtonConfirm}-400 text-${colorButtonConfirm}-900 hover:bg-${colorButtonConfirm}-600 focus-visible:ring-${colorButtonConfirm}-500`
    let classNameButtonClose = `bg-${colorButtonClose}-200 text-${colorButtonClose}-900 hover:bg-${colorButtonClose}-400 focus-visible:ring-${colorButtonClose}-500`

    return (
        <>
          <input type="checkbox" id={id} className="modal-toggle" />

          <div className="modal">
              <div className="modal-box">
                <form onSubmit={submitForm}>
                  <h3 className="font-bold text-lg">{titleModal}</h3>
                  {children}
                  <div className="modal-action space-x-3">
                    <label htmlFor={id} id="label-close"></label>
                    {showButtonConfirm == true && <ButtonSecondary type={typeButtonConfirm} onClick={() => document.getElementById('label-close').click()} title={titleButtonConfirm} className={classNameButtonConfirm}/>}
                    {showButtonClose == true && <ButtonLabelSecondary forId={id} title={titleButtonClose} id="btn-keluar" className={classNameButtonClose}/>}
                  </div>
                </form>
              </div>
          </div>
        </>
    );
};
