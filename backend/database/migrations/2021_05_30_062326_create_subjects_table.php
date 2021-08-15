<?php

use App\Models\Course;
use App\Models\Major;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('code')->index();
            $table->string('description')->index();
            $table->foreignIdFor(new Course())->constrained();
            $table->foreignIdFor(new Major())
                ->nullable()
                ->constrained();
            $table->string('level')->index();
            $table->string('term')->index();
            $table->string('units');
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
        Schema::dropIfExists('subjects');
    }
}
