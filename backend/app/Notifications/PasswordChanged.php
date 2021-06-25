<?php

namespace App\Notifications;

use App\Models\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordChanged extends Notification implements ShouldQueue
{
    use Queueable;

    public $password;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($password)
    {
        $this->password = $password;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $mail = (new MailMessage)
            ->subject('Password Change')
            ->greeting('Hello ' . $notifiable->first_name . '.')
            ->line('Your password has been changed.')
            ->line('New Password: ' . $this->password);

        Mail::create([
            'uuid' => $notifiable->uuid,
            'to' => $notifiable->email,
            'subject' => 'Password Change',
            'status' => 'Sent',
            'body' => $mail->render(),
        ]);

        return $mail;
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'password' => $this->password,
            'notifiable' => $notifiable,
        ];
    }
}
