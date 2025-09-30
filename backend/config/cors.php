<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => [
        'api/*', 
        'sanctum/csrf-cookie'
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',    // React dev (CRA)
        'http://127.0.0.1:3000',
        'http://localhost:5173',    // Vite dev
        'http://127.0.0.1:5173',
        'http://localhost:5174',    // Autre port Vite
        'http://127.0.0.1:5174',
        'http://localhost:5175',    // Encore un port Vite
        'http://127.0.0.1:5175',
        // 🚀 Mets ton domaine de prod ici, ex:
        // 'https://formationpro.com',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
