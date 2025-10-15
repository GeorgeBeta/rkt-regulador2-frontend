/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly PUBLIC_IS_MOCK: string;
    readonly PUBLIC_USER_POOL_ID: string;
    readonly PUBLIC_USER_POOL_CLIENT_ID: string;
    readonly PUBLIC_IDENTITY_POOL_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare namespace App {
    interface Locals {
        user?: {
            email: string;
            name:string;
        }
    }
}
