import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { chatService, type SendMessagePayload } from "@/services/chatService";
import type { Conversation, Message } from "@/types/chat";

interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  activeRecipientId: string | null;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  error: string | null;
  isMiniChatOpen: boolean;
}

const initialState: ChatState = {
  conversations: [],
  messages: [],
  activeConversationId: null,
  activeRecipientId: null,
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSending: false,
  error: null,
  isMiniChatOpen: false,
};

const extractData = (response: any, key?: string) => {
  const raw = response?.data;
  if (key && raw?.data?.[key]) return raw.data[key];
  if (raw?.data) return raw.data;
  if (key && raw?.[key]) return raw[key];
  return raw;
};

// --- THUNKS ---

export const getConversations = createAsyncThunk(
  "chat/getConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getConversations();
      const data = extractData(response, "conversations");

      if (Array.isArray(data)) return data;
      if (data?.conversations && Array.isArray(data.conversations))
        return data.conversations;

      return [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load conversations",
      );
    }
  },
);

export const accessChat = createAsyncThunk(
  "chat/accessChat",
  async (recipientId: string, { dispatch, rejectWithValue }) => {
    try {
      const res = await chatService.createOrGetConversation(recipientId);
      const conversation = res.data?.data || res.data;

      if (!conversation || !conversation._id) {
        throw new Error("Invalid conversation data");
      }

      dispatch(getMessages(conversation._id));
      return { conversation, recipientId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to access chat",
      );
    }
  },
);

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await chatService.getMessages(conversationId);
      const data = extractData(response, "messages");

      if (Array.isArray(data)) return data;
      if (data?.messages && Array.isArray(data.messages)) return data.messages;

      return [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load messages",
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (payload: SendMessagePayload, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(payload);
      return response.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message",
      );
    }
  },
);

// --- SLICE ---

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetActiveChat: (state) => {
      state.activeConversationId = null;
      state.activeRecipientId = null;
      state.messages = [];
    },
    toggleMiniChat: (state, action: PayloadAction<boolean>) => {
      state.isMiniChatOpen = action.payload;
    },
    addNewMessage: (state, action: PayloadAction<Message>) => {
      const newMessage = action.payload;

      // Thêm tin nhắn nếu đang mở đúng hội thoại
      if (state.activeConversationId === newMessage.conversationId) {
        state.messages.push(newMessage);
      }

      // Cập nhật lastMessage và đẩy hội thoại lên đầu
      const index = state.conversations.findIndex(
        (c) => c._id === newMessage.conversationId,
      );
      if (index !== -1) {
        state.conversations[index].lastMessage = newMessage;
        const [moved] = state.conversations.splice(index, 1);
        state.conversations.unshift(moved);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Conversations
      .addCase(getConversations.pending, (state) => {
        state.isLoadingConversations = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.isLoadingConversations = false;
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.isLoadingConversations = false;
        state.error = action.payload as string;
      })

      // Access Chat
      .addCase(accessChat.fulfilled, (state, action) => {
        const { conversation, recipientId } = action.payload;
        state.activeConversationId = conversation._id;
        state.activeRecipientId = recipientId;

        const exists = state.conversations.find(
          (c) => c._id === conversation._id,
        );
        if (!exists) {
          state.conversations.unshift(conversation);
        }
      })

      // Get Messages
      .addCase(getMessages.pending, (state) => {
        state.isLoadingMessages = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state) => {
        state.isLoadingMessages = false;
      })

      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        state.messages.push(action.payload);

        const index = state.conversations.findIndex(
          (c) => c._id === state.activeConversationId,
        );
        if (index !== -1) {
          state.conversations[index].lastMessage = action.payload;
        }
      })
      .addCase(sendMessage.rejected, (state) => {
        state.isSending = false;
      });
  },
});

export const { resetActiveChat, toggleMiniChat, addNewMessage } =
  chatSlice.actions;
export default chatSlice.reducer;
