import { GoogleGenerativeAI } from "@google/generative-ai";
import './Chat.css';
import {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';

function Chat({file, chatMsg}) {

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    async function handleSendMessage(){
        if(input.length){
            let chatMessages = [...messages, {role:"user", text: input},{role:"loader", text: ""}];
            setInput("");
            setMessages(chatMessages);

            try{
                const result = await model.generateContent([
                    {
                        inlineData:{
                            data: file.file,
                            mimeType: file.type
                        }
                    },
                    `
                        Answer this question about the attached document: ${input}.
                        Answer as a chatbot
                        Chat history: ${JSON.stringify(messages)}
                    `
                ]);

                chatMessages = [...chatMessages.filter((msg)=>msg.role != 'loader'),{role:"model", text:result.response.text()}];
                setMessages(chatMessages)
                

            }catch(error){
                chatMessages = [...chatMessages.filter((msg)=>msg.role != 'loader'),{role:"error", text:"Error sending messages, please try again later."}];
                setMessages(chatMessages)
                console.log("error");
            }

        }
    }

    useEffect(()=>{
        setMessages([]);
        setInput(chatMsg);
    }, [file]);

    useEffect(()=>{
        if(input.length>0 && chatMsg.length>0 && messages.length == 0){
            handleSendMessage();
        }
    }, [input, messages]);

  return (
    <section className="chat-window">
        <h2>
            Chat
        </h2>
        {
            messages.length ?
            <div className="chat">
                {
                    messages.map((msg)=>(
                        <div className={msg.role} key={msg.text}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    ))
                }
            </div> :
            ''
        }
        <div className="input-area">
            <input 
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                type="text"
                placeholder="Ask any question about the uploaded document..." 
                />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    </section>
  )
}

export default Chat
