<?php

namespace App\Http\Controllers;

use App\Events\NewMessageArrived;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;

class MessagesController extends Controller
{
    public function newMessage(Request $request) {
        broadcast(new NewMessageArrived($request->input('user'), $request->input('message'), Date::now('America/Sao_Paulo')->format('d/m/y H:i:s')))->toOthers();
    }
}
