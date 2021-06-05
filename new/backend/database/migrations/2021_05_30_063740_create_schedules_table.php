<?php

use App\Models\Course;
use App\Models\Subject;
use App\Models\User;
use App\Models\Year;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(new Course())->constrained();
            $table->foreignIdFor(new Subject())->constrained();
            $table->foreignIdFor(new User(), 'teacher_id')->constrained((new User())->getTable());
            $table->string('year');
            $table->text('payload');
            $table->foreignIdFor(new Year())->constrained();
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
        Schema::dropIfExists('schedules');
    }
}
