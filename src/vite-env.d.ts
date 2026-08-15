/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API Gateway base URL. The only backend host the frontend may know. */
  readonly VITE_API_URL: string
  /** 'cookie' (HttpOnly session cookie) or 'bearer' (in-memory token). */
  readonly VITE_AUTH_TRANSPORT?: 'cookie' | 'bearer'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
