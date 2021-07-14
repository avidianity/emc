<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
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
            ->where(function (Builder $builder) use ($data) {
                return $builder->where('email', $data['email'])
                    ->orWhere('uuid', $data['email']);
            })
            ->first();

        if (!$user) {
            return response(['message' => 'User does not exist.'], 404);
        }

        if (!$user->active && $user->role !== 'Student') {
            return response(['message' => 'Account is currently disabled, please try again later.']);
        }

        if (!Hash::check($data['password'], $user->password)) {
            return response(['message' => 'Password is incorrect.'], 403);
        }

        $token = $user->createToken(Str::random());

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has logged in.', $user->role),
        ]);

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

    public function admissions(Request $request)
    {
        /**
         * @var \App\Models\User
         */
        $user = $request->user();

        return $user->admissions()
            ->with([
                'year',
                'student.grades.subject',
                'student.grades.teacher',
                'student.subjects',
                'student.previousSubjects',
            ])
            ->get();
    }

    public function check(Request $request)
    {
        return response($request->user());
    }

    public function profile(Request $request)
    {
        /**
         * @var \App\Models\User
         */
        $user = $request->user();

        $user->update($request->all());

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has updated their profile.', $user->role),
        ]);

        return $user;
    }
}
