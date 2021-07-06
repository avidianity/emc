<table>
    <thead>
        <tr>
            <th>Course: {{ $subject->course->code }}@if($subject->major) Major in {{ $subject->major->name }} @endif</th>
        </tr>
        <tr />
        <tr>
            <th>ID Number</th>
            <th>Name</th>
            <th>Section</th>
        </tr>
        <tr />
    </thead>
    <tbody>
        @foreach ($students as $student)
            <tr>
                <td>{{ $student->uuid }}</td>
                <td>{{ $student->full_name }}</td>
                <td>{{ \Illuminate\Support\Arr::first($student->sections, function($section) {
                    return $section->year->current;
                }, new \App\Models\Section(['name' => '']))->name }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
