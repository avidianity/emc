<?php

namespace App\Models;

use App\Jobs\SendMail;
use App\Mail\AccountCreated;
use App\Notifications\PasswordChanged;
use Illuminate\Database\Eloquent\Builder;
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
        'regular',
    ];

    protected $hidden = [
        'password',
    ];

    protected static function booted()
    {
        static::creating(function (self $user) {
            $user->first_name = ucfirst($user->first_name);
            if ($user->middle_name) {
                $user->middle_name = ucfirst($user->middle_name);
            }
            $user->last_name = ucfirst($user->last_name);

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
                // $user->notify(new PasswordChanged($password));
                $user->password = Hash::make($password);
                Log::create([
                    'payload' => $user,
                    'message' => 'User has updated their password.',
                ]);
            }
        });

        static::deleting(function (self $user) {
            $user->admissions->delete();

            $user->grades->delete();

            $user->schedules->delete();

            $user->previousSubjects->delete();

            $user->subjects()->detach();
            $user->sections()->detach();
        });
    }

    public function getRegularAttribute(): bool
    {
        /**
         * @var \App\Models\Admission
         */
        $admission = $this->admissions()->whereHas('year', function (Builder $builder) {
            return $builder->where('current', true);
        })->first();

        if (!$admission) {
            /**
             * @var \App\Models\Admission
             */
            $admission = $this->admissions()->latest()->first();
        }

        if (!$admission) {
            return true;
        }

        return $admission->status === 'Regular';
    }

    public function previousSubjects()
    {
        return $this->hasMany(PreviousSubject::class, 'student_id');
    }

    public function getEnrolledAttribute(): bool
    {
        return $this->subjects()->count() > 0;
    }

    public function getFullNameAttribute()
    {
        return sprintf(
            '%s, %s %s',
            $this->last_name,
            $this->first_name,
            $this->middle_name ? $this->middle_name : '',
        );
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'student_subjects')->using(StudentSubject::class);
    }

    public function admissions()
    {
        return $this->hasMany(Admission::class, 'student_id');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class, 'student_id');
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'teacher_id');
    }

    public function sections()
    {
        return $this->belongsToMany(Section::class, 'student_sections')->using(StudentSection::class);
    }
}
