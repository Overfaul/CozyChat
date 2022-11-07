import React, { useEffect, useState, useCallback } from 'react';
//
import cr_dialog from '../../../../assets/img/cr_dialog.svg'
import dialog_search from '../../../../assets/img/dialog_search.svg'
import focused_search_dialog from '../../../../assets/img/focused_search_dialog.svg'
import menu from '../../../../assets/img/menu.svg'
import ClickMenu from '../ClickMenu/ClickMenu';
import './DialogSearch.scss'
import instance from '../../../../api/axios'
import Api from '../../../../api/api'
import { socket } from '../../../../websocket/socket';
import { useDispatch, useSelector } from 'react-redux';

const api = new Api()

const DialogSearch = ({ goToProfile, goToCreateDialog, getUserChatData, getAuthorChatData, getDialogData }) => {
    const [userData, setUserData] = useState([])
    const [dialogId, setDialogId] = useState([])

    const [isActive, setIsActive] = useState(false);
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [show, setShow] = useState(false); // hide menu

    const [lastMessage, setLastMessage] = useState([])

    const [filteredData, setFilteredData] = useState([])
    const [newDialog, setNewDialog] = useState(null)



    const currentuser = useSelector(state => state.meinfo)

    useEffect(() => {
        if (newDialog !== null) {
            setFilteredData(prev => [...prev, newDialog])
            getDialogs()
        }
        getDialogs()
    }, [newDialog])

    socket.on('DIALOG:LAST_MESSAGE', (message_data) => {
        setLastMessage(message_data)
        moveDialogToTop(message_data)
    })

    const moveDialogToTop = (dialog_data) => {
        const found = userData.map(e => e.id).indexOf(dialog_data[0]?.dialogId)
        const dialogs = userData.slice()
        if (found > -1) {
            dialogs.unshift(dialogs.splice(found, 1)[0])
            setFilteredData(dialogs)
        }
    }

    const getDialogs = async function () {
        const meDataResponse = await instance.get('/me')
        const response = await instance.get('/dialogs')

        const data = await response.data.map(i => {
            i.author = i.users.find(el => el.id == i.authorId)
            i.partner = i.users.find(el => el.id == i.partnerId)
            i.user = i.users.find(el => {
                return el.id !== meDataResponse.data.id
            })
            return i
        })
            // sorting dialogs by their date
            .filter((el, i, arr) => el.user && arr.indexOf(el) === i)
            .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
            .reverse()


        const found = data.some(i => typeof i.user !== 'undefined')
        if (found){
            setUserData(data)
            setFilteredData(data)
        }
    }


    //  Leaving a dialog
    const leaveDialogHandler = async () => {
        const del = await instance.delete(`/dialogs/${dialogId}`)
        socket.emit('DIALOG:LEAVE_DIALOG', dialogId)
    }

    const removeDialogFromChat = (dialogid) => {
        setFilteredData(prev => prev.filter(el => el.id !== dialogid))
    }

    socket.on('DIALOG:LEAVE_DIALOG', (dialogId) => {
        removeDialogFromChat(dialogId) // remove dialiog
        getAuthorChatData(null); // remove chat
    })

    socket.on('DIALOG:NEW_DIALOG', user => {
        user.author = user.users.find(el => el.id == user.authorId)
        user.partner = user.users.find(el => el.id == user.partnerId)
        user.user = user.users.find(el => {
            return el.id !== currentuser.id
        })

        setNewDialog(user)
    })

    //  ContextMenu for Dialogs
    const handleContextMenu = useCallback(
        (event) => {
            event.preventDefault();
            document.querySelector('.dialog').style.cursor = 'default'
            setIsActive(true)
            setAnchorPoint({ x: event.pageX, y: event.pageY });
            setShow(true);
        },
        [setAnchorPoint]
    );


    const handleClick = useCallback(() => (show ? setShow(false) : null), [show])

    window.addEventListener('click', () => {
        handleClick()
    })

    const hmcont = document.getElementsByClassName("home-container")

    hmcont[0]?.addEventListener('contextmenu', () => {
        handleClick()
    });
    //


    const handleFilter = (event) => {
        const searchWord = event.target.value
        //setFilteredWord(searchWord)

        const userdata = userData.map(i => {
            return i
        })

        const filtered = userdata.filter(element => {

            return element.user.fullname.includes(searchWord)
        })

        setFilteredData(filtered)
    }

    return (
        <div className='dialog-container'>
            <div className='dialog-list-search'>
                <button className='go-to-menu-button' onClick={goToProfile} >
                    <img className='go-to-menu-icon' src={menu} alt="createdialog" />
                </button>
                <div className='dialog-list-searchpanel'>
                    <img src={dialog_search} className='dialog-search-icon' id="uncolored-icon" alt="dialog-search" />
                    <img src={focused_search_dialog} className='dialog-search-icon' id="colored-icon" alt="dialog-search" />
                    <input type="text" className='search-input' placeholder='Search a dialog' onChange={handleFilter} autoFocus />
                </div>
                <button className='create-dialog-button' onClick={goToCreateDialog}>
                    <img className='create-dialog-icon' src={cr_dialog} alt="createdialog" />
                </button>
            </div>
            <div className="dialogs" onClick={handleClick} >
                {
                    filteredData
                        .map((el, index) => {
                            return (
                                <div className="whole-dialog" key={index}>
                                    <ClickMenu anchorPoint={anchorPoint} show={show} dialog_id={dialogId} leaveDialogHandler={leaveDialogHandler} />
                                    <div className="dialog" onContextMenu={(e) => { handleContextMenu(e); setDialogId(el.user.user_dialog.dialogId) }}
                                        onClick={() => { getUserChatData(el.user); getAuthorChatData(el.author); setDialogId(el.id); getDialogData(el) }}
                                    >
                                        <img className='dialog-avatar' src={`http://localhost:3002/static/${el?.user?.avatar}`} alt="avatar" width="100px" />
                                        <div className="userinfo" >
                                            <h4 className="friendfullname">{el?.user?.fullname}</h4>
                                            <h4 className="lastmessage">{lastMessage[0]?.dialogId == el.user?.user_dialog?.dialogId
                                                ? (lastMessage[0]?.text.length > 30)
                                                    ? lastMessage[0]?.attachment && lastMessage[0]?.attachment != 'none' ? '(Photo) ' + lastMessage[0]?.text.slice(0, 30 - 1) + ' ...' : lastMessage[0]?.text.slice(0, 30 - 1) + ' ...'
                                                    : lastMessage[0]?.attachment && lastMessage[0]?.attachment != 'none' ? '(Photo) ' + lastMessage[0]?.text : lastMessage[0]?.text
                                                : (el?.lastmessage?.length > 30)
                                                    ? el?.attachment ? '(Photo) ' + el.lastmessage.slice(0, 30 - 1) + ' ...' : el.lastmessage.slice(0, 30 - 1) + ' ...'
                                                    : el?.attachment ? '(Photo) ' + el.lastmessage : el.lastmessage

                                            }</h4>
                                        </div>
                                    </div>
                                </div>

                            )
                        })

                }
            </div>
        </div>
    )


};


export default DialogSearch;