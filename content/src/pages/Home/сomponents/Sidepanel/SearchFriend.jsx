import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Icons
import go_back from '../../../../assets/img/goback.svg'
import dialog_search from '../../../../assets/img/dialog_search.svg'
import focused_search_dialog from '../../../../assets/img/focused_search_dialog.svg'
import add_friend from '../../../../assets/img/add_friend.svg'
// Styles
import './SearchFriend.scss'
//
import DialogSearch from './DialogSearch';
import instance from '../../../../api/axios'
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../../../websocket/socket';
import Api from '../../../../api/api'

const api = new Api()


const SearchFriend = ({goToDialogs}) => {
    const [user, setUser] = useState([])
    const [filteredData, setFilteredData] = useState([])

    const dispatch = useDispatch()
    const clicked = useSelector( state => state.clicked)

    const getAllUsers = async function () {
        const response = await instance.get('/users')
        setUser(response.data.map(i => {
            return [i.avatar, i.phone]
        }
        ))
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    const handleFilter = (event) => {
        const searchWord = event.target.value

        const userdata = user.map(i => {
            return [i[0], i[1]]
        })
        const filtered = userdata.filter(element => {

            return element[1].includes(searchWord)
        })
        setFilteredData(filtered)
    }

    const goBackHandler = () => {
        dispatch({type : "GO_DIALOGS", payload: 'go-dialog'})
    }

    const crDialog = async (user) => {
        const response = await instance.post('/dialogs', {partner_phone : user})
        socket.emit('DIALOG:NEW_DIALOG', response.data)
    }

    if (clicked == 'go-dialog') {
        return (
            <DialogSearch />
        )
    }

    return (
        <div className='dialog-container'>
            <div className='users-list-search'>
                <button className='go-back-button' onClick={goToDialogs}>
                    <img className='go-back-icon' src={go_back} alt="Go Back" />
                </button>
                <div className='users-list-searchpanel'>
                    <img src={dialog_search} className='users-search-icon' id="uncolored-icon" alt="users-search" />
                    <img src={focused_search_dialog} className='users-search-icon' id="colored-icon" alt="users-search" />
                    <input type="text" onChange={handleFilter} className='search-users-input' placeholder='Search a friend' />
                </div>
            </div>

            <div className='contacts-panel'>
                {
                    filteredData.map((el, index) => {
                        return (
                            <div className="friend-profile" key={index} onClick = {() =>{crDialog(el[1])}}>
                                <div className="friend-contact">
                                    <img className="friend-avatar" src={`http://localhost:3002/static/${el[0]}`} width="50px" />
                                    <div className="friend-info">
                                        <h2 className="friend-phone">{el[1]}</h2>
                                       
                                    </div>
                                </div>
                                <button className="button-add-friend">
                                    <img src={add_friend} alt="" />
                                </button>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
};


export default SearchFriend;