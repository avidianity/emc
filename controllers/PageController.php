<?php

namespace Controllers;

class PageController extends Controller
{
	public function home()
	{
		return view('home');
	}

	public function login()
	{
		if (session()->has('user')) {
			return redirect('/dashboard');
		}
		return view('login');
	}

	public function forgotPassword()
	{
		if (session()->has('user')) {
			return redirect('/dashboard');
		}
		return view('forgot-password');
	}

	public function dashboard()
	{
		return view('dashboard.index');
	}

	public function changePassword()
	{
		return view('dashboard.change-password');
	}

	public function emails()
	{
		return view('dashboard.emails');
	}
}
