<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function index()
    {
        
            $profile = Auth::user();
            return response()->json([
                'profile'    => $profile,
            ], 200);
        
    }

}