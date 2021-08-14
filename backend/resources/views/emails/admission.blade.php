@component('mail::message')
# Hi {{ $student->first_name }}.

<p>You have been admitted to Course: {{ $admission->course->code }} - {{ $admission->level }} Year of {{ $admission->term }}.</p>

<b>Here is your user account credentials</b>
<p>Account No.: {{ $student->uuid }}</p>
@if($password)
    <p id="password">Password: {{ $password }}</p>
@endif
<br />
<p>Please use these credentials to login to the system.</p>
<p>Thank You</p>

{{ sprintf('%s, %s', $registrar->last_name, $registrar->first_name) }},<br />
Registrar
@endcomponent
