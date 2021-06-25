<?php

namespace App\Http\Controllers;

use App\Jobs\SendMail;
use App\Mail\Admission;
use App\Models\Log;
use App\Models\Mail;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')
            ->except('index');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        /**
         * @var User
         */
        $user = $request->user('sanctum');

        $builder = User::with([
            'admissions.course.majors',
            'admissions.year',
            'admissions.major',
        ])
            ->withCount('subjects');

        if ($user && $user->role === 'Teacher') {
            $user->load('schedules.subject');
            /**
             * @var \Illuminate\Database\Eloquent\Collection<mixed, int>
             */
            $subjects = $user->schedules->map(function (Schedule $schedule) {
                return $schedule->subject->id;
            });

            $builder = $builder->whereHas('subjects', function (Builder $builder) use ($subjects) {
                return $builder->whereIn('subject_id', $subjects);
            });
        }

        return $builder->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'uuid' => ['required', 'string'],
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'middle_name' => ['nullable', 'string'],
            'gender' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'place_of_birth' => ['nullable', 'string'],
            'birthday' => ['required', 'date'],
            'role' => ['required', 'string'],
            'email' => ['required', 'string'],
            'number' => ['required', 'string'],
            'active' => ['required', 'boolean'],
            'fathers_name' => ['nullable', 'string'],
            'mothers_name' => ['nullable', 'string'],
            'fathers_occupation' => ['nullable', 'string'],
            'mothers_occupation' => ['nullable', 'string'],
            'allowed_units' => ['nullable', 'numeric'],
            'force' => ['required', 'boolean'],
        ]);

        if (!$data['force']) {
            if (
                User::whereFirstName($data['first_name'])
                ->whereLastName($data['last_name'])
                ->whereEmail($data['email'])
                ->whereRole($data['role'])
                ->count() > 0
            ) {
                return response(['message' => 'Data is already existing. Please save again to confirm.'], 409);
            }
        }

        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has created a user.', $user->role),
        ]);

        return User::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        $user->load([
            'subjects',
            'admissions.year',
            'admissions.course',
            'admissions.major',
        ]);
        return $user;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'uuid' => ['nullable', 'string'],
            'first_name' => ['nullable', 'string'],
            'last_name' => ['nullable', 'string'],
            'middle_name' => ['nullable', 'string'],
            'gender' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'place_of_birth' => ['nullable', 'string'],
            'birthday' => ['nullable', 'date'],
            'role' => ['nullable', 'string'],
            'email' => ['nullable', 'string'],
            'numeric' => ['nullable', 'string'],
            'active' => ['nullable', 'boolean'],
            'password' => ['nullable', 'string'],
            'fathers_name' => ['nullable', 'string'],
            'mothers_name' => ['nullable', 'string'],
            'fathers_occupation' => ['nullable', 'string'],
            'mothers_occupation' => ['nullable', 'string'],
            'allowed_units' => ['nullable', 'numeric'],
        ]);

        $isPreviouslyInactive = $user->active === false;

        $user->update($data);

        if ($user->role === 'Student' && $user->active && $isPreviouslyInactive) {
            $student = $user;

            $admission = $student->admissions()
                ->whereHas('year', function (Builder $builder) {
                    return $builder->where('current', true);
                })
                ->first();

            if ($admission) {
                $password = Str::random(5);

                $student->update(['password' => $password]);

                $recipes = [$student, $request->user(), $admission, $password];

                $mail = Mail::create([
                    'uuid' => $student->uuid,
                    'to' => $student->email,
                    'subject' => 'Student Admission',
                    'status' => 'Pending',
                    'body' => (new Admission(...$recipes))->render(),
                ]);

                SendMail::dispatch($mail, $recipes, Admission::class);

                $user = $request->user();

                Log::create([
                    'payload' => $user,
                    'message' => sprintf('%s has confirmed a student.', $user->role),
                ]);
            }
        }

        return $user;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, User $user)
    {
        $user->delete();

        $user = $request->user();

        Log::create([
            'payload' => $user,
            'message' => sprintf('%s has deleted a user.', $user->role),
        ]);

        return response('', 204);
    }

    public function change(Request $request)
    {
        $user = $request->user();

        $data = $request->all();

        if (!Hash::check($data['password'], $user->password)) {
            return response(['message' => 'Password is incorrect.'], 403);
        }

        User::findOrFail($data['user_id'])->update(['password' => $data['new_password']]);

        return response('', 204);
    }
}
