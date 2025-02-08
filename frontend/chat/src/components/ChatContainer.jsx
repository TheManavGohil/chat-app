import { useChatStore } from "../store/useChatStore"
import { ChatHeader } from "./ChatHeader"
import { MessageInput } from "./MessageInput"


export const ChatContainer = () =>{ 

    const { messages, selectedUser, isMessagesLoading, getMessages } = useChatStore()



    return<>
    <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />

        <p>messages....</p>

        <MessageInput />
    </div>
    </>
}

