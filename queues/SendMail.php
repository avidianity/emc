<?php

namespace Queues;

use Exceptions\MailerException;
use Interfaces\Queue\Queueable;
use Libraries\Str;
use Libraries\View;
use Models\Mail;
use Throwable;

class SendMail implements Queueable
{
	public $to;
	public $view;
	public $subject;
	public $data;
	public $uuid;

	public function __construct($to, $view, $subject, $data)
	{
		$this->to = $to;
		$this->view = $view;
		$this->subject = $subject;
		$this->data = $data;
		$this->uuid = Str::random(10);

		Mail::create([
			'uuid' => $this->uuid,
			'to' => $to,
			'subject' => $subject,
			'status' => 'Pending',
			'sent' => null,
			'body' => $this->parseView(),
		]);
	}

	public function run()
	{
		mailer()->setSubject($this->subject)
			->setTo($this->to)
			->view($this->view, $this->data)
			->send();
	}

	public function parseView()
	{
		$path = $this->view;

		if (!View::exists($path)) {
			throw new MailerException($path . ' does not exist on views.');
		}

		$parsed = View::parse($path);

		foreach ($this->data as $key => $value) {
			$parsed = str_replace('$' . $key, $value, $parsed);
		}

		return $parsed;
	}

	public function __serialize(): array
	{
		return [
			'to' => $this->to,
			'view' => $this->view,
			'subject' => $this->subject,
			'uuid' => $this->uuid,
			'data' => json_encode($this->data),
		];
	}

	public function __unserialize(array $data): void
	{
		$this->to = $data['to'];
		$this->view = $data['view'];
		$this->subject = $data['subject'];
		$this->uuid = $data['uuid'];
		$this->data = (array)json_decode($data['data']);
	}

	public function report(Throwable $exception): void
	{
		//
	}

	public function boot()
	{
		//	
	}

	public function cleanup()
	{
		$pdo = Mail::getConnection();

		$query = sprintf('SELECT * FROM %s WHERE %s = :uuid LIMIT 1', Mail::table(), Mail::justifyKey('uuid'));

		$statement = $pdo->prepare($query);

		$statement->execute([':uuid' => $this->uuid]);

		if ($statement->rowCount() > 0) {
			$mail = Mail::from($statement->fetch());

			$mail->update(['status' => 'Sent', 'sent' => date('Y-m-d H:i:s')]);
		}
	}
}
