import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload.content;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.number;
      state.loading = false;
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setTasks, setCurrentTask, setLoading, setError } = taskSlice.actions;
export default taskSlice.reducer;
