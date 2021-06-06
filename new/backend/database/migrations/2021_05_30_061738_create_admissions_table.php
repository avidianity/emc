<?php

use App\Models\Course;
use App\Models\User;
use App\Models\Year;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdmissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admissions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(new Course())->constrained();
            $table->string('level');
            $table->string('status');
            $table->string('term');
            $table->boolean('pre_registration')->default(false);
            $table->foreignIdFor(new User(), 'student_id')->constrained((new User())->getTable());
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
        Schema::dropIfExists('admissions');
    }
}
