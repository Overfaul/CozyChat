import React, { useEffect, useState } from 'react'
import { useNavigate, Link, } from "react-router-dom"
import './GettingStarted.scss'
import Api from '../../api/api'
export const api = new Api()

function GettingStarted() {

    return (
        <div className='gs-main'>
            <h1 className='gs-top-text'>A convinient chat for private talking</h1>
            <Link to="/signup">
                <button className='button'>
                    Getting Started
                </button>
            </Link>
        </div>
    )
}

export default GettingStarted;
