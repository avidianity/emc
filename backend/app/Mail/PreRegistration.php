<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PreRegistration extends Mailable
{
    use Queueable;
    use SerializesModels;

    public $student;
    public $admission;
    public $password;

    /**
     * Create a new message instance.
     *
     * @param \App\Models\User      $student
     * @param \App\Models\Admission $admission
     * @param string                $password
     *
     * @return void
     */
    public function __construct($student, $admission, $password)
    {
        $this->student = $student;
        $this->student->password = $password;
        $this->admission = $admission;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.pre-registration');
    }
}
