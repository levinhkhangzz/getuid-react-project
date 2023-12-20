import React, { useState } from 'react';
import './facebookUidTool.css'; // Import any necessary CSS file

const App = () => {
  const [facebookLink, setFacebookLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => {
      hidePopup();
    }, 5000);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const getUid = () => {
    setLoading(true);

    if (facebookLink.startsWith('https://fb.com/')) {
      const correctedLink = facebookLink.replace('https://fb.com/', 'https://facebook.com/');
      setFacebookLink(correctedLink);

      const apiUrl = `https://fbuid.mktsoftware.net/api/v1/fbprofile?url=${encodeURIComponent(correctedLink)}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);

          if (data.uid) {
            setFacebookLink(data.uid);
            showPopup('UID Obtained Successfully!');
          } else {
            showPopup('Error: UID not found or an API error occurred.');
          }
        })
        .catch((error) => {
          setLoading(false);
          showPopup('Error: ' + error.message);
        });
    } else {
      const userIdMatch = facebookLink.match(/profile\.php\?id=(\d+)/);

      if (userIdMatch) {
        const userId = userIdMatch[1];
        const apiUrl = `https://fbuid.mktsoftware.net/api/v1/fbprofile?url=https://www.facebook.com/profile.php?id=${userId}`;

        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            setLoading(false);

            if (data.uid) {
              setFacebookLink(data.uid);
              showPopup('UID Obtained Successfully!');
            } else {
              showPopup('Error: UID not found or an API error occurred.');
            }
          })
          .catch((error) => {
            setLoading(false);
            showPopup('Error: ' + error.message);
          });
      } else {
        const profileUrlMatch = facebookLink.match(/facebook\.com\/(.*?)(?:\?|$)/);

        if (profileUrlMatch) {
          const profileUrl = `https://www.facebook.com/${profileUrlMatch[1]}`;
          const apiUrl = `https://fbuid.mktsoftware.net/api/v1/fbprofile?url=${encodeURIComponent(profileUrl)}`;

          fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
              setLoading(false);

              if (data.uid) {
                setFacebookLink(data.uid);
                showPopup('UID Obtained Successfully!');
              } else {
                showPopup('Error: UID not found or an API error occurred.');
              }
            })
            .catch((error) => {
              setLoading(false);
              showPopup('Error: ' + error.message);
            });
        } else {
          setLoading(false);
          showPopup('Error: Invalid input format. Please enter a valid Facebook profile link.');
        }
      }
    }
  };

  const copyUid = () => {
    navigator.clipboard.writeText(facebookLink);
    showPopup('UID copied to clipboard: ' + facebookLink);
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.3/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');\n\n        body {\n            font-family: 'Montserrat', sans-serif;\n        }\n\n        .popup-container {\n            position: fixed;\n            bottom: 0;\n            left: 0;\n            width: 100%;\n            display: flex;\n            justify-content: flex-start;\n            align-items: flex-end;\n            padding: 10px;\n        }\n\n        .popup {\n            padding: 15px;\n            border-radius: 8px;\n            display: none;\n            animation: fadeInOut 5s ease-in-out;\n        }\n\n        .popup-success {\n            background-color: #4CAF50;\n            color: white;\n        }\n\n        .popup-error {\n            background-color: #FF6347;\n            color: white;\n        }\n\n        @keyframes fadeInOut {\n            0%, 100% {\n                opacity: 0;\n            }\n            10%, 90% {\n                opacity: 1;\n            }\n        }\n        .reset-button {\n            cursor: pointer;\n        }\n        .custom-button {\n            display: inline-block;\n            padding: 10px 20px;\n            font-size: 16px;\n            font-weight: bold;\n            text-align: center;\n            text-decoration: none;\n            cursor: pointer;\n            border-radius: 8px;\n            transition: background-color 0.3s;\n        }\n    "
        }}
      />
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Facebook UID Tool</h2>

          <div className="mb-4">
            <label htmlFor="facebookLink" className="block text-sm font-medium text-gray-600 mb-2">
              Facebook Profile Link
            </label>
            <div className="relative" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <input
                type="text"
                id="facebookLink"
                className="w-full p-2 border rounded-md"
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
                placeholder="Enter Facebook profile link"
              />
              <span style={{ marginTop: '3px' }} className="absolute right-2 top-2 cursor-pointer" onClick={copyUid}>
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"> <path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z" /></svg>
              </span>
            </div>
            {!facebookLink && (
              <div className="text-red-500 text-sm mb-2">Hãy nhập link Facebook</div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={getUid}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get UID'}
            </button>
          </div>

          {popupVisible && (
            <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-md mb-4">{popupMessage}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
