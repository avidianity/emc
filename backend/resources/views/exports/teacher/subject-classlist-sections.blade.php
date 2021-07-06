<table>
    <tbody>
        <tr>
            <th>Subject Code: {{ $subject->code }}</th>
        </tr>
        <tr>
            <th>Subject Description: {{ $subject->description }}</th>
        </tr>
        <tr>
            <th>Course: {{ $subject->course->code }}@if($subject->major) Major in {{ $subject->major->name }} @endif</th>
        </tr>
        <tr />
        @foreach($data as $section => $students)
            <tr>
                <th>Section: {{ $section }}</th>
            </tr>
            <tr>
                <th>ID Number</th>
                <th>Name</th>
                <th>Gender</th>
            </tr>
            @foreach ($students as $student)
                <tr>
                    <td>{{ $student->uuid }}</td>
                    <td>{{ $student->full_name }}</td>
                    <td>{{ $student->gender }}</td>
                </tr>
            @endforeach
        @endforeach
        <tr />
        <tr />
    </tbody>
</table>
