import { create } from "zustand";
import { Chat, ChatMsg, User } from "../models";

type State = {
  chats: Chat[];
  createChat: (chat: Chat) => void;
  addUserToChat: (chatId: number, users: any) => void;
  deleteChat: (chatId: number) => void;
  createMessage: (message: ChatMsg, chatId: number) => void;
  setChats: (chats: Chat[]) => void;
};

const useChatStore = create<State>((set) => ({
  chats: [],
  createChat: (chat) =>
    set((state) => ({ ...state, chats: [chat, ...state.chats] })),
  deleteChat: (chatId) =>
    set((state) => ({
      ...state,
      chats: state.chats.filter((c) => c.id !== chatId),
    })),
  createMessage: (message, chatId) =>
    set((state) => ({
      ...state,
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat,
      ),
    })),
  addUserToChat: (chatId, users) =>
    set((state) => ({
      ...state,
      chats: state.chats.map((chat) =>
        chat.id == chatId ? { ...chat, users } : chat,
      ),
    })),
  setChats: (chats) => set((state) => ({ ...state, chats })),
}));

export default useChatStore;
