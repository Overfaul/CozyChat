import React, { useEffect, useState, useMemo } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
//Icons
import go_back from '../../../../assets/img/goback.svg'
import phone_icon from '../../../../assets/img/phone.svg'
import edit_profile_icon from '../../../../assets/img/editprofile.svg'
import notif_icon from '../../../../assets/img/notification.svg'
import language_icon from '../../../../assets/img/language.svg'
import logout_icon from '../../../../assets/img/logout.svg'
//
import DialogSearch from './DialogSearch';
import './ProfileMenu.scss'
import Api from '../../../../api/api'
import EditMenu from './EditMenu'
import instance from '../../../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
const api = new Api()

const ProfileMenu = ({goToDialogs, goToEditMenu}) => {
    const navigate = useNavigate()

    const [data, setData] = useState()
    const [loaded, setLoaded] = useState(false)

    const medata = useSelector(state => state.meinfo)

    const logoutHandler = async () => {
        api.logout()
        api.isAuth = false
        await instance.post('/userstatus', { userstatus: 'Offline' })
        navigate('/signup', { replace: true })
    }

    useEffect(() => {
        setData(medata)
        setLoaded(true)
    }, [])

    return (
        <div className='dialog-container'>
            <div className="header-menu">
                <button className='go-back-button' onClick={goToDialogs}>
                    <img className='go-back-icon' src={go_back} alt="Go Back" />
                </button>
                <h2 className= 'editprofile-text'>Settings</h2>
            </div>
            <div className="avatar">
                {loaded ? <img src={`http://localhost:3002/static/${data.avatar}`} width="100%" height = "100%" alt="" /> : ''}
            </div>
            <div className="information-list">

                <div className="info-panel">
                    <img className='phone-icon' src={phone_icon} alt="Go Back" />
                    <div className="userphone">
                        <h4 className="userphone-value">{data?.phone}</h4>
                        <h4 className="userphone-placeholder">Phone</h4>
                    </div>
                </div>

                <hr style={{ border: "2px solid #111111" }} />

                <div onClick={goToEditMenu} className="info-panel">
                    <img className='edit-icon' src={edit_profile_icon} alt="Go Back" />

                    <div className="editprofile">
                        <h4 className="profile-button">Edit profile</h4>
                    </div>
                </div>

                <div className="info-panel" style={{display: 'none'}}>
                    <img className='edit-icon' src={notif_icon} alt="Go Back" />

                    <div className="editprofile">
                        <button className="profile-button" id="notification-button">Notifications</button>
                    </div>
                </div>

                <div className="info-panel" style={{display: 'none'}}>
                    <img className='edit-icon' src={language_icon} alt="Go Back" />

                    <div className="editprofile">
                        <button className="profile-button" id="language-button">Language</button>
                    </div>
                </div>

                <div onClick={logoutHandler} className="info-panel">
                    <img className='edit-icon' src={logout_icon} alt="Go Back" />

                    <div className="editprofile">
                        <h4 className="profile-button">Log out</h4>
                    </div>
                </div>
            </div>
        </div>
    )


};


export default ProfileMenu;