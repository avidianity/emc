<?php

namespace App\Models;

use App\Jobs\SendMail;
use App\Mail\AccountCreated;
use App\Mail\Admission;
use App\Models\Admission as ModelsAdmission;
use App\Notifications\PasswordChanged;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    const PAYMENT_STATUSES = ['Not Paid', 'Fully Paid', 'Partially Paid'];

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
        'allowed_units',
        'payment_status',
    ];

    protected $casts = [
        'birthday' => 'datetime',
        'active' => 'boolean',
        'enrolled' => 'boolean',
    ];

    protected $appends = [
        'enrolled',
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
                $password = $user->password;
                $user->notify(new PasswordChanged($password));
                $user->password = Hash::make($password);
                Log::create([
                    'payload' => $user,
                    'message' => 'User has updated their password.',
                ]);
            }
        });

        static::deleting(function (self $user) {
            $user->admissions->each(function (ModelsAdmission $admission) {
                $admission->delete();
            });

            $user->grades->each(function (Grade $grade) {
                $grade->delete();
            });

            $user->schedules->each(function (Schedule $schedule) {
                $schedule->delete();
            });

            $user->subjects()->detach();
        });
    }

    public function getEnrolledAttribute()
    {
        return $this->subjects()->count() > 0;
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
        return $this->hasMany(Grade::class, 'student_id');
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
