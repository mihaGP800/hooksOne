import React, {ChangeEvent, MutableRefObject, useEffect, useRef, useState} from 'react';
import s from './app.module.scss'
import userPhoto from './assets/image/userPhoto.png'


type UserType = {
    userId: number
    photo: string,
    userName: string
    message: string
}

type UsersType = UserType[]

function App() {

    const messagesBlockRef = useRef<HTMLDivElement>(null)

    const [message, setMessage] = useState('')
    const [ws, setWs] = useState<WebSocket | null>(null)

    const [users, setUsers] = useState<UsersType>([])

    if (ws) ws.onmessage = (messageEvent) => {
        console.log(JSON.parse(messageEvent.data))
        setUsers([...users, ...JSON.parse(messageEvent.data)])

        if (messagesBlockRef.current) messagesBlockRef.current.scrollTo(0, messagesBlockRef.current.scrollHeight)
    }

    useEffect(() => {
        let localWs = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx')
        setWs(localWs)

    }, [])

    const onChangeTextHandle = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.currentTarget.value)
    }

    const addMessageHandle = () => {
        ws!.send(message)
        setMessage('')
    }

    return (
        <div className={s.container}>
            <div ref={messagesBlockRef} className={s.messagesBlock}>
                {users.map((u, i) => <div key={i} className={s.message}>
                        <img className={s.photo} src={u.photo ? u.photo : userPhoto}
                             alt="userPhoto"/>
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
