import React, { useEffect } from 'react';

const CHATWOOT_BASE_URL = process.env.NEXT_PUBLIC_CHATWOOT ?? process.env.NEXT_PUBLIC_CHATWOOT_URL
const CHATWOOT_WEBSITE_TOKEN = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN


const ChatwootLoader = () => {
  useEffect(() => {


    window.chatwootSettings = {
      hideMessageBubble: false,
      showUnreadMessagesDialog: false, // Disable the unread message dialog
      position: "right", // This can be left or right
      locale: "es", // Language to be set
      useBrowserLanguage: false, // Set widget language from user's browser
      type: "expanded_bubble", // [standard, expanded_bubble]
      darkMode: "auto", // [light, auto]
      // #FF5722
      // #009CE0
    };
    
    const loadChatwoot = () => {
      
      const script = document.createElement('script');
      script.src = `${CHATWOOT_BASE_URL}/packs/js/sdk.js`;
      script.defer = true;
      script.async = true;

      script.onload = () => {
        if (window.chatwootSDK) {
          window.chatwootSDK.run({
            websiteToken: CHATWOOT_WEBSITE_TOKEN,
            baseUrl: CHATWOOT_BASE_URL,
          });
        }
      };

      document.body.appendChild(script);
    };

    loadChatwoot();

    // Clean up script when the component unmounts
    return () => {
      const existingScript = document.querySelector(`script[src="https://app.chatwoot.com/packs/js/sdk.js"]`);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return null;
};

export default ChatwootLoader;