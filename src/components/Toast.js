import { App } from 'antd';

let apis = null;

export function ToastBinder() {
  apis = App.useApp();
  return null;
}

const toast = {
  success: (content, opts) => apis?.message?.success?.(content, opts),
  error: (content, opts) => apis?.message?.error?.(content, opts),
  info: (content, opts) => apis?.message?.info?.(content, opts),
  warning: (content, opts) => apis?.message?.warning?.(content, opts),
  notify: (opts) => apis?.notification?.open?.(opts),
  confirm: (opts) => apis?.modal?.confirm?.(opts),
};

export default toast;
