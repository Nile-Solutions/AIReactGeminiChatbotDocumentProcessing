import {Buffer} from 'buffer';
import './FileUpload.css';
import { useEffect, useState, useRef } from 'react';

function FileUpload({setFile, setMessage}) {

    const [selectedValue, setSelectedValue] = useState(0);

    const fileInputRef = useRef(null);

    let data=[{
        file: "/data/JD_WebDev.pdf",
        type: "application/pdf",
        title: "AI Job Interview Asst. (Virtual asst.)",
        message: "Ask questions to candidates matching this job description",
    },{
        file: "/data/TDF-tours.pdf",
        type: "application/pdf",
        title: "Get insights & recmmd.s (Recmmd. engine)",
        message: "You are a data analyst. Could you please provide me with insights and recommendations on this dataset?",
    },{
        file: "/data/PA_data.pdf",
        type: "application/pdf",
        title: "Analyzing the data (Performance analysis)",
        message: "Please provide performance analysis for this document",
    }]

    function onSelectChange(event) {
        setSelectedValue(event.target.value);
        fileInputRef.current.value = null;
    }

    useEffect(() => {

        const fetchFile = async () => {
            try {
                const response = await fetch(data[selectedValue].file);
                const fileArrayBuffer = await response.arrayBuffer();
                const file = {
                    type: data[selectedValue].type,
                    file: Buffer.from(fileArrayBuffer).toString('base64'),
                    imageUrl: data[selectedValue].file
                }
                setFile(file);
                setMessage(data[selectedValue].message);
            } catch (e) {
                console.log(e);
            }
        };
        if(selectedValue>=0)
            fetchFile();

    }, [selectedValue]);

    async function handleFileUpload(event){
        if(event.target.files.length>0){
            const fileUpload = await event.target.files[0].arrayBuffer();
            const file = {
                type: event.target.files[0].type,
                file: Buffer.from(fileUpload).toString('base64'),
                imageUrl:URL.createObjectURL(event.target.files[0])
            }
            setFile(file);
            setMessage("");
            setSelectedValue(-1);
        }
    }

  return (
    <section>
        <div className="template-selector">
            <label>Choose a template for file and message demo:</label>
            <select value={selectedValue} onChange={onSelectChange}>
                <option value="-1">None</option>
                {data.map((option,index) => (
                    <option key={index} value={index}>
                    {option.title}
                    </option>
                ))}
            </select>
        </div>
        <h3 className='divider'>OR</h3>
        <label>Upload your own file here and send message below:</label>
        <input 
            className="fl"
            type="file" 
            accept=".pdf, .jpg, .jpeg, .png" 
            onChange={handleFileUpload}
            ref={fileInputRef}
            />
        <hr />
    </section>
  )
}

export default FileUpload
