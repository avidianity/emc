<table>
    <tbody>
        <tr>
            <th>Regular Students</th>
        </tr>
        <tr>
            <th>ID Number</th>
            <th>Name</th>
            <th>Section</th>
        </tr>
        @foreach ($regular as $student)
            <tr>
                <td>{{ $student->uuid }}</td>
                <td>{{ $student->full_name }}</td>
                <td>{{ \Illuminate\Support\Arr::first($student->sections, function($section) {
                    return $section->year->current;
                }, new \App\Models\Section(['name' => '']))->name }}</td>
            </tr>
        @endforeach
        <tr />
        <tr>
            <th>Irregular Students</th>
        </tr>
        <tr>
            <th>ID Number</th>
            <th>Name</th>
            <th>Section</th>
        </tr>
        @foreach ($irregular as $student)
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
