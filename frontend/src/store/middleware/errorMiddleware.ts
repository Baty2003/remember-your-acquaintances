import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from 'redux';
import { notification } from 'antd';

interface ErrorPayload {
  status?: number;
  data?: {
    message?: string;
    error?: string;
  };
}

export const errorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as ErrorPayload;
    
    // Skip 401 errors (handled separately)
    if (payload?.status === 401) {
      return next(action);
    }

    // Get error message
    const message = payload?.data?.message || payload?.data?.error || 'Произошла ошибка';
    
    // Show notification
    notification.error({
      message: 'Ошибка',
      description: message,
      placement: 'topRight',
      duration: 4,
    });
  }

  return next(action);
};
