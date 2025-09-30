<?php

use Laravel\Sanctum\Sanctum;

return [

    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Liste des domaines qui recevront les cookies de session pour les SPA.
    | Typiquement : localhost, ports de dev, et tes domaines de prod.
    |
    */

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', implode(',', [
        'localhost',
        'localhost:3000',
        'localhost:5173', // port Vite
        'localhost:5174', // port Vite
        'localhost:5175', // port Vite
        '127.0.0.1',
        '127.0.0.1:8000',
        '::1',
        Sanctum::currentApplicationUrlWithPort(),
    ]))),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    |
    | Le guard utilisé pour l'authentification SPA.
    |
    */

    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | Durée de validité des tokens. null = infini.
    |
    */

    'expiration' => null,

    /*
    |--------------------------------------------------------------------------
    | Token Prefix
    |--------------------------------------------------------------------------
    |
    | Préfixe utilisé pour les tokens si nécessaire.
    |
    */

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware
    |--------------------------------------------------------------------------
    |
    | Middleware utilisés par Sanctum pour la session SPA.
    |
    */

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],

];
