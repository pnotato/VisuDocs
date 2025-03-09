import './Home.css'
import { io } from "socket.io-client";
import Button from '../Button/Button';

const socket = io("ws://localhost:3000")

export default function Home() {
    return (

        <div className='interface'>
            <div className='user-projects-list'>

            </div>
            <div className='user-info'>
                <div className='user-options'>
                    <Button Label="Sign In" onClick={''} />
                </div>

            </div>
        </div>

    )
}