interface Window {
  FB: {
    init: (params: {
      appId: string;
      cookie?: boolean;
      xfbml?: boolean;
      version: string;
    }) => void;
    login: (callback: (response: any) => void, params?: { scope: string }) => void;
    api: (
      path: string,
      callback: (response: any) => void
    ) => void;
  };
  fbAsyncInit: () => void;
}
