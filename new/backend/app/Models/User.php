<?php

namespace App\Models;

use App\Jobs\SendMail;
use App\Mail\AccountCreated;
use App\Mail\Admission;
use App\Models\Admission as ModelsAdmission;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'uuid',
        'first_name',
        'last_name',
        'middle_name',
        'gender',
        'address',
        'place_of_birth',
        'birthday',
        'role',
        'email',
        'number',
        'active',
        'password',
        'fathers_name',
        'mothers_name',
        'fathers_occupation',
        'mothers_occupation',
    ];

    protected $casts = [
        'birthday' => 'datetime',
        'active' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function (self $user) {
            if (empty(trim($user->password))) {
                $user->password = Str::random(5);
            }

            if ($user->role !== 'Student') {
                $mail = Mail::create([
                    'uuid' => $user->uuid,
                    'to' => $user->email,
                    'subject' => 'Account Creation',
                    'status' => 'Pending',
                    'body' => (new AccountCreated($user))->render(),
                ]);

                SendMail::dispatch($mail, [$user], AccountCreated::class);
            }

            $user->password = Hash::make($user->password);
        });

        static::updating(function (self $user) {
            if ($user->isDirty(['password'])) {
                $user->password = Hash::make($user->password);
            }
        });
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'student_subjects')->using(StudentSubject::class);
    }

    public function admissions()
    {
        return $this->hasMany(ModelsAdmission::class, 'student_id');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
