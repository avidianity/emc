<table>
    <tbody>
        @foreach ($data as $subject)
            <tr>
                <th>Subject: {{ $subject->description }}</th>
            </tr>
            <tr>
                <th>ID Number</th>
                <th>Name</th>
                <th>Section</th>
            </tr>
            @foreach($subject->students as $student)
                <tr>
                    <td>{{ $student->uuid }}</td>
                    <td>{{ $student->full_name }}</td>
                    <td>{{ \Illuminate\Support\Arr::first($student->sections, function($section) {
                        return $section->year->current;
                    }, new \App\Models\Section(['name' => '']))->name }}</td>
                </tr>
            @endforeach
            <tr />
            <tr />
        @endforeach
    </tbody>
</table>
