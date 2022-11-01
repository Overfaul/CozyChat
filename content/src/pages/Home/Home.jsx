
import React, { useEffect, useState } from 'react'

import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../websocket/socket';
import { getMeData } from '../../redux/asyncActions/meData';

// Icons

// Styles
import './Home.scss'
//
import DialogSearch from './сomponents/Sidepanel/DialogSearch';
import SearchFriend from './сomponents/Sidepanel/SearchFriend';
import ProfileMenu from './сomponents/Sidepanel/ProfileMenu';
import EditMenu from './сomponents/Sidepanel/EditMenu';
import ChatMain from './сomponents/Chat/ChatMain';
import instance from '../../api/axios'
import Api from '../../api/api'
export const api = new Api()

function Profile(props) {
  const navigate = useNavigate()
  const [auth, setAuth] = useState(api.isAuth)
  const [clicked, setClicked] = useState('dialog-search')
  const [userChatData, setUserChatData] = useState([])
  const [authorChatData, setAuthorChatData] = useState([])

  const [dialogData, setDialogData] = useState('')
  const [isOnline, setIsOnline] = useState('Offline')

  const dispatch = useDispatch()

  const me = useSelector(state => state.meinfo)
  // check if user authenticated if not then he has no access to url
  useEffect(() => {
    dispatch(getMeData())
  }, [])


  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('token')) {
        api.checkAuth()
        setAuth(api.isAuth)

      } else {
        navigate('/signup', { replace: true })
      }
    }
    checkAuth()
  }, [auth])



  /* sidepanel naviagtion */
  const goToProfile = () => { setClicked('goto-profile') }

  const goToCreateDialog = () => { setClicked('goto-crdialog') }

  const goToDialogs = () => { setClicked('dialog-search') }

  const goToEditMenu = () => { setClicked('goto-editmenu') }

  /*                        */


  const getUserChatData = (el) => { setUserChatData(el) }

  const getAuthorChatData = (el) => { setAuthorChatData(el) }

  /*
  const getMeData = (el) => {
    setMeData(el)
  }*/

  const getDialogData = (el) => { setDialogData(el) }

  /*useEffect(() => {
    socket.emit('connected', meData.id)
    socket.on('connected', (mes) => {
        const usersIds = mes.map(a => a.userId)
        setUsersStatus(Object.values(usersIds))
        setUserStatus(mes)
    })
}, [])*/

  socket.emit('connected', me.id)
  // if users socket id = authordata id then online
  return (
    <div className='home-container' id='main-home-container'>
      {clicked === 'dialog-search' && <DialogSearch goToProfile={goToProfile} goToCreateDialog={goToCreateDialog}
        getAuthorChatData={getAuthorChatData} getUserChatData={getUserChatData} getDialogData={getDialogData}
      />}
      {clicked === 'goto-profile' && <ProfileMenu goToDialogs={goToDialogs} goToEditMenu={goToEditMenu} />}
      {clicked === 'goto-crdialog' && <SearchFriend goToDialogs={goToDialogs} />}
      {clicked === 'goto-editmenu' && <EditMenu goToProfile={goToProfile} />}
      {authorChatData?.fullname ? <ChatMain
        isOnline={isOnline}
        authorData={authorChatData}
        userData={userChatData}
        dialogData={dialogData}
      /> : null}
    </div>
  );
}
export default Profile;
