@component('mail::message')
# Hi {{ $student->first_name }}.

<p>You have been admitted to Course: {{ $admission->course->code }} - {{ $admission->level }} Year of {{ $admission->term }}.</p>

<b>Here is your user account credentials</b>
<p>Account No.: {{ $student->uuid }}</p>
<p id="password">Password: {{ $student->password }}</p>
<br />
<p>Please use this credentials to login to the system.</p>
<p>Thank You</p>

{{ $registrar->first_name }},<br />
Registrar
@endcomponent
