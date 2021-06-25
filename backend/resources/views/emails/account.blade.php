@component('mail::message')
# Hi {{ $user->first_name }}.

Here are your account credentials<br />
Account Number: <b>{{ $user->uuid }}</b><br />
<p id="password">Password: <b>{{ $user->password }}</b></p>

Please use these crendentials to login to the system.

Thanks,<br />
{{ isset($name) ? $name : config('app.name') }}
@endcomponent
