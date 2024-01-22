export type AuthProviderType = {
    token: string | null;
    setToken: (newToken: string) => void;
}
