<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->string('first_name')->index();
            $table->string('last_name')->index();
            $table->string('middle_name')->index()->nullable();
            $table->string('gender')->index()->nullable();
            $table->string('address')->index()->nullable();
            $table->string('place_of_birth')->index()->nullable();
            $table->timestamp('birthday')->index()->nullable();
            $table->string('role')->index();
            $table->string('email')->index();
            $table->string('number')->index();
            $table->boolean('active')->index();
            $table->string('password');
            $table->string('fathers_name')->index()->nullable();
            $table->string('mothers_name')->index()->nullable();
            $table->string('fathers_occupation')->index()->nullable();
            $table->string('mothers_occupation')->index()->nullable();
            $table->unsignedInteger('allowed_units')->default(28);
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
        Schema::dropIfExists('users');
    }
}
