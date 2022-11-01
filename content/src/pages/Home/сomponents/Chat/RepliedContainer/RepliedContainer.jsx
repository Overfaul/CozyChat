import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function RepliedContainer() {
    const dispatch = useDispatch()
    const repliedState = useSelector(state => state.reply)

    const closeRepliedWindow = () => {
        dispatch({type: "SET_REPLY_INFO", payload: { repliedStatus: false }})
    }
    return (
        <div>
            {repliedState.repliedStatus ?
                    <div className="reply-container">
                        <span className='reply-icon'>
                            <i className="fa-solid fa-reply"></i>
                        </span>
                        <div className="reply-info">
                            {repliedState.repliedImg != 'none' && repliedState.repliedImg !== null ? <img src={`http://localhost:3002/static/${repliedState.repliedImg}`} className='reply-image' alt="repliedImage" /> : null}
                            <div className="repmessage">
                                <h4 className='reply-username'>{repliedState.repliedName}</h4>
                                <h4 className='reply-message'>{repliedState.repliedMes}</h4>
                            </div>
                        </div>

                        <span className='close-reply-icon' onClick={closeRepliedWindow}>
                            <i className="fa-solid fa-xmark"></i>
                        </span>
                    </div>
                    : null
            }
        </div>
    );
}
export default RepliedContainer;

/*

edited ?
                        <div className="reply-container">
                            <span className='reply-icon'>
                                <i class="fa-solid fa-pen"></i>
                            </span>
                            <div className="reply-info">
                                <div className="repmessage">
                                    <h4 className='edit-message-header'>Edit Message</h4>
                                    <h4 className='reply-message'>{selectedMessage}</h4>
                                </div>
                            </div>

                            <span className='close-reply-icon' onClick={() => { setEdited(false); setMessage(null) }}>
                                <i class="fa-solid fa-xmark"></i>
                            </span>
                        </div>
                        : null
*/