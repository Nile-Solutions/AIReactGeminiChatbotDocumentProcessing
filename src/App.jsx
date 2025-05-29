import Header from './components/Header'
import FileUpload from './components/FileUpload'
import Summary from './components/Summary'
import Chat from './components/Chat'

import { useState } from 'react'

function App() {

  const [uploadedFile, setUploadedFile] = useState(null);
  const [chatMessage, setChatMessage] = useState(null);

  return (
    <>
      <main className="container">
        <Header />
        <FileUpload setFile={setUploadedFile} setMessage={setChatMessage} />
        {
          (uploadedFile)?
            <>
              <Summary file={uploadedFile} />
              <Chat file={uploadedFile} chatMsg={chatMessage} />
            </>
          :
          <></>
        }
      </main>
    </>
  )
}

export default App
