import { SuccessToast, WarningToast, DangerToast } from "./Notification";
import store from "../store.js";
import { useState, useEffect } from "react";

export default function NotificationArea() {
  const [messages, setMessages] = useState(store.getMessages());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setMessages([...store.getMessages()]);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (messages.length > 0) {
        store.removeMessage();
        setMessages([...store.getMessages()]);
      }
    }, 3000);
  }, [messages]);

  return (
    <div className="fixed bottom-0 mb-12 w-full items-center z-50">
      {messages.map((message, index) => {
        switch (message.type) {
          case "Success":
            return <SuccessToast key={index} message={message.content} />;
          case "Warning":
            return <WarningToast key={index} message={message.content} />;
          case "Danger":
            return <DangerToast key={index} message={message.content} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
