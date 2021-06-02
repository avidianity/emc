<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail as Mailer;
use Throwable;

class SendMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $recipes;
    public $mailable;
    public $mail;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($mail, $recipes, $mailable)
    {
        $this->mail = $mail;
        $this->recipes = $recipes;
        $this->mailable = $mailable;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            $mailable = $this->mailable;
            $mailable = new $mailable(...$this->recipes);
            Mailer::to($this->mail->to)
                ->send($mailable);

            $this->mail->update([
                'sent' => now(),
                'status' => 'Sent',
            ]);
        } catch (Throwable $exception) {
            $this->mail->update([
                'status' => 'Failed',
            ]);
            throw $exception;
        }
    }
}
