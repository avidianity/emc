<?php

namespace Controllers;

use Models\Mail;

class MailController extends Controller
{
	public function index()
	{
		return Mail::getAll();
	}
}
