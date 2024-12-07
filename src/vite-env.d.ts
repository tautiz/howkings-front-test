/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FEATURE_ALLOW_USER_REGISTRATION: string
  readonly VITE_FEATURE_ENABLE_SEARCH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}