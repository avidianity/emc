<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSemesterAndRegistrationToYearsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('years', function (Blueprint $table) {
            $table->string('semester')->index();
            $table->timestamp('registration_start')->nullable();
            $table->timestamp('registration_end')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('years', function (Blueprint $table) {
            $table->dropColumn('semester', 'registration_start', 'registration_end');
        });
    }
}
