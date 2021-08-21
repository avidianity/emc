@component('mail::message')
# Hi {{ $student->first_name }}.

<p>Successfully Registered! Please settle your payment to enroll the subjects. Partially paid minimum of “500” pesos if fully paid please pay the stated amount of “10,000” pesos</p>

<p>Course: {{ $admission->course->code }} - {{ $admission->level }} Year of {{ $admission->term }}.</p>

<b>Here is your user account credentials</b>
<p>Account No.: {{ $student->uuid }}
<p id="password">Password: {{ $student->password }}</p>
<br />
<p>Please use these credentials to login to the system.</p>

Thanks,<br />
{{ config('app.name') }}
@endcomponent
