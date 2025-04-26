import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    // Prevent duplicate script loading
    if (!document.getElementById("google-translate-script")) {
      const addScript = document.createElement("script");
      addScript.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      addScript.id = "google-translate-script"; // Unique ID to prevent duplicates
      addScript.async = true;
      document.body.appendChild(addScript);
    }

    window.googleTranslateElementInit = () => {
      if (!document.getElementById("google_translate_element").innerHTML) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      }
    };
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
