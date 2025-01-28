type ToastType = 'success' | 'error' | 'info';

export const showToast = (message: string, type: ToastType = 'error') => {
  window.dispatchEvent(
    new CustomEvent('app:show-toast', {
      detail: { message, type }
    })
  );
};
