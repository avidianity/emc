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

	public function studentIncrement()
	{
		return view('students.increment');
	}

	public function profile()
	{
		return view('dashboard.profile');
	}

	public function dashboard()
	{
		if (!session()->has('user')) {
			return redirect('/login');
		}

		return view('dashboard.index');
	}

	public function registrationSlip()
	{
		return view('dashboard.registration-slip');
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
