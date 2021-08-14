<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Admission extends Mailable
{
    use Queueable, SerializesModels;

    public $student;
    public $registrar;
    public $admission;
    public $password;

    /**
     * Create a new message instance.
     *
     * @param \App\Models\User $student
     * @param \App\Models\User $registrar
     * @param \App\Models\Admission $admission
     * @param string $password
     * @return void
     */
    public function __construct($student, $registrar, $admission, $password)
    {
        $this->student = $student;
        $this->student->password = $password;
        $this->password = $password;
        $this->admission = $admission;
        $this->registrar = $registrar;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.admission');
    }
}
