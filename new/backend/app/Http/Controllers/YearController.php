<?php

namespace App\Http\Controllers;

use App\Models\Year;
use Illuminate\Http\Request;

class YearController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')
            ->except('index');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Year::latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'start' => ['required', 'date_format:Y'],
            'end' => ['required', 'date_format:Y'],
            'semester_start' => ['required', 'date'],
            'semester_end' => ['required', 'date'],
            'current' => ['nullable', 'boolean'],
        ]);

        if (!isset($data['current'])) {
            $data['current'] = Year::count() === 0;
        } else {
            if (Year::count() === 0) {
                $data['current'] = true;
            }
        }

        $year = Year::create($data);

        if ($year->current) {
            Year::where('id', '!=', $year->id)
                ->update(['current' => false]);
        }

        return $year;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Year  $year
     * @return \Illuminate\Http\Response
     */
    public function show(Year $year)
    {
        return $year;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Year  $year
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Year $year)
    {
        $data = $request->validate([
            'start' => ['nullable', 'date_format:Y'],
            'end' => ['nullable', 'date_format:Y'],
            'semester_start' => ['nullable', 'date'],
            'semester_end' => ['nullable', 'date'],
            'current' => ['nullable', 'boolean'],
        ]);

        if (Year::count() === 1) {
            $data['current'] = true;
        }

        $year->update($data);

        if ($year->current) {
            Year::where('id', '!=', $year->id)
                ->update(['current' => false]);
        }

        return $year;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Year  $year
     * @return \Illuminate\Http\Response
     */
    public function destroy(Year $year)
    {
        $year->delete();

        return response('', 204);
    }
}
