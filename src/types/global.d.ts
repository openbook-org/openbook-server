namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    FIREBASE_client_email: string
    FIREBASE_private_key: string
    FIREBASE_project_id: string
    PORT: string
    INVITECODE_CIPHER_PASSWORD: string
    INVITECODE_CIPHER_BUFFER: string
    CLIENT_URL_INVITELINK: string
    CLIENT_URL: string
    STRIPE_KEY: string;
    WEBHOOK_KEY: string;
    EMAIL_HOST: string;
    EMAIL_PORT: string;
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
    EMAIL_FROM: string;
  }
}
