<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->all();

        /**
         * @var User
         */
        $user = User::where('role', ucfirst($data['role']))
            ->whereEmail($data['email'])
            ->orWhere('uuid', $data['email'])
            ->first();

        if (!$user) {
            return response(['message' => 'User does not exist.'], 404);
        }

        if (!$user->active) {
            return response(['message' => 'Account is currently disabled, please try again later.']);
        }

        if (!Hash::check($data['password'], $user->password)) {
            return response(['message' => 'Password is incorrect.'], 403);
        }

        $token = $user->createToken(Str::random());

        return [
            'user' => $user,
            'token' => $token->plainTextToken,
        ];
    }

    public function changePassword(Request $request)
    {
        $data = $request->all();
        $user = $request->user();

        if (!Hash::check($data['old_password'], $user->password)) {
            return response(['message' => 'Password is incorrect.'], 403);
        }

        $user->update(['password' => $data['new_password']]);

        return response('', 204);
    }
}
