import React from 'react'
import './ClickMenu.scss'
import leave_dialog from '../../../../assets/img/delete.svg'

function ClickMenu({ show, anchorPoint, leaveDialogHandler}) {

    return (
        <div className="context-menu-container">
            {show ? (
                <div className="context-menu" style={{ top: anchorPoint.y, left: anchorPoint.x }}>

                    <button className='leave-dialog-button' onClick = {leaveDialogHandler}>
                        <img src={leave_dialog} alt="Leave dialog" className = 'leave-dialog-icon' />
                        <h4 className = 'leave-dialog-text'>Leave Dialog</h4>
                    </button>

                </div>
            ) : (
                <> </>
            )}
        </div>
    );
}
export default ClickMenu;