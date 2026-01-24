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
  activeRecipientId: string | null; // ID người đang chat cùng
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  error: string | null;

  isMiniChatOpen: boolean; // Kiểm soát việc mở chat nhỏ
}

const initialState: ChatState = {
  conversations: [],
  messages: [],
  activeRecipientId: null,
  isLoadingConversations: false,
  isLoadingMessages: false,
  isSending: false,
  error: null,
  isMiniChatOpen: false,
};

// --- THUNKS ---

// 1. Lấy danh sách hội thoại
export const getConversations = createAsyncThunk(
  "chat/getConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getConversations();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load conversations",
      );
    }
  },
);

// 2. Lấy chi tiết tin nhắn với 1 user
export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (recipientId: string, { rejectWithValue }) => {
    try {
      const response = await chatService.getMessages(recipientId);
      return { recipientId, messages: response.data.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load messages",
      );
    }
  },
);

// 3. Gửi tin nhắn
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (payload: SendMessagePayload, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(payload);
      return response.data.data;
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
    // Chọn người để chat (Dùng cho cả 3 trường hợp: Page, Mini, Modal)
    setActiveRecipient: (state, action: PayloadAction<string | null>) => {
      state.activeRecipientId = action.payload;
    },

    // Bật tắt Mini Chat
    toggleMiniChat: (state, action: PayloadAction<boolean>) => {
      state.isMiniChatOpen = action.payload;
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    addNewMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);

      const conversationIndex = state.conversations.findIndex(
        (c) =>
          (typeof c.lastMessage?.senderId === "string"
            ? c.lastMessage.senderId
            : c.lastMessage?.senderId?._id) === action.payload.recipientId ||
          c.participants.some((p) => p._id === action.payload.recipientId),
      );

      if (conversationIndex !== -1) {
        // Update last message logic
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Conversations
      .addCase(getConversations.pending, (state) => {
        state.isLoadingConversations = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.isLoadingConversations = false;
        state.conversations = action.payload;
      })

      // Get Messages
      .addCase(getMessages.pending, (state) => {
        state.isLoadingMessages = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        if (state.activeRecipientId === action.payload.recipientId) {
          state.messages = action.payload.messages;
        }
      })

      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        state.messages.push(action.payload);
      });
  },
});

export const {
  setActiveRecipient,
  toggleMiniChat,
  clearMessages,
  addNewMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
