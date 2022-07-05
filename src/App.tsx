import React, {ChangeEvent, useEffect, useState} from 'react';
import s from './app.module.scss'
import userPhoto from './assets/image/userPhoto.png'
import {v1} from 'uuid';

function App() {
    const [message, setMessage] = useState('')
    const [ws, setWs] = useState<WebSocket | null>(null)

    const [users, setUsers] = useState([
        {
            userId: v1(),
            photo: userPhoto,
            userName: 'Bob',
            message: 'content content content content content content content '
        }
    ])
    useEffect(() => {
        let localWs = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx')
        setWs(localWs)
        localWs.onmessage = (messageEvent) => {
            console.log(JSON.parse(messageEvent.data))
            setUsers(JSON.parse(messageEvent.data))
        }
    }, [])

    const onChangeTextHandle = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.currentTarget.value)
    }

    const addMessageHandle = () => {
        ws!.send(message)
    }

    return (
        <div className={s.container}>
            <div className={s.messagesBlock}>
                {users.map((u, i) => <div key={i} className={s.message}>
                        <img className={s.photo} src={u.photo} alt="userPhoto"/>
                        <div className={s.textBlock}>
                            <span className={s.userName}>{u.userName}</span>
                            <span className={s.text}>{u.message}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className={s.inputBlock}>
                <textarea value={message}
                          onChange={onChangeTextHandle}
                          className={s.textarea}
                          placeholder='your message'
                          name="textarea"
                          id="textarea"></textarea>
                <button onClick={addMessageHandle} className={s.button}>send</button>
            </div>

        </div>
    );
}

export default App;
