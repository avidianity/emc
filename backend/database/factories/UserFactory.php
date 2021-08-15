<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'uuid' => $this->faker->uuid,
            'first_name' => $this->faker->firstNameMale,
            'last_name' => $this->faker->lastName,
            'role' => 'Admin',
            'email' => 'admin@gmail.com',
            'number' => '09123456789',
            'active' => true,
            'password' => Hash::make('admin'),
        ];
    }
}
