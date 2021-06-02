<?php

use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGradesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('grades', function (Blueprint $table) {
            $user = new User();
            $table->id();
            $table->foreignIdFor($user, 'student_id')->constrained($user->getTable());
            $table->foreignIdFor(new Subject())->constrained();
            $table->foreignIdFor($user, 'teacher_id')->constrained($user->getTable());
            $table->unsignedTinyInteger('grade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('grades');
    }
}
