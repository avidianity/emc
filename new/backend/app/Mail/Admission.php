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

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($student, $registrar)
    {
        $this->student = $student;
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
