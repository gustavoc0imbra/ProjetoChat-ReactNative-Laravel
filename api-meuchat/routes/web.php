<?php

use App\Http\Controllers\MessagesController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/chat', [MessagesController::class, 'newMessage'])->withoutMiddleware('auth');
