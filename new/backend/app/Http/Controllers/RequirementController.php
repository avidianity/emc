<?php

namespace App\Http\Controllers;

use App\Models\Requirement;
use Illuminate\Http\Request;

class RequirementController extends Controller
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
        return Requirement::all();
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
            'name' => ['required', 'string'],
        ]);

        return Requirement::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Requirement  $requirement
     * @return \Illuminate\Http\Response
     */
    public function show(Requirement $requirement)
    {
        return $requirement;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Requirement  $requirement
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Requirement $requirement)
    {
        $data = $request->validate([
            'name' => ['nullable', 'string'],
        ]);

        $requirement->update($data);

        return $requirement;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Requirement  $requirement
     * @return \Illuminate\Http\Response
     */
    public function destroy(Requirement $requirement)
    {
        $requirement->delete();

        return response('', 204);
    }
}
