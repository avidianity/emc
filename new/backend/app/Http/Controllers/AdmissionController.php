<?php

namespace App\Http\Controllers;

use App\Jobs\SendMail;
use App\Mail\Admission as MailAdmission;
use App\Models\Admission;
use App\Models\Mail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Admission::with('student', 'course')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->all();

        $password = Str::random(5);

        $data['student']['role'] = 'Student';
        $data['student']['active'] = false;
        $data['student']['password'] = $password;

        $student = User::create($data['student']);

        $admission = $student->admissions()->create($data);

        $recipes = [$student, $request->user(), $admission, $password];

        $mail = Mail::create([
            'uuid' => $student->uuid,
            'to' => $student->email,
            'subject' => 'Student Admission',
            'status' => 'Pending',
            'body' => (new MailAdmission(...$recipes))->render(),
        ]);

        SendMail::dispatch($mail, $recipes, MailAdmission::class);

        return $admission;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Admission  $admission
     * @return \Illuminate\Http\Response
     */
    public function show(Admission $admission)
    {
        return $admission;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Admission  $admission
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Admission $admission)
    {
        $admission->update($request->all());

        return $admission;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Admission  $admission
     * @return \Illuminate\Http\Response
     */
    public function destroy(Admission $admission)
    {
        $admission->delete();

        return response('', 204);
    }
}
