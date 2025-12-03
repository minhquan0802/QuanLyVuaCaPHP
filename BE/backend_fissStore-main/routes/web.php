<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('api-docs');
});

Route::get('/api-docs', function () {
    return view('api-docs');
});
