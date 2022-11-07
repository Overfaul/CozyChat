import React, { useEffect, useState } from 'react';
//Icons
import go_back from '../../../../assets/img/goback.svg'
import add_photo from '../../../../assets/img/add-photo.svg'
//
import './EditMenu.scss'
import instance from '../../../../api/axios'
import Api from '../../../../api/api'
import { useDispatch, useSelector } from 'react-redux';
import { getMeData } from '../../../../redux/asyncActions/meData';


const api = new Api()

const EditMenu = ({ goToProfile }) => {
    const [userName, setUserName] = useState()
    const [userBio, setUserBio] = useState()
    const [img, setImg] = useState()
    const [avatar, setAvatar] = useState()

    const dispatch = useDispatch()
    //const [clicked, setClicked] = useState()

    useEffect(() => {
        const sendFile = async function () {
            try {
                if (img) {
                    const data = new FormData()
                    data.append('avatar', img)
                    await instance.post("/upload", data)
                        .then(res => {
                            setAvatar(res.data)
                        })
                    dispatch(getMeData())
                }

            } catch (e) {
                console.log(e)
            }
        }()
    }, [img])


    useEffect(() => {
        api.getMe().then(
            data => {
                setUserName(data.fullname)
                setUserBio(data.bio)
                setAvatar(data.avatar)
            }
        )
    }, [])

    const changeUserName = async (e) => {
        e.preventDefault()
        if (userName.length > 0){
            const res = await instance.post('/edituser', { username: userName, userbio: userBio })
            document.querySelector('.submit-edit-changes').value = 'Nice!'
            setTimeout(() => { document.querySelector('.submit-edit-changes').style.display = 'none' }, 500)
        }
    }
    const handleName = (e) => {
        setUserName(e.target.value)
        document.querySelector('.submit-edit-changes').style.display = 'inline-block'
    }
    const handleBio = (e) => {
        setUserBio(e.target.value)
        document.querySelector('.submit-edit-changes').style.display = 'inline-block'
    }

    return (
        <div className='dialog-container'>
            <div className="header-menu">
                <button className='go-back-button' onClick={goToProfile}>
                    <img className='go-back-icon' src={go_back} alt="Go Back" />
                </button>
                <h2 className='editprofile-text'>Edit profile</h2>
            </div>
            <div className="edit-profile-panel">
                <div className="edit-avatar">
                    {avatar ?
                        <img src={`http://localhost:3002/static/${avatar}`} className="edit-avatar-image" alt="Avatar" width="100%" height="100%" />
                        : null
                    }

                    <input type="file" className="edit-avatar-input" onChange={e => setImg(e.target.files[0])} />
                    <div className="avatar-background">
                        <img src={add_photo} alt="Add photo" id="add-photo" className="edit-avatar-icon" />
                    </div>
                </div>
                <form className="edit-info" onSubmit={e => changeUserName(e)}>
                    <input className="edit-nickname" type="text" maxLength={45} onChange={e => handleName(e)} value={userName || ''} />
                    <input className="edit-nickname" placeholder='Bio' maxLength={45} onChange={e => handleBio(e)} value={userBio || ''} />
                    <p className="bio-description">Any details such as age, occupation or city. Example: 23 y.o. designer from San Francisco</p>
                    <input className='submit-edit-changes' type="submit" value="Submit" style={{ display: 'none' }} />
                </form>
            </div>
        </div>
    )


};


export default EditMenu;