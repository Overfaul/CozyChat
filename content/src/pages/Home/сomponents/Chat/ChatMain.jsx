import React, { useEffect, useState, useRef, useCallback } from 'react'
import './ChatMain.scss';
import './ChatHeader.scss';
import './ChatMenu.scss'
import { useDispatch, useSelector } from 'react-redux';
import delele_attach from '../../../../assets/img/delete-attach.svg'

import EmojiPicker, {
    Theme
} from "emoji-picker-react";

import find_message_search from '../../../../assets/img/find_message_search.svg'
import profile_panel from '../../../../assets/img/profile_panel.svg'
import instance from '../../../../api/axios'
import { socket } from '../../../../websocket/socket';

// Context Menu
import leave_dialog from '../../../../assets/img/delete.svg'
import reply_icon from '../../../../assets/img/reply.svg'
import edit_icon from '../../../../assets/img/edit_message.svg'
import copy_icon from '../../../../assets/img/copy_text.svg'
//
import RepliedContainer from './RepliedContainer/RepliedContainer';
//

const ChatMain = ({ userData, dialogData }) => {
    const [message, setMessage] = useState('')
    const [usersMessages, setUsersMessages] = useState([])
    const [img, setImg] = useState()
    const [attach, setAttach] = useState()
    //
    const [status, setStatus] = useState(false)

    //EmojiPanel
    const [emojiPanel, setEmojiPanel] = useState(false)

    //ContextMenu
    const [isActive, setIsActive] = useState(false);
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [show, setShow] = useState(false); // hide menu
    const [perm, setPerm] = useState()

    const [edited, setEdited] = useState(false)
    //
    const [newMessage, setNewMessage] = useState([])
    const [delMessage, setDelMessage] = useState('')
    const [editedMessage, setEditedMessage] = useState('')
    const [editedMessageId, setEditedMessageId] = useState('')
    const [senderID, setSenderId] = useState('')

    // REDUX
    const dispatch = useDispatch()
    const repliedState = useSelector(state => state.reply)
    const messageState = useSelector(state => state.message)
    const currentuser = useSelector(state => state.meinfo)


    /* UserStatus */
    socket.on('connected', (mes) => {
        const usersIds = mes.map(a => a.userId)
        const stat = usersIds.find(i => i === userData.id)
        if (stat) {
            setStatus(true)
        } else {
            setStatus(false)
        }
    })

    /*useEffect(() => {
        const lastmes = usersMessages.at(-1)
        console.log(lastmes)
        if(typeof lastmes !== 'undefined'){
            socket.emit('DIALOG:LAST_MESSAGE', [lastmes])
        }else{
            socket.emit('DIALOG:LAST_MESSAGE', [{text: '', dialogId: dialogData.id}])
        }
    }, [usersMessages])*/

    socket.on('disconnected', (mes) => {
        const usersIds = mes.map(a => a.userId)
        const stat = usersIds.find(i => i === userData.id)
        if (!stat) {
            setStatus(false)
        }
    })

    const setRepliedInfo = () => {
        dispatch({
            type: "SET_REPLY_INFO", payload: {
                repliedStatus: true,
                repliedMes: messageState.message,
                repliedName: messageState.name,
                repliedImg: messageState.image
            }
        })
    }

    const closeRepliedWindow = () => {
        dispatch({ type: "SET_REPLY_INFO", payload: { repliedStatus: false } })
    }

    const setMessageInfo = (data) => {
        dispatch({ type: "SET_MESSAGE_INFO", payload: data })
    }



    function onClick(emojiData, event) {
        setMessage(message ? message + emojiData.emoji : emojiData.emoji);
    }

    useEffect(() => {
        if (repliedState.repliedStatus || edited) {
            document.getElementsByClassName('messages-container')[0].style.height = '81.3vh'
        } else {
            document.getElementsByClassName('messages-container')[0].style.height = '86.5vh'
        }
    })

    useEffect(() => {
        const sendAttach = async () => {
            if (img) {
                const attachdata = new FormData()
                attachdata.append('attachment', img)
                await instance.post("/attachment", attachdata)
                    .then(res => {
                        setAttach(res.data)
                    })
            }
        }
        sendAttach()
    }, [img])

    /* Copy message */
    const copyTextMessage = (data) => {
        navigator.clipboard.writeText(data)
    }

    /* Delete message */
    const deleteMessage = async (event) => {
        event.preventDefault()
        const response = await instance.delete(`/messages/${messageState.id}?dialogid=${dialogData.id}`)
        //console.log(selectedMesId)

        setMessage(null)


        console.log(messageState)
        const getLastMes = removeMessageFromChat(messageState.id)
        setLastMesAfter(getLastMes.at(-1))

        const senderId = currentuser.id
        socket.emit('DIALOG:DELETE_MESSAGE', { mes_id: messageState.id, sender_id: senderId })

    }

    const removeMessageFromChat = (messageId) => {
        const found = usersMessages.map(e => {
            return e.id
        }
        ).indexOf(messageId)
        const messages = usersMessages.slice()
        if (found > -1) {
            messages.splice(found, 1)
            setUsersMessages(messages)
            return messages
        }
    }

    socket.on('DIALOG:DELETE_MESSAGE', ({ mes_id, sender_id }) => {
        setSenderId(sender_id)
        setDelMessage(mes_id)
    })


    useEffect(() => {
        if (senderID === dialogData.user.id) {
            removeMessageFromChat(delMessage)
        }
    }, [delMessage, dialogData])

    // Setting last message after delete or edit (if the last el was edited or deleted)
    const setLastMesAfter = (getLastMes) => {
        if (typeof getLastMes !== 'undefined') {
            socket.emit('DIALOG:LAST_MESSAGE', [getLastMes])
        } else {
            socket.emit('DIALOG:LAST_MESSAGE', [{ text: '', dialogId: dialogData.id }])
        }
    }

    //

    /* Edit message */
    const editMessage = async (event) => {
        event.preventDefault()
        const data = {
            message_id: messageState.id,
            message: messageState.message,
            edited_message: message,
            dialogid: dialogData.id
        }
        const selectedMesId = messageState.id
        const response = await instance.post('/messages/edit', data)

        setMessage(null)
        setEdited(null)

        const getLastMes = editChatMessage(messageState.id, message)
        setLastMesAfter(getLastMes.at(-1))

        const senderId = currentuser.id
        socket.emit('DIALOG:EDIT_MESSAGE', { messageId: selectedMesId, editedMessage: message, sender_id: senderId })
    }

    const editChatMessage = (messageId, editedMessage) => {
            const found = usersMessages.map(e => e.id).indexOf(messageId)
            const messages = usersMessages.slice()
            if (found > -1) {
                messages[found].text = editedMessage
                setUsersMessages(messages)

                return messages
            }
    }

    useEffect(() => {
        if (senderID === dialogData.user.id) {
            editChatMessage(editedMessageId, editedMessage)
        }
    }, [editedMessageId, dialogData])

    // socket on 'DIALOG:EDIT_MESSAGE' getMessages()
    socket.on('DIALOG:EDIT_MESSAGE', ({ messageId, editedMessage, sender_id }) => {
        setSenderId(sender_id)
        setEditedMessage(editedMessage)
        setEditedMessageId(messageId)
    })

    /* Send message */
    const sendMessage = async (event) => {
        event.preventDefault()
        if (message?.length >= 1 || attach) {
            const data = {
                user_message: message ? message : '',
                dialog_id: dialogData.id,
                attach: attach
            }

            if (repliedState.repliedStatus) {
                data.repliedName = repliedState.repliedName
                data.repliedMes = repliedState.repliedMes
                data.repliedImg = repliedState.repliedImg
            }

            const response = await instance.post('/messages', data)
            //console.log(response.data)

            const mesdata = [{
                id: response.data.id,
                attachment: response.data.attachment != 'none' ? response.data.attachment : null,
                creator: {
                    id: response.data.creator.id,
                    avatar: response.data.creator.avatar,
                    fullname: response.data.creator.fullname,
                    sentTime: response.data.sentTime,
                    //
                },
                dialogId: dialogData.id,
                repliedImage: response.data.repliedImage,
                repliedMessage: response.data.repliedMessage,
                repliedUsername: response.data.repliedUsername,
                text: response.data.text
            }]

            /*
            let messageBody = document.getElementsByClassName('messages-container')[0]
            messageBody.scrollTop = messageBody?.scrollHeight - messageBody?.clientHeight;
            */

            if (mesdata && socket.connected) {
                const senderId = currentuser.id
                const recieverId = userData.id
                socket.emit('DIALOG:NEW_MESSAGE', { senderId, recieverId, mesdata })
                //setNewMessage({mesdata, senderId})
                setUsersMessages(prev => [...prev, mesdata[0]])
                //setNewMessage(mesdata)
                //setSenderId(senderId)
                //console.log(mesdata)
                socket.emit('DIALOG:LAST_MESSAGE', mesdata)

                setMessage(null)
                setAttach(null)
                closeRepliedWindow()
            }
        }

    }

    useEffect(() => {
        if (senderID === dialogData.user.id) {
            setUsersMessages(prev => [...prev, newMessage[0]])
        }

    }, [newMessage, dialogData])

    socket.on('DIALOG:GET_MESSAGE', ({ senderId, mesdata }) => {
        //console.log(mesdata)
        setSenderId(senderId)
        setNewMessage(mesdata)
    })

    const getMessages = async () => {
        setUsersMessages([])  // not to show previous dialog messages
        const response = await instance.get(`/messages/${dialogData.id}`)
        response.data.map(i => {
            setUsersMessages(i.messages.map(b => {
                return b
            }))
        })

        //socket.emit("DIALOG:JOIN", dialog_id)
    }

    useEffect(() => {
        getMessages()
    }, [dialogData])

    // Scroll to bottom
    useEffect(() => {
        let messageBody = document.getElementsByClassName('messages-container')[0]
        messageBody.scrollTop = messageBody?.scrollHeight
        //messageBody.scrollTop = messageBody?.scrollHeight - messageBody?.clientHeight;
    }, [usersMessages])

    //  ContextMenu
    const handleContextMenu = useCallback(
        (e) => {
            e.preventDefault();
            document.querySelector(".messages-container").style.overflow = 'hidden'
            const contextMenu = document.querySelector('.context-menu-container')
            const mescont = document.querySelector(".messages-container")
            //const {innerWidth, innerHeight} = mescont;
            const { offsetWidth, offsetHeight } = mescont;

            if (e.clientY > offsetHeight - 100) {
                setAnchorPoint({ x: e.clientX, y: e.clientY - 150 });
            } else {
                setAnchorPoint({ x: e.clientX, y: e.clientY });
            }
            setIsActive(true)
            setShow(true);

        },
        [setAnchorPoint]
    );

    const handleClick = useCallback(() => {
        if (show) {
            setShow(false)
            document.querySelector(".messages-container").style.overflow = 'auto'
        }
    }, [show])

    window.addEventListener('click', () => {
        handleClick()
    })
    //home-container
    const hmcont = document.getElementsByClassName("home-container")

    hmcont[0].addEventListener('contextmenu', () => {
        handleClick()
    });

    return (
        <div className='chatmain-container' onClick={handleClick}>

            <div className='chat-header-container'>
                <div className="content">
                    <div className='friend-status-container'>
                        <div className='user-avatar'>
                            <img className="dialog-friend-avatar" src={`http://localhost:3002/static/${userData.avatar}`} alt="Friend's Avatar" />
                            {status ? <span className='status'></span> : null}
                        </div>

                        <div className="dialog-friend-statusinfo">
                            <h4 className="dialog-friend-fullname">{userData.fullname}</h4>
                            <h4 className="dialog-friend-bio">{userData.bio}</h4>
                        </div>
                    </div>
                    <div className='search-settings-container'>
                        <button className='search-input-button'>
                            <img src={find_message_search} className='search-input-icon' alt="find a message" />
                        </button>
                        <button className='profile-settings-button'>
                            <img src={profile_panel} className='profile-settings-icon' alt="profile panel" />
                        </button>
                    </div>
                </div>
            </div>
            <div className='messages-container'>
                {
                    usersMessages
                        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                        .map((i, index) => {
                            return (
                                <div className="user-message" key={index} >

                                    {/* Context Menu*/}
                                    {show ? (
                                        <div className="context-menu-message" style={{ top: anchorPoint.y == 100 ? '100%' : anchorPoint.y, left: anchorPoint.x }}>

                                            <button className='contextmenu-button' onClick={setRepliedInfo}>
                                                <img src={reply_icon} alt="Reply" className='contextmenu-icon' />
                                                <h4 className='contextmenu-text'>Reply</h4>
                                            </button>

                                            <button className='contextmenu-button' style={perm ? { display: 'flex' } : { display: 'none' }}
                                                onClick={() => {
                                                    setEdited(true)
                                                }}
                                            >
                                                <img src={edit_icon} alt="Leave dialog" className='contextmenu-icon' loading="lazy" />
                                                <h4 className='contextmenu-text'>Edit</h4>
                                            </button>
                                            <button className='contextmenu-button' onClick={() => copyTextMessage(messageState.message)}>
                                                <img src={copy_icon} alt="Leave dialog" className='contextmenu-icon' loading="lazy" />
                                                <h4 className='contextmenu-text'>Copy Text</h4>
                                            </button>
                                            <button className='contextmenu-button' style={perm ? { display: 'flex' } : { display: 'none' }}
                                                onClick={deleteMessage}
                                            >
                                                <img src={leave_dialog} alt="Leave dialog" className='contextmenu-icon' loading="lazy" />
                                                <h4 className='contextmenu-text'>Delete</h4>
                                            </button>

                                        </div>
                                    ) : (
                                        <> </>
                                    )}
                                    {/* Context Menu */}

                                    <img className='message-friend-avatar' src={`http://localhost:3002/static/${i?.creator?.avatar}`} alt="Friend's Avatar" width="50px" />
                                    <div className="message-info" onContextMenu={(e) => {
                                        handleContextMenu(e);
                                        i.creator.id == currentuser.id ? setPerm(true) : setPerm(false);
                                        /*setSelectedMessage(i.text)
                                        setSelectedName(i.creator.fullname)
                                        setSelectedImage(i.attachment)
                                        setSelectedMesId(i.id)*/
                                        setMessageInfo({
                                            message: i.text,
                                            name: i.creator.fullname,
                                            image: i.attachment,
                                            id: i.id,
                                            dialog_id: i.dialogId
                                        })
                                    }}>
                                        <h4 className="message-friend-nickname">{i?.creator?.fullname}</h4>
                                        <div className="message-friend-text">
                                            {/* If message replied than add replied info */}
                                            {
                                                i?.repliedMessage || i?.repliedImage ?
                                                    <div className="replied-message-container">
                                                        {i.repliedImage != 'none' && i.repliedImage !== null ? <img src={`http://localhost:3002/static/${i.repliedImage}`} className="replied-message-image" alt="repliedImage" /> : null}
                                                        <div className="repliedmessage-content">
                                                            <h4 className="replied-message-username">{i.repliedUsername}</h4>
                                                            <h4 className="replied-message-text">{i.repliedMessage}</h4>
                                                        </div>

                                                    </div>
                                                    : null
                                            }

                                            <div className="attachment">
                                                {i?.attachment != 'none' && i?.attachment !== null && typeof i?.attachment !== 'undefined' ? <img className='message-attachment' src={`http://localhost:3002/static/${i.attachment}`} width="50px" />
                                                    : null}
                                            </div>
                                            {i?.text}
                                            <span className="message-friend-date">{i?.sentTime ? i?.sentTime : i?.creator?.sentTime}</span>
                                        </div>
                                    </div>

                                </div>

                            )
                        })
                }
                <div className="emoji">
                    {emojiPanel ?
                        <EmojiPicker
                            onEmojiClick={onClick}
                            autoFocusSearch={false}
                            theme={Theme.DARK}
                        />
                        : null
                    }
                </div>
            </div>

            <div className='message-input-container'>

                {/* Replied Message */}
                <RepliedContainer />

                {/* Edited Message */}
                {edited ?
                    <div className="reply-container">
                        <span className='reply-icon'>
                            <i className="fa-solid fa-pen"></i>
                        </span>
                        <div className="reply-info">
                            <div className="repmessage">
                                <h4 className='edit-message-header'>Edit Message</h4>
                                <h4 className='reply-message'>{messageState.message}</h4>
                            </div>
                        </div>

                        <span className='close-reply-icon' onClick={() => { setEdited(false); setMessage(null) }}>
                            <i className="fa-solid fa-xmark"></i>
                        </span>
                    </div>
                    : null
                }

                {/* Message Input */}
                <div className="message-input">
                    {attach ?
                        <div className="attachment-container" onClick={() => { setAttach(null) }}>
                            <div className="attachment-background">
                                <img src={delele_attach} alt="Leave dialog" className='contextmenu-icon' />
                            </div>
                            <img src={`http://localhost:3002/static/${attach}`} className="attachment-image" alt="Attachment" />
                        </div>
                        : ''
                    }


                    <form className="message-modified-input" onSubmit={(e) => { edited ? editMessage(e) : sendMessage(e) }}>
                        <input className='message-input' placeholder='Write...' value={message || ''} onChange={e => setMessage(e.target.value)} />
                        <div className='attachment-block'>
                            <input type="file" className="add-attachment-input" onChange={e => setImg(e.target.files[0])} />
                            <button className='attachment-icon'>
                                <i className="fa-solid fa-paperclip"></i>
                            </button>
                        </div>
                        <div className="emoji-block">
                            <span className='attachment-icon' onClick={() => setEmojiPanel(!emojiPanel)}>
                                <i className="fa-regular fa-face-smile-wink"></i>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default ChatMain;