@component('mail::message')
# Hi {{ $student->first_name }}.

<p>Successfully Registered! Please settle your payment to enroll the subjects. Partially paid minimum of “500” pesos if fully paid please pay the stated amount of “10,000” pesos</p>

<p>Reference Number: {{ $admission->reference_number }}</p>

@if($admission->major)
<p>Course: {{ $admission->course->code }} {{ $admission->major->name }} {{ $admission->level }} Year of {{ $admission->term }}.</p>
@else
<p>Course: {{ $admission->course->code }} - {{ $admission->level }} Year of {{ $admission->term }}.</p>
@endif

<br />
<p>Please use these credentials to login to the system.</p>

Thanks,<br />
{{ config('app.name') }}
@endcomponent
